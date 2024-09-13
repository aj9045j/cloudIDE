const Docker = require('dockerode');

const listFilesInContainerRecursive = async (containerId, dir) => {
    const docker = new Docker();
   

    try {
        const container = await docker.getContainer(containerId);
        const output = await container.exec({
            Cmd: ['ls', '-la', '/path/to/directory'],
            AttachStdout: true,
            AttachStderr: true
        });

        const stream = await output.start();
        let data = '';
        stream.on('data', (chunk) => {
            data += chunk.toString();
        });
        stream.on('end', () => {
            // Parse the output and return the directory structure
            const directoryStructure = parseDirectoryOutput(data);
            res.json(directoryStructure);
        });
    } catch (error) {
        console.error('Error fetching directory:', error);
        res.status(500).json({ error: 'Failed to fetch directory' });
    }
};

module.exports = {
    listFilesInContainerRecursive,
};
