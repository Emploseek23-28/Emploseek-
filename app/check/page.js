export default function CheckPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '80vh'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#1e40af',
        fontSize: '48px',
        marginBottom: '10px'
      }}>
        🔍 Reference Check
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '18px',
        marginBottom: '40px'
      }}>
        Verify your job contract, internship, or language stay
      </p>
      
      {/* Checker Box */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Input Section */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#374151'
          }}>
            📋 Enter your contract reference number:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              placeholder="Example: EMP-2024-001"
              style={{
                flex: 1,
                padding: '15px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px'
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              🔍 Verify Reference
            </button>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginTop: '8px'
          }}>
            💡 Example valid references: EMP-2024-001, INT-2024-001, LANG-2024-001
          </p>
        </div>
        
        {/* Result Section (Example) */}
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>
            ✅  {/* C'est un VRAI emoji ✅ */}
          </div>
          <h2 style={{
            color: '#166534',
            fontSize: '28px',
            marginBottom: '10px'
          }}>
            VALID CONTRACT
          </h2>
          <p style={{ color: '#166534', fontSize: '18px', marginBottom: '20px' }}>
            Reference: <strong>EMP-2024-001</strong>
          </p>
          
          {/* Client Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#15803d' }}>👤 Client Name</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>John Doe</div>
            </div>
            <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#15803d' }}>📅 Date of Birth</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>1990-05-15</div>
            </div>
          </div>
          
          {/* Contract Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>🌍 Country</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Germany</div>
            </div>
            <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>💼 Contract Type</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>CDI</div>
            </div>
            <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>📅 Start Date</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>2024-03-01</div>
            </div>
          </div>
          
          {/* Download Button */}
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
            📎 Download Contract (PDF)
          </button>
        </div>
        
        {/* Info Box */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚠️ About Reference Check
          </h3>
          <p style={{ color: '#4b5563' }}>
            This tool helps verify the authenticity of contracts registered through Emploseek. 
            All valid references are stored in our secure database. If you have any issues, 
            contact us at <strong>emploseek@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
