import {
  ActionIcon,
  Avatar,
  Group,
  Text,
  createStyles,
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
import { useNavigate } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import { castVote } from "../utils/RedditAPI";

interface CardProps {
  data: any;
  access: string;
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

function PostCard({ data, access }: CardProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const flair = data.link_flair_richtext;
  const formatter = new Intl.NumberFormat('en',{notation:'compact'})
  
  const [vote, setVote] = useState(data.likes); //reddit api: likes = (true, null, false) for (up, no, down)votes

  const handleClick = (dir: number) => {
    if (vote === null) {
      castVote(access, data.name, dir).then((res) => {
        res === 200 && setVote(dir === 1 ? true : false);
        data.score += dir;
      });
    } else if ((vote === true && dir === 1) || (vote === false && dir === -1)) {
      castVote(access, data.name, 0).then((res) => {
        res === 200 && setVote(null);
        data.score -= dir;
      });
    } else {
      castVote(access, data.name, dir).then((res) => {
        res === 200 && setVote(dir === 1 ? true : false);
        dir === 1 ? data.score += 2 : data.score -= 2;
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Group>
        <Avatar radius="xl" />
        <Text variant="link" onClick={()=>{navigate(`/r/${data.subreddit}`)}} >{data.subreddit}</Text>
        <Text >{data.author}</Text>
      </Group>
      <section onClick={()=>navigate(`${data.permalink}`)} >
      <Text weight={700} lineClamp={2}>
        {data.title}
      </Text>
      {flair && flair[0] && <Badge>{flair[0].t}</Badge>}
      {/* <Text lineClamp={4}>{body}</Text> */}
      <ReactMarkdown
        children={data.selftext.slice(0, 180)}
        rehypePlugins={[rehypeRaw]}
      />
      </section>

      <Group>
        <ActionIcon variant="transparent" onClick={() => handleClick(1)}>
          <ArrowFatUp size={18} weight={vote === true ? "fill" : "regular"} />
        </ActionIcon>
        <Text>{formatter.format(data.score)}</Text>
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
          <Star size={18} weight={data.saved ? "fill" : "regular"} />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <DotsThreeVertical size={18} weight="bold" />
        </ActionIcon>
      </Group>
    </div>
  );
}

export default PostCard;
