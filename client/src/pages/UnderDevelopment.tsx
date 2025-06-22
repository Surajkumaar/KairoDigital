import React from 'react';

const UnderDevelopment = () => {
  // Using the GIF from the public directory
  const gifPath = '/gif/Under Construction Penguin GIF by Pudgy Penguins.gif';
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🚧 Page Under Development 🚧</h1>
      <p>This section is currently under development. Please check back later!</p>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <img 
          src={gifPath} 
          alt="Under Development" 
          style={{ 
            maxWidth: '80%', 
            height: 'auto', 
            marginTop: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 42, 255, 0.71)'
          }} 
        />
      </div>
    </div>
  );
};

export default UnderDevelopment;
