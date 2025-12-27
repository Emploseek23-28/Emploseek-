export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#1e40af', textAlign: 'center', fontSize: '48px' }}>Emploseek</h1>
      <p style={{ textAlign: 'center', fontSize: '24px', color: '#4b5563' }}>
        International Jobs, Internships & Language Stays
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', margin: '40px 0' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>+90</div>
          <div>Countries</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '180px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>+25M</div>
          <div>Contracts/Week</div>
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', margin: '40px 0' }}>
        <h2 style={{ color: '#1e40af' }}>Register Now</h2>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <input type="text" placeholder="First Name" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input type="text" placeholder="Last Name" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
          <button type="submit" style={{ background: '#1e40af', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', width: '100%' }}>
            Submit Registration
          </button>
        </form>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>For Agencies & Businesses:</p>
        <p style={{ fontSize: '24px', color: '#1e40af' }}>emploseek@gmail.com</p>
      </div>
    </div>
  )
}
