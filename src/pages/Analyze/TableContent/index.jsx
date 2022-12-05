import {
  Box,
  Card,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

import "./styles.scss";

const TableContent = ({ rules }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // valor do search
  const [searchValue, setSearchValue] = useState("");
  // array de q's em que a palavra digitada vai percorrendo
  const [currentState, setCurrentState] = useState(["q0"]);
  // status final da procura pelo token. Possíveis status: 'success' e 'error'
  const [finalStatus, setFinalStatus] = useState("");

  const handleChange = (value) => {
    // verifica se tem o estado inicial,
    // se tem valor inputado
    // e se não é evento de "backspace"
    if (
      currentState.length > 0 &&
      value.length > 0 &&
      searchValue.length < value.length
    ) {
      // pega o index da letra no alfabeto
      setSearchValue(value);
      const letterIndex = alphabet.findIndex(
        (letter) => letter === value.charAt(value.length - 1)
      );

      if (letterIndex >= 0) {
        // pega a regra atual caso o status não seja de 'error'
        let currentRule;
        if (currentState[currentState.length - 1] !== "error") {
          currentRule = rules.find(
            (rule) => rule.name === currentState[currentState.length - 1]
          );
        } else {
          setCurrentState((prevCurrentState) => [...prevCurrentState, "error"]);
        }

        // caso possua uma regra na última letra inserida, adiciona o 'q'
        // daquela letra
        // caso não, coloca um status de 'error' na posição daquela letra
        if (currentRule && currentRule.value[letterIndex].length > 1) {
          setCurrentState([...currentState, currentRule.value[letterIndex]]);
        } else if (currentRule && currentRule.value[letterIndex] === "") {
          setCurrentState((prevCurrentState) => [...prevCurrentState, "error"]);
        }
      }
    }
  };

  const handleKeyDown = () => {
    // evento de backspace
    // tira o último valor de cada estado:
    // o array de q's que representam o caminho da palavra digitada
    // e o próprio valor do input que é armazenado
    if (currentState.length > 1) {
      const newCurrentState = currentState.slice(0, currentState.length - 1);
      const newSearchValue = searchValue.slice(0, searchValue.length - 1);
      setCurrentState(newCurrentState);
      setSearchValue(newSearchValue);
    }
  };

  const handleSubmit = (event) => {
    // evento de 'enter' ou espaço
    // verifica e coloca os status da seguinte forma:
    // se o último estado do array de caminho de estados for 'error', o status é de erro;
    // caso não for isso, abre-se para duas possibilidades:
    // se o último estado do array de caminho for um final, então o status é de sucesso;
    // caso não, coloca-se status de erro
    const finalState = currentState[currentState.length - 1];
    if (finalState === "error") {
      setFinalStatus("error");
    } else {
      if (rules.find((rule) => rule.name === finalState).final) {
        setFinalStatus("success");
      } else {
        setFinalStatus("error");
      }
    }

    // limpeza das variáveis utilizadas
    setTimeout(() => {
      setFinalStatus("");
    }, 10000);

    setCurrentState(["q0"]);
    setSearchValue("");
    event.target.value = "";
  };

  return (
    <Box margin={2} width="100%">
      <Card className="tableCard">
        <Box padding={2}>
          <TextField
            size="small"
            onChange={(event) =>
              event.keyCode !== "Backspace" &&
              handleChange(event.target.value.toUpperCase())
            }
            onKeyDown={(event) => {
              if (
                (event.key === "Enter" || event.key === " ") &&
                event.target.value !== ""
              ) {
                handleSubmit(event);
              } else if (event.code === "Backspace") {
                handleKeyDown(event.target.value.toUpperCase());
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {finalStatus === "error" && (
            <Typography color="red">Expressão inválida!</Typography>
          )}
          {finalStatus === "success" && (
            <Typography color="green">Expressão válida!</Typography>
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="20px" align="center">
                  /
                </TableCell>
                {alphabet.map((char) => (
                  <TableCell width="20px" align="center" key={char}>
                    {char}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rules.map((rule) => (
                <TableRow
                  key={rule.name}
                  id={rule.name}
                  className={
                    currentState[currentState.length - 1] === rule.name
                      ? "active"
                      : ""
                  }
                >
                  <TableCell width="20px" align="center">
                    {rule.initial ? "➜" : rule.final ? "✱" : ""}
                    {rule.name}
                  </TableCell>
                  {rule.value.map((qValue, qIndex) => (
                    <TableCell
                      width="20px"
                      align="center"
                      key={`${qValue}${qIndex}`}
                    >
                      {qValue}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default TableContent;
