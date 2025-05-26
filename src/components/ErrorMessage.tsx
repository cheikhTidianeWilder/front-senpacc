import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400 dark:text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Une erreur est survenue
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {message}
            </p>
          </div>
        </div>
        {retry && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={retry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 