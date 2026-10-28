<!-- 写作规范见 playbooks/reference/readme.md；与 README.en.md 保持相同章节。 -->

# Better Left Sidebar

简体中文 | [English](README.en.md)

![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.3-blue) [![Maintained with RED](https://img.shields.io/badge/maintained_with-RED-C1121F)](https://github.com/exoticknight/red)

<!-- Listing badges: add a row here only after each listing is confirmed. See playbooks/reference/badges.md. -->

把全局导航收进最左侧窄栏，同时保留宽侧栏浏览工作区和会话。

<!-- client:start -->

<div align="center">
  <img src="docs/images/sidebar.png" alt="默认状态：左侧为窄图标栏，旁边的工作区与会话列表保持展开" width="49%" />
  <img src="docs/images/sidebar-hover.png" alt="悬停状态：完整导航覆盖在侧栏上，不推动对话区" width="49%" />
</div>

<!-- client:end -->

## 功能

- **工作区和会话更醒目**：会话浏览区保留独立的宽栏，不再与全局入口挤在一起。
- **侧栏按需展开**：全局入口默认显示为图标；鼠标移入或键盘聚焦后，完整导航覆盖在会话栏上，不推动会话内容。
- **对话区保持展开**：工作区与会话列表一直留在原有宽栏，旧的折叠按钮不再占位。
- **常用操作规格一致**：新建会话、面板和页脚入口使用统一的 36px 默认点击区域。
- **保留 DSH 原有面板**：图标、名称、工作区列表、设置和页脚操作仍由 DSH 原有插槽提供。

## 安装

已在 DSH `0.2.0-rc.2`、`0.2.1-rc.2` 和 `0.2.1-rc.3` 的 `web` profile 完成运行验证，兼容范围见记录。当前仓库尚未发布到 npm 或 GitHub Releases。

本地预览请在仓库目录依次运行：

```sh
pnpm install
```

```sh
pnpm dev:cli 0.2.1-rc.3
```

```sh
pnpm dev
```

这会使用仓库内隔离的 DSH 安装和 `.dsh-dev/` 配置，不会改动日常使用的 DSH。安装到本机 DSH 的发布命令会在首个发行版创建后补上。

## 使用

1. 插件加载后，工作区与会话栏保持展开；最左侧显示 DSH 标志、新建会话、全局面板和页脚入口。
2. 将鼠标移入左侧导航，或用键盘聚焦导航项，即可展开覆盖层查看完整名称；移出后收回，不会挤动会话栏。
3. 通过页脚入口打开 DSH 设置；在 DSH `0.2.1` 中，先选“更多 / 账号菜单”，再选“设置”。插件没有单独的设置页面或侧栏折叠按钮。

## 配置

本插件没有可配置项，也不保存独立设置。面板入口和标签来自当前 DSH 页面已注册的面板。

## 更新、回滚与卸载

当前只有本地开发版本，尚无可更新或回滚的发行包。开发预览中，改完代码后重启 `pnpm dev` 即可加载新版本。

从隔离的开发 profile 移除插件：

```sh
pnpm dev:dsh --profile web plugin remove dsh-better-left-sidebar
```

插件不写入设置、浏览器存储或工作区文件；移除后，`.dsh-dev/` 中的会话和其他 DSH 数据仍保留。

## 隐私与数据

插件只调整 DSH 现有侧栏的布局；若 DSH 启动时处于折叠状态，插件会调用原生展开按钮以显示会话栏，并把面板按钮的无障碍名称同步为原生悬停提示。插件自身不发起网络请求、不写入文件、不保存凭据，也不采集遥测。DSH 对话和设置仍按 DSH 自身的存储规则管理。

## 兼容性

见 [docs/compatibility.md](docs/compatibility.md)。

## 开发

见 [docs/development.md](docs/development.md) 与 [CONTRIBUTING.md](CONTRIBUTING.md)。使用 AI agent 开发、发布或维护时，让它先读 [AGENTS.md](AGENTS.md)。

## 许可证

[Apache License 2.0](LICENSE)
