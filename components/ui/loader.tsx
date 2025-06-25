import React from "react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <span className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default Loader; 