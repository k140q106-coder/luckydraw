<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 抽籤與分組小幫手 (Lucky Draw & Grouping Helper)

這是一個基於 React + Vite 開發的抽籤與分組工具，整合了 Gemini API (選用) 來增強功能。

## 🚀 快速開始 (Quick Start)

### 1. 安裝依賴 (Install)

請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

```bash
npm install
```

### 2. 環境設定 (Environment Setup)

專案需要環境變數才能完整運作。請將 `env.example` 複製為 `.env` 並填入您的設定。

```bash
# Windows
copy env.example .env

# macOS / Linux
cp env.example .env
```

打開 `.env` 檔案，填入您的 API Key (若無 AI 功能需求可暫時略過)：

```env
VITE_AI_STUDIO_API_KEY=your_api_key_here
```

### 3. 本機執行 (Run Locally)

啟動開發伺服器：

```bash
npm run dev
```

開啟瀏覽器瀏覽： http://localhost:3000

---

## 📦 部署 (Deployment)

本專案已設定 **GitHub Actions**，可自動部署至 **GitHub Pages**。

### 自動部署流程：
1. 將程式碼 Push 到 GitHub 的 `main` 分支。
2. GitHub Actions 會自動觸發 `Deploy to GitHub Pages` workflow。
3. 建置完成後，您的網站將會在 `https://<您的帳號>.github.io/<專案名稱>/` 上線。

### 前置作業：
1. 進入 GitHub Repository 的 **Settings** > **Pages**。
2. 在 **Build and deployment** 下的 **Source** 選擇 **GitHub Actions**。

## 🛡️ 檔案忽略 (.gitignore)

已設定標準的忽略清單，包含：
- `node_modules/` (依賴套件)
- `.env`, `.env.*` (敏感環境變數)
- `dist/` (建置產物)
- 系統暫存檔 (如 .DS_Store, Thumbs.db)

---

Developed with ❤️ using React, Vite & TailwindCSS.
