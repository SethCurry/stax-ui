import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import NavSidebar from "../components/NavSidebar";

export interface DefaultContainerProps {
  children: React.ReactNode;
}
export function DefaultContainer(props: DefaultContainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box width="100vw" height="100vh">
      {props.children}
      <IconButton
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => setOpen(true)}
      >
        <HiMenu />
      </IconButton>
      <NavSidebar
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}