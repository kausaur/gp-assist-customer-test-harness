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
      alert(
        "Token not ready. Ensure API Key and Merchant ID are set in Settings."
      );
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
            <label className="block mb-2 font-medium">
              Total Amount (USD)
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => {
                setTotalAmount(e.target.value);
                setShowPayment(false);
              }}
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
          <div className="flex items-center justify-center bg-gray-50 rounded p-4">
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
              <p className="text-gray-400">
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
