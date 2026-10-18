import { mark } from "./brand.mjs";

const placeholder = '<span class="dock-icon dock-placeholder"></span>';
const app = `<span class="dock-icon dock-benchyard">${mark}<span class="dock-badge">3</span></span>`;

export function deviceDocks() {
  return `<section class="device-docks" id="device-setup" aria-labelledby="device-docks-title">
    <h3 id="device-docks-title">On your Dock. On your Home Screen.</h3>
    <p>No separate app download.</p>
    <div class="device-docks-grid">
      <figure><div class="dock-desktop" role="img" aria-label="Illustration of a Mac desktop with Benchyard in the centered Dock, showing three updates."><div class="dock-menubar" aria-hidden="true"><span>◆ &nbsp; Finder</span><span>File &nbsp; Edit &nbsp; View &nbsp; Go &nbsp; Window &nbsp; Help</span></div><div class="dock-desktop-label" aria-hidden="true">Your workspace, a click away.</div><div class="device-dock mac-device-dock" aria-hidden="true">${placeholder}${placeholder}<span class="dock-active">${app}</span>${placeholder}${placeholder}<span class="dock-divider"></span>${placeholder}</div></div><figcaption>Mac · Add to Dock</figcaption></figure>
      <figure><div class="dock-iphone" role="img" aria-label="Illustration of an iPhone Home Screen with Benchyard in the Dock, showing three updates."><span class="dock-island" aria-hidden="true"></span><div class="home-icon-grid" aria-hidden="true">${placeholder.repeat(12)}</div><div class="home-page-dots" aria-hidden="true">● · ·</div><div class="device-dock iphone-device-dock" aria-hidden="true">${placeholder}${app}${placeholder}${placeholder}</div><span class="dock-home-indicator" aria-hidden="true"></span></div><figcaption>iPhone · Add to Home Screen</figcaption></figure>
    </div><p class="caption">Illustrative desktops. Notification badges depend on device support, permissions and settings.</p>
  </section>`;
}
