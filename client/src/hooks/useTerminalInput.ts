import { useCallback, useState } from 'react';

export const useTerminalInput = (instance: any, stompClient: any, user: string) => {
  const [command,setCommand] = useState("");
  const handleInput = useCallback(
    (data: string) => {
      instance?.write(data);
      setCommand(command + data)
      if (data === '\n' || data === '\r') {
        instance?.writeln(data);
        instance?.write(user + "# ");
        if (stompClient) {
          console.log("command:: " + command)
          stompClient.publish({ destination: '/app/broadcast', body: JSON.stringify(command) });
        }
      }
     
    },
    [instance, stompClient, user]
  );

  return { handleInput };
};
