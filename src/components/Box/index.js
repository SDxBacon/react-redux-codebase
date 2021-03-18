import styled from "styled-components";
import {
  background,
  border,
  color,
  compose,
  flexbox,
  layout,
  position,
  shadow,
  space,
  system,
  typography
} from "styled-system";
import propTypes from "@styled-system/prop-types";

const es = system({
  es: {
    property: "fontWeight",
    transform: (value) => `${value === "bold" ? "bold" : "normal"}`
  }
});

const styleProps = compose(
  flexbox,
  space,
  color,
  layout,
  border,
  background,
  position,
  shadow,
  typography,

  es
);

export const Box = styled.div`
  ${({ es }) => (es ? { fontFamily: "HYYakuHei" } : null)}

  ${styleProps}
`;

Box.displayName = "Box";

Box.propTypes = {
  ...propTypes.flex,
  ...propTypes.space,
  ...propTypes.color,
  ...propTypes.layout,
  ...propTypes.border,
  ...propTypes.background,
  ...propTypes.position,
  ...propTypes.shadow,
  ...propTypes.typography
};

export default Box;
