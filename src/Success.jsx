function Success() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600">Your transaction has been processed.</p>
        <a
          href="/checkout"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          Make another payment
        </a>
      </div>
    </div>
  );
}

export default Success;
