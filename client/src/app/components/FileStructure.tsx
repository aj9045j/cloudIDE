import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Folder component to recursively render the tree structure
const Folder: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div style={{ paddingLeft: '20px' }}>
      <div onClick={toggleOpen} style={{ cursor: 'pointer', fontWeight: isOpen ? 'bold' : 'normal' }}>
        {isOpen ? '📂' : '📁'} {name}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

// FileTree component to display the folder structure
const FileTree: React.FC<{ containerId: string; onFileClick: (path: string) => void }> = ({ containerId, onFileClick }) => {
  const [tree, setTree] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/getFolder/${containerId}/app`);
        const treeData = buildTreeFromPaths(Object.keys(response.data.tree));
        setTree(treeData);
      } catch (error) {
        console.error('Error fetching folder structure', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [containerId]);

  const renderTree = (node: Record<string, any>, path: string = '') => {
    return Object.keys(node).map((key) => {
      const currentPath = `${path}/${key}`;

      if (node[key] === null) {
        return (
          <div key={key} style={{ paddingLeft: '20px', cursor: 'pointer' }} onClick={() => onFileClick(currentPath)}>
            📄 {key}
          </div>
        );
      } else {
        return (
          <Folder key={key} name={key}>
            {renderTree(node[key], currentPath)}
          </Folder>
        );
      }
    });
  };

  return <div style={{ overflowY: 'auto', maxHeight: '80vh' }}>{loading ? <div>Loading...</div> : renderTree(tree)}</div>;
};

export default FileTree;

// Utility function to convert flat file paths to a nested structure
function buildTreeFromPaths(paths: string[]) {
  const tree: Record<string, any> = {};

  paths.forEach((path) => {
    const parts = path.split('/').filter(Boolean); // Split the path and remove empty elements
    let current = tree;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {};
      }
      current = current[part];
    });
  });

  return tree;
}
