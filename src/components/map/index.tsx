import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-zinc-400 gap-3">
      <div className="w-10 h-10 border-4 border-t-teal-500 border-zinc-800 rounded-full animate-spin"></div>
      <span className="text-sm font-medium font-sans">Initializing Tactical Map Engine...</span>
    </div>
  ),
});

export default Map;
