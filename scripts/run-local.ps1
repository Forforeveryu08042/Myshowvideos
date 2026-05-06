# 本地跑「Eureka + Config + 后台 Admin」
# 前置：JDK 11+（推荐 17）、Maven、MySQL、Memurai/Redis
# 1) MySQL 创建库 scetc-show-video-dev 并导入: sql/scetc-show-video-dev.sql
# 2) 按需修改 scetc-show-videos-admin/.../application.properties 里的数据库账号密码

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$data = Join-Path $env:USERPROFILE "show-videos-dev-data"
New-Item -ItemType Directory -Force -Path $data | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $data "bgm") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $data "logs") | Out-Null

Write-Host "上传与日志目录: $data"
Write-Host ""
Write-Host "请开 3 个 PowerShell 窗口，按顺序启动（等前一个就绪后再开下一个）："
Write-Host ""
Write-Host "【1】Eureka — http://localhost:8761"
Write-Host "  cd `"$root\scetc-show-videos-cloud`""
Write-Host "  mvn spring-boot:run"
Write-Host ""
Write-Host "【2】Config — http://localhost:8888"
Write-Host "  cd `"$root\scetc-show-videos-config`""
Write-Host "  mvn spring-boot:run"
Write-Host ""
Write-Host "【3】Admin — http://localhost:8082"
Write-Host "  cd `"$root\scetc-show-videos-admin`""
Write-Host "  mvn spring-boot:run"
Write-Host ""
Write-Host "说明: Eureka(Config) 在 Java 17 上已配置 JAXB + XStream 版本与 --add-opens；请用 mvn spring-boot:run 启动。"
Write-Host "若使用 java -jar，须用 JDK 11+，示例:"
Write-Host "  java --add-opens java.base/java.lang=ALL-UNNAMED --add-opens java.base/java.lang.reflect=ALL-UNNAMED -jar target\scetc-show-videos-admin-0.0.1-SNAPSHOT.jar"
