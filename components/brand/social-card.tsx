import { BrandMark } from "@/components/brand/brand-mark";

type SocialCardProps = {
  title: string;
  subtitle: string;
  eyebrow: string;
  location: string;
};

export function SocialCard({
  title,
  subtitle,
  eyebrow,
  location,
}: SocialCardProps) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(135deg, #F9F9F8 0%, #F1EEE8 54%, #E7E2D6 100%)",
        color: "#333333",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right, rgba(196,151,61,0.18), transparent 34%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-80px",
          top: "-90px",
          width: "460px",
          height: "460px",
          borderRadius: "999px",
          border: "1px solid rgba(51, 51, 51, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-10px",
          top: "20px",
          width: "320px",
          height: "320px",
          borderRadius: "999px",
          border: "1px solid rgba(196, 151, 61, 0.20)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "68px 72px",
          display: "flex",
          borderRadius: "40px",
          border: "1px solid rgba(51, 51, 51, 0.10)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "68px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                color: "#8C8780",
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <span>{eyebrow}</span>
              <span style={{ color: "#C4973D" }}>{location}</span>
            </div>
            <div
              style={{
                fontSize: 70,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.45,
                color: "#5D5851",
                maxWidth: "760px",
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "160px",
              height: "160px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "36px",
              border: "1px solid rgba(51, 51, 51, 0.10)",
              background: "rgba(249, 249, 248, 0.72)",
            }}
          >
            <BrandMark size={108} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(51, 51, 51, 0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Krishan Projects
            </div>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.02em",
                color: "#8C8780",
              }}
            >
              Premium renovations, kitchen fitting, and extensions
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              fontSize: 22,
              fontWeight: 700,
              color: "#333333",
            }}
          >
            <span>Clean finishes</span>
            <span style={{ color: "#C4973D" }}>Fixed timelines</span>
            <span>Trusted builders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
