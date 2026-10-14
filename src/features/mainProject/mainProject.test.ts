import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMainProject, homePathFor, setMainProject } from "./mainProject";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("mainProject", () => {
  it("запоминает и забывает главный проект", () => {
    setMainProject(1, 5);
    expect(getMainProject(1)).toBe(5);
    expect(homePathFor(1)).toBe("/project/5");

    setMainProject(1, null);
    expect(getMainProject(1)).toBeNull();
    expect(homePathFor(1)).toBe("/");
  });

  it("у каждого пользователя свой выбор", () => {
    setMainProject(1, 5);
    expect(getMainProject(2)).toBeNull();
  });

  it.each(["abc", "0", "-3", "1.5", ""])("мусор «%s» в хранилище → null", (raw) => {
    localStorage.setItem("jira:mainProject:1", raw);
    expect(getMainProject(1)).toBeNull();
  });

  it("если хранилище недоступно — не падает", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => setMainProject(1, 5)).not.toThrow();
    expect(getMainProject(1)).toBeNull();
  });
});
