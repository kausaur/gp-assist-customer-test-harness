import { useEffect, useState } from "react";
import { PaymentDashboard } from "@phoenix-frontend/ep-react-components";
import { createAuthToken } from "./services/authService";

function Payments() {
  const merchantId = localStorage.getItem("sourceMerchantId") || "";
  const redirectUrl = window.location.origin;
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!merchantId) return;

    createAuthToken({
      sourceMerchantId: merchantId,
      permissions: [
        "payment.view_transaction_table",
        "payment.view_transaction_details",
        "payment.create_transaction_details",
        "payment.create_refund",
        "payment.view_refund",
        "payment.reverse_refund",
        "payment.create_cancellation",
        "payment.view_cancellation",
        "payment.view_balances",
        "payment.view_disputes",
        "payment.defend_dispute",
        "payment.view_dispute_details",
        "payment.request_on_demand_payout",
        "payment.view_payout_table",
        "payment.view_payout_details",
        "payment.set_payout_schedule",
        "payment.generate_and_download_report",
        "payment.make_dispute_decisions",
        "settings.global_settings.edit_global_settings",
        "settings.global_settings.view_global_settings",
        "onboarding_component.view_underwriting",
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payments</h1>
        {!merchantId && (
          <p className="text-red-500">Set Merchant ID in Settings first.</p>
        )}
        {token ? (
          <PaymentDashboard token={token} redirectUrl={redirectUrl} />
        ) : (
          merchantId && <p className="text-gray-400">Loading payments...</p>
        )}
      </div>
    </div>
  );
}

export default Payments;
