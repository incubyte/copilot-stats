interface ErrorDisplayProps {
  message: string;
  error: string;
}

const ErrorDisplay = ({ message, error }: ErrorDisplayProps) => {
  return (
    <div className="bg-red-900/30 border border-red-700 rounded-md p-6 my-6">
      <h3 className="text-xl font-semibold text-red-400 mb-2">{message}</h3>
      <p className="text-gray-300">{error}</p>
      <div className="mt-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
