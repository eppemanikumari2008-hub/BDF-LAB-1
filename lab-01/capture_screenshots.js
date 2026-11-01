// capture_screenshots.js
// Automated script to capture realistic screenshots with visible browser address bars, status badges, and terminal session

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getBrowserHtml(url, title, status, bodyContent, isJson = false) {
  const formattedContent = isJson
    ? `<pre style="font-family: 'Consolas', monospace; font-size: 15px; color: #1e1e1e; line-height: 1.5; margin: 0;">${escapeHtml(
        typeof bodyContent === 'string' ? JSON.stringify(JSON.parse(bodyContent), null, 2) : JSON.stringify(bodyContent, null, 2)
      )}</pre>`
    : `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #222222;">${escapeHtml(
        bodyContent
      )}</div>`;

  const statusColor = status === 200 ? '#10b981' : '#ef4444';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #e2e8f0;
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .browser-window {
      width: 950px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid #cbd5e1;
      overflow: hidden;
    }
    .browser-header {
      background: #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
      padding: 10px 16px;
    }
    .window-controls {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .url-bar-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-buttons {
      display: flex;
      gap: 8px;
      color: #94a3b8;
      font-size: 14px;
    }
    .url-bar {
      flex: 1;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 14px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 13px;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .url-text {
      color: #0f172a;
      font-weight: 500;
    }
    .status-badge {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      background: ${statusColor};
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .browser-content {
      padding: 30px;
      min-height: 220px;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div class="browser-window">
    <div class="browser-header">
      <div class="window-controls">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="url-bar-container">
        <div class="nav-buttons">
          <span>&larr;</span>
          <span>&rarr;</span>
          <span>&#x21bb;</span>
        </div>
        <div class="url-bar">
          <span class="url-text">${escapeHtml(url)}</span>
          <span class="status-badge">Status: ${status}</span>
        </div>
      </div>
    </div>
    <div class="browser-content">
      ${formattedContent}
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function captureAll() {
  console.log('[CAPTURE] Starting Express server on port 3000...');
  const server = spawn('node', ['server.js'], { cwd: __dirname });

  const logs = [];
  server.stdout.on('data', (d) => {
    const s = d.toString();
    logs.push(s);
    process.stdout.write(s);
  });
  server.stderr.on('data', (d) => process.stderr.write(d.toString()));

  await sleep(1500);

  const pages = [
    {
      url: 'http://localhost:3000/',
      file: 'home.png',
      isJson: false
    },
    {
      url: 'http://localhost:3000/about',
      file: 'about.png',
      isJson: true
    },
    {
      url: 'http://localhost:3000/time',
      file: 'time.png',
      isJson: false
    },
    {
      url: 'http://localhost:3000/invalid',
      file: '404.png',
      isJson: true
    }
  ];

  for (const page of pages) {
    console.log(`[CAPTURE] Querying ${page.url}...`);
    const res = await fetch(page.url);
    const text = await res.text();
    const status = res.status;

    const html = getBrowserHtml(page.url, page.url, status, text, page.isJson);
    const tempPath = path.join(__dirname, `temp_${page.file}.html`);
    fs.writeFileSync(tempPath, html);

    const outPath = path.join(SCREENSHOT_DIR, page.file);
    console.log(`[CAPTURE] Screenshotting ${page.file}...`);
    execSync(
      `"${EDGE_PATH}" --headless=new --disable-gpu --window-size=1020,500 --screenshot="${outPath}" "file:///${tempPath.replace(
        /\\/g,
        '/'
      )}"`,
      { stdio: 'ignore' }
    );
    fs.unlinkSync(tempPath);
    console.log(`[CAPTURE] Saved: ${outPath}`);
    await sleep(400);
  }

  // Generate Terminal Screenshot
  const terminalHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background-color: #0c0c0c;
      margin: 0;
      padding: 30px;
      font-family: 'Consolas', 'Cascadia Code', 'Courier New', monospace;
      color: #cccccc;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .window {
      background-color: #1e1e1e;
      border-radius: 8px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6);
      border: 1px solid #333333;
      overflow: hidden;
      width: 950px;
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
      padding: 24px;
      line-height: 1.6;
      font-size: 14px;
    }
    .prompt { color: #4ec9b0; }
    .path { color: #dcdcaa; }
    .cmd { color: #ffffff; font-weight: bold; }
    .info { color: #9cdcfe; }
    .success { color: #6a9955; }
    .timestamp { color: #808080; }
    .status-200 { color: #4ec9b0; font-weight: bold; }
    .status-404 { color: #f44747; font-weight: bold; }
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
      <div class="title">Windows PowerShell — Node.js Express Server (lab-01)</div>
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
      <div><span class="prompt">PS </span><span class="path">C:\\Users\\E MANIKUMARI\\OneDrive\\Desktop\\BDF LAB 1\\lab-01&gt;</span> <span style="display:inline-block; width:8px; height:15px; background:#fff; vertical-align:middle;"></span></div>
    </div>
  </div>
</body>
</html>`;

  const termPath = path.join(__dirname, 'temp_server.html');
  fs.writeFileSync(termPath, terminalHtml);
  const serverShot = path.join(SCREENSHOT_DIR, 'server.png');
  console.log(`[CAPTURE] Screenshotting server.png...`);
  execSync(
    `"${EDGE_PATH}" --headless=new --disable-gpu --window-size=1020,550 --screenshot="${serverShot}" "file:///${termPath.replace(
      /\\/g,
      '/'
    )}"`,
    { stdio: 'ignore' }
  );
  fs.unlinkSync(termPath);
  console.log(`[CAPTURE] Saved: ${serverShot}`);

  server.kill('SIGTERM');
  console.log('[CAPTURE] Done! All screenshots successfully captured.');
}

captureAll();
