import { css } from "@emotion/css";
import styled from "@emotion/styled";

class SpriteCoordinates {
  topPx: number;
  leftPx: number;
  widthPx: number;
  heightPx: number;

  constructor(top: number, left: number, width: number, height: number) {
    this.topPx = top;
    this.leftPx = left;
    this.widthPx = width;
    this.heightPx = height;
  }
}
/* python
startX = 260
startY = 330
gapX = 0
gapY = 2
width = 76
height = 31

for i in range(10):
    x = startX + (width + gapX) * i
    y = startY + (height + gapY) * i
    print('"": new SpriteCoordinates({}, {}, {}, {}),'.format(startX,y,width,height))
*/
const ASSET_NAME_TO_SPRITE_PROPS: { [key: string]: SpriteCoordinates } = {
  "6slotLatentBg": new SpriteCoordinates(412, 0, 252, 32),
  "1p": new SpriteCoordinates(451, 121, 97, 32),
  emptyLatent: new SpriteCoordinates(440, 330, 31, 31),

  all: new SpriteCoordinates(342, 260, 76, 31), // gap 3px X
  evk: new SpriteCoordinates(420, 260, 76, 31),
  awk: new SpriteCoordinates(498, 260, 76, 31),
  enk: new SpriteCoordinates(576, 260, 76, 31),
  rek: new SpriteCoordinates(654, 260, 76, 31),
  gok: new SpriteCoordinates(732, 260, 76, 31),
  drk: new SpriteCoordinates(810, 260, 76, 31),
  dek: new SpriteCoordinates(888, 260, 76, 31),

  mak: new SpriteCoordinates(334, 294, 76, 31),
  bak: new SpriteCoordinates(412, 294, 76, 31),
  atk: new SpriteCoordinates(490, 294, 76, 31),
  phk: new SpriteCoordinates(568, 294, 76, 31),
  hek: new SpriteCoordinates(646, 294, 76, 31),
  "hp+": new SpriteCoordinates(724, 294, 76, 31),
  "atk+": new SpriteCoordinates(802, 294, 76, 31),
  "rcv+": new SpriteCoordinates(880, 294, 76, 31),

  "te+": new SpriteCoordinates(260, 330, 76, 32),
  "rres+": new SpriteCoordinates(260, 364, 76, 32),
  "bres+": new SpriteCoordinates(260, 398, 76, 32),
  "gres+": new SpriteCoordinates(260, 432, 76, 32),
  "lres+": new SpriteCoordinates(260, 466, 76, 32),
  "dres+": new SpriteCoordinates(260, 500, 76, 32),
  "hp++": new SpriteCoordinates(260, 534, 76, 32),
  "atk++": new SpriteCoordinates(260, 568, 76, 32),
  "rcv++": new SpriteCoordinates(260, 602, 76, 32),

  // need to cut more
};

type SpriteProps = {
  backgroundPosition: string;
  width: string;
  height: string;
};

const PadAssetImg = styled.img<SpriteProps>`
  background: url("img/padAssets.png") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const PadAssetImage = ({
  assetName,
  onClick,
  className,
}: {
  assetName: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  className?: string;
}) => {
  const c = ASSET_NAME_TO_SPRITE_PROPS[assetName];
  if (!c) {
    return <>missing</>;
  }

  return (
    <PadAssetImg
      width={`${c.widthPx}px`}
      height={`${c.heightPx}px`}
      backgroundPosition={`-${c.topPx}px -${c.leftPx}px`}
      onClick={onClick}
      className={className}
    />
  );
};
