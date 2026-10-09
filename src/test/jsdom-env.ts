import type { Environment } from "vitest/environments";
import { builtinEnvironments } from "vitest/environments";

/**
 * Обычное jsdom-окружение Vitest с одним исправлением.
 *
 * jsdom подменяет глобальные AbortController и AbortSignal своими,
 * а fetch и Request остаются из Node. RTK Query создаёт AbortController
 * (получается jsdom-овский) и передаёт его signal в Node-овский Request.
 * Node 24+ строго проверяет, что signal — его собственный AbortSignal,
 * и падает: «Expected signal to be an instance of AbortSignal».
 * На Node 22 проверка мягче, поэтому там ошибки не было.
 *
 * Возвращаем Node-овские AbortController и AbortSignal поверх jsdom,
 * чтобы fetch и signal были из одного мира, как в настоящем браузере.
 */
const jsdom = builtinEnvironments.jsdom;

export default <Environment>{
  name: "jsdom-node-abort",
  transformMode: "web",
  async setup(global, options) {
    const { AbortController, AbortSignal } = global;
    const env = await jsdom.setup(global, options);
    global.AbortController = AbortController;
    global.AbortSignal = AbortSignal;
    return env;
  },
};
