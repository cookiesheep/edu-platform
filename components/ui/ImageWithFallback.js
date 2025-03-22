'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/placeholder-image.jpg',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={`relative ${className || ''}`} style={{ width, height }}>
      {!imgLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onError={() => setImgSrc(fallbackSrc)}
        onLoad={() => setImgLoaded(true)}
        {...props}
      />
    </div>
  );
} 