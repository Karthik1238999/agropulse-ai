export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050706] text-[#f4f7f4]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#7dff9a]/20 border-t-[#7dff9a]" />

        <p className="mt-4 text-xs text-[#78837c]">
          Loading AgroPulse intelligence...
        </p>
      </div>
    </main>
  );
}