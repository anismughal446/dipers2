import React, { useState } from 'react';

const generalFallback = '/images/happy_baby_playing_1778836772575.png';
const diaperFallback = '/images/diaper_stack_1778836822629.png';

const StoreImage = ({ src, alt = '', ...props }) => {
  const [failed, setFailed] = useState(false);
  const fallback = /diaper|nappy|pampers|molfix|canbebe|huggies/i.test(alt)
    ? diaperFallback
    : generalFallback;

  return (
    <img
      {...props}
      src={failed ? fallback : src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
};

export default StoreImage;
