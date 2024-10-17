chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ totalReadingTime: 0, eyeFriendlyMode: false });
});
