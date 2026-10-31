<!-- Writing guide: playbooks/reference/readme.md. Keep the same sections as README.md. -->

# Better Left Sidebar

[简体中文](README.md) | English

[![CI](https://github.com/exoticknight/dsh-better-left-sidebar/actions/workflows/ci.yml/badge.svg)](https://github.com/exoticknight/dsh-better-left-sidebar/actions/workflows/ci.yml) [![License](https://img.shields.io/github/license/exoticknight/dsh-better-left-sidebar)](LICENSE) ![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.3-blue) [![Maintained with RED](https://img.shields.io/badge/maintained_with-RED-C1121F)](https://github.com/exoticknight/red)

<!-- Listing badges: add a row here only after each listing is confirmed. See playbooks/reference/badges.md. -->

You need a cleaner DeepSeek Harness sidebar: keep workspaces and conversations in place, and expand full navigation only when you need it.

<!-- client:start -->

<div align="center">
  <img src="https://raw.githubusercontent.com/exoticknight/dsh-better-left-sidebar/main/docs/images/sidebar-en.png" alt="Default layout: a narrow icon rail beside the open workspace and conversation list" width="49%" />
  <img src="https://raw.githubusercontent.com/exoticknight/dsh-better-left-sidebar/main/docs/images/sidebar-hover-en.png" alt="Expanded navigation: full labels overlay the sidebar without moving the conversation pane" width="49%" />
</div>

<p align="center"><sub>Screenshots captured on DSH 0.2.1-rc.3.</sub></p>

<!-- client:end -->

## Features

> This page describes the current source. Short-window navigation improvements are available through the local preview below and have not been published to npm `0.1.0`.

- **Keep conversations in the foreground**: workspaces and conversations stay in a dedicated wide pane; expanded navigation overlays it instead of squeezing the conversation area.
- **Tuck global entry points out of the way**: place the brand, panels, and tools along a narrow left rail to leave more room for browsing sessions.
- **Choose the interaction that fits**: hover or keyboard focus expands the rail by default; click mode pins it open and closes on another click, Escape, or an outside click.
- **Shape the sidebar around your workflow**: reposition the brand, global navigation, and tools, then compare the saved layout with an unsaved preview before applying it.
- **Keep DSH's native actions**: New Session, panels, workspaces, settings, and footer tools keep their DSH entry points and behavior.
- **See widgets in the compact rail**: the clock and widgets you choose sit at the bottom of the rail; enable, disable, and reorder them in settings.

## Install

The current source was verified on DSH `0.2.1-rc.3` in the `web` profile. See the [compatibility record](docs/compatibility.md) for the supported range.

### Everyday users: npm release

The current npm release is `0.1.0`. Install that exact version:

```sh
dsh plugin --profile web add dsh-better-left-sidebar@0.1.0
```

Restart DSH after installing.

### Try the GitHub main preview

You can also install the rolling preview from the public `main` branch. It does not update automatically; reinstall it to get the branch's current contents.

```sh
dsh plugin --profile web add github:exoticknight/dsh-better-left-sidebar#main
```

Restart DSH after installing.

### Developers: local preview

Run these commands from the repository. Development uses the isolated `.dsh-cli/` and `.dsh-dev/` directories; it does not modify your everyday DSH profile.

```sh
pnpm install
```

```sh
pnpm dev:cli 0.2.1-rc.3
```

```sh
pnpm dev
```

## Usage

1. When enabled, the workspace and conversation list stay open; the far-left rail holds the DSH brand, global panels, and tools.
2. In the default mode, hover over the rail or keyboard-focus a navigation item to reveal the full navigation. It closes after you leave it. Choose click mode in the plugin settings to pin or close the rail with the toggle button.
3. Open **Plugins** in the sidebar, then **Better Left Sidebar** to configure expansion, animation, and region placement. Review the preview and select **Save settings** to apply changes. Copy follows DSH's active language; switch between Chinese and English in **Settings → General**.
4. Use **Compact widgets** on the same settings page to manage the clock and compatible widgets. New registrations are enabled by default, and their order and enablement are saved in the current profile.

### Adapt your plugin to the compact rail

Plugin authors can register display-only widgets by following the [compact widget guide](docs/compact-widgets.md). Saved preferences remain available while a plugin is unloaded.

## Configuration

After you select **Save settings**, layout preferences are stored in the current DSH profile's plugin configuration.

| Option | Default | Meaning |
| --- | --- | --- |
| Expansion | `hover` | Expand on hover or keyboard focus; `click` pins the rail open with a toggle. |
| Animation | `standard` | Choose soft, fast, or no animation. |
| Brand | `navigation-top` | Place the brand at the top of the rail, at the top of the conversation pane, or hide it. |
| Global navigation | `rail` | Keep global navigation in the rail or move it above conversations. |
| Tools and status | `rail-bottom` | Keep tools at the bottom of the rail or move them below conversations. |
| Compact widgets | Clock and new registrations enabled | Enable, disable, and reorder widgets in plugin settings; preferences are saved in the current DSH profile. |

## Update, roll back, remove

To refresh the main preview, remove it and reinstall with the command above. To switch to or reinstall the current npm release, `0.1.0`:

```sh
dsh plugin --profile web remove dsh-better-left-sidebar
```

```sh
dsh plugin --profile web add dsh-better-left-sidebar@0.1.0
```

The only stable npm release is currently `0.1.0`, so there is no earlier formal version to roll back to. [View GitHub Releases](https://github.com/exoticknight/dsh-better-left-sidebar/releases).

Removing the plugin uninstalls its package; conversations and other plugins in the DSH profile remain.

Developers can remove the plugin from the isolated preview profile:

```sh
pnpm dev:dsh --profile web plugin remove dsh-better-left-sidebar
```

## Privacy and data

The plugin rearranges DSH's existing sidebar and uses DSH's built-in configuration service to save layout preferences you explicitly submit. It makes no direct network requests, reads no conversation content, writes no workspace files, stores no credentials, and collects no telemetry. DSH manages the profile's configuration storage and sync.

## Compatibility

Supports the `web` profile on DSH `>=0.2.0-rc.2 <0.2.2-0`. With Global navigation set to Above conversations, the global-navigation list scrolls independently to leave room for conversation content and footer tools; it shrinks first in short windows and can reach `0` at extreme heights. DSH's native “Standard mode” label can still truncate at a `567×626` viewport and the default `280px` or minimum `264px` sidebar width; widen the DSH sidebar if the full label matters. See the [compatibility record](docs/compatibility.md).

## Development

See [docs/development.md](docs/development.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [AGENTS.md](AGENTS.md).

## License

[Apache License 2.0](LICENSE)
