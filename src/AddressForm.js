import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Checkbox, Button, Radio, Chip, Avatar, DoneIcon} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

export default function AddressForm() {
  const classes = useStyles();
  const [url,setUrl] = useState('');
  const [count, setCount] = useState(0);
  const [urls, setUrls] = useState([]);
  const lastUrls = []
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClick  = () => {
   lastUrls.push({ 'url': url,
               'count': count});
    
  };
  const handleUrlClick = event => {
    setUrl(event.target.value);
  };
  const handleCountClick = event => {
    setCount(event.target.value);
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Welcome To Request Bot
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="url"
            name="url"
            Input
            label="URL"
            onKeyUp={handleUrlClick}
            placeholder="https://swapi.co/api/films/2/"
            fullWidth
            autoComplete="fname"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="count"
            name="count"
            label="Count"
            onKeyUp={handleCountClick}
            placeholder="7"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {
            lastUrls.map((u, index)=>
              (
                <Chip variant="outlined" 
                key={index}
                spacing={5}
                color="primary"
                clickable
                onDelete={handleDelete}
                avatar={<Avatar>{u.count}</Avatar>}
                label={u.url} />
              )
            )
          }
        </Grid>

        <Grid item xs={12}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            className={classes.button}>
            Add URL
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}