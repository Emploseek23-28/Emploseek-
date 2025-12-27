'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [contracts, setContracts] = useState([
    { id: 1, reference: 'EMP-2024-001', client: 'John Doe', country: 'Germany', type: 'CDI' },
    { id: 2, reference: 'INT-2024-001', client: 'Jane Smith', country: 'France', type: 'Internship' }
  ])
  const [newContract, setNewContract] = useState({ reference: '', client: '', country: '', type: 'CDI' })

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsLoggedIn(true)
    } else {
      alert('Incorrect password. Use: admin123')
    }
  }

  const addContract = () => {
    if (!newContract.reference || !newContract.client) {
      alert('Please fill in reference and client name')
      return
    }
    
    const contract = {
      id: contracts.length + 1,
      ...newContract
    }
    
    setContracts([...contracts, contract])
    setNewContract({ reference: '', client: '', country: '', type: 'CDI' })
    alert('Contract added successfully!')
  }

  const deleteContract = (id) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== id))
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <i className="fas fa-lock" style={{ fontSize: '36px', color: 'white' }}></i>
            </div>
            <h1 style={{ fontSize: '28px', color: '#1e40af', marginBottom: '10px' }}>
              Admin Panel
            </h1>
            <p style={{ color: '#6b7280' }}>Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '16px'
                }}
                required
              />
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                Default password: admin123
              </p>
            </div>
            
            <button 
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                color: 'white',
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: '10px' }}></i>
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#1e40af', marginBottom: '5px' }}>
            <i className="fas fa-tachometer-alt" style={{ marginRight: '10px' }}></i>
            Admin Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>Manage contracts and clients</p>
        </div>
        
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Total Contracts', value: contracts.length, icon: 'fas fa-file-contract', color: '#3b82f6' },
          { label: 'Active', value: contracts.length, icon: 'fas fa-check-circle', color: '#10b981' },
          { label: 'Countries', value: '5+', icon: 'fas fa-globe', color: '#8b5cf6' },
          { label: 'Response Time', value: '24h', icon: 'fas fa-clock', color: '#f59e0b' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: stat.color,
              marginBottom: '10px'
            }}>
              {stat.value}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              <i className={stat.icon} style={{ marginRight: '8px' }}></i>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Contract */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '22px', color: '#1e40af', marginBottom: '20px' }}>
          <i className="fas fa-plus-circle" style={{ marginRight: '10px' }}></i>
          Add New Contract
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            placeholder="Reference (EMP-YYYY-NNN)"
            value={newContract.reference}
            onChange={(e) => setNewContract({...newContract, reference: e.target.value})}
            style={{
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <input
            type="text"
            placeholder="Client Name"
            value={newContract.client}
            onChange={(e) => setNewContract({...newContract, client: e.target.value})}
            style={{
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={newContract.country}
            onChange={(e) => setNewContract({...newContract, country: e.target.value})}
            style={{
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="">Select Country</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Canada">Canada</option>
          </select>
          
          <select
            value={newContract.type}
            onChange={(e) => setNewContract({...newContract, type: e.target.value})}
            style={{
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Internship">Internship</option>
            <option value="Language Stay">Language Stay</option>
          </select>
        </div>
        
        <button
          onClick={addContract}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <i className="fas fa-plus"></i> Add Contract
        </button>
      </div>

      {/* Contracts List */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '22px', color: '#1e40af', marginBottom: '20px' }}>
          <i className="fas fa-list" style={{ marginRight: '10px' }}></i>
          Contracts List
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Reference</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Client</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Country</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#1e40af' }}>
                    {contract.reference}
                  </td>
                  <td style={{ padding: '15px' }}>{contract.client}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {contract.country}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: contract.type === 'CDI' ? '#dcfce7' : 
                                 contract.type === 'CDD' ? '#fef3c7' : '#f3e8ff',
                      color: contract.type === 'CDI' ? '#166534' : 
                            contract.type === 'CDD' ? '#92400e' : '#7c3aed',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {contract.type}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      marginRight: '10px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      <i className="fas fa-edit" style={{ marginRight: '5px' }}></i>Edit
                    </button>
                    <button 
                      onClick={() => deleteContract(contract.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '5px' }}></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  )
}
