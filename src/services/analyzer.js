const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// responsável por mergear as regras
const mergeRules = ({ rules, field, initial }) => {
  // cria o objeto inicial que serve de base para a iteração
  const response = {
    name: field,
    initial,
    final: false,
    value: alphabet.map(() => ""),
  };

  // a cada char encontrado dentro do alfabeto de q's, ele junta separando por virgula
  rules.forEach((rule) => {
    if (rule) {
      rule.value.forEach((qChar, index) => {
        if (qChar !== "") {
          response.final = !response.final ? rule.final : response.final;
          response.value[index] += `${qChar}, `;
        }
      });
    }
  });

  // exclui a vírgula final
  response.value = response.value.map((qChar) => qChar.slice(0, -2));

  return response;
};

const createAnalyzerStructure = ({ tokens }) => {
  // Array final
  let finalRules = [];

  // Monta a regra para cada token separado
  let qCount = 0;
  let rulesToken = [];
  tokens.forEach((token, tokenIndex) => {
    const ruleToken = [];
    token.split("").forEach((charToken, charIndex) => {
      // cria um objeto para cada letra
      ruleToken[charIndex] = {
        name: charIndex === 0 ? "q0" : `q${qCount}`,
        initial: charIndex === 0,
        final: false,
        value: alphabet.map((letter) =>
          letter === charToken ? `q${qCount + 1}` : ""
        ),
      };

      // cria a regra final pro token
      ruleToken[charIndex + 1] = {
        name: `q${qCount + 1}`,
        initial: false,
        final: true,
        value: alphabet.map(() => "-"),
      };

      qCount++;
    });

    rulesToken[tokenIndex] = ruleToken;
  });

  // cria as condições iniciais de todos os tokens inseridos
  const allQ0 = [];
  rulesToken.forEach((ruleToken) => {
    allQ0.push(ruleToken[0]);

    ruleToken.forEach((rule) => {
      if (rule.name !== "q0") finalRules.push(rule);
    });
  });

  // faz o merge de todas as regras iniciais dos tokens inseridos
  finalRules.push(mergeRules({ field: "q0", rules: allQ0, initial: true }));

  // laço para mergear as regras até que a regra final se torne uma regra determinística
  let isNew = true;
  while (isNew) {
    isNew = false;
    // eslint-disable-next-line no-loop-func
    finalRules.forEach((finalRule) => {
      finalRule.value
        .filter((qChar) => qChar && qChar !== "-")
        .forEach((qChars) => {
          // verifica se a regra já está inserida na lista final de regras
          // caso não, faz a determinização da regra, mergeando elas
          if (finalRules.findIndex((fR) => fR.name === qChars) < 0) {
            const rules = qChars
              .split(", ")
              .map((qChar) => finalRules.find((fR) => fR.name === qChar));
            finalRules.push(
              mergeRules({ field: qChars, initial: false, rules })
            );
            isNew = true;
          }
        });
    });
  }

  // faz a ordenação das regras se baseando na seguinte regra:
  // q0 na frente;
  // q's separados por virgulas;
  // q's simples, conforme sua numeração.
  const finalSortedRules = finalRules.sort((a, b) => {
    const aValue = a.name.includes(",") ? 0.1 : parseInt(a.name.substring(1));
    const bValue = b.name.includes(",") ? 0.1 : parseInt(b.name.substring(1));

    return aValue - bValue;
  });

  return finalSortedRules;
};

export default createAnalyzerStructure;
