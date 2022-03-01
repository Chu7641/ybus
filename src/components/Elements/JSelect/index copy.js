import React from "react";
import { Select } from "antd";
const { Option } = Select;

export default function JSelect1(props) {



  var {
    options,
    optionValue, // name of value field
    optionLabel, // name of label field
    placeholder

  } = props;



  return (
    <Select

      showSearch
      onChange={onChange}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }

    >
      {options.map((option, index) => {

        return (
          <Option
            key={`${option[optionValue]}_${index}`}
            value={option[optionValue]}
          >
            {option[optionLabel]}
          </Option>
        );
      })}
    </Select>
  );
}

