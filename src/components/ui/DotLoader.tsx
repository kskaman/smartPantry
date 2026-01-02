export default function DotLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center space-x-1 inline ${className} m-2`}
      aria-label="Loading"
    >
      <span
        className="dot bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></span>
      <span
        className="dot bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "200ms" }}
      ></span>
      <span
        className="dot bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "400ms" }}
      ></span>
      <style jsx>{`
        .dot {
          display: inline-block;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}
