import { useQuery } from "react-query";
import { useGlobalContext } from "../context";
import { castVote, getComments } from "../utils/RedditAPI";
import {
  createStyles,
  Text,
  Group,
  Avatar,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  ArrowFatUp,
  ArrowFatDown,
  Star,
  ChatText,
  DotsThreeVertical,
} from "phosphor-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router-dom";

interface PostProps {
  subid: string | undefined;
  id: string | undefined;
  name: string | undefined;
}

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    maxWidth: 400,
    width: "100%",
    height: "auto",
    padding: 20,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
  },
}));

function PostComponent({ subid, id, name }: PostProps) {
  const { classes } = useStyles();
  const { tokens } = useGlobalContext();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('en',{notation:'compact'})

  const postData = useQuery("comments", () =>
    getComments(tokens.access, subid, id, name),
    {onSuccess: (Tdata)=>{setData(Tdata[0].data.children[0].data)}}
  );
  const [data, setData]:any = useState();

  //TODO: handle derived state
  const [vote, setVote] = useState(data?.likes); //reddit api: likes = (true, null, false) for (up, no, down)votes

  const handleClick = (dir: number) => {
    if (vote === null) {
      castVote(tokens.access, data.name, dir).then((res) => {
        res === 200 && setVote(dir === 1 ? true : false);
        data.score += dir;
      });
    } else if ((vote === true && dir === 1) || (vote === false && dir === -1)) {
      castVote(tokens.access, data.name, 0).then((res) => {
        res === 200 && setVote(null);
        data.score -= dir;
      });
    } else {
      castVote(tokens.access, data.name, dir).then((res) => {
        res === 200 && setVote(dir === 1 ? true : false);
        dir === 1 ? (data.score += 2) : (data.score -= 2);
      });
    }
  };

  if (postData.isLoading||!data) return <Text>Loading</Text>;

    return (
      <>
        <div className={classes.wrapper}>
          <Group>
            <Avatar radius="xl" />
            <Text variant="link" onClick={()=>{navigate(`/r/${data.subreddit}`)}} >{data?.subreddit}</Text>
            <Text>{data?.author}</Text>
          </Group>
          <Text weight={700} lineClamp={2}>
            {data?.title}
          </Text>
          {data?.link_flair_richtext && data?.link_flair_richtext[0] && (
            <Badge>{data?.link_flair_richtext[0].t}</Badge>
          )}
          {/* <Text lineClamp={4}>{body}</Text> */}
          <ReactMarkdown children={data?.selftext} rehypePlugins={[rehypeRaw]} />

          <Group>
            <ActionIcon variant="transparent" onClick={() => handleClick(1)}>
              <ArrowFatUp
                size={18}
                weight={vote === true ? "fill" : "regular"}
              />
            </ActionIcon>
            <Text>{formatter.format(data?.score)}</Text>
            <ActionIcon variant="transparent" onClick={() => handleClick(-1)}>
              <ArrowFatDown
                size={18}
                weight={vote === false ? "fill" : "regular"}
              />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <ChatText size={18} />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <Star size={18} weight={data?.saved ? "fill" : "regular"} />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <DotsThreeVertical size={18} weight="bold" />
            </ActionIcon>
          </Group>
        </div>
      </>
    );
}
export default PostComponent;
