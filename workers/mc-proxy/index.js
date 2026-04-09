const ORIGIN = "http://vps.theworklessco.com:4000";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originUrl = new URL(url.pathname + url.search, ORIGIN);

    const init = {
      method: request.method,
      redirect: "manual",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    try {
      const response = await fetch(originUrl.toString(), init);

      const newHeaders = new Headers(response.headers);
      newHeaders.delete("X-Frame-Options");
      newHeaders.delete("Content-Security-Policy");
      newHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response("Proxy error: " + err.message, { status: 502 });
    }
  },
};
