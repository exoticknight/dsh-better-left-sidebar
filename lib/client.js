window.__ModuleLoader__.load({
  id: "dsh-better-left-sidebar",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/entry.ts
var entry_exports = {};
__export(entry_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(entry_exports);

// src/client/sidebar.css
var sidebar_default = `/* The adapter marks semantic DSH regions; the main pane keeps its native owner and DOM. */
html.dsh-better-left-sidebar {
  --dsh-better-left-sidebar-motion: 180ms;
  --dsh-better-left-sidebar-motion-quick: 120ms;
  --dsh-better-left-sidebar-ease: cubic-bezier(.2, .75, .25, 1);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] {
  --dsh-better-left-sidebar-rail: 56px;
  --dsh-better-left-sidebar-open: 100%;
  --dsh-better-left-sidebar-conversation: calc(100% - var(--dsh-better-left-sidebar-rail));
  position: relative !important;
  display: block !important;
  min-height: 0;
  height: 100%;
  flex: 1 1 auto;
  isolation: isolate;
  overflow: visible;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root]::before {
  position: absolute;
  z-index: 1;
  inset: 0 auto 0 0;
  width: var(--dsh-better-left-sidebar-open);
  clip-path: inset(0 calc(100% - var(--dsh-better-left-sidebar-rail)) 0 0);
  border-right: .5px solid var(--dsw-alias-border-l3);
  background: inherit;
  box-shadow: none;
  content: '';
  pointer-events: none;
  transition: clip-path var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease), box-shadow var(--dsh-better-left-sidebar-motion) ease;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="conversation"] {
  position: absolute !important;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: var(--dsh-better-left-sidebar-rail);
  width: var(--dsh-better-left-sidebar-conversation);
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  margin: 0;
  padding: var(--dsh-better-left-sidebar-conversation-top, 54px) 0 var(--dsh-better-left-sidebar-conversation-bottom, 0) 12px;
  overflow: hidden;
  border-left: .5px solid var(--dsw-alias-border-l3);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="brand"],
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="new-session"],
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="global-navigation"],
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="tools"] {
  box-sizing: border-box;
  min-width: 0;
  margin: 0;
}

/* The logo's native button starts a session too; keep that shortcut in the conversation pane only. */
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] {
  position: absolute;
  z-index: 2;
  top: calc(var(--dsh-better-left-sidebar-chrome, 0px) + 10px);
  left: 0;
  display: flex;
  width: var(--dsh-better-left-sidebar-open);
  height: 36px;
  padding: 0 10px;
  overflow: visible;
  clip-path: inset(0 calc(100% - var(--dsh-better-left-sidebar-rail)) 0 0);
  transition: clip-path var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="sidebar-top"] [data-dsh-better-left-sidebar-region="brand"] {
  position: absolute;
  z-index: 0;
  top: calc(var(--dsh-better-left-sidebar-chrome, 0px) + 10px);
  left: var(--dsh-better-left-sidebar-rail);
  display: flex;
  width: var(--dsh-better-left-sidebar-conversation);
  height: 36px;
  padding: 0 10px;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="hidden"] [data-dsh-better-left-sidebar-region="brand"] {
  display: none !important;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-brand-mark] {
  display: flex;
  width: 36px;
  min-width: 36px;
  justify-content: center;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-brand-name] {
  display: inline-flex;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  white-space: nowrap;
  transition: max-width var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease), opacity var(--dsh-better-left-sidebar-motion-quick) ease;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] [data-dsh-better-left-sidebar-brand-name] {
  max-width: 0;
  visibility: hidden;
}

/* The host centers its full-width logo row; pin its mark inside the clipped 56px rail while compact. */
html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] {
  justify-content: flex-start !important;
}

html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] button {
  width: 36px !important;
  min-width: 36px !important;
  justify-content: flex-start !important;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="brand"] button {
  display: flex;
  width: 100%;
  height: 36px;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="sidebar-top"] [data-dsh-better-left-sidebar-brand-name] {
  max-width: 160px;
  opacity: 1;
}

/* Reposition the native action into the conversation pane without restyling its DSH-owned button. */
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="new-session"] {
  position: absolute;
  z-index: 0;
  top: var(--dsh-better-left-sidebar-session-top, 10px);
  left: calc(var(--dsh-better-left-sidebar-rail) + 14px);
  width: calc(var(--dsh-better-left-sidebar-conversation) - 28px);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="global-navigation"] {
  position: absolute;
  z-index: 2;
  display: flex;
  min-height: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  padding: 0 10px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="global-navigation"]::-webkit-scrollbar,
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-region="tools"]::-webkit-scrollbar {
  display: none;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="rail"] [data-dsh-better-left-sidebar-region="global-navigation"] {
  top: var(--dsh-better-left-sidebar-rail-global-top, 10px);
  right: auto;
  bottom: var(--dsh-better-left-sidebar-nav-bottom-reserve, 44px);
  left: 0;
  width: var(--dsh-better-left-sidebar-open);
  clip-path: inset(0 calc(100% - var(--dsh-better-left-sidebar-rail)) 0 0);
  transition: clip-path var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="conversation-top"] [data-dsh-better-left-sidebar-region="global-navigation"] {
  z-index: 0;
  top: var(--dsh-better-left-sidebar-conversation-global-top, 54px);
  right: 0;
  bottom: auto;
  left: var(--dsh-better-left-sidebar-rail);
  width: var(--dsh-better-left-sidebar-conversation);
  height: var(--dsh-better-left-sidebar-global-height, 76px);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-panel-row] {
  position: relative;
  display: flex;
  width: 36px;
  min-width: 0;
  height: 36px;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
  border: 0;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: inherit;
  transition: background-color var(--dsh-better-left-sidebar-motion-quick) ease;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-panel-glyph] {
  display: inline-flex;
  width: 36px;
  min-width: 36px;
  align-items: center;
  justify-content: center;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-panel-title] {
  display: block;
  min-width: 0;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: max-width var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease), opacity var(--dsh-better-left-sidebar-motion-quick) ease;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="tools"] {
  position: absolute;
  z-index: 2;
  display: flex;
  max-height: calc(100% - 16px);
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-dsh-better-left-sidebar-region="tools"] {
  right: auto;
  bottom: 8px;
  left: 0;
  width: var(--dsh-better-left-sidebar-open);
  padding: 0 10px;
  clip-path: inset(0 calc(100% - var(--dsh-better-left-sidebar-rail)) 0 0);
  transition: clip-path var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="conversation-bottom"] [data-dsh-better-left-sidebar-region="tools"] {
  right: 0;
  bottom: 8px;
  left: var(--dsh-better-left-sidebar-rail);
  width: var(--dsh-better-left-sidebar-conversation);
  padding: 0 10px 0 12px;
}

/* Conversation-side controls must sit above the full-height conversation region while compact. */
html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="new-session"],
html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="sidebar-top"] [data-dsh-better-left-sidebar-region="brand"],
html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="conversation-top"] [data-dsh-better-left-sidebar-region="global-navigation"],
html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="conversation-bottom"] [data-dsh-better-left-sidebar-region="tools"] {
  z-index: 2;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="conversation-bottom"] [data-dsh-better-left-sidebar-region="tools"] {
  z-index: 0;
}

/* The DSH-owned footer slot is inline display:contents; hide its full-width status rows on the compact rail. */
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.footer.action"] {
  display: none !important;
  min-width: 0;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.footer.action"] {
  display: flex !important;
  flex-direction: column;
  width: 100%;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-slot="sidebar.settings"] {
  width: 100%;
  min-width: 0;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button {
  width: 36px;
  min-width: 36px;
  height: 36px;
  gap: 0;
  justify-content: center;
  padding: 0;
  border-radius: var(--dsw-radius-md);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button > span:not([data-slot]) {
  display: inline-flex;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-width var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease), opacity var(--dsh-better-left-sidebar-motion-quick) ease;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button > span:not([data-slot]) {
  max-width: 220px;
  opacity: 1;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button {
  width: 100%;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 10px;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-dsh-better-left-sidebar-settings-trigger-row] {
  width: 36px;
  margin: 0;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-dsh-better-left-sidebar-settings-trigger-row] {
  width: 100%;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-slot="sidebar.settings"] button[aria-label]::after {
  display: none;
  position: absolute;
  z-index: 100;
  top: 50%;
  left: calc(100% + 8px);
  width: max-content;
  max-width: 240px;
  padding: 5px 8px;
  transform: translateY(-50%);
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-shadow-popup, 0 4px 16px rgb(0 0 0 / 18%));
  color: var(--dsw-alias-label-primary-inverted);
  content: attr(aria-label);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button[aria-label]:is(:hover, :focus-visible)::after {
  display: block;
  opacity: 1;
  visibility: visible;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button[aria-label]::after {
  display: none;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-obsolete-collapse] {
  display: none !important;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root]::before {
  clip-path: inset(0);
  box-shadow: 4px 0 18px rgb(0 0 0 / 14%);
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="brand"] {
  clip-path: inset(0);
  background: inherit;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] {
  clip-path: inset(0);
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-brand-position="navigation-top"] [data-dsh-better-left-sidebar-region="brand"] [data-dsh-better-left-sidebar-brand-name] {
  max-width: 200px;
  opacity: 1;
  visibility: visible;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="rail"] [data-dsh-better-left-sidebar-region="global-navigation"],
html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-dsh-better-left-sidebar-region="tools"] {
  clip-path: inset(0);
  background: inherit;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="rail"] [data-dsh-better-left-sidebar-panel-row] {
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
  padding-inline: 0;
}

html.dsh-better-left-sidebar:not(.dsh-better-left-sidebar-expanded) [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="rail"] [data-dsh-better-left-sidebar-panel-row] {
  gap: 0;
  margin-inline: 0;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="rail"] [data-dsh-better-left-sidebar-panel-title] {
  max-width: 200px;
  opacity: 1;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="conversation-top"] [data-dsh-better-left-sidebar-panel-row] {
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
  padding-inline: 0;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-global-position="conversation-top"] [data-dsh-better-left-sidebar-panel-title] {
  max-width: 160px;
  opacity: 1;
}

html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.footer.action"] button,
html.dsh-better-left-sidebar-expanded [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root][data-dsh-better-left-sidebar-tools-position="rail-bottom"] [data-slot="sidebar.settings"] button {
  width: 100%;
  min-width: 0;
  justify-content: flex-start;
  gap: 10px;
  padding-inline: 10px;
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-panel-row]:hover,
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-slot="sidebar.footer.action"] button:hover,
html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-slot="sidebar.settings"] button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

html.dsh-better-left-sidebar [data-slot="sidebar"] > [data-dsh-better-left-sidebar-root] [data-dsh-better-left-sidebar-region="brand"][data-dsh-better-left-sidebar-brand-position="sidebar-top"] button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-toggle {
  position: fixed;
  z-index: 80;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  text-align: start;
  white-space: nowrap;
  cursor: pointer;
  transition: width var(--dsh-better-left-sidebar-motion) var(--dsh-better-left-sidebar-ease), background-color var(--dsh-better-left-sidebar-motion-quick) ease;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-toggle:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-toggle:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: -2px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-toggle [data-dsh-better-left-sidebar-toggle-icon] {
  display: inline-flex;
  width: 36px;
  min-width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-toggle [data-dsh-better-left-sidebar-toggle-label] {
  display: none;
}

html.dsh-better-left-sidebar[data-dsh-better-left-sidebar-animation="fast"] {
  --dsh-better-left-sidebar-motion: 90ms;
  --dsh-better-left-sidebar-motion-quick: 60ms;
}

html.dsh-better-left-sidebar[data-dsh-better-left-sidebar-animation="off"] {
  --dsh-better-left-sidebar-motion: 0ms;
  --dsh-better-left-sidebar-motion-quick: 0ms;
}

@media (prefers-reduced-motion: reduce) {
  html.dsh-better-left-sidebar[data-dsh-better-left-sidebar-animation] {
    --dsh-better-left-sidebar-motion: 0ms;
    --dsh-better-left-sidebar-motion-quick: 0ms;
  }
}

/* DSH-native profile settings: compact controls, a real location preview, and readable states. */
html.dsh-better-left-sidebar .dsh-better-left-sidebar-preferences {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
  color: var(--dsw-alias-label-primary);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-settings-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-settings-group + .dsh-better-left-sidebar-settings-group {
  padding-top: 22px;
  border-top: 1px solid var(--dsw-alias-border-l3);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-settings-group h3 {
  margin: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 17px;
  font-weight: 650;
  line-height: 24px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-row {
  display: grid;
  grid-template-columns: minmax(100px, 150px) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-row legend {
  float: left;
  width: 100%;
  padding: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-option {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 7px;
  padding: 0 11px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  cursor: pointer;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-option:has(input:checked) {
  border-color: var(--dsw-alias-state-business-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-option:has(input:disabled) {
  opacity: .55;
  cursor: default;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-option input {
  flex: none;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-option:focus-within,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-reset:focus-visible,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-cancel:focus-visible,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-position select:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-settings-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-reset,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-cancel {
  min-height: 36px;
  flex: none;
  padding: 0 11px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-reset:hover:not(:disabled),
html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-cancel:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-reset:disabled,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-cancel:disabled {
  opacity: .45;
  cursor: default;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-position-controls {
  display: grid;
  gap: 10px;
  min-width: 0;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-position {
  display: grid;
  grid-template-columns: minmax(130px, 1fr) minmax(180px, 1.2fr);
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-position select {
  width: 100%;
  min-width: 0;
  height: 38px;
  padding: 0 30px 0 10px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-previews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 12px;
  min-width: 0;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-preview {
  min-width: 0;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-base);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-preview figcaption {
  margin: 0 0 9px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-weight: 600;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-canvas {
  display: grid;
  position: relative;
  grid-template-columns: 62px minmax(0, 1fr);
  min-height: 136px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: calc(var(--dsw-radius-md) - 2px);
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  font-size: 10px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-rail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  padding: 7px 3px;
  border-right: 1px solid var(--dsw-alias-border-l3);
  background: var(--dsw-specific-sidebar-fill, var(--dsw-alias-bg-base));
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-conversation {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  padding: 7px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-block,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-session,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-list,
html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-hidden {
  display: flex;
  min-width: 0;
  min-height: 22px;
  align-items: center;
  padding: 3px 5px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-block {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-block.is-brand {
  min-height: 20px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-block.is-navigation {
  min-height: 38px;
  align-items: flex-start;
  padding-top: 6px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-block.is-tools {
  margin-top: auto;
  min-height: 24px;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-session {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-list {
  flex: 1;
  align-items: flex-start;
  padding-top: 8px;
  border: 1px dashed var(--dsw-alias-border-l3);
  overflow-wrap: anywhere;
  text-overflow: clip;
  white-space: normal;
  line-height: 1.35;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-preview-hidden {
  position: absolute;
  right: 7px;
  bottom: 7px;
  width: calc(100% - 58px);
  min-height: auto;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-secondary);
  font-style: italic;
}

html.dsh-better-left-sidebar .dsh-better-left-sidebar-layout-cancel {
  align-self: flex-start;
}

/* Keep sessions open behind a full-width editor, instead of squeezing a form into 287px. */
@media (max-width: 760px) {
  html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-row {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-row legend {
    float: none;
    width: auto;
  }

  html.dsh-better-left-sidebar .dsh-better-left-sidebar-position {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  html.dsh-better-left-sidebar [data-slot='main'] > section:has(> div > aside) {
    position: fixed;
    z-index: 100;
    inset: 0;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: var(--dsw-alias-bg-base);
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] {
    flex-direction: column;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] > div:first-child {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    width: 100%;
    gap: 8px;
    padding: 8px 12px;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] > div:first-child > button {
    width: auto;
    white-space: nowrap;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] nav {
    grid-column: 1 / -1;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] nav > button {
    flex: none;
    max-width: 240px;
    white-space: nowrap;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] > [role='separator'] {
    display: none;
  }

  html.dsh-better-left-sidebar [data-shortcut-modal='settings'] > [data-slot='settings.content'] {
    width: 100%;
    height: auto;
    min-height: 0;
    border-radius: 0;
  }

  html.dsh-better-left-sidebar [data-slot='settings.content'] > div {
    max-width: 100%;
    padding: 20px 16px;
  }
}

@media (max-width: 600px) {
  html.dsh-better-left-sidebar .dsh-better-left-sidebar-settings-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  html.dsh-better-left-sidebar .dsh-better-left-sidebar-choice-options {
    grid-template-columns: 1fr;
  }
}
`;

// src/preferences.ts
var DEFAULT_PREFERENCES = {
  animation: "standard",
  expansion: "hover",
  brandPosition: "navigation-top",
  globalNavigationPosition: "rail",
  toolsPosition: "rail-bottom",
  layoutVersion: void 0
};
var BRAND_POSITIONS = /* @__PURE__ */ new Set(["navigation-top", "sidebar-top", "hidden"]);
var GLOBAL_POSITIONS = /* @__PURE__ */ new Set(["rail", "conversation-top"]);
var TOOLS_POSITIONS = /* @__PURE__ */ new Set(["rail-bottom", "conversation-bottom"]);
function normalizePreferences(value) {
  const input = value && typeof value === "object" ? value : {};
  const animation = input.animation === "fast" || input.animation === "off" ? input.animation : "standard";
  const expansion = input.expansion === "click" ? input.expansion : "hover";
  const brandPosition = isChoice(input.brandPosition, BRAND_POSITIONS) ? input.brandPosition : DEFAULT_PREFERENCES.brandPosition;
  const globalNavigationPosition = isChoice(input.globalNavigationPosition, GLOBAL_POSITIONS) ? input.globalNavigationPosition : DEFAULT_PREFERENCES.globalNavigationPosition;
  const toolsPosition = isChoice(input.toolsPosition, TOOLS_POSITIONS) ? input.toolsPosition : DEFAULT_PREFERENCES.toolsPosition;
  const layoutVersion = input.layoutVersion === 1 ? 1 : void 0;
  return {
    animation,
    expansion,
    brandPosition,
    globalNavigationPosition,
    toolsPosition,
    layoutVersion
  };
}
function isChoice(value, choices) {
  return typeof value === "string" && choices.has(value);
}

// src/client/footer.ts
function createNavigationToggle(onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "dsh-better-left-sidebar-toggle";
  button.setAttribute("data-dsh-better-left-sidebar-toggle", "");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = '<rect x="3.5" y="4" width="17" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 4.5v15" stroke="currentColor" stroke-width="1.6"/><path data-dsh-better-left-sidebar-toggle-chevron="" d="m14 9 3 3-3 3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>';
  const iconWrap = document.createElement("span");
  iconWrap.setAttribute("data-dsh-better-left-sidebar-toggle-icon", "");
  iconWrap.append(icon);
  const label = document.createElement("span");
  label.setAttribute("data-dsh-better-left-sidebar-toggle-label", "");
  button.append(iconWrap, label);
  button.addEventListener("click", onClick);
  return button;
}

// src/client/interaction.ts
var NAV_REGION = '[data-dsh-better-left-sidebar-region="brand"], [data-dsh-better-left-sidebar-region="global-navigation"], [data-dsh-better-left-sidebar-region="tools"]';
var POPUP_SELECTOR = '[role="menu"], [role="listbox"], [role="dialog"], [data-menu-material]';
var ENTER_DELAY = 160;
var CLOSE_DELAY = 210;
var POPUP_PENDING_DELAY = 900;
function connectInteraction() {
  let root;
  let preferences;
  let expansion = "hover";
  let mode = "compact";
  let translate = (key) => key === "closeNavigation" ? "Close navigation" : "Expand navigation";
  let pointerInside = false;
  let focusInside = false;
  let pointerTarget = null;
  let focusTarget = null;
  let enterTimer = 0;
  let closeTimer = 0;
  let popupTimer = 0;
  let popupObserver;
  let knownPopups = /* @__PURE__ */ new Set();
  let associatedPopups = /* @__PURE__ */ new Set();
  let popupPending = false;
  let toggle;
  let resizeObserver;
  let rootIdOwned = false;
  let documentCleanup;
  const classRoot = document.documentElement;
  const isNavTarget = (target) => {
    if (!root || !(target instanceof Element) || !root.contains(target)) return false;
    const region = target.closest(NAV_REGION);
    if (!region) return false;
    if (region.dataset.dshBetterLeftSidebarRegion === "brand") return preferences?.brandPosition === "navigation-top";
    if (region.dataset.dshBetterLeftSidebarRegion === "global-navigation") return preferences?.globalNavigationPosition === "rail";
    return preferences?.toolsPosition === "rail-bottom";
  };
  const isPopupTarget = (target) => {
    if (!(target instanceof Node)) return false;
    for (const popup of associatedPopups) if (popup.isConnected && popup.contains(target)) return true;
    return false;
  };
  const visiblePopups = () => [...document.querySelectorAll(POPUP_SELECTOR)].filter((popup) => {
    const node = popup;
    return !node.hidden && node.getAttribute("aria-hidden") !== "true" && node.getClientRects().length > 0;
  });
  const setMode = (next) => {
    mode = next;
    classRoot.classList.toggle("dsh-better-left-sidebar-expanded", next !== "compact");
    classRoot.classList.toggle("dsh-better-left-sidebar-pinned", next === "pinned");
    syncToggle();
  };
  const clearTimer = (timer) => {
    if (timer) window.clearTimeout(timer);
  };
  const stopPopupTracking = () => {
    popupObserver?.disconnect();
    popupObserver = void 0;
    if (popupTimer) window.clearTimeout(popupTimer);
    popupTimer = 0;
    popupPending = false;
    knownPopups = /* @__PURE__ */ new Set();
    associatedPopups = /* @__PURE__ */ new Set();
  };
  const popupTriggerInScope = (trigger) => {
    return isNavTarget(trigger) || isPopupTarget(trigger);
  };
  const syncPopups = () => {
    const visible = visiblePopups();
    for (const popup of [...associatedPopups]) {
      if (!popup.isConnected || !visible.includes(popup)) associatedPopups.delete(popup);
    }
    const controlledIds = /* @__PURE__ */ new Set();
    const scopes = [];
    if (root) scopes.push(root);
    for (const popup of associatedPopups) scopes.push(popup);
    for (const scope of scopes) {
      for (const trigger of scope.querySelectorAll('[aria-controls][aria-expanded="true"], [aria-controls][data-state="open"]')) {
        const id = trigger.getAttribute("aria-controls");
        if (id && popupTriggerInScope(trigger)) controlledIds.add(id);
      }
    }
    for (const popup of visible) {
      if (!knownPopups.has(popup) || popup.id && controlledIds.has(popup.id)) associatedPopups.add(popup);
    }
    knownPopups = new Set(visible);
    if (associatedPopups.size) {
      popupPending = false;
      if (popupTimer) window.clearTimeout(popupTimer);
      popupTimer = 0;
    }
    if (!associatedPopups.size && !popupPending) {
      stopPopupTracking();
      requestClose();
    }
  };
  const startPopupTracking = (trigger) => {
    const closesExistingPopup = (trigger.getAttribute("aria-expanded") === "true" || trigger.getAttribute("data-state") === "open") && associatedPopups.size > 0;
    if (!popupObserver) {
      knownPopups = new Set(visiblePopups());
      popupPending = !closesExistingPopup;
      popupObserver = new MutationObserver(syncPopups);
      popupObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["aria-expanded", "aria-hidden", "data-state", "hidden", "style"],
        childList: true,
        subtree: true
      });
    } else {
      popupPending = !closesExistingPopup;
      for (const popup of visiblePopups()) knownPopups.add(popup);
    }
    if (closesExistingPopup) {
      if (popupTimer) window.clearTimeout(popupTimer);
      popupTimer = 0;
      return;
    }
    if (popupTimer) window.clearTimeout(popupTimer);
    popupTimer = window.setTimeout(() => {
      popupTimer = 0;
      popupPending = false;
      syncPopups();
      if (!associatedPopups.size) {
        stopPopupTracking();
        requestClose();
      }
    }, POPUP_PENDING_DELAY);
  };
  const popupOwnsInteraction = () => {
    if (popupObserver) syncPopups();
    return popupPending || associatedPopups.size > 0;
  };
  const clearEntryTimer = () => {
    clearTimer(enterTimer);
    enterTimer = 0;
  };
  const clearCloseTimer = () => {
    clearTimer(closeTimer);
    closeTimer = 0;
  };
  const expandTemporarily = () => {
    clearCloseTimer();
    if (mode !== "pinned") setMode("temporary");
  };
  const scheduleEnter = () => {
    clearEntryTimer();
    if (expansion !== "hover" || mode === "pinned" || mode === "temporary") return;
    enterTimer = window.setTimeout(() => {
      enterTimer = 0;
      if (pointerInside && expansion === "hover") expandTemporarily();
    }, ENTER_DELAY);
  };
  const requestClose = () => {
    clearEntryTimer();
    if (mode === "pinned" || pointerInside || focusInside || popupOwnsInteraction()) return;
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      closeTimer = 0;
      if (mode !== "pinned" && !pointerInside && !focusInside && !popupOwnsInteraction()) setMode("compact");
    }, CLOSE_DELAY);
  };
  const refreshStateFromTargets = () => {
    pointerInside = isNavTarget(pointerTarget) || isPopupTarget(pointerTarget);
    focusInside = isNavTarget(focusTarget) || isPopupTarget(focusTarget);
    if (focusInside) expandTemporarily();
    else if (pointerInside) scheduleEnter();
    else requestClose();
  };
  const updateTogglePosition = () => {
    if (!root || !toggle) return;
    const rect = root.getBoundingClientRect();
    const tools = root.querySelector('[data-dsh-better-left-sidebar-region="tools"]');
    const toolReserve = preferences?.toolsPosition === "rail-bottom" && tools ? Math.max(tools.getBoundingClientRect().height, tools.scrollHeight) + 8 : 0;
    toggle.style.left = `${Math.round(rect.left + 10)}px`;
    toggle.style.top = `${Math.max(rect.top + 8, Math.round(rect.bottom - 8 - 36 - toolReserve))}px`;
  };
  const syncToggle = () => {
    if (!toggle) return;
    const pinned = mode === "pinned";
    const expanded = mode !== "compact";
    const label = translate(pinned ? "closeNavigation" : "expandNavigation");
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-pressed", String(pinned));
    toggle.querySelector("[data-dsh-better-left-sidebar-toggle-chevron]")?.setAttribute(
      "d",
      expanded ? "m14 9-3 3 3 3" : "m14 9 3 3-3 3"
    );
    const full = toggle.querySelector("[data-dsh-better-left-sidebar-toggle-label]");
    if (full) full.textContent = label;
    updateTogglePosition();
  };
  const createToggle = () => {
    if (!root || preferences?.expansion !== "click" || toggle) return;
    toggle = createNavigationToggle(onToggleClick);
    document.body.append(toggle);
    resizeObserver = new ResizeObserver(updateTogglePosition);
    resizeObserver.observe(root);
    const tools = root.querySelector('[data-dsh-better-left-sidebar-region="tools"]');
    if (tools) resizeObserver.observe(tools);
    window.addEventListener("resize", updateTogglePosition);
    window.addEventListener("scroll", updateTogglePosition, true);
    syncToggle();
  };
  const removeToggle = () => {
    if (!toggle) return;
    toggle.removeEventListener("click", onToggleClick);
    toggle.remove();
    toggle = void 0;
    resizeObserver?.disconnect();
    resizeObserver = void 0;
    window.removeEventListener("resize", updateTogglePosition);
    window.removeEventListener("scroll", updateTogglePosition, true);
  };
  const onToggleClick = () => {
    if (mode === "pinned") {
      clearEntryTimer();
      clearCloseTimer();
      pointerInside = false;
      focusInside = false;
      setMode("compact");
      return;
    }
    clearEntryTimer();
    clearCloseTimer();
    setMode("pinned");
  };
  const onPointerOver = (event) => {
    const wasInside = pointerInside;
    pointerTarget = event.target;
    if (isNavTarget(event.target)) {
      pointerInside = true;
      if (!wasInside && expansion === "hover") scheduleEnter();
    } else if (isPopupTarget(event.target)) {
      pointerInside = true;
      clearCloseTimer();
    } else {
      pointerInside = false;
      requestClose();
    }
  };
  const onPointerOut = (event) => {
    const nextTarget = event.relatedTarget;
    const entersNavigation = !pointerInside && isNavTarget(nextTarget);
    pointerTarget = nextTarget;
    pointerInside = isNavTarget(nextTarget) || isPopupTarget(nextTarget);
    if (entersNavigation && expansion === "hover") scheduleEnter();
    else if (!pointerInside) requestClose();
  };
  const onFocusIn = (event) => {
    focusTarget = event.target;
    if (isNavTarget(event.target) || isPopupTarget(event.target)) {
      focusInside = true;
      expandTemporarily();
    } else {
      focusInside = false;
      requestClose();
    }
  };
  const onFocusOut = (event) => {
    focusTarget = event.relatedTarget;
    focusInside = isNavTarget(event.relatedTarget) || isPopupTarget(event.relatedTarget);
    if (!focusInside) requestClose();
  };
  const onTriggerIntent = (event) => {
    const target = event.target;
    const trigger = target?.closest("[aria-haspopup], [aria-controls], [aria-expanded]");
    if (!trigger || !(isNavTarget(trigger) || isPopupTarget(trigger))) return;
    startPopupTracking(trigger);
  };
  const onClickCapture = (event) => onTriggerIntent(event);
  const onKeyDownCapture = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") onTriggerIntent(event);
  };
  const onDocumentPointerDown = (event) => {
    if (mode !== "pinned" || toggle?.contains(event.target) || isNavTarget(event.target) || isPopupTarget(event.target)) return;
    pointerInside = false;
    focusInside = false;
    focusTarget = null;
    clearEntryTimer();
    clearCloseTimer();
    setMode("compact");
  };
  const onDocumentKeyDown = (event) => {
    if (event.key !== "Escape" || mode === "compact" || event.defaultPrevented) return;
    if (popupOwnsInteraction()) return;
    clearEntryTimer();
    clearCloseTimer();
    pointerInside = false;
    focusInside = false;
    focusTarget = null;
    setMode("compact");
  };
  const attachDocumentListeners = () => {
    document.addEventListener("pointerover", onPointerOver, true);
    document.addEventListener("pointerout", onPointerOut, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("click", onClickCapture, true);
    document.addEventListener("keydown", onKeyDownCapture, true);
    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => {
      document.removeEventListener("pointerover", onPointerOver, true);
      document.removeEventListener("pointerout", onPointerOut, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("click", onClickCapture, true);
      document.removeEventListener("keydown", onKeyDownCapture, true);
      document.removeEventListener("pointerdown", onDocumentPointerDown, true);
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  };
  documentCleanup = attachDocumentListeners();
  const setRoot = (next) => {
    if (next === root) return;
    if (root && rootIdOwned && root.id === "dsh-better-left-sidebar-navigation") root.removeAttribute("id");
    rootIdOwned = false;
    removeToggle();
    root = next;
    pointerInside = false;
    focusInside = false;
    pointerTarget = null;
    focusTarget = null;
    stopPopupTracking();
    setMode("compact");
    if (!root) return;
    if (!root.id) {
      root.id = "dsh-better-left-sidebar-navigation";
      rootIdOwned = true;
    }
    createToggle();
  };
  return {
    setRoot,
    setPreferences(next) {
      const previous = preferences;
      preferences = next;
      expansion = next.expansion;
      classRoot.setAttribute("data-dsh-better-left-sidebar-animation", next.animation);
      if (previous?.expansion !== next.expansion) {
        clearEntryTimer();
        clearCloseTimer();
        if (mode === "pinned") setMode("compact");
        refreshStateFromTargets();
      } else {
        refreshStateFromTargets();
      }
      if (next.expansion === "click") createToggle();
      else removeToggle();
      syncToggle();
    },
    setTranslate(next) {
      translate = next;
      syncToggle();
    },
    dispose() {
      clearEntryTimer();
      clearCloseTimer();
      stopPopupTracking();
      documentCleanup?.();
      documentCleanup = void 0;
      removeToggle();
      if (root && rootIdOwned && root.id === "dsh-better-left-sidebar-navigation") root.removeAttribute("id");
      rootIdOwned = false;
      root = void 0;
      mode = "compact";
      classRoot.classList.remove("dsh-better-left-sidebar-expanded", "dsh-better-left-sidebar-pinned");
      classRoot.removeAttribute("data-dsh-better-left-sidebar-animation");
    }
  };
}

// src/client/layout-adapter.ts
var DSH = {
  sidebarSlot: '[data-slot="sidebar"]',
  root: ".hHd-Xa_root",
  brand: ":scope > .hHd-Xa_logoRow",
  brandButton: ".hHd-Xa_brand",
  brandMark: ".hHd-Xa_brandMark",
  brandName: ".hHd-Xa_brandName",
  newSession: ":scope > .hHd-Xa_newSession",
  newSessionLabel: ".hHd-Xa_newSessionLabel",
  panelList: ":scope > .hHd-Xa_panelList",
  panelButton: ".hHd-Xa_panelRow",
  panelGlyph: ".hHd-Xa_panelGlyph",
  panelTitle: ".hHd-Xa_panelTitle",
  conversation: ":scope > .hHd-Xa_regionArea",
  tools: ":scope > .hHd-Xa_footArea",
  settingsTriggerRow: ".VOzbGW_triggerRow",
  collapse: ".hHd-Xa_toggle",
  dragStrip: ":scope > div[data-window-drag]:not(:has([data-slot]))"
};
var ROOT_MARK = "data-dsh-better-left-sidebar-root";
var REGION_MARK = "data-dsh-better-left-sidebar-region";
var ROW_MARK = "data-dsh-better-left-sidebar-panel-row";
var GLYPH_MARK = "data-dsh-better-left-sidebar-panel-glyph";
var TITLE_MARK = "data-dsh-better-left-sidebar-panel-title";
function connectLayoutAdapter(onRoot) {
  let preferences;
  let current;
  let sidebarObserver;
  let childrenObserver;
  let measurementObserver;
  let collapseObserver;
  let pendingObserver;
  let resizeObserver;
  let measureFrame = 0;
  let warnedFor = /* @__PURE__ */ new WeakSet();
  const readAnchors = (root) => {
    const brand = root.querySelector(DSH.brand);
    const newSession = root.querySelector(DSH.newSession);
    const panelList = root.querySelector(DSH.panelList);
    const conversation = root.querySelector(DSH.conversation);
    const tools = root.querySelector(DSH.tools);
    const missing = [
      !brand && "brand row",
      !newSession && "New Session action",
      !panelList && "global panel list",
      !conversation && "conversation/workspace region",
      !tools && "footer tools region"
    ].filter(Boolean);
    if (missing.length) {
      if (!warnedFor.has(root)) {
        console.warn(`[dsh-better-left-sidebar] DSH sidebar adapter is inactive: missing ${missing.join(", ")}.`);
        warnedFor.add(root);
      }
      return void 0;
    }
    return { root, brand, newSession, panelList, conversation, tools };
  };
  const writeRegion = (element, region) => {
    element.setAttribute(REGION_MARK, region);
  };
  const annotatePanelRows = (panelList) => {
    for (const row of panelList.querySelectorAll(DSH.panelButton)) {
      row.setAttribute(ROW_MARK, "");
      const glyph = row.querySelector(DSH.panelGlyph);
      const title = row.querySelector(DSH.panelTitle);
      if (glyph) glyph.setAttribute(GLYPH_MARK, "");
      if (title) title.setAttribute(TITLE_MARK, "");
      const label = row.getAttribute("aria-label");
      if (label && (!row.hasAttribute("title") || row.hasAttribute("data-dsh-better-left-sidebar-owned-title"))) {
        row.setAttribute("title", label);
        row.setAttribute("data-dsh-better-left-sidebar-owned-title", "");
      }
    }
  };
  const measure = () => {
    measureFrame = 0;
    const anchors = current;
    if (!anchors?.root.isConnected) return;
    const heightOf = (element) => Math.ceil(Math.max(element.getBoundingClientRect().height, element.scrollHeight));
    const brandHeight = heightOf(anchors.brand);
    const sessionHeight = heightOf(anchors.newSession);
    const toolsHeight = Math.max(heightOf(anchors.tools), 36);
    const chrome = anchors.root.querySelector(DSH.dragStrip) ? 52 : 0;
    const brandOnSidebar = preferences?.brandPosition === "sidebar-top";
    const brandOnRail = preferences?.brandPosition === "navigation-top";
    const sessionTop = chrome + 10 + (brandOnSidebar ? brandHeight + 8 : 0);
    const railGlobalTop = chrome + 10 + (brandOnRail ? brandHeight + 8 : 0);
    const conversationGlobalTop = sessionTop + sessionHeight + 8;
    const panelRows = [...anchors.panelList.querySelectorAll(DSH.panelButton)];
    const rowHeight = panelRows.reduce((height, row) => height + Math.ceil(row.getBoundingClientRect().height), 0);
    const rowGap = Number.parseFloat(getComputedStyle(anchors.panelList).rowGap) || 4;
    const panelContentHeight = Math.max(36, rowHeight + Math.max(0, panelRows.length - 1) * rowGap);
    const conversationHeight = anchors.root.getBoundingClientRect().height;
    const availablePanelHeight = Math.max(36, conversationHeight - conversationGlobalTop - (preferences?.toolsPosition === "conversation-bottom" ? toolsHeight + 8 : 8) - 16);
    const panelHeight = Math.min(panelContentHeight, availablePanelHeight);
    const conversationTop = conversationGlobalTop + (preferences?.globalNavigationPosition === "conversation-top" ? panelHeight + 8 : 0);
    const bottomPad = preferences?.toolsPosition === "conversation-bottom" ? toolsHeight + 8 : 0;
    const navBottomReserve = preferences?.toolsPosition === "rail-bottom" ? toolsHeight + 8 : 8;
    const toggleReserve = preferences?.expansion === "click" ? 44 : 0;
    anchors.root.style.setProperty("--dsh-better-left-sidebar-chrome", `${chrome}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-brand-height", `${brandHeight}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-session-top", `${sessionTop}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-rail-global-top", `${railGlobalTop}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-conversation-global-top", `${conversationGlobalTop}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-global-height", `${panelHeight}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-tools-height", `${toolsHeight}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-conversation-top", `${conversationTop}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-conversation-bottom", `${bottomPad}px`);
    anchors.root.style.setProperty("--dsh-better-left-sidebar-nav-bottom-reserve", `${navBottomReserve + toggleReserve}px`);
  };
  const scheduleMeasure = () => {
    if (measureFrame) window.cancelAnimationFrame(measureFrame);
    measureFrame = window.requestAnimationFrame(measure);
  };
  const apply2 = (anchors, next) => {
    const { root, brand, newSession, panelList, conversation, tools } = anchors;
    root.setAttribute(ROOT_MARK, "");
    root.dataset.dshBetterLeftSidebarBrandPosition = next.brandPosition;
    root.dataset.dshBetterLeftSidebarGlobalPosition = next.globalNavigationPosition;
    root.dataset.dshBetterLeftSidebarToolsPosition = next.toolsPosition;
    root.dataset.dshBetterLeftSidebarExpansion = next.expansion;
    root.dataset.dshBetterLeftSidebarHasDragStrip = String(Boolean(root.querySelector(DSH.dragStrip)));
    writeRegion(brand, "brand");
    writeRegion(newSession, "new-session");
    writeRegion(panelList, "global-navigation");
    writeRegion(conversation, "conversation");
    writeRegion(tools, "tools");
    for (const row of tools.querySelectorAll(DSH.settingsTriggerRow)) {
      row.setAttribute("data-dsh-better-left-sidebar-settings-trigger-row", "");
    }
    const brandButton = brand.querySelector(DSH.brandButton);
    if (brandButton) brandButton.inert = next.brandPosition !== "sidebar-top";
    const brandMark = brand.querySelector(DSH.brandMark);
    const brandName = brand.querySelector(DSH.brandName);
    if (brandMark) brandMark.setAttribute("data-dsh-better-left-sidebar-brand-mark", "");
    if (brandName) brandName.setAttribute("data-dsh-better-left-sidebar-brand-name", "");
    const newSessionLabel = newSession.querySelector(DSH.newSessionLabel);
    newSessionLabel?.setAttribute("data-dsh-better-left-sidebar-session-label", "");
    for (const collapse of root.querySelectorAll(DSH.collapse)) collapse.setAttribute("data-dsh-better-left-sidebar-obsolete-collapse", "");
    annotatePanelRows(panelList);
    scheduleMeasure();
  };
  const detach = () => {
    sidebarObserver?.disconnect();
    childrenObserver?.disconnect();
    measurementObserver?.disconnect();
    collapseObserver?.disconnect();
    resizeObserver?.disconnect();
    sidebarObserver = void 0;
    childrenObserver = void 0;
    measurementObserver = void 0;
    collapseObserver = void 0;
    resizeObserver = void 0;
    if (measureFrame) window.cancelAnimationFrame(measureFrame);
    measureFrame = 0;
    if (current) {
      current.root.removeAttribute(ROOT_MARK);
      current.root.removeAttribute("data-dsh-better-left-sidebar-brand-position");
      current.root.removeAttribute("data-dsh-better-left-sidebar-global-position");
      current.root.removeAttribute("data-dsh-better-left-sidebar-tools-position");
      current.root.removeAttribute("data-dsh-better-left-sidebar-expansion");
      current.root.removeAttribute("data-dsh-better-left-sidebar-has-drag-strip");
      for (const element of [current.brand, current.newSession, current.panelList, current.conversation, current.tools]) {
        element.removeAttribute(REGION_MARK);
      }
      for (const custom of [
        "--dsh-better-left-sidebar-chrome",
        "--dsh-better-left-sidebar-brand-height",
        "--dsh-better-left-sidebar-session-top",
        "--dsh-better-left-sidebar-rail-global-top",
        "--dsh-better-left-sidebar-conversation-global-top",
        "--dsh-better-left-sidebar-global-height",
        "--dsh-better-left-sidebar-tools-height",
        "--dsh-better-left-sidebar-conversation-top",
        "--dsh-better-left-sidebar-conversation-bottom",
        "--dsh-better-left-sidebar-nav-bottom-reserve"
      ]) current.root.style.removeProperty(custom);
      current.brand.querySelector(DSH.brandButton)?.removeAttribute("inert");
      current.root.querySelectorAll(`[${ROW_MARK}], [${GLYPH_MARK}], [${TITLE_MARK}], [data-dsh-better-left-sidebar-brand-mark], [data-dsh-better-left-sidebar-brand-name], [data-dsh-better-left-sidebar-session-label], [data-dsh-better-left-sidebar-obsolete-collapse]`).forEach((element) => {
        for (const attribute of [ROW_MARK, GLYPH_MARK, TITLE_MARK, "data-dsh-better-left-sidebar-brand-mark", "data-dsh-better-left-sidebar-brand-name", "data-dsh-better-left-sidebar-session-label", "data-dsh-better-left-sidebar-obsolete-collapse"]) element.removeAttribute(attribute);
      });
      current.root.querySelectorAll("[data-dsh-better-left-sidebar-settings-trigger-row]").forEach((element) => element.removeAttribute("data-dsh-better-left-sidebar-settings-trigger-row"));
      current.panelList.querySelectorAll("[data-dsh-better-left-sidebar-owned-title]").forEach((element) => {
        element.removeAttribute("title");
        element.removeAttribute("data-dsh-better-left-sidebar-owned-title");
      });
    }
    current = void 0;
  };
  const watchPending = () => {
    if (pendingObserver) return;
    pendingObserver = new MutationObserver(() => {
      if (attach()) {
        pendingObserver?.disconnect();
        pendingObserver = void 0;
      }
    });
    pendingObserver.observe(document.body, { childList: true, subtree: true });
  };
  const attach = () => {
    const sidebar = document.querySelector(DSH.sidebarSlot);
    const root = sidebar?.querySelector(DSH.root);
    if (!sidebar || !root) {
      if (current) {
        detach();
        onRoot(void 0);
      }
      watchPending();
      return false;
    }
    if (current?.root === root) return true;
    detach();
    const anchors = readAnchors(root);
    if (!anchors) {
      onRoot(void 0);
      watchPending();
      return false;
    }
    current = anchors;
    if (preferences) apply2(anchors, preferences);
    onRoot(root);
    if (root.classList.contains("hHd-Xa_collapsed")) root.querySelector(DSH.collapse)?.click();
    childrenObserver = new MutationObserver(() => {
      if (!current || current.root !== root) return;
      const reread = readAnchors(root);
      if (!reread) {
        detach();
        onRoot(void 0);
        watchPending();
        return;
      }
      current = reread;
      if (preferences) apply2(reread, preferences);
    });
    childrenObserver.observe(root, { childList: true, subtree: true });
    collapseObserver = new MutationObserver(() => {
      if (root.classList.contains("hHd-Xa_collapsed")) root.querySelector(DSH.collapse)?.click();
    });
    collapseObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
    resizeObserver = new ResizeObserver(scheduleMeasure);
    for (const element of [anchors.root, anchors.brand, anchors.newSession, anchors.panelList, anchors.tools]) resizeObserver.observe(element);
    measurementObserver = new MutationObserver(scheduleMeasure);
    measurementObserver.observe(anchors.panelList, { childList: true, subtree: true });
    measurementObserver.observe(anchors.tools, { childList: true, subtree: true });
    sidebarObserver = new MutationObserver(() => attach());
    sidebarObserver.observe(sidebar, { childList: true, subtree: true });
    return true;
  };
  const sync = () => {
    attach();
  };
  sync();
  return {
    update(next) {
      preferences = next;
      if (current) apply2(current, next);
    },
    dispose() {
      pendingObserver?.disconnect();
      pendingObserver = void 0;
      detach();
      onRoot(void 0);
    }
  };
}

// src/client/navigation.ts
var import_react = require("react");
function scrollParent(element) {
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(parent).overflowY)) return parent;
  }
  return void 0;
}
function connectNavigation(ctx) {
  const listPositions = /* @__PURE__ */ new WeakMap();
  let restoreFrame;
  const rememberList = (event) => {
    const button = event.target?.closest("li button[aria-label]");
    if (!button?.closest('[data-slot="main"]')?.querySelector('[data-slot="plugins.item"]')) return;
    const container = scrollParent(button);
    if (container && !container.querySelector("[data-dsh-plugin-scroll]")) listPositions.set(container, container.scrollTop);
  };
  document.addEventListener("click", rememberList, true);
  function PluginScrollAnchor({ subject }) {
    const anchor = (0, import_react.useRef)(null);
    const key = subject.kind === "item" ? `item:${subject.id}` : `${subject.kind}:${subject.pkg.name}:${subject.kind === "row" ? subject.row.rowId : ""}`;
    (0, import_react.useLayoutEffect)(() => {
      if (restoreFrame !== void 0) window.cancelAnimationFrame(restoreFrame);
      const container = anchor.current && scrollParent(anchor.current);
      if (!container) return;
      const previous = listPositions.get(container) ?? container.scrollTop;
      container.scrollTop = 0;
      return () => {
        restoreFrame = window.requestAnimationFrame(() => {
          restoreFrame = void 0;
          if (container.isConnected && container.querySelector('[data-slot="plugins.item"]') && !container.querySelector("[data-dsh-plugin-scroll]")) container.scrollTop = previous;
        });
      };
    }, [key]);
    return (0, import_react.createElement)("span", { ref: anchor, hidden: true, "data-dsh-plugin-scroll": "" });
  }
  const offDetails = ctx.slots.inject("plugins.detail.actions", () => ctx.slots.register({
    name: "plugins.detail.actions",
    id: "dsh-better-left-sidebar-scroll"
  }, PluginScrollAnchor));
  return () => {
    offDetails();
    document.removeEventListener("click", rememberList, true);
    if (restoreFrame !== void 0) window.cancelAnimationFrame(restoreFrame);
  };
}

