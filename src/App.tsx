import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {Router} from "./route";
import './App.css';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [url, setUrl] = useState("http://testdep.mylocal:8081/ws-endpoint"); // Initial URL

  const handleDisconnect = () => {
    setTimeout(() => {
      setUrl(""); // Temporarily clear the URL to reset the connection
      setTimeout(() => setUrl("http://testdep.mylocal:8081/ws-endpoint"), 1000); // Reconnect after 1s
    }, 1000);
  };

  return (

      <QueryClientProvider client={queryClient}>
        <Router/>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
  );
}

export default App;
