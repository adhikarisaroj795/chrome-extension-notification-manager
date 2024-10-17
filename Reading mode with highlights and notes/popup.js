// Initialize popup elements
document
  .getElementById("highlight-color")
  .addEventListener("input", (event) => {
    chrome.storage.sync.set({ highlightColor: event.target.value });
  });

document.getElementById("increase-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resizeFont", increase: true });
});

document.getElementById("decrease-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resizeFont", increase: false });
});

document.getElementById("add-note").addEventListener("click", () => {
  const noteInput = document.getElementById("note-input").value;
  if (noteInput) {
    addNote(noteInput);
  }
});

// Enable Reading Mode functionality
document.getElementById("enable-reading-mode").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        chrome.runtime.sendMessage({ action: "enableReadingMode" });
      },
    });
  });
});

function addNote(note) {
  chrome.storage.sync.get("notes", (data) => {
    const notes = data.notes || {};
    const noteId = new Date().getTime(); // Use timestamp as note ID
    notes[noteId] = note;
    chrome.storage.sync.set({ notes }, () => {
      renderNotes();
      document.getElementById("note-input").value = ""; // Clear input
    });
  });
}

function renderNotes() {
  chrome.storage.sync.get("notes", (data) => {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = ""; // Clear existing notes
    const notes = data.notes || {};
    for (const [id, note] of Object.entries(notes)) {
      const li = document.createElement("li");
      li.textContent = note;
      notesList.appendChild(li);
    }
  });
}

// Update reading time on load
updateReadingTime();
function updateReadingTime() {
  chrome.storage.sync.get("readingTime", (data) => {
    const time = data.readingTime || 0;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(
      "reading-time"
    ).textContent = `Reading Time: ${minutes} minutes, ${seconds} seconds`;
  });
}

// Initial render of notes
renderNotes();
