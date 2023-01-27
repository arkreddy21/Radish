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
  Button,
  Image,
  TypographyStylesProvider,
  Modal,
} from "@mantine/core";
import {
  ArrowFatUp,
  ArrowFatDown,
  Star,
  ChatText,
  DotsThreeVertical,
  ChatDots,
} from "phosphor-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comment } from "./";
import { Carousel } from "@mantine/carousel";
import { openModal, closeAllModals } from "@mantine/modals";
import ReactPlayer from "react-player";
import TextEditor from "./internal/TextEditor";

interface PostProps {
  subid: string | undefined;
  id: string | undefined;
  name: string | undefined;
}

const useStyles = createStyles((theme, _params) => ({
  page: {
    overflowY: "auto",
    height: "calc(100vh - 60px)", //minus height of header
  },

  wrapper: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
    maxWidth: 600,
    width: "100%",
    height: "auto",
    padding: 20,
    marginBlock: theme.spacing.sm,
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
    width: "90%",
    paddingBlock: 18
  },
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
    <div className={classes.page}>
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
        <Group position="apart">
          <Text weight={700}>{data?.title}</Text>
          {(data.post_hint === "link" ||
            (!data.is_self && data.post_hint !== "image" && !data.is_video && !data.is_gallery)) && (
            <Image
              src={data.thumbnail}
              radius="md"
              width={64}
              height={64}
              withPlaceholder
              onClick={() => window.open(data.url, "_blank")}
            />
          )}
        </Group>
        {data?.link_flair_richtext && data?.link_flair_richtext[0] && (
          <Badge>{data?.link_flair_richtext[0].t}</Badge>
        )}
        {data.spoiler && <Badge variant="outline">spoiler</Badge>}

        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: data?.selftext_html }} />
        </TypographyStylesProvider>
        {data.post_hint === "image" && (
          <Image className={classes.media} withPlaceholder src={data.url} />
        )}
        {/*TODO {data.post_hint === "link" && (data.url, data.thumbnail)} */}
        {data.is_video && (
          <ReactPlayer
            width={"fill"}
            controls
            url={`${data.media.reddit_video.fallback_url}`}
          />
        )}
        {data.is_gallery && (
          <Carousel
            mx="auto"
            withIndicators
            height={200}
          >
            {Object.entries(data.media_metadata).map(([key,item]:any)=>{
              let imgurl=`https://i.redd.it/${item.s.u.split(/[/?]/)[3]}`
              return <Carousel.Slide><Image withPlaceholder src={imgurl}/></Carousel.Slide>
            })}
          </Carousel>
        )}

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

      <div className={classes.comments}>
        <Group className="heading">
          <Text>Comments</Text>
          <Button variant="subtle" leftIcon={<ChatDots size={18} />}
            onClick={() =>
              openModal({
                title: "Comment",
                children: (
                  <>
                    <TypographyStylesProvider>
                      <div dangerouslySetInnerHTML={{ __html: data?.selftext_html }} />
                    </TypographyStylesProvider>
                    <TextEditor thing_id={data.name} />
                  </>
                ),
              })
            }
          >
            reply
          </Button>
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
    </div>
  );
}
export default PostComponent;
