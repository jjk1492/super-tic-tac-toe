import classNames from "classnames";
import { HTMLProps, PropsWithChildren } from "react";

/**
 * Div with a bootstrap container. That's it.
 */
export default function Container({ children, className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div className={classNames("container-xxl py-3", className)} {...props}>
      {children}
    </div>
  );
}
