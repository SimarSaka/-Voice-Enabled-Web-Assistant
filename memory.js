const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(__dirname, "data", "memory.json");

function loadMemory() {
  if (!fs.existsSync(MEMORY_PATH)) {
    return { profiles: { default: { name: null, preferences: { responseStyle: "short" }, history: [] } } };
  }
  const raw = fs.readFileSync(MEMORY_PATH, "utf-8");
  return JSON.parse(raw);
}

function saveMemory(memory) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2), "utf-8");
}

function getProfile(memory, sessionId = "default") {
  if (!memory.profiles[sessionId]) {
    memory.profiles[sessionId] = { name: null, preferences: { responseStyle: "short" }, history: [] };
  }
  return memory.profiles[sessionId];
}

function addToHistory(profile, role, text, maxItems = 12) {
  profile.history.push({ role, text, ts: Date.now() });
  if (profile.history.length > maxItems) {
    profile.history = profile.history.slice(profile.history.length - maxItems);
  }
}

function setName(profile, name) {
  profile.name = name;
}

function setPreference(profile, key, value) {
  profile.preferences[key] = value;
}

module.exports = {
  loadMemory,
  saveMemory,
  getProfile,
  addToHistory,
  setName,
  setPreference,
};
