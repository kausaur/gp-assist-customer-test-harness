# Phoenix PaymentProcessing Widget — Prototype App & Render Deployment

A step-by-step guide to create a minimal React app that renders the Phoenix `PaymentProcessing` widget and deploy it for free on [Render](https://render.com).

---

## What You'll Build

A 3-page app:

| Page | Purpose |
|------|---------|
| `/` and `/settings` | Enter your API key, merchant ID, and choose Live/Sandbox mode |
| `/checkout` | Renders the `PaymentProcessing` widget with pre-filled test data |
| `/success` | Confirmation page after a successful payment |

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **A GitHub account** — to connect your repo to Render
- **A Render account** — [Sign up free](https://render.com)
- **Phoenix credentials** — your `X-API-KEY` and `sourceMerchantId`

---

## Quick Start (Copy-Paste)

### 1. Create the project

```bash
mkdir phoenix-checkout && cd phoenix-checkout
npm init -y
```

### 2. Replace `package.json` with:

```json
{
  "name": "phoenix-checkout",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@phoenix-frontend/ep-react-components": "https://worldpay-elements-stage.worldpay.com/phoenix-components-v0.21.206.tgz",
    "@phoenix/stencil-lib": "https://worldpay-elements-stage.worldpay.com/phoenix-stencil-components-v0.89.2.tgz",
    "axios": "^1.7.9",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.5.3"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.7",
    "@vitejs/plugin-react": "^4.4.1",
    "tailwindcss": "^4.1.5",
    "vite": "^6.3.5"
  }
}
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create files

Create the following file structure:

```
phoenix-checkout/
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── Checkout.jsx
    ├── Settings.jsx
    ├── Success.jsx
    └── services/
        ├── api.js
        └── authService.js
```

---

## File Contents

### `.env`

```
VITE_PHOENIX_API=https://phoenix-api-stage.worldpay.com/
```

### `.gitignore`

```
node_modules/
dist/
.env.local
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Phoenix Checkout</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `vite.config.js`

```js
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### `src/index.css`

```css
@import "tailwindcss";
```

### `src/main.jsx`

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### `src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Checkout from "./Checkout";
import Success from "./Success";
import Settings from "./Settings";

function App() {
  return (
    <Router>
      <nav className="bg-indigo-700 text-white p-4 flex gap-4">
        <Link to="/checkout" className="hover:underline">Checkout</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### `src/services/api.js`

```js
import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_PHOENIX_API,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("phoenixAuthToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const api = {
  get: (url, config) => apiInstance.get(url, config),
  post: (url, data, config) => apiInstance.post(url, data, config),
};

export default api;
```

### `src/services/authService.js`

```js
import api from "./api";

export const createAuthToken = ({ sourceMerchantId, permissions, setLoading, setError }) => {
  setLoading(true);

  const xAPIKey = localStorage.getItem("xAPIKey") || "";
  const sandbox = localStorage.getItem("sandbox") === "true";

  const headers = {
    "X-API-KEY": xAPIKey,
    ...(sandbox && { "X-PHOENIX-ENV": "sandbox" }),
  };

  return api
    .post(
      "embedded-bff-service/v1/embedded/authentication/merchants/token",
      {
        source_merchant_id: sourceMerchantId,
        permissions: permissions,
      },
      { headers }
    )
    .then((response) => response?.data?.data ?? null)
    .catch(() => {
      setError(true);
      return null;
    })
    .finally(() => setLoading(false));
};
```

### `src/Settings.jsx`

```jsx
import { useState } from "react";

function Settings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("xAPIKey") || "");
  const [merchantId, setMerchantId] = useState(localStorage.getItem("sourceMerchantId") || "");
  const [sandbox, setSandbox] = useState(localStorage.getItem("sandbox") === "true");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    localStorage.setItem("xAPIKey", apiKey);
    localStorage.setItem("sourceMerchantId", merchantId);
    localStorage.setItem("sandbox", String(sandbox));
    alert("Settings saved! Navigate to /checkout to test.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* API Key with show/hide */}
        <label className="block mb-2 font-medium">X-API-KEY</label>
        <div className="relative mb-4">
          <input
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded pr-16"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showApiKey ? "Hide" : "Show"}
          </button>
        </div>

        {/* Merchant ID */}
        <label className="block mb-2 font-medium">Source Merchant ID</label>
        <input
          type="text"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Mode Toggle: Live / Sandbox */}
        <label className="block mb-2 font-medium">Mode</label>
        <div className="flex items-center mb-4">
          <button
            onClick={() => setSandbox(false)}
            className={`px-4 py-2 rounded-l font-medium border ${!sandbox ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            Live
          </button>
          <button
            onClick={() => setSandbox(true)}
            className={`px-4 py-2 rounded-r font-medium border ${sandbox ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-700 border-gray-300"}`}
          >
            Sandbox
          </button>
        </div>
        {sandbox && (
          <p className="text-sm text-amber-600 mb-4">
            Sandbox mode — requests will include the X-PHOENIX-ENV: sandbox header.
          </p>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Settings;
```

### `src/Checkout.jsx`

```jsx
import { useEffect, useState } from "react";
import { PaymentProcessing } from "@phoenix-frontend/ep-react-components";
import { createAuthToken } from "./services/authService";

const defaultBilling = {
  billingName: "Alice Johnson",
  billingEmail: "alice.johnson@example.com",
  billingPhone: "2222222222",
  billingAddress1: "742 Evergreen Terrace",
  billingCity: "Springfield",
  billingState: "IL",
  billingZipcode: "62704",
};

const defaultShipping = {
  shippingName: "Bob Smith",
  shippingEmail: "bobsmith@example.com",
  shippingPhone: "1111111111",
  shippingAddress1: "195 Greenwich St",
  shippingCity: "New York",
  shippingState: "NY",
  shippingZipcode: "10006",
};

function Checkout() {
  const [token, setToken] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [billing] = useState({ ...defaultBilling });
  const [shipping] = useState({ ...defaultShipping });
  const [totalAmount, setTotalAmount] = useState("100");
  const [transactionReferenceId] = useState("txn-" + Date.now());

  const merchantId = localStorage.getItem("sourceMerchantId") || "";
  const redirectUrl = window.location.origin;

  useEffect(() => {
    if (!merchantId) return;

    createAuthToken({
      sourceMerchantId: merchantId,
      permissions: [
        "payment.create_transaction_details",
        "payment.view_transaction_details",
        "payment.view_transaction_table",
      ],
      setLoading: () => {},
      setError: () => {},
    }).then((tokenData) => {
      if (tokenData) setToken(tokenData.accessToken);
    });
  }, [merchantId]);

  const handleCheckout = () => {
    if (!token) {
      alert("Token not ready. Ensure API Key and Merchant ID are set in Settings.");
      return;
    }
    setShowPayment(false);
    setTimeout(() => setShowPayment(true), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div>
            <label className="block mb-2 font-medium">Total Amount (USD)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => { setTotalAmount(e.target.value); setShowPayment(false); }}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700"
            >
              Pay Now
            </button>
          </div>

          {/* Right: Payment Widget */}
          <div className="flex items-center justify-center bg-gray-50 rounded p-4 min-h-[300px]">
            {showPayment && token ? (
              <PaymentProcessing
                token={token}
                totalAmount={totalAmount}
                transactionReferenceId={transactionReferenceId}
                billingAddress={JSON.stringify(billing)}
                shippingAddress={JSON.stringify(shipping)}
                successUrl={`${redirectUrl}/success`}
              />
            ) : (
              <p className="text-gray-400 text-center">
                Payment widget appears here after clicking Pay Now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
```

### `src/Success.jsx`

```jsx
function Success() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600">Your transaction has been processed.</p>
        <a href="/checkout" className="mt-4 inline-block text-indigo-600 hover:underline">
          Make another payment
        </a>
      </div>
    </div>
  );
}

export default Success;
```

---

## Run Locally

```bash
npm run dev
```

1. Open `http://localhost:5173` — you'll land on the **Settings** page.
2. Enter your **X-API-KEY** (use the Show/Hide toggle to verify) and **Source Merchant ID**.
3. Choose **Live** or **Sandbox** mode.
4. Click **Save**.
5. Navigate to `/checkout`, enter an amount, and click **Pay Now**.

---

## Deploy to Render

### Push to GitHub

```bash
git init
git add .
git commit -m "Phoenix checkout prototype"
git remote add origin https://github.com/YOUR_USERNAME/phoenix-checkout.git
git push -u origin main
```

### Create a Static Site on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. **New** → **Static Site**
3. Connect your GitHub repo

4. Fill in:

| Setting | Value |
|---------|-------|
| Name | `phoenix-checkout` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18` |
| `VITE_PHOENIX_API` | `https://phoenix-api-stage.worldpay.com/` |

6. Add a **Rewrite Rule** (Redirects/Rewrites section):

| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |

> **Why?** React Router handles routing client-side. Without this rule, refreshing any page other than `/` returns a 404.

7. Click **Create Static Site** — Render builds and deploys automatically.

---

## Test on Render

1. Visit `https://phoenix-checkout.onrender.com`
2. Enter credentials on the Settings page
3. Navigate to `/checkout` and test the payment widget

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **CORS errors in console** | The Phoenix stage API needs to whitelist your Render domain. Contact the Phoenix team. |
| **404 on page refresh** | Add the `/* → /index.html` rewrite rule in Render (see step 6 above). |
| **Widget not rendering** | Add `import "@phoenix/stencil-lib";` at the top of `main.jsx` to register custom elements. |
| **"Token not ready" alert** | Check that your X-API-KEY and merchant ID are correct and saved in Settings. |
| **Build fails on Render** | Ensure `NODE_VERSION=18` is set. Verify the `.tgz` URLs are reachable from Render (not behind a VPN). |
| **Spinner hangs on npm install** | The `.tgz` host may be slow or require VPN. Try from a different network. |
