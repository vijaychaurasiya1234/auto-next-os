import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </ToastProvider>
  );
}

export default App;