// Shared by the homepage walkthrough and workspace guide. These are
// illustrative instructions, not recordings of native notification delivery.
export const deviceSetup = [
  {
    id: "mac",
    name: "Mac",
    action: "Add to Dock",
    requirement:
      "Safari on macOS Sonoma 14 or later. Notification availability depends on browser, system and service settings.",
    steps: [
      [
        "Open the console in Safari",
        "Sign in at console.benchyard.com. Add the console, not this marketing website.",
        "Safari · console.benchyard.com",
      ],
      [
        "Add to Dock",
        "Choose File → Add to Dock (or use Safari’s Share menu), then confirm Add.",
        "File → Add to Dock → Add",
      ],
      [
        "Open Benchyard from the Dock",
        "Launch the web app using its Benchyard icon. Sign in if asked.",
        "Dock → Benchyard",
      ],
      [
        "Enable notifications",
        "In Benchyard’s notification settings, choose Turn on for this device. Allow the system permission when prompted. Adding the icon does not grant permission.",
        "Turn on → Allow notifications",
      ],
      [
        "Return when needed",
        "Open an approval-needed notification to return to the session. Read the request and approve or deny inside Benchyard.",
        "Approval needed → Open session → Review",
      ],
    ],
  },
  {
    id: "iphone",
    name: "iPhone",
    action: "Add to Home Screen",
    requirement:
      "Home Screen web push requires iOS 16.4 or later. Safari menus vary by iOS version; Open as Web App may appear on newer versions.",
    steps: [
      [
        "Open the console in Safari",
        "Sign in at console.benchyard.com on your iPhone.",
        "Safari · console.benchyard.com",
      ],
      [
        "Add to Home Screen",
        "Open Safari’s Share menu and choose Add to Home Screen. Enable Open as Web App if shown, then tap Add.",
        "Share → Add to Home Screen → Add",
      ],
      [
        "Launch from the Home Screen",
        "Tap the Benchyard icon to open the web app. Sign in if asked.",
        "Home Screen → Benchyard",
      ],
      [
        "Enable notifications",
        "In Benchyard’s notification settings, choose Turn on for this device, then allow notification permission. Repeat setup on each device you use.",
        "Turn on → Allow notifications",
      ],
      [
        "Open the session to act",
        "Tap an approval-needed notification, unlock your phone if required and review the request inside Benchyard. The lock screen does not approve it.",
        "Notification → Session → Approve or Deny",
      ],
    ],
  },
];
