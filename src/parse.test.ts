import { assertEquals, assertObjectMatch } from "@std/assert";
import { parseBonk } from "./parse.ts";

Deno.test("!bonk", () => {
  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk"), { name: "Lumin", count: 1 });

  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk 10"), { name: "Lumin", count: 10 });

  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk Kaiser Dragon"), {
    name: "Kaiser Dragon",
    count: 1,
  });

  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk Kaiser Dragon 5"), {
    name: "Kaiser Dragon",
    count: 5,
  });

  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk CypherVirus (サイファー)"), {
    name: "CypherVirus (サイファー)",
    count: 1,
  });

  // @ts-expect-error undefined
  assertObjectMatch(parseBonk("!bonk CypherVirus (サイファー) 5​​"), {
    name: "CypherVirus (サイファー)",
    count: 5,
  });

  assertEquals(parseBonk("foo !bonk bar"), undefined);
});
