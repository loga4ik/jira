import { describe, expect, it } from "vitest";
import { getSafeReturnPath, loginPathWithReturn } from "./returnPath";

describe("loginPathWithReturn", () => {
  it("запоминает путь и параметры страницы", () => {
    expect(loginPathWithReturn({ pathname: "/project/5", search: "?tab=chat" })).toBe(
      "/login?from=%2Fproject%2F5%3Ftab%3Dchat",
    );
  });

  it("с главной ничего не запоминает", () => {
    expect(loginPathWithReturn({ pathname: "/", search: "" })).toBe("/login");
  });
});

describe("getSafeReturnPath", () => {
  it.each([
    ["?from=/project/5", "/project/5"],
    ["?from=%2Fproject%2F5%3Ftab%3Dchat", "/project/5?tab=chat"],
  ])("внутренний путь %s → %s", (search, expected) => {
    expect(getSafeReturnPath(search)).toBe(expected);
  });

  // каждая из этих ссылок без проверки увела бы на чужой сайт после входа
  it.each([
    ["", "нет параметра"],
    ["?from=", "пустой"],
    ["?from=https://evil.com", "полный адрес"],
    ["?from=//evil.com", "адрес без протокола"],
    ["?from=/%5Cevil.com", "обратный слеш"],
    ["?from=project/5", "без ведущего слеша"],
  ])("%s (%s) → null", (search) => {
    expect(getSafeReturnPath(search)).toBeNull();
  });
});
