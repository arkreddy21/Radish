import { Header, Button } from "@mantine/core";
import { useGlobalContext } from "../context";
import { refreshToken } from "../utils/RedditAPI";
import ColorSchemeToggle from "./internal/ColorSchemeToggle";

function TopBar() {

  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${localStorage.getItem(
    "state_str"
  )}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;
  const { user,tokens,setTokens } = useGlobalContext();

  const handleRefresh=()=>{
    refreshToken(tokens.refresh).then((data:any)=>{
      console.log(data)
      setTokens({...tokens,access: data.access_token})
    })
  }

  return (
    <div>
      <Header height={60} p="xs" sx={{ display: "flex", flexDirection: "row" }}>
        {user ? (
          <p>{user}</p>
        ) : (
          <Button component="a" href={authurl}>
            login
          </Button>
        )}
        <Button onClick={handleRefresh} >refresh token</Button>
        <ColorSchemeToggle />
      </Header>
    </div>
  );
}

export default TopBar;