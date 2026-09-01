import { useEffect, useState } from "react";
import { MerchantOnboarding } from "@phoenix-frontend/ep-react-components";
import { createAuthToken } from "./services/authService";

function OnBoarding() {
  const merchantId = localStorage.getItem("sourceMerchantId") || "";
  const redirectUrl = window.location.origin;
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!merchantId) return;

    createAuthToken({
      sourceMerchantId: merchantId,
      permissions: [
        "onboarding_component.view_underwriting",
        "onboarding_component.edit_underwriting",
        "onboarding_component.submit_form",
        "onboarding_component.initiate_onboarding",
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
        <h1 className="text-3xl font-bold mb-8">Merchant Onboarding</h1>
        {!merchantId && (
          <p className="text-red-500">Set Merchant ID in Settings first.</p>
        )}
        {token ? (
          <MerchantOnboarding
            token={token}
            redirectUrl={`${redirectUrl}/payments`}
          />
        ) : (
          merchantId && <p className="text-gray-400">Loading onboarding...</p>
        )}
      </div>
    </div>
  );
}

export default OnBoarding;
