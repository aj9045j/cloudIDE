import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CodeiumEditor } from '@codeium/react-code-editor';

interface IDEProps {
  selectedFile: string | null;
  containerId: string;
}

const IDE: React.FC<IDEProps> = ({ selectedFile, containerId }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript'); // Default language

  // Fetch file content when selectedFile or containerId changes
  useEffect(() => {
    if (selectedFile) {
      const fetchFileContent = async () => {
        try {
          const response = await axios.get<{ content: string }>(
            'http://localhost:9000/api/getFileContent',
            { params: { containerId, filePath: selectedFile } }
          );
          setFileContent(response.data.content);
        } catch (error) {
          console.error('Error fetching file content:', error);
        }
      };

      fetchFileContent();
    }
  }, [selectedFile, containerId]);

  // Function to save the file content
  const saveFile = useCallback(async (content: string) => {
    if (selectedFile && containerId) {
      try {
        console.log(containerId,selectedFile,content);
        await axios.post('http://localhost:9000/api/updateFile', {
          containerId,
          filePath: selectedFile,
          content
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error saving file content:', error);
      }
    }
  }, [selectedFile, containerId]);

  // Debounce function
  const debouncedSaveFile = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    return (content: string) => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        saveFile(content); // Save file after debounce delay
      }, 1000); // Debounce delay set to 1 second
    };
  }, [saveFile]);

  // Handle content changes and debounce the save operation
  const handleContentChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setFileContent(value);
      debouncedSaveFile()(value); // Call the debounced save function
    }
  }, [debouncedSaveFile]);

  // Determine the language of the editor based on the file extension
  const determineLanguage = (filePath: string | null): string => {
    if (!filePath) return 'javascript';
    if (filePath.endsWith('.ts')) return 'typescript';
    if (filePath.endsWith('.html')) return 'html';
    if (filePath.endsWith('.css')) return 'css';
    if (filePath.endsWith('.jsx')) return 'jsx';
    if (filePath.endsWith('.json')) return 'json';
    if (filePath.endsWith('.js')) return 'javascript';
    return filePath.substring(filePath.lastIndexOf('.'));
  };

  if (!selectedFile) {
    return <div>Select a file to view its contents</div>;
  }

  return (
    <div>
      <h3>Editing: {selectedFile}</h3>
      <CodeiumEditor
        className='codeiumeditor'
        value={fileContent}
        theme='vs-dark'
        language={determineLanguage(selectedFile)} // Set the language dynamically
        onChange={(value: string | undefined) => handleContentChange(value)}
        options={{
          lineNumbers: true,
          readOnly: false, // Set to true for read-only mode
        }}
      />
      
    </div>
  );
};

export default IDE;
