
import { ethers } from "ethers"; // Import ethers.js library

export const connectWallet = async (): Promise<{ address: string; balance: string } | null> => {
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

    // Check if the user is connected to Arbitrum Sepolia
    const network = await provider.getNetwork();
    const targetNetwork = BigInt(0x66eee); // Convert to bigint for comparison

    if (network.chainId !== targetNetwork) {
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0x66eee" }]); // Switch to Arbitrum Sepolia
      } catch (switchError: unknown) {
        if ((switchError as { code: number }).code === 4902) {
          try {
            await provider.send("wallet_addEthereumChain", [
              {
                chainId: "0xa4b1",
                chainName: "Arbitrum One",
                rpcUrls: ["https://arb1.arbitrum.io/rpc"],
              },
            ]);
          } catch (addError) {
            console.error("Failed to add Arbitrum One main net", addError);
            return null;
          }
        } else {
          console.error("Failed to switch network", switchError);
          return null;
        }
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
    };
  } catch (err) {
    console.log("Error connecting wallet:", err);
    return null;
  }
};
