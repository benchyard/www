const icon = (paths) =>
  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const terminal = icon(
  '<rect x="3" y="5" width="26" height="23" rx="3"/><path d="M3 11h26M8 17l4 3-4 3M17 23h6M7 8h.1M11 8h.1"/>',
);
const shield = icon(
  '<path d="M16 3 27 7v8c0 7-6 11-11 14C11 26 5 22 5 15V7Z"/><rect x="11" y="13" width="10" height="8" rx="2"/><path d="M13 13v-2a3 3 0 0 1 6 0v2"/>',
);
const service = icon(
  '<rect x="4" y="5" width="24" height="10" rx="2"/><rect x="4" y="19" width="24" height="9" rx="2"/><path d="M9 10h.1M9 23.5h.1M15 10h8M15 23.5h8"/>',
);
const eyeOff = icon(
  '<path d="m4 4 24 24M12 8a16 16 0 0 1 4 0c8 0 13 8 13 8a25 25 0 0 1-5 5M19 24a16 16 0 0 1-3 0C8 24 3 16 3 16a25 25 0 0 1 5-5"/>',
);
const check = icon('<path d="m8 16 5 5 11-12"/>');
const connection = (label) =>
  `<div class="trust-connection"><span>${label}</span>${icon('<path d="M2 16h27l-6-6M29 16l-6 6"/>')}</div>`;
export const securityDiagram = () =>
  `<figure class="trust-map" aria-label="How credential keepers keep protected secrets outside the agent workspace"><div class="trust-map-header"><span class="eyebrow">HOW PROTECTED CREDENTIALS WORK</span><span class="trust-map-label">Provider sign-ins and keys · Secrets that name their hosts</span></div><div class="trust-map-grid"><article class="trust-node trust-workspace"><div class="trust-icon">${terminal}</div><p class="trust-node-label">INSIDE THE WORKSPACE</p><h3>Agent uses a placeholder.</h3><p>The agent can make a request without receiving the real credential.</p><div class="credential-sample"><span>Agent sees</span><code>Bearer [placeholder]</code></div><div class="trust-detail trust-visibility">${eyeOff}<span>Protected secret is not exposed to the agent.</span></div></article>${connection("Request")}<article class="trust-node trust-server"><div class="trust-icon">${shield}</div><p class="trust-node-label">CREDENTIAL KEEPER · OUTSIDE</p><h3>Keeper adds the secret.</h3><p>The real value is added only in configured fields for the credential’s hosts.</p><div class="credential-sample credential-protected"><span>Real credential stays here</span><span class="secret-dots" aria-label="Protected secret value">•••• •••• ••••</span></div><div class="trust-detail trust-visibility">${check}<span>The raw credential never enters the workspace.</span></div></article>${connection("Request + secret")}<article class="trust-node"><div class="trust-icon">${service}</div><p class="trust-node-label">CONFIGURED SERVICE</p><h3>Service receives the request.</h3><p>The configured host authenticates the request and returns its response.</p><div class="credential-sample"><span>Destination</span><strong>A host configured for this credential</strong></div><div class="trust-detail">The agent can use the credential at its configured hosts while the workspace runs.</div></article></div><div class="trust-response" role="img" aria-label="Service response returns to the agent">${icon('<path d="M27 6v9a7 7 0 0 1-7 7H5m6-6-6 6 6 6"/>')}<span aria-hidden="true">Response</span></div><figcaption><span class="trust-disclosure-label">Scope of protection</span><div><p>Applies to the credentials the keepers hold. A secret that names no hosts, a team key for the team’s own gateway, private keys and secrets saved in files can still be read by agents.</p><p>Whoever runs the installation can read stored credentials and session content. This is not end-to-end encryption.</p></div></figcaption></figure>`;
