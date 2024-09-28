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
      toChain: "42161",
      // fromToken: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
      toToken: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      ctaColor: "#5538CE",
      textColor: "#fff",
      backgroundColor: "#111",
      logoURI: "https://clusterprotocol2024.s3.amazonaws.com/website+logo/logo.png",
      display: "vertical",
      isFromSelLocked: "0",
      isToSelLocked: "1",
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
