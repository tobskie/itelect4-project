// src/pages/NotFoundPage.tsx
// Without a path="*" route, a URL nothing matches renders a blank page --
// no error, no warning. This is what fills that gap.
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">🧭</span>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        404 -- Page Not Found
      </h2>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 max-w-xs">
        That URL does not match any route in this app.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200"
      >
        Go back to the Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
