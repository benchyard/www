# Benchyard Privacy Policy

Version: 0.2 | Last updated: October 10, 2026

This is the privacy policy for **Benchyard** ("Benchyard," "we," "us," or "our"). Contact us at [hello@benchyard.com](mailto:hello@benchyard.com). This Policy describes personal data processed through our website, hosted development workspaces, application, client tools, and support channels.

## 1. Our role and the scope of this Policy

We determine how to process personal data needed for our own account administration, service security, customer relationships, and legal compliance. For that processing, we act as a controller or data user under applicable law.

When an organization uses Benchyard to process personal data within its workspaces for its own purposes, we generally process that data on its behalf under its instructions and applicable agreement, including a DPA where agreed. The organization is responsible for its own notices and lawful authority. Contact it first about its use of your data; we will assist it as required.

Your connected model providers, repository services, plugins, and other third-party services may process information under separate terms and notices. Their legal role depends on the actual arrangement, not simply on whether an API key is used. If we engage a provider to process data on our behalf, our responsibilities for that provider remain applicable.

A separately operated self-hosted installation is subject to its operator's practices. This Policy still applies to information you separately provide to Benchyard, such as a support inquiry.

## 2. Information we collect

| Category | Examples and source | Why it is needed |
| --- | --- | --- |
| Account and contact information | Username, name, email, team membership, invitations, preferences, and support contact details supplied by you or an administrator | Create accounts, manage access, communicate, and administer the relationship |
| Authentication and device information | Password verification records, login and device identifiers, IP address, browser and operating-system information, passkey public keys, authenticator setup records, and security events | Authenticate users, recognize devices, prevent misuse, and secure access |
| Workspace and agent content | Repositories, code, files, prompts, outputs, attachments, command results, terminal information, session history, search indexes, rules, skills, and schedules you create or instruct us to process | Execute tasks, preserve context, synchronize work, enable search, and provide requested tools |
| Credentials and integration settings | API keys, provider sign-in and refresh credentials, SSH key material, environment secrets, MCP settings, plugin configuration, and custom endpoint addresses you or your team connect | Authenticate and perform authorized actions with connected services |
| Operational and usage records | Workspace identifiers and names, machine characteristics, resource and network measurements, token reports, session names, credit transactions, and audit events | Operate and troubleshoot the Service, report usage, protect infrastructure, and calculate disclosed charges |
| Payment and transaction information | Purchase amount, currency, credit allocation, payment-provider references, receipts, and billing details where required | Process and reconcile purchases, handle refunds, and meet accounting requirements |
| Feedback and support materials | Your message, optional attachments, optional page screenshot, diagnostic details, and support responses | Investigate problems and respond to feedback |
| Notification information | Push subscription endpoints and keys, device preferences, verified email, notification content and delivery records | Deliver notifications you enable and required account notices |
| Website and browser information | IP address and request metadata handled by hosting or security infrastructure; cookies and browser storage described in our Cookie Policy | Deliver pages, secure requests, maintain sign-in, and remember requested settings |

Passkey authentication does not give Benchyard the biometric data used by your device to unlock a passkey. Provider credentials and authenticator secrets that we hold are sensitive and may be readable by authorized server-side systems; they are not all protected in the same manner as a passkey private key.

The feedback dialog may include a screenshot of the current Benchyard page and diagnostic details by default, with controls to remove them before submission. A screenshot can contain code, messages, terminal output, or other personal and confidential information. Review it before sending. Redaction of known sensitive fields is not a guarantee that every secret will be removed.

For an enabled Airwallex checkout, payment-card details are submitted to Airwallex through its payment component. Benchyard's application server receives transaction references and status rather than the full card number or card security code. The checkout identifies the payment provider and links to its applicable privacy notice.

## 3. How we use information

We use information to provide requested workspaces, run and relay tasks, maintain session history, synchronize selected files and credentials, administer teams, deliver notifications, provide support, measure usage, process purchases, and enforce proportionate security and abuse controls. We also use operational information to diagnose errors and improve reliability and usability.

We may process information to comply with legal obligations, resolve disputes, respond to valid legal process, and protect legal rights. We limit access and use to what is reasonably needed for the relevant purpose. Feedback about the product does not give us unrestricted rights over accompanying personal data or customer code.

We do not use Customer Content to train or fine-tune general-purpose AI models. We do not sell personal data, share it for cross-context behavioral advertising, or use it for targeted advertising. We do not treat ordinary use of Benchyard as consent to any of these activities. Any future optional program would require an appropriate separate notice and choice before the new processing begins.

These commitments concern Benchyard's processing. Connecting an external provider can send prompts, code, outputs, and other context to that provider. Its contract, account type, location, feature, and settings determine its own training and retention rules. An API key alone does not establish a no-training or zero-retention arrangement.

## 4. Legal grounds where required

Where a law requires a lawful basis, we use the basis appropriate to the specific purpose:

