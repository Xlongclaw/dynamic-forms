"use client";
import React, { useRef } from "react";

const TestPage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Key to send to the child iframe
  const keyToSend = "4bb61f88a06f9ab8e254052582e968a6";

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
        src="http://localhost:3000/projects/6797396b549baf1f96becb8c/form"
        className="w-screen h-screen"
        title="Embedded Form"
        onLoad={handleIframeLoad} // Trigger the function after iframe is loaded
      ></iframe>
    </div>
  );
};

export default TestPage;
