import React, { useState, useRef, useEffect } from "react";

import PropTypes from "prop-types";

import classes from "./TextInput.module.css";

const TextInput = (props) => {
  return (
    <div className={`${classes.container} ${props.className}`}>
      <label for={props.id}>{props.label}</label>
      <input
        type="text"
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default TextInput;
