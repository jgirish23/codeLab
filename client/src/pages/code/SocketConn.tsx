import React, { useState, useRef, useEffect } from 'react';
import SockJsClient, { Client as StompClient } from 'react-stomp';
import { FitAddon } from 'xterm-addon-fit';
import { useXTerm } from 'react-xtermjs';

const SOCKET_URL = 'http://localhost:8080/mywebsockets';

export const SocketConn = () => {
  // State for message and stompClient
  const [message, setMessage] = useState<string>('');
  const [stompClient, setStompClient] = useState<StompClient | null>(null); // StompClient from react-stomp
  const { instance, ref } = useXTerm();
  // const [first, setFirst] = useState(true)
  const fitAddon = new FitAddon();
  const commandRef = useRef<string>("");
  const first = useRef<boolean>(true);

  // onConnected callback
  const onConnected = (): void => {
    console.log('Connected!!');
  };

  // onMessageReceived callback
  const onMessageReceived = (msg: { message: string }): void => {
    setMessage(msg.message); // Assuming msg has a property 'message'
  };

  // Function to send message to the server
  const sendCommand = (command: string): void => {
    console.log('Client connected: ');
    console.log(stompClient);
    if (stompClient) {
      console.log('sendMessage called ...');
      const messagePayload = { message: command }; // Send the entered command
      // if(first.current === true){
      //   stompClient.sendMessage('/app/startShell', JSON.stringify(messagePayload));
      //   first.current = (false); // Set first to false after sending the first command, so that subsequent commands are sent in the run() channel.
      // }
      
      stompClient.sendMessage('/app/run', JSON.stringify(messagePayload));
    }
  };

  // Handle terminal input
  const handleTerminalInput = (data: string) => {
    if (data === '\r' || data === '\n') {
      // Enter key is pressed
      sendCommand(commandRef.current); // Send the current command when Enter is pressed
      commandRef.current = ''; // Clear the command input after sending it
      instance?.write('\n'); // Write a new line to the terminal
      instance?.write("$root: ");
    } else if (data === '\u007f') {
      // Backspace key is pressed
      if (commandRef.current.length > 0) {
      // Remove the last character from the command
      commandRef.current = commandRef.current.slice(0, -1);
      // Update the terminal by removing the last character visually
      instance?.write('\b \b'); // Move cursor back, overwrite with space, then move back again
    }
    } else {
      // Append the typed character to the command
      commandRef.current += data;
      // instance?.write(data); // Write the character to the terminal
    }

  };

  useEffect(() => {
    // Load the fit addon for the terminal resizing
    instance?.loadAddon(fitAddon);

    const handleResize = () => fitAddon.fit();

    // Write initial messages on terminal
    instance?.writeln('Welcome to react-xtermjs!');
    instance?.writeln('Press Enter to send a command.');
    instance?.write("$root: ");
    // Set onData handler to capture terminal input
    instance?.onData((data) => {
      // You can optionally echo the typed data into the terminal
      instance?.write(data);
      // Handle Enter key press
      handleTerminalInput(data);
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [instance]);

  // Use useEffect to update the terminal with the message whenever it changes
  useEffect(() => {
    if (instance && message) {
      instance.writeln(message); // Write the current message to the terminal
      instance?.write("$root: ");
    }
  }, [message, instance]); // Effect runs whenever 'message' state or 'instance' changes

  return (
    <div>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message', '/queue']}
        onConnect={onConnected}
        onDisconnect={() => console.log('Disconnected!')}
        onMessage={(msg: { message: string }) => onMessageReceived(msg)}
        ref={(clientRef: any) => setStompClient(clientRef)}
        debug={true}
      />
      <div>Shell</div> 
      {/* <div>{message}</div>  */}
      <div ref={ref} style={{ height: '100%', width: '100%' , textAlign: "left"}} />
    </div>
  );
};
