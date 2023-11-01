import { React, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Tooltip,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CAutoComplete from "../Components/CAutoComplete/CAutoComplete";
import { useTheme } from "@mui/material/styles";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import BaseColor from "../config/color";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  addTask,
  getTasks,
  getTask,
  editTask,
  deletetask,
  getUsers,
} from "../service/api";

const names = ["Low", "Medium", "Higher", "Critical"];

export default function AddToDo() {
  const [taskName, setTaskName] = useState("");
  const [taskNameError, setTaskNameError] = useState("");
  const [taskData, setTaskData] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [Id, setId] = useState("");
  const [editCountVal, SetEditCountVal] = useState(0);
  const [userName, setUserName] = useState({});
  const [userNameValue, setUserNameValue] = useState([]);
  const [value, setValue] = useState("all");
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);
  const { userid } = useSelector((state) => state.auth);
  const [deadLineVal, setDeadLineVal] = useState("");
  const theme = useTheme();
  const [taskPriority, setTaskPriority] = useState("");
  useEffect(() => {
    setLoading(true);
    getUserName();
  }, []);


  const getUserName = async () => {
    let res = await getUsers();
    setUserName(res.data.sortableUsers);
  };

  const handleChangeVal = (event) => {
    setValue(event.target.value);
  };


  const validate = () => {
    if (taskName.trim() === "") {
      setTaskNameError("Task Required");
    } else {
      handleAddTask();
    }
  };
  const handleAddTask = async () => {
    var today = new Date();
    var date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    if (!edit) {
      const data = {
        taskName: taskName,
        createdAt: dateTime,
        createdBy: username,
        taskPriority: taskPriority,
        deadLine: deadLineVal,
      };
      if (value === "specific") {
        data.createdFor = userNameValue;
      } else {
        data.createdFor = value;
      }
      await addTask(data);
    } else {
      const editData = {
        taskName: taskName,
        editedAt: dateTime,
        editCount: editCountVal + 1,
      };
      await editTask(editData, Id);
      toast("Task Updated", { type: "success" });
    }
    setId("");
    setTaskName("");
    setEdit(false);
  };


  const handleChange = (event) => {
    setTaskPriority(event.target.value);
  };

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format("DD-MM-YYYY HH:mm:ss");
    setDeadLineVal(formattedDate);
  };


  return (
    <Grid container>
      <Grid
        textAlign={"center"}
        mt={2}
        justifyContent={"center"}
        gap={1}
        container
      >
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Send Task To
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChangeVal}
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="specific"
              control={<Radio />}
              label="Specific"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid alignItems={"center"} justifyContent={"center"} gap={1} container>
        <Grid>
          <TextField
            id="outlined-basic"
            label={edit ? "Edit Task" : "Add Task"}
            value={taskName}
            variant="outlined"
            onChange={(e) => {
              setTaskName(e.target.value);
              setTaskNameError("");
            }}
          />
          <Typography sx={{ color: "red" }}>{taskNameError}</Typography>
        </Grid>
        <Grid>
          <div>
            <FormControl sx={{ m: 1, width: 150 }}>
              <InputLabel id="demo-multiple-chip-label">Priority</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                value={taskPriority}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Priority" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip
                      sx={{
                        backgroundColor:
                          taskPriority === "Low"
                            ? BaseColor.info
                            : taskPriority === "Medium"
                            ? BaseColor.success
                            : taskPriority === "Higher"
                            ? BaseColor.warning
                            : BaseColor.error,
                        color: "white",
                        fontWeight: "bold",
                      }}
                      icon={<Brightness1Icon color={"secondary"} />}
                      label={taskPriority}
                    />
                  </Box>
                )}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Brightness1Icon
                      sx={{
                        mr: 2,
                        color:
                          name === "Low"
                            ? BaseColor.info
                            : name === "Medium"
                            ? BaseColor.success
                            : name === "Higher"
                            ? BaseColor.warning
                            : BaseColor.error,
                      }}
                    />
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={handleDateChange} />
          </LocalizationProvider>
        </Grid>
        {value === "specific" ? (
          <Grid lg={1}>
            <CAutoComplete
              label="Add User"
              multiple
              options={userName}
              selectedValue={userNameValue}
              onSelect={(e) => {
                setUserNameValue(e);
              }}
            />
          </Grid>
        ) : null}

        <Grid>
          <Button onClick={validate} variant="contained">
            {edit ? "Edit Task" : "Add Task"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
