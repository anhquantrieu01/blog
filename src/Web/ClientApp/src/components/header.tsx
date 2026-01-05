import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useLogout } from "../features/auth/api/logout";
import { useCurrentUser } from "../features/auth/api/getCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { User, ShieldCheck, LogOut } from "lucide-react";
import { ROLES } from "../lib/authorization";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const logoutMutation = useLogout();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const qc = useQueryClient();
  console.log(user);
  const links = [
    { name: "Trang chủ", path: "/" },
    { name: "Bài viết", path: "/posts" },
    { name: "Về chúng tôi", path: "/about" },
  ];
  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        qc.clear();
        toast("Đã đăng xuất");
        navigate("/");
      },
      onError: () => {
        toast("Đăng xuất thất bại");
      },
    });
  };
  return (
    <header className="bg-dark10 text-gray90 border-b border-dark20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/favicon.png" alt="" className="size-6 " />
          <Link
            to="/"
            className="text-lg font-heading font-semibold text-yellow70 hover:text-yellow55 transition"
          >
            MyBlog
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-gray70 hover:text-yellow55 transition-colors ${
                location.pathname === link.path
                  ? "text-yellow60 font-semibold"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-white/10 hover:ring-white/30 transition">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {" "}
                    {user.fullName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-2xl bg-gradient-to-b 
        from-gray-900 via-gray-900/90 to-gray-900/80 
        border border-white/10 shadow-xl backdrop-blur-xl text-white"
              >
                <DropdownMenuGroup className="space-y-2 p-2">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="size-4 " />
                    <Link to="/profile" className="text-white">
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>
                  {user.roles &&
                    (user.roles.includes(ROLES.ADMIN) ||
                      user.roles.includes(ROLES.MANAGER)) && (
                      <>
                        
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <ShieldCheck className="size-4 " />
                          <Link to="/admin" className="text-white">
                            Bảng điều khiển
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="size-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-gray50  hover:text-yellow55 hover:border-yellow55"
              >
                <Link to="/auth/login" className="text-white">
                  Đăng nhập
                </Link>
              </Button>
              <Button className="bg-yellow55  hover:bg-yellow60 font-semibold">
                <Link to="/auth/register" className="text-dark10">
                  Đăng ký
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray80 hover:text-yellow55 transition"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay mờ */}
        <div
          className="absolute inset-0 bg-dark15/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sidebar panel */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-dark10 p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-heading font-semibold text-yellow70">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray80 hover:text-yellow55 transition"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mb-5">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-gray70 hover:text-yellow55 transition-colors ${
                  location.pathname === link.path
                    ? "text-yellow60 font-semibold"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link to="/profile" className="text-gray70 hover:text-yellow55">
                Trang cá nhân
              </Link>
            )}

            {user?.roles?.includes("ADMIN") && (
              <Link to="/admin" className="text-gray70 hover:text-yellow55">
                Trang quản trị
              </Link>
            )}
          </nav>
          {!user ? (
            <div className="mt-auto flex flex-col gap-3">
              <Button
                variant="outline"
                className="border-gray50 text-gray80 hover:text-yellow55 hover:border-yellow55"
                onClick={() => setIsOpen(false)}
              >
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button
                className="bg-yellow55 text-dark10 hover:bg-yellow60 font-semibold"
                onClick={() => setIsOpen(false)}
              >
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-3">
              <Button
                variant="outline"
                className="border-gray50 text-gray80 hover:text-yellow55 hover:border-yellow55"
                onClick={() => setIsOpen(false)}
              >
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
