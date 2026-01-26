'use client';

export default function VisibilityToggle({ isPublic, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!isPublic)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isPublic ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={isPublic}
    >
      <span className="sr-only">Toggle visibility</span>
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isPublic ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
