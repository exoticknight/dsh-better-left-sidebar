# Compatibility

| Item         | Value                    |
| ------------ | ------------------------ |
| Minimum DSH  | `{{DSH_MIN_VERSION}}`    |
| Target DSH   | `{{DSH_VERSION}}`        |
| Supported range | `{{DSH_COMPAT_RANGE}}` |
| Verified DSH | Pending plugin-specific verification |
| Node.js      | `^22.19.0 \|\| >=24.0.0` |
| Profile      | `{{DSH_PROFILE}}`        |

## Integration contracts

List each DSH service, slot, route or DOM anchor the plugin relies on, and how the plugin behaves when it is missing. Check this list again whenever the verified DSH version changes.

- Host admission: `peerDependencies` on `@deepseek-ai/dsh` and `@deepseek-ai/dsh-*` are checked with prereleases included. The optional host peer still participates. `engines.dsh` mirrors the range for tooling but does not enforce it. Keep both synchronized with the development target in `config.dshVersion`.
- Client: `./client` registers a lazy CommonJS factory through `window.__ModuleLoader__.load`. Source `inject` lists Cordis services; `dsh.client.external` lists module requests beyond the platform baseline. `dsh.client.inject` is informational metadata. This scaffold has no client module or service dependencies.
- Plugin Manager icon: DSH reads a package-root plugin's top-level `icon` from its exported `package.json`; the path is relative to the package root. This template declares `./icon.svg` and ships it in the npm package. Missing or invalid icons use DSH's default artwork. See the [versioned metadata guide](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/cookbook/adding-a-package.md).
- These contracts were inspected in the published `0.2.0-rc.2` packages `@deepseek-ai/dsh-app-boot`, `@deepseek-ai/dsh-client-modules` and `@deepseek-ai/dsh-package-manifest`. See the [versioned module documentation](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/packages/client/modules/README.md). Recheck them for a different target and record plugin-specific services here.

## Manual verification

<!-- template:start -->

Template baseline checked on 2026-10-04 with Windows, Node 24.20.0 and DSH 0.2.0-rc.2: the template and a generated plugin both logged host `loaded` and browser `client 0.1.0 ready` in isolated homes. The generated plugin installed from the frozen lockfile without pulling the CLI into its dependencies. This evidence covers the blank scaffold; initialization removes this note so new plugin behavior starts with a pending verification record.

<!-- template:end -->

Record the exact DSH version, date and observed host/client behavior. Selecting a target does not verify a plugin. `pnpm smoke` checks installation and merged configuration only; confirm runtime activation with `pnpm dev` and the browser.

- TODO
