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
  Space,
  Image,
  TypographyStylesProvider
} from "@mantine/core";
import {
  ArrowFatUp,
  ArrowFatDown,
  Star,
  ChatText,
  DotsThreeVertical,
} from "phosphor-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comment } from "./";
import { Carousel } from "@mantine/carousel";
import ReactPlayer from "react-player";

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
    maxWidth: 600,
    width: "100%",
    height: "auto",
    padding: 20,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
  },
  comments: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    maxWidth: 600,
    width: "100%",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
    "& .heading": {
      padding: 8,
    },
  },
  media: {
    width:'90%',
  }
}));

function PostComponent({ subid, id, name }: PostProps) {
  const { classes } = useStyles();
  const { tokens } = useGlobalContext();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });

  const [data, setData]: any = useState();
  const [commentData, setCommentData]: any = useState();
  const postData = useQuery(
    "comments",
    () => getComments(tokens.access, subid, id, name),
    {
      onSuccess: (Tdata) => {
        setData(Tdata[0].data.children[0].data);
        setCommentData(Tdata[1].data.children);
      },
    }
  );

  //TODO: handle derived state
  const [vote, setVote] = useState(data?.likes); //reddit api: likes = (true, null, false) for (up, no, down)votes

  const handleVote = (dir: number) => {
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

  if (postData.isLoading || !data) return <Text>Loading</Text>;

  return (
    <>
      <div className={classes.wrapper}>
        <Group>
          <Avatar radius="xl" />
          <Text
            variant="link"
            onClick={() => {
              navigate(`/r/${data.subreddit}`);
            }}
          >
            {data?.subreddit}
          </Text>
          <Text>{data?.author}</Text>
        </Group>
        <Text weight={700}>{data?.title}</Text>
        {data?.link_flair_richtext && data?.link_flair_richtext[0] && (
          <Badge>{data?.link_flair_richtext[0].t}</Badge>
        )}
        {data.spoiler && <Badge variant="outline" >spoiler</Badge>}
        
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: data?.selftext_html }} />
        </TypographyStylesProvider>
        {data.post_hint==="image" && <Image className={classes.media} withPlaceholder src={data.url}/>}
        {data.is_video && <ReactPlayer width={'fill'} controls url={`${data.media.reddit_video.fallback_url}`} />}
        {data.is_gallery && <Carousel sx={{ maxWidth: 320 }} mx="auto" withIndicators height={200}>
          {data.gallery_data.items.map((item:any)=>(
            //TODO: select url based on jpg or png image
            <Carousel.Slide><Image withPlaceholder src={`https://i.redd.it/${item.media_id}.jpg`}/></Carousel.Slide>
          ))}
        </Carousel>}

        <Group>
          <ActionIcon variant="transparent" onClick={() => handleVote(1)}>
            <ArrowFatUp size={18} weight={vote === true ? "fill" : "regular"} />
          </ActionIcon>
          <Text>{formatter.format(data?.score)}</Text>
          <ActionIcon variant="transparent" onClick={() => handleVote(-1)}>
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
      <Space h="xs" />
      <div className={classes.comments}>
        <Group className="heading">
          <Text>Comments</Text>
        </Group>
        {commentData.map((child: any) => {
          return (
            <Comment
              postedAt={child.data.created_utc}
              author={child.data.author}
              body={child.data.body_html}
              replies={child.data.replies?.data?.children}
            />
          );
        })}
      </div>
    </>
  );
}
export default PostComponent;
