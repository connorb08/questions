import { createCookie, createCookieSessionStorage } from "@remix-run/cloudflare";

const sessionCookie = createCookie("__session", {
    secrets: ["r3m1xr0ck5"],
    sameSite: true,
});

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage({
        // a Cookie from `createCookie` or the same CookieOptions to create one
        cookie: sessionCookie,
    });

export { getSession, commitSession, destroySession };
