type BrandMarkProps = {
  size?: number;
  accentColor?: string;
  primaryColor?: string;
  title?: string;
  animated?: boolean;
};

export function BrandMark({
  size = 64,
  accentColor = "#C4973D",
  primaryColor = "#333333",
  title = "Krishan Projects brand mark",
  animated = false,
}: BrandMarkProps) {
  return (
    <svg
      aria-label={title}
      role="img"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "brand-mark brand-mark--animated" : "brand-mark"}
    >
      <title>{title}</title>
      <path
        d="M16 14V50H46"
        stroke={accentColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 50H46"
        stroke={accentColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 20H16"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 26H16"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 44H16"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 50V44"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34 50V44"
        stroke={accentColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g className={animated ? "brand-mark__hammer" : undefined}>
        <path
          d="M24 44L34 30"
          stroke={primaryColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M24 44L20 48"
          stroke={primaryColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M27 18C25.343 18 24 19.343 24 21V23C24 24.657 25.343 26 27 26H32.3L28.7 29.6C28.1 30.2 28.1 31.15 28.7 31.75C29.3 32.35 30.25 32.35 30.85 31.75L36.6 26H39L44.6 31.6C45.2 32.2 46.15 32.2 46.75 31.6C47.35 31 47.35 30.05 46.75 29.45L43.3 26H44.5C46.433 26 48 24.433 48 22.5C48 20.567 46.433 19 44.5 19H39.7L37.8 17.1C37.2 16.5 36.25 16.5 35.65 17.1L33.75 19H27Z"
          fill={primaryColor}
        />
      </g>
    </svg>
  );
}
