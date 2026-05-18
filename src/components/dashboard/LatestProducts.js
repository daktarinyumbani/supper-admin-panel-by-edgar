import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 16,
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    overflow: 'hidden'
  },
  headerRoot: {
    padding: theme.spacing(2.5, 3)
  },
  headerTitle: {
    fontWeight: 700,
    color: '#0F172A'
  },
  headerSubTitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: theme.spacing(0.5)
  },
  listItem: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#F8FAFC'
    }
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF'
  },
  productImage: {
    height: 48,
    width: 48,
    borderRadius: 12,
    objectFit: 'cover'
  },
  primaryText: {
    fontWeight: 600,
    color: '#0F172A'
  },
  secondaryText: {
    color: '#64748B',
    fontSize: 13
  },
  actionButton: {
    color: '#64748B'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2)
  },
  viewButton: {
    fontWeight: 600,
    textTransform: 'none'
  }
}));

const products = [
  {
    id: uuid(),
    name: 'Dropbox',
    imageUrl: '/static/images/products/product_1.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Medium Corporation',
    imageUrl: '/static/images/products/product_2.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Slack',
    imageUrl: '/static/images/products/product_3.png',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Lyft',
    imageUrl: '/static/images/products/product_4.png',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'GitHub',
    imageUrl: '/static/images/products/product_5.png',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const LatestProducts = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} {...props}>
      <CardHeader
        className={classes.headerRoot}
        title={(
          <Typography variant="h6" className={classes.headerTitle}>
            Latest Products
          </Typography>
        )}
        subheader={(
          <Typography className={classes.headerSubTitle}>
            {products.length}
            {' '}
            products available in total
          </Typography>
        )}
      />

      <Divider />

      <List disablePadding>
        {products.map((product, index) => (
          <ListItem
            divider={index < products.length - 1}
            key={product.id}
            className={classes.listItem}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar} variant="rounded">
                <img
                  alt={product.name}
                  src={product.imageUrl}
                  className={classes.productImage}
                />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={(
                <Typography variant="body1" className={classes.primaryText}>
                  {product.name}
                </Typography>
              )}
              secondary={(
                <Typography variant="body2" className={classes.secondaryText}>
                  Updated
                  {' '}
                  {product.updatedAt.fromNow()}
                </Typography>
              )}
            />

            <IconButton edge="end" size="small" className={classes.actionButton}>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box className={classes.footer}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          className={classes.viewButton}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

LatestProducts.defaultProps = {
  className: ''
};

export default LatestProducts;
