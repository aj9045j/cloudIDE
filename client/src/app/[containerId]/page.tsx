"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileTree from '../components/FileStructure'; // Adjust the path as necessary
import TerminalWithSocket from '../components/TerminalComponent'; // Adjust path as necessary
import IDE from '../components/IDE'; // Adjust path as necessary
// Adjust the path as necessary

interface FileTreePageProps {
  params: {
    containerId: string;
  };
}

const fetchPort = async (containerId: string): Promise<number | null> => {
  try {
    const response = await axios.get<{ port: number }>(`http://localhost:9000/api/findPort/${containerId}`);
    return response.data.port;
  } catch (error) {
    console.error('Error fetching port:', error);
    return null;
  }
};

const FileTreePage: React.FC<FileTreePageProps> = ({ params }) => {
  const { containerId } = params;
  const [port, setPort] = useState<number | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // Track selected file

  useEffect(() => {
    const fetchPortData = async () => {
      const portValue = await fetchPort(containerId);
      setPort(portValue);
      if (portValue) {
        setIframeSrc(`http://localhost:${portValue}`);
      }
      setLoading(false);
    };

    fetchPortData();
  }, [containerId]);

  const refreshIframe = () => {
    if (port) {
      setIframeSrc(`http://localhost:${port}?timestamp=${new Date().getTime()}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!port) {
    return <div>Error: Unable to find port for container {containerId}</div>;
  }

  return (
    <div className='container'>
      <div className='sidebar'>
        <FileTree containerId={containerId} onFileClick={setSelectedFile} />
      </div>
      <div className='editor'>
        <IDE selectedFile={selectedFile} containerId={containerId} />
      </div>
      <div className='preterm'>
        <div className='preview'>
          <button className='refresh-button' onClick={refreshIframe}>Refresh Preview</button>
          <iframe
          className='website'
            src={iframeSrc}
            title="Container Output"
          />
        </div>
        <div className='terminal'>
          <TerminalWithSocket containerId={containerId} />
        </div>
      </div>
      

    </div>
  );
};

export default FileTreePage;
