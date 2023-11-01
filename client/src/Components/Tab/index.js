import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AllTask from "../../Pages/AllTask";
import Grid from "@mui/material/Grid";
import DueTask from "../../Pages/DueTask";
import AllUser from "../../Pages/AllUser";
import FollowUser from "../../Pages/followUser";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", height: "100%" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="All Task" {...a11yProps(0)} />
        <Tab label="Due Task" {...a11yProps(1)} />
        <Tab label="All User" {...a11yProps(2)} />
        <Tab label="Follow" {...a11yProps(3)} />
        <Tab label="Item Six" {...a11yProps(4)} />
        <Tab label="Item Seven" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid sx={{ width: "90vw" }}>
          <AllTask />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid sx={{ width: "90vw" }}>
          <DueTask />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid sx={{ width: "90vw" }}>
          <AllUser />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Grid sx={{ width: "90vw" }}>
          <FollowUser />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Seven
      </TabPanel>
    </Box>
  );
}
