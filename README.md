# 家族树 (Family Tree)

可自托管的家族谱系 Web 应用：交互式可视化家谱树，支持成员资料、事件、相册与多用户共享。

## 🛠 技术栈
- Frontend: React + TypeScript + Vite（Nginx 部署）
- Backend: FastAPI + SQLAlchemy 2.0 + Alembic（Python 3.12 / uv）
- Database: PostgreSQL 18

## 🚀 启动指南 (How to Run)
1. 确保 **Docker Desktop** 已启动。
2. 在项目根目录执行：`docker compose up --build`
3. 等待容器启动完成（首次构建会较久，请耐心等待）…

## 🔗 服务地址 (Services)
- Frontend: http://localhost:3025
- Backend API: http://localhost:8025/api
- API 文档: http://localhost:8025/api/docs
- Database: localhost:5025（user: `familytree` / pass: `familytree` / db: `familytree`）

## 🧪 测试账号
- Admin: `admin` / `admin12345678`

## ✅ Verification
1. 打开 Frontend（http://localhost:3025），使用管理员账号登录。
2. 创建一棵家族树，添加成员并建立亲属关系。
3. 在树视图中确认节点与连线正常显示，可缩放/平移。
4. 上传成员照片或相册图片，确认媒体可正常预览。
5. （可选）打开 API 文档（http://localhost:8025/api/docs）确认接口可访问。

## 🛑 停止 / 清理
```bash
docker compose down          # 停止容器（保留数据卷）
docker compose down -v       # 停止并删除数据卷（清空数据库与媒体）
```

---

## 🐳 Docker 镜像源配置 (Docker Registry Configuration)

### 推荐配置（基于实际项目验证）

#### 1. Docker 镜像
**优先使用官方镜像**（已验证稳定可用）

```yaml
services:
  db:
    image: postgres:18-alpine
  backend:
    build: ./backend
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
```

#### 2. npm 依赖源
**使用淘宝镜像**（国内访问快）

前端 `Dockerfile` 已配置：
```dockerfile
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
```

#### 3. Python / uv 依赖源
后端 `Dockerfile` 已配置清华 PyPI 镜像：
```dockerfile
ENV UV_DEFAULT_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 4. 前端构建加速规范 (Fast Build with npm ci)

1. **本地预处理**: 提交前确保 `frontend/package-lock.json` 存在且为最新。
2. **锁文件必须提交**: 严禁在 `.gitignore` 中忽略锁文件。
3. **容器内安装**: 使用 `npm ci`（比 `npm install` 更快且确定性更强）。

### 常用镜像推荐

| 技术栈 | 推荐镜像 | 说明 |
| :--- | :--- | :--- |
| PostgreSQL | `postgres:18-alpine` | 数据库 |
| Node.js | `node:24-alpine` | 前端构建 |
| Nginx | `nginxinc/nginx-unprivileged:alpine` | 前端生产环境 |
| Python | `python:3.12-slim` | 后端运行时 |

### 使用建议

1. ✅ **优先使用官方镜像**：稳定可靠
2. ✅ **使用 Alpine / slim 版本**：镜像体积小
3. ✅ **配置国内 npm / PyPI 源**：加速构建
4. ✅ **多阶段构建**：减小最终前端镜像体积

### 常见问题

**Q: Docker 镜像拉取失败？**  
A: 检查网络与 Docker Desktop 是否正常运行。

**Q: npm install 很慢？**  
A: 确认 Dockerfile 中已配置：`npm config set registry https://registry.npmmirror.com`

**Q: 是否需要配置 Docker Hub 镜像加速器？**  
A: 通常不需要；如遇拉取失败再考虑配置。

**Q: Docker 端口冲突？**  
A: 本项目按目录 `GSB0825` 约定端口：前端 `3025`、后端 `8025`、数据库 `5025`。可在 `docker-compose.yml` 中修改宿主机端口映射。

---

## 📁 项目结构

```
frontend/            React SPA（Dockerfile + nginx）
backend/             FastAPI 服务（uv + Alembic）
docker-compose.yml   一键启动栈（含 PostgreSQL）
docs/                补充文档（安全、运维等）
```

## 📖 补充文档

- [docs/SETUP.md](./docs/SETUP.md) — 本地非 Docker 开发环境
- [docs/OPERATIONS.md](./docs/OPERATIONS.md) — 备份 / 升级等运维说明
- [docs/SECURITY.md](./docs/SECURITY.md) — 导出加密与鉴权模型
- [docs/I18N_GUIDE.md](./docs/I18N_GUIDE.md) — 多语言约定

## License

本项目基于上游开源项目的 MIT License — 详见 [LICENSE](LICENSE)。
