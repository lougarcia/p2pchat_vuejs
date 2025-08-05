export async function onRequest(context) {
  const envPassword = context.env.APP_PASSWORD;

  const authHeader = context.request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Area"',
      },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const [user, pass] = atob(base64).split(":"); // eslint-disable-line

  if (pass !== envPassword) {
    return new Response("Forbidden", { status: 403 });
  }

  return context.next();
}