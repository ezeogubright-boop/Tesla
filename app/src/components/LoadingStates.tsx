import React from 'react';

/**
 * Skeleton loader for 3D model containers while loading
 */
export function ModelLoaderSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing 3D wireframe placeholder */}
        <div className="w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse flex items-center justify-center">
          <svg
            className="w-24 h-24 text-blue-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-blue-400 text-sm font-orbitron">Loading 3D Model...</p>
      </div>
    </div>
  );
}

/**
 * Error state for failed model loading
 */
interface ModelErrorProps {
  error: Error;
  onRetry?: () => void;
}

export function ModelLoadError({ error, onRetry }: ModelErrorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-red-900 rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
        </div>
        <div>
          <p className="text-red-400 font-orbitron font-bold">Failed to Load</p>
          <p className="text-gray-400 text-xs mt-1">{error.message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-orbitron text-xs transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Loading progress indicator
 */
interface ModelLoadingProgressProps {
  progress: number;
}

export function ModelLoadingProgress({ progress }: ModelLoadingProgressProps) {
  return (
    <div className="fixed top-4 left-4 z-50 bg-black border border-blue-500 rounded p-3 min-w-[200px]">
      <div className="text-xs text-blue-400 font-orbitron mb-2">
        Loading: {Math.round(progress)}%
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
