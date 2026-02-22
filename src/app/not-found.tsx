import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-6xl font-bold text-slate-900 dark:text-white font-heading mb-4">
        404
      </h2>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
        Page not found
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all shadow-lg shadow-blue-500/25"
      >
        Back to Home
      </Link>
    </div>
  );
}
