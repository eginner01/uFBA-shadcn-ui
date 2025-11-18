# uFBA-shadcn/ui

> 基于 FastAPI 和 shadcn/ui 构建的现代化企业级后台管理系统

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000)

</div>

## 📢 项目说明

本项目重构自 [fastapi_best_architecture_ui](https://github.com/fastapi-practices/fastapi_best_architecture_ui)，使用 shadcn/ui 替代原有 Ant Design 组件库。

### 配套后端项目

本前端项目可配合以下后端项目使用：

- **Python 版本**: [fastapi_best_architecture](https://github.com/fastapi-practices/fastapi_best_architecture) - 基于 FastAPI 的最佳实践架构
- **Go 版本**: [gFBA](https://github.com/eginner01/gFBA) - Go 语言实现
- **Rust 版本**: [rFBA](https://github.com/eginner01/rFBA) - Rust 语言实现

## ✨ 特性

- 🎨 **现代化 UI** - 基于 shadcn/ui 组件库
- 🎯 **TypeScript** - 完整的类型安全支持
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🔐 **权限管理** - 精细化的权限控制系统
- 🔄 **OAuth 登录** - 支持 GitHub、Gmail、Linux.do 第三方登录

## 🏗️ 技术栈

### 核心框架
- **React 18.3.1** - 前端框架
- **TypeScript 5.6.2** - 类型系统
- **Vite 6.0.1** - 构建工具

### UI 组件
- **shadcn/ui** - UI 组件库
- **Radix UI** - 无障碍组件基础
- **Lucide React** - 图标库
- **TailwindCSS** - 原子化 CSS 框架

### 状态管理 & 路由
- **React Router Dom** - 路由管理
- **Context API** - 状态管理

### 工具库
- **Axios** - HTTP 客户端
- **date-fns** - 日期处理
- **clsx** - 类名管理
- **class-variance-authority** - 变体样式管理

## 📦 项目结构

```
web-react/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口定义
│   │   ├── client.ts      # Axios 客户端
│   │   ├── dept.ts        # 部门 API
│   │   ├── dict.ts        # 字典 API
│   │   └── ...
│   ├── components/        # 全局组件
│   │   ├── ui/           # shadcn/ui 组件
│   │   ├── AppHeader.tsx # 应用头部
│   │   ├── ModernSidebar.tsx # 侧边栏
│   │   └── ...
│   ├── contexts/          # Context 上下文
│   │   ├── AuthContext.tsx
│   │   └── ConfirmDialogContext.tsx
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.tsx
│   ├── pages/             # 页面组件
│   │   ├── auth/         # 认证页面
│   │   ├── log/          # 日志页面
│   │   ├── monitor/      # 监控页面
│   │   ├── plugins/      # 插件页面
│   │   ├── scheduler/    # 任务调度
│   │   ├── system/       # 系统管理
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── routes/            # 路由配置
│   │   └── AuthGuard.tsx
│   ├── types/             # TypeScript 类型
│   ├── lib/              # 工具函数
│   │   └── utils.ts
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── .env.development      # 开发环境变量
├── .env.production       # 生产环境变量
├── components.json       # shadcn/ui 配置
├── tailwind.config.js    # TailwindCSS 配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── package.json          # 依赖配置
```

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🔑 环境变量

创建 `.env.development` 和 `.env.production` 文件：

```env
# 开发环境
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_TITLE=uFBA管理系统

# 生产环境
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_TITLE=uFBA管理系统
```

## 📖 功能模块

### 系统管理
- **用户管理** - 用户信息增删改查、角色分配
- **角色管理** - 角色权限配置
- **菜单管理** - 动态菜单配置
- **部门管理** - 组织架构管理
- **插件管理** - 插件启用/禁用

### 日志管理
- **登录日志** - 用户登录记录
- **操作日志** - 系统操作审计

### 系统监控
- **在线用户** - 实时在线用户统计
- **服务器监控** - CPU、内存、磁盘监控
- **Redis监控** - Redis 服务状态

### 任务调度
- **任务管理** - 定时任务配置
- **执行记录** - 任务执行历史

### 插件功能
- **参数设置** - 系统参数配置
- **字典管理** - 数据字典维护
- **通知公告** - 系统公告发布
- **代码生成** - 代码自动生成

## 🎨 主题定制

项目使用 CSS 变量实现主题系统，可以在 `src/index.css` 中修改：

```css
:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.646 0.222 41.116);
  /* ... */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

## 🔐 认证方式

### 账号密码登录
- Admin - 管理员（全部权限）
- Test - 测试用户（受限权限）

### 第三方登录
- GitHub OAuth
- Gmail OAuth  
- Linux.do 社区登录

### 账号注册
- 手机号注册
- 邮箱注册

## 🛠️ 开发指南

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/main.tsx` 添加路由
3. 在侧边栏配置中添加菜单项

### 添加 shadcn/ui 组件

```bash
npx shadcn@latest add [component-name]
```

### API 调用示例

```typescript
import { ApiClient } from '@/api/client';

// GET 请求
const users = await ApiClient.get('/v1/sys/users');

// POST 请求
const newUser = await ApiClient.post('/v1/sys/users', userData);

// PUT 请求
await ApiClient.put(`/v1/sys/users/${id}`, userData);

// DELETE 请求
await ApiClient.delete(`/v1/sys/users/${id}`);
```

## 📝 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 或 PascalCase
- 类型定义使用 `interface` 或 `type`

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 👥 联系方式

- 项目链接: [GitHub Repository](https://github.com/eginner01/uFBA-shadcn-ui.git)
- 问题反馈: [Issues](#)
- 文档: [Documentation](#)

## 🙏 致谢

### 原始项目

本项目基于以下项目重构：

- [fastapi_best_architecture_ui](https://github.com/fastapi-practices/fastapi_best_architecture_ui) - 原始前端项目
- [fastapi_best_architecture](https://github.com/fastapi-practices/fastapi_best_architecture) - Python 后端架构

### 相关项目

- [gFBA](https://github.com/eginner01/gFBA) - Go 语言后端实现
- [rFBA](https://github.com/eginner01/rFBA) - Rust 语言后端实现

---

<div align="center">

Made with ❤️ by uFBA Team

基于 [fastapi_best_architecture_ui](https://github.com/fastapi-practices/fastapi_best_architecture_ui) 重构

© 2024 uFBA-shadcn/ui. All rights reserved.

</div>
