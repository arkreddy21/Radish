import { AppShell, Navbar, Header, Button } from "@mantine/core";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { PostCard, SideBar, TopBar } from "../components";
import { useGlobalContext } from "../context";
import { getUser } from "../utils/RedditAPI";

function HomePage() {
  const { user, setUser, tokens } = useGlobalContext();
  
  useEffect(() => {
    tokens.access &&
      getUser(tokens.access).then((data: any) => {
        console.log(data);
        setUser(data.name);
      });
  }, [tokens]);

  return (
    <AppShell
      padding="md"
      navbar={<SideBar/>}
      header={<TopBar />}
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
  );
}
export default HomePage;
