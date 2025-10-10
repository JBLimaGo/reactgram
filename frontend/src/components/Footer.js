import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre</h3>
          <ul class="footer-links">
            <li>
              <a href="#">Nossa História</a>
            </li>
            <li>
              <a href="#">Equipe</a>
            </li>
            <li>
              <a href="#">Contato</a>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Links Úteis</h3>
          <ul class="footer-links">
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Suporte</a>
            </li>
            <li>
              <a href="#">Termos</a>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Social</h3>
          <div class="footer-social">
            <a href="#">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2023 ReactGram. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
