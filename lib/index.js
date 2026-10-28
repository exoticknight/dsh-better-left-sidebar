// src/host/index.ts
import z from "@deepseek-ai/schemastery";
var name = "dsh-better-left-sidebar";
var Config = z.object({
  animation: z.union([
    z.const("standard"),
    z.const("fast"),
    z.const("off")
  ]).default("standard").volatile().description("Sidebar animation speed."),
  expansion: z.union([
    z.const("hover"),
    z.const("click")
  ]).default("hover").volatile().description("How the navigation flyout opens."),
  brandPosition: z.union([
    z.const("navigation-top"),
    z.const("sidebar-top"),
    z.const("hidden")
  ]).default("navigation-top").volatile().description("Where the brand area appears."),
  globalNavigationPosition: z.union([
    z.const("rail"),
    z.const("conversation-top")
  ]).default("rail").volatile().description("Where global navigation appears."),
  toolsPosition: z.union([
    z.const("rail-bottom"),
    z.const("conversation-bottom")
  ]).default("rail-bottom").volatile().description("Where tools and status content appear."),
  layoutVersion: z.const(1).volatile().description("Marks an explicitly selected semantic layout.")
});
var inject = [];
function apply(ctx, _config) {
  ctx.effect(() => {
    console.info(`[${name}] ${"0.1.0"} loaded`);
    return () => console.info(`[${name}] unloaded`);
  });
}
export {
  Config,
  apply,
  inject,
  name
};
