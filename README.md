# Voice Assistant (Browser + AI Backend)

A modular voice assistant system that integrates **speech processing**, **intent handling**, and **large language model (LLM) reasoning**, designed to behave like a lightweight **AI agent** operating in a constrained environment.

The project prioritises clarity of agent behaviour, explicit decision flow, and clean separation between **symbolic logic** and **neural reasoning**.

---

## What This Project Is

This project demonstrates how an end-to-end voice assistant can be constructed using:

- **Speech-to-text (STT)** and **text-to-speech (TTS)** pipelines at the browser level  
- A **Node.js backend** connected to a **Large Language Model (LLM)** via API  
- A hybrid approach combining **rule-based intent handling** with **neural language understanding**

The assistant reflects the early-stage design of AI systems often seen in research prototypes and cinematic AI labs — capable, responsive, but intentionally transparent.

  ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/third.jpeg?raw=true)


---

## Agent Architecture & Cognitive Flow

The assistant follows a simplified **agent perception–decision–action loop**:

### Perception Layer
Captures raw audio input and converts it to text using browser-native **speech recognition (STT)**.

### Intent Interpretation Layer
Applies deterministic intent matching for known commands and lightweight semantic routing to determine whether the query can be handled locally or requires LLM-based reasoning.

### Decision & Routing Layer
- Symbolic execution path for predefined commands (timers, notes, navigation)  
- Neural execution path for open-ended, explanatory, or ambiguous queries  

### Response Generation Layer
- Local responses generated via deterministic logic  
- AI responses generated via **LLM inference**, returned as natural language  

### Action & Output Layer
Executes side effects (opening URLs, timers, storage) and produces spoken output via **TTS**.

This architecture mirrors real-world agentic system design, where AI is used selectively rather than universally.

![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/third.jpeg?raw=true)

---

## Core Capabilities

### Speech Processing
- Real-time **Speech-to-Text (STT)** using the **Web Speech API**  
- **Text-to-Speech (TTS)** synthesis for verbal responses  
- Latency-aware interaction loop suitable for conversational flow  

### Symbolic Command Execution (Local)
- Rule-based intent classification  
- Deterministic command execution  
- Stateless and stateful operations (timers, notes)  
- Browser-based persistence using **localStorage**  

### Neural Language Understanding (Backend)
- Integration with LLM APIs (Gemini / OpenAI-style models)  
- Handles:
  - Open-ended questions  
  - Concept explanations  
  - Natural language reasoning  
- Backend prompt construction and response parsing  
- API key isolation via environment variables  

![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/third.jpeg?raw=true)
---


## Tech Stack

### Frontend
- HTML5  
- CSS3 (CSS variables, theming)  
- Vanilla JavaScript  
- Web Speech API (Speech-to-Text and Text-to-Speech)  

### Backend
- Node.js  
- Express  
- Large Language Model API (Gemini / OpenAI-style)  
- Prompt-based inference  
- dotenv for secure environment variable management  

---

## Running the System

### Frontend
1. Open `index.html` in Chrome or Edge  
2. Grant microphone permissions when prompted  

> Note: Speech recognition performs best on Chromium-based browsers.

### Backend
cd backend
npm install
npm start
## Design Philosophy

This project follows a **hybrid AI design approach**:

- **Symbolic AI** is used for precision, speed, and deterministic behaviour in predefined commands  
- **Subsymbolic AI (LLMs)** is used for generalisation, explanation, and flexible natural language reasoning  

This separation ensures predictable execution for known tasks while still enabling intelligent, open-ended responses when required.


