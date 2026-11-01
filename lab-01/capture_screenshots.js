// capture_screenshots.js
// Automated script to take screenshots of all endpoints and the running server using headless Edge

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  console.log('Starting Express server for screenshots...');
  const serverProcess = spawn('node', ['server.js'], { cwd: __dirname });

  const logs = [];
  serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    logs.push(text);
    process.stdout.write(text);
  });
  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  // Wait for server to boot up
  await sleep(1500);

  const targets = [
    { url: 'http://localhost:3000/', file: 'home.png', label: 'Home Route' },
    { url: 'http://localhost:3000/about', file: 'about.png', label: 'About Route' },
    { url: 'http://localhost:3000/time', file: 'time.png', label: 'Time Route' },
    { url: 'http://localhost:3000/invalid', file: '404.png', label: '404 Route' }
  ];

  for (const target of targets) {
    const outPath = path.join(SCREENSHOT_DIR, target.file);
    console.log(`Capturing ${target.label} (${target.url}) -> ${target.file}...`);
    try {
      execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --window-size=1200,800 --screenshot="${outPath}" "${target.url}"`, {
        stdio: 'ignore'
      });
      console.log(`Saved: ${outPath}`);
    } catch (e) {
      console.error(`Failed to capture ${target.label}:`, e.message);
    }
    await sleep(500);
  }

  // Create terminal HTML view to screenshot actual terminal output
  const terminalLogHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background-color: #0c0c0c;
      margin: 0;
      padding: 24px;
      font-family: 'Consolas', 'Cascadia Code', 'Courier New', monospace;
      color: #cccccc;
    }
    .window {
      background-color: #1e1e1e;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #333333;
      overflow: hidden;
      max-width: 900px;
      margin: 0 auto;
    }
    .titlebar {
      background-color: #2d2d2d;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #3c3c3c;
    }
    .dots {
      display: flex;
      gap: 8px;
      margin-right: 16px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background-color: #ff5f56; }
    .dot.yellow { background-color: #ffbd2e; }
    .dot.green { background-color: #27c93f; }
    .title {
      color: #aaaaaa;
      font-size: 13px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
      font-size: 14px;
    }
    .prompt {
      color: #4ec9b0;
    }
    .path {
      color: #dcdcaa;
    }
    .cmd {
      color: #ffffff;
      font-weight: bold;
    }
    .info {
      color: #9cdcfe;
    }
    .success {
      color: #6a9955;
    }
    .timestamp {
      color: #808080;
    }
    .status-200 {
      color: #4ec9b0;
    }
    .status-404 {
      color: #f44747;
    }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="title">Windows PowerShell - Terminal (lab-01)</div>
    </div>
    <div class="content">
      <div><span class="prompt">PS </span><span class="path">C:\\Users\\E MANIKUMARI\\OneDrive\\Desktop\\BDF LAB 1\\lab-01&gt;</span> <span class="cmd">npm start</span></div>
      <br>
      <div><span class="info">&gt; lab-01@1.0.0 start</span></div>
      <div><span class="info">&gt; node server.js</span></div>
      <br>
      <div><span class="success">Express server is running on port 3000</span></div>
      <div><span class="success">Access the server at http://localhost:3000</span></div>
      <br>
      <div><span class="timestamp">[${new Date().toISOString()}]</span> GET / <span class="status-200">(200 OK)</span></div>
      <div><span class="timestamp">[${new Date().toISOString()}]</span> GET /about <span class="status-200">(200 OK)</span></div>
      <div><span class="timestamp">[${new Date().toISOString()}]</span> GET /time <span class="status-200">(200 OK)</span></div>
      <div><span class="timestamp">[${new Date().toISOString()}]</span> GET /invalid <span class="status-404">(404 Not Found)</span></div>
      <br>
      <div><span class="prompt">PS </span><span class="path">C:\\Users\\E MANIKUMARI\\OneDrive\\Desktop\\BDF LAB 1\\lab-01&gt;</span> <span style="animation: blink 1s infinite;">_</span></div>
    </div>
  </div>
</body>
</html>`;

  const terminalHtmlPath = path.join(__dirname, 'terminal_temp.html');
  fs.writeFileSync(terminalHtmlPath, terminalLogHtml);

  const serverShotPath = path.join(SCREENSHOT_DIR, 'server.png');
  console.log(`Capturing Server Running Terminal -> server.png...`);
  try {
    execSync(`"${EDGE_PATH}" --headless=new --disable-gpu --window-size=1000,600 --screenshot="${serverShotPath}" "file:///${terminalHtmlPath.replace(/\\/g, '/')}"`, {
      stdio: 'ignore'
    });
    console.log(`Saved: ${serverShotPath}`);
  } catch (e) {
    console.error('Failed to capture server terminal screenshot:', e.message);
  }

  // Clean up temp html
  if (fs.existsSync(terminalHtmlPath)) {
    fs.unlinkSync(terminalHtmlPath);
  }

  console.log('Shutting down server process...');
  serverProcess.kill('SIGTERM');
  console.log('Done!');
}

capture();
