# All-in-One AI Chrome Extension

**All-in-One AI** is an open-source Chrome Extension that allows you to query multiple leading LLMs simultaneously in a single, split-pane interface. Compare answers from ChatGPT, Gemini, Claude, Kimi, Grok, and DeepSeek side-by-side, and get an AI-generated summary and final verdict based on all responses.

https://github.com/user-attachments/assets/4cbd46a3-e55f-4fca-9e9c-765585c2c3c2

## Features

- **Multi-Model Support**: Query 6 major AI models at once:
  - **ChatGPT**
  - **Gemini**
  - **Claude**
  - **Kimi**
  - **Grok**
  - **DeepSeek**
- **Split-Pane UI**: View all responses in a clean 3x2 grid with markdown rendering.
- **Dynamic Model Selection**: Automatically fetches available models for your API key.
- **Secure Token Management**: API keys are stored locally in your browser (`chrome.storage.local`).
- **Summarization & Verdict**: One-click summary that aggregates all answers and provides a final consensus.
- **Markdown Rendering**: Responses are beautifully formatted with support for headers, lists, code blocks, and more.
- **Privacy Focused**: Direct browser-to-API communication. No middleman server.

## Development Setup

This extension is built with **TypeScript** and **Webpack** for a professional, maintainable codebase.

### Prerequisites

- Node.js 18+ and npm
- Chrome browser

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/all-in-one-ai.git
   cd all-in-one-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```
   This compiles TypeScript to JavaScript and outputs to the `dist/` folder.

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `dist/` folder

### Development Mode

For active development with auto-rebuild on file changes:

```bash
npm run dev
```

This runs Webpack in watch mode. After making changes, just reload the extension in `chrome://extensions/`.

### Type Checking

To check TypeScript types without building:

```bash
npm run type-check
```

## Project Structure

```
all-in-one-ai/
├── src/
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── providers/
│   │   ├── index.ts          # Provider registry
│   │   ├── chatgpt.ts        # ChatGPT configuration
│   │   ├── gemini.ts         # Gemini configuration
│   │   ├── claude.ts         # Claude configuration
│   │   ├── kimi.ts           # Kimi configuration
│   │   ├── grok.ts           # Grok configuration
│   │   └── deepseek.ts       # DeepSeek configuration
│   ├── utils/
│   │   ├── api.ts            # API call utilities
│   │   ├── markdown.ts       # Markdown parser
│   │   └── storage.ts        # Chrome storage helpers
│   ├── ui/
│   │   ├── pane.ts           # Pane UI management
│   │   └── summary.ts        # Summary modal rendering
│   ├── config/
│   │   └── colors.ts         # UI color configuration
│   ├── script.ts             # Main application logic
│   └── background.ts         # Service worker
├── public/
│   ├── index.html            # Main UI
│   ├── styles.css            # Styles
│   └── manifest.json         # Extension manifest
├── dist/                     # Build output (generated)
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Usage

1. **Open the Extension**: Click the extension icon to open the main dashboard.
2. **Add API Keys**:
   - In each pane, click **"+ Enter API Token"**.
   - Paste your API key for that specific provider.
   - Click **Save**.
   - The extension will automatically fetch available models for your key.
3. **Select Models**: Use the dropdown in each pane to choose your preferred model.
4. **Send a Prompt**:
   - Type your question in the top input bar.
   - Click **"Send to All"**.
   - The extension will query all providers for which you have saved a token.
5. **Summarize**:
   - Once responses are received, the **"Summarize"** button becomes active.
   - Click it to generate a color-coded summary with a final verdict.

## Contributing

Contributions are welcome! Whether it's adding new providers, improving the UI, or fixing bugs.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Make your changes in the `src/` directory.
4. Build and test (`npm run build`).
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
6. Push to the branch (`git push origin feature/AmazingFeature`).
7. Open a Pull Request.

### Adding a New Provider

1. Create a new file in `src/providers/` (e.g., `newprovider.ts`)
2. Implement the `Provider` interface
3. Add it to `src/providers/index.ts`
4. Add colors in `src/config/colors.ts`
5. Update the HTML in `public/index.html` to add a new pane
6. Update `manifest.json` to add host permissions

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## Disclaimer

This tool requires you to use your own API keys. Usage costs are billed directly by the respective AI providers (OpenAI, Google, Anthropic, etc.) according to their pricing models. Use responsibly.

## Tech Stack

- **TypeScript** - Type-safe code
- **Webpack** - Module bundling
- **Chrome Extensions API** - Browser integration
- **Vanilla JS/DOM** - No framework dependencies for minimal bundle size
