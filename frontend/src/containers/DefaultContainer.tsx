import { Container, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import NavSidebar from "../components/NavSidebar";
import StaxBox from "./StaxBox";
import PixelText from "./text/PixelText";

export interface DefaultContainerProps {
  title: string;
  children: React.ReactNode;
}
export function DefaultContainer(props: DefaultContainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <StaxBox width="100vw" height="100vh">
      <Stack direction="column">
        <Container>
          <PixelText size="2em">{props.title}</PixelText>
        </Container>
        {props.children}
      </Stack>
      <IconButton
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => setOpen(true)}
      >
        <HiMenu color="white" />
      </IconButton>
      <NavSidebar
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </StaxBox>
  );
}
