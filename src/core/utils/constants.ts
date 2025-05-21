import { SingleValue, StylesConfig } from "react-select";

interface ColourOption { value: any; label: any }


export const selectDark = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#212529', borderColor: '#495057' }),
  input: (styles: any) => ({ ...styles, color: 'white' }),
  singleValue: (styles: any) => ({ ...styles, color: 'white' }),
  menuList: (styles: any) => ({ ...styles, backgroundColor: '#2b3035' }),

  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "#2684ff"
        : isFocused
        ? "#2684ff20"
        : undefined,
      color: isDisabled
        ? '#888'
        : isSelected
        ? 'white'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? "#2684ff"
            : "#2684ff40"
          : undefined,
      },
    };
  },
}