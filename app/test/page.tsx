"use client";
import React, { useRef } from "react";

const TestPage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Key to send to the child iframe
  const keyToSend = "97c96b8876b9723091c29312b0e15b12";

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
        src="http://localhost:3000/projects/6798a5b6ef4f2fc0ccf48350/form"
        className="w-screen h-screen"
        title="Embedded Form"
        onLoad={handleIframeLoad} // Trigger the function after iframe is loaded
      ></iframe>
    </div>
  );
};

export default TestPage;
