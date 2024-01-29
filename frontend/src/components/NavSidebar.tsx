import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import colors from "../colors";
import { CgExport } from "react-icons/cg";
import { GiMagicGate } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PixelText from "../containers/text/PixelText";

export interface NavSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavSidebarItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
  onClose: () => void;
}

function NavSidebarItem(props: NavSidebarItemProps) {
  const navigate = useNavigate();

  return (
    <ListItem key={props.text}>
      <ListItemButton
        onClick={() => {
          props.onClose();
          navigate(props.to);
        }}
      >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText>
          <PixelText>{props.text}</PixelText>
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default function NavSidebar(props: NavSidebarProps) {
  const items: NavSidebarItemProps[] = [
    {
      icon: <FaHome />,
      text: "Home",
      to: "/",
      onClose: props.onClose,
    },
    {
      icon: <CgExport />,
      text: "Moxfield",
      to: "/moxfield/export",
      onClose: props.onClose,
    },
    {
      icon: <GiMagicGate />,
      text: "Xmage",
      to: "/xmage",
      onClose: props.onClose,
    },
  ];
  return (
    <Drawer onClose={props.onClose} open={props.open} anchor={"right"}>
      <Box bgcolor={colors.yellow} height="100%">
        <h3>StaxUI</h3>
        <List>
          {items.map((item) => {
            return <NavSidebarItem {...item} />;
          })}
        </List>
      </Box>
    </Drawer>
  );
}
