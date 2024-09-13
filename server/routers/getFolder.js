const Docker = require('dockerode');

async function getFolder(req, res) {
    const docker = new Docker();
    const { containerId, dir } = req.params; // dir: the directory you want to list inside the container
    try {
        const container = docker.getContainer(containerId);
        
        // Execute 'ls' command inside the container, recursively listing directories and ignoring 'node_modules'
        const exec = await container.exec({
          Cmd: ['sh', '-c', 'find /app/react-template -path "/app/react-template/node_modules" -prune -o -print'],
          AttachStdout: true,
          AttachStderr: true
      });

        const stream = await exec.start();
        let data = '';

        // Capture the output from the Docker container
        stream.on('data', (chunk) => {
            data += chunk.toString();
        });

        stream.on('end', async () => {
            // Parse the output and return the directory structure
            const directoryStructure = parseLsOutput(data);
            console.log(directoryStructure);
            res.json({ tree: directoryStructure });
        });
    } catch (error) {
        console.error('Error fetching directory:', error);
        res.status(500).json({ error: 'Failed to fetch directory' });
    }
}

// Parsing the recursive 'ls' output to build a folder structure
function parseLsOutput(output) {
    const lines = output.split('\n');
    let currentDir = '';
    const tree = {};

    lines.forEach(line => {
        if (line.endsWith(':')) {
            // This is a directory path, e.g., "/app/react-template/src:"
            currentDir = line.slice(0, -1);
            if (!tree[currentDir]) {
                tree[currentDir] = {};
            }
        } else if (line.trim() && !line.startsWith('total')) {
            // This is a file or folder
            const parts = line.trim().split(/\s+/);
            const name = parts[parts.length - 1];
            const fullPath = currentDir ? `${currentDir}/${name}` : name;

            if (line.startsWith('d')) {
                // It's a directory, create an empty object for it
                tree[fullPath] = {};
            } else {
                // It's a file, assign null
                tree[fullPath] = null;
            }
        }
    });

    return tree;
}

module.exports = {
    getFolder,
};
