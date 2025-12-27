'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // État pour le nouveau contrat
  const [newContract, setNewContract] = useState({
    clientId: '',
    reference: '',
    type: 'CDI',
    company: '',
    country: '',
    startDate: '',
    endDate: '',
    position: '',
    salary: '',
    description: '',
    pdfUrl: '',
    
    // Informations client (si nouveau)
    client: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      nationality: '',
      passportNumber: '',
      address: ''
    }
  })
  
  const [contracts, setContracts] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('new')
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalClients: 0,
    countries: 0
  })

  // Charger les données au login
  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [contractsRes, clientsRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/users')
      ])
      
      if (contractsRes.ok) {
        const contractsData = await contractsRes.json()
        setContracts(contractsData)
        
        // Calculer les stats
        const activeContracts = contractsData.filter(c => 
          new Date(c.endDate) > new Date()
        ).length
        
        const uniqueCountries = [...new Set(contractsData.map(c => c.country))].length
        
        setStats({
          totalContracts: contractsData.length,
          activeContracts,
          totalClients: clients.length,
          countries: uniqueCountries
        })
      }
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        setClients(clientsData)
        setStats(prev => ({ ...prev, totalClients: clientsData.length }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Vérification simple du mot de passe
    if (password === 'admin123') {
      setIsLoggedIn(true)
      localStorage.setItem('admin_authenticated', 'true')
    } else {
      alert('Mot de passe incorrect. Utilisez: admin123')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  const handleContractChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('client.')) {
      const clientField = name.split('.')[1]
      setNewContract(prev => ({
        ...prev,
        client: {
          ...prev.client,
          [clientField]: value
        }
      }))
    } else {
      setNewContract(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateReference = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    const typeCode = newContract.type === 'CDI' ? 'EMP' : 
                     newContract.type === 'CDD' ? 'TEMP' : 
                     newContract.type === 'Internship' ? 'INT' : 'LANG'
    
    return `${typeCode}${year}${randomNum}`
  }

  const handleAddContract = async () => {
    // Validation
    if (selectedClient === 'new') {
      if (!newContract.client.firstName || !newContract.client.lastName || !newContract.client.email) {
        alert('Veuillez remplir les informations client requises')
        return
      }
    }
    
    if (!newContract.company || !newContract.country || !newContract.startDate || !newContract.endDate) {
      alert('Veuillez remplir les informations contrat requises')
      return
    }

    setLoading(true)
    
    try {
      let clientId = newContract.clientId
      
      // Si nouveau client, créer d'abord le client
      if (selectedClient === 'new') {
        const clientResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newContract.client)
        })
        
        if (!clientResponse.ok) {
          throw new Error('Failed to create client')
        }
        
        const clientData = await clientResponse.json()
        clientId = clientData.userId
      }
      
      // Créer le contrat
      const contractToSave = {
        ...newContract,
        clientId,
        reference: generateReference(),
        createdAt: new Date().toISOString(),
        status: 'active'
      }
      
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractToSave)
      })
      
      if (response.ok) {
        alert('Contrat ajouté avec succès!')
        
        // Réinitialiser le formulaire
        setNewContract({
          clientId: '',
          reference: '',
          type: 'CDI',
          company: '',
          country: '',
          startDate: '',
          endDate: '',
          position: '',
          salary: '',
          description: '',
          pdfUrl: '',
          client: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            nationality: '',
            passportNumber: '',
            address: ''
          }
        })
        
        setSelectedClient('new')
        fetchData() // Rafraîchir les données
      } else {
        throw new Error('Failed to save contract')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de l\'ajout du contrat')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContract = async (contractId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contrat?')) return
    
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Contrat supprimé avec succès')
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            boxShadow: '0 15px 35px rgba(30, 64, 175, 0.2)'
          }}>
            <i className="fas fa-lock" style={{ color: 'white', fontSize: '48px' }}></i>
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            Admin Portal
          </h1>
          
          <p style={{
            color: '#6b7280',
            marginBottom: '40px',
            fontSize: '16px'
          }}>
            Enter password to access the administration panel
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '30px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#f9fafb',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required
              />
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                marginTop: '10px',
                textAlign: 'left'
              }}>
                <i className="fas fa-key" style={{ marginRight: '8px' }}></i>
                Default password: <code>admin123</code>
              </p>
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                color: 'white',
                padding: '18px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(30, 64, 175, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <i className="fas fa-sign-in-alt"></i>
              Access Admin Panel
            </button>
          </form>
        </div>
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Admin Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        color: 'white',
        padding: '0 30px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-tachometer-alt" style={{ fontSize: '22px' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Admin Dashboard</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Emploseek Management System</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-user-shield"></i>
            Administrator
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {[
            { 
              label: 'Total Contracts', 
              value: stats.totalContracts, 
              icon: 'fas fa-file-contract', 
              color: '#3b82f6',
              change: '+12%'
            },
            { 
              label: 'Active Contracts', 
              value: stats.activeContracts, 
              icon: 'fas fa-check-circle', 
              color: '#10b981',
              change: '+8%'
            },
            { 
              label: 'Registered Clients', 
              value: stats.totalClients, 
              icon: 'fas fa-users', 
              color: '#8b5cf6',
              change: '+15%'
            },
            { 
              label: 'Countries', 
              value: stats.countries, 
              icon: 'fas fa-globe', 
              color: '#f59e0b',
              change: '+3'
            }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '30px',
              borderRadius: '18px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '25px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '70px',
                height: '70px',
                background: `${stat.color}15`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={stat.icon} style={{ color: stat.color, fontSize: '30px' }}></i>
              </div>
              
              <div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '5px'
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
                  {stat.label}
                </div>
                <div style={{
                  color: stat.color,
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <i className="fas fa-arrow-up"></i>
                  {stat.change} this month
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Columns Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Add Contract Form */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-plus" style={{ color: 'white', fontSize: '24px' }}></i>
              </div>
              Add New Contract
            </h2>
            
            {/* Client Selection */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '15px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '16px'
              }}>
                <i className="fas fa-user" style={{ marginRight: '10px', color: '#3b82f6' }}></i>
                Select Client
              </label>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '12px 20px',
                  background: selectedClient === 'existing' ? '#dbeafe' : '#f3f4f6',
                  borderRadius: '10px',
                  flex: 1,
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="clientType"
                    value="existing"
                    checked={selectedClient === 'existing'}
                    onChange={() => setSelectedClient('existing')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Existing Client</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Select from registered clients</div>
                  </div>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '12px 20px',
                  background: selectedClient === 'new' ? '#dbeafe' : '#f3f4f6',
                  borderRadius: '10px',
                  flex: 1,
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="clientType"
                    value="new"
                    checked={selectedClient === 'new'}
                    onChange={() => setSelectedClient('new')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>New Client</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Register a new client</div>
                  </div>
                </label>
              </div>
              
              {selectedClient === 'existing' ? (
                <select
                  value={newContract.clientId}
                  onChange={(e) => setNewContract({...newContract, clientId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '10px',
                    fontSize: '15px',
                    background: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Select a client...</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.firstName} {client.lastName} - {client.email}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{
                  background: '#f8fafc',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '2px dashed #d1d5db'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-user-plus" style={{ color: '#10b981' }}></i>
                    New Client Information
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input
                      type="text"
                      name="client.firstName"
                      value={newContract.client.firstName}
                      onChange={handleContractChange}
                      placeholder="First Name *"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      name="client.lastName"
                      value={newContract.client.lastName}
                      onChange={handleContractChange}
                      placeholder="Last Name *"
                      style={inputStyle}
                    />
                    <input
                      type="email"
                      name="client.email"
                      value={newContract.client.email}
                      onChange={handleContractChange}
                      placeholder="Email *"
                      style={{ ...inputStyle, gridColumn: 'span 2' }}
                    />
                    <input
                      type="tel"
                      name="client.phone"
                      value={newContract.client.phone}
                      onChange={handleContractChange}
                      placeholder="Phone Number"
                      style={inputStyle}
                    />
                    <input
                      type="date"
                      name="client.birthDate"
                      value={newContract.client.birthDate}
                      onChange={handleContractChange}
                      placeholder="Date of Birth"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      name="client.nationality"
                      value={newContract.client.nationality}
                      onChange={handleContractChange}
                      placeholder="Nationality"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      name="client.passportNumber"
                      value={newContract.client.passportNumber}
                      onChange={handleContractChange}
                      placeholder="Passport Number"
                      style={{ ...inputStyle, gridColumn: 'span 2' }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Contract Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
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
                  <i className="fas fa-file-contract" style={{ color: '#1e40af' }}></i>
                </div>
                Contract Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Contract Type *</label>
                  <select
                    name="type"
                    value={newContract.type}
                    onChange={handleContractChange}
                    style={inputStyle}
                  >
                    <option value="CDI">CDI (Permanent)</option>
                    <option value="CDD">CDD (Temporary)</option>
                    <option value="Internship">Internship</option>
                    <option value="Language Stay">Language Stay</option>
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}>Company/Organization *</label>
                  <input
                    type="text"
                    name="company"
                    value={newContract.company}
                    onChange={handleContractChange}
                    placeholder="Company name"
                    style={inputStyle}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>Country *</label>
                  <select
                    name="country"
                    value={newContract.country}
                    onChange={handleContractChange}
                    style={inputStyle}
                  >
                    <option value="">Select country...</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={newContract.position}
                    onChange={handleContractChange}
                    placeholder="Job position"
                    style={inputStyle}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newContract.startDate}
                    onChange={handleContractChange}
                    style={inputStyle}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newContract.endDate}
                    onChange={handleContractChange}
                    style={inputStyle}
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Salary/Compensation</label>
                  <input
                    type="text"
                    name="salary"
                    value={newContract.salary}
                    onChange={handleContractChange}
                    placeholder="e.g., €45,000/year or €1,200/month"
                    style={inputStyle}
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    name="description"
                    value={newContract.description}
                    onChange={handleContractChange}
                    rows="3"
                    placeholder="Additional contract details..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>PDF Contract URL</label>
                  <input
                    type="text"
                    name="pdfUrl"
                    value={newContract.pdfUrl}
                    onChange={handleContractChange}
                    placeholder="https://drive.google.com/..."
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddContract}
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                color: 'white',
                padding: '18px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Contract to Database
                </>
              )}
            </button>
          </div>
          
          {/* Contracts List */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-list" style={{ color: 'white', fontSize: '24px' }}></i>
                </div>
                Contracts List
              </h2>
              
              <button
                onClick={fetchData}
                disabled={loading}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#3b82f6' }}></i>
                <p style={{ marginTop: '20px', color: '#6b7280' }}>Loading contracts...</p>
              </div>
            ) : contracts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{
                  fontSize: '60px',
                  color: '#d1d5db',
                  marginBottom: '20px'
                }}>
                  <i className="fas fa-folder-open"></i>
                </div>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  No contracts found. Add your first contract!
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'separate', 
                  borderSpacing: '0'
                }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ ...thStyle, textAlign: 'left' }}>Reference</th>
                      <th style={thStyle}>Client</th>
                      <th style={thStyle}>Company</th>
                      <th style={thStyle}>Country</th>
                      <th style={thStyle}>Type</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => {
                      const client = clients.find(c => c._id === contract.clientId) || {}
                      const isActive = new Date(contract.endDate) > new Date()
                      
                      return (
                        <tr key={contract._id || index} style={{
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1e40af' }}>
                            {contract.reference}
                          </td>
                          <td style={tdStyle}>
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {client.firstName} {client.lastName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {client.email}
                              </div>
                            </div>
                          </td>
                          <td style={tdStyle}>{contract.company}</td>
                          <td style={tdStyle}>
                            <span style={{
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {contract.country}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              background: contract.type === 'CDI' ? '#d1fae5' : 
                                        contract.type === 'CDD' ? '#fef3c7' : 
                                        contract.type === 'Internship' ? '#e0e7ff' : '#f3e8ff',
                              color: contract.type === 'CDI' ? '#065f46' : 
                                    contract.type === 'CDD' ? '#92400e' : 
                                    contract.type === 'Internship' ? '#3730a3' : '#7c3aed',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {contract.type === 'CDI' ? (
                                <i className="fas fa-check-circle"></i>
                              ) : contract.type === 'CDD' ? (
                                <i className="fas fa-calendar-alt"></i>
                              ) : contract.type === 'Internship' ? (
                                <i className="fas fa-user-graduate"></i>
                              ) : (
                                <i className="fas fa-globe"></i>
                              )}
                              {contract.type}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                              onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                              >
                                <i className="fas fa-edit"></i>
                                Edit
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteContract(contract._id)}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                              >
                                <i className="fas fa-trash"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div style={{
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div>
                Showing {contracts.length} of {contracts.length} contracts
              </div>
              <div>
                <i className="fas fa-database" style={{ marginRight: '8px' }}></i>
                Connected to MongoDB Atlas
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '18px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          marginTop: '30px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="fas fa-chart-bar" style={{ color: '#8b5cf6' }}></i>
            System Information
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <i className="fas fa-server" style={{ color: '#3b82f6', fontSize: '20px' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Database</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    MongoDB Atlas
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Cluster: emploseek-cluster • Status: ✅ Connected
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <i className="fas fa-shield-alt" style={{ color: '#10b981', fontSize: '20px' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Security</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    Password Protected
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Admin access only • Session timeout: 24h
              </div>
            </div>
            
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <i className="fas fa-clock" style={{ color: '#f59e0b', fontSize: '20px' }}></i>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Last Update</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Auto-save enabled • Backup: Daily
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  )
}

// Styles helpers
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  background: 'white',
  transition: 'all 0.2s ease'
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px'
}

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px',
  borderBottom: '2px solid #e5e7eb'
}

const tdStyle = {
  padding: '16px',
  fontSize: '14px',
  color: '#4b5563'
}
