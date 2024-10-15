// content.js
function createNotification(title, message, url) {
  chrome.notifications.create(
    null,
    {
      title: title,
      message: message,
      iconUrl: "icon.png",
    },
    function (notificationId) {
      console.log(`Notification created: ${notificationId}`);
      chrome.runtime.sendMessage({
        action: "trackNotification",
        notificationId: notificationId,
        notification: {
          title: title,
          message: message,
          source: { url: url },
        },
      });
    }
  );
}

// Example usage
createNotification(
  "Example Title",
  "This is an example notification",
  "https://example.com"
);
