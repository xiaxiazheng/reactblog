# React博客项目架构文档

> 本文档用于提供项目上下文，便于后续开发指令注入

## 项目概览

这是一个功能丰富的个人博客管理系统，采用现代化前端技术栈构建，支持访客端和管理端双端应用。

### 核心特点

- **双端设计**: 访客端（浏览博客）和管理端（内容管理）分离
- **多用户支持**: 支持多用户系统（zbb/hyp）
- **主题切换**: 支持暗色/亮色主题实时切换
- **模块化架构**: 功能模块清晰分离，组件复用度高

---

## 技术栈

### 核心框架
- **React 19.0.0** - 前端UI框架
- **TypeScript 4.4.2** - 类型安全的JavaScript超集

### 构建工具
- **Rspack 1.7.1** - 新一代高性能构建工具（替代Webpack）
  - 使用 `builtin:swc-loader` 进行代码转译
  - 支持React Refresh热更新
  - 代码分割优化

### UI组件库
- **Ant Design 6.0.0** - 企业级UI组件库
- **@ant-design/icons 6.0.0** - Ant Design图标库

### 状态管理
- **React Context API** - 轻量级全局状态（登录、主题、用户）
- **@rematch/core 2.2.0** - 基于Redux的状态管理（仅用于Todo模块）
- **@reduxjs/toolkit 1.9.3** - Redux工具集

### 路由
- **react-router 5.2.1**
- **react-router-dom 5.3.0**

### HTTP请求
- **axios 0.21.4** - HTTP客户端

### 其他关键库
- **react-quill 1.3.3** - 富文本编辑器
- **highlight.js 11.2.0** - 代码高亮
- **echarts 5.2.0** - 数据可视化图表
- **video.js 7.7.5** - 视频播放器
- **dayjs** - 日期处理
- **@xiaxiazheng/blog-libs** - 本地共享库（通过yalc链接）

---

## 目录结构

```
reactblog/
├── public/                    # 静态资源目录
├── src/                      # 源代码目录
│   ├── assets/               # 静态资源（图片、全局样式）
│   │   └── scss/Global.scss  # 全局CSS变量和样式
│   ├── components/           # 公共组件
│   │   ├── color-picker-modal/    # 颜色选择器
│   │   ├── copy-button/           # 复制按钮
│   │   ├── file-image-handle/     # 文件图片处理
│   │   ├── header-admin/          # 管理端头部导航
│   │   ├── header-home/           # 访客端头部导航
│   │   ├── mask-load-image/       # 图片加载遮罩
│   │   ├── modal-wrapper/         # 模态框包装器
│   │   ├── music-player-in-header/ # 音乐播放器
│   │   ├── preview-image/         # 图片预览
│   │   ├── quick-decision-in-header/ # 快捷决策
│   │   └── translate-in-header/   # 翻译功能
│   ├── context/              # React Context状态管理
│   │   ├── IsLoginContext.tsx     # 登录状态
│   │   ├── ThemeContext.tsx       # 主题状态
│   │   └── UserContext.tsx        # 用户信息
│   ├── hooks/                # 自定义Hooks
│   │   ├── useCtrlHook.tsx
│   │   ├── useDocumentTitle.tsx   # 设置页面标题
│   │   ├── useScrollToHooks.tsx
│   │   └── useUpdateEffect.tsx
│   ├── router/               # 路由配置
│   │   ├── index.tsx              # 主路由入口
│   │   ├── AdminRouterView.tsx    # 管理端路由
│   │   ├── HomeRouterView.tsx     # 访客端路由
│   │   └── AuthRoute.tsx          # 路由鉴权
│   ├── views/                # 页面视图组件
│   │   ├── admin/            # 管理首页
│   │   ├── blog/             # 博客模块
│   │   ├── cloud/            # 云存储模块
│   │   ├── cmd/              # 命令行工具
│   │   ├── home/             # 首页
│   │   ├── image-manage/     # 图片管理
│   │   ├── log/              # 日志模块
│   │   ├── login/            # 登录页面
│   │   ├── mao-pu/           # 猫谱模块
│   │   ├── media/            # 媒体模块
│   │   ├── mind-map/         # 思维导图
│   │   ├── music/            # 音乐播放器
│   │   ├── pdf/              # PDF查看器
│   │   ├── settings/         # 系统设置
│   │   ├── test-page/        # 测试页面
│   │   ├── todo-list/        # 待办事项
│   │   └── tree/             # 知识树
│   ├── App.tsx               # 应用根组件
│   ├── env_config.tsx        # 环境配置
│   └── index.tsx             # 应用入口
├── .husky/                   # Git Hooks
├── utils/                    # 工具函数
├── webpackPlugin/            # Webpack插件
├── rspack.config.js          # Rspack构建配置
├── tsconfig.json             # TypeScript配置
├── package.json              # 项目依赖
├── .eslintrc.js              # ESLint配置
└── commitlint.config.js      # Commitlint配置
```

