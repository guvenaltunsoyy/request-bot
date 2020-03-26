import React, { useState, useEffect } from 'react';
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

function Url({ url, index, completeUrl, removeUrl }) {
  const classes = useStyles();

  return (
    <div key={index}
      style={{ textDecoration: url.isCompleted ? "line-through" : "" }}>
      <Chip variant="outlined"
        key={index}
        spacing={5}
        color="primary"
        clickable
        label={'Url : ' + url.url.url} />
      <Chip variant="outlined"
        key={index}
        spacing={5}
        color="primary"
        clickable
        label={'Count : ' + url.url.count} />
      <Button
        key={index}
        className={classes.button}
        size='small'
        variant="contained"
        color="secondary"
        onClick={() => removeUrl(index)}>X</Button>
    </div>
  );
}

function UrlForm({ addUrl }) {
  const [value, setValue] = useState("");
  const [count, setCount] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    const url = {
      'url': value,
      'count': count
    }
    addUrl(url);
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
  const [urls, setUrls] = useState([

  ]);
  const [result, setResult] = useState("");
  const [succesRequest, setSuccesRequest] = useState(0);
  const [failRequest, setFailRequest] = useState(0);
  const addUrl = url => {
    const newurls = [...urls, { url }];
    setUrls(newurls);
  };
  useEffect(()=>{
      document.getElementById("success").value= `Succes Request ${succesRequest}`;
      document.getElementById("fail").value= `Fail Request ${failRequest}`;
  });
  const removeUrl = index => {
    const newurls = [...urls];
    newurls.splice(index, 1);
    setUrls(newurls);
  };

  async function sendUrls() {
    axios.post(`https://runner-server.herokuapp.com/urls`, { urls })
      .then(res => {
        console.log(res);
        console.log(res.data);
      }).catch(err => { console.log(err) }
      );
  };
  async function sendRequest() {
    setSuccesRequest(0);
    setFailRequest(0);
    urls.map(async (url) => {
      for (let index = 0; index < url.url.count; index++) {
        sendAsyncRequest(url.url.url);
      }
    })
  }
  async function axiosAll(){
    var axiosReqList= [];
    urls.map(async (url) => {
      for (let index = 0; index < url.url.count; index++) {
        axiosReqList.push(axios.get(url.url.url));
      }
    })
    console.log(axiosReqList);
    axios.all(axiosReqList).then(axios.spread((...responses) => {
      responses.forEach(response => {
        console.log(response);
        
      });
      // use/access the results 
    })).catch(errors => {
      console.log(errors);
      
    })
  }

  async function sendAsyncRequest(url) {
    axios.get(url)
      .then(res => {
        console.log(res.status);
        //console.log(res.data);
        setSuccesRequest(succesRequest+1);
      }).catch(err => { setResult(JSON.stringify(err));
        //console.log(JSON.parse(JSON.stringify(err))); 
        setResult(JSON.stringify(err));
        setFailRequest(failRequest+1);

      });
  }
  const classes = useStyles();


  return (
    <Grid className={classes.layout}>
      <h1>Entry URL/URLs</h1>
      <div className="url-list">
        <UrlForm addUrl={addUrl} />
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
          <Button
          size='small'
          spacing={5}
          onClick={() => axiosAll()}
          className={classes.buttons}
          variant="contained"
          color="inherit">axios all</Button>
        {urls.map((url, index) => (
          <Url
            key={index}
            url={url}
            removeUrl={removeUrl}
          />
        ))}
      </div>
      <p id="succes"></p>
      <p id="fail"></p>
      LAST FAIL RESPONSE:
      <Typography variant="h6" component="h2">
        {result}
      </Typography>
    </Grid>
  );
}

export default App;
