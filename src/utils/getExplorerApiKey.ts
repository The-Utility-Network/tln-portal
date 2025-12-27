// src/utils/getExplorerApiKey.ts (Server-side utility)
export const getExplorerApiKey = () => {
    const key = process.env.NEXT_PUBLIC_EXPLORER_API_KEY;
    if (!key) {
      throw new Error("EXPLORER_API_KEY environment variable is not set.");
    }
    return key;
  };
  