import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`control-tabs-${index}`}
      aria-labelledby={`control-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `control-tab-${index}`,
    "aria-controls": `control-tabs${index}`
  };
}

export default function NavTabs(props) {
  const [value, setValue] = useState(props.defaultValue)
  return (
    <div className="nav-tabs">
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={(e, newValue) => {
            setValue(newValue);
            setTimeout(() => {
              props.onChangeSelected(newValue);
            }, 400);
          }}
          aria-label="control-tabs"
        >
          <Tab disableRipple disableFocusRipple label={props.labels[0]} {...a11yProps(0)} />
          <Tab disableRipple disableFocusRipple label={props.labels[1]} {...a11yProps(1)} />
          <Tab disableRipple disableFocusRipple label={props.labels[2]} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={props.value} index={0}>
        Diagram
      </TabPanel>
      <TabPanel value={props.value} index={1}>
        Words
      </TabPanel>
      <TabPanel value={props.value} index={2}>
        Clues
      </TabPanel>
    </div>
  );
}
