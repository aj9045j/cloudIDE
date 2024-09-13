"use client";

import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import socketInit from '@/socket-io/socket';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

interface TerminalWithSocketProps {
  containerId: string;
}

const TerminalWithSocket: React.FC<TerminalWithSocketProps> = ({ containerId }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<Socket | null>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = socketInit();
    const socketClient = socket.current;

    if (!socketClient) return;

    // Create and configure the terminal
    terminal.current = new Terminal({
      fontSize: 14,
      theme: {
        background: '#000',
        foreground: '#fff',
      },
    });

    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);

    // Open terminal in the ref container
    if (terminalRef.current) {
      terminal.current.open(terminalRef.current);
      fitAddon.current.fit();
    }

    // Start terminal session
    socketClient.emit('start-terminal', containerId);

    // Handle terminal output
    socketClient.on('terminal-output', (data: string) => {
      if (terminal.current) {
        terminal.current.write(data);
      }
    });

    // Handle terminal error
    socketClient.on('terminal-error', (error: string) => {
      console.error('Terminal error:', error);
    });

    // Resize the terminal on window resize
    const handleResize = () => {
      fitAddon.current?.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (socketClient) {
        socketClient.disconnect();
      }
      terminal.current?.dispose();
      window.removeEventListener('resize', handleResize); // Clean up the resize event listener
    };
  }, [containerId]);

  const handleInput = (data: string) => {
    const socketClient = socket.current;
    if (socketClient) {
      socketClient.emit('terminal-input', data);
    }
  };

  useEffect(() => {
    // Register input event listener
    const disposable = terminal.current?.onData(handleInput);

    return () => {
      // Clean up the input listener
      disposable?.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '40%', // Adjust width as needed
        height: '40%', // Adjust height as needed
        backgroundColor: '#000', // Optional: Background color for better visibility
      }}
    />
  );
};

export default TerminalWithSocket;
