import React from "react";
import { Link } from "react-router-dom";
import { paths } from "../../config/paths";
import Head from "../seo/head";
import { FlickeringGrid } from "../../components/ui/flickering-grid";
type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head title={title} />
      <div className="relative min-h-screen overflow-hidden bg-gray-50">
        <FlickeringGrid
          className="absolute inset-0 z-0 w-full h-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />

        <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <div className="flex justify-center">
              <Link
                className="flex items-center text-white"
                to={paths.home.getHref()}
              >
                logo
              </Link>
            </div>
           
            <div >
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
