document.addEventListener("DOMContentLoaded", () => {
  const notificationsContainer = document.getElementById(
    "notifications-container"
  );
  const placeholder = document.getElementById("placeholder");

  // Function to fetch notifications from storage
  async function fetchNotifications() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getNotifications" }, resolve);
    });
  }

  // Function to render notifications
  async function renderNotifications(notifications) {
    try {
      // Clear existing notifications
      notificationsContainer.innerHTML = "";

      if (!notifications || notifications.length === 0) {
        const noNotificationsDiv = document.createElement("div");
        noNotificationsDiv.textContent = "No notifications yet.";
        noNotificationsDiv.style.textAlign = "center";
        noNotificationsDiv.style.padding = "20px";
        notificationsContainer.appendChild(noNotificationsDiv);
        return;
      }

      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();

      notifications.forEach((notification) => {
        const notificationDiv = document.createElement("div");
        notificationDiv.classList.add("notification");
        notificationDiv.setAttribute("role", "listitem");

        notificationDiv.innerHTML = `
            <strong>${notification.message}</strong>
            <div class="timestamp">${notification.timestamp}</div>
            <div>
              ${notification.source.title} - 
              <a href="${notification.source.url}" target="_blank" rel="noopener noreferrer">
                ${notification.source.url}
              </a>
            </div>
          `;

        fragment.appendChild(notificationDiv);
      });

      notificationsContainer.appendChild(fragment);

      // Add event listeners for notification clicks
      const notificationLinks = notificationsContainer.querySelectorAll("a");
      notificationLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          chrome.tabs.create({ url: link.href });
        });
      });
    } catch (error) {
      console.error("Error rendering notifications:", error);
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "An error occurred while loading notifications.";
      errorDiv.style.color = "red";
      notificationsContainer.appendChild(errorDiv);
    }
  }

  // Initial render
  fetchNotifications().then(renderNotifications);

  // Listen for real-time updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "newNotification") {
      fetchNotifications().then(renderNotifications);
    }
  });

  // Handle window resize for responsive layout
  window.addEventListener("resize", () => {
    const maxHeight = Math.min(window.innerHeight * 0.9, 600);
    notificationsContainer.style.maxHeight = `${maxHeight}px`;
    notificationsContainer.style.overflowY = "auto";
  });
});
