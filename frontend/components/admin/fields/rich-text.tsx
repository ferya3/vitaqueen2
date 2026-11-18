"use client";

import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, RemoveFormatting } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Tool {
  icon: typeof Bold;
  label: string;
  command: string;
  arg?: string;
}

const TOOLS: Tool[] = [
  { icon: Heading2, label: "تیتر ۲", command: "formatBlock", arg: "h2" },
  { icon: Heading3, label: "تیتر ۳", command: "formatBlock", arg: "h3" },
  { icon: Bold, label: "پررنگ", command: "bold" },
  { icon: Italic, label: "مورب", command: "italic" },
  { icon: List, label: "فهرست", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "فهرست شماره‌دار", command: "insertOrderedList" },
  { icon: Quote, label: "نقل قول", command: "formatBlock", arg: "blockquote" },
  { icon: Link2, label: "پیوند", command: "createLink" },
  { icon: RemoveFormatting, label: "حذف قالب", command: "formatBlock", arg: "p" },
];

/**
 * Minimal, dependency-free rich text editor (contentEditable). Output HTML is
 * sanitized again on the server (App\Support\HtmlSanitizer).
 */
export function RichText({ value, onChange, dir }: { value: string; onChange: (html: string) => void; dir: "rtl" | "ltr" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || "";
  }, [value]);

  const exec = (command: string, arg?: string) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, arg);
    onChange(el.innerHTML);
  };

  const run = (tool: Tool) => {
    if (tool.command === "createLink") {
      const url = window.prompt("آدرس پیوند (https://…)");
      if (url && /^(https?:|mailto:|tel:|\/)/.test(url)) exec("createLink", url);
      return;
    }
    exec(tool.command, tool.arg);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line focus-within:border-water-400 focus-within:ring-4 focus-within:ring-water-100">
      <div className="flex flex-wrap gap-0.5 border-b border-line bg-cloud p-1.5">
        {TOOLS.map((tool) => (
          <button key={tool.label} type="button" title={tool.label} aria-label={tool.label} onMouseDown={(e) => e.preventDefault()} onClick={() => run(tool)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white hover:text-deep-600">
            <tool.icon className="size-4" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        dir={dir}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className={cn("prose-content min-h-56 px-4 py-3 text-sm outline-none")}
      />
    </div>
  );
}
