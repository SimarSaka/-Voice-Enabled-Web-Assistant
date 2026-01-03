
export function createCommandRegistry({ log, speak }) {
  const commands = [
    {
      name: "greeting",
      match: (text) => /^(hi|hello)\b/i.test(text),
      run: () => speak("Hello! How can I assist you?")
    },
    {
      name: "open_youtube",
      match: (text) => text.toLowerCase().includes("open youtube"),
      run: () => {
        speak("Opening YouTube.");
        window.open("https://www.youtube.com", "_blank");
      }
    },
    {
      name: "time",
      match: (text) => text.toLowerCase().includes("time"),
      run: () => {
        const now = new Date().toLocaleTimeString();
        speak(`The current time is ${now}.`);
      }
    },
    {
      name: "date",
      match: (text) => text.toLowerCase().includes("date"),
      run: () => {
        const now = new Date().toDateString();
        speak(`Today's date is ${now}.`);
      }
    },
    {
  name: "open_notepad",
  match: (t) => t.toLowerCase().includes("open notepad"),
  run: async () => {
    await openApp("notepad");
    speak("Opening Notepad.");
  }
},
{
  name: "sleep",
  match: (t) => t.toLowerCase().includes("sleep"),
  run: async () => {
    speak("Putting the system to sleep.");
    await sleepPC();
  }
},
{
  name: "shutdown_1min",
  match: (t) => t.toLowerCase().includes("shutdown in 1 minute"),
  run: async () => {
    await shutdownIn(60);
    speak("Okay. Shutdown scheduled in one minute. Say 'cancel shutdown' to stop it.");
  }
},
{
  name: "cancel_shutdown",
  match: (t) => t.toLowerCase().includes("cancel shutdown"),
  run: async () => {
    await cancelShutdown();
    speak("Shutdown cancelled.");
  }
},

  ];

  const handle = async (rawText) => {
    const text = rawText.trim();
    log(`You: ${text}`);

    const cmd = commands.find((c) => c.match(text));
    if (!cmd) return { handled: false };

    log(`Matched: ${cmd.name}`);
    await cmd.run(text);
    return { handled: true };
  };

  const addCommand = (command) => commands.push(command);

  return { handle, addCommand };
}
