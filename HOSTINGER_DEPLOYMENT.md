# Hostinger Deployment Guide for Be Bodywise Results System

This application is ready for deployment to **Hostinger** (both **Shared / Cloud Web Hosting** via `public_html` or **Hostinger VPS / Node.js**).

---

## Option A: Hostinger Web Hosting (Fastest & Recommended)
Hostinger's standard cPanel / hPanel uses LiteSpeed/Apache servers. The `.htaccess` file has been pre-configured in `/public/.htaccess` so Vite automatically packages it into `dist/`.

### Step 1: Build the Production Bundle
Run this command in the terminal:
```bash
npm run build
```
This will compile all TypeScript, React components, and Tailwind styles into an optimized static bundle in the `dist/` directory.

### Step 2: Upload to Hostinger File Manager
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** → click **Manage** next to your domain.
3. Open **File Manager** (Files → File Manager).
4. Navigate into the **`public_html`** folder.
5. If there is a default `default.php` file, delete or rename it.
6. Upload all files and folders located **inside** the `dist/` folder directly into `public_html`:
   - `index.html`
   - `.htaccess` *(make sure hidden files are visible in Hostinger file manager)*
   - `assets/` (folder containing bundled JS, CSS, and images)
   - Any public assets

### Step 3: Verify Client-Side Routing
Because the `.htaccess` file includes the SPA rewrite rules:
- Direct visits to `https://yourdomain.com/dashboard`, `https://yourdomain.com/match`, `https://yourdomain.com/shelf`, `https://yourdomain.com/decoder`, and `https://yourdomain.com/journey` will load smoothly without 404 errors.
- Page reloads will stay on the current page.

---

## Option B: Hostinger Node.js Application / VPS
If you prefer running the Express backend on Hostinger VPS or Node.js hosting:
1. Set the Node.js version to **v18+** or **v20+** in hPanel.
2. Root directory: `/home/username/public_html`
3. Application startup file: `server.ts` or `dist/server.js`
4. Build command: `npm run build`
5. Start command: `npm start`
