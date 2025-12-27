export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          background: '#1e40af', 
          color: 'white', 
          padding: '15px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
          }}>
            ☰
          </button>
          <span style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '20px' }}>
            Emploseek
          </span>
          <span style={{
            marginLeft: '10px',
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px'
          }}>
            East London, SA
          </span>
        </nav>
        
        {children}
        
        <footer style={{
          background: '#1e3a8a',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
          marginTop: '50px'
        }}>
          <p>📧 emploseek@gmail.com | 📍 East London, South Africa</p>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>
            © 2024 Emploseek International
          </p>
        </footer>
      </body>
    </html>
  )
}
