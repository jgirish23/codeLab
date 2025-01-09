export const useCommandResponse = (instance: any) => {
    const handleCommandResponse = (message: string) => {
      instance?.writeln(message);
    };
  
    return { handleCommandResponse };
  };