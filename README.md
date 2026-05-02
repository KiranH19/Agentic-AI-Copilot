# Multi-Agent Cybersecurity Copilot (Chrome Extension)

A lightweight Chrome Extension that simulates a multi-agent cybersecurity system to verify links or text in real-time using a local rule-based pipeline.

## Features
- Right-click verification (context menu)
- Local threat detection (no APIs or backend)
- Risk classification (Low / Medium / High)
- Confidence score (0–100%)
- Action output (ALLOW / WARN / BLOCK)
- Clear reasoning (3–5 points)
- Agent trace system
- Floating popup UI (bottom-right)

## Technologies Used
- HTML
- CSS
- JavaScript
- Chrome Extension APIs (Manifest V3)

## How It Works
- User selects text or link
- Right-click → Verify
- Data sent from background.js → content.js
- Multi-agent pipeline runs:
  Input → Pattern Analysis → Reasoning → Decision → Response
- Popup displays result instantly

## Detection Logic
- Suspicious file types (.exe, .apk, .zip, etc.)
- Phishing keywords (urgent, verify now, free gift, etc.)
- Suspicious domains (.xyz, .ru, .tk)
- Brand spoofing (SBI, HDFC, PayPal, etc.)
- URL patterns (length, hyphens, numbers)
- Shortened links (bit.ly, tinyurl)

## How to Run
1. Open Chrome → chrome://extensions/
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select project folder

## Note
This is a simulated cybersecurity prototype for demonstration purposes. Not a real security tool.
