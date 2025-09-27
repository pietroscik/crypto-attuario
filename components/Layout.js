import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div>
      <header style={{ padding: "1rem", background: "#111", color: "#fff" }}>
        <h1>Crypto-Attuario</h1>
        <nav style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/sponsor">Collabora</Link>

          {/* Dropdown Calcolatori */}
          <div className="dropdown">
            <span>Calcolatori ▾</span>
            <div className="dropdown-content">
              <Link href="/staking">Staking</Link>
              <Link href="/rendita">Rendita</Link>
              <Link href="/var">Value at Risk</Link>
              <Link href="/pensione">Pensione Crypto</Link>
              <Link href="/confronto">DeFi vs TradFi</Link>
            </div>
          </div>

          {/* Dropdown Analisi DeFi */}
          <div className="dropdown">
            <span>Analisi DeFi ▾</span>
            <div className="dropdown-content">
              <Link href="/defi">Panoramica</Link>
              <Link href="/protocols/aave">Aave</Link>
              <Link href="/protocols/uniswap">Uniswap</Link>
              <Link href="/protocols/curve">Curve</Link>
              <Link href="/protocols/lido">Lido</Link>
            </div>
          </div>

          <Link href="/glossario">Glossario</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>{children}</main>

      <footer style={{ padding: "1rem", background: "#111", color: "#fff" }}>
        <p>© 2025 Crypto-Attuario</p>
      </footer>

      {/* CSS minimale per dropdown */}
      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown span {
          cursor: pointer;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #222;
          min-width: 160px;
          z-index: 1;
          padding: 0.5rem;
          border-radius: 5px;
        }
        .dropdown-content a {
          display: block;
          padding: 0.25rem 0;
          color: #00ffcc;
          text-decoration: none;
        }
        .dropdown-content a:hover {
          color: #fff;
        }
        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  );
}