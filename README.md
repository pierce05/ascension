# ⚔️ Ascension

> *“Every action earns XP. Every goal becomes a boss. Every day is a system.”*

A scalable, game-inspired backend powering the **Ascension Engine** — a real-life productivity system designed like an RPG.

---

## 🚀 Overview

Ascension Engine transforms daily tasks into a **progression-based system**:

* 🎯 Tasks → Quests
* 🧠 Goals → Boss Fights
* 📈 Effort → XP
* 🔥 Consistency → Streak Multipliers

This backend handles **state, progression, rewards, and system logic** — designed for speed, clarity, and future scalability.

---

## 🧱 Tech Stack

* **Node.js + Express**
* **TypeScript**
* **Clean Architecture (Domain-driven)**
* **MVC-style HTTP layer**
* **File-based persistence (MVP)**
* Minimal dependencies → maximum control

---

## 📁 Project Structure

```text
src/
  app.ts                # Express app config
  server.ts             # Entry point

  config/               # Environment + config setup
  core/                 # Shared core logic

  interfaces/
    http/
      middlewares/      # Auth, error handling, etc.
      routes/           # API routes
      utils/            # Helpers

  modules/
    system/
      domain/           # Business logic (entities, rules)
      application/      # Use cases
      infrastructure/   # Persistence layer
      interfaces/       # Controllers
```

---

## ⚙️ Core Features

* 🧩 Quest creation & completion system
* 🧠 Boss fight mechanics (progress-based goals)
* 🛒 Reward shop with in-game economy
* 🎨 Dynamic theme switching
* 🔥 Streak tracking + multipliers
* 🎲 Random events (e.g., lucky drops)
* ♻️ Full system reset for testing

---

## 🌐 API Endpoints

### System

* `GET /health`
* `GET /api/v1/systems/current` → Fetch full system state

---

### Quests

* `POST /api/v1/systems/quests` → Create quest
* `POST /api/v1/systems/quests/:questId/complete` → Complete quest

---

### Boss Fights

* `POST /api/v1/systems/bosses` → Create boss

---

### Shop

* `POST /api/v1/systems/shop/:itemId/purchase` → Buy item

---

### Events

* `POST /api/v1/systems/events/dismiss` → Dismiss active event

---

### Theme

* `PATCH /api/v1/systems/theme`

```json
{
  "theme": "crimson"
}
```

**Available themes:**

* `crimson` 🔴 (default)
* `violet` 🟣

---

### Reset System

```http
POST /api/v1/systems/reset
```

Resets the entire system state to seed data.

---

## 💾 Persistence

Current MVP uses **file-based storage**:

```
data/system-state.json
```

Override via environment:

```env
STATE_FILE_PATH=C:\your\custom\path.json
```

---

## 🧠 Design Philosophy

This backend is built around:

* **Simplicity first** → No overengineering
* **Game mechanics > CRUD logic**
* **Fast iteration (MVP ready)**
* **Clear separation of concerns**

---

## ⚡ Getting Started

```bash
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## 🔮 Future Roadmap

* 🗄️ Database (PostgreSQL + Prisma)
* 🔐 Authentication (JWT / OAuth)
* 🌍 Multiplayer / Leaderboards
* 🤖 AI-driven quest recommendations
* 📊 Advanced analytics engine
* 📱 Mobile-first API optimizations

---

## 🧩 Philosophy Behind the System

> You don’t rise to your goals.
> You rise to your systems.

Ascension Engine isn’t just a tracker —
it’s a **feedback loop for growth**.

---

## 👑 Status

**MVP complete — evolving into full product.**

---

## ⚔️ Built For

* Developers
* Builders
* High performers
* Anyone who wants to **gamify discipline**

---

**“Keep grinding. Don’t break the chain.”**
