import { useEffect, useState } from "react";

function useModifierKey(modifierKey: string) {
  const [isDown, setIsDown] = useState(false);
  useEffect(() => {
    function modifierKeyDn(e: KeyboardEvent) {
      // vscode says e.keyCode is deprecated but MDN says this should be included
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key !== modifierKey) return;
      e.stopPropagation();
      setIsDown(true);
    }

    function modifierKeyUp(e: KeyboardEvent) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key !== modifierKey) return;
      e.stopPropagation();
      setIsDown(false);
    }

    window.addEventListener("keydown", modifierKeyDn);
    window.addEventListener("keyup", modifierKeyUp);

    return () => {
      window.removeEventListener("keydown", modifierKeyDn);
      window.removeEventListener("keyup", modifierKeyUp);
    };
  }, [modifierKey]);

  return isDown;
}

export default useModifierKey;
