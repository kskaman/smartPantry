const Loader = () => (
  <div
    className="flex items-center justify-center h-screen gap-4
  w-full h-full"
  >
    <div className="w-2.5 h-2.5 rounded-full bg-(--secondary-main) animate-pulse delay-0"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-(--secondary-main) animate-pulse delay-150"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-(--secondary-main) animate-pulse delay-300"></div>
  </div>
);

export default Loader;
