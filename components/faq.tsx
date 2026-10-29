"use client";

import { useEffect, useId, useState } from "react";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import type { FaqContent, FaqItem } from "@/lib/service-module";

function paragraphsOf(value: string) {
  return value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function decodeHash(hash: string) {
  const raw = hash.replace(/^#/, "");

  if (!raw) {
    return "";
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function itemIndexForHash(items: FaqItem[], hash: string) {
  const id = decodeHash(hash).toLowerCase();

  if (!id) {
    return -1;
  }

  return items.findIndex((item) => item.anchor.toLowerCase() === id);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`faq-chevron size-4 shrink-0${open ? "" : " faq-chevron-closed"}`}
    />
  );
}

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const hasAnswer = item.answer.blocks.length > 0;

  return (
    <li id={item.anchor || undefined}>
      <button
        type="button"
        className="faq-question w-full cursor-pointer py-menu text-left"
        aria-expanded={open}
        aria-controls={hasAnswer ? panelId : undefined}
        onClick={onToggle}
      >
        <span className="faq-question-caption flex w-full items-center justify-between gap-gutter text-base leading-normal font-medium lg:text-[18px]">
          <span>{item.question}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && hasAnswer ? (
        <div id={panelId} className="pb-menu pl-menu">
          <RichText document={item.answer} />
        </div>
      ) : null}
    </li>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const openFromHash = (hash: string) => {
      const index = itemIndexForHash(items, hash);

      if (index >= 0) {
        setOpen(index);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const anchor = event.target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") {
        return;
      }

      let url: URL;

      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      const there = url.pathname.length > 1 && url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
      const here =
        window.location.pathname.length > 1 && window.location.pathname.endsWith("/")
          ? window.location.pathname.slice(0, -1)
          : window.location.pathname;

      if (there !== here) {
        return;
      }

      openFromHash(url.hash);
    };

    const onHash = () => openFromHash(window.location.hash);

    openFromHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      document.removeEventListener("click", onClick, true);
    };
  }, [items]);

  return (
    <ul>
      {items.map((item, index) => (
        <FaqRow
          key={`${item.anchor}-${item.question}-${index}`}
          item={item}
          open={open === index}
          onToggle={() => setOpen(open === index ? null : index)}
        />
      ))}
    </ul>
  );
}

export function Faq({ faq }: { faq: FaqContent }) {
  const paragraphs = paragraphsOf(faq.body);
  const items = faq.items.filter((item) => item.question || item.answer.blocks.length > 0);

  if (!faq.headline && paragraphs.length === 0 && items.length === 0) {
    return null;
  }

  return (
    <Reveal id={faq.anchor} className="bg-white px-gutter py-20">
      <div className="mx-auto grid max-w-column lg:grid-cols-2 lg:gap-x-20">
        <div className="flex flex-col gap-nav">
          {faq.headline ? <h2 className="text-ink">{faq.headline}</h2> : null}
          {paragraphs.length > 0 ? (
            <div className="flex flex-col gap-pair">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-normal font-normal text-ink lg:text-[18px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          {items.length > 0 ? <FaqList items={items} /> : null}
        </div>
      </div>
    </Reveal>
  );
}
