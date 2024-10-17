function createNotification(title, message, url) {
  chrome.runtime.sendMessage({
    action: "createNotification",
    notification: { title, message, url },
  });
}

function trackNotification(notificationId) {
  chrome.runtime.sendMessage({ action: "trackNotification", notificationId });
}

// Example usage
createNotification(
  "Example Title",
  "This is an example notification",
  "https://example.com"
);
