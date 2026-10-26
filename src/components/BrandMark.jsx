import React from 'react';

const BrandMark = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 48 48" role="img" aria-label="NunuNest nest and sprout logo">
    <circle cx="24" cy="24" r="23" fill="#fff3d6" />
    <path d="M10 29c4 8 24 8 28 0M13 34c5 6 17 7 22 0M17 38c4 3 10 3 14 0" fill="none" stroke="#148f88" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 28c0-7 0-11 1-15" fill="none" stroke="#148f88" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M25 19c-7 0-10-4-10-8 6-.5 10 2 10 8Z" fill="#38b79f" />
    <path d="M25 16c1-6 5-9 11-8 0 6-4 10-11 10" fill="#ff8297" />
    <circle cx="25" cy="27" r="2.2" fill="#ff8297" />
  </svg>
);

export default BrandMark;
