import './App.css';
import {useEffect,useRef, useState} from 'react';
import Call from './components/Call'
function App() {
  const [stream,setstream] = useState(null)
  const video = useRef(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({audio : true,video : true}).then(mediastream => {
      video.current.srcObject = mediastream;
      setstream(mediastream);
      video.current.onloadedmetdata = (e) => {
        video.current.play();
      }
    })
  },[]);
  return (
    <div className="App">
      <Call 
      video = {video}
      stream = {stream}
      />
    </div>
  );
}
export default App;