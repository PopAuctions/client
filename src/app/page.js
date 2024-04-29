"use client";
import { useState } from "react";
import Script from "next/script";
import Header from "./components/Header";
import Select from "./components/Select";
import Input from './components/Input';


export default function Home() {
  const [isInitializeComplete, setIsInitializeComplete] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]); // Stores the available video devices
  const [audioDevices, setAudioDevices] = useState([]); // Stores the available audio devices
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null); // Tracks the selected video device
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null); // Tracks the selected audio device

  const [participantToken, setParticipantToken] = useState(""); // which is necessary for participants to join a stage.

  /**
    * Initialize after the client is loaded
    */
  const initialize = async () => {
    // Set the value of isInitializeComplete to true
    setIsInitializeComplete(true);
  };


  return (
    <div>
      <Script src="https://web-broadcast.live-video.net/1.6.0/amazon-ivs-web-broadcast.js" onLoad={initialize}></Script>
      <Header />
      <div className="row">
        <Select
          deviceType="Video"
          updateDevice={setSelectedVideoDeviceId}
          devices={videoDevices}
        />
        <Select
          deviceType="Audio"
          updateDevice={setSelectedAudioDeviceId}
          devices={audioDevices}
        />
        <Input
          label="Participant Token"
          value={participantToken}
          onChange={setParticipantToken}
        />
      </div>
    </div>
  );
}