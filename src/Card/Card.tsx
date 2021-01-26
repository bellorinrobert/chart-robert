import React from 'react';
import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FirstChart from '../Chart/FirstChart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Chip from '@material-ui/core/Chip';
import { Avatar, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Router } from '@material-ui/icons';

const greenTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#28c76f',
      contrastText: '#fff',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  headerTitle: {
    display: 'block',
  },
  titleClass: {
    color: '#000',
    fontWeight: 700,
    fontSize: '24px',
  },
  percentage: {
    color: '#28c76f',
    fontWeight: 600,
    fontSize: '16px',
  },
  subHeader: {
    textAlign: 'left',
    color: '#cdcdcd',
    marginTop: '-24px',
  },
  chipStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyTitle: {
    fontWeight: 600,
    textAlign: 'left',
  },
  chipFont: {
    fontWeight: 600,
  },
  linkText: {
    color: '#3586ff',
    fontWeight: 600,
    textDecoration: 'none',
    float: 'left',
  },
  avatarImage: {
    margin: '16px'
  },
  // chipType: {
  //   display: flex,
  //   'align-items': center;
  //   justify-content: space-between;
  // }
}));

const chipContent = 'Limit';
const price = 1373.54;
const percentage = 0.51;
const imageUrl = 'https://cdn.iconscout.com/icon/free/png-512/ethereum-1-283135.png';
const avatarImage =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80';

const Chart = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<img src={imageUrl} width="32px" height="32px" />}
        title={
          <div className={classes.chipStyle}>
            {/* <p > */}
            <Typography className={classes.titleClass} variant="h5">
              ${price}
            </Typography>
            <span>
              <Typography variant="body1" className={classes.percentage}>
                {percentage}%
              </Typography>
            </span>
            {/* </p> */}
            <MuiThemeProvider theme={greenTheme}>
              <Chip
                label={chipContent}
                className={classes.chipFont}
                color="primary"
                size="medium"
              />
            </MuiThemeProvider>
          </div>
        }
      />
      <CardContent>
        <Typography variant="body2" className={classes.subHeader}>
          {' '}
          24s ago{' '}
        </Typography>
        <ParentSize>{({ width, height }) => <FirstChart width={250} height={150} />}</ParentSize>,
        <Typography variant="h5" className={classes.bodyTitle}>
          TA stars are aligned. It's time to buy the bottom the folks
        </Typography>
        <Avatar className={classes.avatarImage} alt="Remy Sharp" src={avatarImage} />
        <Link className={classes.linkText} component={RouterLink} to="#">
          Copy this trade
        </Link>
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
    </Card>
  );
};

export default Chart;
