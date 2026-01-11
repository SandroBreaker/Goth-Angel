
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-[#111] aspect-square rounded-none border border-neutral-800 animate-pulse flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-neutral-800 rounded-full mb-4"></div>
      <div className="w-3/4 h-4 bg-neutral-800 mb-2"></div>
      <div className="w-1/2 h-3 bg-neutral-800"></div>
    </div>
  );
};
