export default function LoadingPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-rose-500 border-solid"></div>
          <div className="text-lg font-medium text-gray-700">Please wait, loading...</div>
        </div>
      </div>
    );
  }
  