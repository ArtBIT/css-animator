import { useState, useCallback, useEffect } from "react";
import Container from "@material-ui/core/Container";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import BuyMeCoffee from "../BuyMeCoffee";

import c from "classnames";
import s from "./AnimationForm.module.css";

const timeUnits = [{ value: "s" }, { value: "ms" }];
const stepsPositions = [
  { label: "End", value: "jump-end" },
  { label: "Start", value: "jump-start" },
  { label: "Both", value: "jump-both" },
  /*
  { label: "None", value: "jump-none" },
  */
];
const timingFunctions = [
  {
    id: 1,
    name: "native",
    items: [
      { value: "linear" },
      { value: "ease" },
      { value: "ease-in" },
      { value: "ease-out" },
      { value: "ease-in-out" },
    ],
  },
  {
    id: 1,
    name: "Penner easing",
    items: [
      // penner equations (approximated)
      {
        label: "ease-in-quad",
        value: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      },
      {
        label: "ease-in-cubic",
        value: "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
      },
      {
        label: "ease-in-quart",
        value: "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
      },
      {
        label: "ease-in-quint",
        value: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
      },
      {
        label: "ease-in-sine",
        value: "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
      },
      {
        label: "ease-in-expo",
        value: "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
      },
      {
        label: "ease-in-circ",
        value: "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
      },
      {
        label: "ease-in-back",
        value: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
      },

      {
        label: "ease-out-quad",
        value: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
      },
      {
        label: "ease-out-cubic",
        value: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      },
      {
        label: "ease-out-quart",
        value: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
      },
      {
        label: "ease-out-quint",
        value: "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
      },
      {
        label: "ease-out-sine",
        value: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
      },
      {
        label: "ease-out-expo",
        value: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
      },
      {
        label: "ease-out-circ",
        value: "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
      },
      {
        label: "ease-out-back",
        value: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
      },

      {
        label: "ease-in-out-quad",
        value: "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
      },
      {
        label: "ease-in-out-cubic",
        value: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
      },
      {
        label: "ease-in-out-quart",
        value: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
      },
      {
        label: "ease-in-out-quint",
        value: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
      },
      {
        label: "ease-in-out-sine",
        value: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
      },
      {
        label: "ease-in-out-expo",
        value: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
      },
      {
        label: "ease-in-out-circ",
        value: "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
      },
      {
        label: "ease-in-out-back",
        value: "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
      },
    ],
  },
];
const directions = [
  { value: "normal" },
  { value: "reverse" },
  { value: "alternate" },
  { value: "alternate-reverse" },
];
const fillModes = [
  { value: "none" },
  { value: "forwards" },
  { value: "backwards" },
  { value: "both" },
];

function AnimationForm({ className, onChange }) {
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [stepsPosition, setStepsPosition] = useState("jump-end");
  const [steps, setSteps] = useState(1);
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("both");
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState("s");
  const [delay, setDelay] = useState(0);
  const [delayUnit, setDelayUnit] = useState("s");
  const [timingFunction, setTimingFunction] = useState("linear");
  const handleChange = useCallback((event) => {
    switch (event.target.name) {
      case "duration":
        setDuration(event.target.value);
        break;
      case "durationUnit":
        setDurationUnit(event.target.value);
        break;
      case "delay":
        setDelay(event.target.value);
        break;
      case "delayUnit":
        setDelayUnit(event.target.value);
        break;
      case "timingFunction":
        setTimingFunction(event.target.value);
        break;
      case "stepsEnabled":
        setStepsEnabled(event.target.checked);
        break;
      case "steps":
        setSteps(event.target.value);
        break;
      case "fillMode":
        setFillMode(event.target.value);
        break;
      case "direction":
        setDirection(event.target.value);
        break;
      case "stepsPosition":
        setStepsPosition(event.target.value);
        break;
    }
  }, []);

  useEffect(() => {
    const options = {
      duration: durationUnit == "s" ? duration * 1000 : duration,
      fill: fillMode,
      direction,
      easing: stepsEnabled
        ? `steps(${steps},${stepsPosition})`
        : timingFunction,
    };
    onChange && onChange(options);
  }, [
    direction,
    fillMode,
    duration,
    durationUnit,
    timingFunction,
    delay,
    delayUnit,
    stepsEnabled,
    steps,
    stepsPosition,
  ]);

  const renderSelectGroup = (group) => {
    const items = group.items.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option?.label ?? option.value}
        </MenuItem>
      );
    });
    return [<ListSubheader>{group.name}</ListSubheader>, items];
  };
  return (
    <div className={c(s["form"], className)}>
      <Box component="form" autoComplete="off" noValidate>
        <FormGroup className={s["form-row"]}>
          <TextField
            className={s["flex-grow-and-shrink"]}
            name="duration"
            label="Duration"
            defaultValue="1"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={handleChange}
            required
          />
          <TextField
            name="durationUnit"
            value={durationUnit}
            onChange={handleChange}
            select
          >
            {timeUnits.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option?.label ?? option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
        <FormGroup className={s["form-row"]}>
          <TextField
            disabled={stepsEnabled}
            name="timingFunction"
            label="Timing function"
            fullWidth
            value={timingFunction}
            onChange={handleChange}
            helperText="Please select the timing function"
            select
          >
            {timingFunctions.map((group) => renderSelectGroup(group))}
          </TextField>
        </FormGroup>
        <FormGroup className={s["form-row"]}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleChange}
                name="stepsEnabled"
                checked={stepsEnabled}
              />
            }
            label="Use steps"
          />
        </FormGroup>
        <FormGroup className={s["form-row"]}>
          <TextField
            className={s["flex-grow-and-shrink"]}
            name="steps"
            label="Steps"
            defaultValue="1"
            value={steps}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={handleChange}
            disabled={!stepsEnabled}
          />
          <TextField
            name="stepsPosition"
            value={stepsPosition}
            onChange={handleChange}
            disabled={!stepsEnabled}
            select
          >
            {stepsPositions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option?.label ?? option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
        {/*
        <FormGroup className={s["form-row"]}>
          <TextField
            className={s["flex-grow-and-shrink"]}
            name="delay"
            label="Delay"
            defaultValue="0"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={handleChange}
            required
          />
          <TextField
            name="delayUnit"
            value={delayUnit}
            onChange={handleChange}
            select
          >
            {timeUnits.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option?.label ?? option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
        */}
        <FormGroup className={s["form-row"]}>
          <TextField
            disabled={stepsEnabled}
            name="direction"
            label="Direction"
            fullWidth
            value={direction}
            onChange={handleChange}
            select
          >
            {directions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option?.label ?? option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
        <FormGroup className={s["form-row"]}>
          <TextField
            disabled={stepsEnabled}
            name="fillMode"
            label="fill-mode"
            fullWidth
            value={fillMode}
            onChange={handleChange}
            select
          >
            {fillModes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option?.label ?? option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
        <BuyMeCoffee />
      </Box>
    </div>
  );
}

export default AnimationForm;