| Purpose | Basis where applicable |
| --- | --- |
| Create and administer an individual customer's account, deliver requested services, and handle purchases | Performance of the contract or steps requested before entering it |
| Administer an organization's users and business contacts | Legitimate interests in supplying and managing the organization's service, subject to a balancing assessment |
| Prevent abuse, protect accounts, troubleshoot, and improve service operations | Legitimate interests in reliable and secure operation, subject to necessity and balancing; legal obligation where specifically required |
| Keep mandatory accounting records and respond to binding legal requirements | Compliance with the applicable legal obligation |
| Optional marketing, non-essential storage, or other optional processing where consent is required | Consent, which can be withdrawn without affecting earlier lawful processing |
| Process customer-controlled workspace data | The customer's documented instructions and applicable processor agreement; the customer determines its own lawful basis |

Legitimate interests do not override applicable consent requirements. Where local law uses a different framework, its purpose, fairness, notice, and consent requirements continue to apply. We obtain any consent required for a new purpose or direct marketing before undertaking that processing.

Required registration and authentication information is needed to establish and secure an account. Without it, we cannot provide the associated feature. Feedback attachments, optional notifications, and optional integrations are voluntary; declining them does not prevent use of unrelated functions.

## 5. Who receives information

We disclose information only for the purposes described in this Policy to the following categories:

- Infrastructure and operational providers that host compute, databases, object storage, backups, network delivery, security functions, email, and support systems under appropriate arrangements.
- Payment providers, banks, and professional advisers as needed for authorized purchases, accounting, fraud prevention, disputes, or compliance. Some process information as independent controllers.
- Providers, tools, repository hosts, and destinations you or an authorized administrator select. Tool execution may send data to external addresses and can have effects outside Benchyard.
- Team members and administrators according to their actual permissions. Members can see membership information; team administrators can see permitted workspace metadata and usage and manage shared settings. Their role alone does not expose another member's workspace contents. Installation operators and authorized support personnel have different technical access.
- Public authorities or other recipients where disclosure is required by law or reasonably necessary and legally permitted to address serious threats, investigate abuse, or establish or defend legal rights.
- Parties to a proposed or completed business transaction, subject to confidentiality, necessity, and continuing protection of personal data.

See the [Subprocessors and Service Providers](subprocessors.md) document for provider information and its scope. We do not publish your repositories or make workspaces public merely because you create an account. You can nevertheless direct an agent to push code, upload a file, send a message, or interact with a public service. Those actions can disclose information to the recipients you authorize.

## 6. Credentials and security

Benchyard uses access controls and transport protection for hosted access and encrypts selected stored credentials and objects. We limit authorized personnel access and use safeguards appropriate to the data and risks. Details depend on the deployed infrastructure and feature.

Benchyard is not end-to-end encrypted against its operator. Server-side session history and search content are readable by the operator, and encrypted credentials and synchronized files can be decrypted by systems with access to the relevant keys. Workspace disks and snapshots depend on infrastructure-level protections; we do not represent that every deployment encrypts every disk or snapshot.

Supported credential-protection mechanisms can keep some credentials out of an agent's direct environment. Other secrets, local files, custom integrations, and credentials may be accessible to processes you run. A compromised or misdirected agent can transmit data it can read. Use narrow permissions and avoid putting secrets into prompts or unnecessary files. No security measure eliminates all risk.

## 7. Retention and deletion

We retain information for the purpose for which it was collected, taking account of active service needs, your instructions, legal duties, security investigations, and proportionate dispute requirements. We do not treat indefinite technical storage as a sufficient reason to retain personal data forever.

Retention depends on the type of information and the reason it is held. Where we do not specify a fixed period, we use the criteria below and review whether continued retention is necessary. You may request deletion or ask about the period applicable to your account at hello@benchyard.com.

| Data | Retention criteria and deletion treatment |
| --- | --- |
| Account and contact records | Kept while needed to administer the account; after closure, retained only as necessary for outstanding obligations, security, disputes, or applicable recordkeeping duties |
| Workspace files, messages, mirrored history, search indexes, attachments, and bundles | Kept to provide the workspace and its history until deletion is requested or a disclosed resource-deletion rule applies; deleting a visible resource is not a promise of immediate removal from every related store |
| Snapshots and recovery copies | Retained according to the recovery settings applicable to the resource; snapshot grace periods are disclosed with the service. Copies awaiting deletion are restricted to recovery, security, or legally required preservation |
| Detailed resource samples and traffic alerts | Retained for monitoring and troubleshooting under the applicable service configuration; these are distinct from longer-lived billing or audit records |
| Usage, credit, payment, and audit records | Retained as necessary to reconcile authorized usage, meet applicable accounting and tax duties, investigate security events, and resolve disputes. These records can survive workspace deletion; not every category has an automatic expiry |
| Support and feedback | Kept while the request is open and afterward only as needed for follow-up, relevant service issues, security, disputes, or legal duties |
| Credentials and synchronized files | Kept while connected or otherwise retained under your instructions, subject to related snapshot, backup, and deletion processes; revocation at the issuer is separate |
| Browser storage | The lifetimes and controls in the Cookie Policy apply |

