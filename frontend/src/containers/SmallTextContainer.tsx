import { Box } from "@mui/material";
import StaxBox from "./StaxBox";

export interface SmallTextContainerProps {
  children: React.ReactNode;
}

export default function SmallTextContainer(props: SmallTextContainerProps) {
  return (
    <StaxBox borderRadius="1em" padding="0.5em" bgcolor="#f5f5f5">
      {props.children}
    </StaxBox>
  );
}
