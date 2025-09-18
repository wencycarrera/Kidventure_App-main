export const isOffline = () => {
  // Basic check for offline mode
  return !navigator.onLine;
};
