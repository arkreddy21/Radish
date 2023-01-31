import { SegmentedControl, Text, createStyles, ScrollArea, Loader, Flex } from "@mantine/core";
import { useInfiniteQuery } from "react-query";
import { useEffect, useState } from "react";
import { Loading, PostCard } from "../components";
import { useGlobalContext } from "../context";
import { getHomePage } from "../utils/RedditAPI";

const useStyles = createStyles((theme) => ({
  page: {
    overflowY: "auto",
    height: "calc(100vh - 60px)", //minus height of header
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
  },

  posts: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
}));

function HomePage() {
  const { classes } = useStyles();
  const { tokens, isEnabled } = useGlobalContext();
  //TODO: useQuery fetching even when enabled: false?
  const { isLoading, isFetchingNextPage, data, fetchNextPage } =
    useInfiniteQuery(
      ["home-page", tokens, isEnabled],
      ({ pageParam }) => getHomePage(tokens.access, pageParam),
      {
        enabled: isEnabled,
        getNextPageParam: (lastpage, pages) => {
          console.log(lastpage.data.after);
          return lastpage.data.after;
        },
      }
    );
  const [sort, setSort] = useState("best");

  useEffect(() => {
    console.log(isEnabled);
  }, [isEnabled]);

  const handleScroll = (e: any) => {
    if (
      !isLoading &&
      e.currentTarget.scrollTop + e.currentTarget.offsetHeight >=
        e.currentTarget.scrollHeight - 10
    ) {
      fetchNextPage();
      console.log("home fetching next page");
    }
  };

  if (isLoading) return <Loading/>;

  return (
    <div className={classes.page} onScroll={handleScroll}>
      {/* <div>HomePage</div>
      <SegmentedControl
        value={sort}
        onChange={setSort}
        data={[
          { label: "best", value: "best" },
          { label: "hot", value: "hot" },
          { label: "new", value: "new" },
          { label: "top", value: "top" },
        ]}
      /> */}
      <div className={classes.posts}>
        {data?.pages.map((group, i) => (
          <>
            {group.data.children.map((child: any) => {
              return <PostCard data={child.data} access={tokens.access} />;
            })}
          </>
        ))}
      </div>
      {isFetchingNextPage && <Flex mih={50} justify="center" align="center" ><Loader variant="dots" /></Flex>}
    </div>
  );
}

export default HomePage;
