// components/NitroWidget.tsx
"use client"
import React, { useEffect, useState } from "react";

interface WidgetConfig {
  isWidget: boolean;
  widgetId: string;
  // fromChain: string;
  toChain: string;
  // fromToken: string;
  toToken: string;
  ctaColor: string;
  textColor: string;
  backgroundColor: string;
  logoURI: string;
  display: string;
  isFromSelLocked: string;
  isToSelLocked: string;
}

const NitroWidget: React.FC = () => {
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    // Widget configuration
    const configuration: WidgetConfig = {
      isWidget: true,
      widgetId:'183',
      // fromChain: "80001",
      toChain: "43113",
      // fromToken: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
      toToken: "0xb452b513552aa0B57c4b1C9372eFEa78024e5936",
      ctaColor: "#E8425A",
      textColor: "#1A1B1C",
      backgroundColor: "#3fb043",
      logoURI: "ipfs://QmaznB5PRhMC696u8yZuzN6Uwrnp7Zmfa5CydVUMvLJc9i/aDAI.svg",
      display: "vertical",
      isFromSelLocked: "0",
      isToSelLocked: "0",
    };

    // Base URL for Nitro widget
    const baseUrl = "https://app.routernitro.com/swap";

    // Generate paramString from the configuration object
    const paramString = new URLSearchParams(configuration as any).toString();
    console.log("params",paramString);
    // Set the iframe source dynamically
    setIframeSrc(`${baseUrl}?${paramString}`);
  }, []);

  return (
    <div>
      <iframe
        id="widget__iframe"
        src={iframeSrc}
        width="420px"
        height="610px"
        style={{
          border: "none",
          borderRadius: "11px",
          boxShadow: "3px 3px 10px 4px rgba(0, 0, 0, 0.05)",
        }}
        allowFullScreen
      />
    </div>
  );
};

export default NitroWidget;
