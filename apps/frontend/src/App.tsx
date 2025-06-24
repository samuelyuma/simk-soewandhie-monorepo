import { router } from "@lib/router";
import { RouterProvider } from "@tanstack/react-router";

import "./styles/globals.css";

import dotenv from "dotenv";

import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";

dotenv.config();

function App() {
  const auth = useAuth();

  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster />
    </>
  );
}

export default App;
