import { Route, Routes } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Privacidade from '@/pages/Privacidade';

export const dataAccess = {
  application: { create: 'public', read: 'role:admin' },
};

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacidade" element={<Privacidade />} />
      </Route>
    </Routes>
  );
}
