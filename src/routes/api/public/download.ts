import { createFileRoute } from "@tanstack/react-router";

/**
 * GET /api/public/download?id=<driveFileId>&name=<file-name>
 * Fetches a public Google Drive file server-side and streams it back with
 * Content-Disposition: attachment so it downloads directly on the device
 * instead of opening a Google Drive page.
 */
export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        const name = url.searchParams.get("name") ?? "file";

        if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) {
          return new Response("Invalid file id", { status: 400 });
        }

        const safeName = name.replace(/["\\/:*?<>|]/g, "").slice(0, 120) || "file";

        // Direct-download endpoint; confirm=t skips the virus-scan interstitial.
        const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

        let upstream: Response;
        try {
          upstream = await fetch(driveUrl, { redirect: "follow" });
        } catch {
          return new Response("Download failed", { status: 502 });
        }

        if (!upstream.ok || !upstream.body) {
          return new Response(`Download failed [${upstream.status}]`, { status: 502 });
        }

        let contentType = upstream.headers.get("content-type") ?? "";
        // Google sometimes returns an HTML interstitial instead of the file.
        if (contentType.includes("text/html")) {
          return new Response("File is not publicly downloadable", { status: 502 });
        }
        // Drive often omits a real type; these files are PDFs — sending the
        // correct type makes mobile browsers open/save the PDF properly
        // instead of showing raw bytes.
        if (!contentType || contentType.includes("octet-stream")) {
          contentType = "application/pdf";
        }

        const encoded = encodeURIComponent(`${safeName}.pdf`);
        const headers = new Headers({
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="download.pdf"; filename*=UTF-8''${encoded}`,
          "Cache-Control": "public, max-age=3600",
        });
        const len = upstream.headers.get("content-length");
        if (len) headers.set("Content-Length", len);

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
