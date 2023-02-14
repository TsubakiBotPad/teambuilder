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

export const PageBox = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <div {...rest} className={clsx(className, "w-full m-4")}>
      {children}
    </div>
  );
};

export const Page = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <PageFlow>
      <PageBox {...rest} className={clsx(className)}>
        {children}
      </PageBox>
    </PageFlow>
  );
};

export const PageFlow = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <div {...rest} className={clsx(className, "flex justify-center items-center")}>
      {children}
    </div>
  );
};

export const TD = ({
  children,
  className,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <td {...rest} className={clsx(className, "py-2 px-1")}>
      {children}
    </td>
  );
};

export const ToggleOption = ({
  children,
  className,
  isEnabled,
  image,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  isEnabled: boolean;
  image: string;
  [rest: string]: any;
}) => {
  return (
    <span
      {...rest}
      className={clsx(
        className,
        "inline-block cursor-pointer h-[22px] w-[22px]",
        isEnabled ? "grayscale-0" : "grayscale",
        image
      )}
      style={{
        backgroundSize: "22px",
        width: "22px",
        height: "22px"
      }}
    >
      {children}
    </span>
  );
};
