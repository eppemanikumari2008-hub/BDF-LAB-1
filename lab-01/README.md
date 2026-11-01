# Lab 1: Node.js and Express server

**Course:** Backend Development Fundamentals (BDF) · Year II Term II · Aurora  
**Faculty:** Joel Prashanth D  

---

### Student Details
- **Name:** E. Mani Kumari
- **Registration Number:** 252U1R5044
- **Section:** AIDE-2A

---

## Live Deployment Link
- **Deployment Status:** Ready for deployment (Render / Railway / Cloud IDE).
- **Live URL:** `Not applicable` *(To be populated upon deploying to Render or Railway — see Deployment section below)*

---

## Objective
The objective of this lab is to understand server-side programming in JavaScript by building a web server from scratch. We first implement a basic web server using the built-in Node.js `http` module (`http.createServer()`), and then transition to **Express.js** to build an organized, scalable web application with structured routing, middleware, JSON responses, status code control, and 404 error handling.

---

## Requirements
Following the official lab manual specifications:
1. **Project Initialization:** Set up a project folder, initialize using `npm init -y`, and configure `package.json`.
2. **Package Management:** Install Express via `npm install express` and understand the `node_modules` structure.
3. **Basic HTTP Server:** Create a plain Node.js server using `http.createServer()` responding with `"Hello"` on port `3000`.
4. **Express Migration:** Rewrite the server using Express (`const app = express()`, `app.listen(3000)`).
5. **Route Implementation:**
   - `GET /` — Welcome message text (Status 200).
   - `GET /about` — JSON object containing student name and section (Status 200).
   - `GET /time` — Dynamic current date and time using `new Date()` (Status 200).
   - `404 Handler` — Return a clear JSON error message for any unknown route (Status 404).
6. **Execution & Verification:** Run the server, verify each endpoint with correct status codes, and record terminal logs.
7. **Documentation & Deliverables:** Create screenshots of all endpoints and prepare the project for GitHub submission and deployment.

---

## Software and Technologies
- **Node.js** (v24.14.0) — Server-side JavaScript runtime environment built on Google Chrome's V8 engine.
- **Express.js** (v5.3.0) — Fast, minimalist web framework for routing and middleware handling.
- **JavaScript (ES6+)** — Primary language for server-side logic and asynchronous handling.
- **npm** (v11.9.0) — Default package manager for managing dependencies and lifecycle scripts.

---

## Project Structure

```text
lab-01/
├── .gitignore               # Ignores node_modules, log files, and environment files
├── basic-server.js          # Plain Node.js HTTP server using http.createServer()
├── capture_screenshots.js   # Automated screenshot capture script using headless browser
├── package.json             # Project metadata, scripts, and dependencies
├── package-lock.json        # Exact dependency tree lockfile
├── server.js                # Main Express server with routes and middleware
├── test.js                  # Automated test script validating all endpoints and status codes
├── README.md                # Comprehensive lab report and documentation
└── screenshots/             # Output screenshots of endpoints and running server
    ├── home.png             # Screenshot of GET / (Welcome route)
    ├── about.png            # Screenshot of GET /about (JSON student details)
    ├── time.png             # Screenshot of GET /time (Date and time route)
    ├── 404.png              # Screenshot of 404 Not Found route
    └── server.png           # Screenshot of terminal running Express server
```

### Purpose of Important Files & Folders:
- **`server.js`**: The central Express.js application file that configures middleware, defines all route handlers (`/`, `/about`, `/time`), handles unknown routes with 404, and binds to the specified port.
- **`basic-server.js`**: Implements a basic HTTP server using Node.js's built-in `http` module (`http.createServer()`), demonstrating fundamental server mechanics before introducing a framework.
- **`package.json`**: Contains project metadata, execution scripts (`start`, `start:basic`, `test`), and the list of external packages (`express`).
- **`package-lock.json`**: Locks exact versions of installed packages and transitive dependencies for reproducible builds.
- **`test.js`**: An automated test suite using Node.js native `fetch` to verify all endpoints, HTTP status codes, and response bodies.
- **`screenshots/`**: Contains captured browser outputs and terminal logs confirming successful execution.
- **`.gitignore`**: Prevents sensitive files and heavy generated folders like `node_modules` from being pushed to version control.

---

## Installation

### Prerequisites
- Node.js (v18.x or later) installed on your system.
- Git installed on your system.

