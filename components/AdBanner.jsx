import { useEffect } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID } from "./adConfig";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={ADSENSE_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}