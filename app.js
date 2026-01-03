
const clearBtn = document.getElementById("clear-btn");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

import { createSpeech } from "./speech.js";
import { createCommandRegistry } from "./commands.js";

const logDiv = document.getElementById("log");
const startBtn = document.getElementById("start-btn");

const log = (role, text) => {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="meta">
      <span>${role === "user" ? "You" : role === "assistant" ? "Assistant" : "System"}</span>
      <span>${time}</span>
    </div>
    <div class="text"></div>
  `;
  div.querySelector(".text").textContent = text;

  logDiv.appendChild(div);
  logDiv.scrollTop = logDiv.scrollHeight;
};


let speech;
try {
  speech = createSpeech();
} catch (e) {
  log(`Error: ${e.message}`);
  startBtn.disabled = true;
}

const speak = (text) => {
  log(`Assistant: ${text}`);
  speech.speak(text);
};

const registry = createCommandRegistry({ log, speak });

startBtn.addEventListener("click", async () => {
  try {
    log("Listening...");
    const command = await speech.listenOnce();

    const result = await registry.handle(command);

    if (!result.handled) {
  speak("Let me think...");
  try {
    const reply = await askAI(command);
    speak(reply);
  } catch (e) {
    speak("Sorry, I couldn't reach the AI server.");
  }
}

  } catch (e) {
    log(`Error: ${e.message}`);
    speak("I encountered an error. Please try again.");
  }
});
const setStatus = (state) => {
  // state: idle | listening | thinking | error
  if (state === "listening") {
    statusDot.style.background = "var(--ok)";
    statusText.textContent = "Listening";
    startBtn.classList.add("listening");
  } else if (state === "thinking") {
    statusDot.style.background = "var(--warn)";
    statusText.textContent = "Thinking";
    startBtn.classList.remove("listening");
  } else if (state === "error") {
    statusDot.style.background = "var(--err)";
    statusText.textContent = "Error";
    startBtn.classList.remove("listening");
  } else {
    statusDot.style.background = "rgba(255,255,255,0.35)";
    statusText.textContent = "Idle";
    startBtn.classList.remove("listening");
  }
};

clearBtn.addEventListener("click", () => {
  logDiv.innerHTML = "";
  setStatus("idle");
});

