import Image from "next/image";
import type { ServiceImage } from "@/lib/service-module";

function imageSize(src: string) {
  const match = src.match(/\/(\d+)x(\d+)\//);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

export function HeroImage({ image }: { image: ServiceImage }) {
  const size = imageSize(image.src);
  const portrait = size ? size.height > size.width : false;

  if (!portrait || !size) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-white lg:aspect-[16/9]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white lg:relative lg:aspect-[16/9] lg:overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        width={size.width}
        height={size.height}
        preload
        sizes="100vw"
        className="h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover"
      />
    </div>
  );
}
