import { css } from "@emotion/css";

import { FlexColC, FlexRowC } from "../stylePrimitives";

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
          <span className="text-xs">PAD Team Builder is made with love by the Tsubotki team :3</span>

          <FlexRowC gap="gap-5">
            <a href="https://www.buymeacoffee.com/maxjank">
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=maxjank&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                width={"175px"}
                alt="coffee"
              />
            </a>
            <div
              className={css`
                border: 1px solid black;
                border-radius: 4px;
                padding: 0.1rem 0 0 0;
                background-color: white;
              `}
            >
              <a href="https://www.patreon.com/tsubaki_bot">
                <img src="img/patreon.png" width={"55px"} alt="patreon" />
              </a>
            </div>
          </FlexRowC>
          <span className="text-xxs">
            Puzzle & Dragons related images are trademarks of GungHo Online Entertainment, Inc.
            teambuilder.tsubakibot.com is a 3rd party site and has no affiliations with Gungho.
          </span>
        </FlexColC>
      </div>
    </>
  );
};
