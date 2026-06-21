# FastAPI-NVR-Web

這是 [FastAPI-NVR](https://github.com/CK642509/FastAPI-NVR) 的前端，使用 Vue 3 + TypeScript 開發。

技術：Vue 3 + TypeScript、Vuetify 4（Material Design）、Pinia、Vue Router、Vite。

---

## 開發（Phase 2）

Phase 2 前端是單一即時監控頁（`src/views/LiveView.vue`）：MJPEG 即時畫面 + 錄影開關 +
狀態。畫面與控制都打後端 `/api/cameras/{id}/...`（Phase 2 為單一攝影機，id 固定 `1`）。

```bash
npm install
npm run dev          # Vite dev server（http://localhost:5173）
npm run build        # type-check (vue-tsc) + vite build → dist/
npm run type-check   # 僅型別檢查
npm run format       # prettier
```

**後端連線**：`vite.config.ts` 把 `/api` proxy 到 `http://localhost:8000`（FastAPI 後端，
含 MJPEG 串流），所以開發時請先啟動後端（見 `FastAPI-NVR/backend/README.md`）。正式環境
則由 Caddy 以同源方式同時提供前端靜態檔與 `/api`。可用 `VITE_API_BASE` 覆寫 API 基底。

前端結構：

```
src/
├─ api/          # client.ts（fetch 包裝）、cameras.ts（端點）
├─ stores/       # camera.ts（Pinia：錄影狀態 + 開關，每 2s 輪詢）
├─ plugins/      # vuetify.ts（深色主題）
├─ views/        # LiveView.vue（即時畫面 + 錄影控制）
├─ router/       # 路由（/ → LiveView）
├─ App.vue       # Vuetify app shell（app bar + router-view）
└─ main.ts
```

---

## Build Branch & Deployment

本專案使用 `build` 分支來存放構建後的 dist 產物，方便作為 submodule 在其他專案中使用。

### 設置 Build Worktree (首次)

```bash
# 在專案根目錄執行，將 build 分支 checkout 到獨立資料夾
git worktree add  ../FastAPI-NVR-Web-build build
```

這會在專案旁邊創建一個 `FastAPI-NVR-Web-build` 資料夾：

```
your-folder/
├── FastAPI-NVR-Web/           <- main 分支 (開發用)
└── FastAPI-NVR-Web-build/     <- build 分支 (只放構建產物)
```

### 部署到 Build 分支

使用自動化腳本將 `dist` 同步到 build 分支：

```powershell
# 在 main 分支執行
$ .\scripts\deploy-build.ps1

# 或帶自訂 commit message
$ .\scripts\deploy-build.ps1 -CommitMessage "Build: v1.2.2"
```

腳本會自動：
1. 執行 `npm run build:win` 構建專案
2. 將 `dist` 內容同步到 build 分支
3. 提交變更並詢問是否推送

### 查看 Worktree 狀態

```bash
$ git worktree list
```

---

## 在其他專案中使用 (Submodule)

### 添加 Submodule

```bash
# 在你的專案中執行
$ git submodule add -b build <this-repo-url> <submodule-name>
```

### 初始化 Submodule (Clone 後)

```bash
$ git submodule update --init --recursive
```

### 更新 Submodule 到最新版本

```bash
$ git submodule update --remote <module-name>
```
