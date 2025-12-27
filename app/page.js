export default function Home() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        borderRadius: '20px',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Emploseek</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>
          Find International Jobs, Internships & Language Stays
        </p>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { value: '+90', label: 'Countries' },
            { value: '+25M', label: 'Contracts/Week' },
            { value: '+10M', label: 'Internships' },
            { value: '24h', label: 'Response Time' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stat.value}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* B2B Contact */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '15px' }}>For Agencies & Businesses</h2>
          <p style={{ marginBottom: '20px', fontSize: '20px' }}>
            📧 emploseek@gmail.com
          </p>
          <a href="mailto:emploseek@gmail.com" style={{
            background: 'white',
            color: '#1e40af',
            padding: '15px 30px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Contact Our Team
          </a>
        </div>
      </div>
      
      {/* Registration Form */}
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1e40af', marginBottom: '30px', textAlign: 'center' }}>
          Register for Opportunities
        </h2>
        
        <form style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              First Name *
            </label>
            <input type="text" required style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }} />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Last Name *
            </label>
            <input type="text" required style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }} />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Email *
            </label>
            <input type="email" required style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }} />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Job Category *
            </label>
            <select required style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'white'
            }}>
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
            </select>
          </div>
          
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: 'white',
            padding: '16px 32px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            width: '100%',
            cursor: 'pointer'
          }}>
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  )
}
