import { Box, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import createAnalyzerStructure from "../../services/analyzer";
import TableContent from "./TableContent";

const AnalyzePage = () => {
  const {
    state: { tokens },
  } = useLocation();

  const [rules, setRules] = useState([]);

  useEffect(() => {
    // chama a função responsável por fazer a estrutura de regras dos tokens
    const finalRules = createAnalyzerStructure({ tokens });
    setRules(finalRules);
  }, [tokens]);

  return (
    <Box display="flex" alignItems="center" width="100%" flexDirection="column">
      <Box paddingBottom={4}>
        <Card>
          <Box padding={2}>
            <Typography variant="h5">Tokens inseridos: </Typography>
            <Typography>{tokens.join(", ")}</Typography>
          </Box>
        </Card>
      </Box>

      <TableContent rules={rules} />
    </Box>
  );
};

export default AnalyzePage;
