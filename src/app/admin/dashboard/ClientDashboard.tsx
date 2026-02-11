'use client';

import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  PanelsTopLeft,
  Store,
  ChefHat,
  SquareDashedBottom,
  DoorOpen,
  Wrench,
  Image as ImageIcon,
  LogOut,
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login');
  };

  // ✅ Content-only update: admin entry points aligned to the services/category system
  // ❗ Routing assumptions kept minimal:
  // - /admin/dashboard/services = CRUD for Firestore services collection
  // - /services = public overview page
  // - /c/[category] = public category pages (tv-stands, wall-panels, etc.)
  const sections = [
    {
      title: 'Manage Services',
      desc: 'Create, edit, and delete services (Firestore: services).',
      icon: <Wrench size={22} />,
      href: '/admin/dashboard/services',
    },
    {
      title: 'Preview Public Services',
      desc: 'View the /services overview page (categories + previews).',
      icon: <LayoutGrid size={22} />,
      href: '/services',
    },

    // Category quick-links (public)
    {
      title: 'TV Stands',
      desc: 'View public category: /c/tv-stands',
      icon: <PanelsTopLeft size={22} />,
      href: '/c/tv-stands',
    },
    {
      title: 'Wall Panels',
      desc: 'View public category: /c/wall-panels',
      icon: <SquareDashedBottom size={22} />,
      href: '/c/wall-panels',
    },
    {
      title: 'Wardrobes',
      desc: 'View public category: /c/wardrobes',
      icon: <Store  size={22} />,
      href: '/c/wardrobes',
    },
    {
      title: 'Kitchens',
      desc: 'View public category: /c/kitchens',
      icon: <ChefHat size={22} />,
      href: '/c/kitchens',
    },
    {
      title: 'Ceilings',
      desc: 'View public category: /c/ceilings',
      icon: <SquareDashedBottom size={22} />,
      href: '/c/ceilings',
    },
    {
      title: 'Doors',
      desc: 'View public category: /c/doors',
      icon: <DoorOpen size={22} />,
      href: '/c/doors',
    },

    // Optional: keep highlights only if your repo actually has it
    // If your new repo does NOT have highlights, delete this item (content-only).
    {
      title: 'Manage Highlights',
      desc: 'Update homepage hero image + home gallery tiles.',
      icon: <ImageIcon size={22} />,
      href: '/admin/dashboard/highlights',
    },
  ];

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground] px-6 py-12 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition text-sm font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Sections */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <button
            key={s.title}
            onClick={() => router.push(s.href)}
            className="p-6 rounded-2xl text-left border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-3 text-[--brand-secondary]">
              {s.icon}
              <h2 className="text-lg font-semibold text-[--foreground]">
                {s.title}
              </h2>
            </div>
            <p className="text-sm text-white/70">{s.desc}</p>
          </button>
        ))}
      </section>

      {/* Metrics (static placeholders — keep wiring unchanged) */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['TV Stands', '—'],
          ['Kitchens', '—'],
          ['Wardrobes', '—'],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="border border-white/10 bg-white/5 p-5 rounded-2xl text-center"
          >
            <div className="text-xs uppercase text-white/60 tracking-wide">
              {label}
            </div>
            <div className="text-3xl font-bold">{value}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
