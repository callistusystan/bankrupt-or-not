import React, { Component } from 'react';
import { RiseLoader } from 'react-spinners';
import Dropzone from 'react-dropzone-component';
import { AwesomeButton } from "react-awesome-button";
import { Line } from 'rc-progress';

import "react-awesome-button/dist/styles.css";
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';
import './App.css';

const WAIT_TIME = 2000;
const TARGET = 356501;

const Wave = () => (
  <div class="waveWrapper waveAnimation">
    <div class="waveWrapperInner bgTop">
      <div class="wave waveTop" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-top.png')` }} />
    </div>
    <div class="waveWrapperInner bgMiddle">
      <div class="wave waveMiddle" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-mid.png')` }} />
    </div>
    <div class="waveWrapperInner bgBottom">
      <div class="wave waveBottom" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-bot.png')` }} />
    </div>
  </div>
);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

class App extends Component {

  state = {
    progress: 0,
    target: 356803,
    ready: false,
    step: 1,
    uploadButtonDisabled: true
  };

  componentDidMount() {
    setTimeout(() => this.setState({ ready: true }), WAIT_TIME);
  }

  onAddedFile = () => {
    this.setState({ uploadButtonDisabled: false })
  }

  startProcessing = async () => {
    this.setState({ ready: false, step: 2 });
    setTimeout(() => {
      this.setState({ ready: true });
      this.increaseInterval = setInterval(() => {
        const progress = Math.min(TARGET, this.state.progress + getRandomInt(1, 5000));
        this.setState({ progress });
        
        if (progress === TARGET) {
          clearInterval(this.increaseInterval);
          setTimeout(() => {
            this.setState({ ready: false, step: 3 });
            setTimeout(() => this.setState({ ready: true }), WAIT_TIME);
          }, 1000);
        }
      }, 200);
    }, WAIT_TIME);
  }

  percentageToMessage = percentage => {
    if (percentage < 0.45) return 'Comparing salaries with ATO dataset...';
    else if (percentage < 0.90) return 'Comparing assets with Australia asset dataset...';
    else if (percentage < 1) return 'Generating output csv...';
    return 'Done!'
  }

  renderContent = () => {
    if (!this.state.ready) {
      return (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <RiseLoader color='#3498db' />
        </div>
      );
    }

    const config = {
      iconFiletypes: ['.csv'],
      showFiletypeIcon: true,
      postUrl: `${URL}/processor`
    };

    const djsConfig = {
      acceptedFiles: '.csv',
      addRemoveLinks: true,
      autoProcessQueue: false,
    };

    const eventHandlers = {
      init: (dropzone) => this.dropzone = dropzone,
      addedfile: this.onAddedFile,
      removedfile: this.onRemovedFile,
      success: this.onSuccess
    };

    if (this.state.step === 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 28 }}>Data Checker</h3>
          <div style={{ backgroundColor: '#DDD', width: '100%', height: 1, marginBottom: 8 }} />
          <p style={{ fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>1. Upload your data</p>
          <Dropzone
            config={config}
            djsConfig={djsConfig}
            eventHandlers={eventHandlers}
          />

          <AwesomeButton
            disabled={this.state.uploadButtonDisabled}
            onPress={this.startProcessing}
            type="primary"
            style={{ marginTop: 16, alignSelf: 'flex-end' }}>Upload</AwesomeButton>
        </div>
      );
    }
    else if (this.state.step === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 28 }}>Data Checker</h3>
          <div style={{ backgroundColor: '#DDD', width: '100%', height: 1, marginBottom: 8 }} />
          <p style={{ fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>2. Wait while our algorithms process your data...</p>

          <Line percent={this.state.progress/TARGET * 100} strokeWidth="4" strokeColor="#3498db" />
          <div style={{marginTop: 8, display: 'flex', justifyContent: 'space-between'}}>
            <span>{this.percentageToMessage(this.state.progress/TARGET)}</span>
            <span>{this.state.progress}/{TARGET}</span>
          </div>
        </div>
      );
    }
    else if (this.state.step === 3) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 28 }}>Data Checker</h3>
          <div style={{ backgroundColor: '#DDD', width: '100%', height: 1, marginBottom: 8 }} />
          <p style={{ fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>3. Success, download your output file!</p>

          <AwesomeButton
            onPress={() => {window.location.href = '/output.xlsx'}}
            type="primary"
            style={{ marginTop: 16, alignSelf: 'center', width: 200, letterSpacing: 4, fontWeight: 400, fontSize: 20 }}>Download</AwesomeButton>
        </div>
      );
    }
    else {
      return <div>Not done yet</div>
    }
  }

  render() {

    return (
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ alignItems: 'center', background: '#fff', boxShadow: '0 3px 6px rgba(0,0,0,0.16)', height: 80, justifyContent: 'center', width: '100%' }}>
          <p style={{ fontFamily: 'Pacifico', fontSize: 40, marginLeft: 32 }}>Bankrupt or not?</p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 556, minHeight: 200, borderRadius: 10, backgroundColor: '#fff', boxShadow: '0 3px 6px rgba(0,0,0,0.16)', padding: '16px 32px' }}>
            {this.renderContent()}
          </div>

        </div>

        <Wave />
      </div>
    );
  }
}

export default App;
