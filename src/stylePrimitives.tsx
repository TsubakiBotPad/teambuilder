import styled from "@emotion/styled";
import { breakpoint } from "./breakpoints";

export const H1 = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const H3 = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;

type FlexProps = {
  gap?: string;
  wrap?: boolean;
};

type FlexRowProps = {
  gap?: string;
  wrap?: string;
  center?: boolean;
};

export const FlexRow = styled.div<FlexRowProps>`
  display: flex;
  gap: ${(props) => (props.gap ? props.gap : "0")};
  justify-content: ${(props) => (props.center ? "center" : "start")};
  flex-wrap: ${(props) => (props.wrap ? props.wrap : "nowrap")};
`;

export const FlexRowC = styled(FlexRow)`
  align-items: center;
`;

export const RespRow = styled.div<FlexRowProps>`
  display: flex;
  @media ${breakpoint.xs} {
    flex-direction: column;
  }
  gap: ${(props) => (props.gap ? props.gap : "0")};
  justify-content: ${(props) => (props.center ? "center" : "start")};
`;

export const FlexCol = styled.div<FlexProps>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.gap ? props.gap : "0")};
`;

export const FlexColC = styled(FlexCol)`
  align-items: center;
`;

type ColorProps = {
  color: string;
};

export const HR = styled.hr<ColorProps>`
  border: 0;
  border-bottom: 1px solid ${(props) => props.color};
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

export const HR2 = styled.hr`
  border: 0;
  border-bottom: 1px solid black;
  width: 25%;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
`;

type PageProps = {
  maxWidth: string;
  margin?: string;
};

export const PageBox = styled.div<PageProps>`
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  margin: ${(props) => (props.margin ? props.margin : "1rem")};
`;

export const Page = ({ maxWidth, children }: { maxWidth: string; children: React.ReactNode }) => {
  return (
    <PageFlow>
      <PageBox maxWidth={maxWidth}>{children}</PageBox>
    </PageFlow>
  );
};

export const PageFlow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type BoundingBoxProps = {
  maxWidth?: string;
  maxWidthM?: string;
  minWidth?: string;
  minWidthM?: string;
};

export const BoundingBox = styled.div<BoundingBoxProps>`
  max-width: ${(props) => props.maxWidth ?? "100%"};
  min-width: ${(props) => props.minWidth ?? "0%"};

  @media ${breakpoint.xs} {
    max-width: ${(props) => props.maxWidthM ?? "100%"};
    min-width: ${(props) => props.minWidthM ?? "0%"};
  }
`;
