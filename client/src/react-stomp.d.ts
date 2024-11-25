declare module 'react-stomp' {
    // Declare StompClient as `any` or you can refine it based on the library's usage.
    export class Client {
      connect: (headers: any, connectCallback: () => void) => void;
      disconnect: (disconnectCallback: () => void) => void;
      sendMessage: (destination: string, body: string) => void;
      subscribe: (destination: string, callback: (message: any) => void) => void;
    }
  
    // Export SockJsClient as `any` if not directly typed.
    const SockJsClient: any;
    export default SockJsClient;
  }