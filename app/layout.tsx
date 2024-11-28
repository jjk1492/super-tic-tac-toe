import type { PropsWithChildren, ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import { ToastContainer } from "react-toastify";

type RootProps = {};

export default function RootLayout({ children }: PropsWithChildren<RootProps>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <ToastContainer />
        </body>
      </html>
    </StoreProvider>
  );
}
