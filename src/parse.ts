export interface Bonk {
  name: string;
  count: number;
  type: "increment" | "set";
}

export function parseCommandStyle(message: string): Bonk | undefined {
  const text = message.toString().trim();
  if (!text.startsWith("!bonk")) return;
  const words = text.split(" ");
  const cmdWord = words.shift();
  if (cmdWord !== "!bonk") {
    console.error("Something went wrong! Unexpected command word", cmdWord);
    return;
  }

  const bonkProps = { name: "Lumin", count: 1, type: "increment" as const };

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

export function parseReportStyle(message: string): Bonk | undefined {
  const regex = /(.*)\sbonk\s(\d+)/;
  const matches = message.match(regex);
  if (!matches) return;
  const [_, name, countStr] = matches;

  return { name, count: parseInt(countStr, 10), type: "set" as const };
}

export function parseBonk(message: string): Bonk | undefined {
  const cmdStyle = parseCommandStyle(message);
  if (cmdStyle) {
    return cmdStyle;
  }

  const reptStyle = parseReportStyle(message);
  if (reptStyle) {
    return reptStyle;
  }
}
