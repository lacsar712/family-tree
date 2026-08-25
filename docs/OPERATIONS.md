# 运维说明

针对本仓库 `docker compose up --build` 一键栈的日常运维。首次启动见主 [README.md](../README.md) 与 [SETUP.md](SETUP.md)。

## 备份与恢复

需要同时备份 **数据库** 与 **媒体文件**：

| 内容 | 位置 | 说明 |
| :--- | :--- | :--- |
| PostgreSQL | Compose 服务 `db`（卷 `pgdata`） | 成员、关系、用户、设置等 |
| 媒体 | 卷 `media_data`（容器内 `/data`） | 成员照片、相册 |

> 只备份数据库会丢失全部照片（库里只存路径引用）。

### 导出数据库

```bash
docker compose exec -T db pg_dump -U familytree familytree > backup.sql
```

### 恢复数据库

```bash
docker compose exec -T db psql -U familytree familytree < backup.sql
```

### 媒体

媒体在 Docker 命名卷 `media_data` 中。可用 `docker run --rm -v family-tree_media_data:/data -v ${PWD}:/backup alpine tar czf /backup/media.tgz -C /data .` 等方式打包（卷名前缀以 `docker volume ls` 为准）。

也可在管理后台使用应用内备份（`.ftbackup`），加密密钥为实例的 `SECRET_KEY`。

## 升级

```bash
git pull
docker compose up --build -d
```

后端启动时会自动执行 Alembic 迁移。升级前请先备份。

## HTTPS / 反向代理

若对外提供服务，建议在宿主机或网关（Nginx / Caddy / Traefik）终止 TLS，并反代到 `http://localhost:3025`。同时将 Compose 中的 `FRONTEND_URL` / `CORS_ORIGINS` 改为公网 URL。

## Authentik（可选 OIDC）

需要单点登录时，在 `docker-compose.yml` 的 `backend.environment` 中配置：

- `AUTHENTIK_CLIENT_ID` / `AUTHENTIK_CLIENT_SECRET`
- `AUTHENTIK_DISCOVERY_URL`
- `AUTHENTIK_ADMIN_GROUP`（可选，用于同步管理员）

并保证 Authentik 回调地址指向你的 `FRONTEND_URL`。未配置时仅使用本地账号。
