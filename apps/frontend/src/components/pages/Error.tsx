export default function ErrorBoundaryPage({ error }: { error: Error }) {
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-900">
      <div className="flex w-1/2 flex-col items-center justify-center gap-6 rounded-lg border border-neutral-700 bg-neutral-800 p-8 text-center">
        <h3 className="font-semibold text-2xl text-red-500">
          Something went wrong!
        </h3>
        <p className="text-neutral-50">{error.message}</p>
      </div>
    </div>
  );
}
