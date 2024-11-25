import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import "./styles/index.css";
import SuperTicTacToe from "./components/SuperTicTacToe";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
