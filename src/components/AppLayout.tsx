import { Outlet, NavLink } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 border-r bg-card p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-8">CoolTech</h2>

          <nav className="flex flex-col gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`
              }
            >
              Customers
            </NavLink>

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`
              }
            >
              Expenses
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNav />}
      </div>
    </div>
  );
};

export default AppLayout;