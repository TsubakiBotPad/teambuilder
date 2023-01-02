import { css } from "@emotion/css";

import { FlexColC } from "../stylePrimitives";

export const Footer = () => {
  return (
    <>
      <div
        className={css`
          margin: 0.5rem 0;
          padding: 0.5rem 0;
          background-color: #feeeee;
        `}
      >
        <FlexColC gap="0.25rem">
          <span
            className={css`
              font-size: 12px;
            `}
          >
            Made with love by the Tsubotki team :3
          </span>
          <a href="https://www.buymeacoffee.com/maxjank">
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=maxjank&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
              width={"200px"}
              alt="coffee"
            />
          </a>
        </FlexColC>
      </div>
    </>
  );
};
