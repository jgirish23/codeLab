import { FitAddon } from 'xterm-addon-fit';
import { useEffect, useRef } from 'react';
import { useXTerm } from 'react-xtermjs';
import { useStompClient, useSubscription } from 'react-stomp-hooks';

const user = "root";

const handleCommandResponse = (message, instance,stompClient) => {
  console.log("Command response:", message);
  if(message != "FLOW_IS_COMPLETE"){
    instance.writeln("");
    instance.write(message);
  }
  
};

export const TerminalComponent = () => {
  const { instance, ref } = useXTerm();
  const fitAddon = new FitAddon();
  const stompClient = useStompClient();
  const commandRef = useRef(""); // Use a ref to track the current command

  useSubscription('/queue/reply', (message) => handleCommandResponse(message.body, instance,stompClient));

  useEffect(() => {
    if (!instance) return;

    // Load the fit addon
    instance.loadAddon(fitAddon);

    const handleResize = () => fitAddon.fit();

    // Write initial messages on the terminal
    // instance.writeln('Welcome react-xtermjs!');
    // instance.writeln('This is a simple example using an addon.');
    stompClient.publish({ destination: '/app/execute', body: "clear" });

    const handleInput = (data) => {
      if (data === '\n' || data === '\r') {
        const command = commandRef.current.trim();
        commandRef.current = ""; // Clear the command

        // instance.writeln("\r"); // Move to a new line

        if (stompClient) {
          console.log("Command sent:", command);
          if(command === ""){
            // stompClient.publish({ destination: '/app/execute', body: "\n" });
          }
          stompClient.publish({ destination: '/app/execute', body: command });
        }
      }else {
        // Append to the command buffer
        commandRef.current += data;
        instance.write(data); // Display typed character in the terminal
      }
    };

    // Attach input handler
    const disposeOnData = instance.onData(handleInput);

    // Handle resize event
    window.addEventListener('resize', handleResize);
    fitAddon.fit();
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('resize', handleResize);
      disposeOnData.dispose();
    };
  }, [instance]);

  return <div ref={ref} style={{ height: '100%', width: '100%', textAlign: "left" }} />;
};
