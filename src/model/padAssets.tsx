import styled from "@emotion/styled";

import { SpriteProps } from "./images";

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
height = 32

for i in range(10):
    x = startX + (width + gapX) * i
    y = startY + (height + gapY) * i
    print('"": new SpriteCoordinates({}, {}, {}, {}),'.format(startX,y,width,height))
*/
const ASSET_NAME_TO_SPRITE_PROPS: { [key: string]: SpriteCoordinates } = {
  "6slotLatentBg": new SpriteCoordinates(412, 0, 252, 32),
  "1p": new SpriteCoordinates(451, 121, 97, 32),
  emptyLatent: new SpriteCoordinates(440, 330, 32, 32),

  // 2-slot latents - part 1
  all: new SpriteCoordinates(342, 260, 76, 32), // gap 3px X
  evk: new SpriteCoordinates(420, 260, 76, 32),
  awk: new SpriteCoordinates(498, 260, 76, 32),
  enk: new SpriteCoordinates(576, 260, 76, 32),
  rek: new SpriteCoordinates(654, 260, 76, 32),
  gok: new SpriteCoordinates(732, 260, 76, 32),
  drk: new SpriteCoordinates(810, 260, 76, 32),
  dek: new SpriteCoordinates(888, 260, 76, 32),

  // 2-slot latents - part 2
  mak: new SpriteCoordinates(334, 294, 76, 32),
  bak: new SpriteCoordinates(412, 294, 76, 32),
  aak: new SpriteCoordinates(490, 294, 76, 32),
  phk: new SpriteCoordinates(568, 294, 76, 32),
  hek: new SpriteCoordinates(646, 294, 76, 32),
  "hp+": new SpriteCoordinates(724, 294, 76, 32),
  "atk+": new SpriteCoordinates(802, 294, 76, 32),
  "rcv+": new SpriteCoordinates(880, 294, 76, 32),

  // 2-slot latents - part 3
  "te+": new SpriteCoordinates(260, 330, 76, 32),
  "rres+": new SpriteCoordinates(260, 364, 76, 32),
  "bres+": new SpriteCoordinates(260, 398, 76, 32),
  "gres+": new SpriteCoordinates(260, 432, 76, 32),
  "lres+": new SpriteCoordinates(260, 466, 76, 32),
  "dres+": new SpriteCoordinates(260, 500, 76, 32),
  "hp++": new SpriteCoordinates(260, 534, 76, 32),
  "atk++": new SpriteCoordinates(260, 568, 76, 32),
  "rcv++": new SpriteCoordinates(260, 602, 76, 32),

  // types
  awok: new SpriteCoordinates(338, 364, 32, 32),
  enhk: new SpriteCoordinates(338, 398, 32, 32),
  venk: new SpriteCoordinates(338, 432, 32, 32),
  godk: new SpriteCoordinates(338, 466, 32, 32),
  drak: new SpriteCoordinates(338, 500, 32, 32),
  devk: new SpriteCoordinates(338, 534, 32, 32),
  mack: new SpriteCoordinates(338, 568, 32, 32),
  balk: new SpriteCoordinates(338, 602, 32, 32),
  attk: new SpriteCoordinates(338, 636, 32, 32),
  phyk: new SpriteCoordinates(338, 670, 32, 32),
  heak: new SpriteCoordinates(338, 704, 32, 32),

  t0: new SpriteCoordinates(0, 0, 25, 25),
  t1: new SpriteCoordinates(27, 0, 25, 25),
  t2: new SpriteCoordinates(54, 0, 25, 25),
  t3: new SpriteCoordinates(81, 0, 25, 25),
  t4: new SpriteCoordinates(0, 27, 25, 25),
  t5: new SpriteCoordinates(27, 27, 25, 25),
  t6: new SpriteCoordinates(54, 27, 25, 25),
  t7: new SpriteCoordinates(81, 27, 25, 25),
  t8: new SpriteCoordinates(0, 54, 25, 25),
  t9: new SpriteCoordinates(27, 54, 25, 25),
  t10: new SpriteCoordinates(54, 54, 25, 25),
  t11: new SpriteCoordinates(81, 54, 25, 25),

  // 2-slot stat latent with bg, single wide
  "hp++Square": new SpriteCoordinates(542, 364, 32, 32),
  "atk++Square": new SpriteCoordinates(576, 364, 32, 32),
  "rcv++Square": new SpriteCoordinates(610, 364, 32, 32),

  // 6-slot latents with bg
  vdp: new SpriteCoordinates(406, 364, 32, 32),
  attr: new SpriteCoordinates(440, 364, 32, 32),
  abs: new SpriteCoordinates(474, 364, 32, 32),
  dbl: new SpriteCoordinates(508, 364, 32, 32),
  // more 6-slot latents with bg
  cloudtape: new SpriteCoordinates(644, 364, 32, 32),
  "sb++": new SpriteCoordinates(678, 364, 32, 32),
  "?": new SpriteCoordinates(712, 364, 32, 32),

  // 1-slot latents
  hp: new SpriteCoordinates(474, 330, 32, 32),
  atk: new SpriteCoordinates(508, 330, 32, 32),
  rcv: new SpriteCoordinates(542, 330, 32, 32),
  te: new SpriteCoordinates(576, 330, 32, 32),
  ah: new SpriteCoordinates(610, 330, 32, 32),
  rres: new SpriteCoordinates(644, 330, 32, 32),
  bres: new SpriteCoordinates(678, 330, 32, 32),
  gres: new SpriteCoordinates(712, 330, 32, 32),
  lres: new SpriteCoordinates(746, 330, 32, 32),
  dres: new SpriteCoordinates(780, 330, 32, 32),
  sdr: new SpriteCoordinates(814, 330, 32, 32),
  allStat1: new SpriteCoordinates(848, 330, 32, 32),
  ls: new SpriteCoordinates(882, 330, 32, 32),
  jsf: new SpriteCoordinates(916, 330, 32, 32),
  psf: new SpriteCoordinates(950, 330, 32, 32),
  evok1: new SpriteCoordinates(984, 330, 32, 32),
  unm: new SpriteCoordinates(296, 844, 32, 32),
  spn: new SpriteCoordinates(958, 295, 32, 32),

  // need to cut more

  // 6-slot latents nobg
  jsflatentbase: new SpriteCoordinates(960, 464, 32, 32),
  lslatentbase: new SpriteCoordinates(508, 498, 32, 32),
  attrlatentbase: new SpriteCoordinates(544, 498, 32, 28),
  "sb++latentbase": new SpriteCoordinates(576, 498, 32, 32),

  unmlatentbase: new SpriteCoordinates(957, 225, 32, 32),
  spnlatentbase: new SpriteCoordinates(920, 225, 32, 32),

  psflatentbase: new SpriteCoordinates(474, 500, 32, 29),
  massatkbadge: new SpriteCoordinates(474, 529, 29, 29),
  "rcv+badge": new SpriteCoordinates(473, 560, 29, 29),
  "hp+badge": new SpriteCoordinates(473, 591, 29, 29),
  "1.5xlatentbase": new SpriteCoordinates(474, 624, 32, 29),
  vdplatentbase: new SpriteCoordinates(474, 653, 32, 29),
  cloudtapelatentbase: new SpriteCoordinates(474, 681, 32, 29),
  "atk+badge": new SpriteCoordinates(473, 710, 29, 29),
  abslatentbase: new SpriteCoordinates(474, 739, 32, 29),
  // "9": new SpriteCoordinates(474, 779, 32, 29),
  // "10": new SpriteCoordinates(474, 824, 32, 29),
  rcvbadge: new SpriteCoordinates(472, 822, 29, 29),
  hpbadge: new SpriteCoordinates(472, 851, 29, 29),
  sbbadge: new SpriteCoordinates(474, 878, 29, 29),
  unbindablebadge: new SpriteCoordinates(473, 906, 29, 29),
  sbrbadge: new SpriteCoordinates(473, 934, 29, 29),
  unmatachable: new SpriteCoordinates(474, 962, 32, 29),
  dbllatentbase: new SpriteCoordinates(474, 990, 32, 29),

  badgebase: new SpriteCoordinates(260, 637, 52, 38),
  padpassbadge: new SpriteCoordinates(260, 680, 58, 37),
  costbadge: new SpriteCoordinates(162, 336, 67, 45),
  tebadge: new SpriteCoordinates(636, 499, 28, 28),
  atkbadge: new SpriteCoordinates(664, 499, 29, 29),
  nosfbadge: new SpriteCoordinates(308, 802, 29, 29),
  "te+badge": new SpriteCoordinates(230, 432, 29, 29),
  rankexpbadge: new SpriteCoordinates(162, 433, 67, 44),
  blindbadge: new SpriteCoordinates(101, 810, 56, 56),
  jammerbadge: new SpriteCoordinates(97, 916, 56, 56),
  poisonbadge: new SpriteCoordinates(159, 583, 56, 56)
};

