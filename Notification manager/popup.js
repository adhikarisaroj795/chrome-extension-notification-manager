document.addEventListener("DOMContentLoaded", () => {
  const notificationList = document.getElementById("notification-list");
  const clearButton = document.getElementById("clear-notifications");

  // Load and display notifications
  function loadNotifications() {
    chrome.runtime.sendMessage(
      { action: "getNotifications" },
      (notifications) => {
        notificationList.innerHTML = ""; // Clear the list

        if (!notifications || notifications.length === 0) {
          notificationList.innerHTML = "<li>No notifications found.</li>";
        } else {
          notifications.forEach((notification) => {
            addNotificationToList(notification);
          });
        }
      }
    );
  }

  // Add a notification to the list
  function addNotificationToList(notification) {
    const notificationElement = document.createElement("li");
    notificationElement.className = "notification-item";
    notificationElement.innerHTML = `
      <strong>${notification.title}</strong><br>
      ${notification.message}<br>
      <a href="${notification.source.url}" target="_blank">Open</a>
    `;
    notificationList.prepend(notificationElement);
  }

  // Clear all notifications
  clearButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "clearNotifications" }, (response) => {
      if (response) {
        notificationList.innerHTML = "<li>No notifications found.</li>";
        alert("Notifications cleared successfully!");
      } else {
        alert("Failed to clear notifications.");
      }
    });
  });

  // Handle incoming new notifications
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "newNotification") {
      addNotificationToList(message.notification);
    }
  });

  // Initial load of notifications
  loadNotifications();
});
