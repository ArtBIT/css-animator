import React from "react";
import c from "classnames";
import s from "./Flex.module.css";

const Flex = React.forwardRef(
  (
    { className, row, column, center, grow, stretch, wrap, children, ...rest },
    ref
  ) => (
    <div
      {...rest}
      ref={ref}
      className={c(
        s.root,
        row && s.row,
        column && s.column,
        center && s.center,
        grow && s.grow,
        stretch && s.stretch,
        wrap && s.wrap,
        className
      )}
    >
      {children}
    </div>
  )
);

export default Flex;
