import { useState } from "react";
import { Greet } from "../../wailsjs/go/main/App";
import { Stack } from "@mui/material";

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

  return (
    <Stack spacing={2}>
      <h1>Stax UI</h1>
    </Stack>
  );
}

export default Home;
