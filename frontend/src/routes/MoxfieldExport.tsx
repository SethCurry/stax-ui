import { Box, Button, Container, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import {
  GetConfig,
  WriteConfig,
} from "../../wailsjs/go/services/ConfigService";
import { ExportDecksToXMage } from "../../wailsjs/go/services/MoxfieldService";
import { services } from "../../wailsjs/go/models";
import StaxBox from "../containers/StaxBox";
import SmallTextContainer from "../containers/SmallTextContainer";

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
      Moxfield Export
      <Stack direction="column" spacing={2}>
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
        <Button
          onClick={() => {
            setExportConfigs([{ username: "", path: "" }, ...exportConfigs]);
          }}
        >
          New
        </Button>
        <Button
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
    </Container>
  );
}
