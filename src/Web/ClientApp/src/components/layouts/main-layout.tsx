import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header";
import Footer from "../Footer";

export const MainLayout: React.FC = () => {
  return (
 
    <div className="min-h-screen flex flex-col bg-dark10 text-gray90">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
