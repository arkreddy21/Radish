import {
  createStyles,
  Text,
  Avatar,
  Group,
  TypographyStylesProvider,
  Paper,
  Divider,
  Button,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    marginBottom: `${theme.spacing.xs}px`,
    borderRadius:0,
    borderLeft: `2px solid ${theme.colors.blue[3]}`,
    "& .comment": {
      paddingRight:0,
      // border:`none`,
    },
  },

  body: {
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

interface CommentHtmlProps {
  postedAt: string;
  body: string;
  author: string;
  replies?: any;
}

function Comment({ postedAt, body, author, replies }: CommentHtmlProps) {
  const { classes } = useStyles();
  return (
    <Paper className={`${classes.comment} comment`}>
      <Group>
        {/* <Avatar size="sm" radius="xl" /> */}
        <Text c="blue.4" fz="xs">{author}</Text>
        {/* <Text size="xs" color="dimmed">
          {new Date(postedAt).toLocaleTimeString()}
        </Text> */}
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </TypographyStylesProvider>
      {replies && replies.length!==0 && (
        <Paper>
          {replies.map((child: any) => {
            return child.kind === "more" ? (
              <Button variant="subtle" compact >load more</Button>
            ) : (
              <Comment
                postedAt={child.data.created_utc}
                author={child.data.author}
                body={child.data.body_html}
                replies={child.data.replies?.data?.children}
              />
            );
          })}
        </Paper>
      )}
    </Paper>
  );
}
export default Comment;
