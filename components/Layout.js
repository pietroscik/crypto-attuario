import Head from "next/head";
import Link from "next/link";
import Script from "next/script";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/staking", label: "Staking" },
  { href: "/rendita", label: "Rendita" },
  { href: "/var", label: "VaR" },
  { href: "/pensione", label: "Pensione" },
  { href: "/confronto", label: "DeFi vs TradFi" },
  { href: "/defi", label: "Analisi DeFi" },
  { href: "/sponsor", label: "Collabora" },
];

export default function Layout({
  children,
  title = "Crypto-Attuario",
  description = "Strumenti e analisi attuariali applicati al mondo crypto e DeFi.",
  showAd = true,
  adSlot = "1234567890",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>

      {/* Script AdSense globale: caricato una sola volta */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8531177897035530"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <header className="header">
        <h1>Crypto-Attuario</h1>
        <nav aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        {showAd && (
          <section className="ads-container" aria-label="Annuncio pubblicitario">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-8531177897035530"
              data-ad-slot={adSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <Script id="ads-init" strategy="afterInteractive">{`
              (adsbygoogle = window.adsbygoogle || []).push({});
            `}</Script>
          </section>
        )}

        {children}
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario • Ricerca e analisi quantitative</p>
        <small>
          ⚠️ Non forniamo consulenza finanziaria. Le informazioni hanno finalità
          educative.
        </small>
      </footer>
    </>
  );
}

