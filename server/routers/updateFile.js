const { exec } = require('child_process');

async function updateFile(req, res) {
  console.log("Getting file updates", req.body);

  // Check if req.body is defined and has the required properties
  if (!req.body || !req.body.containerId || !req.body.filePath) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const { containerId, filePath, content } = req.body;

  let command;

  if (content === '') {
    // If content is empty, create an empty file
    command = `docker exec ${containerId} sh -c "echo '' > ${filePath}"`;
  } else {
    // Encode content in base64 to avoid quoting issues
    const base64Content = Buffer.from(content).toString('base64');
    // Use base64 decoding inside the container
    command = `docker exec ${containerId} sh -c "echo '${base64Content}' | base64 -d > ${filePath}"`;
  }

  console.log("command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error writing file in container: ${stderr}`);
      return res.status(500).send({ error: 'Error updating file in container' });
    }
    res.send({ message: 'File updated successfully' });
  });
}

module.exports = {
  updateFile,
};
