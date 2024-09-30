
// import { ethers, Wallet } from "ethers"; // Import ethers.js library

// export const connectWallet = async (): Promise<{ address: string; balance: string; switch?: boolean } | null> => {
//   try {
//     // Check if MetaMask is installed
//     if (typeof window.ethereum === "undefined") {
//       if (
//         confirm(
//           "MetaMask is not installed. Would you like to download it now?"
//         )
//       ) {
//         window.open("https://metamask.io/download.html", "_blank");
//       }
//       return null;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum);

//     // Check if the user is connected to Arbitrum Sepolia
//     const network = await provider.getNetwork();
//     const targetNetwork = BigInt(0xa4b1); // Convert to bigint for comparison

//     if (network.chainId !== targetNetwork) {
//       try {
//         await provider.send("wallet_switchEthereumChain", [{ chainId: "0xa4b1" }]); // Switch to Arbitrum One mainnet
//         return {address: '', balance: '', switch: true};
//       } catch (switchError: unknown) {
//         if ((switchError as { code: number }).code === 4902) {
//           try {
//             await provider.send("wallet_addEthereumChain", [
//               {
//                 chainId: "0xa4b1",
//                 chainName: "Arbitrum One",
//                 rpcUrls: ["https://arb1.arbitrum.io/rpc"],
//               },
//             ]);
//           } catch (addError) {
//             console.error("Failed to add Arbitrum One mainnet", addError);
//             return null;
//           }
//         } else {
//           console.error("Failed to switch network", switchError);
//           return null;
//         }
//       }
//     }

//     // Request the user's Ethereum accounts
//     const accounts = await provider.send("eth_requestAccounts", []);

//     if (accounts.length === 0) {
//       alert("No Ethereum account is connected. Please connect your wallet.");
//       return null;
//     }

//     const accountAddress = accounts[0];
//     const balance = await provider.getBalance(accountAddress);

//     // Return the wallet address and balance
//     return {
//       address: accountAddress,
//       balance: ethers.formatEther(balance),
//       switch: false
//     };
//   } catch (err) {
//     console.log("Error connecting wallet:", err);
//     return null;
//   }
// };

import { ethers } from "ethers"; // Import ethers.js library

export const connectWallet = async (): Promise<{ address: string; balance: string; switch?: boolean } | null> => {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      if (
        confirm(
          "MetaMask is not installed. Would you like to download it now?"
        )
      ) {
        window.open("https://metamask.io/download.html", "_blank");
      }
      return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    // Check if the user is connected to Arbitrum One
    const network = await provider.getNetwork();
    const targetNetwork = BigInt(0xa4b1); // Arbitrum One chain ID

    if (network.chainId !== targetNetwork) {
      try {
        // First, attempt to add the Arbitrum One chain if it's not recognized
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: "0xa4b1",
            chainName: "Arbitrum One",
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://arbiscan.io/"],
          },
        ]);

        // Then switch to Arbitrum One network
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0xa4b1" }]);
        return { address: '', balance: '', switch: true };
      } catch (addError) {
        console.error("Failed to add or switch Arbitrum One mainnet", addError);
        return null;
      }
    }

    // Request the user's Ethereum accounts
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length === 0) {
      alert("No Ethereum account is connected. Please connect your wallet.");
      return null;
    }

    const accountAddress = accounts[0];
    const balance = await provider.getBalance(accountAddress);

    // Return the wallet address and balance
    return {
      address: accountAddress,
      balance: ethers.formatEther(balance),
      switch: false,
    };
  } catch (err) {
    console.log("Error connecting wallet:", err);
    return null;
  }
};