---

## 核心架构

### 1. 状态管理架构

#### Context层次结构

项目使用多层Context Provider嵌套：

```tsx
// App.tsx
<IsLoginProvider>      // 登录状态
  <ThemeProvider>      // 主题状态（dark/light）
    <UserProvider>     // 用户信息（zbb/hyp）
      <SettingsProvider>  // 系统配置
        <Router />
      </SettingsProvider>
    </UserProvider>
  </ThemeProvider>
</IsLoginProvider>
```

**主要Context说明**:

| Context | 状态 | 用途 | 文件位置 |
|---------|------|------|---------|
| IsLoginContext | `isLogin: boolean` | 控制页面访问权限 | [src/context/IsLoginContext.tsx](src/context/IsLoginContext.tsx) |
| ThemeContext | `theme: 'dark' \| 'light'` | 主题切换 | [src/context/ThemeContext.tsx](src/context/ThemeContext.tsx) |
| UserContext | `username: 'zbb' \| 'hyp'` | 多用户支持 | [src/context/UserContext.tsx](src/context/UserContext.tsx) |
| BlogContext | 博客列表状态 | 博客模块共享状态 | [src/views/blog/](src/views/blog/) |
| TreeContext | 树节点状态 | 知识树模块共享状态 | [src/views/tree/](src/views/tree/) |

#### Rematch/Redux状态（仅Todo模块）

位置: [src/views/todo-list/rematch/](src/views/todo-list/rematch/)

```
rematch/
├── index.ts          # Store初始化
└── models/
    ├── data.ts       # 数据模型
    ├── filter.ts     # 筛选模型
    └── edit.ts       # 编辑模型
```

**状态结构**:
```typescript
// filter state
{
  keyword: string,
  activeColor: string[],
  activeCategory: string[],
  startEndTime: any,
  isWork: string,
  pageNo: number,
  pageSize: number
}

// data state
{
  todoLoading: boolean,
  todoList: TodoItemType[],
  doneList: TodoItemType[],
  targetList: TodoItemType[],
  category: CategoryType[]
}
```

### 2. 路由架构

#### 顶层路由

文件: [src/router/index.tsx](src/router/index.tsx)

```tsx
<Switch>
  <Route exact path="/login" component={Login} />
  <Route path="/admin" component={AdminRouterView} />
  <Route path="/pdf" component={PDFView} />
  <Route path="/" component={HomeRouterView} />
</Switch>
```

#### 管理端路由

文件: [src/router/AdminRouterView.tsx](src/router/AdminRouterView.tsx)

使用 `AuthRoute` 进行鉴权保护：

| 路由 | 组件 | 显示在导航 | 说明 |
|------|------|-----------|------|
| `/admin` | Admin | 否 | 管理首页 |
| `/admin/todo-list` | TodoList | 是 | 待办事项 |
| `/admin/blog` | Blog | 是 | 博客管理 |
| `/admin/blog/:blog_id` | BlogCont | 否 | 博客编辑 |
| `/admin/cloud` | Cloud | 是 | 云存储 |
| `/admin/cloud/:parent_id` | Cloud | 否 | 云存储详情 |
| `/admin/cmd` | CMD | 是 | 命令行工具 |
| `/admin/tree` | Tree | 是 | 知识树 |
| `/admin/tree/:first_id/:second_id` | Tree | 否 | 知识树详情 |
| `/admin/mindmap` | MindMap | 否 | 思维导图 |
| `/admin/media` | Media | 否 | 媒体管理 |
| `/admin/settings` | Settings | 否 | 系统设置 |
| `/admin/maopu` | MaoPu | 否 | 猫谱模块 |
| `/admin/test-page` | TestPage | 否 | 测试页面 |

#### 访客端路由

