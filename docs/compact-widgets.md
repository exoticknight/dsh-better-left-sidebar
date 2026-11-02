# Built-in rail widgets

Better Left Sidebar includes a clock and a balance widget in its 56px navigation rail. Open **Plugins → Better Left Sidebar → Widgets** to enable, disable or reorder them. Changes apply when you select **Save settings**; **Discard changes** restores the saved values.

The widgets belong to the split layout while the whole sidebar is natively expanded. They hide when navigation opens or DSH collapses the whole sidebar, then resume when the compact navigation rail returns.

## Clock

Use **Display settings** to choose 24-hour or 12-hour time, Date, Weekday and a theme-following or custom time color. Date and Weekday are independent. The preview follows the draft; the live rail changes on save.

## Balance

**Wallet currency** selects CNY (default) or USD. The widget shows only that currency. These wallets have separate balances; selecting USD does not convert a CNY balance.

Queries prefer the signed-in DeepSeek Platform account. If it is unavailable or lacks the selected currency, the Host tries the configured official DeepSeek API key. If neither source provides a valid selected balance, the box is empty and takes no rail space. A genuine zero remains visible. The **API balance** label identifies the API-key source.

Active widgets query immediately and refresh about one minute after each query completes. Inactivity or a hidden page pauses subsequent refreshes. Compact or scientific notation keeps long numbers readable; accessible labels retain their exact values. Credential resolution and external requests stay on the Host. See [Privacy and data](../README.en.md#privacy-and-data).

## Widget box

Each box uses the rail's full 56px width. Content supplies its height; the host adds no padding or border. The list keeps complete boxes in saved order while they fit above the native bottom controls. The first box that does not fit and those after it are hidden, without a scrollbar. Settings distinguishes **Hidden: not enough space**, inactive, empty and disabled states.

Built-ins are display-only. Their boxes use `pointer-events: none` so the navigation region retains pointer behavior. Hover expansion and the explicit click/touch toggle remain navigation controls rather than widget controls.

`src/client/compact-widgets.tsx` owns the private collection, keyed boxes and subscriptions. Navigation expansion retains widget instances with `active:false`; disabling a widget unmounts it. Changing order keeps keyed instances. Clock timers and balance polling honor both activity and document visibility. The host portals into one plugin-owned container and renders no extra native footer DOM. The layout adapter reattaches that container when DSH replaces the sidebar root.

## Upgrade from the 0.1.x public slot

`0.2.0` removes the `dsh-better-left-sidebar/slots` type entry and the `dsh-better-left-sidebar.footer.compact` public slot. Third-party registrations through that interface are no longer consumed. Remove that integration, or remain on `0.1.4` until the registering plugin is updated. Retired ids do not create unloaded-widget settings rows; saved clock and layout preferences remain usable.

Third-party footer plugins continue using DSH's native `sidebar.footer.action` contract. The optional **Show compact plugin status** setting reuses their own compact presentation when tools are at Navigation bottom. It does not register them as built-in widgets. See [the compatibility contracts](compatibility.md#integration-contracts) for the rc.3 render-boundary seam.
