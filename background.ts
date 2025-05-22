import { handleUnhandledRejection } from "./utils/errors";

export const runBackgroundTasks = async () => {
  handleUnhandledRejection();
};

// Only run background tasks if this file is being executed directly
if (require.main === module) {
  runBackgroundTasks();
}
