import { Button } from "@mantine/core";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useGlobalContext } from "../context";

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

function RedirectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state_str, tokens, setTokens } = useGlobalContext();
  const code = searchParams.get("code");
  const authvalue = `${import.meta.env.VITE_CLIENT_ID}:`;

  const getToken = () => {
    const url =
      "https://www.reddit.com/api/v1/access_token"
/*       new URLSearchParams({
        grant_type: "authorization_code",
        code: `${code}`,
        redirect_uri: "http://localhost:5173/redirect",
      }); */

    const form = new FormData()
    form.append("grant_type", "authorization_code")
    form.append("code", code||'')
    form.append("redirect_uri", "http://localhost:5173/redirect")
  
    axios.post(url, form, {
      headers: {
        Authorization: `Basic ${b2a(authvalue)}`,
      },
    })
      .then((res) => res.data)
      .then((data: any) => {
        // console.log(data);
        setTokens({ access: data.access_token, refresh: data.refresh_token });
        navigate("/");
      });

    return true;
  };

  useEffect(() => {
    if (searchParams.get("state") === localStorage.getItem("state_str")) {
      console.log('getting tokens from api')
      getToken();
      // localStorage.removeItem("state_str");
      navigate("/");
    }
  }, []);

  return (
    <>
      <div>Redirect to home</div>
      <Button component={Link} to="/">
        home
      </Button>
    </>
  );
}
export default RedirectPage;
