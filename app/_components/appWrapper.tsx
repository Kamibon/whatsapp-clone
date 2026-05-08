"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../_redux/store";

function AppWrapper({ children }: {children: ReactNode}) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}

export default AppWrapper;
