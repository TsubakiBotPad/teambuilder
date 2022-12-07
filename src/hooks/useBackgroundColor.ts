import { useEffect } from "react";

export function useBackgroundColor(color: string) {
  useEffect(() => {
    document.body.style.backgroundColor = color;

    return () => {
      document.body.style.backgroundColor = "";
    };
  });
}
