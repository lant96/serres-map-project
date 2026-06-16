export default function BackArrow({ onClose, standalone = false }) {
  return (
    <button
      onClick={() => onClose?.()}
      className={`hotspot-back-button${standalone ? " hotspot-back-button--standalone" : ""}`}
      aria-label="Back to list"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}