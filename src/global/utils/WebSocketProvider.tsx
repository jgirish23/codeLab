import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import {useXTerm, XTermProps} from "react-xtermjs";
import { FitAddon } from "xterm-addon-fit";

interface IWebSocketContext {
    ref: React.RefObject<HTMLDivElement>;
    ws: WebSocket | null;
    ready: boolean;
    instance: any;
}

const WebSocketContext = createContext<IWebSocketContext>({
    ref: { current: null },
    ws: null,
    ready: false,
    instance: null,
});

const XTERM_OPTIONS = {
    theme: {
        background: "#111827",
        foreground: "#F8FAFC",
        cursor: "#3B82F6",
        selectionBackground: "rgba(59, 130, 246, 0.3)",
    },
    fontSize: 13,
    fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
    cursorBlink: true,
};

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
                                                                         children,
                                                                     }) => {
    const { instance, ref } = useXTerm({ options: XTERM_OPTIONS });
    const fitAddon = useRef(new FitAddon());

    const wsRef = useRef<WebSocket | null>(null);

    const commandRef = useRef("");
    const [history, setHistory] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(-1);

    const [ready, setReady] = useState(false);

    // 🔹 WebSocket lifecycle
    useEffect(() => {
        const ws = new WebSocket(
            `ws://${localStorage.getItem("projectId")}.mylocal:8081/ws-endpoint`
        );

        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            ws.send("clear");
            setReady(true);

            // keep alive
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send("__ping__");
                }
            }, 20000);
        };

        ws.onclose = () => {
            console.warn("❌ WebSocket closed");
            setReady(false);
        };

        ws.onerror = (e) => {
            console.error("WebSocket error", e);
        };

        return () => {
            ws.close();
        };
    }, []);

    // 🔹 Xterm ↔ WebSocket bridge
    useEffect(() => {
        if (!instance || !ref.current || !wsRef.current || !ready) return;

        instance.open(ref.current);
        instance.loadAddon(fitAddon.current);
        fitAddon.current.fit();
        instance.focus();

        wsRef.current.onmessage = (event) => {
            instance.write(
                event.data.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")
            );
        };

        const disposable = instance.onData((data: string) => {
            // ENTER
            if (data === "\r") {
                wsRef.current?.send(commandRef.current);
                setHistory((h) => [commandRef.current, ...h]);
                commandRef.current = "";
                setIndex(-1);
                instance.write("\r\n");
                return;
            }

            // CTRL + C
            if (data === "\u0003") {
                instance.write("^C\r\n");
                wsRef.current?.send("\u0003");
                return;
            }

            // BACKSPACE
            if (data === "\u007F") {
                if (commandRef.current.length > 0) {
                    commandRef.current = commandRef.current.slice(0, -1);
                    instance.write("\b \b");
                }
                return;
            }

            // UP ARROW
            if (data === "\u001b[A" && index < history.length - 1) {
                const i = index + 1;
                setIndex(i);
                commandRef.current = history[i];
                instance.write(`\x1b[2K\r${commandRef.current}`);
                return;
            }

            // DOWN ARROW
            if (data === "\u001b[B") {
                const i = index - 1;
                setIndex(i);
                commandRef.current = history[i] || "";
                instance.write(`\x1b[2K\r${commandRef.current}`);
                return;
            }

            // NORMAL INPUT
            commandRef.current += data;
            instance.write(data);
        });

        return () => {
            disposable.dispose()
            instance.dispose();
        };
    }, [instance, ready, ref]);


    return (
        <WebSocketContext.Provider
            value={{
                ref,
                ws: wsRef.current,
                ready,
                instance
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSharedWebSocket = () => useContext(WebSocketContext);
