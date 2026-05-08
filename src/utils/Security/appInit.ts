let appProfileResolve;
let isAppProfileStarted = false;

export const appProfileReady = new Promise((resolve) => {
  appProfileResolve = resolve;
});

export const markAppProfileReady = () => {
  if (appProfileResolve) {
    appProfileResolve(); // 🔥 unlock all API calls
    appProfileResolve = null; // prevent re-resolving
  }
};

export const startAppProfile = () => {
  if (isAppProfileStarted) return false;
  isAppProfileStarted = true;
  return true;
};
