const Docker = require('dockerode');
const docker = new Docker();
const findFreePort = require('find-free-port'); // Package to find a free port


const activeContainers = {};

async function reactContainer(req, res) {
    try {
        // Find a free port on the host machine within a larger range
        const [port] = await findFreePort(3000, 4000); // Searching in the range 3000-4000
        const image = 'react-template-docker'; // Replace with your image

        const container = await docker.createContainer({
            Image: image,
            Cmd: ['/bin/sh'],  // For Alpine-based images
            Tty: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            ExposedPorts: { '3000/tcp': {} },
            HostConfig: {
                PortBindings: { '3000/tcp': [{ HostPort: port.toString() }] },
            },
        });

        await container.start();
        
        // Retrieve and send container ID and the dynamically assigned port
        const containerId = container.id;
        activeContainers[containerId] = port;
        
        console.log('Container started successfully', containerId, 'Port:', port);
        res.status(200).json({ containerId, port });
    } catch (error) {
        console.error('Error starting container:', error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    reactContainer,
    activeContainers,
};
