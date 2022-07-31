import { ActionIcon, Avatar, Group, Text, createStyles } from "@mantine/core"
import {IconArrowBigDown, IconArrowBigTop, IconDots, IconMessage, IconStar} from '@tabler/icons'

interface PostProps {
  title: String,
  body: any,
  user:String,
  sub:String
}

const useStyles = createStyles((theme, _params, getRef) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    maxWidth: 400,
    width: '100%',
    height: 180,
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: theme.radius.sm,
  }
}))

function PostCard({title,body,user,sub}:PostProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Group>
        <Avatar radius='xl'/>
        <Text>{sub}</Text>
        <Text>{user}</Text>
      </Group>
      <Text>{title}</Text>
      <Text>{body}</Text>
      <Group>
      <ActionIcon variant="filled"><IconArrowBigTop size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconArrowBigDown size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconMessage size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconStar size={16} /></ActionIcon>
      <ActionIcon variant="transparent"><IconDots size={16} /></ActionIcon>
      </Group>
    </div>
  )
}
export default PostCard