### Installing Dependencies
Navigate into the `lab-01` directory and install project dependencies:
```bash
cd lab-01
npm install
```

### How to Run and Stop the Server

1. **Start the Express Application:**
   ```bash
   npm start
   ```
   The server will start listening at: `http://localhost:3000`

2. **Start the Basic HTTP Server (Alternative):**
   ```bash
   npm run start:basic
   ```

3. **Run the Automated Tests:**
   ```bash
   npm test
   ```

4. **Stopping the Server:**
   Press `Ctrl + C` in your terminal to terminate the server process.

---

## package.json

The `package.json` file is the manifest for any Node.js project. It defines metadata, dependencies, and automation scripts.

### Important Fields Explained:
1. **`name`**: The unique identifier/name of the project or package (e.g., `"lab-01"`). Must be lowercase and URL-safe.
2. **`version`**: The current version of the project following Semantic Versioning (`MAJOR.MINOR.PATCH`, e.g., `"1.0.0"`).
3. **`description`**: A concise explanation of the project's purpose and functionality.
4. **`main`**: The entry point file of the application (set to `"server.js"`). When someone imports or executes the package root, this file is executed.
5. **`scripts`**: A dictionary of command shortcuts executed via `npm run <script-name>` (or `npm start` / `npm test`):
   - `"start": "node server.js"` — Starts the Express application.
   - `"start:basic": "node basic-server.js"` — Starts the basic Node HTTP server.
   - `"test": "node test.js"` — Runs the automated test suite against the endpoints.
6. **`dependencies`**: Lists third-party npm packages required by the application in production (e.g., `"express": "^5.3.0"`).

---

## node_modules

The `node_modules/` directory is automatically created by npm when packages are installed.

### Purpose and Difference from `package.json`:
- **`package.json`** is a lightweight manifest file (typically 1–2 KB) specifying project metadata, script commands, and direct package requirements. It is committed to Git.
- **`node_modules/`** is the physical directory on disk containing the compiled code and files of all installed packages, plus their transitive dependencies. It contains hundreds of nested folders and thousands of files.
- **Why `node_modules/` must NEVER be committed to Git:**
  1. **Massive Size:** It adds unnecessary megabytes or gigabytes of bloat to the repository.
  2. **Platform Specificity:** Some packages include OS-dependent binary bindings (e.g., Windows vs Linux).
  3. **Reproducibility:** Any developer can regenerate the exact same `node_modules` directory anytime simply by running `npm install`.

---

## Basic HTTP Server (`basic-server.js`)

Before using Express, a basic HTTP server was implemented using the built-in Node.js `http` module.

### Implementation:
```javascript
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello');
});

server.listen(PORT, () => {
  console.log(`[Basic HTTP Server] Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server encountered an error:', err.message);
  }
});
```

### Explanation:
- `http.createServer((req, res) => { ... })`: Registers a request listener callback that triggers whenever an HTTP request hits the server.
- `res.writeHead(200, { 'Content-Type': 'text/plain' })`: Manually sets the HTTP status code and response headers.
- `res.end('Hello')`: Sends the response body and signals completion of the stream.
- `server.listen(PORT, callback)`: Binds the HTTP server to a TCP port to listen for incoming connections.

---

## Express Server (`server.js`)

Express simplifies server creation by providing built-in routing, middleware support, and convenient helper methods like `res.json()`, `res.status()`, and `res.send()`.

### Implementation:
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route 1: GET / - Welcome message
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Node.js and Express Server');
});

// Route 2: GET /about - Student information in JSON
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'E. Mani Kumari',
    registrationNumber: '252U1R5044',
    section: 'AIDE-2A'
  });
});

// Route 3: GET /time - Current date and time
app.get('/time', (req, res) => {
  const currentTime = new Date();
  if (req.query.format === 'json') {
    return res.status(200).json({
      currentTime: currentTime.toISOString(),
      timestamp: currentTime.getTime()
    });
  }
  res.status(200).send(currentTime.toString());
});

// Route 4: 404 Route Handler for Unknown Paths
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
    console.log(`Access the server at http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Error starting server:', err.message);
    }
  });
}

