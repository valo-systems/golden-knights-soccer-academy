import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ShoppingBag,
  Images,
  CalendarDays,
  Newspaper,
  HandshakeIcon,
  Settings,
  LogOut,
  Menu,
  X,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/admin/auth";
import { useAdmin } from "@/admin/store";
import { ConfirmProvider, ToastProvider, useConfirm, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/prospects", label: "Enquiries", icon: UserPlus, end: false },
  { to: "/admin/members", label: "Members", icon: Users, end: false },
  { to: "/admin/matches", label: "Fixtures & results", icon: CalendarDays, end: false },
  { to: "/admin/news", label: "News", icon: Newspaper, end: false },
  { to: "/admin/orders", label: "Shop", icon: ShoppingBag, end: false },
  { to: "/admin/gallery", label: "Gallery", icon: Images, end: false },
  { to: "/admin/sponsors", label: "Sponsors", icon: HandshakeIcon, end: false },
];

export function AdminLayout() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminLayoutInner />
      </ConfirmProvider>
    </ToastProvider>
  );
}

function AdminLayoutInner() {
  const { isAuthed, email, signOut } = useAuth();
  const { reset } = useAdmin();
  const confirm = useConfirm();
  const toast = useToast();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-white">
      <Link to="/admin" className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <img src="/img/logo/gksa-white.png" alt="GKSA" className="h-9 w-auto" />
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide">GKSA Admin</p>
          <p className="text-[11px] text-white/50">Academy management</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <NavLink
          to="/admin/settings"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
            )
          }
        >
          <Settings className="size-4" /> Settings
        </NavLink>
        <button
          onClick={async () => {
            const ok = await confirm({
              title: "Reset demo data?",
              message: "This will wipe all current data and restore the original seed. This cannot be undone.",
              confirmLabel: "Reset",
              danger: true,
            });
            if (ok) { reset(); toast("Demo data reset.", "info"); }
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="size-4" /> Reset demo data
        </button>
        <div className="rounded-xl bg-white/5 px-4 py-3">
          <p className="truncate text-xs text-white/50">{email}</p>
          <button
            onClick={signOut}
            className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-canvas min-h-screen">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#09090b] px-4 py-3 text-white lg:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/img/logo/gksa-white.png" alt="GKSA" className="h-8 w-auto" />
          <span className="font-display text-sm font-bold uppercase">GKSA Admin</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}

      <main className="lg:pl-64">
        <div key={location.pathname} className="admin-rise mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
