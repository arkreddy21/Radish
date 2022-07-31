import { AppShell, Navbar, Header, Button } from "@mantine/core";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { ColorSchemeToggle, PostCard } from "../components";
import { useGlobalContext } from "../context";
import { getUser } from "../utils/RedditAPI";

function HomePage() {
  const { state_str, user, setUser, tokens } = useGlobalContext();
  const client = `${import.meta.env.VITE_CLIENT_ID}`;
  const authurl = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${localStorage.getItem(
    "state_str"
  )}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fredirect&duration=permanent&scope=identity mysubreddits read vote submit report save subscribe history`;

  useEffect(() => {
    tokens.access &&
      getUser(tokens.access).then((data: any) => {
        console.log(data);
        setUser(data.name);
      });
  }, [tokens]);

  return (
    <>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} p="xs">
            {/* Navbar content */}
          </Navbar>
        }
        header={
          <Header height={60} p="xs" sx={{display: 'flex', flexDirection: 'row'}} >
            {/* Header content */}
            {user ? (
              <p>{user}</p>
            ) : (
              <Button component="a" href={authurl}>
                login
              </Button>
            )}
            <ColorSchemeToggle/>

          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {/* Your application here */}
        <div>HomePage</div>

        <PostCard
          title="A quick brown fox"
          body="small desc"
          user="human"
          sub="react"
        />
      </AppShell>
    </>
  );
}
export default HomePage;
