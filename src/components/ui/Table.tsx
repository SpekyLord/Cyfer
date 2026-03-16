export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <table className={className}>{children}</table>;
}
