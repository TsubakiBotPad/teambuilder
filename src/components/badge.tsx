import { css } from "@emotion/css";
import { PadAssetImage } from "../model/padAssets";

export const BadgeDisplay = ({ badgeName, onClick }: { badgeName: string; onClick: () => void }) => {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
      `}
      onClick={onClick}
    >
      <PadAssetImage assetName="badgebase" height={22} />
      <div
        className={css`
          position: relative;
          width: 16px;
          height: 16px;
          left: -47%;
        `}
      >
        {badgeName ? <PadAssetImage assetName={`${badgeName}badge`} height={16} /> : null}
      </div>
    </div>
  );
};
