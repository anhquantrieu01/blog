import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { Home, Folder, PanelLeft, User2 } from "lucide-react";
import { paths } from "../../config/paths";
import { ROLES, Authorization } from "../../lib/authorization";
import { useLogout } from "../../lib/auth";
import { cn } from "../../utils/cn";

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation: SideNavigationItem[] = [
    { name: "Dashboard", to: paths.admin.root.getHref(), icon: Home },
    { name: "Posts", to: paths.admin.posts.getHref(), icon: Folder },
    { name: "Users", to: paths.admin.users.getHref(), icon: User2 },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <Authorization
      allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}
      forbiddenFallback={<Navigate to="/not-found" replace />}
    >
      <div className="flex min-h-screen bg-gray-100">
        <aside className="hidden sm:flex sm:flex-col w-60 bg-black text-white border-r">
          <div className="flex h-16 items-center justify-center border-b px-4">
            <NavLink
              to={paths.home.getHref()}
              className="flex items-center gap-2"
            >
              <span className="font-semibold">Admin Panel</span>
            </NavLink>
          </div>
          <nav className="flex-1 flex flex-col gap-1 p-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white",
                    isActive && "bg-gray-900 text-white"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex sm:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative flex w-64 flex-col bg-black text-white p-4">
              <div className="flex h-16 items-center px-4 mb-4">
                <NavLink
                  to={paths.home.getHref()}
                  className="flex items-center gap-2"
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="font-semibold">Admin Panel</span>
                </NavLink>
              </div>
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white",
                        isActive && "bg-gray-900 text-white"
                      )
                    }
                    onClick={() => setDrawerOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 ">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 sm:px-6">
            <button
              className="sm:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setDrawerOpen(true)}
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                className="flex items-center p-2 rounded-full hover:bg-gray-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User2 className="w-6 h-6" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate(paths.admin.profile.getHref());
                      setUserMenuOpen(false);
                    }}
                  >
                    Your Profile
                  </button>
                  <div className="border-t" />
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => logout()}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
              <Outlet />
          </main>
        </div>
      </div>
    </Authorization>
  );
};
