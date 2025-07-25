const Not_Found = () => {
  return (
    <div className="flex items-center mt-5 rounded-xl justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 Not Found</h1>
        <p className="text-lg text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default Not_Found;
