import {
  createStyles,
  Navbar,
  UnstyledButton,
  Text,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconPlus,
  IconSelector,
  IconHome2,
  IconTrendingUp,
  IconChartBar,
} from "@tabler/icons";
import { UserButton } from "./internal/UserButton";
import { getSubs } from "../utils/RedditAPI";
import { useGlobalContext } from "../context";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  mainLinks: {
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: 20,
    height: 20,
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    img: {
      height: 24,
    },

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const links = [
  { icon: IconHome2, label: "Home", path:"/" },
  { icon: IconTrendingUp, label: "Popular", path:"/r/popular" },
  { icon: IconChartBar, label: "All", path:"/r/all" },
];

const scratch =
  "https://b.thumbs.redditmedia.com/fMiXMpPkcTf7EWdUY897S7bKeqPMh5lkVOoocfkGV1w.png";
const collections = [
  { icon: scratch, label: "Sales" },
  { icon: scratch, label: "Deliveries" },
  { icon: scratch, label: "Discounts" },
  { icon: scratch, label: "Profits" },
  { icon: scratch, label: "Reports" },
  { icon: scratch, label: "Orders" },
  { icon: scratch, label: "Events" },
  { icon: scratch, label: "Debts" },
  { icon: scratch, label: "Customers" },
];

function SideBar() {
  const { classes } = useStyles();
  const { tokens, isEnabled } = useGlobalContext();
  const navigate = useNavigate();
  //TODO: implement subs correctly
  /* const { isLoading, data } = useQuery("subs", () => getSubs(tokens.access), {
    enabled: isEnabled && tokens.access!=='',
    initialData: collections,
    placeholderData: collections,
    onSuccess: ()=>{console.log('this shit happened')}
  }); */

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink} onClick={()=>{navigate(`${link.path}`)}} >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection:any) => (
    <a
      href="/"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionLink}
    >
      <span style={{ marginRight: 9, fontSize: 16 }}>
        <img src={collection.icon} />
      </span>{" "}
      {collection.label}
    </a>
  ));

  return (
    <Navbar height={700} width={{ sm: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        <UserButton />
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Subscriptions
          </Text>
          <Tooltip label="add subreddit" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </Navbar.Section>
    </Navbar>
  );
}

export default SideBar;
