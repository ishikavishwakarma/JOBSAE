let appProfileResolve;
export const appProfileReady = new Promise((resolve) => {
  appProfileResolve = resolve;
});

export const markAppProfileReady = () => {
  if (appProfileResolve) {
    appProfileResolve(); // 🔥 unlock all API calls
    appProfileResolve = null; // prevent re-resolving
  }
};
