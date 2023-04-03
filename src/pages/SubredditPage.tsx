import {
  Avatar,
  Card,
  createStyles,
  Group,
  Image,
  Stack,
  Text,
  Loader,
  Flex,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Loading, PostCard, PostComponent } from "../components";
import { useGlobalContext } from "../context";
import { getAboutsub, getSubPosts } from "../utils/RedditAPI";

const useStyles = createStyles((theme) => ({
  page: {
    paddingTop: theme.spacing.sm,
    overflowY: "scroll",
    height: "calc(100vh - 60px)", //minus height of header
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
  },
  card: {
    marginInline: theme.spacing.sm
  },
  posts: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
}));

function SubredditPage() {
  const { classes } = useStyles();
  const { subid } = useParams();
  const { tokens, isEnabled } = useGlobalContext();
  
  const about = useQuery(["about-sub",subid,tokens,isEnabled], () => getAboutsub(tokens.access, subid), {
    enabled: subid !== "popular" && subid !== "all",
  });
  const posts = useInfiniteQuery(
    ["sub-posts", subid, tokens, isEnabled],
    ({ pageParam }) => getSubPosts(tokens.access, subid, pageParam),
    {
      enabled: isEnabled,
      getNextPageParam: (lastpage, pages) => {
        console.log(lastpage.data.after);
        return lastpage.data.after;
      },
    }
  );

  const handleScroll = (e: any) => {
    if (
      !posts.isLoading &&
      e.currentTarget.scrollTop + e.currentTarget.offsetHeight >=
        e.currentTarget.scrollHeight - 10
    ) {
      posts.fetchNextPage();
      console.log("sub fetching next page");
    }
  };

  const [showPeek, setShowPeek] = useState(false);
  const matches = useMediaQuery('(min-width: 75em)');
  const [postProps, setPostProps] = useState({subid:'', id:'', name:''})
  useEffect(()=>{
    postProps.id!=='' && setShowPeek(true)
  },[postProps])
  const handleSidePeek = (subid:string, id:string, name:string) => {
    postProps.id === id ? (setShowPeek(false),setPostProps({subid:'', id:'', name:''})) : setPostProps({subid, id, name})
  }

  if (about.isLoading || posts.isLoading) return <Loading/>;

  return (
    <Group grow>
    <div className={classes.page} onScroll={handleScroll}>
      {subid !== "popular" && subid !== "all" && (
        <Card className={classes.card} >
          <Card.Section>
            <Image
              src={about.data?.data.banner_background_image.split("?")[0]}
              height={160}
            />
          </Card.Section>
          <Group>
            <Avatar
              src={about.data?.data.community_icon.split("?")[0]}
              radius="xl"
            />
            <Stack spacing={0}>
              <Text color="dimmed">{`r/${subid}`}</Text>
              <Text weight="700">{about.data?.data.title}</Text>
            </Stack>
          </Group>
          <Text>{`${about.data?.data.subscribers} members`}</Text>
          <Text>{about.data?.data.public_description}</Text>
        </Card>
      )}

      <div className={classes.posts}>
        {posts.data?.pages.map((group, i) => (
          <>
            {group.data.children.map((child: any) => {
              return <PostCard data={child.data} access={tokens.access} handleSidePeek={handleSidePeek} />;
            })}
          </>
        ))}
      </div>
      {posts.isFetchingNextPage && <Flex mih={50} justify="center" align="center" ><Loader variant="dots" /></Flex>}
    </div>
    { showPeek && matches && <PostComponent subid={postProps.subid} id={postProps.id} name={postProps.name} />}
    </Group>
  );
}

export default SubredditPage;
