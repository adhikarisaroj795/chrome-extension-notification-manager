console.log("Professional Notification Manager Extension Loaded");

const MAX_NOTIFICATIONS = 500;
const IGNORED_SOURCES = ["example.com", "ads.com", "tracking.com"];

function shouldIgnoreSource(url) {
  return IGNORED_SOURCES.some((source) =>
    url.toLowerCase().includes(source.toLowerCase())
  );
}

async function storeNotification(notification) {
  try {
    await chrome.storage.local.get({ notifications: [] }, async (result) => {
      const updatedNotifications = [...result.notifications, notification];

      if (updatedNotifications.length > MAX_NOTIFICATIONS) {
        updatedNotifications.shift();
      }

      await chrome.storage.local.set({ notifications: updatedNotifications });
    });
  } catch (error) {
    console.error("Error storing notification:", error);
    throw error;
  }
}

function getUniqueNotificationId() {
  return Math.random().toString(36).substr(2, 9);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "trackNotification") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        action: "trackNotification",
        notificationId: request.notificationId,
      });
    });
    sendResponse({ success: true });
  }

  return false;
});

function handleNewNotification(notification) {
  if (!shouldIgnoreSource(notification.source.url)) {
    const uniqueId = getUniqueNotificationId();
    const timestamp = new Date().toISOString();

    const newNotification = {
      id: uniqueId,
      timestamp,
      message: notification.message || "No message",
      title: notification.title || "Unknown Title",
      source: {
        url: notification.contextMessage || "Unknown URL",
      },
      status: "new",
    };

    console.log("New notification:", newNotification);

    storeNotification(newNotification);

    chrome.runtime.sendMessage(
      {
        action: "newNotification",
        notification: newNotification,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to send message to popup:",
            chrome.runtime.lastError
          );
        }
      }
    );

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        action: "createNotification",
        notification: newNotification,
      });
    });
  } else {
    console.log(
      `Ignoring notification: ${notification.title}. Source: ${notification.source.url}`
    );
  }
}

chrome.notifications.onClicked.addListener((notificationId) => {
  try {
    console.log(`Notification clicked: ${notificationId}`);

    chrome.storage.local.get({ notifications: [] }, (result) => {
      const notifications = result.notifications || [];
      const clickedNotification = notifications.find(
        (notif) => notif.id === notificationId
      );

      if (clickedNotification) {
        console.log("Clicked notification details:", clickedNotification);
        handleNotificationClick(clickedNotification);
      } else {
        console.log("No notification found for this ID.");
      }
    });
  } catch (error) {
    console.error("Error in onClicked listener:", error);
  }
});

function handleNotificationClick(notification) {
  chrome.tabs.create({ url: notification.source.url }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("Failed to create tab:", chrome.runtime.lastError);
    } else {
      console.log(`Tab opened for notification: ${notification.message}`);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getNotifications") {
    chrome.storage.local.get({ notifications: [] }, (result) => {
      sendResponse(result.notifications);
    });
    return true;
  }

  if (request.action === "clearNotifications") {
    chrome.storage.local.set({ notifications: [] });
    sendResponse(true);
  }

  if (request.action === "updateNotificationStatus") {
    chrome.storage.local.get({ notifications: [] }, (result) => {
      const notifications = result.notifications || [];
      const index = notifications.findIndex(
        (n) => n.id === request.notificationId
      );
      if (index !== -1) {
        notifications[index].status = request.newStatus;
        chrome.storage.local.set({ notifications });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, message: "Notification not found" });
      }
    });
  }

  return false;
});

setInterval(() => {
  chrome.storage.local.get({ notifications: [] }, (result) => {
    const notifications = result.notifications || [];
    const oldestTimestamp = Math.min(
      ...notifications.map((n) => new Date(n.timestamp).getTime())
    );
    const cutoffDate = new Date(oldestTimestamp + 24 * 60 * 60 * 1000);

    const oldNotifications = notifications.filter(
      (n) => new Date(n.timestamp) < cutoffDate
    );
    if (oldNotifications.length > 0) {
      console.log(`Removing ${oldNotifications.length} old notifications`);
      chrome.storage.local.set({
        notifications: notifications.filter(
          (n) => !oldNotifications.includes(n)
        ),
      });
    }
  });
}, 3600000);
