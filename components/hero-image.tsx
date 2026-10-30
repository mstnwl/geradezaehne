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

function HeroFrame({
  image,
  mobile,
}: {
  image: ServiceImage;
  mobile: "cover" | "natural";
}) {
  const size = imageSize(image.src);
  const portrait = size ? size.height > size.width : false;

  if (!size || (!portrait && mobile !== "natural")) {
    const mobileAspect = mobile === "natural" ? "aspect-[3/2]" : "aspect-[4/5]";

    return (
      <div className={`relative ${mobileAspect} w-full overflow-hidden bg-white lg:aspect-[16/9]`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          unoptimized
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
        unoptimized
        sizes="100vw"
        className="h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:object-cover"
      />
    </div>
  );
}

export function HeroImage({
  image,
  imageMobile = null,
  mobile = "cover",
}: {
  image: ServiceImage | null;
  imageMobile?: ServiceImage | null;
  mobile?: "cover" | "natural";
}) {
  if (!image) {
    if (!imageMobile) {
      return null;
    }

    return (
      <div className="lg:hidden">
        <HeroFrame image={imageMobile} mobile={mobile} />
      </div>
    );
  }

  if (!imageMobile) {
    return <HeroFrame image={image} mobile={mobile} />;
  }

  return (
    <>
      <div className="lg:hidden">
        <HeroFrame image={imageMobile} mobile={mobile} />
      </div>
      <div className="hidden lg:block">
        <HeroFrame image={image} mobile={mobile} />
      </div>
    </>
  );
}
