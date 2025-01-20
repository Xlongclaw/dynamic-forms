import React, { useState } from 'react';
import Image from 'next/image';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageWithLoader: React.FC<ImageProps> = ({ src, alt, width, height, className }) => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false when the image is loaded
  };

  const handleImageError = () => {
    setIsLoading(false); // Stop the loading state on error
    console.error('Error loading image');
  };

  return (
    <div className={` ${className}`}>
      {/* Show loading spinner while image is loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="spinner"></div>
      </div>
      )}
      {/* <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={handleImageLoad} // Event fired when image is fully loaded
        onError={handleImageError} // Event fired when image fails to load
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      /> */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default ImageWithLoader;
