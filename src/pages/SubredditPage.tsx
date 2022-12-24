import {
  Avatar,
  Card,
  createStyles,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { PostCard } from "../components";
import { useGlobalContext } from "../context";
import { getAboutsub, getSubPosts } from "../utils/RedditAPI";

const useStyles = createStyles((theme) => ({
  page: {
    overflowY: "scroll",
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

  if (about.isLoading || posts.isLoading) return <h3>Loading</h3>;

  return (
    <div className={classes.page} onScroll={handleScroll}>
      {subid !== "popular" && subid !== "all" && (
        <Card>
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
              return <PostCard data={child.data} access={tokens.access} />;
            })}
          </>
        ))}
      </div>
      <Text>{posts.isFetchingNextPage ? "Loading more..." : ""}</Text>
    </div>
  );
}

export default SubredditPage;
