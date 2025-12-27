export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Emploseek - Job Platform</title>
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial' }}>
        <nav style={{ background: '#1e40af', color: 'white', padding: '15px' }}>
          <button style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}>
            ☰
          </button>
          <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Emploseek</span>
        </nav>
        {children}
        <footer style={{ background: '#1e3a8a', color: 'white', textAlign: 'center', padding: '20px', marginTop: '50px' }}>
          <p>📧 emploseek@gmail.com | 📍 East London, SA</p>
        </footer>
      </body>
    </html>
  )
}
