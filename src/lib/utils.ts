
import classNames from "classnames";

export const cn = (...args: (string | undefined | null | boolean | Record<string, boolean> | (string | undefined | null | boolean | Record<string, boolean>)[])[]) => {
  return classNames(...args);
};
