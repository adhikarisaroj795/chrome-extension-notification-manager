chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    highlightColor: "yellow",
    fontSize: 16,
    notes: {},
    readingTime: 0,
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateReadingTime") {
    chrome.storage.sync.get("readingTime", (data) => {
      const newTime = (data.readingTime || 0) + request.time;
      chrome.storage.sync.set({ readingTime: newTime });
    });
  }
  sendResponse({ success: true });
});
