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

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Configuração do servidor incompleta (Service Role Key ausente).' });
    }

    try {
      // 1. Criar usuário no Auth usando Admin API
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome, role }
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      // 2. Atualizar o perfil com as permissões específicas
      // O trigger handle_new_user deve criar o perfil base, mas garantimos aqui os dados completos
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          ...permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Se o update falhar (ex: trigger ainda não rodou), tentamos um upsert
      if (profileError) {
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
        if (upsertError) throw upsertError;
      }

      res.json({ success: true, user: authData.user });
    } catch (err: any) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: err.message || 'Erro ao criar usuário' });
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
