import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import SuperGameBoard from "./components/SuperGameBoard";
import "./styles/index.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <SuperGameBoard />
        </body>
      </html>
    </StoreProvider>
  );
}
