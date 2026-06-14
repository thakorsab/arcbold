async function getClientEntry() {
  const { tsrStartManifest } = await import("tanstack-start-manifest:v");
  return tsrStartManifest().clientEntry;
}

function renderClientShell(clientEntry: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ArcBold</title>
    <meta name="description" content="Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" />
    <meta property="og:title" content="ArcBold" />
    <meta property="og:description" content="Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#FF6B00" />
    <meta name="twitter:title" content="ArcBold" />
    <meta name="twitter:description" content="Cross-currency lending protocol on Arc Testnet. Supply USDC, borrow EURC. Or flip it" />
    <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e2830859-ccea-464c-876b-5fae6a7b59f4" />
    <meta name="twitter:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e2830859-ccea-464c-876b-5fae6a7b59f4" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=Orbitron:wght@500;700;900&display=swap" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">import(${JSON.stringify(clientEntry)})</script>
  </body>
</html>`;
}

export default {
  async fetch(request: Request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return new Response(renderClientShell(await getClientEntry()), {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
