import { Route, Routes } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Home from '@/pages/Home';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/CollectionDetail';
import Essentials from '@/pages/Essentials';
import Sustainability from '@/pages/Sustainability';
import About from '@/pages/About';

export const dataAccess = {
  collection: { read: 'public' },
  piece: { read: 'public' },
  pillar: { read: 'public' },
  subscriber: { create: 'public', read: 'role:admin' },
};

export const collectionPolicy = {
  model: 'collection',
  unique: ['is_current'],
};

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/essentials" element={<Essentials />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
