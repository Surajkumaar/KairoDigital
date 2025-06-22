import React, { useState, useEffect } from 'react';

const UnderDevelopment = () => {
  // Using the GIF from the public directory with fallback
  const [gifError, setGifError] = useState(false);
  const gifPath = '/gif/Under Construction Penguin GIF by Pudgy Penguins.gif';
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🚧 Page Under Development 🚧</h1>
      <p>This section is currently under development. Please check back later!</p>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {!gifError ? (
          <img 
            src={gifPath} 
            alt="Under Development" 
            onError={() => setGifError(true)}
            style={{ 
              maxWidth: '80%', 
              height: 'auto', 
              marginTop: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 42, 255, 0.71)'
            }} 
          />
        ) : (
          <div 
            style={{ 
              maxWidth: '80%', 
              height: '300px',
              marginTop: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 42, 255, 0.71)',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <p>🚧 Image could not be loaded. We're working on it! 🚧</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnderDevelopment;
