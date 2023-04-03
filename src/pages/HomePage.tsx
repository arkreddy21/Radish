import { SegmentedControl, Text, createStyles, ScrollArea, Loader, Flex,Group } from "@mantine/core";
import { useInfiniteQuery } from "react-query";
import { useEffect, useState } from "react";
import { Loading, PostCard, PostComponent } from "../components";
import { useGlobalContext } from "../context";
import { getHomePage } from "../utils/RedditAPI";
import { useMediaQuery } from "@mantine/hooks";

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
    paddingTop: theme.spacing.sm,
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
  const matches = useMediaQuery('(min-width: 75em)');
  const [showPeek, setShowPeek] = useState(false);
  const [postProps, setPostProps] = useState({subid:'', id:'', name:''})

  useEffect(() => {
    console.log(isEnabled);
  }, [isEnabled]);
  
  useEffect(()=>{
    postProps.id!=='' && setShowPeek(true)
  },[postProps])

  const handleSidePeek = (subid:string, id:string, name:string) => {
    postProps.id === id ? (setShowPeek(false),setPostProps({subid:'', id:'', name:''})) : setPostProps({subid, id, name})
  }

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
    <Group grow >
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
              return <PostCard data={child.data} access={tokens.access} handleSidePeek={handleSidePeek} />;
            })}
          </>
        ))}
      </div>
      {isFetchingNextPage && <Flex mih={50} justify="center" align="center" ><Loader variant="dots" /></Flex>}
    </div>
    { showPeek && matches && <PostComponent subid={postProps.subid} id={postProps.id} name={postProps.name} />}
    </Group>
  );
}

export default HomePage;
