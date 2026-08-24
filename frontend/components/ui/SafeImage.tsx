'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getValidImageUrl, APP_IMAGES } from '@/lib/constants/images';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackCategory?: keyof typeof APP_IMAGES.placeholders;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackCategory = 'service',
  alt,
  className = '',
  ...props
}) => {
  const initialSrc = getValidImageUrl(src, fallbackCategory);
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(APP_IMAGES.placeholders[fallbackCategory]);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'TV Repair Image'}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
