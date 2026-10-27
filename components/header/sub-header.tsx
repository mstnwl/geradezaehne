import Image from "next/image";
import type { CSSProperties } from "react";

function percent(value: number) {
  return Number(value.toFixed(3));
}

function hoursKeyframes(count: number) {
  const fadeIn = percent(10.5 / count);
  const hold = percent(100 / count);
  const fadeOut = percent(111 / count);

  return `@keyframes hours-swap {
    0% { opacity: 0; transform: translateY(var(--spacing-pair)); }
    ${fadeIn}% { opacity: 1; transform: translateY(0); }
    ${hold}% { opacity: 1; transform: translateY(0); }
    ${fadeOut}% { opacity: 0; transform: translateY(calc(var(--spacing-pair) * -1)); }
    100% { opacity: 0; transform: translateY(var(--spacing-pair)); }
  }`;
}

export function SubHeader({ lines }: { lines: string[] }) {
  const count = lines.length;
  const cycling = count > 1;

  return (
    <div className="enter enter-3 bg-accent text-ink lg:px-gutter">
      {cycling ? <style>{hoursKeyframes(count)}</style> : null}
      <div className="flex h-bar items-center lg:mx-auto lg:max-w-column lg:justify-between">
        <p
          className={`hours hidden text-nav font-normal whitespace-nowrap lg:grid${cycling ? " hours-cycle" : ""}`}
          style={{ "--hours-count": count } as CSSProperties}
        >
          {lines.map((line, index) => (
            <span
              key={`${index}-${line}`}
              className="hours-line"
              style={{ "--hours-index": index } as CSSProperties}
            >
              {line}
            </span>
          ))}
        </p>
        <div className="grid h-full w-full grid-cols-2 items-center lg:flex lg:w-auto lg:gap-gutter">
          <a
            href="tel:+496131227266"
            className="header-link flex items-center justify-center gap-pair text-nav whitespace-nowrap"
          >
            <Image
              src="/Icon24_Phone.svg"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="size-icon"
            />
            06131 227266
          </a>
          <a
            href="#"
            className="header-link flex items-center justify-center gap-pair text-nav whitespace-nowrap"
          >
            <Image
              src="/Icon24_Calendar.svg"
              alt=""
              width={24}
              height={24}
              unoptimized
              className="size-icon shrink-0"
            />
            Termin buchen
          </a>
        </div>
      </div>
    </div>
  );
}
