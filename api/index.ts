import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildApp } from "../server/app.js";

const appPromise = buildApp().then(async (app) => {
  await app.ready();
  return app;
});

function restoreApiUrl(request: VercelRequest) {
  const pathValue = request.query.path;
  const path = Array.isArray(pathValue)
    ? pathValue.join("/")
    : (pathValue ?? "");
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(request.query)) {
    if (key === "path" || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      search.append(key, item);
    }
  }

  const query = search.toString();
  request.url = `/api/${path}${query ? `?${query}` : ""}`;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  restoreApiUrl(request);
  const app = await appPromise;

  await new Promise<void>((resolve) => {
    response.once("finish", resolve);
    response.once("close", resolve);
    app.server.emit("request", request, response);
  });
}
