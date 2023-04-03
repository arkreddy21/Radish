import { Header, Button, Burger, Text } from "@mantine/core";
import { useGlobalContext } from "../context";
import { useMediaQuery } from '@mantine/hooks';
import ColorSchemeToggle from "./internal/ColorSchemeToggle";

function TopBar({opened, setOpened}:{opened:boolean, setOpened:React.Dispatch<React.SetStateAction<boolean>>}) {

  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${localStorage.getItem(
    "state_str"
  )}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;
  const { user } = useGlobalContext();
  const matches = useMediaQuery('(max-width: 88em)');

  return (
    <div>
      <Header height={60} p="xs" sx={{ display: "flex", flexDirection: "row", gap: 15, alignItems: 'center' }}>
        {matches && <Burger opened={opened} onClick={() => setOpened((o:boolean) => !o)} />}
        <Text c='blue.6' fz='lg' >Radish</Text>
        {user.length===0 &&
          <Button component="a" href={authurl}>
            login
          </Button>
        }
        <ColorSchemeToggle />
      </Header>
    </div>
  );
}

export default TopBar;
