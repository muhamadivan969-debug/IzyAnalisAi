export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      {children}
    </div>
  );
}
