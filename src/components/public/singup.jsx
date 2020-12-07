import React from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
import { apiConfig } from '../../config/apiConfig/index';
import { Alert } from '@material-ui/lab';
import { createHashHistory } from "history";

const history = createHashHistory();

function AlertNew(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btlIcon: {
    fontSize: "10px"
  },
  btlText: {
    textAlign: "right",
    margin: "11px 0px"
  }
}));

export default function SignUp() {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    let body = {
      username,
      useremail,
      password
    };
    setShowError(false);
    apiConfig('no-base').post("signup", body)
      .then(res => {
        if (res.data.status === 200) {
          setShowError(true);
          setSeverity('success');
          setErrorMsg(res.data.message);
          setTimeout(() => {
            history.push('/#')
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
      .catch(err => {
        setShowError(true);
        setSeverity('error');
        setErrorMsg('Something went wonrg, Please try again later!');
      })
  }

  const handleInputs = (value, from) => {
    if (from === 'Username') {
      if (value.match(/(.|\s)*\S(.|\s)*/)) {
        setError({ ...error, username: false, usernameErr: false, usernameErrTxt: '' });
      } else {
        setError({ ...error, username: true, usernameErr: true, usernameErrTxt: 'Please enter valid user name' });
      }
      setUsername(value);
    } else if (from === 'Useremail') {
      if (value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        setError({ ...error, useremail: false, useremailErr: false, useremailErrTxt: '' });
      } else {
        setError({ ...error, useremail: true, useremailErr: true, useremailErrTxt: 'Please enter valid email address' });
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Snackbar open={showError} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setShowError(false)}>
          <AlertNew severity={severity}>
            {errorMsg}
          </AlertNew>
        </Snackbar>
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
          <Grid container>
            <Grid item xs>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid className={classes.btlText} item xs>
              <Link href="#" variant="body2">
                <ArrowBackIosIcon className={classes.btlIcon} /> Back to login
              </Link>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled = {error.usernameErr || error.useremailErr || error.passwordErr || error.consfimPasswordErr}
            onClick={(e) => handleSubmit(e)}
          >
            Sign Up
          </Button>

        </form>
      </div>
    </Container>
  );
}