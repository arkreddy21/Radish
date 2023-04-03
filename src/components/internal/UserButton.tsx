import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
  Accordion,
  Button,
} from "@mantine/core";
import { IconChevronRight, IconSelector } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
  control: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    }
  }
}));

export function UserButton() {
  const { classes } = useStyles();
  const { userdata } = useGlobalContext();
  const navigate = useNavigate();

  //TODO: refresh page
  const handleLogout=()=>{
    localStorage.clear()
    navigate('/')
  }

  return (
    <Accordion chevron={<IconSelector size={14} stroke={1.5} />} >
      <Accordion.Item value="user">
        <Accordion.Control className={classes.control} >
          <UnstyledButton className={classes.user}>
            <Group>
              <Avatar src={userdata?.snoovatar_img} radius="xl" />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {userdata?.name}
                </Text>
                <Text color="dimmed" size="xs">
                  {`${userdata?.total_karma} karma`}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        </Accordion.Control>

        <Accordion.Panel>
          <Button variant="subtle" >Profile</Button>
          <Button variant="subtle" onClick={handleLogout} >Logout</Button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
