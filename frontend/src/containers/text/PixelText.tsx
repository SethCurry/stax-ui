import React from "react";

export interface TitleProps {
  children: React.ReactNode;
  style?: React.HTMLAttributes<HTMLSpanElement> | React.CSSProperties;
  size?: string;
}

export default function PixelText(props: TitleProps) {
  const newStyle = {
    fontFamily: "DotGothic16",
    fontSize: props.size || "1em",
    ...props.style,
  };
  return <span style={newStyle}>{props.children}</span>;
}
