export function Pin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0C6.6 0 2.2 4.3 2.2 9.6c0 7.2 9.8 22.4 9.8 22.4s9.8-15.2 9.8-22.4C21.8 4.3 17.4 0 12 0zm0 13.4a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6z"
      />
    </svg>
  );
}
