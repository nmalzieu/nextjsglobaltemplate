import { error } from "./logging";
import axios from "axios";
import "../sentry.server.config";
import * as Sentry from "@sentry/nextjs";

export const handleUnhandledRejection = () => {
  process.on("unhandledRejection", (reason: unknown) => {
    if (reason instanceof Error) {
      Sentry.captureException(reason);
      let message = `unhandledRejection\nMessage: ${reason.message}\nStack: ${reason.stack}`;

      if (axios.isAxiosError(reason) && reason.config?.url) {
        message += `\nURL: ${reason.config.url}`;
      }

      error(message, reason);
    } else {
      Sentry.captureException(new Error(String(reason)), {
        data: "unhandledRejection",
      });

      error("unhandledRejection", new Error(String(reason)));
    }
  });
};