// src/client/settings.ts
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_react2 = require("react");
var NS = "dsh-better-left-sidebar";
var PACKAGE = "dsh-better-left-sidebar";
var en = {
  summary: "Set how navigation opens and where each built-in area lives.",
  navigationBehavior: "Navigation behavior",
  contentLayout: "Content layout",
  expansion: "Expansion",
  expandNavigation: "Expand navigation",
  closeNavigation: "Close navigation",
  animation: "Animation",
  hover: "Hover to expand",
  click: "Click to expand",
  standard: "Soft",
  fast: "Fast",
  off: "Off",
  brand: "Brand",
  globalNavigation: "Global navigation",
  tools: "Tools and status",
  navigationTop: "Navigation top",
  sidebarTop: "Conversation pane top",
  hidden: "Hidden",
  rail: "Navigation rail",
  conversationTop: "Above conversations",
  railBottom: "Navigation bottom",
  conversationBottom: "Below conversations",
  applied: "Applied",
  preview: "Unsaved preview",
  previewBrand: "Brand",
  previewNavigation: "Nav",
  previewTools: "Tools",
  previewNewSession: "New session",
  previewConversations: "Workspaces and conversations",
  resetLayout: "Restore default layout",
  cancel: "Discard changes",
  unavailable: "Settings are unavailable while this component is not loaded.",
  readOnly: "This DSH profile does not allow settings changes.",
  saveFailed: "DSH did not accept these settings. Your draft is still here; try saving again.",
  save: "Save settings",
  saving: "Saving\u2026"
};
var zh = {
  summary: "\u8BBE\u7F6E\u5BFC\u822A\u5C55\u5F00\u65B9\u5F0F\uFF0C\u5E76\u4E3A\u5404\u4E2A\u533A\u57DF\u9009\u62E9\u4F4D\u7F6E\u3002",
  navigationBehavior: "\u5BFC\u822A\u884C\u4E3A",
  contentLayout: "\u5185\u5BB9\u5E03\u5C40",
  expansion: "\u5C55\u5F00\u65B9\u5F0F",
  expandNavigation: "\u5C55\u5F00\u5BFC\u822A",
  closeNavigation: "\u6536\u8D77\u5BFC\u822A",
  animation: "\u52A8\u753B\u6548\u679C",
  hover: "\u60AC\u505C\u5C55\u5F00",
  click: "\u70B9\u51FB\u5C55\u5F00",
  standard: "\u67D4\u548C",
  fast: "\u5FEB\u901F",
  off: "\u65E0\u52A8\u753B",
  brand: "\u54C1\u724C\u533A",
  globalNavigation: "\u5168\u5C40\u5BFC\u822A",
  tools: "\u5DE5\u5177\u4E0E\u72B6\u6001",
  navigationTop: "\u5BFC\u822A\u680F\u9876\u90E8",
  sidebarTop: "\u5BF9\u8BDD\u9762\u677F\u9876\u90E8",
  hidden: "\u9690\u85CF\u54C1\u724C",
  rail: "\u5DE6\u4FA7\u5BFC\u822A\u680F",
  conversationTop: "\u5BF9\u8BDD\u5217\u8868\u4E0A\u65B9",
  railBottom: "\u5BFC\u822A\u680F\u5E95\u90E8",
  conversationBottom: "\u5BF9\u8BDD\u5217\u8868\u4E0B\u65B9",
  applied: "\u5DF2\u751F\u6548",
  preview: "\u672A\u4FDD\u5B58\u9884\u89C8",
  previewBrand: "\u54C1\u724C\u533A",
  previewNavigation: "\u5168\u5C40",
  previewTools: "\u5DE5\u5177",
  previewNewSession: "\u65B0\u5EFA\u4F1A\u8BDD",
  previewConversations: "\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD",
  resetLayout: "\u6062\u590D\u9ED8\u8BA4\u5E03\u5C40",
  cancel: "\u653E\u5F03\u66F4\u6539",
  unavailable: "\u6B64\u7EC4\u4EF6\u672A\u52A0\u8F7D\u65F6\uFF0C\u8BBE\u7F6E\u4E0D\u53EF\u7528\u3002",
  readOnly: "\u5F53\u524D DSH profile \u4E0D\u5141\u8BB8\u4FEE\u6539\u8BBE\u7F6E\u3002",
  saveFailed: "DSH \u672A\u63A5\u53D7\u8FD9\u4E9B\u8BBE\u7F6E\u3002\u8349\u7A3F\u4ECD\u4FDD\u7559\uFF0C\u8BF7\u91CD\u8BD5\u4FDD\u5B58\u3002",
  save: "\u4FDD\u5B58\u8BBE\u7F6E",
  saving: "\u4FDD\u5B58\u4E2D\u2026"
};
var animationValues = ["standard", "fast", "off"];
var expansionValues = ["hover", "click"];
var brandValues = ["navigation-top", "sidebar-top", "hidden"];
var globalValues = ["rail", "conversation-top"];
var toolsValues = ["rail-bottom", "conversation-bottom"];
var fields = [
  choiceField("animation", animationValues),
  choiceField("expansion", expansionValues),
  choiceField("brandPosition", brandValues),
  choiceField("globalNavigationPosition", globalValues),
  choiceField("toolsPosition", toolsValues),
  {
    field: "layoutVersion",
    format: (value) => value === 1 ? "1" : "",
    parse: (text) => text === "1" ? { kind: "set", value: 1 } : text === "" ? { kind: "clear" } : void 0
  }
];
function choiceField(field, values) {
  return {
    field,
    format: (value) => typeof value === "string" && values.includes(value) ? value : values[0],
    parse: (text) => values.includes(text) ? { kind: "set", value: text } : void 0
  };
}
function connectSettings(ctx, onPreferences, onTranslate) {
  ctx.inject(["locale", "configForms"], (settingsCtx) => {
    const form = settingsCtx.configForms.get(PACKAGE);
    settingsCtx.effect(() => {
      const sync = () => onPreferences(form.getSnapshot().value);
      sync();
      return form.subscribe(sync);
    }, "better-left-sidebar: profile preferences");
    settingsCtx.effect(
      () => settingsCtx.locale.register(NS, { zh, en }),
      "better-left-sidebar: settings copy"
    );
    settingsCtx.effect(() => {
      const sync = () => onTranslate(settingsCtx.locale.bind(NS));
      sync();
      return settingsCtx.locale.subscribe(sync);
    }, "better-left-sidebar: toggle copy");
    settingsCtx.effect(
      () => settingsCtx.slots.inject("plugins.bundle.config", () => settingsCtx.slots.register(
        { name: "plugins.bundle.config", key: PACKAGE, locale: NS },
        (props) => (0, import_react2.createElement)(SettingsPage, { ...props, ctx: settingsCtx })
      )),
      "better-left-sidebar: settings page"
    );
  });
}
function SettingsPage(props) {
  const { ctx, t } = props;
  const scope = (0, import_react2.useMemo)(
    () => ctx.configForms.get(PACKAGE),
    [ctx]
  );
  const model = (0, import_react2.useMemo)(() => new import_dsh_client_ui_primitives.SettingsFormModel(scope, fields), [scope]);
  (0, import_react2.useEffect)(() => () => model.dispose(), [model]);
  const store = (0, import_react2.useMemo)(() => model.bind(() => ({
    shell: model.shell(),
    fields: Object.fromEntries(fields.map((spec) => [spec.field, model.field(spec.field)]))
  })), [model]);
  const subscribe = (0, import_react2.useCallback)((listener) => store.subscribe(listener), [store]);
  const getSnapshot = (0, import_react2.useCallback)(() => store.getSnapshot(), [store]);
  const view = (0, import_react2.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  const actions = (0, import_react2.useMemo)(() => model.actions(), [model]);
  const disabled = !view.shell.writable || view.shell.saving;
  const savedSnapshot = scope.getSnapshot();
  const savedPreferences = normalizePreferences(savedSnapshot.value);
  const draft = normalizePreferences({
    ...savedSnapshot.value,
    animation: view.fields.animation?.text,
    expansion: view.fields.expansion?.text,
    brandPosition: view.fields.brandPosition?.text,
    globalNavigationPosition: view.fields.globalNavigationPosition?.text,
    toolsPosition: view.fields.toolsPosition?.text
  });
  const userLayer = savedSnapshot.user && typeof savedSnapshot.user === "object" ? savedSnapshot.user : {};
  const draftMatchesDefaults = sameLayout(draft, DEFAULT_PREFERENCES);
  const canRestore = !draftMatchesDefaults || userLayer.layoutVersion !== 1;
  const setChoice = (field, value) => {
    actions.edit(field, value);
    actions.edit("layoutVersion", "1");
  };
  if (props.view === "summary") return (0, import_react2.createElement)("p", null, t("summary"));
  return (0, import_react2.createElement)(import_dsh_client_ui_primitives.SettingsForm, {
    labels: {
      unavailable: t("unavailable"),
      readOnly: t("readOnly"),
      saveFailed: t("saveFailed"),
      save: t("save"),
      saving: t("saving")
    },
    state: view.shell,
    onSave: actions.save,
    onDiscard: actions.discard,
    children: (0, import_react2.createElement)(
      "div",
      { className: "dsh-better-left-sidebar-preferences" },
      (0, import_react2.createElement)(
        "section",
        { className: "dsh-better-left-sidebar-settings-group" },
        (0, import_react2.createElement)("h3", null, t("navigationBehavior")),
        (0, import_react2.createElement)(ChoiceRow, {
          name: "dsh-better-left-sidebar-expansion",
          label: t("expansion"),
          value: view.fields.expansion.text,
          disabled,
          options: expansionValues.map((value) => ({ value, label: t(value) })),
          onChange: (value) => actions.edit("expansion", value)
        }),
        (0, import_react2.createElement)(ChoiceRow, {
          name: "dsh-better-left-sidebar-animation",
          label: t("animation"),
          value: view.fields.animation.text,
          disabled,
          options: animationValues.map((value) => ({ value, label: t(value) })),
          onChange: (value) => actions.edit("animation", value)
        })
      ),
      (0, import_react2.createElement)(
        "section",
        { className: "dsh-better-left-sidebar-settings-group" },
        (0, import_react2.createElement)(
          "div",
          { className: "dsh-better-left-sidebar-settings-heading" },
          (0, import_react2.createElement)("h3", null, t("contentLayout")),
          (0, import_react2.createElement)("button", {
            type: "button",
            className: "dsh-better-left-sidebar-layout-reset",
            disabled: disabled || !canRestore,
            onClick: () => {
              actions.edit("brandPosition", DEFAULT_PREFERENCES.brandPosition);
              actions.edit("globalNavigationPosition", DEFAULT_PREFERENCES.globalNavigationPosition);
              actions.edit("toolsPosition", DEFAULT_PREFERENCES.toolsPosition);
              actions.edit("layoutVersion", "1");
            }
          }, t("resetLayout"))
        ),
        (0, import_react2.createElement)(
          "div",
          { className: "dsh-better-left-sidebar-position-controls" },
          (0, import_react2.createElement)(PositionSelect, {
            field: "brandPosition",
            label: t("brand"),
            value: view.fields.brandPosition.text,
            disabled,
            options: brandValues.map((value) => ({ value, label: brandLabel(t, value) })),
            onChange: (value) => setChoice("brandPosition", value)
          }),
          (0, import_react2.createElement)(PositionSelect, {
            field: "globalNavigationPosition",
            label: t("globalNavigation"),
            value: view.fields.globalNavigationPosition.text,
            disabled,
            options: globalValues.map((value) => ({ value, label: globalLabel(t, value) })),
            onChange: (value) => setChoice("globalNavigationPosition", value)
          }),
          (0, import_react2.createElement)(PositionSelect, {
            field: "toolsPosition",
            label: t("tools"),
            value: view.fields.toolsPosition.text,
            disabled,
            options: toolsValues.map((value) => ({ value, label: toolsLabel(t, value) })),
            onChange: (value) => setChoice("toolsPosition", value)
          })
        ),
        (0, import_react2.createElement)(
          "div",
          { className: "dsh-better-left-sidebar-layout-previews", "aria-live": "polite" },
          view.shell.dirty ? (0, import_react2.createElement)(LayoutPreview, { title: t("applied"), preferences: savedPreferences, t }) : null,
          (0, import_react2.createElement)(LayoutPreview, { title: view.shell.dirty ? t("preview") : t("applied"), preferences: draft, t })
        ),
        view.shell.dirty ? (0, import_react2.createElement)("button", {
          type: "button",
          className: "dsh-better-left-sidebar-layout-cancel",
          disabled: view.shell.saving,
          onClick: actions.discard
        }, t("cancel")) : null
      )
    )
  });
}
function sameLayout(a, b) {
  return a.brandPosition === b.brandPosition && a.globalNavigationPosition === b.globalNavigationPosition && a.toolsPosition === b.toolsPosition;
}
function ChoiceRow(props) {
  return (0, import_react2.createElement)(
    "fieldset",
    { className: "dsh-better-left-sidebar-choice-row", disabled: props.disabled },
    (0, import_react2.createElement)("legend", null, props.label),
    (0, import_react2.createElement)(
      "div",
      { className: "dsh-better-left-sidebar-choice-options" },
      ...props.options.map((option) => (0, import_react2.createElement)(
        "label",
        {
          key: option.value,
          className: "dsh-better-left-sidebar-choice-option"
        },
        (0, import_react2.createElement)("input", {
          type: "radio",
          name: props.name,
          value: option.value,
          checked: props.value === option.value,
          onChange: () => props.onChange(option.value)
        }),
        (0, import_react2.createElement)("span", null, option.label)
      ))
    )
  );
}
function PositionSelect(props) {
  return (0, import_react2.createElement)(
    "label",
    { className: "dsh-better-left-sidebar-position" },
    (0, import_react2.createElement)("span", null, props.label),
    (0, import_react2.createElement)(
      "select",
      {
        name: props.field,
        "aria-label": props.label,
        value: props.value,
        disabled: props.disabled,
        onChange: (event) => props.onChange(event.currentTarget.value)
      },
      ...props.options.map((option) => (0, import_react2.createElement)("option", { key: option.value, value: option.value }, option.label))
    )
  );
}
function LayoutPreview(props) {
  const { preferences, t } = props;
  return (0, import_react2.createElement)(
    "figure",
    { className: "dsh-better-left-sidebar-layout-preview" },
    (0, import_react2.createElement)("figcaption", null, props.title),
    (0, import_react2.createElement)(
      "div",
      {
        className: "dsh-better-left-sidebar-preview-canvas",
        role: "img",
        "aria-label": `${t("brand")}: ${brandLabel(t, preferences.brandPosition)}; ${t("globalNavigation")}: ${globalLabel(t, preferences.globalNavigationPosition)}; ${t("tools")}: ${toolsLabel(t, preferences.toolsPosition)}`
      },
      (0, import_react2.createElement)(
        "div",
        { className: "dsh-better-left-sidebar-preview-rail" },
        preferences.brandPosition === "navigation-top" ? (0, import_react2.createElement)(PreviewBlock, { kind: "brand", label: t("previewBrand") }) : null,
        preferences.globalNavigationPosition === "rail" ? (0, import_react2.createElement)(PreviewBlock, { kind: "navigation", label: t("previewNavigation") }) : null,
        preferences.toolsPosition === "rail-bottom" ? (0, import_react2.createElement)(PreviewBlock, { kind: "tools", label: t("previewTools") }) : null
      ),
      (0, import_react2.createElement)(
        "div",
        { className: "dsh-better-left-sidebar-preview-conversation" },
        preferences.brandPosition === "sidebar-top" ? (0, import_react2.createElement)(PreviewBlock, { kind: "brand", label: t("previewBrand") }) : null,
        (0, import_react2.createElement)("div", { className: "dsh-better-left-sidebar-preview-session" }, t("previewNewSession")),
        preferences.globalNavigationPosition === "conversation-top" ? (0, import_react2.createElement)(PreviewBlock, { kind: "navigation", label: t("previewNavigation") }) : null,
        (0, import_react2.createElement)("div", { className: "dsh-better-left-sidebar-preview-list" }, t("previewConversations")),
        preferences.toolsPosition === "conversation-bottom" ? (0, import_react2.createElement)(PreviewBlock, { kind: "tools", label: t("previewTools") }) : null
      ),
      preferences.brandPosition === "hidden" ? (0, import_react2.createElement)("div", { className: "dsh-better-left-sidebar-preview-hidden" }, `${t("previewBrand")} \xB7 ${t("hidden")}`) : null
    )
  );
}
function brandLabel(t, value) {
  return t(value === "navigation-top" ? "navigationTop" : value === "sidebar-top" ? "sidebarTop" : "hidden");
}
function globalLabel(t, value) {
  return t(value === "rail" ? "rail" : "conversationTop");
}
function toolsLabel(t, value) {
  return t(value === "rail-bottom" ? "railBottom" : "conversationBottom");
}
function PreviewBlock(props) {
  return (0, import_react2.createElement)("div", { className: `dsh-better-left-sidebar-preview-block is-${props.kind}` }, props.label);
}

// src/client/index.ts
var inject = ["slots", "locale", "configForms"];
function apply(ctx) {
  let preferences = DEFAULT_PREFERENCES;
  let translate = (key) => key;
  ctx.effect(() => {
    const html = document.documentElement;
    const style = document.createElement("style");
    style.dataset.dshBetterLeftSidebar = "";
    style.textContent = sidebar_default;
    document.head.append(style);
    html.classList.add("dsh-better-left-sidebar");
    const interaction = connectInteraction();
    const layout = connectLayoutAdapter(interaction.setRoot);
    const applyPreferences = (value) => {
      preferences = normalizePreferences(value);
      layout.update(preferences);
      interaction.setPreferences(preferences);
    };
    const applyTranslate = (next) => {
      translate = next;
      interaction.setTranslate(translate);
    };
    applyPreferences(DEFAULT_PREFERENCES);
    interaction.setTranslate(translate);
    const disposeNavigation = connectNavigation(ctx);
    connectSettings(ctx, applyPreferences, applyTranslate);
    return () => {
      disposeNavigation();
      layout.dispose();
      interaction.dispose();
      html.classList.remove("dsh-better-left-sidebar");
      style.remove();
    };
  }, "better-left-sidebar: navigation shell");
}

    return module.exports;
  },
});
