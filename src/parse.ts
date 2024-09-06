export function parseBonk(message: string): {name: string, count: number} | undefined {
  const text = message.toString().trim();
  if (!text.startsWith("!bonk")) return;
  const words = text.split(" ");
  const cmdWord = words.shift();
  if (cmdWord !== "!bonk") {
    console.error("Something went wrong! Unexpected command word", cmdWord);
    return;
  }

  const bonkProps = { name: "Lumin", count: 1 };

  const lastWord = words.pop();
  if (lastWord) {
    const lastNum = parseInt(lastWord, 10);
    if (Number.isNaN(lastNum)) {
      bonkProps.name = [...words, lastWord].join(" ");
    } else {
      const name = words.join(" ");
      if (name) {
        bonkProps.name = name;
      }
      bonkProps.count = lastNum;
    }
  }

  return bonkProps;
}
