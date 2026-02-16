# FastAPI-NVR-Web

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