文件: [src/router/HomeRouterView.tsx](src/router/HomeRouterView.tsx)

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/tree` | Tree | 知识树 |
| `/tree/:first_id/:second_id` | Tree | 知识树详情 |
| `/blog` | Blog | 博客列表 |
| `/blog/:blog_id` | BlogCont | 博客详情 |
| `/test-page` | TestPage | 测试页面 |

#### 路由鉴权机制

文件: [src/router/AuthRoute.tsx](src/router/AuthRoute.tsx)

```tsx
const AuthRoute: React.FC<PropsType> = ({ component: Component, ...rest }) => {
  const { isLogin, setIsLogin } = useContext(IsLoginContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogin) {
          checkLoginAsync(); // 异步检查登录状态
          return null;
        }
        return <Component {...props} />;
      }}
    />
  );
};
```

### 3. API架构

#### API调用封装

所有API调用通过 `@xiaxiazheng/blog-libs` 本地库封装

#### 环境配置

文件: [src/env_config.tsx](src/env_config.tsx)

```typescript
// 生产环境
baseUrl = "https://www.xiaxiazheng.cn"
staticUrl = "https://www.xiaxiazheng.cn/static-server"

// 本地开发环境（REACT_APP_IS_LocalHost=yes）
baseUrl = "http://localhost:300"
staticUrl = "http://localhost:2333"
```

#### 认证机制

- **登录**: `postLogin({ username, password })`
- **Token存储**: `access_token` + `refresh_token` 存储在localStorage
- **登录检查**: `checkLogin()` 验证token有效性

#### 主要API函数

| 函数名 | 功能 | 模块 |
|--------|------|------|
| `postLogin()` | 用户登录 | 认证 |
| `checkLogin()` | 检查登录状态 | 认证 |
| `getBlogCont()` | 获取博客内容 | 博客 |
| `getAllBlogList()` / `getShowBlogList()` | 获取博客列表 | 博客 |
| `addBlogCont()` | 新建博客 | 博客 |
| `getTodoList()` | 获取待办列表 | 待办 |
| `addTodoItem()` | 添加待办 | 待办 |
| `getSettingsList()` / `updateSettings()` | 设置管理 | 设置 |

---

## 核心功能模块

### 1. 用户认证模块

**文件**: [src/views/login/index.tsx](src/views/login/index.tsx), [src/context/IsLoginContext.tsx](src/context/IsLoginContext.tsx)

**功能**:
- 用户名密码登录
- JWT Token认证（access_token + refresh_token）
- 设备信任机制
- 登录状态全局管理

### 2. 博客模块

**文件**: [src/views/blog/](src/views/blog/)

**子模块**:
- `blog-list/` - 博客列表展示
- `blog-cont/` - 博客内容查看/编辑
  - 支持富文本和Markdown两种编辑模式
  - 包含锚点导航
- `tag-list/` - 标签管理
- `search-engine/` - 高级搜索
- `filter/` - 筛选过滤

### 3. 待办事项模块

**文件**: [src/views/todo-list/](src/views/todo-list/)

**特点**:
- 使用Rematch进行复杂状态管理
- 多视图布局（书签/目标/目录 | 待办/后续待办 | 已完成）
- 支持分类、颜色标记、工作/生活区分
- 日历视图、打卡功能
- Todo Chain关联

### 4. 知识树模块

**文件**: [src/views/tree/](src/views/tree/)

**功能**:
- 层级树形结构展示
- 支持编辑和查看模式切换
- 穿梭框组件

### 5. 云存储模块

**文件**: [src/views/cloud/](src/views/cloud/)

**功能**: 文件夹和文件管理

### 6. 音乐播放器模块

**文件**: [src/views/music/](src/views/music/), [src/components/music-player-in-header/](src/components/music-player-in-header/)

**功能**:
- 音乐列表展示
- 播放控制
- 搜索过滤

### 7. 系统设置模块

**文件**: [src/views/settings/](src/views/settings/)

**功能**:
- 配置项CRUD操作
- JSON格式配置
- 格式化验证

---

## 样式方案

### 技术选型

- **Sass/SCSS** - CSS预处理器
- **CSS Modules** - 模块化CSS（文件命名 `*.module.scss`）
- **CSS Variables** - 主题变量

### 主题系统

文件: [src/assets/scss/Global.scss](src/assets/scss/Global.scss)

通过CSS变量实现暗色/亮色主题：

```scss
.darkTheme {
  --color: rgba(255, 255, 255, 0.65);
  --color_active: #1890ff;
  --bg_color: #001529;
  --bg_color_hover: rgb(51, 61, 69);
  --border_color: white;
  --keyword_highlight: yellow;
}

