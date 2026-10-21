# Alex · Voice Representative for Robert Gammer

A minimalist, sophisticated executive voice assistant representing **Robert Gammer**—strategic advisor, board trustee, and venture leader. The assistant, named **Alex**, speaks English in a measured, deep American baritone tone to articulate strategic direction, enterprise AI governance, and private advisory retainers.

Designed with a clean, high-contrast editorial aesthetic featuring **Cormorant Garamond** serif typography and disciplined, zero-pill visual hierarchy.

---

## Features

- **Executive Voice Chamber**: Real-time voice interaction powered by `@google/genai` (Gemini 3.8 Flash for reasoning, Gemini 3.8 Flash Lite TTS with prebuilt `Fenrir` deep male baritone voice).
- **Resilient Audio Fallback**: Automated client-side Web Speech API fallback with fine-tuned pitch (`0.82`) and cadence (`0.94x`) for environments without active cloud API keys.
- **Harmonic Acoustic Visualizer**: Dynamic canvas sound-wave visualizer responding in real-time to microphone input and audio playback.
- **Executive Dossier**: Full biographical and strategic briefing on Robert Gammer's 20+ year institutional track record and philosophy (*"Discipline precedes scale"*).
- **Strategic Pillars**: Clear overview of Robert's core mandates—Architectural Governance, Enterprise AI Integration, and High-Stakes Capital Allocation.
- **Advisory Engagements & Case Retainers**: Retained Board mandates, Strategic AI Sprints, and confidential M&A due diligence.
- **Direct Consultation Channel**: Interactive inquiry intake with voice-dictation support for direct message dispatch to Robert (`R08ERTG@gmail.com`).
- **Vocal Architecture Drawer**: Customizable audio settings to tune voice synthesis engines, speaking pitch, cadence, and continuous hands-free dialogue.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express, TSX
- **AI & Speech**: `@google/genai` SDK (`gemini-3.8-flash` & `gemini-3.8-flash-lite-tts`), Web Speech API, Web Audio API (`AudioContext`, `AnalyserNode`)
- **Typography**: Google Fonts Cormorant Garamond (display serif) + Plus Jakarta Sans (body sans)

---

## Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- npm or pnpm

### 2. Clone and Install
```bash
git clone <your-github-repo-url>
cd alex-voice-robert-gammer
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your Gemini API Key:
```env
# GEMINI_API_KEY: Optional for local fallback; required for full Gemini Flash & Fenrir Studio TTS
GEMINI_API_KEY="your-gemini-api-key-here"

# APP_URL: Optional base URL
APP_URL="http://localhost:3000"
```
*(Note: If no API key is supplied, Alex automatically utilizes the built-in domain knowledge base and client-side baritone speech synthesis).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## Pushing to GitHub

To publish this project to your own GitHub account:

1. **Initialize Git** (if not already initialized):
   ```bash
   git init
   git branch -M main
   ```

2. **Stage and Commit all files**:
   ```bash
   git add .
   git commit -m "Initial commit: Alex Voice Representative for Robert Gammer"
   ```

3. **Link to your GitHub repository**:
   Create a new repository on [GitHub](https://github.com/new) (e.g. `alex-voice-robert-gammer`), then run:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   ```

4. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## Project Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (node_modules, dist, .env)
├── index.html                # Entry HTML with serif typography
├── metadata.json             # AI Studio applet metadata & permissions
├── package.json              # Project dependencies & scripts
├── README.md                 # Project documentation
├── server.ts                 # Full-stack Express server with Gemini API proxy
├── src/
│   ├── assets/               # Generated editorial portraits & visual assets
│   ├── components/
│   │   ├── AdvisoryServices.tsx       # Retainer models & executive testimonials
│   │   ├── AudioSettingsDrawer.tsx    # Voice pitch/engine customization
│   │   ├── ConsultationModal.tsx      # Direct inquiry modal with voice dictation
│   │   ├── ExecutiveDossier.tsx       # Robert Gammer biography & strategic pillars
│   │   ├── Footer.tsx                 # Clean professional footer
│   │   ├── TopNav.tsx                 # 3-Zone top navigation contract
│   │   ├── VoiceChamber.tsx           # Voice assistant core & auditory transcript
│   │   └── VoiceVisualizer.tsx        # Dynamic acoustic waveform canvas
│   ├── types/                # TypeScript interface definitions
│   ├── utils/                # Audio decoding, synthesis, and speech recognition
│   ├── App.tsx               # Main application orchestration
│   ├── index.css             # Tailwind v4 theme and font definitions
│   └── main.tsx              # React DOM entry point
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler configuration
```

---

## License

Private & Confidential © Robert Gammer. Executive representation by Alex.
