export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="22" fill="#16a34a" />

    <path
      d="M32 28V72H68"
      stroke="white"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <rect x="42" y="55" width="6" height="10" rx="1" fill="white" />
    <rect x="52" y="45" width="6" height="20" rx="1" fill="white" />
    <rect x="62" y="35" width="6" height="30" rx="1" fill="white" />

    <path
      d="M32 60L48 44L58 52L72 34"
      stroke="white"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62 34H72V44"
      stroke="white"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
