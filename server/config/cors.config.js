import "dotenv/config";

// Read origins strictly from CLIENT_URL in .env (supports a single URL or comma-separated list)
const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((url) => url.trim().replace(/\/$/, ""))
      .filter(Boolean)
  : [];

// Only allow explicitly configured origins (fallback to localhost only if CLIENT_URL is not set)
export const allowedOrigins =
  envOrigins.length > 0 ? envOrigins : ["http://localhost:5173"];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    // Strictly check against explicitly allowed origins (no automatic dev tunnels or vercel domains)
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

