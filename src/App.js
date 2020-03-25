
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Chip, Grid, TextField, Typography } from '@material-ui/core';

import axios from 'axios';
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
    marginTop: 10,
    marginBottom: 20
  },
  button: {
    marginTop: theme.spacing(0),
    marginLeft: theme.spacing(2),
    width: 20,
    height: 25
  },
}));

function Todo({ todo, index, completeTodo, removeTodo }) {
  const classes = useStyles();

  return (
    <div key={index}
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>
      <Chip variant="outlined"
        key={index}
        spacing={5}
        color="primary"
        clickable
        label={'Url : ' + todo.url.url} />
      <Chip variant="outlined"
        key={index}
        spacing={5}
        color="primary"
        clickable
        label={'Count : ' + todo.url.count} />
      <Button
        key={index}
        className={classes.button}
        size='small'
        variant="contained"
        color="secondary"
        onClick={() => removeTodo(index)}>X</Button>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");
  const [count, setCount] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    const url = {
      'url': value,
      'count': count
    }
    addTodo(url);
  };
  const classes = useStyles();

  return (
    <Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="url"
          name="input"
          fullWidth
          label="URL"
          onChange={e => setValue(e.target.value)}
          placeholder="https://swapi.co/api/films/2/"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="count"
          name="input"
          label="COUNT"
          onChange={e => setCount(e.target.value)}
          placeholder="1"
        />
        <Button
          size='small'
          onClick={(e) => handleSubmit(e)}
          className={classes.buttons}
          variant="outlined"
          color="primary">Add URL</Button>
      </Grid>
    </Grid>

  );
}

function App() {
  const [todos, setTodos] = useState([

  ]);
  const [result, setResult] = useState("");

  const addTodo = url => {
    const newTodos = [...todos, { url }];
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  async function sendUrls() {
    axios.post(`https://runner-server.herokuapp.com/urls`, { todos })
      .then(res => {
        console.log(res);
        console.log(res.data);
      }).catch(err => { console.log(err) }
      );
  };
  async function sendRequest() {
    todos.map(async (url) => {
      for (let index = 0; index < url.url.count; index++) {
        await sendAsyncRequest(url.url.url);
      }
    })
  }
  async function sendAsyncRequest(url) {
    axios.get(url)
      .then(res => {
        console.log(res.status);
        setResult(JSON.stringify(res.data));
        //console.log(res.data);
      }).catch(err => { setResult(JSON.stringify(err));
        //console.log(JSON.parse(JSON.stringify(err))); 
      });
  }
  const classes = useStyles();


  return (
    <Grid className={classes.layout}>
      <h1>Entry URL/URLs</h1>
      <div className="todo-list">
        <TodoForm addTodo={addTodo} />
        <Button
          size='small'
          spacing={5}
          disabled
          onClick={() => sendUrls()}
          className={classes.buttons}
          variant="contained"
          color="primary">Send Urls</Button>
        <Button
          size='small'
          spacing={5}
          onClick={() => sendRequest()}
          className={classes.buttons}
          variant="contained"
          color="primary">Send Request</Button>
        {todos.map((todo, index) => (
          <Todo
            key={index}
            todo={todo}
            removeTodo={removeTodo}
          />
        ))}
      </div>
      RESULT:
      <Typography variant="h6" component="h2">
        {result}
      </Typography>
    </Grid>
  );
}

export default App;
