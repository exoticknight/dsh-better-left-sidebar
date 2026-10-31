<!-- 写作规范见 playbooks/reference/readme.md；与 README.en.md 保持相同章节。 -->

# 更顺手的左侧栏

简体中文 | [English](README.en.md)

[![CI](https://github.com/exoticknight/dsh-better-left-sidebar/actions/workflows/ci.yml/badge.svg)](https://github.com/exoticknight/dsh-better-left-sidebar/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/exoticknight/dsh-better-left-sidebar)](LICENSE) ![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.3-blue) [![Maintained with RED](https://img.shields.io/badge/maintained_with-RED-C1121F)](https://github.com/exoticknight/red)

<!-- Listing badges: add a row here only after each listing is confirmed. See playbooks/reference/badges.md. -->

更清爽、更合理的 DeepSeek Harness 左边栏，支持插件自定义多个小组件。

<!-- client:start -->

<div align="center">
  <img src="https://raw.githubusercontent.com/exoticknight/dsh-better-left-sidebar/main/docs/images/sidebar.png" alt="默认布局：左侧窄图标栏与展开的工作区、会话列表并排" width="49%" />
  <img src="https://raw.githubusercontent.com/exoticknight/dsh-better-left-sidebar/main/docs/images/sidebar-hover.png" alt="展开导航：完整入口覆盖在侧栏上，不会挤动对话区" width="49%" />
</div>

<p align="center"><sub>界面截图基于 DSH 0.2.1-rc.3。</sub></p>

<!-- client:end -->

## 功能

> `0.1.1` 加入收起栏小组件、可配置时钟和分组设置，并包含小窗口导航改进。

- **让会话始终留在主位**：工作区和会话列表保留在独立宽栏；展开导航时覆盖在其上，不会挤窄对话区。
- **把全局入口收纳起来**：品牌、面板和工具可分布在左侧窄栏，空出更完整的会话浏览区域。
- **鼠标、键盘、点击都能顺手操作**：默认悬停或聚焦时展开；也可切换为点击固定展开，并用再次点击、Esc 或外部点击收起。
- **按自己的习惯安排侧栏**：调整品牌、全局导航和工具区的位置；保存前可查看布局效果预览。
- **保留 DSH 原生操作**：新建会话、面板、工作区、设置和页脚工具仍使用 DSH 自己的入口与处理逻辑。
- **在收起栏查看小组件**：时钟和你选择的插件小组件显示在导航栏底部。设置里可以启用、停用、排序，并调整时钟的小时制、月/日、星期和时间颜色。

## 安装

当前源码已在 DSH `0.2.1-rc.3` 的 `web` profile 验证；支持范围见[兼容性记录](docs/compatibility.md)。

### 普通用户：npm 发布版

安装 npm 上的最新发布版：

```sh
dsh plugin --profile web add dsh-better-left-sidebar
```

安装后重启 DSH。

### 从 GitHub 安装

也可以安装对应版本的 GitHub Release：

```sh
dsh plugin --profile web add github:exoticknight/dsh-better-left-sidebar#v0.1.1
```

安装后重启 DSH。

### 开发者：本地预览

在仓库目录运行以下命令。开发版使用独立的 `.dsh-cli/` 与 `.dsh-dev/`，不会改动日常使用的 DSH profile。

```sh
pnpm install
```

```sh
pnpm dev:cli 0.2.1-rc.3
```

```sh
pnpm dev
```

## 使用

1. 插件启用后，工作区与会话列表保持展开；最左侧窄栏放置 DSH 品牌、全局面板和工具入口。
2. 默认将鼠标移入导航栏，或用键盘聚焦导航项，即可展开完整导航；离开导航区域且不再聚焦时自动收起。也可在插件设置中选择“点击展开”，通过点击固定或收起导航。
3. 打开侧栏的“插件”页，进入“更顺手的左侧栏”配置展开方式、动画和区域位置；修改布局后先看预览，再点“保存设置”。文案跟随 DSH 当前语言；在“设置 → 通用设置”切换简体中文或 English。
4. 在同一设置页的“[收起栏小组件](docs/compact-widgets.md)”管理时钟和适配插件的小组件。展开时钟的“显示设置”，可改小时制、日期、星期和时间颜色；日期与星期可同时勾选，旁边的“效果预览”与收起栏同宽。空间不足时，组件行会显示“空间不足，暂未显示”。首次注册默认启用，顺序与启用状态保存在当前 profile。

### 让你的插件适配收起栏

开发者可按[收起栏小组件指南](docs/compact-widgets.md)注册只展示信息的小组件。卸载或暂时未加载的插件仍会保留已保存的设置。

## 配置

布局偏好在点击“保存设置”后写入当前 DSH profile 的插件配置。

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| 展开方式 | `hover` | 悬停或键盘聚焦时展开；也可选 `click`，由按钮固定展开。 |
| 动画 | `standard` | 选择柔和、快速或关闭动画。 |
| 品牌区 | `navigation-top` | 可放在导航栏顶部、对话面板顶部，或隐藏。 |
| 全局导航 | `rail` | 可放在左侧导航栏，或移到对话列表上方。 |
| 工具与状态 | `rail-bottom` | 可放在导航栏底部，或移到对话列表下方。 |
| [收起栏小组件](docs/compact-widgets.md) | 时钟与已注册项目默认启用 | 在插件设置中启用、停用和排序；偏好保存在当前 DSH profile。 |
| 时钟 | 24 小时，月/日，主色 | 小时制可选 12 小时，时间后加 P 或 A。日期和星期可以同时勾选。时间颜色可选“跟随主题”或“自定义颜色”，自定义颜色不随主题变化。预览跟随草稿，保存后收起栏才变。 |

## 更新、回滚与卸载

更新到 `0.1.1` 或重新安装时，先移除插件，再安装精确版本：

```sh
dsh plugin --profile web remove dsh-better-left-sidebar
```

```sh
dsh plugin --profile web add dsh-better-left-sidebar@0.1.1
```

需要回滚时，将安装命令中的版本改为 `0.1.0`。[查看 GitHub Releases](https://github.com/exoticknight/dsh-better-left-sidebar/releases)。

移除插件只会卸载插件包；当前 DSH profile 中的会话和其他插件会保留。

开发者可从隔离的预览 profile 移除插件：

```sh
pnpm dev:dsh --profile web plugin remove dsh-better-left-sidebar
```

## 隐私与数据

插件只调整 DSH 现有侧栏，并通过 DSH 内置配置服务保存你明确提交的布局、组件排序与启用状态、时钟显示偏好。插件不直接发起网络请求、不读取对话内容、不写入工作区文件、不保存凭据，也不采集遥测；配置的存储与同步由 DSH profile 管理。

## 兼容性

支持 DSH `>=0.2.0-rc.2 <0.2.2-0` 的 `web` profile。将“全局导航”设为“对话列表上方”时，导航列表独立滚动，为会话内容和底部工具留出空间；窗口变矮时导航区优先收缩，极端高度下可缩至 `0`。DSH 自带的“Standard mode”标签在 `567×626` 窗口和默认 `280px` 或最小 `264px` 侧栏宽度下仍可能被截断，可调宽 DSH 侧栏。详见[兼容性记录](docs/compatibility.md)。

## 开发

见 [docs/development.md](docs/development.md)、[CONTRIBUTING.md](CONTRIBUTING.md) 与 [AGENTS.md](AGENTS.md)。

## 许可证

[Apache License 2.0](LICENSE)
