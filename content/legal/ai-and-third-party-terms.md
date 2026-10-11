# Benchyard AI and Third Party Services Terms

Version: 0.2 | Last updated: October 10, 2026

These terms supplement the [Terms of Service](terms-of-service.md) for coding agents, model services, MCP tools, plugins, repositories, custom endpoints, and other external services used through Benchyard.

## 1. Separate services and authorization

Benchyard supplies a workspace and tools to operate supported integrations. It is separate from the third-party providers you connect. Offering an integration does not imply that its provider endorses Benchyard; third-party names and trademarks belong to their owners.

You must have a valid account or other entitlement and permission for the specific integration method. A technical ability to sign in is not evidence that a provider allows commercial hosting, credential custody, automated access, redistribution, or use by the relevant entity or in the relevant region. Only integration methods expressly offered by Benchyard and permitted under the applicable provider arrangement may be used.

A provider's terms may distinguish an individual subscription, enterprise entitlement, API account, and third-party gateway. We do not convert one entitlement into another. You must not share or pool personal subscription credentials or use an integration to avoid provider restrictions. We may disable an integration if its authorization cannot be established.

## 2. Account and API key connections

For a provider that permits credential management by Benchyard, connecting an account or key authorizes us to store and use the required credential, refresh or renew it where supported and permitted, relay authorized requests, and maintain the connection within its scope. This permission does not extend to credentials that a provider requires to remain within its own authentication flow. Depending on your settings, a personal connection can be available across your workspaces; a team-managed connection can be used in applicable team workspaces.

An encrypted credential may still be decryptable by authorized Benchyard systems. Some supported credentials are applied through a credential intermediary; others may be available to processes in the workspace. An agent can act using an authorized credential even when it cannot read the secret itself. Do not connect an account whose access exceeds what you are prepared to authorize.

Remove connections you no longer need. To end access conclusively after compromise, revoke or rotate the credential at its issuer as well. Removing a connection does not reverse completed actions, delete all historical copies, or cancel requests already accepted by another service.

### Provider-controlled authentication

Some providers require users to sign in through an unmodified official agent, keep particular authentication options available, and pay the provider directly. Where those requirements apply, they control the integration. A provider's permission for native sign-in does not authorize Benchyard to collect or manage subscription credentials through a separate login service, pool entitlements, or resell the resulting usage. Credentials written by an official agent inside your workspace remain subject to the provider's restrictions and the workspace security and retention practices described in our Privacy Policy.

## 3. Data sent to providers and tools

An integration may receive prompts, code, repository context, file contents, outputs, attachments, environment information, command results, and other data needed by the tool or agent. It may access more context than the text in your latest message. Custom endpoints and plugins can route data to additional recipients.

Your provider agreement and settings determine the provider's processing, including retention, training, human review, international transfers, and any enterprise protections. A "bring your own key" connection is not a promise of direct-only routing, no training, or zero retention. Where the provider offers a privacy setting, you are responsible for selecting the appropriate setting; Benchyard does not represent that a setting is automatically enforced unless expressly documented for that integration.

Where you independently contract with a provider and direct us to connect it, its separate processing is governed by that arrangement. Where Benchyard contracts with a provider to perform processing on our behalf, our obligations under the DPA and applicable law continue. We do not classify every external AI provider as independent merely to avoid subprocessor obligations.

## 4. Tools and execution

MCP servers, plugins, skills, and scripts may execute code locally or remotely and can access files, credentials, and network destinations within their permissions. Review the source, scope, and destination before enabling them. A team-supplied tool or rule is not automatically verified by Benchyard.

Permission modes vary by agent. Some actions may proceed without individual approval, particularly in an automatic mode or a schedule. Content retrieved from repositories, websites, or tools can contain instructions that misdirect an agent. Use appropriate access limits, review, and independent safeguards.

An agent action may create charges or obligations with third parties, change permissions, delete data, push commits, or publish material. You authorize only actions within the instructions and permissions you actually grant. Nothing here excuses Benchyard from responsibility for acting outside that authority.

## 5. Output rights and review

Third-party output terms and relevant open-source licenses continue to apply. Benchyard transfers only rights it holds and does not guarantee exclusivity, copyright protection, license compliance, accuracy, or freedom from vulnerabilities. Inspect code, dependencies, licenses, and test results before use. Do not treat AI output as a guarantee or as professional advice.

## 6. Fees and availability

Provider subscription and API fees are separate from Benchyard infrastructure fees. A separately offered service may include provider usage only under an expressly authorized provider arrangement and a clear order; this does not change applicable provider-controlled authentication and billing conditions. Token and price figures shown by Benchyard may be estimates or agent-reported values; the provider's applicable billing records govern its own charges, subject to your rights to dispute them.

Providers may change models, limits, authentication, policies, supported regions, and availability. We may adapt, restrict, or discontinue affected integrations and will provide notice where practicable. Refund rights for the Benchyard service remain governed by its Billing and Refund Policy and mandatory law. You do not waive rights against Benchyard merely because a third party is involved.
