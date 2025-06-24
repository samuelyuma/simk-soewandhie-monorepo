import { Link } from "@tanstack/react-router";

import { Button } from "../ui/button";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-900">
      <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-neutral-700 bg-neutral-800 p-8 text-center">
        <h3 className="font-semibold text-2xl text-neutral-50">
          Page not found!
        </h3>
        <Button asChild className="cursor-pointer">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
