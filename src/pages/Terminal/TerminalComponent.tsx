import React from "react";
import { useSharedWebSocket } from "../../global/utils/WebSocketProvider";

export const TerminalComponent: React.FC = () => {
  const { ref, ready } = useSharedWebSocket();

  if (!ready) {
    return <div>Connecting to terminal...</div>;
  }

  return (
      <div
          ref={ref}
          style={{
            height: "100%",
            width: "100%",
            textAlign: "left",
          }}
      />
  );
};
