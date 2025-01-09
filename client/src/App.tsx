import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {Router} from "./route";
import { StompSessionProvider } from 'react-stomp-hooks';

const queryClient = new QueryClient();

function App() {
  const stompConfig = {
    url: 'http://localhost:8080/ws-endpoint', // Example WebSocket URL for STOMP connection
    reconnectDelay: 5000, // Optional: auto reconnect after a delay
    headers: {
      Authorization: 'Bearer your_token', // Optional: add authentication headers if needed
    },
  };

  return (
    <StompSessionProvider 
      url={stompConfig.url} 
      // reconnectDelay={stompConfig.reconnectDelay}  
    >
      <QueryClientProvider client={queryClient}>
        <Router/>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StompSessionProvider>
  );
}

export default App;
