/// <reference types="@cloudflare/workers-types" />
// SPEC friend-invite-tokens — share-landing for `https://michi.quest/i/<token>`.
// Parallel of `functions/u/[id].ts`. The token deep-links into the app's
// redeem flow (AASA /i/*) when installed; otherwise this paints an OG card
// with an "Add in app" CTA + store links. hull's unauthenticated preview
// (`GET /api/v1/invites/:token`) is the data source and the 404 authority;
// non-active tokens still return 200 with a status, which we render as a
// tombstone.

import {
  type InviteShareData,
  type InviteStatus,
  INVITE_TOKEN,
  renderInviteShareHtml,
} from "../_shared/template";

interface Env {
  HULL_BASE_URL: string;
}

interface PreviewResponse {
  owner: { id: string; name: string; image: string | null };
  status: InviteStatus;
  alreadyFriends: boolean;
  isSelf: boolean;
}

export const onRequest: PagesFunction<Env> = async ({ params, env }) => {
  const token = (params.token as string) ?? "";
  if (!INVITE_TOKEN.test(token)) {
    return new Response(null, { status: 404 });
  }

  const base = env.HULL_BASE_URL?.replace(/\/+$/, "") ?? "";
  if (!base) {
    return new Response(null, { status: 502 });
  }

  let preview: PreviewResponse;
  try {
    const res = await fetch(`${base}/api/v1/invites/${token}`, {
      cf: { cacheTtl: 30, cacheEverything: true },
    });
    if (res.status === 404) {
      return Response.redirect("https://michi.quest/?notfound=invite", 302);
    }
    if (!res.ok) {
      return Response.redirect("https://michi.quest/?error=share", 302);
    }
    preview = (await res.json()) as PreviewResponse;
  } catch {
    return Response.redirect("https://michi.quest/?error=share", 302);
  }

  const data: InviteShareData = {
    token,
    ownerName: preview.owner?.name ?? "Someone",
    ownerImage: preview.owner?.image ?? null,
    status: preview.status,
  };

  const html = renderInviteShareHtml(data);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
      "Content-Security-Policy":
        "default-src 'self'; img-src https: data:; style-src 'unsafe-inline'; script-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
};
