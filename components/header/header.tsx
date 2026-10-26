import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  open: boolean;
  onToggle: () => void;
};

export function Header({ open, onToggle }: HeaderProps) {
  return (
    <>
      <Link href="/" className="flex h-logo items-center gap-lockup">
        <span className="logo-mark size-logo shrink-0" aria-hidden="true" />
        <span className="text-logo">
          Praxis
          <br />
          Dr. Hück
        </span>
      </Link>
      <button
        type="button"
        className="lg:hidden"
        aria-expanded={open}
        aria-label="Menü"
        onClick={onToggle}
      >
        <Image
          src="/icon-menu.png"
          alt=""
          width={32}
          height={32}
          className="size-icon-lg"
        />
      </button>
    </>
  );
}
