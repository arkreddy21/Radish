import { Avatar, Card, Group, Image, Stack, Text } from "@mantine/core";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context";
import { getAboutsub } from "../utils/RedditAPI";

function SubredditPage() {
  const { subid } = useParams();
  const { tokens } = useGlobalContext();
  const { isLoading, data } = useQuery(
    "about-sub",
    async () => await getAboutsub(tokens.access, subid)
  );

  if (isLoading) return <h3>Loading</h3>;

  return (
    <>
      <Card>
        <Card.Section>
          <Image
            src={data?.data.banner_background_image.split("?")[0]}
            height={160}
          />
        </Card.Section>
        <Group>
          <Avatar src={data?.data.community_icon.split("?")[0]} radius="xl" />
          <Stack spacing={0} >
            <Text color="dimmed" >{`r/${subid}`}</Text>
            <Text weight="700" >{data?.data.title}</Text>
          </Stack>
        </Group>
        <Text>{`${data?.data.subscribers} members`}</Text>
        <Text>{data?.data.public_description}</Text>
      </Card>
    </>
  );
}

export default SubredditPage;
