import { Button } from "@mantine/core";
import axios from "axios";
import { useEffect } from "react";
import { useGlobalContext } from "../context";
import {getUser} from "../utils/RedditAPI"

function HomePage() {
  const { state_str, user, setUser, tokens } = useGlobalContext();
  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${state_str}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;

  useEffect(() => {
    tokens.access && (getUser().then((data:any)=>{setUser(data.name)}));
  }, [tokens]);

  return (
    <>
      <div>HomePage</div>
      {user ? (
        <p>{user}</p>
      ) : (
        <Button component="a" href={authurl}>
          click to login
        </Button>
      )}
    </>
  );
}
export default HomePage;
