import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
  attachments: FileList | null;
}

export const HelpBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    attachments: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileError(null);

    if (files) {
      const invalidFiles = Array.from(files).filter(file => !file.type.startsWith('image/'));
      
      if (invalidFiles.length > 0) {
        setFileError('Only image files are allowed');
        e.target.value = ''; // Clear the input
        setFormData(prev => ({ ...prev, attachments: null }));
        return;
      }

      setFormData(prev => ({ ...prev, attachments: files }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowThankYou(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowThankYou(false);
      setFormData({ name: '', email: '', message: '', attachments: null });
      setFileError(null);
    }, 3000);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
    color: 'black'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Help Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          backgroundColor: '#007AFF',
          border: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        <span style={{ fontSize: '24px', marginBottom: '2px' }}>💬</span>
        <span style={{ fontSize: '12px' }}>Help</span>
      </button>

      {/* Contact Form Modal */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '0',
          width: '300px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          padding: '20px',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {!showThankYou ? (
            <>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
                Contact Us
              </h3>
              <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '14px' }}>
                Any bugs, questions, or comments? Please contact us!
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                    style={{
                      ...inputStyle,
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ marginBottom: fileError ? '5px' : '20px' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      fontSize: '14px',
                      color: 'black'
                    }}
                  />
                  {fileError && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '5px',
                      marginBottom: '15px'
                    }}>
                      {fileError}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Send!
                </button>
              </form>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px 0'
            }}>
              <span style={{ fontSize: '40px', marginBottom: '10px', display: 'block' }}>
                🙏
              </span>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                Thank you for your message!
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Rest assured we will look into it ASAP!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 