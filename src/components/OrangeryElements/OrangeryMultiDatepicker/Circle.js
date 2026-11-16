import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Typography, ButtonBase } from '@mui/material'

const Circle = ({ label, disabled, checked, onCheck, style, isToday }) => {
  const handleClick = useCallback(
    () => {
      if (!disabled) {
        onCheck(!checked)
      }
    },
    [onCheck, disabled, checked]
  )

  return (
    <ButtonBase
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        backgroundColor: 'white',
        // marginLeft: 12
        ...(!checked && !disabled ? { color: "#2B2E33" } : {}),
        ...(disabled ? { color: "#5F7089" } : {}),
        ...(isToday ? { border: "2px solid #FF9900" } : {}),
        ...(checked && !disabled ? { backgroundColor: "#FF9900", color: "white" } : {}),
        ...(checked && disabled ? { backgroundColor: "#D7DBE1" } : {}),
        ...style
      }}
      disabled={disabled}
      onClick={handleClick}
    >
      <Typography
        color='inherit'
        variant='body1'
        style={{
          textAlign: 'center',
          ...(checked
            ? {
              color: "white"
            }
            : {}
          )
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  )
}

Circle.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Circle
