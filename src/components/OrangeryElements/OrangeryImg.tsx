// react & next
import React, { useState } from 'react';
import Image from 'next/image';

const OrangeryImg = (props: any) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const myLoader = ({ src, width, quality }: any) => {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/${src}.jpg`
  }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      loader={myLoader}
      src={imgSrc}
      layout='fill'
      onError={() => {
        setImgSrc(fallbackSrc || `${process.env.NEXT_PUBLIC_BASE_PATH}/assets/placeholder/placeholder-image.jpg`);
      }}
    />
  );
};

export default OrangeryImg;
