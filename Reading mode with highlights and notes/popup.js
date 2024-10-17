let readingStartTime;

// When reading mode is enabled
document.getElementById("enable-mode").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: enableReadingMode,
    });
  });

  // Record the start time
  readingStartTime = Date.now();
  chrome.storage.sync.set({ readingStartTime });
});

// When reading mode is disabled
document.getElementById("disable-mode").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: disableReadingMode,
    });
  });

  // Calculate total time spent
  chrome.storage.sync.get(["readingStartTime", "totalReadingTime"], (data) => {
    const endTime = Date.now();
    const elapsed = endTime - data.readingStartTime;
    const totalTime = (data.totalReadingTime || 0) + elapsed;
    chrome.storage.sync.set({
      totalReadingTime: totalTime,
      readingStartTime: null,
    });

    // Display updated time
    updateReadingTimeDisplay();
  });
});

// Display the reading time in the popup
function updateReadingTimeDisplay() {
  chrome.storage.sync.get("totalReadingTime", (data) => {
    const totalTime = data.totalReadingTime || 0;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);

    document.getElementById(
      "reading-time"
    ).textContent = `${minutes} minutes and ${seconds} seconds`;
  });
}

// Initialize the reading time display when the popup is opened
document.addEventListener("DOMContentLoaded", () => {
  updateReadingTimeDisplay();
  initializeLightModeToggle();
});

// Function to enable reading mode
function enableReadingMode() {
  document.body.classList.add("reading-mode");
}

// Function to disable reading mode
function disableReadingMode() {
  document.body.classList.remove("reading-mode");
}

// Function to initialize light mode toggle
function initializeLightModeToggle() {
  chrome.storage.sync.get("eyeFriendlyMode", (data) => {
    const isEnabled = data.eyeFriendlyMode || false;
    document.getElementById("light-mode-toggle").checked = isEnabled;
    applyLightMode(isEnabled);
  });

  document
    .getElementById("light-mode-toggle")
    .addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      chrome.storage.sync.set({ eyeFriendlyMode: isChecked });
      applyLightMode(isChecked);
    });
}

// Apply or remove light mode
function applyLightMode(isEnabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: (enabled) => {
        if (enabled) {
          document.body.style.backgroundColor = "#f5f5dc"; // Softer background for eye comfort
          document.body.style.color = "#333"; // Softer text color
        } else {
          document.body.style.backgroundColor = ""; // Revert to normal
          document.body.style.color = "";
        }
      },
      args: [isEnabled],
    });
  });
}
