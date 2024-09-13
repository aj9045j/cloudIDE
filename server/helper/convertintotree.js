const Docker = require('dockerode');

function parseLsOutput(output) {
  const lines = output.split('\n');
  let currentDir = '';
  const tree = {};

  lines.forEach(line => {
    if (line.endsWith(':')) {
      // This is a directory
      currentDir = line.slice(0, -1);
      if (currentDir !== 'node_modules') { // Exclude node_modules directory
        tree[currentDir] = [];
      }
    } else if (line.trim() && !currentDir.includes('node_modules')) {
      // This is a file and should not be in node_modules
      tree[currentDir]?.push(line.trim());
    }
  });

  return tree;
}

// Function to list directory contents inside a Docker container
async function getDirectoryTree(containerId) {
  try {
    const docker = new Docker();
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: ['ls', '-R', '/app/react-template'], // Modify this path as needed
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start();
    
    let output = '';
    stream.on('data', chunk => {
      output += chunk.toString();
    });

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        const tree = parseLsOutput(output);
        resolve(tree);
      });
      stream.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Error retrieving directory tree: ${error.message}`);
  }
}

module.exports = {
  getDirectoryTree,
};
