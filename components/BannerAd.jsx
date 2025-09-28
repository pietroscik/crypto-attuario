import { useEffect } from "react";

export default function BannerAd({ slot, format = "auto", responsive = "true" }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.log("Adsense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "20px 0" }}
      data-ad-client="ca-pub-8531177897035530"
      data-ad-slot={slot}     // ← qui va il codice slot che AdSense ti fornirà
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  );
}