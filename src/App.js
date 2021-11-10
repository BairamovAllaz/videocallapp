import './App.css';
import {useEffect,useRef, useState} from 'react';
import Call from './components/Call'
function App() {
  const [stream,setstream] = useState(null)
  const video = useRef(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({audio : true,video : true}).then(mediastream => {
      setstream(mediastream);
      video.current.srcObject = mediastream;
    })
  },[]);
  //call
  return (
    <div className="App">
      <Call 
      video = {video}
      stream = {stream}
      setstream = {setstream}
      />
    </div>
  );
}
export default App;