module.exports = app;
```

---

## Routes

| Method | Endpoint | Description | Expected Status Code | Response Type | Sample Response |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **GET** | `/` | Welcome message | `200` | Text/Plain | `Welcome to Node.js and Express Server` |
| **GET** | `/about` | Student name, registration number, and section | `200` | Application/JSON | `{"name":"E. Mani Kumari","registrationNumber":"252U1R5044","section":"AIDE-2A"}` |
| **GET** | `/time` | Current system date and time | `200` | Text/Plain (or JSON via `?format=json`) | `Sun Nov 01 2026 22:55:44 GMT+0530 (India Standard Time)` |
| **GET** | `*` *(any invalid route)* | Route not found error handler | `404` | Application/JSON | `{"message":"Route not found"}` |

---

## Testing

An automated test script (`test.js`) verifies all endpoints, status codes, and response structures.

### Execution Command:
```bash
npm test
```

### Actual Test Suite Results:
```text
> lab-01@1.0.0 test
> node test.js

[TEST SUITE] Starting test suite on http://localhost:3001...

[2026-11-01T17:23:45.456Z] GET /
✅ [PASS] Home Route
   Endpoint: / | Status: 200
   Response: Welcome to Node.js and Express Server

[2026-11-01T17:23:45.493Z] GET /about
✅ [PASS] About Route
   Endpoint: /about | Status: 200
   Response: {"name":"E. Mani Kumari","registrationNumber":"252U1R5044","section":"AIDE-2A"}

[2026-11-01T17:23:45.499Z] GET /time
✅ [PASS] Time Route
   Endpoint: /time | Status: 200
   Response: Sun Nov 01 2026 22:53:45 GMT+0530 (India Standard Time)

[2026-11-01T17:23:45.506Z] GET /time?format=json
✅ [PASS] Time Route (JSON format)
   Endpoint: /time?format=json | Status: 200
   Response: {"currentTime":"2026-11-01T17:23:45.506Z","timestamp":1793553825506}

[2026-11-01T17:23:45.509Z] GET /invalid
✅ [PASS] 404 Not Found Route (/invalid)
   Endpoint: /invalid | Status: 404
   Response: {"message":"Route not found"}

[2026-11-01T17:23:45.512Z] GET /some/other/path
✅ [PASS] 404 Not Found Route (/some/other/path)
   Endpoint: /some/other/path | Status: 404
   Response: {"message":"Route not found"}

