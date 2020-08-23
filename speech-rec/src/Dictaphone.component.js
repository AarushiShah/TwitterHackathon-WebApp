import React, { useState } from 'react';
import "./Dictaphone.component.css";
import flappy from "./flappy.gif";
import fire from "./fire.gif";
import audio from "./audiowaves.gif";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const [items, setItems] = useState([
    {type: 0, image: fire, text: "Hey Twitter"},{type: 1, image: flappy, text: "Hi! I'm Listening!"}
  ]);
  
  return (
    <div id="list-container">
      <ListDisplay items={items}/>
      <InputText handleSubmit={(item, num, img) => {
          if(item.toLowerCase() == "hype me up") {
            fetch('/hype').then(res => res.json()).then(data => {

              let dummy = [{
                type: num,
                image: img,
                text: item
              }, {type: 1,
                image: flappy,
                text: data.response}];

                setItems(items.concat(dummy))
            });
          } else if(item.toLowerCase() == "tone it down") {
            fetch('/tone').then(res => res.json()).then(data => {

              let dummy = [{
                type: num,
                image: img,
                text: item
              }, {type: 1,
                image: flappy,
                text: data.response}];

                setItems(items.concat(dummy))
            });
          } else if(item.toLowerCase() == "what is trending") {
            fetch('/trends').then(res => res.json()).then(data => {

              let dummy = [{
                type: num,
                image: img,
                text: item
              }, {type: 1,
                image: flappy,
                text: data.response}];

                setItems(items.concat(dummy))
            });
          } else if(item.toLowerCase().indexOf("create a tweet saying") != -1) {
            let input = item.toLowerCase().split("saying")[1];
            fetch(`/create/${input}`).then(res => res.json()).then(data => {

              let dummy = [{
                type: num,
                image: img,
                text: item
              }, {type: 1,
                image: flappy,
                text: data.response}];

                setItems(items.concat(dummy))
            });
          } else if(item.toLowerCase() == "what is your name"){
            let dummy = [{
              type: num,
              image: img,
              text: item
            }, {type: 1, image: flappy, text: "My name is Larry the Bird!"}];
            setItems(items.concat(dummy))
          } else {
            let dummy = [{
              type: num,
              image: img,
              text: item
            }];
            setItems(items.concat(dummy))
          }

        }}
      />
    </div>
  )
}
const ListItem = (props) => (
  <div className={`bubble-container ${props.bubbleDirection}`} key={props.key}>
  <img className={`img-circle`} src={props.image} />
  <div className={`bubble ${props.bubbleClass}`}>{props.text}</div>
  </div>

)
const ListDisplay = (props) => {
  const items = props.items.map((item, i) => (
        <ListItem
          key={i}
          type = {item.type}
          image = {item.image}
          text={item.text}
          bubbleClass={item.type ==0 ? "you" : "me"}
          bubbleDirection={item.type ==0 ? "bubble-direction-reverse" : ""}
        />

  ))
  return (
    <ul>
      {items}
    </ul>
  )
}
const InputText = (props) => {
  const [value, setValue] = useState('');
  const [createTweet, setCreateTweet] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  const hypeMeUp = (transcript) => {
    if(transcript.toLowerCase() == "hype me up") {
      fetch('/hype').then(res => res.json()).then(data => {
        props.handleSubmit(data.response, 1, flappy)
      });
    } else if(transcript.toLowerCase() == "tone it down") {
      fetch('/tone').then(res => res.json()).then(data => {
        props.handleSubmit(data.response, 1, flappy)
      });
    } else if(transcript.toLowerCase() == "create new tweet") {
      props.handleSubmit("What do you want", 1, flappy)
    }

  }


  return (
    <div>
    <form className="new-message" onSubmit={(e) => {
      e.preventDefault();
      props.handleSubmit(transcript, 0, fire);
      setValue('');
      resetTranscript();
      //hypeMeUp(transcript);
    }}>
    <input className="new-message-input" type="text" value={transcript} onChange={e => setValue(e.target.value)}/>
    </form>
    <button className="buttonSpeech1" onClick={() => {SpeechRecognition.startListening({ continuous: true })}}>Start</button>
    <button className="buttonSpeech2" onClick={SpeechRecognition.stopListening}>Stop</button>
    <button className="buttonSpeech3" onClick={resetTranscript}>Reset</button>
    </div>
  )
}
export default Dictaphone;