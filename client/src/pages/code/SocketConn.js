import React, { useState, useRef } from 'react';
import SockJsClient from "react-stomp";

const SOCKET_URL = 'http://localhost:8080/mywebsockets';

export const SocketConn = () => {
  const [message, setMessage] = useState('You server message here.');
  const [stompClient, setStompClient] = useState(null);

  let onConnected = () => {
    console.log("Connected!!");
    // console.log("Client connected: ")
    // console.log(client);
    // setStompClient(client);
  }

  let onMessageReceived = (msg) => {
    setMessage(msg.message);
  }

  // Send a message to the server
  const sendMessage = () => {
    console.log("Client connected: ")
    console.log(stompClient);
    if (stompClient) {
      console.log("sendMessage called ...")
      const messagePayload = { message: 'Hello from React!' };
      stompClient.sendMessage('/app/sendMessage', JSON.stringify(messagePayload)); // Adjust the destination as needed
      // stompClient.disconnect();
    }
  };

  return (
    <div>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message','/queue']}
        onConnect={onConnected}
        onDisconnect={console.log("Disconnected!")}
        onMessage={(msg) => onMessageReceived(msg)}
        ref={clientRef => setStompClient(clientRef)} // Save the client reference for later use
        debug={true}
      />
      <div>{message}</div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}