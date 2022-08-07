import {
  AppShell,
  Navbar,
  Header,
  Button,
  SegmentedControl,
} from "@mantine/core";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { PostCard, SideBar, TopBar } from "../components";
import { useGlobalContext } from "../context";
import { getHomePage, getUser } from "../utils/RedditAPI";

function HomePage() {
  const { user, setUser, setUserdata, tokens } = useGlobalContext();
  const { isLoading, data } = useQuery(
    "home-page",
    async () => await getHomePage(tokens.access)
  );
  const [sort, setSort] = useState('best');

  useEffect(() => {
    data ? console.log(data) : console.log("error occured");
  }, [data]);

  return (
    <>
      {/* Your application here */}
      <div>HomePage</div>
      <SegmentedControl value={sort} onChange={setSort}
        data={[
          { label: "best", value: "best" },
          { label: "hot", value: "hot" },
          { label: "new", value: "new" },
          { label: "top", value: "top" },
        ]}
      />
      {data?.data.children.map((child: any) => {
        return (
          <PostCard
            title={child.data.title}
            body={child.data.selftext}
            user={child.data.author}
            sub={child.data.subreddit}
            flair={child.data.link_flair_richtext}
          />
        );
      })}
    </>
  );
}
export default HomePage;
