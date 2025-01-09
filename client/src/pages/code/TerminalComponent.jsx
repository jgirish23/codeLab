import { FitAddon } from 'xterm-addon-fit';
import { useEffect, useRef } from 'react';
import { useXTerm } from 'react-xtermjs';
import { useStompClient, useSubscription } from 'react-stomp-hooks';

const user = "root";

const handleCommandResponse = (message, instance) => {
  instance?.writeln(message);
};

export const TerminalComponent = () => {
  const { instance, ref } = useXTerm();
  const fitAddon = new FitAddon();
  const stompClient = useStompClient();
  const commandRef = useRef(""); // Use a ref to track the current command

  useSubscription('/queue/reply', (message) => handleCommandResponse(message.body, instance));

  useEffect(() => {
    if (!instance) return;

    // Load the fit addon
    instance.loadAddon(fitAddon);

    const handleResize = () => fitAddon.fit();

    // Write initial messages on the terminal
    instance.writeln('Welcome react-xtermjs!');
    instance.writeln('This is a simple example using an addon.');
    instance.write(user + "# ");

    const handleInput = (data) => {
      instance.write(data);
      commandRef.current += data; // Update the command in the ref

      if (data === '\n' || data === '\r') {
        const command = commandRef.current.trim();
        commandRef.current = ""; // Clear the command

        instance.writeln(""); // Move to a new line
        instance.write(user + "# "); // Write the prompt again

        if (stompClient) {
          console.log("Command sent:", command);
          stompClient.publish({ destination: '/app/broadcast', body: JSON.stringify(command) });
        }
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
  }, [instance, stompClient]);

  return <div ref={ref} style={{ height: '100%', width: '100%', textAlign: "left" }} />;
};
