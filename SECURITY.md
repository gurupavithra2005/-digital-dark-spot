# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

---

## Reporting a Vulnerability

We take the security of **DIGITAL DARK SPOT** seriously. If you discover a potential vulnerability, please **do not open a public issue**.

Instead, please report security vulnerabilities directly by contacting the project maintainers via email or private GitHub advisory.

### What to include in your report:
- A description of the issue and potential impact
- Step-by-step instructions or proof-of-concept to reproduce the vulnerability
- Any proposed remediation or patches

### API Key Safety & Secrets
- Never commit `.env.local` or any hardcoded API keys.
- All Gemini API calls run server-side in Next.js Route Handlers (`app/api/*`). The client never receives secret tokens.
