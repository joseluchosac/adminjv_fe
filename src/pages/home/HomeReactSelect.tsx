import Select, { StylesConfig, components } from "react-select";
import DynaIcon from "../../core/components/DynaComponents";
import { useState } from "react";

interface ColourOption { value: string; label: string }
const options = [
  { value: 'chocolate', label: 'Chocolate', icon: "FaSun" },
  { value: 'strawberry', label: 'Strawberry', icon: "FaSun" },
  { value: 'vanilla', label: 'Vanilla', icon: "FaSun" },
  { value: 'coco', label: 'Coco', icon: "FaSun", isDisabled: true },
  { value: 'maracuya', label: 'Maracuya', icon: "FaSun" },
] 

const darkStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({ ...styles, backgroundColor: '#212529' }),
  input: (styles) => ({ ...styles, color: 'white' }),
  singleValue: (styles) => ({ ...styles, color: 'white' }),
  menuList: (styles) => ({ ...styles, backgroundColor: '#2b3035' }),

  option: (styles, { isDisabled, isFocused, isSelected }) => {
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

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <DynaIcon name={props.data.icon} style={{ marginRight: 8 }} />
      {props.data.label}
    </components.Option>
  );
};

export default function HomeReactSelect() {


  const [color, setColor] = useState<string | null>("vanilla")

  // const handleClose = () => setShow(false);
  const onChange = (option: any) => {
    console.log(option)
    console.log(color)
    // if(option){
    //   setColor(option.value)
    // }else{
    //   setColor(null)
    // }
  }


  return (
    <div className="bg-success">
      <h3>React select</h3>
      <button onClick={()=>setColor("maracuya")}>maracuya</button>
      <div>
        <Select
          // isMulti
          options={options}
          onChange={onChange}
          isClearable
          styles={darkStyles}
          closeMenuOnSelect={false}
          components={{ Option: CustomOption }}
          // value={options.find(el => el.value === color)}
        />
      </div>

   </div>
  );
}
