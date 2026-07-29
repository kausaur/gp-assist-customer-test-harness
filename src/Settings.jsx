import { useState } from "react";

function Settings() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("xAPIKey") || "");
  const [merchantId, setMerchantId] = useState(
    localStorage.getItem("sourceMerchantId") || ""
  );
  const [sandbox, setSandbox] = useState(
    localStorage.getItem("sandbox") === "true"
  );
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
        <label className="block mb-2 font-medium">Source Merchant ID</label>
        <input
          type="text"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Mode Toggle */}
        <label className="block mb-2 font-medium">Mode</label>
        <div className="flex items-center mb-4">
          <button
            onClick={() => setSandbox(false)}
            className={`px-4 py-2 rounded-l font-medium border ${
              !sandbox
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setSandbox(true)}
            className={`px-4 py-2 rounded-r font-medium border ${
              sandbox
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Sandbox
          </button>
        </div>
        {sandbox && (
          <p className="text-sm text-amber-600 mb-4">
            Sandbox mode — requests will include the X-PHOENIX-ENV: sandbox
            header.
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
