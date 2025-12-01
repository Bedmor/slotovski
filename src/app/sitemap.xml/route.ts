export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const pages = [
    "",
    "slot",
    "diamonds",
    "blackjack",
    "auth/signin",
    "auth/signup",
  ];

  const urls = pages
    .map((p) => {
      const loc = `${base}/${p}`.replace(/([^:]\/\/)\//, "$1");
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>daily</changefreq>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
