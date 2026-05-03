import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '1rem 2rem',
    borderRadius: '8px',
    backgroundColor: type === 'error' ? 'var(--danger)' : 'var(--success)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out'
  };

  return (
    <div style={styles}>
      {message}
    </div>
  );
};

export default Toast;
