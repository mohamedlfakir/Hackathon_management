interface BlobProps {
  size: number;
  color: string;
  top: string;
  left: string;
  delay?: number;
}

export default function Blob({ size, color, top, left, delay = 0 }: BlobProps) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(60px)",
        opacity: 0.55,
        top,
        left,
        animation: `floaty 7s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}
