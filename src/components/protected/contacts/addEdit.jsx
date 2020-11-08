import React, {useState, useEffect} from 'react';
import { createHashHistory } from "history";

// Material UI
import { Backdrop, CircularProgress, Button, TextField, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

// API Service
import { apiConfig } from '../../../config/apiConfig/index';

const history = createHashHistory();

function AlertNew(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer - 1,
    color: '#fff',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  backButton: {
    marginRight: '10px'
  },
  submitPadding: {
    marginTop: '10px'
  }
}));

export default function AddContacts(props) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inCallCnt, setInCallCnt] = useState('');
  const [location, setLocation] = useState('');
  const [outCallCnt, setOutCallCnt] = useState('');
  const [showError, setShowError] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [errorMsg, setErrorMsg] = useState('Something went wonrg, Please try again later!');
  const [editId] = useState(props.match.params.id ? props.match.params.id : null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (editId) {
      setLoader(true);
      apiConfig().get(`contacts/${editId}`)
        .then(res => {
          setLoader(false);
          if (res.data.status === 200) {
            let data = res.data.data;
            setName(data.name);
            setPhoneNumber(data.phoneNumber);
            setInCallCnt(data.inCallCnt);
            setLocation(data.location);
            setOutCallCnt(data.outCallCnt);
          } else {
            setErrorMsg('Something went wonrg, Please try again later!');
            setShowError(true);
          }
        })
        .catch(() => {
          setLoader(false);
          setErrorMsg('Something went wonrg, Please try again later!');
          setShowError(true);
        })
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(false);
    let options = {
      method: 'POST',
      url: `contacts`,
    };
    if (editId) {
      options = {
        method: 'PUT',
        url: `contacts/${editId}`,
      };
    }
    apiConfig()(options)
      .then(res => {
        if (res.data.status === 200) {
          setShowError(true);
          setSeverity('success');
          setErrorMsg(res.data.message);
          setTimeout(() => {
            history.push('/contacts')
          }, 2000)
        } else {
          setShowError(true);
          setSeverity('error');
          setErrorMsg('Something went wonrg, Please try again later!');
        }
      })
      .catch(() => {
        setShowError(true);
        setSeverity('error');
        setErrorMsg('Something went wonrg, Please try again later!');
      })
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {editId ? 'Edit' : 'Add'} Contact
        </Typography>
          <Snackbar open={showError} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setShowError(false)}>
            <AlertNew severity={severity}>
              {errorMsg}
            </AlertNew>
          </Snackbar>
          <Backdrop className={classes.backdrop} open={loader}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="Name"
              autoComplete="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="inCallCnt"
              label="Incoming Call Count"
              name="inCallCnt"
              autoComplete="inCallCnt"
              value={inCallCnt}
              onChange={(e) => setInCallCnt(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location"
              name="location"
              autoComplete="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="outCallCnt"
              label="Outgoing Call Count"
              name="outCallCnt"
              autoComplete="outCallCnt"
              value={outCallCnt}
              onChange={(e) => setOutCallCnt(e.target.value)}
            />
            <Grid container justify="flex-end" className={classes.submitPadding}>
              <Button
                type="submit"
                variant="contained"
                color="default"
                className={classes.backButton}
                onClick={(e) => { e.preventDefault(); history.push('/contacts') }}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={(e) => handleSubmit(e)}
              >
                {editId ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}