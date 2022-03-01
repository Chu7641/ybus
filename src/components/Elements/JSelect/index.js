import React, { Component } from "react";
import { Select } from "antd";
const { Option } = Select;

export default class JSelect extends Component {







  render() {

    var {
      options,
      optionValue, // name of value field
      optionLabel, // name of label field
      placeholder

    } = this.props;
    return (

      <Select

        showSearch
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
}

