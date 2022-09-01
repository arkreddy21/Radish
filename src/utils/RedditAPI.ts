import axios from "axios";

const REDDIT = "https://www.reddit.com";
const REDDIT_AUTH = "https://oauth.reddit.com";

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

export const refreshToken = async (refresh: string) => {
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

  return await response.json();
};

export const getSubs = async (access: string) => {
  const res = await axios('https://oauth.reddit.com/subreddits/mine/subscriber',{
    headers: { Authorization: `Bearer ${access}` },
  });

  return await res.data;
};

export const getHomePage = async (access: string) => {
  const url: string = access ? "https://oauth.reddit.com" : "https://www.reddit.com/.json";

  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
  });
  return await res.data;
};

export const getAboutsub = async (access:string, subid: string|undefined) => {
  const url: string = access ? `https://oauth.reddit.com/r/${subid}/about` : `https://www.reddit.com/r/${subid}/about.json`;
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
  });
  return await res.data;
}

export const getSubPosts = async (access:string, subid: string|undefined) => {
  const url: string = access ? `https://oauth.reddit.com/r/${subid}` : `https://www.reddit.com/r/${subid}.json`;
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
  });
  return await res.data;
}

export const castVote = async (access:string, name: string, dir:number) => {
  const url = "https://oauth.reddit.com/api/vote"
  const form = new FormData()
  form.append("dir", dir.toString())
  form.append("id", name)
  let res = await axios.post(url, form, {
    headers: {Authorization: `Bearer ${access}`},
  })
  return res.status
}
