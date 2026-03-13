import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './lib/supabase/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { supabase } from './lib/supabase/client';
import Login from './pages/Login';
import Dashboard from './pages/ejc/Dashboard';
import { JovemList } from './components/ejc/JovemList';
import { JovemForm } from './components/ejc/JovemForm';
import { JovemDetails } from './components/ejc/JovemDetails';
import { EJCLayout } from './components/ejc/EJCLayout';
import { RoleGuard } from './components/RoleGuard';
import { PermissionGuard } from './components/PermissionGuard';
import { UserList } from './pages/ejc/UserList';
import { UserForm } from './pages/ejc/UserForm';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected EJC Routes */}
          <Route 
            path="/ejc/*" 
            element={
              <ProtectedRoute>
                <EJCLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    
                    {/* Rotas de Jovens */}
                    <Route path="jovens" element={
                      <PermissionGuard permission="can_view_jovens">
                        <JovemList />
                      </PermissionGuard>
                    } />
                    <Route path="jovens/novo" element={
                      <PermissionGuard permission="can_edit_jovens">
                        <JovemForm />
                      </PermissionGuard>
                    } />
                    <Route path="jovens/editar/:id" element={
                      <PermissionGuard permission="can_edit_jovens">
                        <EditJovemWrapper />
                      </PermissionGuard>
                    } />
                    <Route path="jovens/visualizar/:id" element={
                      <PermissionGuard permission="can_view_jovens">
                        <JovemDetails />
                      </PermissionGuard>
                    } />

                    {/* Rotas de Usuários */}
                    <Route path="usuarios" element={
                      <PermissionGuard permission="can_create_users">
                        <UserList />
                      </PermissionGuard>
                    } />
                    <Route path="usuarios/novo" element={
                      <PermissionGuard permission="can_create_users">
                        <UserForm />
                      </PermissionGuard>
                    } />
                    <Route path="usuarios/editar/:id" element={
                      <PermissionGuard permission="can_manage_permissions">
                        <UserForm />
                      </PermissionGuard>
                    } />
                    
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </EJCLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function EditJovemWrapper() {
  const { id } = useParams<{ id: string }>();
  const [jovem, setJovem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      supabase.from('jovens').select('*').eq('id', id).single().then(({ data }) => {
        if (data && data.data_nascimento) {
          // Garante que a data esteja no formato YYYY-MM-DD para o input type="date"
          data.data_nascimento = data.data_nascimento.split('T')[0];
        }
        setJovem(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-stone-500 font-medium">Carregando dados do jovem...</p>
      </div>
    </div>
  );
  
  return <JovemForm initialData={jovem} isEditing={true} />;
}
