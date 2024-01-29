import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import {
  GetConfig,
  WriteConfig,
} from "../../wailsjs/go/services/ConfigService";
import { ExportDecksToXMage } from "../../wailsjs/go/services/MoxfieldService";
import { services } from "../../wailsjs/go/models";
import StaxBox from "../containers/StaxBox";
import SmallTextContainer from "../containers/SmallTextContainer";
import { FaFileExport, FaPlus, FaSave } from "react-icons/fa";

interface ExportConfigProps {
  username: string;
  path: string;
  onUsernameChange: (username: string) => void;
  onPathChange: (path: string) => void;
}

function ExportConfig(props: ExportConfigProps) {
  const [moxfieldUsername, setMoxfieldUsername] = useState(props.username);
  const [exportPath, setExportPath] = useState(props.path);

  return (
    <SmallTextContainer>
      <TextField
        variant="outlined"
        label="Moxfield Username"
        value={moxfieldUsername}
        onChange={(evt) => {
          setMoxfieldUsername(evt.target.value);
          props.onUsernameChange(evt.target.value);
        }}
      />
      <TextField
        variant="outlined"
        label="Export Directory"
        value={exportPath}
        onChange={(evt) => {
          setExportPath(evt.target.value);
          props.onPathChange(evt.target.value);
        }}
      />
    </SmallTextContainer>
  );
}

export default function MoxfieldExport() {
  const [exportConfigs, setExportConfigs] = useState<
    services.MoxfieldExportConfig[]
  >([]);

  useEffect(() => {
    const initFunc = async () => {
      GetConfig().then((newConfig) => {
        setExportConfigs(newConfig.moxfield_exports);
      });
    };
    initFunc().catch((err) => {
      console.error(err);
    });
  }, [setExportConfigs]);
  return (
    <Container>
      <Stack
        direction="column"
        spacing={2}
        component={Paper}
        marginBottom="2em"
        padding="1em"
      >
        {exportConfigs.map((exportConfig, index) => {
          return (
            <ExportConfig
              username={exportConfig.username}
              path={exportConfig.path}
              onPathChange={(newPath) => {
                setExportConfigs([
                  ...exportConfigs.slice(0, index),
                  {
                    ...exportConfig,
                    path: newPath,
                  },
                  ...exportConfigs.slice(index + 1),
                ]);
              }}
              onUsernameChange={(newUsername) => {
                setExportConfigs([
                  ...exportConfigs.slice(0, index),
                  {
                    ...exportConfig,
                    username: newUsername,
                  },
                  ...exportConfigs.slice(index + 1),
                ]);
              }}
            />
          );
        })}
        <Stack direction="row" spacing={2} marginBottom="1em">
          <Button
            variant="contained"
            onClick={() => {
              setExportConfigs([{ username: "", path: "" }, ...exportConfigs]);
            }}
            startIcon={<FaPlus />}
          >
            New
          </Button>
          <Button
            startIcon={<FaSave />}
            variant="contained"
            onClick={async () => {
              const gotConfig = await GetConfig().catch((err) => {
                console.log(err);
              });

              if (!gotConfig) {
                return;
              }

              gotConfig.moxfield_exports = exportConfigs;
              await WriteConfig(gotConfig).catch((err) => {
                console.log(err);
              });
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            startIcon={<FaFileExport />}
            onClick={async () => {
              exportConfigs.forEach(async (exportConfig) => {
                await ExportDecksToXMage(
                  exportConfig.username,
                  exportConfig.path
                );
              });
            }}
          >
            Export
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
