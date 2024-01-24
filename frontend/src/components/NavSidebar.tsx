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
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export interface NavSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function NavSidebar(props: NavSidebarProps) {
  const navigate = useNavigate();
  return (
    <Drawer onClose={props.onClose} open={props.open} anchor={"right"}>
      <Box bgcolor={colors.yellow} height="100%">
        <h3>StaxUI</h3>
        <List>
          <ListItem key="home">
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <FaHome />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem key="moxfield_export">
            <ListItemButton
              onClick={() => {
                navigate("/moxfield/export");
              }}
            >
              <ListItemIcon>
                <CgExport />
              </ListItemIcon>
              <ListItemText primary="Moxfield" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
