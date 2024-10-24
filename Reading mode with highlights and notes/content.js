let readingTimer;
let readingStartTime;

// Start tracking reading time
function startReadingTime() {
  readingStartTime = Date.now();
  readingTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - readingStartTime) / 1000); // in seconds
    chrome.runtime.sendMessage({ action: "updateReadingTime", time: 1 });
  }, 1000); // Update every second
}

// Stop tracking reading time
function stopReadingTime() {
  clearInterval(readingTimer);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enableReadingMode") {
    startReadingMode();
  } else if (request.action === "highlight") {
    highlightText();
  } else if (request.action === "resizeFont") {
    resizeFont(request.increase);
  }
  sendResponse({ success: true });
});

// Function to enable reading mode
function startReadingMode() {
  document.body.style.backgroundColor = "#f5f5f5"; // Light background for reading
  document.body.style.color = "#333"; // Dark text for contrast
  document.body.style.fontSize = "16px"; // Default font size
  startReadingTime(); // Start tracking reading time
}

// Function to highlight selected text
function highlightText() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    chrome.storage.sync.get("highlightColor", (data) => {
      span.style.backgroundColor = data.highlightColor || "yellow";
      span.classList.add("highlight"); // Add class for styling
      range.surroundContents(span);
    });
  }
}

// Function to resize font
function resizeFont(increase) {
  chrome.storage.sync.get("fontSize", (data) => {
    const fontSize = (data.fontSize || 16) + (increase ? 2 : -2);
    document.body.style.fontSize = fontSize + "px";
    chrome.storage.sync.set({ fontSize });
  });
}

// Add styles for highlighting
const style = document.createElement("style");
style.innerHTML = `
  span.highlight {
    background-color: yellow; /* Default highlight color */
  }
`;
document.head.appendChild(style);
