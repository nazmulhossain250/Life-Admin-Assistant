# Life Admin Assistant

## What does it do?
Life Admin Assistant is an AI-powered document simplifier. It takes complex paperwork, such as legal letters, medical results, or insurance forms, and translates them into clear, 5th-grade level English. It extracts crucial information like deadlines and provides an actionable checklist, helping you manage your life admin with zero stress.

## Project Structure
```
life-admin-assistant/
├── public/               # Static assets
├── src/                  # Application source code
│   ├── services/         # API and external service integrations (e.g., Gemini)
│   ├── App.tsx           # Main application entry point
│   ├── index.css         # Global styles using Tailwind CSS
│   └── main.tsx          # React DOM rendering
├── .env                  # Environment variables (API keys)
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite bundler configuration
```

## How to run it

**Prerequisites:** Node.js installed on your machine.

1. **Clone the repository** (if you haven't already).
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory (you can copy `.env.example`).
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY="your_api_key_here"
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## How to launch it
After running the development server, the application will be hosted locally.
Open your browser and navigate to the URL provided in the terminal, usually:
```
http://localhost:3000
```

---
**Built by Nazmul Hossain**
