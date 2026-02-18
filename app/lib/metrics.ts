import client from "prom-client";

// Usa un singleton globale compatibile con Next.js
const globalForProm = globalThis as unknown as {
  prometheusRegistry?: client.Registry;
  prometheusMetricsInitialized?: boolean;
  httpRequestDuration?: client.Histogram<string>;
};

// Registry unico
export const registry =
  globalForProm.prometheusRegistry ?? new client.Registry();

if (!globalForProm.prometheusRegistry) {
  globalForProm.prometheusRegistry = registry;
}

// Default metrics (solo una volta)
if (!globalForProm.prometheusMetricsInitialized) {
  client.collectDefaultMetrics({ register: registry });
  globalForProm.prometheusMetricsInitialized = true;
}

// Histogram HTTP (solo una volta)
export const httpRequestDuration =
  globalForProm.httpRequestDuration ??
  new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 1, 2],
  });

if (!globalForProm.httpRequestDuration) {
  registry.registerMetric(httpRequestDuration);
  globalForProm.httpRequestDuration = httpRequestDuration;
}
