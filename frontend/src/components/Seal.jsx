import { useState } from "react";
import { GOLD } from "../data/products";

function Seal({ size = 56, animate = false }) {
  const [imgError, setImgError] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const srcs = ["/monarc-logo.png", "/monarc-logo.png.png"];

  if (!imgError) {
    const src = srcs[srcIndex] || srcs[0];

    return (
      <img
        src={src}
        alt="MONARC"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
        onError={() => {
          // try the next candidate, otherwise fall back to SVG
          if (srcIndex < srcs.length - 1) setSrcIndex((s) => s + 1);
          else setImgError(true);
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        flexShrink: 0,
        transformOrigin: "50% 50%",
        animation: animate ? "sealBreathe 6s ease-in-out infinite" : "none",
      }}
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke={GOLD} strokeWidth="1" />

      <circle cx="50" cy="50" r="40" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.6" />

      <text
        x="50"
        y="63"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize="46"
        fontWeight="600"
        fill={GOLD}
      >
        M
      </text>

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;

        const x1 = 50 + Math.cos(angle) * 44;
        const y1 = 50 + Math.sin(angle) * 44;

        const x2 = 50 + Math.cos(angle) * 47;
        const y2 = 50 + Math.sin(angle) * 47;

        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="0.6" opacity="0.5" />
        );
      })}
    </svg>
  );
}

export default Seal;
