import { FitAddon } from 'xterm-addon-fit';
import { useEffect, useRef, useState } from 'react';
import { useXTerm } from 'react-xtermjs';
import { useStompClient, useSubscription } from 'react-stomp-hooks';

const handleCommandResponse = (message, instance,stompClient) => {
  const normalizedMessage = message
                                  .replace(/\r\n/g, '\n')  // Replace Windows line endings with Unix-style line breaks
                                  .replace(/\r/g, '\n');   // Replace remaining carriage returns with newlines

  // If necessary, insert a `\r` before each new line to make sure the cursor moves to the beginning
  const properlyFormattedMessage = normalizedMessage.replace(/\n/g, '\r\n');

  // Send this formatted message to the terminal instance
  instance.write(properlyFormattedMessage);
  
};

export const TerminalComponent = () => {
  const { instance, ref } = useXTerm();
  const fitAddon = new FitAddon();
  const stompClient = useStompClient();
  const commandRef = useRef(""); // Use a ref to track the current command
  const [commandHistory, setCommandHistory] = useState([]); // Store command history
  const [historyIndex, setHistoryIndex] = useState(-1); // Track history index

  useSubscription('/queue/reply', (message) => handleCommandResponse(message.body, instance,stompClient));

  useEffect(() => {
    if (!instance || !stompClient) return;
    

    instance.loadAddon(fitAddon);

    const handleResize = () => fitAddon.fit();

    stompClient.publish({ destination: '/app/execute', body: "clear" });

    const handleInput = (data) => {
      if (data === '\n' || data === '\r') {
        const command = commandRef.current.trim();
        commandRef.current = ""; // Clear the command

        if (stompClient) {
          if(command === ""){
            // stompClient.publish({ destination: '/app/execute', body: "\n" });
          }
          stompClient.publish({ destination: '/app/execute', body: command });

          // Add command to history
          setCommandHistory((prev) => [command, ...prev]);
          setHistoryIndex(-1); // Reset history index
        }
      }else if(data === "\u0003"){
        //^c when used terminate
        
        if (stompClient) {
          instance.writeln("^C");
          stompClient.publish({ destination: '/app/execute', body: data });
        }
      } else if (data === '\u007F') {
        // Handle Backspace
        if (commandRef.current.length > 0) {
          commandRef.current = commandRef.current.slice(0, -1); // Remove last character
      
          // Move cursor back
          instance.write('\x1B[D');  // ANSI code to move cursor one step left
          
          // Clear character at cursor position
          instance.write('\x1B[P');  // ANSI delete character code (deletes at current position)
        }
      }else if (data === '\u001b[A') {
        // Handle Up Arrow
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          commandRef.current = commandHistory[newIndex]; // Set command from history
          instance.write('\x1b[2K\r'); // Clear current line
          instance.write(commandRef.current); // Write the command
        }
      } else if (data === '\u001b[B') {
        // Handle Down Arrow
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          commandRef.current = commandHistory[newIndex]; // Set command from history
          instance.write('\x1b[2K\r'); // Clear current line
          instance.write(commandRef.current); // Write the command
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          commandRef.current = ""; // Clear the command
          instance.write('\x1b[2K\r'); // Clear current line
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
      disposeOnData.dispose();
      instance.dispose();
    };
  }, [instance, stompClient]);

  return <div ref={ref} style={{ height: "100%", width: '100%', textAlign: "left" }} />;
};
