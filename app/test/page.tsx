"use client";
import React, { useRef } from "react";

const TestPage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Key to send to the child iframe
  const keyToSend = "e5d1ab010e693e37d17e16d68da205e8";

  // Send the key to iframe when the iframe is loaded
  const handleIframeLoad = () => {
      iframeRef!.current!.contentWindow?.postMessage(
        { type: "SET_KEY", key: keyToSend },
        "*"
      );
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="http://localhost:5173/projects/6797396b549baf1f96becb8c/form"
        className="w-screen h-screen"
        title="Embedded Form"
        onLoad={handleIframeLoad} // Trigger the function after iframe is loaded
      ></iframe>
    </div>
  );
};

export default TestPage;
