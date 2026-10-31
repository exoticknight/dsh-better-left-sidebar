# DSH plugin directories

Known places where DSH plugins are listed, how each one takes plugins in, and whether it offers a per-plugin badge. The procedure that uses this table is [../50-listings.md](../50-listings.md).

**Last full verification: 2026-09-20.** Submission routes were rechecked on 2026-10-31; current automatic discovery for Awesome DSH Plugin and dshplugin.me was also confirmed that day. The ecosystem changes quickly: sites pause, move, or change their rules. Open the directory's current rules before submitting, and update this file when something has changed.

## Common requirements

Almost every directory checks the same things. 00-init and 10-github already cover them:

- Public GitHub repository with the installable DSH bundle at the repository root (`package.json` `dsh.bundle`, `cordis.patch.yml`, an `apply(ctx)` entry)
- Topics `dsh-plugin` and `deepseek-harness` (many directories only scan topics); `dsh` and `dsh-bundle` help some scanners
- A README with a factual description and a working `dsh plugin add …` install command
- A LICENSE file
- Committed entry files (`lib/`), because several sites read the git tree instead of npm

## A. Automatic (topic scan, nothing to submit)

These pick up public repositories with the `dsh-plugin` topic, usually within a day.

| Directory                        | URL / search                                     | Badge | Notes                                                                                         |
| -------------------------------- | ------------------------------------------------ | ----- | --------------------------------------------------------------------------------------------- |
| Awesome DSH Plugin               | `https://awesome-dsh-plugin.com/`                | yes   | Topic and GitHub description feed an automatic review queue. Author-showcase PRs in `bruc3van/awesome-dsh-plugin` require more than 10 stars. |
| dsh-plugin.org                   | `https://dsh-plugin.org/plugins?q=<name>`        | yes   | Manual submit at `https://dsh-plugin.org/submit` if not picked up.                            |
| dsh-xray                         | `https://unstone.github.io/dsh-xray/p/<owner>__<name>.html` | yes | Capability card, not an endorsement.                                                       |
| DSH Marketplace                  | `https://dshmarketplace.dev/plugins?q=<name>`    | no    | Also has a curated list that takes PRs (section B).                                           |
| DSH Market                       | `https://dsh.market/?q=<owner>%2F<name>`         | yes   | Daily scan; alternatively an issue with the `submit_plugin` template at `2BingLing/dsh-market`. |
| DSH Plugin Radar                 | `https://github.com/AdamPlatin123/dsh-plugin-radar` | no  | Add the `dsh-plugin` topic for discovery; if the scan misses it, PR the community registration to `PLUGINS.md`. The directory runs its own install verification. |
| dsh-plugins.org                  | `https://github.com/lwmxiaobei/dsh-plugins`      | no    | Periodic README snapshot.                                                                     |
| dshplugin.market                 | `https://dshplugin.market`                       | no    | No backend; topic scan only.                                                                  |
| DSH Plugin Hub                   | `https://dshpluginhub.dev/en/plugins?q=<name>`   | no    | Daily scan. Its formal submission asks for third-party GitHub OAuth; do not grant it.          |
| dshplugin.me                     | `https://dshplugin.me/`                          | yes   | Scans public repos with the `dsh-plugin` topic and a factual description. If a tagged plugin is missing after the scan, use an issue or PR at `dshplugin-me/dsh-plugin-radar`. |
| dshplugin.world                  | `https://dshplugin.world/`                        | no    | Topic-based snapshot discovery; if still missing, open an issue titled `[dshplugin.world] list this` in the plugin repo and link it in official Harness Discussions. |

## B. Submission needed

| Directory                    | Route                                                                                                                                             | Badge | Notes                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------- |
| **dsh.pub**                  | Form at `https://dsh.pub/en/submit/`; it opens a PR on `dsh-pub/dsh-pub` for you. The user fills in the form.                                   | yes   | Checks metadata, patch, runtime entry, README and license; never runs code. Usually merged within minutes. Highest priority. |
| Awesome DSH Plugin            | Optional author-showcase PR to `bruc3van/awesome-dsh-plugin` per `CONTRIBUTING.md`                                                               | yes   | The self-promotion lane requires more than 10 stars; otherwise rely on automatic topic discovery. |
| DSH Marketplace curated list | PR to `DshMarketPlace/awesome-dsh-plugin`, add `- repo: <owner>/<name>` under a category in `data/curated.yml`                                  | no    | Requires both topics, install command, license.                                                        |
| Awesome DeepSeek Harness     | PR to `0xsline/awesome-deepseek-harness`: one factual line in the matching category of both language lists; title `docs: add <name>`           | no    | Do not use the list's own Awesome badge.                                                                |
| HackSing DSH Plugins         | Issue form `submit-plugin.yml` at `HackSing/dsh-plugins`                                                                                           | no    |                                                                                                         |
| DeepSeek Harness Plugins     | PR adding to `data/verified-plugins.csv` and its README category in `cccakeee/awesome-dsh-plugins`; an issue can propose the same evidence           | yes   | Current guide requires native loading evidence, install command, license, support range and permission/data-flow disclosure. |
| dshplugin.dev                | Web form at `https://dshplugin.dev/submit` (user fills it in); manual editorial review                                                            | no    | Keep the reference number the form returns.                                                            |
| DSH Plugin Store             | Web form at `https://dshpluginstore.com/submit` (user fills it in); periodic review rounds                                                       | no    | No public queue.                                                                                        |
| dshplugin.io                 | Issue at `tjsdyy/dshplugin`                                                                                                                        | no    | Slow; issues have gone unanswered.                                                                      |
| 1024Store                    | PR adding one JSON entry to `catalog/plugins/exoticknight--dsh-better-left-sidebar.json` in `imsai-sh/awesome-deepseek-harness-plugins`           | no    | The current guide requires a public DSH manifest and `dsh-plugin` topic; passing static-review PRs auto-merge. |

## C. Not a fit for code plugins

- **DSH Themes** (`dsh-themes.com`) takes declarative themes, full skins and visual concepts, not `dsh.bundle` code plugins.