Deleting a session, deleting a workspace, closing an account, and revoking a third-party credential are different operations. Usage records and previously created backups or snapshots may remain after the visible resource disappears. Copies on your own machine, remote Git hosts, recipient systems, or independently selected providers are not automatically removed by Benchyard deletion. Restoring a backup requires reapplying recorded deletion instructions before ordinary processing resumes.

We may keep a limited record when law requires it or a documented legal hold applies, restrict its use, and delete it when the reason ends. Genuinely anonymized statistics that cannot reasonably identify you may be retained separately. Pseudonymous identifiers and named usage records are not treated as anonymous merely because direct contact details have been removed.

## 8. Processing locations and international transfers

Information may be stored or accessed outside your country by Benchyard and its service providers. Our team is located in China and the United States; authorized personnel in those locations may access information where needed for their duties, subject to applicable restrictions and safeguards. Contact hello@benchyard.com for the hosting, backup, and access locations applicable to your service.

Connected services may process information in additional locations under their arrangements. A workspace's selected region does not by itself restrict every database, backup, support access, or provider request to that region. We offer a residency commitment only where it is expressly documented and operationally supported.

Where applicable law requires safeguards for a transfer, we establish an appropriate legal mechanism before the transfer, such as an applicable adequacy determination or completed contractual safeguards with required assessments and supplementary measures. We do not represent that we are certified under a data privacy framework. Contact hello@benchyard.com for information about safeguards applicable to your data and a copy where available, subject to appropriate redactions.

## 9. Your choices and requests

Depending on applicable law, you may request access, correction, deletion, restriction, or a portable copy of personal data; object to specified processing; withdraw consent; and complain to a regulator. Some rights have conditions or exceptions. This Policy does not imply that every right listed exists in identical form in every jurisdiction.

Send requests to hello@benchyard.com with the subject "Privacy request." We may request information reasonably needed to verify your identity and authority. An authorized agent may make a request with appropriate proof of authority. We respond within the period required by applicable law and explain any lawful refusal or extension. We do not penalize you for exercising applicable privacy rights.

Account settings allow changes to supported profile, security, and notification preferences. Contact us if a requested action is not available in the interface. Where we act for an organization, we forward or direct requests to that organization and help it respond. You may also complain to your competent data-protection regulator, including an EEA supervisory authority or the UK Information Commissioner's Office where applicable.

## 10. United States state disclosures

Where an applicable state privacy law covers our processing, Section 2 identifies categories collected and their sources, Sections 3 and 5 describe purposes and recipient categories, and Section 7 describes retention. Categories may include identifiers; customer records; commercial and transaction information; internet or electronic-network activity; professional information; and sensitive account credentials and personal information that you place in workspace content.

We use sensitive information for account security, requested services, and other purposes permitted by applicable law, not to infer personal characteristics. We do not sell personal information, share it for cross-context behavioral advertising, or use it for targeted advertising. The same categories may be disclosed for operational purposes to the recipients described in Section 5.

Where covered, residents may request applicable access, correction, deletion, portability, and opt-out rights. Contact hello@benchyard.com; use the same address to appeal a denied request where state law provides an appeal, marking it "Privacy appeal." We will explain the applicable review process and any further complaint route. We honor recognized opt-out preference signals where legally required for covered processing. We do not use ordinary Benchyard account administration to make automated decisions about eligibility for employment, lending, housing, or similarly significant opportunities; customers are responsible for their own lawful uses and our Acceptable Use Policy applies.

## 11. Cookies and notifications

Our [Cookie Policy](cookie-policy.md) describes sign-in, device, preview, and preference storage. We do not use advertising trackers on our marketing site. Hosting, delivery, and payment services may process request data for their respective functions. Third-party pages and services have their own notices.

Push notifications require the relevant device permission. They may reveal task or workspace information on a lock screen or shared device. Optional email notifications can be changed in settings. Operational security, billing, and legal notices are distinct from marketing messages. Promotional communications, if introduced, will include an unsubscribe method and use any consent required by law.

## 12. Age, changes, and contact

Benchyard is intended for adults aged 18 or older. We do not knowingly offer accounts to children. Contact us if you believe a child supplied personal data through an account, so we can investigate and take appropriate action.

We will update this Policy when practices change, identify the effective date, and give additional notice for material changes as appropriate or required. A policy update alone does not authorize a materially incompatible new use that requires consent or another legal basis.

Contact: [hello@benchyard.com](mailto:hello@benchyard.com), subject "Privacy request" or "Privacy appeal." This is also our general support address.
