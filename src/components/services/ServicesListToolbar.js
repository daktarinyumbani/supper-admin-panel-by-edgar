import {
  Box,
  Card,
  CardContent,
  Typography
  // TextField,
  // InputAdornment,
  // SvgIcon
} from '@material-ui/core';
// import { Search as SearchIcon } from 'react-feather';

const ServicesListToolbar = (props) => (
  <Box {...props}>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <Typography color="textPrimary" gutterBottom variant="h3">
              Services
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default ServicesListToolbar;
