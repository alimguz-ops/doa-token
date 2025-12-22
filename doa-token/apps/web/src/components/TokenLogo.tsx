import Image from "next/image";

export function TokenLogo() {
  return (
    <Image
      src="/brand/doa/doa.svg"
      width={64}
      height={64}
      alt="DOA token"
    />
  );
}
