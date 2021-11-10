import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './GameController.css'
//import MicIcon from '@mui/icons-material/Mic';
import {
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import SpeechToText from 'speech-to-text';

import supportedLanguages from '../supportedLanguages';
import SnakeGame from './SnakeGame.jsx'

const styles = theme => ({
  root: {
    paddingTop: 65,
    paddingLeft: 11,
    paddingRight: 11
  },
  flex: {
    flex: 1
  },
  grow: {
    flexGrow: 1
  },
  paper: theme.mixins.gutters({
    paddingTop: 22,
    paddingBottom: 22
  })
});

class GameController extends Component {
  state = {
    error: '',
    interimText: '',
    finalisedText: [],
    listening: false,
    language: 'en-US',
    voiceCommand:'',
  };

  onAnythingSaid = text => {
    this.setState({ interimText: text });
  };

  onEndEvent = () => {
    if (!isWidthUp('sm', this.props.width)) {
      this.setState({ listening: false });
    } else if (this.state.listening) {
      this.startListening();
    }
  };

  onFinalised = text => {
    console.log(text);
    this.child.voiceCommand(text);
   
    this.setState({
      finalisedText: [text, ...this.state.finalisedText],
      interimText: ''
    });
  };

  startListening = () => {
    try {
      this.listener = new SpeechToText(
        this.onFinalised,
        this.onEndEvent,
        this.onAnythingSaid,
        this.state.language
      );
      this.listener.startListening();
      this.setState({ listening: true });
    } catch (err) {
      console.log('yoyoy');
      console.log(err);
    }
  };

  stopListening = () => {
    this.listener.stopListening();
    this.setState({ listening: false });
  };

  render() {
    const {
      error,
      interimText,
      finalisedText,
      listening,
      language
    } = this.state;
    const { classes } = this.props;
    let content;
    if (error) {
      content = (
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            {error}
          </Typography>
        </Paper>
      );
    } else {
      let buttonForListening;

      if (listening) {
        buttonForListening = (
          <Button color="primary" onClick={() => this.stopListening()}>
            Stop Listening
          </Button>
        );
      } else {
        buttonForListening = (
          <Button
            color="primary"
            onClick={() => this.startListening()}
            variant="contained"
          >
           Start
          </Button>
        );
      }
      content = (
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
            <Paper className={this.props.classes.paper}>
              <Grid container spacing={8}>
                <Grid item xs={12} lg={4}>
                  <Typography variant="overline" gutterBottom>
                    Status: {listening ? 'listening...' : 'finished listening'}
                  </Typography>
                  {buttonForListening}
                </Grid>
               
                <Grid item xs={12}  lg={4}>
          <span className='voiceCommand'>{interimText}</span>
          </Grid>
              </Grid>
            </Paper>
          </Grid>
       
        </Grid>
      );
    }

    return (
      <Grid container>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.grow} color="inherit">
              Voice Control Snake Game
            </Typography>
            
          </Toolbar>
        </AppBar>
        <Grid container justify="center" className={classes.root}>
        {content}
              <SnakeGame ref={instance => { this.child = instance; }} />
              
            
           
        
        </Grid>
       
      </Grid>
    );
  }
}

export default withWidth()(withStyles(styles)(GameController));
