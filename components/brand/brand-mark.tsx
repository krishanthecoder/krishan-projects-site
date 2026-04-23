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
        d="M15 15V51H47V45H21V15H15Z"
        fill="#55616C"
        stroke={primaryColor}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M19 21V47H43"
        stroke="#97A3AD"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M21 18H15"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 24H15"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M21 45H15"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M36 51V45"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M42 51V45"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g className={animated ? "brand-mark__hammer" : undefined}>
        <path
          d="M17 18L46 47"
          stroke={primaryColor}
          strokeWidth="9.5"
          strokeLinecap="round"
        />
        <path
          d="M17 18L46 47"
          stroke={accentColor}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M19.5 20.5L43.5 44.5"
          stroke="#E2B274"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M33 18H44"
          stroke={primaryColor}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M43.5 15V21"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M33.5 18C35.5 14.2 39.7 13.2 43.5 15"
          stroke={primaryColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33.5 18C35 21.4 33.9 24.4 29.7 26.8"
          stroke={primaryColor}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33 18L28.5 23.2"
          stroke={primaryColor}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
