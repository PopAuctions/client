"use client";
import { useState } from "react";
import Script from "next/script";
import Header from "./components/Header";
import Select from "./components/Select";
import Input from './components/Input';
import { getDevices } from "./utils/mediaDevices";


export default function Home() {
  const [isInitializeComplete, setIsInitializeComplete] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]); // Stores the available video devices
  const [audioDevices, setAudioDevices] = useState([]); // Stores the available audio devices
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null); // Tracks the selected video device
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null); // Tracks the selected audio device

  const [participantToken, setParticipantToken] = useState(""); // which is necessary for participants to join a stage.

  const initialize = async () => {
    // Call the handleDeviceUpdate function to update the video and audio devices
    handleDeviceUpdate();
    // Set the value of isInitializeComplete to true
    setIsInitializeComplete(true);
  };

  const handleDeviceUpdate = async () => {
    try {
      const { videoDevices, audioDevices } = await getDevices();
      setVideoDevices(videoDevices);
      setSelectedVideoDeviceId(videoDevices[0]?.deviceId);

      setAudioDevices(audioDevices);
      setSelectedAudioDeviceId(audioDevices[0]?.deviceId);
    } catch (error) {
      // Handle any errors that may occur during the device update process
      console.error("An error occurred during device update:", error);
      // You can add additional error-handling logic here as needed
    }
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