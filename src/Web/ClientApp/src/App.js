import React, { Component } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./AppRoutes";
import "./output.css";
import "./custom.css"
import { AuthProvider } from "./lib/auth";
import { Toaster } from "./components/ui/sonner";
const queryClient = new QueryClient();

export default class App extends Component {
  static displayName = App.name;
  render() {
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </QueryClientProvider>
      </>
    );
  }
}
