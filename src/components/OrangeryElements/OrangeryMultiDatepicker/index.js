import React, { useReducer, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import DateUtilities from './utils'
import Calendar from './Calendar'
import { Dialog, Button, Box, Typography, IconButton } from '@mui/material'

import OrangeryTextField from "../OrangeryTextField"
import { useTranslation } from "react-i18next";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import CalendarNotAllowedIcon from '../../../assets/svg/calendar-not-allowed.svg';

import moment from "moment"

function initState(selectedDates) {
  return {
    selectedDates: selectedDates ? [...selectedDates] : [],
    minDate: null,
    maxDate: null
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'setSelectedDates':
      return { ...state, selectedDates: action.payload }
    default:
      return new Error('wrong action type in multiple date picker reducer')
  }
}

const OrangeryMultiDatepicker = ({
  small,
  readOnly,
  onSubmit,
  onCancel,
  onRemoveAll,
  selectedDates: outerSelectedDates,
  disabledDates,
  disablePast,
  withoutNote,
  cancelButtonText,
  submitButtonText = 'Submit',
  selectedDatesTitle = 'Selected Dates',
  error,
  errorMessage,
  preventRemoveLast
}) => {
  const { t } = useTranslation("request");

  if (cancelButtonText == null) {
    cancelButtonText = readOnly ? 'Dismiss' : 'Cancel'
  }
  const [open, setOpen] = React.useState(false)

  const [{ selectedDates, minDate, maxDate }, dispatch] = useReducer(
    reducer,
    outerSelectedDates,
    initState
  )

  const onSelect = useCallback(
    day => {
      if (readOnly) return

      if (DateUtilities.dateIn(selectedDates, day)) {
        dispatch({
          type: 'setSelectedDates',
          payload: selectedDates.filter(date => !DateUtilities.isSameDay(date, day))
        })
      } else {
        dispatch({ type: 'setSelectedDates', payload: [...selectedDates, day] })
      }
    },
    [selectedDates, dispatch, readOnly]
  )

  const onRemoveAtIndex = useCallback(
    index => {
      if (readOnly) return
      const newDates = [...selectedDates]
      if (index > -1 && (!preventRemoveLast || (preventRemoveLast && newDates.length > 1))) {
        newDates.splice(index, 1)
      }

      dispatch({ type: 'setSelectedDates', payload: newDates })
    },
    [selectedDates, dispatch, readOnly, preventRemoveLast]
  )

  const dismiss = useCallback(
    () => {
      dispatch({ type: 'setSelectedDates', payload: outerSelectedDates })
      onCancel()
      setOpen(false)
    },
    [dispatch, onCancel, outerSelectedDates]
  )

  const handleCancel = useCallback(
    e => {
      e.preventDefault()
      dismiss()
    },
    [dismiss]
  )

  const handleOk = useCallback(
    e => {
      e.preventDefault()
      if (readOnly) return
      onSubmit(selectedDates)
      setOpen(false)
    },
    [onSubmit, selectedDates, readOnly]
  )

  const handleRemoveAll = useCallback(
    () => {
      dispatch({ type: 'setSelectedDates', payload: [new Date()] })
      if (onRemoveAll)
        onRemoveAll()
      setOpen(false)
    },
    [dispatch, onRemoveAll]
  )

  useEffect(
    () => {
      if (open) {
        dispatch({
          type: 'setSelectedDates',
          payload: outerSelectedDates != null ? outerSelectedDates : []
        })
      }
    },
    [open, outerSelectedDates]
  )

  return (
    <>{!small
      ? <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            position: "relative",
            flexBasis: {
              xs: "100%",
              // sm: "50%",
            },
            // pb: 3
          }}
        >
          <OrangeryTextField
            id="block_dates"
            label={"Block Days"}
            type="text"
            pr={10}
            name="block_dates"
            fullWidth
            value={
              //   selectedDates.sort((a, b) => a - b).map((selectedDate) => new Date(selectedDate).toLocaleString("de-DE", {
              //   month: "long",
              //   year: "numeric",
              //   day: "numeric",
              // })).join(", ")
              selectedDates.length === 0
                ? ("add block days")
                : selectedDates.length === 1
                  ? ("1 block day selected")
                  : ("${count} block days selected").replace("${count}", selectedDates.length.toString())
            }
            error={error}
            helperText={errorMessage}
          />
          <Button
            onClick={() => setOpen(true)}
            sx={{
              position: "absolute",
              top: 10,
              right: 9,
              fontSize: 14,
              fontWeight: 700,
              color: "#074EE8"
            }}
          >
            {selectedDates.length > 0 ? "Change" : "Select"}
          </Button>
        </Box>

        {!withoutNote &&
          <Box
            sx={{
              alignItems: "start",
              flexBasis: {
                xs: "100%",
                // sm: "50%",
              },
              pl: {
                xs: 0,
                // sm: 3,
              },
              // pb: 3
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0,
                mt: {
                  xs: 0,
                  sm: 1.5,
                },
                height: 34
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {selectedDates.length === 0
                  ? ("no day selected.")
                  : selectedDates.length === 1
                    ? ("one day selected.")
                    : ("${count} days selected.").replace("${count}", selectedDates.length.toString())
                }
              </Typography>

              {/* {selectedDates.length > 0 &&
          <IconButton
            size="small"
            onClick={handleRemoveAll}
          >
            <ReplayCircleFilledIcon />
          </IconButton>
        } */}

              {(selectedDates.length > 1
                || (selectedDates.length === 1 && (moment(selectedDates[0]).format("YYYY-MM-DD") !== moment(new Date()).format("YYYY-MM-DD")))
              ) &&
                <Button
                  onClick={handleRemoveAll}
                  sx={{
                    px: 0,
                    py: 0,
                    minWidth: 0
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700
                    }}
                  >
                    &nbsp;
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700
                    }}
                  >
                    (
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      textDecoration: "underline"
                    }}
                  >
                    {("Reset")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700
                    }}
                  >
                    )
                  </Typography>
                </Button>
              }
            </Box>
          </Box>
        }
      </Box>
      : <IconButton
        // size="small"
        onClick={() => setOpen(true)}
      >
        <CalendarNotAllowedIcon />
      </IconButton>
    }
      <Dialog
        open={open}
        sx={{
          "& .MuiPaper-root": {  ////////!!!!!!!! not working!?
            minHeight: 482,
            maxHeight: 482,
            display: 'flex',
            marign: {
              xs: `${8}px`,
              sm: 0
            }
          }
        }}
      >
        {/* <DialogContent> */}
        <Calendar
          selectedDates={selectedDates}
          disabledDates={disabledDates}
          disablePast={disablePast}
          onSelect={onSelect}
          onRemoveAtIndex={onRemoveAtIndex}
          minDate={minDate}
          maxDate={maxDate}
          onCancel={handleCancel}
          onOk={handleOk}
          readOnly={readOnly}
          cancelButtonText={cancelButtonText}
          submitButtonText={submitButtonText}
          selectedDatesTitle={selectedDatesTitle}
          preventRemoveLast={preventRemoveLast}
        />
        {/* </DialogContent> */}
      </Dialog >
    </>
  )
}

OrangeryMultiDatepicker.propTypes = {
  small: PropTypes.bool,
  readOnly: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func,
  selectedDates: PropTypes.array,
  disabledDates: PropTypes.array,
  disablePast: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  selectedDatesTitle: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  preventRemoveLast: PropTypes.bool,
}

export default OrangeryMultiDatepicker
