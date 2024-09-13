const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server: socketServer } = require('socket.io');
const Docker = require('dockerode');

const docker = new Docker();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new socketServer(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

const { reactContainer } = require('./routers/reactContainer.js');
const { findPort } = require('./routers/findPort.js');
const { getFolder } = require('./routers/getFolder.js');
const { getFileContent } = require('./routers/getFileContent.js');
const { updateFile } = require('./routers/updateFile.js');

// Corrected path
app.get('/api/react-container', reactContainer);
app.get('/api/findPort/:containerId', findPort);
app.get('/api/getFolder/:containerId/:dir', getFolder);
app.get('/api/getFileContent', getFileContent);
app.post('/api/updateFile', updateFile);

io.on('connection', (socket) => {
    console.log('New client connected');

    let execInstance;
    let stream;

    socket.on('start-terminal', async (containerId) => {
        try {
            const container = docker.getContainer(containerId);
            execInstance = await container.exec({
                Cmd: ['/bin/sh'], // For Alpine-based images
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true
            });

            execInstance.start({ hijack: true, stdin: true }, (err, s) => {
                if (err) {
                    console.error('Error starting exec instance:', err);
                    socket.emit('terminal-error', err.message);
                    return;
                }

                stream = s;
                stream.on('data', (data) => {
                    socket.emit('terminal-output', data.toString());
                });

                socket.on('terminal-input', (input) => {
                    if (stream) {
                        stream.write(input);
                    }
                });

                socket.on('disconnect', async () => {
                    if (stream) {
                        stream.end(); // Close the stream to stop the terminal session
                        stream.destroy(); // Ensure stream resources are released
                    }
                    if (execInstance) {
                        try {
                            // Inspect the execInstance to ensure it's clean
                            await execInstance.inspect();
                            console.log('Exec instance inspected successfully');
                        } catch (inspectErr) {
                            console.error('Error inspecting exec instance:', inspectErr);
                        }
                    }
                    console.log('Client disconnected');
                });
            });
        } catch (err) {
            console.error('Error in terminal setup:', err);
            socket.emit('terminal-error', err.message);
        }
    });
});

server.listen(9000, () => {
    console.log('Server is running on port 9000');
});
