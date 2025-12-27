'use client'
import { useState } from 'react'
import './globals.css'

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReferenceCheck, setShowReferenceCheck] = useState(false)
  const [referenceResult, setReferenceResult] = useState(null)
  const [checking, setChecking] = useState(false)

  const checkReference = async (reference) => {
    setChecking(true)
    try {
      const response = await fetch(`/api/check/${reference}`)
      const data = await response.json()
      setReferenceResult(data)
    } catch (error) {
      setReferenceResult({ error: 'Failed to check reference' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <html lang="en">
      <head>
        <title>Emploseek - International Job Platform</title>
        <meta name="description" content="Find jobs, internships, and language stays worldwide. Professional recruitment agency based in East London, South Africa." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .btn-gradient {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
          }
        `}</style>
      </head>
      <body style={{
        margin: 0,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh'
      }}>
        {/* Navigation Bar */}
        <nav style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          color: 'white',
          padding: '0 20px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45px',
                height: '45px'
              }}
            >
              ☰
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-briefcase" style={{ color: '#1e40af', fontSize: '20px' }}></i>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Emploseek</div>
                <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '10px' }}></i>
                  East London, South Africa
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 20px',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)'
          }}>
            <i className="fas fa-envelope" style={{ marginRight: '10px' }}></i>
            emploseek@gmail.com
          </div>
        </nav>

        {/* Sidebar Menu */}
        {sidebarOpen && (
          <>
            <div 
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                top: '70px',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 998
              }}
            />
            <div style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              width: '320px',
              height: 'calc(100vh - 70px)',
              background: 'white',
              boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
              zIndex: 999,
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{ padding: '30px' }}>
                <h3 style={{ 
                  color: '#1e40af', 
                  fontSize: '20px', 
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-compass"></i>
                  Navigation
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setShowReferenceCheck(false)
                      setSidebarOpen(false)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      color: '#374151',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-home" style={{ color: 'white', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>Accueil</div>
                      <div style={{ fontSize: '13px', color: '#9ca3af' }}>Find opportunities</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowReferenceCheck(true)
                      setSidebarOpen(false)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      color: '#374151',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-search" style={{ color: 'white', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>Reference Check</div>
                      <div style={{ fontSize: '13px', color: '#9ca3af' }}>Verify your contract</div>
                    </div>
                  </button>
                </div>
                
                <div style={{ 
                  marginTop: '30px', 
                  paddingTop: '25px', 
                  borderTop: '1px solid #e5e7eb',
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-handshake" style={{ color: 'white', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>For Agencies</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>Partner with us</div>
                    </div>
                  </div>
                  
                  <a 
                    href="mailto:emploseek@gmail.com"
                    style={{
                      display: 'block',
                      background: 'white',
                      color: '#1e40af',
                      padding: '15px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: '2px solid #dbeafe',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#1e40af'
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white'
                      e.target.style.color = '#1e40af'
                    }}
                  >
                    <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                    Contact Our Team
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main>
          {showReferenceCheck ? (
            <ReferenceChecker 
              checkReference={checkReference}
              result={referenceResult}
              checking={checking}
              onBack={() => setShowReferenceCheck(false)}
            />
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: 'white',
          padding: '50px 20px 30px',
          marginTop: '80px'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-briefcase" style={{ color: '#1e40af', fontSize: '24px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Emploseek</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>International Recruitment</div>
                </div>
              </div>
              <p style={{ color: '#93c5fd', lineHeight: '1.6' }}>
                Connecting global talent with premium opportunities across 90+ countries. 
                Professional recruitment services based in East London, South Africa.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px' }}></i>
                Our Location
              </h4>
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '20px', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ marginBottom: '5px' }}>📌 East London, South Africa</p>
                <p style={{ marginBottom: '5px' }}>🌍 Serving clients worldwide</p>
                <p>🕐 24/7 Support Available</p>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                <i className="fas fa-phone-alt" style={{ marginRight: '10px' }}></i>
                Contact Information
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <a href="mailto:emploseek@gmail.com" style={{
                  color: '#93c5fd',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <i className="fas fa-envelope"></i>
                  emploseek@gmail.com
                </a>
                <div style={{
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="fas fa-clock"></i>
                  24-hour response time
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '30px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>
              © 2024 Emploseek International. All rights reserved. | 
              Professional Recruitment Agency | Registration Number: 2024/123456/07
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

// Reference Checker Component
function ReferenceChecker({ checkReference, result, checking, onBack }) {
  const [reference, setReference] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (reference.trim()) {
      checkReference(reference.trim())
    }
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '0 20px'
    }}>
      <button 
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#6b7280',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px',
          padding: '10px 20px',
          borderRadius: '10px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.background = 'none'}
      >
        <i className="fas fa-arrow-left"></i>
        Back to Home
      </button>

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          borderRadius: '50%',
          opacity: 0.05
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '50%',
          opacity: 0.05
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(30, 64, 175, 0.2)'
            }}>
              <i className="fas fa-search" style={{ color: 'white', fontSize: '32px' }}></i>
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Contract Verification
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Verify the authenticity of your employment contract, internship agreement, 
              or language stay documentation issued through Emploseek.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
            <div style={{ 
              background: '#f8fafc',
              padding: '40px',
              borderRadius: '16px',
              border: '2px dashed #d1d5db'
            }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#374151',
                textAlign: 'center'
              }}>
                <i className="fas fa-key" style={{ marginRight: '10px', color: '#1e40af' }}></i>
                Enter your contract reference number:
              </label>
              
              <div style={{ 
                display: 'flex', 
                gap: '15px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <input 
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Example: EMP2024001"
                  style={{
                    flex: 1,
                    padding: '18px 25px',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
                
                <button 
                  type="submit"
                  disabled={checking}
                  style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    color: 'white',
                    padding: '0 40px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 10px 25px rgba(30, 64, 175, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: checking ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => !checking && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !checking && (e.target.style.transform = 'translateY(0)')}
                >
                  {checking ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-check"></i>
                      Verify Contract
                    </>
                  )}
                </button>
              </div>
              
              <div style={{ 
                marginTop: '20px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                Enter the 10-digit reference number provided in your contract document
              </div>
            </div>
          </form>

          {result && (
            <div style={{
              background: result.error ? '#fef2f2' : 
                         result.valid ? '#f0fdf4' : '#fffbeb',
              border: `2px solid ${result.error ? '#fecaca' : 
                        result.valid ? '#bbf7d0' : '#fde68a'}`,
              borderRadius: '16px',
              padding: '40px',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              {result.error ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    color: '#dc2626'
                  }}>
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <h2 style={{
                    color: '#dc2626',
                    fontSize: '28px',
                    marginBottom: '15px'
                  }}>
                    Verification Failed
                  </h2>
                  <p style={{ 
                    color: '#dc2626', 
                    fontSize: '18px',
                    marginBottom: '25px'
                  }}>
                    {result.message || 'Reference not found in our system'}
                  </p>
                  <div style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    padding: '20px',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    margin: '0 auto'
                  }}>
                    <p style={{ color: '#991b1b', marginBottom: '10px' }}>
                      <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                      Please verify the reference number with your recruitment agency.
                    </p>
                    <p style={{ color: '#991b1b', fontSize: '14px' }}>
                      Contact: <strong>emploseek@gmail.com</strong> for assistance
                    </p>
                  </div>
                </div>
              ) : result.valid ? (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                      fontSize: '60px',
                      marginBottom: '20px',
                      color: '#059669'
                    }}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h2 style={{
                      color: '#059669',
                      fontSize: '32px',
                      marginBottom: '10px',
                      fontWeight: 'bold'
                    }}>
                      ✅ VALID CONTRACT VERIFIED
                    </h2>
                    <p style={{ 
                      color: '#059669', 
                      fontSize: '18px',
                      marginBottom: '10px'
                    }}>
                      Reference: <strong>{result.reference}</strong>
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                      Verified on {new Date().toLocaleDateString()} • Emploseek Certification
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                  }}>
                    {/* Client Information */}
                    <div style={{
                      background: 'white',
                      padding: '25px',
                      borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{
                        color: '#1e40af',
                        fontSize: '18px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#dbeafe',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="fas fa-user" style={{ color: '#1e40af' }}></i>
                        </div>
                        Client Information
                      </h3>
                      
                      <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-user-tag" style={{ marginRight: '8px' }}></i>
                            Full Name
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.client?.firstName} {result.client?.lastName}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                            Date of Birth
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.client?.birthDate}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-passport" style={{ marginRight: '8px' }}></i>
                            Nationality
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.client?.nationality}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contract Details */}
                    <div style={{
                      background: 'white',
                      padding: '25px',
                      borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{
                        color: '#059669',
                        fontSize: '18px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#d1fae5',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <i className="fas fa-file-contract" style={{ color: '#059669' }}></i>
                        </div>
                        Contract Details
                      </h3>
                      
                      <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-globe" style={{ marginRight: '8px' }}></i>
                            Country
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.contract?.country}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                            Company
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.contract?.company}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '5px' }}>
                            <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
                            Duration
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                            {result.contract?.startDate} - {result.contract?.endDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Section */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    padding: '30px',
                    borderRadius: '16px',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ 
                      color: 'white', 
                      fontSize: '20px',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <i className="fas fa-file-download"></i>
                      Download Official Documents
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px',
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <button style={{
                        background: 'white',
                        color: '#1e40af',
                        padding: '15px 30px',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <i className="fas fa-file-pdf" style={{ color: '#dc2626' }}></i>
                        Download Contract (PDF)
                      </button>
                      
                      <button style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '15px 30px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                      >
                        <i className="fas fa-certificate"></i>
                        Verification Certificate
                      </button>
                    </div>
                    
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '14px',
                      marginTop: '20px'
                    }}>
                      <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
                      Secure document download • Valid until {result.contract?.endDate}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    color: '#d97706'
                  }}>
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h2 style={{
                    color: '#d97706',
                    fontSize: '28px',
                    marginBottom: '15px'
                  }}>
                    Reference Not Found
                  </h2>
                  <p style={{ color: '#92400e', fontSize: '16px' }}>
                    This reference number is not registered in our system.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
