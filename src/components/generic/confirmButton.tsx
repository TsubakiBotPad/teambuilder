import styled from "@emotion/styled";
import { ColorKey, getColor } from "../../colors";

export const ConfirmButton = styled.button`
  border: 1px solid ${getColor(ColorKey.CONFIRM_BUTTON_BORDER)};
  padding: 0.25rem 2rem;
  background-color: ${getColor(ColorKey.CONFIRM_BUTTON_BG)};
  color: ${getColor(ColorKey.CONFIRM_BUTTON_ICON)};
  display: flex;
  justify-content: center;
  gap: 0.25rem;
`;

export const RemoveButton = styled.button`
  border: 1px solid ${getColor(ColorKey.REMOVE_BUTTON_BORDER)};
  padding: 0.25rem 0.75rem;
  background-color: ${getColor(ColorKey.REMOVE_BUTTON_BG)};
  color: ${getColor(ColorKey.REMOVE_BUTTON_ICON)};
  display: flex;
  justify-content: center;
  gap: 0.25rem;
`;
