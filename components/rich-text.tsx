import Link from "next/link";
import type { ReactNode } from "react";
import type { RichBlock, RichInline, RichMark, RichTextDoc } from "@/lib/rich-text";

function RichAnchor({
  href,
  target,
  children,
}: {
  href: string;
  target?: "_blank";
  children: ReactNode;
}) {
  const className = "header-link underline";

  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function markedText(text: string, marks: RichMark[]) {
  return marks.reduce<ReactNode>((children, mark) => {
    if (mark.type === "bold") {
      return <strong className="font-medium">{children}</strong>;
    }

    if (mark.type === "italic") {
      return <em className="italic">{children}</em>;
    }

    return (
      <RichAnchor href={mark.href} target={mark.target}>
        {children}
      </RichAnchor>
    );
  }, text);
}

function Inlines({ content }: { content: RichInline[] }) {
  return content.map((node, index) =>
    node.type === "break" ? <br key={index} /> : <span key={index}>{markedText(node.text, node.marks)}</span>,
  );
}

function Blocks({ blocks }: { blocks: RichBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4";
      const className = "text-ink";

      return (
        <Tag key={index} className={className}>
          <Inlines content={block.content} />
        </Tag>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p key={index}>
          <Inlines content={block.content} />
        </p>
      );
    }

    const ListTag = block.type === "ordered_list" ? "ol" : "ul";
    const listClass =
      block.type === "ordered_list"
        ? "list-decimal pl-gutter [&>li:not(:first-child)]:mt-pair"
        : "list-disc pl-gutter [&>li:not(:first-child)]:mt-pair";

    return (
      <ListTag key={index} className={listClass}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <Blocks blocks={item} />
          </li>
        ))}
      </ListTag>
    );
  });
}

export function RichText({ document }: { document: RichTextDoc }) {
  if (document.blocks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-pair text-base leading-normal font-normal text-ink lg:text-[18px]">
      <Blocks blocks={document.blocks} />
    </div>
  );
}
