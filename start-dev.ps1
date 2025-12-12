# 🚀 开发服务器启动脚本

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  EduPlatform 开发服务器启动检查" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .env.local 文件
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local 文件存在" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local 文件不存在！" -ForegroundColor Red
    exit 1
}

# 读取并显示关键环境变量
Write-Host ""
Write-Host "📋 环境变量检查:" -ForegroundColor Yellow
$envContent = Get-Content .env.local
foreach ($line in $envContent) {
    if ($line -match "^NEXT_PUBLIC_SUPABASE_URL=") {
        Write-Host "  NEXT_PUBLIC_SUPABASE_URL: " -NoNewline
        Write-Host ($line -replace "^NEXT_PUBLIC_SUPABASE_URL=", "") -ForegroundColor Cyan
    }
    if ($line -match "^NEXT_PUBLIC_SUPABASE_ANON_KEY=") {
        $key = $line -replace "^NEXT_PUBLIC_SUPABASE_ANON_KEY=", ""
        $keyPreview = $key.Substring(0, [Math]::Min(20, $key.Length)) + "..."
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: " -NoNewline
        Write-Host $keyPreview -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🔧 正在启动开发服务器..." -ForegroundColor Yellow
Write-Host "   本地地址: http://localhost:3000" -ForegroundColor Gray
Write-Host "   测试页面: http://localhost:3000/test-supabase" -ForegroundColor Gray
Write-Host ""
Write-Host "⚡ 提示: 如果修改了 .env.local 或 next.config.mjs，请重启服务器" -ForegroundColor Yellow
Write-Host ""

# 启动 Next.js 开发服务器
npm run dev
