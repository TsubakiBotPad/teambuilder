import { ReactNode } from "react";
import clsx from "../../clsx";

const Button = ({ children, className, ...rest }: { children: ReactNode; className?: string; [rest: string]: any }) => {
  return (
    <button
      {...rest}
      className={clsx(className, "cursor-pointer flex justify-center py-1 border border-solid gap-1 rounded")}
    >
      {children}
    </button>
  );
};

export const ConfirmButton = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <Button {...rest} className={clsx(className, "px-8 bg-green-200 border-green-800 text-green-800")}>
      {children}
    </Button>
  );
};

export const RemoveButton = ({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  [rest: string]: any;
}) => {
  return (
    <Button {...rest} className={clsx(className, "px-3 bg-rose-200 border-rose-800 text-rose-800")}>
      {children}
    </Button>
  );
};
