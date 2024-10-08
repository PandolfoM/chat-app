function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-[99999] bg-background/60 dark:bg-black/60">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <span className="sr-only">Loading...</span>
          <div className="h-5 w-5 bg-primary dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-5 w-5 bg-primary dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-5 w-5 bg-primary dark:bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}

export default Spinner;
