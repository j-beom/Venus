
import React from 'react';

const GeckoCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-5 flex-grow flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-5 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
        <div className="mt-auto h-10 bg-gray-50 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

export default GeckoCardSkeleton;
