-- Phase 12: fixed-window rate limiting for public forms/routes, backed by
-- Postgres instead of a new external service (Upstash/Redis) since the
-- existing Supabase connection already covers it at this traffic scale.

CREATE TABLE "rate_limit_hits" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_hits_pkey" PRIMARY KEY ("key")
);
