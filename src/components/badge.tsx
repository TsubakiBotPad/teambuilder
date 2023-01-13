import { css } from "@emotion/css";
import { PadAssetImage } from "../model/padAssets";

export const BadgeDisplay = ({ badgeName, onClick }: { badgeName: string; onClick: () => void }) => {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        cursor: pointer;
      `}
      onClick={onClick}
    >
      <PadAssetImage assetName="badgebase" height={22} />
      <div
        className={css`
          position: relative;
          left: -50%;
        `}
      >
        {badgeName ? <PadAssetImage assetName={`${badgeName}badge`} width={18} /> : null}
      </div>
    </div>
  );
};
