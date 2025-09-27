
export default function Layout({ children }) {
  return (
    <>
      <header>
        <h1>Crypto-Attuario</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/sponsor">Collabora</a>
          <a href="/staking">Calcolatore Staking</a>
          <a href="/staking">Calcolatore Staking</a>
          <a href="/rendita">Rendita Crypto</a>
          <a href="/var">Value at Risk</a>
          <a href="/pensione">Pensione Crypto</a>
          <a href="/confronto">Confronto DeFi vs TradFi</a>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2025 Crypto-Attuario</p>
      </footer>
    </>
  );
}