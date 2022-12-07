import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { H1 } from "../stylePrimitives";

const BackNav = styled(Link)`
  &:visited {
    color: black;
  }
`;

export const TitleBar = ({ title }: { title: string }) => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        width: 100%;
      `}
    >
      <BackNav to="/">
        <BiArrowBack size={30} />
      </BackNav>
      <H1>
        <span>{title}</span>
      </H1>
      <BiArrowBack size={30} color="white" />
    </div>
  );
};
