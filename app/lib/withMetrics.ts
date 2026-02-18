import { httpRequestDuration } from "./metrics";


export function withMetrics(handler, routeName: string) {
  return async (req: Request, ...args: any[]) => {
    const end = httpRequestDuration.startTimer({
      method: req.method,
      route: routeName,
    });

    const res = await handler(req, ...args);

    end({ status_code: res.status });

    return res;
  };
}
