# install.ps1 - nullprobe Windows installer (PowerShell)
# Downloads the correct prebuilt binary from GitHub Releases and installs it.

param(
    [string]$Version = "latest",
    [string]$InstallDir = ""
)

$ErrorActionPreference = "Stop"

$Repo = "dmitrii-esin/nullprobe"

if (-not $InstallDir) {
    $InstallDir = "$env:USERPROFILE\.local\bin"
}

if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

$arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
$binaryName = "nullprobe-windows-$arch.exe"

if ($Version -eq "latest") {
    $downloadUrl = "https://github.com/$Repo/releases/latest/download/$binaryName"
    $checksumUrl = "https://github.com/$Repo/releases/latest/download/checksums.txt"
} else {
    $downloadUrl = "https://github.com/$Repo/releases/download/$Version/$binaryName"
    $checksumUrl = "https://github.com/$Repo/releases/download/$Version/checksums.txt"
}

Write-Host "→ Installing nullprobe ($Version) for windows-$arch..."

$tempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
$binaryPath = Join-Path $tempDir $binaryName

try {
    Write-Host "   Downloading binary..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $binaryPath -UseBasicParsing

    Write-Host "   Downloading checksums (if available)..."
    try {
        $checksumContent = Invoke-RestMethod -Uri $checksumUrl -UseBasicParsing
        $expectedHash = ($checksumContent -split "`n" | Where-Object { $_ -match $binaryName }) -split " " | Select-Object -First 1

        if ($expectedHash) {
            $actualHash = (Get-FileHash $binaryPath -Algorithm SHA256).Hash.ToLower()
            if ($actualHash -ne $expectedHash.ToLower()) {
                throw "Checksum verification failed!"
            }
            Write-Host "   Checksum verified."
        }
    } catch {
        Write-Host "   (Skipping checksum verification - file not found or error)"
    }

    $finalPath = Join-Path $InstallDir "nullprobe.exe"
    Move-Item -Force $binaryPath $finalPath

    Write-Host ""
    Write-Host "✅ nullprobe installed to $finalPath"
    Write-Host ""
    Write-Host "   Make sure $InstallDir is in your PATH, then run:"
    Write-Host "     nullprobe init"
    Write-Host ""

} catch {
    Write-Host "❌ Installation failed: $_"
    Write-Host "   For now, install from source:"
    Write-Host "   git clone https://github.com/dmitrii-esin/nullprobe.git"
    Write-Host "   cd nullprobe ; npm install ; npm run build ; npm link"
    exit 1
} finally {
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}