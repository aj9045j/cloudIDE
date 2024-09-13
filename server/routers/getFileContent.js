const Docker = require('dockerode');
const docker = new Docker();

async function getFileContent(req, res) {
  const { containerId, filePath } = req.query;

  if (!containerId || !filePath) {
    return res.status(400).json({ error: 'Container ID and file path are required' });
  }

  try {
    const container = docker.getContainer(containerId);

    // Execute a command inside the container to read the file
    const exec = await container.exec({
      Cmd: ['sh', '-c', `cat ${filePath}`],
      AttachStdout: true,
      AttachStderr: true,
    });

    exec.start((err, stream) => {
      if (err) {
        return res.status(500).json({ error: 'Error executing command inside container' });
      }

      let fileContent = '';

      // Capture the file content from the stream
      stream.on('data', (data) => {
        // Ensure the data is converted to UTF-8 and doesn't contain any control characters except line breaks
        const decodedData = Buffer.from(data, 'binary').toString('utf8');
        
        // Append the decoded data to the fileContent
        fileContent += decodedData;
      });

      stream.on('end', () => {
        // Remove any unexpected characters such as numbers or control characters at the beginning
        fileContent = fileContent.replace(/[^\x20-\x7E\r\n]/g, ''); // Keep printable characters, newlines, and carriage returns
        res.json({ content: fileContent.trim() });
      });
    });

  } catch (error) {
    console.error('Error fetching file content:', error);
    return res.status(500).json({ error: 'Error fetching file content from container' });
  }
}

module.exports = {
  getFileContent,
};
