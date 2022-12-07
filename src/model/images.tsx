import styled from "@emotion/styled";

type SpriteProps = {
  backgroundPosition: string;
  width: string;
  height: string;
};

const AwoImg = styled.img<SpriteProps>`
  background: url("img/awakeningsSprite.png") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const AwakeningImage = ({ awakeningId }: { awakeningId: number }) => {
  const aId = awakeningId - 1; // awakeningids are 1 indexed, turn it into 0 index
  const rowNum = Math.floor(aId / 10);
  const colNum = aId % 10;
  const leftPos = rowNum * 25 + rowNum;
  const topPos = colNum * 25 + colNum;

  return (
    <AwoImg
      width={"25px"}
      height="25px"
      backgroundPosition={`-${topPos}px -${leftPos}px`}
    />
  );
};

const TypeImg = styled.img<SpriteProps>`
  background: url("img/typesSprite.png") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const TypeImage = ({ typeId }: { typeId: number }) => {
  const rowNum = Math.floor(typeId / 10);
  const colNum = typeId % 10;
  const leftPos = rowNum * 25 + rowNum;
  const topPos = colNum * 25 + colNum;

  return (
    <TypeImg
      width={"25px"}
      height="25px"
      backgroundPosition={`-${topPos}px -${leftPos}px`}
    />
  );
};

export const BASE_ICON_URL =
  "https://d30r6ivozz8w2a.cloudfront.net/media/icons/";
