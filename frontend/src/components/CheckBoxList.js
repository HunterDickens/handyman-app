import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { blueGrey } from '@mui/material/colors';

const CheckboxList = ({
  items = [],
  defaultSelected = [],
  onChange,
  dense = false,
  showIcons = false,
  iconComponent = null,
}) => {
  const [checked, setChecked] = React.useState(defaultSelected);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    if (onChange) onChange(newChecked);
  };

  return (
    <List dense={dense}>
      {items.map((item) => {
        const labelId = `checkbox-list-label-${item}`;
        console.log(item);
        return (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={handleToggle(item)}>
              <Checkbox
                edge="start"
                checked={checked.indexOf(item) !== -1}
                tabIndex={-1}
                disableRipple
                slotProps={{
                  input: {
                    "aria-labelledby": labelId,
                  },
                }}
                sx={{
                  color: blueGrey[500],
                  '&.Mui-checked': {
                    color: blueGrey[600],
                  },
                }}
              />
              <ListItemText id={labelId} primary={item} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckboxList;
