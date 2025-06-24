import { Loader } from "../ui/loader";

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader size={56} className="text-blue-600" />
    </div>
  );
}
