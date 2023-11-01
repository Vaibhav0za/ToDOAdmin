import { React, useState, useEffect } from "react";
import { Grid, Typography, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import BaseColor from "../config/color";
import { getDueTasks } from "../service/api";
import moment from "moment";

export default function TAskCompleted() {
  const [taskData, setTaskData] = useState("");
  const [loading, setLoading] = useState(false);
  const { username } = useSelector((state) => state.auth);
  const { userid } = useSelector((state) => state.auth);

  useEffect(() => {
    getTaskData();
    setLoading(true);
  }, []);

  const getTaskData = async () => {
    const res = await getDueTasks(userid, username);
    console.log("username =====>>>>> ", username);
    setTaskData(res?.data?.dueTasks);
    setLoading(false);
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
      field: "createdBy",
      headerName: "DUE BY",
      width: 400,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dueUsername = params.row.taskStatus.map((val, index) => {
          if (val.status === "due") {
            return index === params.row.taskStatus.length - 1
              ? val.username
              : val.username + " , ";
          }
        });

        return (
          <Chip
            sx={{
              color: BaseColor.error,
              background: `${BaseColor.error}1A`,
              fontWeight: "bold",
            }}
            label={dueUsername}
          />
        );
      },
    },

    {
      flex: 0.1,
      minWidth: 230,
      sortable: false,
      field: "deadLine",
      headerName: "DUE AT",
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
  ];

  return (
    <Grid container>
      <Grid justifyContent={"center"} container sx={{ mt: 2 }}>
        <div>
          <DataGrid
            rows={taskData}
            columns={columns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </Grid>
    </Grid>
  );
}
