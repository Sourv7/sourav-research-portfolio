/**
 * POST /api/contact
 * ---------------------------------------------------------------------------
 * Vercel serverless function. Zero config: dropping this file in /api is
 * enough, there is still no build step and no package.json.
 *
 * Required environment variables (Vercel dashboard -> Settings -> Environment
 * Variables). Without them the endpoint returns 503 and the form tells the
 * visitor to use GitHub instead, so a missing key degrades politely rather
 * than losing a message silently.
 *
 *   RESEND_API_KEY   an API key from resend.com
 *   CONTACT_TO       the address that receives the messages
 *   CONTACT_FROM     a verified sender, e.g. contact@yourdomain.com
 *                    (Resend's onboarding@resend.dev works for testing)
 *
 * The recipient address lives here, never in the page, so it is not exposed
 * to scrapers.
 */

const LIMITS = { name: 120, email: 254, message: 5000 };

// A single warm instance keeps recent senders in memory. This is a speed
// bump for casual abuse, not a security control: instances are recycled and
// there may be several at once.
const recent = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function tooMany(key) {
    const now = Date.now();
    const hits = (recent.get(key) || []).filter((t) => now - t < WINDOW_MS);

    hits.push(now);
    recent.set(key, hits);

    if (recent.size > 500) {
        recent.clear();
    }

    return hits.length > MAX_PER_WINDOW;
}

function clean(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Deliberately permissive: the only thing worth rejecting here is something
// that clearly is not an address.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({ error: "Method not allowed." });
    }

    let body = request.body;

    if (typeof body === "string") {
        try {
            body = JSON.parse(body);
        } catch {
            return response.status(400).json({ error: "Malformed request." });
        }
    }

    body = body || {};

    // Honeypot: a real person never fills a field they cannot see. Answer 200
    // so a bot cannot tell it was rejected.
    if (clean(body.website, 100)) {
        return response.status(200).json({ ok: true });
    }

    const name = clean(body.name, LIMITS.name);
    const email = clean(body.email, LIMITS.email);
    const message = clean(body.message, LIMITS.message);

    if (!name || !email || !message) {
        return response.status(400).json({
            error: "Please fill in your name, email, and message."
        });
    }

    if (!EMAIL.test(email)) {
        return response.status(400).json({
            error: "That email address does not look right."
        });
    }

    if (message.length < 10) {
        return response.status(400).json({
            error: "Please write a little more so I can reply usefully."
        });
    }

    const forwarded = request.headers["x-forwarded-for"] || "";
    const ip = String(forwarded).split(",")[0].trim() || "unknown";

    if (tooMany(ip)) {
        return response.status(429).json({
            error: "Too many messages just now. Please try again in a minute."
        });
    }

    const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;

    if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
        console.error("Contact form is not configured: missing env vars.");
        return response.status(503).json({
            error: "The contact form is not available right now."
        });
    }

    try {
        const sent = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: CONTACT_FROM,
                to: [CONTACT_TO],
                reply_to: email,
                subject: `Portfolio enquiry from ${name}`,
                text: [
                    `Name:    ${name}`,
                    `Email:   ${email}`,
                    "",
                    message
                ].join("\n")
            })
        });

        if (!sent.ok) {
            console.error("Resend rejected the message:", sent.status);
            return response.status(502).json({
                error: "The message could not be delivered. Please try GitHub instead."
            });
        }

        return response.status(200).json({ ok: true });
    } catch (error) {
        console.error("Contact endpoint failed:", error.message);
        return response.status(502).json({
            error: "The message could not be delivered. Please try GitHub instead."
        });
    }
}
