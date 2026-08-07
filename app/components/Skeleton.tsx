export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#162035] rounded-lg ${className}`} />;
}