[TEST SUMMARY] Tests completed: 6/6 passed.
🎉 All Express endpoint tests PASSED successfully!
```

---

## Screenshots

### 1. Home Route (`GET /`)
Returns a `200 OK` HTTP status code with the welcome message text.

![Home Route](screenshots/home.png)

---

### 2. About Route (`GET /about`)
Returns a `200 OK` HTTP status code with student details in JSON format.

![About Route](screenshots/about.png)

---

### 3. Time Route (`GET /time`)
Returns a `200 OK` HTTP status code with the current date and time string using `new Date()`.

![Time Route](screenshots/time.png)

---

### 4. 404 Route (`GET /invalid`)
Returns a `404 Not Found` HTTP status code with a JSON error message for any unknown path.

![404 Route](screenshots/404.png)

---

### 5. Terminal Showing Server Running
Shows the server starting with `npm start`, listening on port 3000, and logging incoming requests with their status codes.

![Server Running](screenshots/server.png)

---

## Viva Questions & Answers

### Required Lab Manual Questions:

#### 1. What is the difference between package.json and node_modules?
**Answer:**
- **`package.json`** is a lightweight manifest file that lists project metadata (name, version, author), executable scripts (`start`, `test`), and the names and semantic version ranges of direct dependencies. It is committed to Git.
- **`node_modules`** is the physical directory on disk containing the downloaded code, libraries, and binaries of all dependencies and transitive packages. It is very large and should never be committed to Git.

#### 2. What does app.listen do?
**Answer:** `app.listen()` binds the Express application to a specific TCP port (and optionally an IP host) and starts listening for incoming client HTTP requests. Internally, it creates and configures a Node.js `http.Server` instance and invokes its `.listen()` method.

#### 3. What do request and response represent?
**Answer:**
- **`request` (`req`)**: An object representing the incoming HTTP request sent by the client. It contains request headers, HTTP method (GET, POST), URL parameters, query strings, and body payload.
- **`response` (`res`)**: An object representing the outgoing HTTP response sent by the server back to the client. It provides methods such as `res.status()`, `res.send()`, and `res.json()` to set HTTP status codes, headers, and body content.

### Additional Helpful Viva Questions:

#### 4. What is Node.js?
**Answer:** Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript outside the browser. Built on Google Chrome's V8 engine, it utilizes an asynchronous, event-driven, non-blocking I/O model suitable for scalable backend applications.

#### 5. What is Express.js?
**Answer:** Express.js is a minimalist and flexible web application framework for Node.js that provides robust features for building web and mobile applications, including routing, middleware chaining, and template rendering.

#### 6. What is HTTP?
**Answer:** HTTP (Hypertext Transfer Protocol) is an application-layer client-server protocol used to deliver hypermedia files across the web.

#### 7. What is a route?
**Answer:** A route is an application endpoint defined by an HTTP method (e.g., GET, POST) and an associated URL path that executes specific handler logic when matched.

#### 8. What is a 404 status code?
**Answer:** A `404 Not Found` status code indicates that the server successfully received the request, but could not find the requested resource or matching route.

#### 9. What is npm?
**Answer:** `npm` (Node Package Manager) is the default package manager for Node.js, providing an online package registry and a command-line interface to install and manage libraries.

#### 10. What is the difference between Node.js HTTP server and Express server?
**Answer:**
- **Node.js HTTP Server**: Low-level. Requires manual parsing of URLs, manual header writing, and manual routing through switch statements.
- **Express Server**: High-level abstraction over Node's HTTP module. Provides intuitive routing methods (`app.get()`), built-in JSON helpers (`res.json()`), and middleware integration.

---

## Problems Faced and Solutions

1. **IPv6 vs IPv4 Loopback Resolution on Windows (`localhost` vs `127.0.0.1`):**
   - *Problem:* During initial automated testing, node requests to `localhost` occasionally defaulted to IPv6 (`::1`), causing connection timeouts when the server bound exclusively to IPv4.
   - *Solution:* Explicitly tested both `127.0.0.1` and `localhost`, ensuring standard port binding across dual-stack configurations.

2. **Handling 404 Status Codes in Express:**
   - *Problem:* In raw Node.js or basic Express setups, unhandled routes can return a default HTML payload or fail to set an explicit 404 status.
   - *Solution:* Added a catch-all middleware (`app.use((req, res) => { ... })`) placed strictly after all route definitions, returning an explicit `404` status code and a clean JSON object `{ "message": "Route not found" }`.

3. **Dynamic Port Binding for Cloud Deployment:**
   - *Problem:* Hardcoding port `3000` causes deployment failures on cloud platforms (e.g., Render, Railway, Heroku) because cloud providers dynamically inject a port via the `PORT` environment variable.
   - *Solution:* Used `const PORT = process.env.PORT || 3000;`, enabling dynamic cloud configuration while maintaining port `3000` as a default for local development.

---

## Deployment Guide (Render / Railway)

The application is structured to be completely cloud-ready.

### Deployment Steps on Render:
1. Push your repository containing `lab-01` to GitHub.
2. Sign in to [Render](https://render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Root Directory:** `lab-01`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**. Render will automatically assign a `PORT` environment variable and host the application at a public URL (e.g., `https://bdf-lab-01-mani.onrender.com`).
6. Once deployed, copy your live URL and replace `Not applicable` under **Live Deployment Link** at the top of this README.

---

## GitHub Submission Instructions

To submit your lab project to your GitHub course repository:

### 1. Initialize Git in the Course Repository
If Git is not already initialized in your project root, open your terminal and run:
```bash
git init
```

### 2. Verify `.gitignore`
Ensure `.gitignore` contains `node_modules/` so dependencies are not pushed:
```text
node_modules/
.env
.env.*
!.env.example
npm-debug.log*
.DS_Store
```

### 3. Stage Files
```bash
git add .
```

### 4. Commit Changes
```bash
git commit -m "Complete BDF Lab 01: Node.js and Express server with tests and documentation"
```

### 5. Link to Remote Repository & Push
Create a repository on your GitHub account (e.g., `BDF-Labs`), link your local repository, and push:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## Conclusion
In this lab, we successfully built and compared both a native Node.js HTTP server and a modern Express.js server. We developed routes for root (`/`), `/about` (returning structured JSON with student identity), and `/time` (returning dynamic system time), and ensured robust error handling with a `404 Not Found` response for undefined endpoints. The implementation is thoroughly tested, documented, and configured for seamless deployment.
