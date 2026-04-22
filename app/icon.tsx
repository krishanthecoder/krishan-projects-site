import { ImageResponse } from "next/og";

import { BrandMark } from "@/components/brand/brand-mark";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #F9F9F8 0%, #F2EFE9 52%, #E6DED0 100%)",
        }}
      >
        <BrandMark size={320} />
      </div>
    ),
    size,
  );
}
