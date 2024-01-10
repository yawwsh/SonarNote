import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const speak = message => {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click');
        speak('Microphone stopped');
      };
    }
    mic.onstart = () => {
      console.log('Mics on');
      speak('Microphone is on');
    };

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      console.log(transcript);
      setNote(transcript);
    };

    mic.onerror = event => {
      console.error('Error:', event.error);
      speak('An error occurred. Please try again.');
    };
  };

  const handleSaveNote = () => {
    const timestamp = new Date().toLocaleString();
    setSavedNotes([...savedNotes, { note, timestamp }]);
    setNote('');
    speak('Note saved successfully');
  };

  const handleDeleteNote = index => {
    const newNotes = [...savedNotes];
    newNotes.splice(index, 1);
    setSavedNotes(newNotes);
    speak('Note deleted');
  };

  return (
    <>
      <h1 className='heading'>SonarNote</h1>
      <h2 className='tagline'>Harmonize Your Thoughts, Echo Your Ideas: SonarNote, where voice meets notes seamlessly.</h2>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button className='clear' onClick={() => setNote('')}>Clear Note</button>
          <button className='saved' onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button className='start' onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <p>{note}</p>
          {isListening && <div className="loading">Listening...</div>}
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((n, index) => (
            <div key={index} className="saved-note">
              <p>{n.note}</p>
              <span className="timestamp">{n.timestamp}</span>
              <button className='delete' onClick={() => handleDeleteNote(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
