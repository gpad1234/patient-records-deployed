# ✅ ACTIVE - Main React Application

This is the **active** React application for the EMR system.

## Build

```bash
cd web
npm install
npm run build
```

Output: `dist/` directory

## Framework

- **Vite** - Fast build tool
- **React** - UI framework
- **React Router** - Client-side routing

## Deployment

### On Server
The built app is served from:
```
/opt/emr/web/dist/
```

### Nginx Configuration
```nginx
location / {
    root /opt/emr/web/dist;
    try_files $uri /index.html;
}
```

### Deploy Script
```bash
./deployment/deploy-scp.sh
```

This script:
1. Builds locally: `npm run build` in `/web`
2. Creates tarball with `web/dist/`
3. Uploads via SCP
4. Extracts on server to `/opt/emr/web/dist/`

## Access

- **Production**: http://165.232.54.109
- **Local Dev**: `npm run dev` (usually port 5173)

---
**Last Updated**: December 18, 2025
