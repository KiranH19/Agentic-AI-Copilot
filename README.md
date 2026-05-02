Multi-Agent Cybersecurity Copilot

A Chrome Extension that simulates a multi-agent cybersecurity system to analyze links or text in real-time using a fully local pipeline.
Right-click any content → verify → get instant risk analysis inside the webpage.
Features
Context menu integration (right-click verification)
Local rule-based threat detection (no APIs)
Risk classification: Low / Medium / High
Confidence score (0–100%)
Action output: ALLOW / WARN / BLOCK
3–5 clear reasons for decision
Transparent agent trace
Floating bottom-right popup UI
How It Works
The system follows a multi-agent pipeline:
Input → Pattern Analysis → Reasoning → Decision → Response
Each stage is implemented as a modular JavaScript function, passing structured data forward.
Detection Logic
Suspicious file types (.exe, .apk, .zip, etc.)
Phishing keywords (urgent, verify now, free gift, etc.)
Suspicious domains (.xyz, .ru, .tk)
Brand spoofing (SBI, HDFC, PayPal, Google, etc.)
URL heuristics (length, hyphens, numbers)
Shortened links (bit.ly, tinyurl, t.co)
Each match adds risk score → determines final classification.
Tech Stack
HTML
CSS
JavaScript
Chrome Extension APIs (Manifest V3)
Concept
Inspired by agent-based architectures like LangChain, but implemented fully locally without external models or services.
Limitations
Rule-based detection (no real AI)
Limited to predefined patterns
Not a production security tool
Use Case
Hackathon demo
Cybersecurity awareness
Agent-based system prototype

