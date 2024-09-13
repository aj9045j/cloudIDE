import React, { useState } from 'react';

interface FolderProps {
  name: string;
  onToggle: () => void;
  children: React.ReactNode;
}

const Folder: React.FC<FolderProps> = ({ name, onToggle, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    onToggle(); // Notify parent component to fetch contents
  };

  return (
    <div style={{ marginBottom: '5px' }}>
      <div 
        onClick={toggleOpen} 
        style={{ 
          cursor: 'pointer', 
          fontWeight: isOpen ? 'bold' : 'normal', 
          userSelect: 'none' 
        }}
      >
        {isOpen ? '▾' : '▸'} {name}
      </div>
      {isOpen && (
        <div style={{ paddingLeft: '20px', overflowX: 'auto' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Folder;
