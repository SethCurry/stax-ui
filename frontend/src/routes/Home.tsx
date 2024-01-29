import { useState } from "react";
import { Greet } from "../../wailsjs/go/main/App";
import { Stack } from "@mui/material";
import PixelText from "../containers/text/PixelText";

function Home() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return <Stack spacing={2}></Stack>;
}

export default Home;
