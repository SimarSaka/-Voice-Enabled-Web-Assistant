## 1) System Architecture at a Glance
This system is split into four main parts: **Browser (UI)**, **Client Logic (reflexes)**, **Backend (brain + memory)**, and **External Systems (AI + OS)**.  
Simple commands are handled locally, while complex queries go to the backend and AI.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig01.jpeg?raw=true)

---

## 2) Presentation Layer (User Interface)
The assistant UI is designed with a clean glass-like look.  
It shows **status**, a **main microphone button**, and **conversation history**, keeping the interaction simple and voice-first.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig02.jpeg?raw=true)

---

## 3) Fast Path (Instant Reflexes via Command Registry)
For basic commands, the system checks a **local command list** and runs the matching action instantly.  
This gives low delay and can work even without internet.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig03.jpeg?raw=true)
---

## 4) Handoff to AI (Complex Queries)
If no local command matches, the system escalates to the backend AI path.  
The user gets feedback (example: “Let me think…”) while the request is processed.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig04.jpeg?raw=true)

---

## 5) Backend (Assistant’s Brain + Memory)
The backend server handles:
- AI conversation requests
- user-specific memory storage
- secure system control actions

This is where the “thinking” happens.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig05.jpeg?raw=true)

---

## 6) Inside the `/chat` Endpoint (How AI Replies are Built)
For AI responses, the backend follows a clear flow:
1. Load user memory  
2. Add conversation history  
3. Build a final prompt  
4. Call the AI model  
5. Save the result back to memory

This ensures responses are contextual and consistent.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig06.jpeg?raw=true)
---

## 7) Persistent Memory (Personalised Interaction)
User profiles, preferences, and chat history are saved in a simple memory store (like a JSON file).  
This allows the assistant to remember users across sessions.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig07.jpeg?raw=true)
---

## 8) System Control API (“Hands”)
The assistant can perform controlled system actions such as:
- open apps
- open URLs
- shutdown scheduling
- sleep mode

These actions are separated from chat to reduce risk.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig08.jpeg?raw=true)
---

## 9) Security (Defence in Depth)
System-level actions are protected using:
- token-based authentication
- allow-listed commands (only safe commands can run)

This prevents arbitrary or unsafe execution.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig09.jpeg?raw=true)

---

## 10) Connecting Reflexes to System Actions
Client-side commands can trigger secure backend calls for system control.  
The client sends a protected request (with token), and the backend performs the OS action safely.

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig10.jpeg?raw=true)

---

## 11) Architectural Synthesis (Final Design Summary)
This design is:
- **Fast** (dual-path processing)
- **Smart** (AI for complex queries)
- **Personalised** (persistent memory)
- **Secure** (allow-list + token protection)
- **Maintainable** (decoupled components)

 ![image alt](https://github.com/SimarSaka/-Voice-Enabled-Web-Assistant/blob/main/Fig11.jpeg?raw=true)

---
