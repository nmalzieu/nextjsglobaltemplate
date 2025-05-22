import { ComponentType } from "react";
import { TRPCProvider } from "./client";

export function withTRPC<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithTRPCWrapper(props: P) {
    return (
      <TRPCProvider>
        <WrappedComponent {...props} />
      </TRPCProvider>
    );
  };
} 