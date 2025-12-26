# ⚠️ DEPRECATED - DO NOT USE

This directory (`services/web-ui/`) is **deprecated** and no longer used in deployment.

## Active Directory

The **active** React application is:
- **Location**: `/web/` (root level)
- **Build**: Vite-based
- **Served from**: `/web/dist/`

## Why Deprecated?

This was an older version of the web UI. The project has been consolidated to use the `/web/` directory.

## Nginx Configuration

Nginx serves the React app from `/opt/emr/web/dist/` on the server, NOT from this directory.

## Deployment

Use the deployment script:
```bash
./deployment/deploy-scp.sh
```

This deploys `/web/dist/` to the server, not `services/web-ui/`.

---
**Last Updated**: December 18, 2025
