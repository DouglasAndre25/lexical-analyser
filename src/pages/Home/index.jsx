import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.scss";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedTokens, setSelectedTokens] = useState([]);

  const handleDelete = (token) => {
    const newSelectedTokens = [...selectedTokens];
    newSelectedTokens.splice(newSelectedTokens.indexOf(token), 1);
    setSelectedTokens(newSelectedTokens);
  };

  const handleKeyDown = (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target.value !== ""
    ) {
      if (!selectedTokens.includes(event.target.value.toUpperCase())) {
        const newSelectedTokens = [
          ...selectedTokens,
          event.target.value.toUpperCase().trim(),
        ];
        setSelectedTokens(newSelectedTokens);
        event.target.value = "";
      }
    }
  };

  const handleSubmit = () => {
    navigate("/analyze", { state: { tokens: selectedTokens } });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      justifyContent="space-around"
    >
      <Card className="tokenCard">
        <Box padding={2}>
          <CardContent>
            <Box paddingBottom={1}>
              <Typography variant="h4">Analizador Léxico</Typography>
            </Box>

            <Divider />

            <Box paddingTop={2}>
              <Typography variant="subtitle1">
                Insira seus tokens abaixo. Após cada token digitado aperte enter
                ou espaço para confirmar.
              </Typography>
            </Box>

            <TextField
              InputProps={{
                startAdornment: selectedTokens.map((token) => (
                  <Chip
                    key={token}
                    tabIndex={-1}
                    label={token}
                    onDelete={() => handleDelete(token)}
                  />
                )),
              }}
              autoFocus
              onKeyDown={handleKeyDown}
              name="token"
              fullWidth
            />
          </CardContent>
        </Box>

        <CardActionArea>
          <Button
            variant="contained"
            disabled={selectedTokens.length === 0}
            onClick={handleSubmit}
            fullWidth
          >
            Enviar
          </Button>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default HomePage;
