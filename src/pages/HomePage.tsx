import {SegmentedControl} from "@mantine/core";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { PostCard} from "../components";
import { useGlobalContext } from "../context";
import { getHomePage} from "../utils/RedditAPI";

function HomePage() {
  const { user, setUserdata, tokens, isEnabled } = useGlobalContext();
  //TODO: useQuery fetching even when enabled: false?
  //TODO? include access token in query key
  const { isLoading, data } = useQuery(
    ["home-page",tokens, isEnabled], () => getHomePage(tokens.access),
    { enabled: isEnabled }
  );
  const [sort, setSort] = useState("best");

  useEffect(() => {
    console.log(isEnabled)
  }, [isEnabled]);

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
