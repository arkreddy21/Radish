import axios from "axios";

const REDDIT = "https://www.reddit.com";
const REDDIT_AUTH = "https://oauth.reddit.com";

export const getUser = async (access: String) => {
  return await axios("https://oauth.reddit.com/api/v1/me", {
    headers: { Authorization: `Bearer ${access}` },
  }).then(res=> res).catch(err=> err.response);
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
  const url0 =
    "https://www.reddit.com/api/v1/access_token?" +
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: `${refresh}`,
    });
  
  const url = "https://www.reddit.com/api/v1/access_token"
  const form = new FormData()
  form.append("grant_type", "refresh_token")
  form.append("refresh_token", refresh)
  const authvalue = `${import.meta.env.VITE_CLIENT_ID}:`;

  let res = await axios.post(url, form, {
    headers: { Authorization: `Basic ${b2a(authvalue)}` },
  });

  return res.data;
};

export const getSubs = async (access: string) => {
  const res = await axios('https://oauth.reddit.com/subreddits/mine/subscriber',{
    headers: { Authorization: `Bearer ${access}` },
  });

  return res.data;
};

export const getHomePage = async (access: string, after?:string) => {
  const url: string = access ? "https://oauth.reddit.com" : "https://www.reddit.com/.json";
  after ? console.log(after) : console.log("no after came")
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
    params: after? {"after":after, "raw_json": '1'} : {"raw_json": '1'}
  });
  return res.data;
};

export const getAboutsub = async (access:string, subid: string|undefined) => {
  const url: string = access ? `https://oauth.reddit.com/r/${subid}/about` : `https://www.reddit.com/r/${subid}/about.json`;
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
  });
  return res.data;
}

export const getSubPosts = async (access:string, subid: string|undefined, after?:string) => {
  const url: string = access ? `https://oauth.reddit.com/r/${subid}` : `https://www.reddit.com/r/${subid}.json`;
  after ? console.log(after) : console.log("no after came");
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
    params: after? {"after":after, "raw_json": '1'} : {"raw_json": '1'}
  });
  return res.data;
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

export const getComments = async (access:string, subid:string|undefined, id:string|undefined, name:string|undefined) => {
  const url: string = access ? `https://oauth.reddit.com/r/${subid}/comments/${id}/${name}` : `https://www.reddit.com/r/${subid}/comments/${id}/${name}.json`;
  const res = await axios(url, {
    headers: access? { Authorization: `Bearer ${access}` } : {},
    params:{"raw_json":'1'}
  });
  return res.data
}

export const postComment = async(access:string, thing_id:string, text:string) => {
  const url = "https://oauth.reddit.com/api/comment";
  const form = new FormData();
  form.append("thing_id", thing_id);
  form.append("text", text);
  const res = await axios.post(url, form, {
    headers:  { Authorization: `Bearer ${access}` },
  });
  console.log(res);
  return res;
}