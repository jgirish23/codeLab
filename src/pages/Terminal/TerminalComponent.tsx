import React from "react";
import { useSharedWebSocket } from "../../global/utils/WebSocketProvider";
import "./TerminalComponent.css";

export const TerminalComponent: React.FC = () => {
  const { ref, ready } = useSharedWebSocket();

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="breadcrumbs">
          <span className="breadcrumb-item">
            <span className="breadcrumb-active">Terminal</span>
          </span>
        </div>
      </div>
      <div className="terminal-workspace">
        {!ready ? (
          <div className="terminal-loading">Connecting to terminal...</div>
        ) : (
          <div
            ref={ref}
            className="terminal-xterm-container"
          />
        )}
      </div>
    </div>
  );
};
