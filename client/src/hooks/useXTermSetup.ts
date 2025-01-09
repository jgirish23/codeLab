import { useEffect } from 'react';
import { FitAddon } from 'xterm-addon-fit';

export const useXTermSetup = (instance: any, fitAddon: any) => {
  
    instance?.loadAddon(fitAddon);

    const handleResize = () => fitAddon.fit();

    // Write custom message on terminal
    instance?.writeln('Welcome react-xtermjs!');
    instance?.writeln('This is a simple example using an addon.');
    instance?.write('root# ');

    // Handle window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
 
};