export function createSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("SpeechRecognition is not supported. Use Chrome/Edge.");
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const synth = window.speechSynthesis;

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.cancel();        // stop previous speech
    synth.speak(utterance);
  };

  const listenOnce = () =>
    new Promise((resolve, reject) => {
      recognition.onresult = (event) => resolve(event.results[0][0].transcript);
      recognition.onerror = (event) => reject(new Error(event.error));
      recognition.start();
    });

  return { speak, listenOnce };
}
