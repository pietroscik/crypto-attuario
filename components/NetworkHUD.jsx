/**
 * NetworkHUD - Shows network status and cache info
 * Displays cached/live/retry status in a small HUD
 */

import { useState, useEffect } from 'react';

export default function NetworkHUD() {
  const [status, setStatus] = useState({
    cached: 0,
    live: 0,
    retries: 0,
    errors: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for network events
    const handleNetworkEvent = (event) => {
      if (event.detail) {
        setStatus(prev => ({
          ...prev,
          ...event.detail,
        }));
        
        // Show HUD briefly when there's activity
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 3000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('network-status', handleNetworkEvent);
      
      return () => {
        window.removeEventListener('network-status', handleNetworkEvent);
      };
    }
  }, []);

  if (!isVisible) return null;

  const getStatusColor = () => {
    if (status.errors > 0) return '#ff6b6b';
    if (status.retries > 0) return '#ffcc00';
    if (status.live > 0) return '#00ffcc';
    return '#7fffd4';
  };

  const getStatusText = () => {
    if (status.errors > 0) return `Error (retry ${status.retries})`;
    if (status.retries > 0) return `Retrying (${status.retries})`;
    if (status.live > 0) return 'Live';
    return 'Cached';
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Network status: ${getStatusText()}`}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: '#11161d',
        border: `1px solid ${getStatusColor()}`,
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: getStatusColor(),
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: getStatusColor(),
          animation: status.live > 0 ? 'pulse 2s infinite' : 'none',
        }}
      />
      <span>{getStatusText()}</span>
      {status.cached > 0 && (
        <span style={{ color: '#888', fontSize: '0.75rem' }}>
          ({status.cached} cached)
        </span>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
