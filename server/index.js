"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DatabaseSync } = require("node:sqlite");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "local-dev-only-change-me";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173";
const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || path.join(__dirname, "..", "data", "app.db");
const ENABLE_DEMO_SEED = process.env.ENABLE_DEMO_SEED === "true";
const allowedOrigins = CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

fs.mkdirSync(path.dirname(SQLITE_DB_PATH), { recursive: true });
const db = new DatabaseSync(SQLITE_DB_PATH);

function dbRun(sql, params = []) {
  return db.prepare(sql).run(...params);
}

function dbGet(sql, params = []) {
  return db.prepare(sql).get(...params) || null;
}

function dbAll(sql, params = []) {
  return db.prepare(sql).all(...params) || [];
}

function mapProjectRow(project) {
  return {
    ...project,
    published: Boolean(project.published),
  };
}

function initializeDatabase() {
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      userId TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      publishedUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  db.exec("CREATE INDEX IF NOT EXISTS idx_projects_userId ON projects(userId)");
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = auth.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.text({ type: "*/*", limit: "5mb" }));
app.use((req, _res, next) => {
  if (typeof req.body === "string") {
    const raw = req.body.trim();
    if (raw) {
      try {
        req.body = JSON.parse(raw);
      } catch (_error) {
        // Leave as-is when payload is not JSON.
      }
    } else {
      req.body = {};
    }
  }
  next();
});

app.get("/", (_req, res) => {
  res.json({
    service: "NexaWeave Studio API",
    status: "ok",
    database: "sqlite",
    endpoints: ["/health", "/auth/signup", "/auth/login", "/auth/me", "/projects"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", database: "sqlite" });
});

app.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = dbAll(
      "SELECT * FROM projects WHERE userId = ? ORDER BY updatedAt DESC",
      [req.user.userId],
    );
    res.json({ projects: projects.map(mapProjectRow) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /projects] Failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/projects", authMiddleware, async (req, res) => {
  let { title, description, content } = req.body || {};

  try {
    if (!title || typeof title !== "string" || !title.trim()) {
      title = "Untitled Project";
    }
    if (content === undefined || content === null) {
      content = { pages: [] };
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    dbRun(
      `
        INSERT INTO projects (id, title, description, content, userId, published, publishedUrl, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        title.trim(),
        typeof description === "string" ? description : null,
        JSON.stringify(content),
        req.user.userId,
        0,
        null,
        now,
        now,
      ],
    );

    const created = dbGet("SELECT * FROM projects WHERE id = ?", [id]);
    res.json({ project: mapProjectRow(created) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[POST /projects] Failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, content, published, publishedUrl } = req.body || {};

  try {
    const existing = dbGet(
      "SELECT * FROM projects WHERE id = ? AND userId = ?",
      [id, req.user.userId],
    );
    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    let nextContent;
    if (content === undefined) {
      nextContent = undefined;
    } else if (content === null) {
      nextContent = JSON.stringify({ pages: [] });
    } else {
      if (typeof content === "object" && !Array.isArray(content.pages)) {
        content.pages = [];
      }
      nextContent = JSON.stringify(content);
    }

    const setClauses = [];
    const params = [];

    if (typeof title === "string") {
      setClauses.push("title = ?");
      params.push(title.trim());
    }
    if (typeof description === "string" || description === null) {
      setClauses.push("description = ?");
      params.push(description);
    }
    if (nextContent !== undefined) {
      setClauses.push("content = ?");
      params.push(nextContent);
    }
    if (typeof published === "boolean") {
      setClauses.push("published = ?");
      params.push(published ? 1 : 0);
    }
    if (typeof publishedUrl === "string" || publishedUrl === null) {
      setClauses.push("publishedUrl = ?");
      params.push(publishedUrl);
    }

    setClauses.push("updatedAt = ?");
    params.push(new Date().toISOString());

    dbRun(
      `UPDATE projects SET ${setClauses.join(", ")} WHERE id = ? AND userId = ?`,
      [...params, id, req.user.userId],
    );

    const updated = dbGet("SELECT * FROM projects WHERE id = ?", [id]);
    res.json({ project: mapProjectRow(updated) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[PUT /projects/:id] Failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = dbRun(
      "DELETE FROM projects WHERE id = ? AND userId = ?",
      [id, req.user.userId],
    );
    if (!result.changes) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[DELETE /projects/:id] Failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/signup", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  try {
    const existing = dbGet("SELECT * FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const now = new Date().toISOString();
    const user = {
      id: crypto.randomUUID(),
      email,
      password: await bcrypt.hash(password, 10),
      name: name || null,
      createdAt: now,
      updatedAt: now,
    };

    dbRun(
      "INSERT INTO users (id, email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [user.id, user.email, user.password, user.name, user.createdAt, user.updatedAt],
    );

    return res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[POST /auth/signup] Failed:", error);
    return res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  try {
    const user = dbGet("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, email: user.email });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[POST /auth/login] Failed:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = dbGet("SELECT id, email, name FROM users WHERE id = ?", [req.user.userId]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /auth/me] Failed:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

function seed() {
  if (!ENABLE_DEMO_SEED) {
    return;
  }

  const email = "test@example.com";
  const password = "Passw0rd!";
  const existing = dbGet("SELECT id FROM users WHERE email = ?", [email]);

  if (existing) {
    // eslint-disable-next-line no-console
    console.log("[seed] Test user already exists");
    return;
  }

  const now = new Date().toISOString();
  dbRun(
    "INSERT INTO users (id, email, password, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [crypto.randomUUID(), email, bcrypt.hashSync(password, 10), "Test User", now, now],
  );
  // eslint-disable-next-line no-console
  console.log("[seed] Created test user test@example.com / Passw0rd!");
}

function startServer() {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be set in production");
    }

    initializeDatabase();
    seed();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`NexaWeave Studio API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[Server] Startup failed:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
