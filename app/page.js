'use client'
import { useState } from 'react'

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    nationality: '',
    passportNumber: '',
    jobCategory: '',
    contractType: '',
    country: '',
    additionalInfo: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setFormSubmitted(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          nationality: '',
          passportNumber: '',
          jobCategory: '',
          contractType: '',
          country: '',
          additionalInfo: ''
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920") center/cover',
          opacity: 0.1,
          zIndex: 0
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '-0.5px'
          }}>
            Your Gateway to Global Opportunities
          </h1>
          
          <p style={{
            fontSize: '22px',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            opacity: 0.95
          }}>
            Emploseek connects exceptional talent with premium international opportunities 
            across 90+ countries. Professional recruitment services for jobs, internships, 
            and language stays.
          </p>
          
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            margin: '60px auto',
            maxWidth: '1000px'
          }}>
            {[
              { value: '90+', label: 'Countries', icon: 'fas fa-globe-americas' },
              { value: '25M+', label: 'Monthly Opportunities', icon: 'fas fa-briefcase' },
              { value: '10M+', label: 'Verified Internships', icon: 'fas fa-user-graduate' },
              { value: '24h', label: 'Average Response Time', icon: 'fas fa-clock' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-10px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  <i className={stat.icon} style={{ fontSize: '36px' }}></i>
                  {stat.value}
                </div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            Our Professional Services
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Comprehensive recruitment solutions tailored to your international career goals
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '80px'
        }}>
          {[
            {
              title: 'International Employment',
              description: 'Permanent and temporary positions in leading companies worldwide',
              icon: 'fas fa-suitcase',
              color: '#1e40af',
              features: ['CDI/CDD Contracts', 'Work Permit Assistance', 'Relocation Support']
            },
            {
              title: 'Professional Internships',
              description: 'Paid internships with global corporations and innovative startups',
              icon: 'fas fa-user-graduate',
              color: '#059669',
              features: ['Industry Experience', 'Mentorship Programs', 'Academic Credit']
            },
            {
              title: 'Language & Cultural Stays',
              description: 'Immersion programs combining language learning with cultural experience',
              icon: 'fas fa-globe-africa',
              color: '#7c3aed',
              features: ['Language Courses', 'Homestay Options', 'Cultural Activities']
            }
          ].map((service, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '70px',
                height: '70px',
                background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}99 100%)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '25px'
              }}>
                <i className={service.icon} style={{ color: 'white', fontSize: '30px' }}></i>
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                {service.title}
              </h3>
              
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '25px'
              }}>
                {service.description}
              </p>
              
              <ul style={{ padding: 0, margin: 0 }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    color: '#4b5563',
                    fontSize: '15px'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: service.color }}></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section style={{
        padding: '80px 20px',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {formSubmitted ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '20px',
              border: '2px solid #bbf7d0'
            }}>
              <div style={{
                fontSize: '60px',
                color: '#059669',
                marginBottom: '30px'
              }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#065f46',
                marginBottom: '20px'
              }}>
                Application Submitted Successfully!
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#065f46',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto 30px'
              }}>
                Thank you for choosing Emploseek. Our recruitment specialists will review 
                your application and contact you within 24 hours with personalized 
                opportunities matching your profile.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: 'white',
                  padding: '18px 40px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <i className="fas fa-plus"></i>
                Submit Another Application
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h2 style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '20px'
                }}>
                  Start Your International Journey
                </h2>
                <p style={{
                  fontSize: '18px',
                  color: '#6b7280',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: '1.6'
                }}>
                  Complete the form below and our recruitment team will match you with 
                  the best opportunities worldwide
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{
                background: 'white',
                padding: '50px',
                borderRadius: '24px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                  {/* Personal Information */}
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1e40af',
                      marginBottom: '25px',
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
                        <i className="fas fa-user" style={{ color: '#1e40af' }}></i>
                      </div>
                      Personal Information
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact & Documents */}
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#059669',
                      marginBottom: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
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
                        <i className="fas fa-passport" style={{ color: '#059669' }}></i>
                      </div>
                      Contact & Documents
                    </h3>
                    
                    <div style={{ display: 'grid', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                          Passport Number
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '15px 20px',
                            border: '2px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Job Preferences */}
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#7c3aed',
                    marginBottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#ede9fe',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-briefcase" style={{ color: '#7c3aed' }}></i>
                    </div>
                    Job Preferences
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                        Job Category *
                      </label>
                      <select
                        name="jobCategory"
                        value={formData.jobCategory}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 20px',
                          border: '2px solid #d1d5db',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology & IT</option>
                        <option value="Healthcare">Healthcare & Medicine</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business & Finance</option>
                        <option value="Education">Education & Teaching</option>
                        <option value="Hospitality">Hospitality & Tourism</option>
                        <option value="Marketing">Marketing & Sales</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                        Contract Type *
                      </label>
                      <select
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 20px',
                          border: '2px solid #d1d5db',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      >
                        <option value="">Select Type</option>
                        <option value="CDI">CDI (Permanent)</option>
                        <option value="CDD">CDD (Temporary)</option>
                        <option value="Internship">Internship</option>
                        <option value="Language Stay">Language Stay</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                        Preferred Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 20px',
                          border: '2px solid #d1d5db',
                          borderRadius: '10px',
                          fontSize: '16px',
                          background: 'white',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      >
                        <option value="">Select Country</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="Italy">Italy</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="USA">United States</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">United Arab Emirates</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                        Nationality *
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '15px 20px',
                          border: '2px solid #d1d5db',
                          borderRadius: '10px',
                          fontSize: '16px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div style={{ marginBottom: '40px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
                    <i className="fas fa-comment-alt" style={{ marginRight: '10px', color: '#f59e0b' }}></i>
                    Additional Information (Optional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your skills, experience, preferences, or any specific requirements..."
                    style={{
                      width: '100%',
                      padding: '20px',
                      border: '2px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
                
                {/* Submit Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                      color: 'white',
                      padding: '20px 60px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '15px',
                      boxShadow: '0 15px 35px rgba(30, 64, 175, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-paper-plane"></i>
                    Submit Application
                  </button>
                  
                  <p style={{
                    marginTop: '20px',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
                    Your information is secure and will only be used for recruitment purposes
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Ready to Transform Your Career?
          </h2>
          
          <p style={{
            fontSize: '18px',
            opacity: 0.95,
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            Join thousands of professionals who found their dream international 
            opportunity through Emploseek. Our expert recruiters are here to guide 
            you every step of the way.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="mailto:emploseek@gmail.com" style={{
              background: 'white',
              color: '#1e40af',
              padding: '18px 40px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
            >
              <i className="fas fa-envelope"></i>
              Contact Our Team
            </a>
            
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '18px 40px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)'
              e.target.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
              e.target.style.transform = 'translateY(0)'
            }}
            >
              <i className="fas fa-arrow-up"></i>
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Add Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  )
}
