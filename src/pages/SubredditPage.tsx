import { Avatar, Card, Group, Image, Stack, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { PostCard } from "../components";
import { useGlobalContext } from "../context";
import { getAboutsub, getSubPosts } from "../utils/RedditAPI";

function SubredditPage() {
  const { subid } = useParams();
  const { tokens } = useGlobalContext();
  const about = useQuery("about-sub", () => getAboutsub(tokens.access, subid));
  const posts = useQuery("sub-posts", () => getSubPosts(tokens.access, subid));

  if (about.isLoading||posts.isLoading) return <h3>Loading</h3>;

  return (
    <>
      <Card>
        <Card.Section>
          <Image
            src={about.data?.data.banner_background_image.split("?")[0]}
            height={160}
          />
        </Card.Section>
        <Group>
          <Avatar src={about.data?.data.community_icon.split("?")[0]} radius="xl" />
          <Stack spacing={0} >
            <Text color="dimmed" >{`r/${subid}`}</Text>
            <Text weight="700" >{about.data?.data.title}</Text>
          </Stack>
        </Group>
        <Text>{`${about.data?.data.subscribers} members`}</Text>
        <Text>{about.data?.data.public_description}</Text>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {posts.data?.data.children.map((child: any) => {
          return <PostCard data={child.data} access = {tokens.access} />;
        })}
      </div>
    </>
  );
}

export default SubredditPage;
