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
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BaseColor from "../config/color";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import CAutoComplete from "../Components/CAutoComplete/CAutoComplete";
import moment from "moment";
import {
  addTask,
  getTasks,
  getTask,
  editTask,
  deletetask,
  getUsers,
} from "../service/api";
import Modal from "../Components/CModal";

const names = ["Low", "Medium", "Higher", "Critical"];

export default function AddToDo() {
  const [taskData, setTaskData] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskNameError, setTaskNameError] = useState("");
  const [editCountVal, SetEditCountVal] = useState(0);
  const [userName, setUserName] = useState({});
  const [userNameValue, setUserNameValue] = useState([]);
  const [value, setValue] = useState("all");
  const [Id, setId] = useState("");
  const { username } = useSelector((state) => state.auth);
  const { userid } = useSelector((state) => state.auth);
  const [deadLineVal, setDeadLineVal] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  useEffect(() => {
    getTaskData();
    setLoading(true);
    getUserName();
  }, []);

  const getTaskData = async () => {
    let res = await getTasks(userid);
    setTaskData(res?.data?.tasks);
    setLoading(false);
    // toast(res?.data?.message , { type: "success" });
  };

  const deleteTaskData = async (id) => {
    await deletetask(id);
    getTaskData();
    toast("Task Deleted", { type: "success" });
  };

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
    if (!edit) {
      const data = {
        taskName: taskName,
        createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
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
        editedAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
        editCount: editCountVal + 1,
      };
      await editTask(editData, Id);
      toast("Task Updated", { type: "success" });
    }
    setId("");
    setTaskName("");
    setEdit(false);
    setTaskPriority("");
    setDeadLineVal("");
  };

  const handleChange = (event) => {
    setTaskPriority(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setDeadLineVal(newDate);
  };

  const columns = [
    {
      field: "id",
      headerName: "NO.",
      flex: 0.2,
      minWidth: 70,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const newStartIndex = 1;
        taskData.map((data, i) => {
          data.serialNumber = i + newStartIndex;
        });
        return <Typography>{params?.row?.serialNumber}</Typography>;
      },
    },
    {
      field: "taskName",
      headerName: "TASK",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taskPriority",
      headerName: "TASK PRIORITY",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Chip
            sx={{
              color:
                params?.row?.taskPriority === "Low"
                  ? BaseColor.info
                  : params?.row?.taskPriority === "Medium"
                  ? BaseColor.success
                  : params?.row?.taskPriority === "Higher"
                  ? BaseColor.warning
                  : BaseColor.error,
              background:
                params?.row?.taskPriority === "Low"
                  ? `${BaseColor.info}1A`
                  : params?.row?.taskPriority === "Medium"
                  ? `${BaseColor.success}1A`
                  : params?.row?.taskPriority === "Higher"
                  ? `${BaseColor.warning}1A`
                  : `${BaseColor.error}1A`,
              fontWeight: "bold",
            }}
            label={params?.row?.taskPriority}
          />
        );
      },
    },

    {
      field: "createdAt",
      headerName: "ASSIGNED AT",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const fullDate = params.value;
        const parsedDate = moment(fullDate, "MMMM Do YYYY, h:mm a");
        const formattedDate = parsedDate.format("MMM Do YYYY - h:mm a");

        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      field: "deadLine",
      headerName: "EXPIRING IN",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let formattedDate = "";
        if (params.value !== "") {
          formattedDate = moment(params?.value).format(
            "MMM Do YYYY, h:mm:ss a"
          );
        }
        return (
          <Typography>
            {formattedDate ? formattedDate : "NO DEADLINE"}
          </Typography>
        );
      },
    },
    {
      field: "Action",
      headerName: "ACTION",
      type: "number",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const countValue = params?.row?.editCount | 0;
        return (
          <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Grid item>
                <Tooltip
                  title={
                    countValue
                      ? "Last edited on " + params?.row?.editedAt
                      : "Edit"
                  }
                  placement="top"
                  arrow
                >
                  <Button
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <Badge badgeContent={countValue} color="primary">
                      <EditIcon color="info" />
                    </Badge>
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Delete" placement="top" arrow>
                  <Button
                    onClick={() => {
                      deleteTaskData(params.id);
                    }}
                  >
                    <DeleteIcon style={{ fontSize: 20, color: "red" }} />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    },
  ];

  return (
    <Grid container>
      <Grid container>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          Assign Task
        </Button>
      </Grid>
      <Grid
        justifyContent={"center"}
        alignItems={"center"}
        container
        sx={{ mt: 5 }}
      >
        <div>
          <DataGrid
            rows={taskData}
            columns={columns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
        <Grid container>
          <Modal
            visible={showModal}
            onClose={() => setShowModal(false)}
            title={"Assign Task"}
            children={
              <Grid sx={{ width: 600, background: "white", p: 3 }} container>
                <Grid>
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
                      <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="All"
                      />
                      <FormControlLabel
                        value="specific"
                        control={<Radio />}
                        label="Specific"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid gap={1} container>
                  <Grid gap={1} container>
                    <Grid item lg={5}>
                      <TextField
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        label={edit ? "Edit Task" : "Add Task"}
                        value={taskName}
                        variant="outlined"
                        onChange={(e) => {
                          setTaskName(e.target.value);
                          setTaskNameError("");
                        }}
                      />
                      <Typography sx={{ color: "red" }}>
                        {taskNameError}
                      </Typography>
                    </Grid>
                    <Grid item lg={5}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Priority
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          value={taskPriority}
                          onChange={handleChange}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Priority"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
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
                    </Grid>
                  </Grid>

                  <Grid gap={1} container>
                    <Grid item lg={5}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          value={deadLineVal}
                          onChange={handleDateChange}
                        />
                      </LocalizationProvider>
                    </Grid>
                    {value === "specific" ? (
                      <Grid lg={5}>
                        <CAutoComplete
                          label="Assign Task To"
                          multiple
                          options={userName}
                          selectedValue={userNameValue}
                          onSelect={(e) => {
                            setUserNameValue(e);
                          }}
                        />
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
                <Grid container mt={2}>
                  <Button onClick={validate} variant="contained">
                    {edit ? "Edit Task" : "Add Task"}
                  </Button>
                </Grid>
              </Grid>
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
