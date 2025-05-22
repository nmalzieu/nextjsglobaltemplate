import { handleUnhandledRejection } from "./utils/errors";
import { resolveFinishedQuestions } from "./utils/questions/resolution/resolution";
import { refreshPendingPayments } from "./utils/world/payment";
import { sendCurrentQuestionDailyNotifications } from "./utils/world/notifications/currentQuestionDaily";
import { payResolvedQuestions } from "./utils/questions/resolution/pay";

export const runBackgroundTasks = async () => {
  handleUnhandledRejection();
  refreshPendingPayments();
  resolveFinishedQuestions();
  sendCurrentQuestionDailyNotifications();
  payResolvedQuestions();
};

// Only run background tasks if this file is being executed directly
if (require.main === module) {
  runBackgroundTasks();
}
