import styled from "@emotion/styled";
import { breakpoint } from "./breakpoints";
import { ReactNode } from "react";
import clsx from "clsx";

export const H1 = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h1 className={clsx("text-3xl font-medium", className)}>{children}</h1>;
};

export const H2 = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h1 className={clsx("text-2xl font-semibold", className)}>{children}</h1>;
};

export const H3 = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <h1 className={clsx("text-xl font-semibold", className)}>{children}</h1>;
};

export const FlexRow = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <div {...rest} className={clsx(className, "flex")}>
      {children}
    </div>
  );
};

export const FlexRowC = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  const newClassName = clsx(className, "items-center");
  return (
    <FlexRow className={newClassName} {...rest}>
      {children}
    </FlexRow>
  );
};

export const FlexCol = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <div {...rest} className={clsx(className, "flex flex-col")}>
      {children}
    </div>
  );
};

export const FlexColC = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  const newClassName = clsx(className, "items-center");
  return (
    <FlexCol className={newClassName} {...rest}>
      {children}
    </FlexCol>
  );
};

export const FlexColCResponsive = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <FlexCol {...rest} className={clsx(className, "items-start xl:items-center")}>
      {children}
    </FlexCol>
  );
};

export const HR = ({
  children,
  className,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <hr {...rest} className={clsx(className, "border-0 border-b border-solid w-full my-8")}>
      {children}
    </hr>
  );
};

export const HR2 = ({
  children,
  className,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <hr {...rest} className={clsx(className, "border-0 border-b border-black border-solid w-1/4 my-1")}>
      {children}
    </hr>
  );
};

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

export const TD = styled.td`
  padding: 0.5rem 0.25rem;
`;

export const TDr = styled(TD)`
  text-align: right;
`;

export const TDh = styled(TD)`
  font-weight: 600;
`;

export const TDrh = styled(TD)`
  font-weight: 600;
  text-align: right;
`;

type ToggleOptionProps = {
  isEnabled: boolean;
  image: string;
};

export const ToggleOption = styled.span<ToggleOptionProps>`
  cursor: pointer;
  filter: grayscale(${(props) => (props.isEnabled ? 0 : 1)});
  background: url("img/${(props) => props.image}") no-repeat;
  height: 22px;
  width: 22px;
  background-size: 22px;
  display: inline-block;
`;
