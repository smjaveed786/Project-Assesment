import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Archive, Trash2 } from "lucide-react";

export default function ProjectMenu({ onComplete, onArchive, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: '#94a3b8', 
          cursor: 'pointer', 
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 100,
          minWidth: '200px',
          padding: '8px',
          marginTop: '4px',
          border: '1px solid #f1f5f9'
        }}>
          <button 
            onClick={() => { onComplete?.(); setIsOpen(false); }}
            style={menuItemStyle}
          >
            <CheckCircle2 size={18} />
            Mark Completed
          </button>
          
          <button 
            onClick={() => { onArchive?.(); setIsOpen(false); }}
            style={menuItemStyle}
          >
            <Archive size={18} />
            Archive
          </button>
          
          <button 
            onClick={() => { onDelete?.(); setIsOpen(false); }}
            style={{ ...menuItemStyle, color: '#ef4444' }}
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  border: 'none',
  background: 'transparent',
  color: '#334155',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: '10px',
  textAlign: 'left',
  transition: 'background 0.2s'
};
