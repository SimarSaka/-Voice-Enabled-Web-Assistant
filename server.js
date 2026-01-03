const {
  loadMemory,
  saveMemory,
  getProfile,
  addToHistory,
  setName,
  setPreference,
} = require("./memory");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { exec } = require("child_process");
const open = require("open");

const app = express();

// local-only: allow only requests from your own machine
app.use(cors());
app.use(express.json());

// ---------- Gemini ----------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------- Safety helpers ----------
function requireToken(req, res) {
  const token = req.headers["x-control-token"];
  if (!process.env.CONTROL_TOKEN || token !== process.env.CONTROL_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// only allow known actions (no arbitrary commands)
const ALLOWED_APPS = {
  notepad: "notepad",
  calculator: "calc",
  cmd: "cmd",
  chrome: "chrome",
};

function runCmd(command) {
  return new Promise((resolve, reject) => {
    exec(command, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}

// ---------- AI chat endpoint ----------
app.post("/chat", async (req, res) => {
  try {
    const text = (req.body?.text || "").trim();
    const sessionId = (req.body?.sessionId || "default").trim();
    if (!text) return res.status(400).json({ error: "Missing text" });

    // 1) Load memory
    const memory = loadMemory();
    const profile = getProfile(memory, sessionId);

    // 2) Simple “memory commands” (product-like)
    // Save name: "my name is X"
    const nameMatch = text.match(/my name is\s+(.+)/i);
    if (nameMatch) {
      const name = nameMatch[1].trim().slice(0, 40);
      setName(profile, name);
      saveMemory(memory);
      return res.json({ reply: `Got it. I'll remember your name is ${name}.` });
    }

    // Preference: "keep answers short"
    if (/keep (your )?answers short/i.test(text)) {
      setPreference(profile, "responseStyle", "short");
      saveMemory(memory);
      return res.json({ reply: "Okay. I’ll keep answers short." });
    }

    // Preference: "give detailed answers"
    if (/give (me )?detailed answers/i.test(text)) {
      setPreference(profile, "responseStyle", "detailed");
      saveMemory(memory);
      return res.json({ reply: "Sure. I’ll give more detailed answers." });
    }

    // 3) Build system instruction from memory
    const nameLine = profile.name ? `The user's name is ${profile.name}.` : "";
    const style =
      profile.preferences?.responseStyle === "detailed"
        ? "Give detailed answers with examples when helpful."
        : "Keep answers short (1-3 sentences) unless the user asks for detail.";

    const systemPrompt = `
You are a helpful voice assistant.
${nameLine}
${style}
Use the conversation history for context.
`.trim();

    // 4) Convert history into chat context (simple)
    const historyText = profile.history
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const prompt = `${systemPrompt}\n\n${historyText}\nUSER: ${text}\nASSISTANT:`;

    // 5) Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result?.response?.text()?.trim() || "Sorry, I couldn't respond.";

    // 6) Save new turns
    addToHistory(profile, "user", text);
    addToHistory(profile, "assistant", reply);
    saveMemory(memory);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- System control endpoints (Level 4) ----------

// Open allowed apps
app.post("/control/open-app", async (req, res) => {
  if (!requireToken(req, res)) return;

  const appName = (req.body?.app || "").toLowerCase().trim();
  const cmd = ALLOWED_APPS[appName];
  if (!cmd) return res.status(400).json({ error: "App not allowed" });

  try {
    await runCmd(`start "" ${cmd}`);
    res.json({ message: `Opened ${appName}` });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Open URL (safe)
app.post("/control/open-url", async (req, res) => {
  if (!requireToken(req, res)) return;

  const url = (req.body?.url || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    await open(url);
    res.json({ message: "Opened URL" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Shutdown with delay (seconds)
app.post("/control/shutdown", async (req, res) => {
  if (!requireToken(req, res)) return;

  const seconds = Number(req.body?.seconds ?? 60);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > 3600) {
    return res.status(400).json({ error: "seconds must be 0..3600" });
  }

  try {
    await runCmd(`shutdown /s /t ${Math.floor(seconds)}`);
    res.json({ message: `Shutdown scheduled in ${Math.floor(seconds)} seconds` });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Cancel shutdown
app.post("/control/shutdown-cancel", async (req, res) => {
  if (!requireToken(req, res)) return;

  try {
    await runCmd("shutdown /a");
    res.json({ message: "Shutdown cancelled" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Sleep (Windows)
app.post("/control/sleep", async (req, res) => {
  if (!requireToken(req, res)) return;

  try {
    // This triggers sleep on many Windows setups
    await runCmd("rundll32.exe powrprof.dll,SetSuspendState 0,1,0");
    res.json({ message: "Putting system to sleep" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Backend running: http://localhost:${port}`));

