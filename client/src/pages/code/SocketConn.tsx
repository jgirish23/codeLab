import React, { useState, useRef } from 'react';
import SockJsClient, { Client as StompClient } from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/mywebsockets';

export const SocketConn = () => {
  // Type the state for message and stompClient
  const [message, setMessage] = useState<string>('You server message here.');
  const [stompClient, setStompClient] = useState<StompClient | null>(null); // Client from react-stomp

  // Type-safe onConnected callback
  const onConnected = (): void => {
    console.log('Connected!!');
  };

  // Type-safe onMessageReceived callback
  const onMessageReceived = (msg: { message: string }): void => {
    setMessage(msg.message); // Assuming msg has a property 'message'
  };

  // Send a message to the server (assuming the 'ls' command is a placeholder)
  const sendMessage = (): void => {
    console.log('Client connected: ');
    console.log(stompClient);
    if (stompClient) {
      console.log('sendMessage called ...');
      const messagePayload = { message: 'ls' }; // Example command
      stompClient.sendMessage('/app/run', JSON.stringify(messagePayload)); // Adjust the destination as needed
      // stompClient.disconnect();
    }
  };

  return (
    <div>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message', '/queue']}
        onConnect={onConnected}
        onDisconnect={() => console.log('Disconnected!')}
        onMessage={(msg: { message: string }) => onMessageReceived(msg)} // Type the msg received
        ref={(clientRef:any) => setStompClient(clientRef)} // Save the client reference for later use
        debug={true}
      />
      <div>{message}</div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};
