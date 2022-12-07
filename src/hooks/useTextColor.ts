import { useEffect } from "react";

export function useTextColor(color: string) {
  useEffect(() => {
    document.body.style.color = color;

    return () => {
      document.body.style.color = "";
    };
  });
}
