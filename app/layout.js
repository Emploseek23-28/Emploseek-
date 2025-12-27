'use client'
import { useState } from 'react'
import './globals.css'

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReferenceCheck, setShowReferenceCheck] = useState(false)

  return (
    <html lang="en">
      <head>
        <title>Emploseek - International Job Platform</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {/* Navigation */}
        <nav style={{
          background: '#1e40af',
          color: 'white',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Emploseek</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>East London, SA</div>
            </div>
          </div>
          
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            📧 emploseek@gmail.com
          </div>
        </nav>

        {/* Sidebar Menu */}
        {sidebarOpen && (
          <div style={{
            position: 'fixed',
            top: '73px',
            left: 0,
            width: '300px',
            height: 'calc(100vh - 73px)',
            background: 'white',
            boxShadow: '5px 0 15px rgba(0,0,0,0.1)',
            zIndex: 999,
            padding: '20px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowReferenceCheck(false)
                  setSidebarOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <i className="fas fa-home"></i> Accueil
              </button>
              
              <button 
                onClick={() => {
                  setShowReferenceCheck(true)
                  setSidebarOpen(false)
                }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <i className="fas fa-search"></i> Reference Check
              </button>
              
              <a 
                href="/admin"
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'left',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <i className="fas fa-lock"></i> Admin Panel
              </a>
              
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Contact rapide:</p>
                <a 
                  href="mailto:emploseek@gmail.com"
                  style={{
                    color: '#1e40af',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <i className="fas fa-envelope"></i> emploseek@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Overlay when sidebar is open */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: '73px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 998
            }}
          />
        )}

        {/* Main Content */}
        <main>
          {/* Show Reference Check or Homepage */}
          {showReferenceCheck ? (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
              <ReferenceCheck />
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <footer style={{
          background: '#1e3a8a',
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
          marginTop: '50px'
        }}>
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Emploseek International</p>
          <p style={{ marginBottom: '15px' }}>📍 East London, South Africa</p>
          <p style={{ marginBottom: '20px' }}>
            📧 <a href="mailto:emploseek@gmail.com" style={{ color: '#93c5fd', textDecoration: 'none' }}>
              emploseek@gmail.com
            </a>
          </p>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>
            © 2024 Emploseek. All rights reserved.
          </p>
        </footer>

        <style jsx>{`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </body>
    </html>
  )
}

// Reference Check Component (embedded in layout)
function ReferenceCheck() {
  const [reference, setReference] = useState('')
  const [result, setResult] = useState(null)

  const checkReference = () => {
    if (!reference.trim()) {
      setResult({ type: 'error', message: 'Please enter a reference number' })
      return
    }

    // Demo validation
    const ref = reference.trim().toUpperCase()
    const validRefs = ['EMP-2024-001', 'INT-2024-001', 'LANG-2024-001']
    
    if (validRefs.includes(ref)) {
      setResult({
        type: 'success',
        reference: ref,
        client: {
          name: 'John Doe',
          birthDate: '1990-05-15',
          photo: '👤'
        },
        contract: {
          country: 'Germany',
          type: 'CDI',
          startDate: '2024-03-01'
        }
      })
    } else {
      setResult({
        type: 'invalid',
        message: 'Reference not found in our system'
      })
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      marginTop: '30px'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#1e40af',
        fontSize: '36px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <i className="fas fa-search"></i> Reference Check
      </h1>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#374151'
        }}>
          Enter your contract reference number:
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Example: EMP-2024-001"
            style={{
              flex: 1,
              padding: '15px',
              border: '2px solid #d1d5db',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />
          <button 
            onClick={checkReference}
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Verify Reference
          </button>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginTop: '8px'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
          Example valid references: EMP-2024-001, INT-2024-001, LANG-2024-001
        </p>
      </div>
      
      {result && (
        <div style={{
          background: result.type === 'success' ? '#f0fdf4' : 
                    result.type === 'error' ? '#fef2f2' : '#fef3c7',
          border: `2px solid ${result.type === 'success' ? '#bbf7d0' : 
                    result.type === 'error' ? '#fecaca' : '#fde68a'}`,
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center'
        }}>
          {result.type === 'success' ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px', color: '#16a34a' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 style={{
                color: '#166534',
                fontSize: '28px',
                marginBottom: '10px'
              }}>
                VALID CONTRACT
              </h2>
              <p style={{ color: '#166534', fontSize: '18px', marginBottom: '30px' }}>
                Reference: <strong>{result.reference}</strong>
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#15803d' }}>
                    <i className="fas fa-user" style={{ marginRight: '5px' }}></i>Client Name
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.client.name}</div>
                </div>
                <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#15803d' }}>
                    <i className="fas fa-calendar" style={{ marginRight: '5px' }}></i>Date of Birth
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.client.birthDate}</div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#1e40af' }}>
                    <i className="fas fa-globe" style={{ marginRight: '5px' }}></i>Country
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.contract.country}</div>
                </div>
                <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#1e40af' }}>
                    <i className="fas fa-file-contract" style={{ marginRight: '5px' }}></i>Type
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.contract.type}</div>
                </div>
                <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#1e40af' }}>
                    <i className="fas fa-calendar-check" style={{ marginRight: '5px' }}></i>Start Date
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.contract.startDate}</div>
                </div>
              </div>
              
              <button style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-file-pdf"></i> Download Contract (PDF)
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px', color: result.type === 'error' ? '#dc2626' : '#d97706' }}>
                {result.type === 'error' ? (
                  <i className="fas fa-exclamation-circle"></i>
                ) : (
                  <i className="fas fa-times-circle"></i>
                )}
              </div>
              <h2 style={{
                color: result.type === 'error' ? '#dc2626' : '#d97706',
                fontSize: '28px',
                marginBottom: '10px'
              }}>
                {result.type === 'error' ? 'ERROR' : 'INVALID REFERENCE'}
              </h2>
              <p style={{ 
                color: result.type === 'error' ? '#dc2626' : '#d97706', 
                fontSize: '18px',
                marginBottom: '20px'
              }}>
                {result.message}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Please contact your agency or email us at <strong>emploseek@gmail.com</strong>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
