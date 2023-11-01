import { React, useState, useEffect } from "react";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BaseColor from "../config/color";
import { getUsers } from "../service/api";
import MessageIcon from '@mui/icons-material/Message';

export default function AddToDo() {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState({});

  const { userid } = useSelector((state) => state.auth);
  useEffect(() => {
    setLoading(true);
    getUserName();
  }, []);

  const deleteTaskData = async (id) => {
    toast("Task Deleted", { type: "success" });
  };

  const getUserName = async () => {
    let res = await getUsers();
    setUserName(res.data.sortableUsers);
    setLoading(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "NO.",
      minWidth: 70,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const newStartIndex = 1;
        userName.map((data, i) => {
          data.serialNumber = i + newStartIndex;
        });
        return <Typography>{params?.row?.serialNumber}</Typography>;
      },
    },

    {
      field: "name",
      headerName: "USERNAME",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "taskCompleted",
      headerName: "TASK COMPLETED",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => {
        return <Typography>{params?.row?.taskCompleted || 0}</Typography>;
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
                  <Button onClick={() => {}}>
                    <Badge badgeContent={countValue} color="primary">
                      <MessageIcon color="info" />
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
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      container
      sx={{ mt: 5 }}
    >
      <div>
        <DataGrid
          rows={userName}
          columns={columns}
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
  );
}
