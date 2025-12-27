// src/utils/createThirdwebClient.ts (this is a server-side utility)

import { createThirdwebClient } from "thirdweb";

// This utility will only be executed server-side
export const getThirdwebClient = () => {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT;
  if (!clientId) {
    console.warn("NEXT_PUBLIC_THIRDWEB_CLIENT is not set. Using a placeholder for build.");
  }
  const client = createThirdwebClient({
    clientId: clientId || "00000000000000000000000000000000", // Placeholder to prevent build crash
  });
  return client;
};