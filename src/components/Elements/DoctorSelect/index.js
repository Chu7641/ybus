import React, { Component } from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
const { Option } = Select;

export default function DoctorSelect(props) {

  var {
    defaultText,
    selected,
    options,
    attr,
    optionValue, // name of value field
    optionLabel, // name of label field
    additionalLabel,
    onChange,
    defaultTextValue,

    ...rest
  } = props;

  let value = selected ? selected : "";

  if (options.length) {
    let temp = options.find((option) => option[optionValue] == selected);
    if (!temp) value = "";

    if (!defaultText) {
      value = options[0][optionValue];
    }
  }


  return (
    <Select
      defaultValue={value}
      {...rest}
      onChange={(value, option) => onChange(value, option)
      }
      filterOption={(input, option) => {
        return (
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
          0
        );
      }}

    >
      {
        defaultText ? (
          <Option value={""} > {defaultText}</Option>
        ) : null}
      {
        options.map((option, index) => {
          let label = option[optionLabel];
          if (additionalLabel) {
            label = "(" + additionalLabel + ") " + option[optionLabel];
          }
          return (
            <Option
              key={`${option[optionValue]}_${index}`}
              value={option[optionValue]}
            >
              {option[optionLabel]}
            </Option>
          );
        })
      }
    </Select >
  )
}

