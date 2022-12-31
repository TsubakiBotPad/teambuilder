import styled from "@emotion/styled";

export type SpriteProps = {
  backgroundPosition: string;
  backgroundSize: string;
  width: string;
  height: string;
  scale: number;
};

const AwoImg = styled.div<SpriteProps>`
  background: url("img/awakeningsSprite.png") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  background-size: ${(props) => props.backgroundSize};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  transform: scale(${(props) => props.scale});
`;

export const AwakeningImage = ({
  awakeningId,
  width: desiredWidth,
  className
}: {
  awakeningId: number;
  width?: number;
  className?: string;
}) => {
  const width = 25;
  const height = 25;

  const aId = awakeningId - 1; // awakeningids are 1 indexed, turn it into 0 index
  const rowNum = Math.floor(aId / 10);
  const colNum = aId % 10;

  const scale = desiredWidth ? desiredWidth / width : 1;
  const leftPos = rowNum * width + rowNum;
  const topPos = colNum * height + colNum;

  const imgWidth = 259;
  const imgHeight = 285;

  return (
    <AwoImg
      width={`${width * scale}px`}
      height={`${height * scale}px`}
      backgroundPosition={`-${topPos * scale}px -${leftPos * scale}px`}
      backgroundSize={`${imgWidth * scale}px ${imgHeight * scale}px`}
      scale={scale}
      className={className}
    />
  );
};

const TypeImg = styled.div<SpriteProps>`
  background: url("img/typesSprite.png") no-repeat;
  background-position: ${(props) => props.backgroundPosition};
  background-size: ${(props) => props.backgroundSize};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  transform: scale(${(props) => props.scale});
`;

export const TypeImage = ({ typeId, width: desiredWidth }: { typeId: number; width?: number }) => {
  const width = 25;
  const height = 25;

  const rowNum = Math.floor(typeId / 10);
  const colNum = typeId % 10;
  const leftPos = rowNum * width + rowNum;
  const topPos = colNum * height + colNum;

  const scale = desiredWidth ? desiredWidth / width : 1;

  const imgWidth = 103;
  const imgHeight = 103;
  return (
    <TypeImg
      width={`${width * scale}px`}
      height={`${height * scale}px`}
      backgroundPosition={`-${topPos * scale}px -${leftPos * scale}px`}
      backgroundSize={`${imgWidth * scale}px ${imgHeight * scale}px`}
      scale={scale}
    />
  );
};

export const BASE_ICON_URL = "https://d30r6ivozz8w2a.cloudfront.net/media/icons/";
