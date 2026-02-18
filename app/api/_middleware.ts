import { NextResponse } from "next/server";
import client from "prom-client";

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  buckets: [0.1, 0.3, 0.5, 1, 2],
});

export function middleware(req) {
  const start = Date.now();

  const response = NextResponse.next();

  const duration = (Date.now() - start) / 1000;

  httpRequestDurationMicroseconds.observe(duration);

  return response;
}
