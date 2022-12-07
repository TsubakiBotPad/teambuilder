import styled from "@emotion/styled";
import Select, { ActionMeta, SingleValue } from "react-select";

import { COLORS, GRAY_RANGE } from "../../colors";
import { SelectOption } from "./selectBase";

const Container = styled.div`
  min-width: 14em;
  margin-bottom: 2rem;
  color: #000;
`;

export const SingleValueInput = <T extends string>({
  selections,
  currentValue,
  setCurrentValue,
}: {
  selections: T[];
  currentValue: T;
  setCurrentValue: React.Dispatch<React.SetStateAction<T>>;
}) => {
  const options = [
    ...selections.map((d) => {
      return {
        value: d,
        label: d,
      };
    }),
  ];

  const customStyle = {
    option: (provided: any, state: any) => ({
      ...provided,
      borderBottom: `1px solid ${GRAY_RANGE[300]}`,
      color: state.isSelected ? GRAY_RANGE[900] : GRAY_RANGE[900],
      backgroundColor: state.isSelected ? GRAY_RANGE[200] : GRAY_RANGE[100],
      padding: "0.75rem 1rem",
      fontSize: "1.25rem",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: COLORS.BLUE,
      border: `1px solid ${GRAY_RANGE[200]}`,
    }),
    menuList: (provided: any, state: any) => ({
      ...provided,
      padding: 0,
      border: `1px solid ${GRAY_RANGE[300]}`,
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      padding: "0rem 1rem",
      textAlign: "center",
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
    }),
  };

  return (
    <Container>
      <Select
        name="filters"
        options={options}
        className="select"
        classNamePrefix="select"
        styles={customStyle}
        value={{ label: currentValue, value: currentValue }}
        onChange={(
          newValue: SingleValue<SelectOption>,
          actionMeta: ActionMeta<SelectOption>
        ) => {
          setCurrentValue(newValue?.value as T);
        }}
      />
    </Container>
  );
};
