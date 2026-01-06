export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 rounded-[12px] bg-(--card-bg) 
    border border-(--card-border)"
    >
      {children}
    </div>
  );
}

export function StatCardContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full
    "
    >
      {children}
    </div>
  );
}
