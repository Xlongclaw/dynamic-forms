import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="spinner"></div>
      <p className="ml-4 text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default Loading;
