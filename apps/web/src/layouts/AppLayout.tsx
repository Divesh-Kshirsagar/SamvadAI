import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, List, Activity } from "lucide-react";

export default function AppLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Complaints", href: "/complaints", icon: List },
    { name: "Analytics", href: "/analytics", icon: Activity },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 w-60 flex-col border-r bg-background flex">
        <div className="flex items-center border-b px-6 h-14 shrink-0">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">SamvadAI</span>
          </Link>
        </div>
        <nav className="grid gap-1 px-4 py-4 font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Union Bank AI Console</h1>
        </header>
        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
