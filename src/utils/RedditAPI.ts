
export const getUser = async (access: String) => {
  let response = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  return await response.json();
};

function b2a(a: string) {
  var c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    o,
    b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    k = 0,
    l = 0,
    m = "",
    n = [];
  if (!a) return a;
  do
    (c = a.charCodeAt(k++)),
      (d = a.charCodeAt(k++)),
      (e = a.charCodeAt(k++)),
      (j = (c << 16) | (d << 8) | e),
      (f = 63 & (j >> 18)),
      (g = 63 & (j >> 12)),
      (h = 63 & (j >> 6)),
      (i = 63 & j),
      (n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i));
  while (k < a.length);
  return (
    (m = n.join("")),
    (o = a.length % 3),
    (o ? m.slice(0, o - 3) : m) + "===".slice(o || 3)
  );
}

export const refreshToken = async (refresh: String) => {
  const url =
    "https://www.reddit.com/api/v1/access_token?" +
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: `${refresh}`,
    });
  const authvalue = `${import.meta.env.VITE_CLIENT_ID}:`;

  let response = await fetch(url, {
    headers: { Authorization: `Basic ${b2a(authvalue)}` },
    method: "POST",
  });

  return await response.json()
};
