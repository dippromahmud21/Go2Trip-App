import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  priority = false
}: BrandLogoProps) {
  return (
    <Image
      alt="Go2Trip"
      className={cn("h-auto w-auto select-none", className)}
      height={448}
      priority={priority}
      src="/brand/go2trip-logo.png"
      width={1545}
    />
  );
}
