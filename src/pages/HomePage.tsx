import { Button } from "@mantine/core";
import axios from "axios";
import { useEffect } from "react";
import { useGlobalContext } from "../context";

function HomePage() {
  const {state_str, user,setUser, tokens} = useGlobalContext();
  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${state_str}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;

  //TODO: not getting correct response
  const getUser=async()=>{
    await fetch('https://oauth.reddit.com/api/v1/me',{
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    }).then((res)=> res.json()).then((data)=>{
      console.log(data);
      setUser(data.name)
      console.log(user);
    })
  }

  useEffect(()=>{
    tokens.access && getUser()
  },[tokens])

  return (
    <>
      <div>HomePage</div>
      <Button component="a" href={authurl}>
        click to login
      </Button>
      {user && <p>{user}</p>}
    </>
  );
}
export default HomePage;
