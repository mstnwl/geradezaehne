import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  open: boolean;
  onToggle: () => void;
};

export function Header({ open, onToggle }: HeaderProps) {
  return (
    <>
      <Link href="/" className="enter inline-flex shrink-0">
        <Image
          src="/Praxis_Logo_Header.svg"
          alt="Praxis Dr. Hück"
          width={191}
          height={55}
          unoptimized
          priority
          className="h-logo w-auto"
        />
      </Link>
      <button
        type="button"
        className="enter enter-2 lg:hidden"
        aria-expanded={open}
        aria-label="Menü"
        onClick={onToggle}
      >
        <Image
          src="/Icon32_Burger.svg"
          alt=""
          width={32}
          height={32}
          unoptimized
          className="size-icon-lg"
        />
      </button>
    </>
  );
}
