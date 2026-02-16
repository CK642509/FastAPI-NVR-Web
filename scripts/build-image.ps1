# deploy-build.ps1
# 自動構建並部署到 build 分支的腳本
# 使用方式: .\scripts\deploy-build.ps1 [-CommitMessage "your message"]

param(
    [string]$CommitMessage = ""
)

$ErrorActionPreference = "Stop"

# 設定路徑
$ProjectDir = Split-Path -Parent $PSScriptRoot
$BuildWorktreeDir = Join-Path (Split-Path -Parent $ProjectDir) "FastAPI-NVR-Web-build"
$RendererOutputDir = Join-Path $ProjectDir "out\renderer"

Write-Host "=== FastAPI NVR Web Build Deploy Script ===" -ForegroundColor Cyan
Write-Host ""

# 1. 確保在 main 分支
Write-Host "[1/6] Checking current branch..." -ForegroundColor Yellow
Set-Location $ProjectDir
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "Switching to main branch..." -ForegroundColor Yellow
    git checkout main
}

# 取得 main 分支的 commit hash 前 8 碼作為預設 commit message
$mainCommitHash = git rev-parse --short=8 HEAD
if ([string]::IsNullOrEmpty($CommitMessage)) {
    $CommitMessage = "Build: $mainCommitHash"
}

# 2. 執行構建
Write-Host "[2/6] Running npm run build:win..." -ForegroundColor Yellow
npm run build:win
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# 3. 確認 out/renderer 存在
if (-not (Test-Path $RendererOutputDir)) {
    Write-Host "Error: $RendererOutputDir does not exist!" -ForegroundColor Red
    exit 1
}
Write-Host "[3/6] Build output verified at: $RendererOutputDir" -ForegroundColor Green

# 4. 確認 worktree 存在
Write-Host "[4/6] Checking build worktree..." -ForegroundColor Yellow
if (-not (Test-Path $BuildWorktreeDir)) {
    Write-Host "Creating worktree..." -ForegroundColor Yellow
    git worktree add $BuildWorktreeDir build
}
Write-Host "Worktree location: $BuildWorktreeDir" -ForegroundColor Green

# 5. 同步構建產物到 build 分支
Write-Host "[5/6] Syncing build output to build branch..." -ForegroundColor Yellow

# 清空 build worktree（保留 .git 和 README.md）
Get-ChildItem -Path $BuildWorktreeDir -Exclude ".git", "README.md" | Remove-Item -Recurse -Force

# 複製 renderer 輸出
Copy-Item -Path "$RendererOutputDir\*" -Destination $BuildWorktreeDir -Recurse -Force

Write-Host "Files copied successfully!" -ForegroundColor Green

# 6. 提交並推送 build 分支
Write-Host "[6/6] Committing build branch..." -ForegroundColor Yellow
Set-Location $BuildWorktreeDir
git add -A

# 檢查是否有變更
$status = git status --porcelain
if ($status) {
    git commit -m $CommitMessage
    Write-Host "Changes committed!" -ForegroundColor Green
    
    # 詢問是否推送
    $push = Read-Host "Push to remote? (y/n)"
    if ($push -eq "y") {
        git push -u origin build
        Write-Host "Pushed to origin/build!" -ForegroundColor Green
    }
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

# 回到原目錄
Set-Location $ProjectDir

Write-Host ""
Write-Host "=== Deploy Complete ===" -ForegroundColor Cyan
Write-Host "Build worktree location: $BuildWorktreeDir" -ForegroundColor White
Write-Host ""
Write-Host "To use as submodule in another project:" -ForegroundColor White
Write-Host "  git submodule add -b build <your-repo-url> <path>" -ForegroundColor Gray
