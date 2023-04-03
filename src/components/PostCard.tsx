import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Avatar,
  Group,
  Text,
  Anchor,
  createStyles,
  Badge,
  Image,
  TypographyStylesProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import {
  ArrowFatUp,
  ArrowFatDown,
  Star,
  ChatText,
  DotsThreeVertical,
} from "phosphor-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { castVote } from "../utils/RedditAPI";

interface CardProps {
  data: any;
  access: string;
  handleSidePeek: (subid:string, id:string, name:string )=>void;
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
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    "& > .chevronright": {
      marginLeft: 'auto'
    }
  },
  media: {
    width: "90%",
    paddingBlock: 18
  },
}));

function PostCard({ data, access, handleSidePeek }: CardProps) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  let linkArr = data.permalink.split("/")
  const matches = useMediaQuery('(min-width: 75em)');

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
        dir === 1 ? (data.score += 2) : (data.score -= 2);
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.title} >
        <Avatar radius="xl" />
        <Anchor
          onClick={() => {
            navigate(`/r/${data.subreddit}`);
          }}
        >
          {data.subreddit}
        </Anchor>
        <Text>{data.author}</Text>
        {matches && <IconChevronRight className="chevronright" onClick={()=>handleSidePeek(linkArr[2], linkArr[4], linkArr[5])} />}
      </div>

      <section onClick={() => navigate(`${data.permalink}`)}>
        <Group position="apart">
          <Text sx={{cursor: 'pointer'}} weight={700}>{data?.title}</Text>
          {/* TODO: post_hint="link" not always present in data */}
          {(data.post_hint === "link" ||
            (!data.is_self && data.post_hint !== "image" && !data.is_video && !data.is_gallery)) && (
            <Image
              src={data.thumbnail}
              radius="md"
              width={64}
              height={64}
              withPlaceholder
              onClick={(e) => {e.stopPropagation();window.open(data.url, "_blank")}}
            />
          )}
        </Group>

        {data?.link_flair_richtext && data?.link_flair_richtext[0] && (
          <Badge>{data?.link_flair_richtext[0].t}</Badge>
        )}
        {data.spoiler && <Badge variant="outline">spoiler</Badge>}

        <Text sx={{cursor: 'pointer'}} lineClamp={5}>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: data.selftext_html }} />
          </TypographyStylesProvider>
        </Text>
      </section>
      {data.post_hint === "image" && (
        <Image className={classes.media} withPlaceholder src={data.url} />
      )}
      {data.is_video && (
        <ReactPlayer
          width={"fill"}
          controls
          url={`${data.media.reddit_video.fallback_url}`}
        />
      )}
      {data.is_gallery && (
        <Carousel  mx="auto" withIndicators height={200}>
          {Object.entries(data.media_metadata).map(([key, item]: any) => {
            // let imgurl = `https://i.redd.it/${item.s.u.split(/[/?]/)[3]}`;
            let imgurl=`https://i.redd.it/${item.media_id}.jpg`
            //TODO error with item.s.u but item.media_id may not always be jpg
            return (
              <Carousel.Slide>
                <Image withPlaceholder src={imgurl} />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}

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
