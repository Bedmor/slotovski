import type React from "react";
import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") ?? "Slotovski";
    const subtitle = searchParams.get("subtitle") ?? "Spin. Win. Repeat.";

    const ImageResponseConstructor = ImageResponse as unknown as new (body: React.ReactElement, options?: { width: number; height: number }) => Response;

    return new ImageResponseConstructor(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(90deg,#1a0b2e 0%, #43105b 40%, #0f0f1a 100%)",
            color: "#fff",
            fontFamily:
              'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            padding: 60,
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: 1100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                }}
              >
                🎰
              </div>
              <div>
                <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
                  {title}
                </div>
                <div style={{ marginTop: 8, fontSize: 24, opacity: 0.85 }}>{subtitle}</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    ) as unknown as Response;
  } catch {
    return new Response("Failed to generate the image", { status: 500 });
  }
}
