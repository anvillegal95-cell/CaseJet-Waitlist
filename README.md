# CaseJet Waitlist Landing Page

**CaseJet Legal Tech** is a polished single-page waitlist landing page for the upcoming launch of **CaseJet.ai**. The experience is designed around a dark graphite brand system with metallic blue and cyan accents, restrained gold highlights, audience-specific product messaging, and a launch-focused signup flow prepared for Google Sheets collection through a Google Apps Script web app.

The page is built as a lightweight Vite-based frontend so it remains fast to load, simple to customize, and straightforward to deploy as a static site.[3]

| Area | Purpose |
| --- | --- |
| `client/src/pages/Home.tsx` | Main landing page content, pricing, audience messaging, and the waitlist form behavior. |
| `client/src/index.css` | Global design tokens, premium dark theme, reusable panel styles, and typography rules. |
| `client/index.html` | SEO metadata, page title, theme color, and font loading. |
| `ideas.md` | The design brainstorming document created before implementation. |

## Local development

To run the landing page locally, install dependencies and start the development server from the project root.

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs the project dependencies. |
| `pnpm dev` | Starts the local development server. |
| `pnpm build` | Produces the production build. |
| `pnpm preview` | Serves the production build locally for review. |

## Google Sheets waitlist integration

The waitlist form is designed to submit to a **Google Apps Script web app endpoint**. Google documents the web app deployment flow under **Deploy > New deployment > Web app**, and the deployed URL can be shared according to the access level you choose.[1]

The frontend expects a build-time environment variable named **`VITE_WAITLIST_ENDPOINT`**. Once that variable is set to your deployed Google Apps Script URL, the form will submit these fields:

| Field | Description |
| --- | --- |
| `fullName` | The visitor’s full name. |
| `email` | The visitor’s email address. |
| `interest` | Either `Personal Intelligence Tool` or `Attorney`. |
| `source` | Fixed source label: `CaseJet.ai waitlist`. |
| `submittedAt` | ISO timestamp added by the frontend at submission time. |
| `comment` | Optional free-text comment or wish list entry from the visitor. |
| `utm_source` | UTM source parameter from the landing URL, if present. |
| `utm_medium` | UTM medium parameter from the landing URL, if present. |
| `utm_campaign` | UTM campaign parameter from the landing URL, if present. |
| `utm_term` | UTM term parameter from the landing URL, if present. |
| `utm_content` | UTM content parameter from the landing URL, if present. |

### Step 1: Create the Google Sheet

Create a new Google Sheet and rename the first tab to something clear such as **Waitlist**. In the first row, create these headers in order:

`Submitted At | Full Name | Email | Interest | Source | Comment | UTM Source | UTM Medium | UTM Campaign | UTM Term | UTM Content`

### Step 2: Create the Apps Script project

