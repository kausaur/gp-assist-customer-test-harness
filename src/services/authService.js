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
