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
  const { user, setUserdata, tokens, isEnabled } = useGlobalContext();
  const { isLoading, data } = useQuery(
    "home-page", () => getHomePage(tokens.access),
    { enabled: isEnabled }
  );
  const [sort, setSort] = useState("best");

  useEffect(() => {
    data ? console.log(data) : console.log("error occured");
  }, [data]);

  if (isLoading) return <h3>Loading</h3>;

  return (
    <>
      <div>HomePage</div>
      <SegmentedControl
        value={sort}
        onChange={setSort}
        data={[
          { label: "best", value: "best" },
          { label: "hot", value: "hot" },
          { label: "new", value: "new" },
          { label: "top", value: "top" },
        ]}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data?.data.children.map((child: any) => {
          return <PostCard data={child.data} access = {tokens.access} />;
        })}
      </div>
    </>
  );
}

export default HomePage;
