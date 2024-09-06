import { assertEquals, assertObjectMatch } from "@std/assert";
import { parseBonk } from "./parse.ts";

Deno.test("!bonk", () => {
  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk"), [
    {
      name: "Lumin",
      count: 1,
      type: "increment",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk 10"), [
    {
      name: "Lumin",
      count: 10,
      type: "increment",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk Kaiser Dragon"), [
    {
      name: "Kaiser Dragon",
      count: 1,
      type: "increment",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk Kaiser Dragon 5"), [
    {
      name: "Kaiser Dragon",
      count: 5,
      type: "increment",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk CypherVirus (サイファー)"), [
    {
      name: "CypherVirus (サイファー)",
      count: 1,
      type: "increment",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("!bonk CypherVirus (サイファー) 5​​"), [
    {
      name: "CypherVirus (サイファー)",
      count: 5,
      type: "increment",
    },
  ]);

  assertEquals(parseBonk("foo !bonk bar"), []);
});

Deno.test("lumin bonk #", () => {
  // @ts-ignore array
  assertObjectMatch(parseBonk("lumin bonk 10"), [
    {
      name: "Lumin",
      count: 10,
      type: "set",
    },
  ]);

  // @ts-ignore array
  assertObjectMatch(parseBonk("lumin bonk 38, pam bonk 2002,"), [
    {
      name: "Lumin",
      count: 38,
      type: "set",
    },
    {
      name: "Pam",
      count: 2002,
      type: "set",
    },
  ]);
});
