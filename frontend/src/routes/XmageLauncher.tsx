import {
  Box,
  Button,
  Container,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  GetConfig,
  WriteConfig,
} from "../../wailsjs/go/services/ConfigService";
import { StartXmage } from "../../wailsjs/go/services/XMageService";
import { services } from "../../wailsjs/go/models";
import colors from "../colors";

export default function XmageLauncher() {
  const [gotConfig, setGotConfig] = useState<services.Config>();
  const [xmageInstallPath, setXmageInstallPath] = useState("");
  const [javaPath, setJavaPath] = useState("");
  const [maxMemoryGB, setMaxMemoryGB] = useState(2);
  const [minMemoryGB, setMinMemoryGB] = useState(1);

  useEffect(() => {
    const initFunc = async () => {
      GetConfig().then((newConfig) => {
        setGotConfig(newConfig);
        setXmageInstallPath(newConfig.xmage.install_path);
        setJavaPath(newConfig.xmage.java_path);
        if (newConfig.xmage.min_memory_gb > 1) {
          setMinMemoryGB(newConfig.xmage.min_memory_gb);
        }

        if (newConfig.xmage.max_memory_gb > 1) {
          setMaxMemoryGB(newConfig.xmage.max_memory_gb);
        }
      });
    };

    initFunc().catch((err) => {
      console.error(err);
    });
  }, [
    setGotConfig,
    setXmageInstallPath,
    setJavaPath,
    setMinMemoryGB,
    setMaxMemoryGB,
  ]);

  const marks = [
    {
      value: 1,
      label: "1GB",
    },
    {
      value: 4,
      label: "4GB",
    },
    {
      value: 8,
      label: "8GB",
    },
    {
      value: 16,
      label: "16GB",
    },
  ];

  function gbText(value: number) {
    return `${value}GB`;
  }

  return (
    <Container>
      <Stack direction="column" spacing={2} component={Paper} padding="1em">
        <TextField
          variant="outlined"
          label="XMage Install Path"
          value={xmageInstallPath}
          onChange={(evt) => {
            setXmageInstallPath(evt.target.value);
          }}
        />
        <TextField
          variant="outlined"
          label="Java Install Path"
          value={javaPath}
          onChange={(evt) => {
            setJavaPath(evt.target.value);
          }}
        />
        <Box>
          <Typography color="#000000">Minimum RAM:</Typography>
          <Slider
            defaultValue={2}
            step={0.5}
            min={1}
            max={16}
            value={minMemoryGB}
            onChange={(evt, newValue) => {
              if (typeof newValue === "number") {
                setMinMemoryGB(newValue);
              }
            }}
            valueLabelDisplay="auto"
            getAriaValueText={gbText}
            marks={marks}
          />
        </Box>
        <Box>
          <Typography color="#000000">Maximum RAM:</Typography>
          <Slider
            defaultValue={2}
            step={0.5}
            min={1}
            max={16}
            value={maxMemoryGB}
            onChange={(evt, newValue) => {
              if (typeof newValue === "number") {
                setMaxMemoryGB(newValue);
              }
            }}
            valueLabelDisplay="auto"
            getAriaValueText={gbText}
            marks={marks}
          />
        </Box>
        <Stack direction="row">
          <Button
            onClick={async () => {
              const freshConfig = await GetConfig().catch((err) => {
                console.log(err);
              });

              if (!freshConfig) {
                return;
              }

              freshConfig.xmage.install_path = xmageInstallPath;
              freshConfig.xmage.java_path = javaPath;
              freshConfig.xmage.min_memory_gb = minMemoryGB;
              freshConfig.xmage.max_memory_gb = maxMemoryGB;

              await WriteConfig(freshConfig).catch((err) => {
                console.log(err);
              });
            }}
          >
            Save
          </Button>
          <Button
            onClick={async () => {
              await StartXmage();
            }}
          >
            Start
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
