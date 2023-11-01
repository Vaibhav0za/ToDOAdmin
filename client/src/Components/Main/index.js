import { React, } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
 import Tab from '../Tab'


export default function AddToDo() {
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.auth);
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
    toast("User logout", { type: "success" });
  };

  return (
    <Grid  container>
      <Grid 
        backgroundColor={theme.palette.primary.main}
        container
        p={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h4" sx={{ color: "white", textAlign: "center" }}>
          {"Hello " + username}
        </Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          type="submit"
          color="secondary"
          sx={{ color: theme.palette.primary.main }}
        >
          LogOut
        </Button>
      </Grid>

<Grid sx={{ height:'92vh'}} container>
<Tab />
</Grid>
    </Grid>
  );
}
