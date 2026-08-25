# 开发环境 Setup

日常推荐直接用根目录 **Docker 一键启动**（见主 [README.md](../README.md)）。
下面说明本机热重载开发方式。

应用代码在 `frontend/` 与 `backend/`；根目录主要是 Compose 与共享工具。

## 前置条件

- **Docker Desktop** — 启动开发用 Postgres（或完整栈）
- **Node.js** 24（最低 v20.19+ / v22.12+）— 前端
- **Python** 3.12 + **[uv](https://docs.astral.sh/uv/)** — 后端

## 一键 Docker（推荐）

```bash
docker compose up --build
```

- 前端: http://localhost:3025
- 后端 API: http://localhost:8025/api
- 管理员: `admin` / `admin12345678`

## 本机热重载开发

### 1. 启动数据库

```bash
docker compose -f docker-compose.dev.yml up -d db
```

开发库默认：`localhost:5432`，用户/密码/库均为 `familytree`。

### 2. 后端

```bash
cp .env.example .env
# 将 POSTGRES_HOST 改为 localhost（本机连容器数据库）
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

API 文档: http://localhost:8000/api/docs

### 3. 前端

```bash
cd frontend
npm install
npm run dev
```

默认 Vite: http://localhost:1420（已代理 `/api` → 后端）。

## 密码与密钥

生产模式（`ENVIRONMENT=production`）下：

- `SECRET_KEY` 至少 32 字符，且不能是占位符
- `FIRST_ADMIN_PASSWORD` 至少 12 字节，且不能是 `admin` / `change-me` 等弱口令

一键 Compose 已内置满足校验的本地默认值；正式部署请务必更换。
