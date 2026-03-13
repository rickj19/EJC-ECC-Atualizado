import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EJC System API is running' });
  });

  app.post('/api/admin/create-user', async (req, res) => {
    const { nome, email, password, role, permissions } = req.body;

    console.log(`[API] Request to create user: ${email}`);

    // Ensure we always return JSON
    res.setHeader('Content-Type', 'application/json');

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) {
      console.error('[API] Missing Supabase configuration');
      return res.status(500).json({ 
        success: false,
        error: 'Configuração do servidor incompleta (Supabase URL ou Service Role Key ausente).' 
      });
    }

    try {
      // 1. Criar usuário no Auth usando Admin API
      console.log('[API] Calling auth.admin.createUser...');
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { 
          nome, 
          role,
          ...permissions 
        }
      });

      if (authError) {
        console.error('[API] Auth creation error:', authError);
        return res.status(400).json({ 
          success: false,
          error: authError.message || 'Erro ao criar usuário no Auth.' 
        });
      }

      if (!authData?.user) {
        console.error('[API] No user data returned from Auth');
        return res.status(500).json({ 
          success: false,
          error: 'Usuário criado mas nenhum dado foi retornado.' 
        });
      }

      const userId = authData.user.id;
      console.log(`[API] Auth user created: ${userId}`);

      // 2. Garantir que o perfil existe e tem as permissões corretas
      console.log('[API] Upserting profile...');
      const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          nome,
          email,
          role,
          ...permissions,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        console.error('[API] Profile upsert error:', upsertError);
        // We don't necessarily want to fail the whole request if Auth succeeded but profile failed,
        // but for consistency we'll return an error so the admin knows something went wrong.
        return res.status(500).json({ 
          success: false,
          error: `Usuário criado no Auth, mas erro ao salvar perfil: ${upsertError.message}` 
        });
      }

      console.log(`[API] User ${email} created successfully`);
      return res.status(200).json({ 
        success: true, 
        user: authData.user 
      });

    } catch (err: any) {
      console.error('[API] Critical error in create-user:', err);
      return res.status(500).json({ 
        success: false,
        error: err.message || 'Erro interno do servidor ao criar usuário.' 
      });
    }
  });

  app.delete('/api/admin/delete-user/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`[API] Deleting user: ${id}`);

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Configuração do servidor incompleta.' });
    }

    try {
      // 1. Deletar do Auth (isso deve disparar o ON DELETE CASCADE na tabela profiles se configurado)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // 2. Garantir que o perfil foi removido (caso o cascade falhe ou não esteja configurado)
      await supabaseAdmin.from('profiles').delete().eq('id', id);

      res.json({ success: true });
    } catch (err: any) {
      console.error('[API] Error in delete-user:', err);
      res.status(500).json({ error: err.message || 'Erro ao excluir usuário' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
