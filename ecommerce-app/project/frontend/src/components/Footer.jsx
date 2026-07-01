import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span>🌊 ShopWave</span>
          <p>A full-stack marketplace for buying & selling.</p>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} ShopWave. Built with React, Express & MongoDB.
        </div>
      </div>
    </footer>
  )
}
