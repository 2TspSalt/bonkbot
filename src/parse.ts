export interface Bonk {
  name: string;
  count: number;
  type: "increment" | "set";
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseCommandStyle(message: string): Bonk[] {
  const text = message.toString().trim();
  if (!text.startsWith("!bonk")) return [];
  const words = text.split(" ");
  const cmdWord = words.shift();
  if (cmdWord !== "!bonk") {
    console.error("Something went wrong! Unexpected command word", cmdWord);
    return [];
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

  return [bonkProps];
}

export function parseReportStyle(message: string): Bonk[] {
  const regex = /([^,\n]*)\sbonk\s(\d+),?/g;
  return Array.from(message.matchAll(regex)).map((match) => {
    const [_, name, countStr] = match;
    return {
      name: capitalizeFirstLetter(name.trim()),
      count: parseInt(countStr, 10),
      type: "set" as const,
    };
  });
}

export function parseBonk(message: string): Bonk[] {
  const cmdStyle = parseCommandStyle(message);
  const reptStyle = parseReportStyle(message);
  return [...cmdStyle, ...reptStyle];
}
