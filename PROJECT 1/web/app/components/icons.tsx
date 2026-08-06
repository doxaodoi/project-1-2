// Small set of monochrome stroke icons (Heroicons-style, currentColor). No external deps.
import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.6,
  stroke: "currentColor",
  ...props,
});

export function IconUser(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z" />
    </svg>
  );
}

export function IconCard(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9V6.75A1.5 1.5 0 0 1 3.75 5.25h16.5A1.5 1.5 0 0 1 21.75 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V9Zm3.75 6.75h4.5" />
    </svg>
  );
}

export function IconClipboard(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25h6M9 5.25a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.25m-6 0H7.5A1.5 1.5 0 0 0 6 6.75v12A1.5 1.5 0 0 0 7.5 20.25h9A1.5 1.5 0 0 0 18 18.75v-12a1.5 1.5 0 0 0-1.5-1.5H15M9 12h6m-6 3.75h4.5" />
    </svg>
  );
}

export function IconCap(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75 1.5 8.25 12 12.75l9-3.857M12 3.75l9 3.857M12 3.75 21 7.607M6.75 10.5v4.629c0 .621.36 1.19.94 1.423A11.9 11.9 0 0 0 12 17.25c1.52 0 2.98-.284 4.31-.798.58-.233.94-.802.94-1.423V10.5" />
    </svg>
  );
}

export function IconUsers(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.1 9.1 0 0 0 3.74-.79 3 3 0 0 0-4.68-3.66M18 18.72V18a5.97 5.97 0 0 0-.94-3.22M18 18.72a9.09 9.09 0 0 1-12 0m12 0v-.35M6 18.72a9.1 9.1 0 0 1-3.74-.79 3 3 0 0 1 4.68-3.66M6 18.72V18c0-1.18.34-2.28.94-3.22m0 0a6 6 0 0 1 10.12 0M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-15 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

export function IconBuilding(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

export function IconBook(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.97 8.97 0 0 0 6 3.75c-1.05 0-2.062.18-3 .512v14.25A8.99 8.99 0 0 1 6 18c2.31 0 4.44.784 6 2.1V6.042Zm0 0A8.97 8.97 0 0 1 18 3.75c1.05 0 2.062.18 3 .512v14.25A8.99 8.99 0 0 0 18 18c-2.31 0-4.44.784-6 2.1V6.042Z" />
    </svg>
  );
}
