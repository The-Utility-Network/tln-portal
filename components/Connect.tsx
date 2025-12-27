'use client';

import {
  useSetActiveWallet,
  ConnectButton,
  darkTheme,
} from 'thirdweb/react';
import { inAppWallet, createWallet, walletConnect } from 'thirdweb/wallets';
import { base } from 'thirdweb/chains';
import { useEffect, useState } from 'react';

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
        "github",
        "twitch",
        "steam",
        "line",
        "facebook",
        "apple",
        "coinbase",
      ],
    },
  }),
  createWallet("io.rabby"),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.zerion.wallet"),
];

export default function Wallet() {
  const setActiveAccount = useSetActiveWallet();
  const [walletAddress, setWalletAddress] = useState(null);
  const [client, setClient] = useState<any>(null);

  // Fetch the thirdweb client config from the server-side utility
  useEffect(() => {
    const fetchClientConfig = async () => {
      try {
        // Dynamically import the server-side function to fetch the client configuration
        const clientConfig = await import('../src/utils/createThirdwebClient');
        const thirdwebClient = clientConfig.getThirdwebClient();
        setClient(thirdwebClient);
      } catch (error) {
        console.error('Error fetching thirdweb client config:', error);
      }
    };

    fetchClientConfig();
  }, []);

  const handleConnect = async (account: any) => {
    await setActiveAccount(account);
    setWalletAddress(account);
  };

  if (!client) {
    return <div>Loading...</div>; // Add a loading state while the client is being fetched
  }

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={base}
      detailsButton={{
        displayBalanceToken: {
          [base.id]: "0x389dfbCB6Ee872efa97bb5713d76DdA8419Af8CC", // token address to display balance for
        },
      }}
      supportedTokens={{
        [base.id]: [
          {
            address: "0x389dfbCB6Ee872efa97bb5713d76DdA8419Af8CC",
            name: "Machiavelli",
            symbol: "MKVLI",
            icon: "https://storage.googleapis.com/tgl_cdn/images/Medallions/MKVLI.png",
          },
        ],
      }}
      accountAbstraction={{
        chain: base,
        sponsorGas: true,
      }}
      theme={darkTheme({
        colors: {
          accentText: '#00bf8a',               // TLN green
          accentButtonBg: '#004d1f',           // dark TLN green
          primaryButtonBg: 'rgba(0, 200, 81, 0.7)',  // transparent TLN green
          primaryButtonText: '#ffffff',        // white text
          secondaryButtonText: '#f8f8f2',      // pale text
          secondaryText: '#00bf8a',            // TLN green accent
          modalBg: 'rgba(0, 77, 31, 0.8)',     // transparent dark TLN green
          connectedButtonBg: 'rgba(0, 200, 81, 0.7)', // transparent TLN green
          borderColor: '#00bf8a',              // TLN green border
        },
      })}
      connectButton={{ label: "Enter The Society" }}
      connectModal={{
        size: 'wide',
        titleIcon:
          'https://storage.googleapis.com/tgl_cdn/images/Medallions/TLN.png',
        welcomeScreen: {
          title: 'Welcome to The Loch Ness Botanical Society!',
          subtitle: 'Connect your wallet to explore our botanical world.',
          img: {
            src: 'https://storage.googleapis.com/tgl_cdn/images/Medallions/TLN.png',
            width: 150,
            height: 150,
          },
        },
        showThirdwebBranding: false,
      }}
      onConnect={handleConnect}
    />
  );
}
