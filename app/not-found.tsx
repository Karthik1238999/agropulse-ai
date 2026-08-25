import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050706] px-6 text-[#f4f7f4]">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#7dff9a]/20 bg-[#7dff9a]/10">
          <Leaf size={24} className="text-[#7dff9a]" />
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
          AgroPulse AI
        </p>

        <h1 className="mt-3 text-6xl font-semibold tracking-[-0.05em]">
          404
        </h1>

        <h2 className="mt-3 text-lg font-medium">
          Farm intelligence not found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667269]">
          The page you are looking for does not exist in the AgroPulse command
          center.
        </p>

        <Link
          href="/"
          className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-xl bg-[#7dff9a] px-5 py-3 text-xs font-semibold text-[#071008]"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}