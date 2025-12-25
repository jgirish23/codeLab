import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {Router} from "./route";
import { StompSessionProvider } from 'react-stomp-hooks';
import './App.css';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [url, setUrl] = useState("http://localhost:8080/ws-endpoint"); // Initial URL

  const handleDisconnect = () => {
    setTimeout(() => {
      setUrl(""); // Temporarily clear the URL to reset the connection
      setTimeout(() => setUrl("http://localhost:8080/ws-endpoint"), 1000); // Reconnect after 1s
    }, 1000);
  };

  return (
    <StompSessionProvider 
      url={url} 
      onConnect={() => console.log("✅ WebSocket Connected")}
      onDisconnect={handleDisconnect} // Handle disconnections
    >
      <QueryClientProvider client={queryClient}>
        <Router/>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </StompSessionProvider>
  );
}

export default App;