Open the Google Sheet, choose **Extensions > Apps Script**, and replace the default script with the following:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Waitlist");

  const submittedAt = e.parameter.submittedAt || new Date().toISOString();
  const fullName = e.parameter.fullName || "";
  const email = e.parameter.email || "";
  const interest = e.parameter.interest || "";
  const source = e.parameter.source || "CaseJet.ai waitlist";
  const comment = e.parameter.comment || "";
  const utmSource = e.parameter.utm_source || "";
  const utmMedium = e.parameter.utm_medium || "";
  const utmCampaign = e.parameter.utm_campaign || "";
  const utmTerm = e.parameter.utm_term || "";
  const utmContent = e.parameter.utm_content || "";

  sheet.appendRow([submittedAt, fullName, email, interest, source, comment, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

This implementation matches the current frontend behavior, which submits the form with `URLSearchParams` using a POST request. Because the frontend uses `mode: "no-cors"`, the browser cannot inspect the response body; instead, the page treats a successful network send as a completed submission.

### Step 3: Deploy the script as a web app

Google’s official Apps Script guide describes the deployment flow as follows:[1]

> "To deploy a script as a web app, follow these steps: 1. At the top right of the script project, click Deploy > New deployment. 2. Next to \"Select type,\" click Enable deployment types > Web app. 3. Enter the information about your web app in the fields under \"Deployment configuration.\" 4. Click Deploy."

For this waitlist, use the following settings:

| Setting | Recommended value |
| --- | --- |
| Execute as | **Me** |
| Who has access | **Anyone** |
| Deployment type | **Web app** |

After deployment, copy the **Web app URL**. That is the value you will use for `VITE_WAITLIST_ENDPOINT`.

### Step 4: Connect the deployed URL to the frontend

For local development, create a `.env` file in the project root with this line:

```bash
VITE_WAITLIST_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

For production, add the same variable in your hosting platform’s environment variable settings.[2] [4] [6]

Once the environment variable is added, rebuild and redeploy the site so the browser bundle includes the correct endpoint.

## Deployment

Manus provides built-in hosting and custom domain support, but this repository can also be deployed on **Vercel**, **Netlify**, or **Railway** as requested. Since this is a static Vite-based frontend, the important production output is the compiled static site in **`dist/public`** after running `pnpm build`.[3]

| Platform | Recommended setup |
| --- | --- |
| **Vercel** | Import the GitHub repository, keep the build command as `pnpm build`, set the output directory to `dist/public`, and add `VITE_WAITLIST_ENDPOINT` in the project’s environment variable settings.[2] |
| **Netlify** | Connect the repository, set the build command to `pnpm build`, set the publish directory to `dist/public`, and create `VITE_WAITLIST_ENDPOINT` in site environment variables.[4] |
| **Railway** | Create a project from the GitHub repository, follow Railway’s static hosting flow, set the build command to `pnpm build`, publish `dist/public`, and add `VITE_WAITLIST_ENDPOINT` under Variables.[5] [6] |

### Vercel deployment walkthrough

Create a new Vercel project from the GitHub repository. In the build settings, use `pnpm build` and set the output directory to `dist/public`. Then add `VITE_WAITLIST_ENDPOINT` under **Environment Variables** before deploying.[2]

### Netlify deployment walkthrough

Create a new site from Git, connect this repository, and configure the build command as `pnpm build` with a publish directory of `dist/public`. Then add `VITE_WAITLIST_ENDPOINT` as a site environment variable in Netlify before triggering the deploy.[4]

### Railway deployment walkthrough

Create a new Railway project from the GitHub repository and use Railway’s static hosting flow. Set the build command to `pnpm build`, publish the static output from `dist/public`, and store `VITE_WAITLIST_ENDPOINT` in **Variables** so the frontend builds with the correct form target.[5] [6]

### Custom domain

After deployment, connect **CaseJet.ai** inside your chosen hosting provider or through Manus hosting. Point the DNS records required by your provider, then set the production URL as the primary domain for the landing page.

## Customization

The page was intentionally organized so content, styling, and launch operations can be updated quickly.

| What to change | Where to change it |
| --- | --- |
| Hero copy, audience messaging, pricing, footer text, and waitlist behavior | `client/src/pages/Home.tsx` |
| Colors, typography, reusable surfaces, shadows, and spacing personality | `client/src/index.css` |
| Browser tab title, meta description, and font imports | `client/index.html` |
| Google Sheets endpoint | `VITE_WAITLIST_ENDPOINT` in `.env` or your hosting platform settings |
| Generated imagery URLs | `client/src/pages/Home.tsx` |

If you want to replace the current launch messaging, keep the existing structure intact: hero, audience paths, pricing signal, waitlist, and footer. That structure is what preserves the current premium landing-page rhythm.

## Production notes

The current implementation already includes the full landing page, the audience split for **Personal Case** and **Attorney**, the launch teaser tone, responsive layout behavior, and the waitlist form. The only required production configuration step is adding a valid Apps Script URL through `VITE_WAITLIST_ENDPOINT`.

## References

[1]: https://developers.google.com/apps-script/guides/web "Web Apps | Apps Script | Google for Developers"
[2]: https://vercel.com/docs/environment-variables "Environment Variables | Vercel Docs"
[3]: https://v4.vitejs.dev/guide/static-deploy "Deploying a Static Site | Vite"
[4]: https://docs.netlify.com/build/environment-variables/overview/ "Environment variables overview | Netlify Docs"
[5]: https://docs.railway.com/guides/static-hosting "Deploy Static Sites with Zero Configuration and Custom Domains | Railway Docs"
[6]: https://docs.railway.com/variables "Using Variables | Railway Docs"