.lightTheme {
  --color: #001529;
  --bg_color: rgba(255, 255, 255);
  --bg_color_hover: #abbac5;
  --border_color: #001529;
}
```

**主题切换实现**:
```tsx
// 通过切换App组件的class实现
useEffect(() => {
  let dom = document.querySelector(".App");
  dom.setAttribute("class", `App ${theme}Theme`);
}, [theme]);
```

### Ant Design主题覆盖

文件: [src/antd.scss](src/antd.scss)

自定义Ant Design组件样式：
- Modal、Drawer层级控制
- 暗色主题下的组件样式覆盖
- Select、Input、Tree、Pagination等组件样式定制

---

## 构建配置

### Rspack配置

文件: [rspack.config.js](rspack.config.js)

**关键配置**:
- **入口**: `./src/index.tsx`
- **输出**: `build/static/js/[name].[contenthash:8].js`
- **开发服务器端口**: 3002
- **代码分割**: vendor + common chunks
- **CSS处理**: Sass + PostCSS + CSS Modules
- **路径别名**: `@` 映射到 `src/`

### TypeScript配置

文件: [tsconfig.json](tsconfig.json)

- **编译目标**: ES5
- **模块系统**: ESNext
- **JSX**: react-jsx
- **严格模式**: 已启用

### NPM Scripts

```json
{
  "dev": "rspack serve",
  "build": "rspack build --mode production",
  "devLocal": "cross-env REACT_APP_IS_LocalHost=yes rspack serve",
  "buildLocal": "cross-env REACT_APP_IS_LocalHost=yes rspack build --mode production",
  "push": "sh deploy.sh",
  "prepare": "husky install"
}
```

---

## 开发规范

### 代码质量工具

- **ESLint**: 使用 `plugin:react/recommended`，TypeScript解析器
- **Commitlint**: 遵循 `@commitlint/config-conventional` 规范
- **Husky Hooks**:
  - `pre-commit`: 运行 `yarn checkByted`
  - `commit-msg`: Commitlint检查

### 部署流程

文件: `deploy.sh`

1. 切换Node版本到20
2. 执行生产构建 `yarn build`
3. 进入部署目录 `../blog-deploy`
4. 拉取最新代码 `git pull`
5. 清空并复制构建产物
6. 提交并推送到远程仓库

---

## 本地开发

### 环境要求

- Node.js 20+
- Yarn

### 启动项目

```bash
# 安装依赖
yarn install

# 启动开发服务器（连接生产API）
yarn dev

# 启动开发服务器（连接本地API）
yarn devLocal

# 构建生产版本
yarn build

# 本地库链接（blog-libs）
yalc link @xiaxiazheng/blog-libs
```

### 访问地址

- 开发环境: http://localhost:3002
- 生产环境: https://www.xiaxiazheng.cn

---

## 注意事项

1. **本地库依赖**: 项目依赖 `@xiaxiazheng/blog-libs` 本地库，需通过yalc链接
2. **环境变量**: 使用 `REACT_APP_IS_LocalHost=yes` 切换本地/生产环境
3. **路由鉴权**: 管理端所有路由都需要登录验证
4. **主题系统**: 通过CSS变量实现，注意在新增组件时使用变量而非硬编码颜色
5. **状态管理选择**:
   - 简单全局状态使用 Context API
   - 复杂业务状态（如Todo模块）使用 Rematch

---

## 常见任务指引

### 添加新页面

1. 在 `src/views/` 下创建新的模块文件夹
2. 在 `src/router/AdminRouterView.tsx` 或 `HomeRouterView.tsx` 中添加路由
3. 如果是管理端页面，使用 `AuthRoute` 包裹路由组件
4. 在对应的header组件中添加导航菜单项

### 添加新API

1. 在 `@xiaxiazheng/blog-libs` 库中添加API函数
2. 在组件中导入并使用
3. 注意处理loading状态和错误情况

### 添加新Context

1. 在 `src/context/` 下创建新的Context文件
2. 在 `src/App.tsx` 中添加Provider嵌套
3. 确保Provider嵌套顺序正确（依赖关系）

### 修改主题

1. 修改 `src/assets/scss/Global.scss` 中的CSS变量
2. 如需覆盖Ant Design组件样式，修改 `src/antd.scss`

---

*最后更新: 2026-04-07*
