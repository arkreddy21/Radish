import { ActionIcon, Avatar, Group, Text, createStyles, Badge, Card } from "@mantine/core"
import {IconArrowBigDown, IconArrowBigTop, IconDots, IconMessage, IconStar} from '@tabler/icons'
import ReactMarkdown from "react-markdown";
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeRaw from "rehype-raw";

interface PostProps {
  data:any
}

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    maxWidth: 400,
    width: '100%',
    height: 'auto',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: theme.radius.sm,
  }
}))

function PostCard({data}:PostProps) {
  const { classes } = useStyles();
  const title= data.title
  const body= data.selftext
  const user= data.author
  const sub= data.subreddit
  const flair= data.link_flair_richtext

  return (
    <div className={classes.wrapper}>
      <Group>
        <Avatar radius='xl'/>
        <Text>{sub}</Text>
        <Text>{user}</Text>
      </Group>
      <Text weight={700} lineClamp={2}>{title}</Text>
      {flair&&flair[0]&&<Badge>{flair[0].t}</Badge>}
      {/* <Text lineClamp={4}>{body}</Text> */}
      <ReactMarkdown children={body} rehypePlugins={[rehypeRaw]} />
      
      <Group>
      <ActionIcon variant="filled"><IconArrowBigTop size={16} /></ActionIcon>
      <Text>{data.score}</Text>
      <ActionIcon variant="transparent"><IconArrowBigDown size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconMessage size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconStar size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconDots size={16} /></ActionIcon>
      </Group>
    </div>
  )
}

export default PostCard