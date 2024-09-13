import { io, Socket } from 'socket.io-client';

const socketInit = (): Socket => {
    const options = {
        transports: ['websocket'],
        reconnectionAttempts: Infinity,
        timeout: 10000,
    };
    return io('http://localhost:9000', options);
};

export default socketInit;
