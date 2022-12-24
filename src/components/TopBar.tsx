import { Header, Button, Burger } from "@mantine/core";
import { useGlobalContext } from "../context";
import { refreshToken } from "../utils/RedditAPI";
import ColorSchemeToggle from "./internal/ColorSchemeToggle";

function TopBar({opened, setOpened}:{opened:boolean, setOpened:React.Dispatch<React.SetStateAction<boolean>>}) {

  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${localStorage.getItem(
    "state_str"
  )}&redirect_uri=https%3A%2F%2Fradish.netlify.app%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;
  const { user,tokens,setTokens } = useGlobalContext();

  return (
    <div>
      <Header height={60} p="xs" sx={{ display: "flex", flexDirection: "row", gap: 15, alignItems: 'center' }}>
        <Burger opened={opened} onClick={() => setOpened((o:boolean) => !o)} />
        {user ? (
          <p>{user}</p>
        ) : (
          <Button component="a" href={authurl}>
            login
          </Button>
        )}
        <ColorSchemeToggle />
      </Header>
    </div>
  );
}

export default TopBar;
