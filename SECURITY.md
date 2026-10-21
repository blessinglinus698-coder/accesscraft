# Security Policy

## Supported versions

Security fixes are provided for the latest release and the `main` branch.

| Version       | Supported |
| ------------- | --------- |
| `main`        | Yes       |
| Latest release | Yes      |
| Older releases | No       |

## Reporting a vulnerability

**Please do not open a public issue, discussion or pull request for security problems.**

Report privately through GitHub:
[Report a vulnerability](https://github.com/blessinglinus698-coder/accesscraft/security/advisories/new)

Please include:

- a description of the vulnerability and its impact
- steps to reproduce, or a proof of concept
- affected versions or commits
- any suggested mitigation

## What to expect

| Step                          | Target time        |
| ----------------------------- | ------------------ |
| Acknowledgement               | within 3 business days |
| Initial assessment            | within 7 days      |
| Fix or mitigation plan        | within 30 days for high severity |
| Coordinated public disclosure | after a fix is released |

We will credit reporters in the advisory unless you prefer to remain anonymous.

## Scope

AccessCraft fetches and renders arbitrary URLs in headless Chrome and accepts uploaded images. These areas deserve particular attention:

- server-side request forgery (SSRF) through the scan URL, including requests to private networks and cloud metadata endpoints
- unsafe handling of uploaded files
- injection through scanned page content shown in the UI or reports
- command or path injection in the backend
- secrets exposed through configuration

Out of scope: findings that require a compromised host, denial of service through excessive legitimate use without an amplification flaw, and issues in third-party dependencies with no demonstrable impact on AccessCraft (report those upstream).

## Safe harbor

We will not pursue legal action against researchers who act in good faith, avoid privacy violations and data destruction, and give us reasonable time to respond before disclosure.

## Hardening guidance for operators

- Run the backend in a container as a non-root user and restrict its network egress.
- Block scanning of private, loopback and link-local address ranges.
- Never commit `.env` files. Use `.env.example` as a template.
- Keep dependencies current; Dependabot is enabled on this repository.
