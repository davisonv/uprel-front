import React from "react";

const RenderIf = (props) => {
  return <>{props.condicao && props.children}</>;
};

export { RenderIf };
export default RenderIf;
