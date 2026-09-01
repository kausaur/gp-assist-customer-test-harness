import { useEffect, useState } from "react";
import { createAuthToken } from "./services/authService";

function Subscriptions() {
  const merchantId = localStorage.getItem("sourceMerchantId") || "";
  const [token, setToken] = useState("");
  const [customerId, setCustomerId] = useState(
    localStorage.getItem("customerId") || "customer-id-123"
  );
  const [appliedCustomerId, setAppliedCustomerId] = useState(customerId);

  useEffect(() => {
    if (!merchantId) return;

    createAuthToken({
      sourceMerchantId: merchantId,
      permissions: [
        "payment.view_transaction_table",
        "payment.view_transaction_details",
        "payment.create_transaction_details",
        "payment.view_all_merchant_subscriptions",
        "payment.can_cancel_subscriptions",
      ],
      setLoading: () => {},
      setError: () => {},
    }).then((tokenData) => {
      if (tokenData) setToken(tokenData.accessToken);
    });
  }, [merchantId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Subscriptions</h1>
        {!merchantId && (
          <p className="text-red-500">Set Merchant ID in Settings first.</p>
        )}
        {token ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 w-full max-w-md">
              <label className="text-sm font-medium whitespace-nowrap" htmlFor="customer-id">
                Customer ID
              </label>
              <input
                id="customer-id"
                className="flex-1 p-2 border rounded"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => setAppliedCustomerId(customerId)}
                type="button"
              >
                Apply
              </button>
            </div>
            <customer-subscriptions
              key={appliedCustomerId}
              customer-id={appliedCustomerId}
              read-only="false"
              token={token}
            />
          </div>
        ) : (
          merchantId && <p className="text-gray-400">Loading subscriptions...</p>
        )}
      </div>
    </div>
  );
}

export default Subscriptions;
