import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (url = "https://isoft4.washingmachinerepairqa.com") => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(url);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  return { socket: socketRef.current, emit, on, off };
};

export default useSocket;
