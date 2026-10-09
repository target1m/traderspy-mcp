# Security policy

## Reporting a vulnerability

Email **support@traderspy.app** with "SECURITY" in the subject, a description, the affected component (this
repository's manifests and skills, or the hosted server at `https://mcp.traderspy.app/mcp`) and steps to
reproduce. Please do not open a public issue for a vulnerability.
We aim to acknowledge reports within a few business days.

## Scope and design

- This repository contains client configuration, plugin manifests and agent skills. It ships no credentials.
- The hosted MCP server exposes 17 tools, all annotated `readOnlyHint: true`. None places, closes or modifies an
  order, none transfers or withdraws funds, and none reads a user's exchange account. TraderSpy never asks for
  exchange API keys.
- Authentication is OAuth 2.1 (dynamic client registration, PKCE S256, scope `mcp.read`) or a personal `mcp_` key
  that the user can revoke at any time from https://traderspy.app/mcp.

## Supported versions

Only the latest release of this repository and the current hosted server are supported.
