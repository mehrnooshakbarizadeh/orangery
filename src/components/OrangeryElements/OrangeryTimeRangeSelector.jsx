import React from "react"
// import { Box, Typography } from "@mui/material"
import moment from "moment"
import i18next from "i18next";
import { Box, Grid, Typography } from "@mui/material";

export default function OrangeryTimeRangeSelector({
  timeSlots,
  startIndex,
  setStartIndex,
  endIndex,
  setEndIndex,
  error,
  setError,
}) {
  // const [dragging, setDragging] = React.useState(false)
  // const [startDragged, setStartDragged] = React.useState(false)
  // const [endDragged, setEndDragged] = React.useState(false)

  // const onDrag = dragging => {
  //   setDragging(dragging)
  // }
  // const onDragStart = dragging => setStartDragged(dragging)
  // const onDragEnd = dragging => setEndDragged(dragging)

  let startToBeSelect = React.useRef(false);
  // let endSelecting = false;

  React.useEffect(() => {
    if (startIndex === undefined || endIndex === undefined)
      setError(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex, endIndex])

  function handleTimeSlotClick(e, selectedIndex) {
    if (e)
      e.stopPropagation();

    // selection behavior
    if (startIndex === undefined) {
      startToBeSelect.current = true;
    }
    if (startIndex === selectedIndex && endIndex === selectedIndex) {
      startIndex = undefined;
      endIndex = undefined;
      startToBeSelect.current = true;
    } else if (startIndex === selectedIndex) {
      startIndex = selectedIndex + 1;
      startToBeSelect.current = false;
    } else if (endIndex === selectedIndex) {
      endIndex = selectedIndex - 1;
      startToBeSelect.current = true;
    } else if (startIndex !== undefined || endIndex !== undefined) {
      if (selectedIndex < startIndex) {
        startIndex = selectedIndex
        startToBeSelect.current = false;
      } else if (selectedIndex > endIndex) {
        endIndex = selectedIndex
        startToBeSelect.current = true;
      } else if (Math.abs(startIndex - selectedIndex)
        === Math.abs(endIndex - selectedIndex) || true) {
        if (startToBeSelect.current) {
          startIndex = selectedIndex
          startToBeSelect.current = false;
        } else {
          endIndex = selectedIndex
          startToBeSelect.current = true;
        }
        // } else if (Math.abs(startIndex - selectedIndex)
        //   < Math.abs(endIndex - selectedIndex)) {
        //   startIndex = selectedIndex
        //   startToBeSelect.current = false;
        // } else {
        //   endIndex = selectedIndex
        //   startToBeSelect.current = true;
      }
    } else {
      startIndex = selectedIndex
      endIndex = selectedIndex
      startToBeSelect.current = false;
    }

    if (setStartIndex)
      setStartIndex(startIndex)
    if (setEndIndex)
      setEndIndex(endIndex)

    // error behavior
    for (let i = 0; i < timeSlots.length; i++) {
      let selectedIndex = i
      if (selectedIndex <= endIndex && selectedIndex >= startIndex && !timeSlots[i].available) {
        setError(true)
        break
      }
      setError(false)
    }
  }

  // function handleTimeSlotClick(e, selectedIndex) {
  //   startIndex = selectedIndex
  //   endIndex = selectedIndex

  //   //if (e)
  //   //e.stopPropagation();

  //   // selection behavior
  //   // if (selectedInterval.length > 0) {
  //   //   if (startDragged) {
  //   //     if (selectedIndex < startIndex)
  //   //       startIndex = selectedIndex
  //   //     else if (selectedIndex >= endIndex) {
  //   //       onDrag(false)
  //   //       onDragStart(false)
  //   //     }
  //   //     else
  //   //       startIndex = selectedIndex
  //   //   }
  //   //   else if (endDragged) {
  //   //     if (selectedIndex > endIndex)
  //   //       endIndex = selectedIndex
  //   //     else if (selectedIndex <= startIndex) {
  //   //       onDrag(false)
  //   //       onDragEnd(false)
  //   //     }
  //   //     else
  //   //       endIndex = selectedIndex
  //   //   }
  //   // } else {
  //   //   startIndex = selectedIndex
  //   //   endIndex = selectedIndex
  //   // }

  //   onChange(selectedInterval)

  //   // error behavior
  //   for (let i = 0; i < timeSlots.length; i++) {
  //     let selectedIndex = timeSlots[i].selectedIndex
  //     if (selectedIndex <= endIndex && selectedIndex >= startIndex && !timeSlots[i].available) {
  //       errorHandler(true)
  //       break
  //     }
  //   }
  // }

  return (
    <Box
      // className='flex space-y-2 flex-col basis-full p-2 mt-2 pb-10'
      sx={{
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        width: "100%",
      }}
    >
      <Grid container
      // draggable={false}
      // onMouseDown={(e) => { onDrag(true) }}
      // onMouseUp={(e) => { onDrag(false) }}
      // style={{
      //   display: "flex",
      //   flexWrap: "wrap",
      //   flexDirection: "row",
      //   gap: 6
      // }}
      // className="grid grid-flow-row grid-cols-4 md:grid-cols-8 gap-1"
      >
        {timeSlots.map((timeSlot, index) => {
          return <SelectableTimeSlot
            key={timeSlot.repr}
            timeSlot={timeSlot}
            index={index}
            selected={index >= startIndex && index <= endIndex}
            isFirst={startIndex && index === startIndex}
            isLast={endIndex && index === endIndex}
            disabled={!timeSlot.available}
            // dragging={dragging}
            // endDragged={endDragged}
            // onEndDrag={(drag) => onDragEnd(drag)}
            // startDragged={startDragged}
            // onStartDrag={(drag) => {
            //   onDragStart(drag)
            // }}
            onChange={(e, selectedIndex) => handleTimeSlotClick(e, selectedIndex)}
          />
        })}
      </Grid>
    </Box>
  );
}


function SelectableTimeSlot({
  timeSlot,
  index,
  selected,
  isFirst,
  isLast,
  disabled,
  // dragging,
  // endDragged,
  // onEndDrag,
  // startDragged,
  // onStartDrag,
  onChange
}) {
  return <Grid item xs={3}>
    <Box
      onClick={(e) => {
        onChange(e, index)
      }}
      // onMouseDown={(e) => {
      //   if (isLast) { onEndDrag(true) }
      //   else if (isFirst) { onStartDrag(true) }
      // }}
      // onMouseUp={(e) => {
      //   if (endDragged) { onEndDrag(false) }
      //   else if (startDragged) { onStartDrag(false) }
      // }}
      // onMouseOver={(e) => {
      //   if (dragging) {
      //     if (endDragged || startDragged) {
      //       onChange(e, index)
      //     }
      //   }
      // }}
      // className="col-span-1 p-2 md:p-0"
      sx={{
        // width: 75,
        height: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // flexGrow: 1,
        border: "1px solid #A5AAB4",
        borderRadius: 5,
        cursor: "pointer",
        m: .5,
        ...(selected
          ? !disabled
            ? { border: "1px solid #42B863", backgroundColor: "#42B863" }
            : { border: "1px solid #FF3D00", backgroundColor: "#FF3D00" }
          : { border: "1px solid #C9CCD2" }),
        ...(isFirst && isLast
          ? { borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderTopRightRadius: 5, borderBottomRightRadius: 5 }
          : {}
        ),
        ...(isFirst && !isLast
          ? { borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderTopRightRadius: 0, borderBottomRightRadius: 0 }
          : {}
        ),
        ...(isLast && !isFirst
          ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 5, borderBottomRightRadius: 5 }
          : {}
        ),
        ...(!isFirst && !isLast
          ? { borderRadius: 0 }
          : {}
        ),
        ...(!selected && !isFirst && !isLast && disabled ? { border: "1px solid #EDEEF0", backgroundColor: "#EDEEF0" } : {}),
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          ...(selected
            ? { color: "white" }
            : disabled
              ? { color: "#C9CCD2" }
              : { color: "#55585C" }
          ),
        }}
      >
        {timeSlot.repr}
      </Typography>
    </Box>
  </Grid>
}