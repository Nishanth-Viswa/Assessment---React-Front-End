import React, { useState, useEffect } from 'react';
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

export default function AddUsers(props) {
  const classes = useStyles();
  const [username, setUsername] = React.useState('');
  const [useremail, setUseremail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [consfimPassword, setConsfimPassword] = React.useState('');
  const [error, setError] = React.useState({
    username: false,    
    usernameErr: true,
    usernameErrTxt: "",
    useremail: false,    
    useremailErr: true,
    useremailErrTxt: "",
    password: false,    
    passwordErr: true,
    passwordErrTxt: "",
    consfimPassword: false,    
    consfimPasswordErr: true,
    consfimPasswordErrTxt: "",
  });
  const [severity, setSeverity] = React.useState('error');
  const [showError, setShowError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('Something went wonrg, Please try again later!');
  const [editId] = useState(props.match.params.id ? props.match.params.id : null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (editId) {
      setLoader(true);
      apiConfig().get(`users/${editId}`)
        .then(res => {
          setLoader(false);
          if (res.data.status === 200) {
            let data = res.data.data[0];
            setUsername(data.user_name);
            setUseremail(data.user_email);
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
    let body = {
      user_id: editId,
      user_name: username,
      user_email: useremail,
      user_password: password
    };
    let options = {
      method: 'POST',
      url: `users`,
      data:{
        user_name: username,
        user_email: useremail,
        user_password: password
      }
    };
    if (editId) {
      options = {
        method: 'PUT',
        url: `users/${editId}`,
        data: {
          user_id: editId,
          user_name: username,
          user_email: useremail,
          user_password: password
        }
      };
    }
    apiConfig()(options)
      .then(res => {
        if (res.data.status === 200) {
          setShowError(true);
          setSeverity('success');
          setErrorMsg(res.data.message);
          setTimeout(() => {
            history.push('/users')
          }, 2000)
        } else if (res.data.status === 409) {
          setShowError(true);
          setSeverity('error');
          setErrorMsg(res.data.message);
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

  const handleInputs = (value, from) => {
    if (from === 'Username') {
      if (value.match(/(.|\s)*\S(.|\s)*/)) {
        setError({ ...error, username: false, usernameErrTxt: '' });
      } else {
        setError({ ...error, username: true, usernameErrTxt: 'Please enter valid user name' });
      }
      setUsername(value);
    } else if (from === 'Useremail') {
      if (value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        setError({ ...error, useremail: false, useremailErrTxt: '' });
      } else {
        setError({ ...error, useremail: true, useremailErrTxt: 'Please enter valid email address' });
      }
      setUseremail(value);
    } else if (from === 'Password') {
      if (value.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/)) {
        setError({ ...error, password: false, passwordErr: false, passwordErrTxt: '' });
      } else if (value.trim() === '') {
        setError({ ...error, password: true, passwordErr: true, passwordErrTxt: 'Please enter password' });
      } else {
        setError({ ...error, password: true, passwordErr: true, passwordErrTxt: 'Your password is too weak' });
      }
      setPassword(value);
    }  else if (from === 'ConfirmPassword') {
      if (value === password) {
        setError({ ...error, consfimPassword: false, consfimPasswordErr: false, consfimPasswordErrTxt: '' });
      } else {
        setError({ ...error, consfimPassword: true, consfimPasswordErr: true, consfimPasswordErrTxt: "Confirm password doesn't match with your password" });
      }
      setConsfimPassword(value);
    }
    
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {editId ? 'Edit' : 'Add'} User
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
              error={error.username}
              helperText={error.usernameErrTxt}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="User Name"
              name="name"
              autoComplete="name"
              value={username}
              onChange={(e) => handleInputs(e.target.value, 'Username')}
              autoFocus
            />
            <TextField
              error={error.useremail}
              helperText={error.useremailErrTxt}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={useremail}
              onChange={(e) => handleInputs(e.target.value, 'Useremail')}
            />
            <TextField
              error={error.password}
              helperText={error.passwordErrTxt}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputs(e.target.value, 'Password')}
              autoComplete="current-password"
            />
            <TextField
              error={error.consfimPassword}
              helperText={error.consfimPasswordErrTxt}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              value={consfimPassword}
              onChange={(e) => handleInputs(e.target.value, 'ConfirmPassword')}
              autoComplete="current-password"
            />
            <Grid container justify="flex-end" className={classes.submitPadding}>
              <Button
                type="button"
                variant="contained"
                color="default"
                className={classes.backButton}
                onClick={(e) => { e.preventDefault(); history.push('/users') }}
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled = {error.passwordErr || error.consfimPasswordErr}
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