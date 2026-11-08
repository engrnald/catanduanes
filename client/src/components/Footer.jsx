import { useEffect, useState } from 'react';
import { useSyncVersion } from '../lib/sync.js';
import { Link, useLocation } from 'react-router-dom';
import TileStrip from './TileStrip.jsx';
import { api } from '../lib/api.js';
export default function Footer() {
  const [c, setC] = useState(null), { pathname } = useLocation();
  const ver = useSyncVersion();
  useEffect(() => { api('/credits').then(setC).catch(() => {}); }, [pathname, ver]);
  return (<footer className="no-print mt-16"><TileStrip className="h-10" />
    <div className="bg-ocean py-8 text-center text-foam"><p className="font-display text-2xl">Catanduanes</p><p className="mt-1 text-sm text-foam/70">The Happy Island · Tourism platform</p>
      <Link to="/credits" className="mt-4 inline-block rounded-full border border-white/30 px-5 py-2 text-sm hover:bg-white/10">Developed by <b>{c?.company || 'IslaTek'}</b></Link></div></footer>);
}