const PadAssetImg = styled.div<SpriteProps>`
  background: url("img/${(props) => (props.image ? props.image : "padAssets.png")}") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  background-size: ${(props) => props.backgroundSize};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const PadAssetImage = ({
  assetName,
  onClick,
  className,
  height: desiredHeight,
  children,
  image
}: {
  assetName: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  className?: string;
  height?: number;
  children?: React.ReactNode;
  image?: string;
}) => {
  const c = ASSET_NAME_TO_SPRITE_PROPS[assetName];
  if (!c) {
    return <>missing:{assetName}</>;
  }

  const scale = desiredHeight ? desiredHeight / c.heightPx : 1;

  const imgDimensions = {
    "padAssets.png": {
      width: 1022,
      height: 1022
    },
    "typesSprite.png": {
      width: 106,
      height: 79
    }
  };

  // background-position:calc(var(--i)/var(--n) * 100px) calc(var(--j)/var(--n) * 100px);
  image = image ?? "padAssets.png";
  return (
    <PadAssetImg
      width={`${c.widthPx * scale}px`}
      height={`${c.heightPx * scale}px`}
      backgroundPosition={`-${c.topPx * scale}px -${c.leftPx * scale}px`}
      backgroundSize={`${imgDimensions[image as keyof typeof imgDimensions].width * scale}px ${
        imgDimensions[image as keyof typeof imgDimensions].height * scale
      }px`}
      scale={1}
      onClick={onClick}
      className={className}
      image={image}
    >
      {children}
    </PadAssetImg>
  );
};
