export const destinations = {
  pricing: [
    ["/#pricing", "Pricing overview"],
    ["/#pricing-usage", "How usage is billed"],
    ["/#offers", "Trial & offers"],
  ],
  workspace: [
    ["/#workspace", "Overview"],
    ["/#preview", "Previews"],
    ["/#workspace-context", "Sessions & context"],
    ["/#workspace-operations", "Schedules & recovery"],
    ["/#workspace-tools", "Workbench & tools"],
    ["/#workspace-machines", "Machines & sudo"],
    ["/#notifications", "Notifications"],
    ["/#device-setup", "Mac & iPhone setup"],
  ],
  agents: [
    ["/#agents", "Supported agents"],
    ["/guides/agents/#supported-agents", "Sign-in options"],
    ["/guides/agents/", "Agent guide"],
  ],
  teams: [
    ["/#team-tools", "Shared instructions & tools"],
    ["/#team-usage", "Managed sign-ins & usage"],
    ["/#team-ownership", "Workspace ownership"],
  ],
  business: [
    ["/#business", "Hosted service"],
    ["/#business-infrastructure", "Your infrastructure"],
    ["/#business-contact", "Contact"],
  ],
  security: [
    ["/#security-credentials", "Credential protection"],
    ["/#security-storage", "Data storage & operator access"],
    ["/#security-isolation", "Isolation & access"],
    ["/guides/security/", "Security guide"],
  ],
};
export function navigation(items, prefix) {
  return items
    .map(
      ([id, label]) =>
        `<li class="nav-item" data-nav-item><div class="nav-label"><a href="/#${id}">${label}</a><button type="button" class="nav-toggle" aria-label="${label} links" aria-expanded="false" aria-controls="${prefix}-${id}" hidden><svg class="nav-chevron" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false"><path d="m4.5 6.25 3.5 3.5 3.5-3.5"/></svg></button></div><ul class="nav-panel" id="${prefix}-${id}" hidden>${destinations[id].map(([href, name]) => `<li><a href="${href}">${name.replaceAll("&", "&amp;")}</a></li>`).join("")}</ul></li>`,
    )
    .join("");
}
