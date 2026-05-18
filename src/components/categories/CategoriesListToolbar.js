import { Box, Card, CardContent, Typography } from '@material-ui/core';

const CategoriesListToolbar = (props) => (
  <Box {...props}>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <Typography color="textPrimary" gutterBottom variant="h3">
              Categories
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default CategoriesListToolbar;
