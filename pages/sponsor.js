export default function Sponsor() {
  return (
    <>
      <header>
        <h1>Collabora con noi</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="/sponsor">Collabora con noi</a>
        </nav>
      </header>

      <main>
        <section>
          <h2>Sponsorizzazioni Crypto</h2>
          <p>Vuoi promuovere la tua piattaforma, exchange o startup blockchain? Offriamo:</p>
          <ul>
            <li>✅ Banner promozionali</li>
            <li>✅ Articoli sponsorizzati</li>
            <li>✅ Recensioni e analisi tecniche</li>
          </ul>
        </section>

        <section>
          <h2>Richiedi informazioni</h2>
          <form>
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="message">Messaggio:</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit">Invia richiesta</button>
          </form>
        </section>
      </main>

      <footer>
        <p>© 2025 Crypto-Attuario</p>
      </footer>
    </>
  );
}