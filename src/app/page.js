/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";

import {
  getDevices,
  MIC,
  CAMERA,
} from "./utils/mediaDevices";

import Header from "./components/Header";
import Input from "./components/Input";
import LocalParticipantVideo from "./components/LocalParticipantVideo";
import RemoteParticipantVideos from "./components/RemoteParticipantVideos";
import Select from "./components/Select";
import { joinStage } from './utils/stagesUtils';

export default function Home() {
  // Initializing a state variable and its update function
  const [isInitializeComplete, setIsInitializeComplete] = useState(false);

  // Using the useState hook to create and manage state for video and audio devices and their selections
  const [videoDevices, setVideoDevices] = useState([]); // Stores the available video devices
  const [audioDevices, setAudioDevices] = useState([]); // Stores the available audio devices
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(null); // Tracks the selected video device
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null); // Tracks the selected audio device

  const [participantToken, setParticipantToken] = useState("");

  // Initialize state variables for managing the current stage, connection status, participant list, and local participant information
  const [isConnected, setIsConnected] = useState(false); // Tracks the connection status
  const [participants, setParticipants] = useState([]); // Manages the list of participants
  const [localParticipant, setLocalParticipant] = useState({}); // Manages the local participant information

  // Create a ref for the stage to hold a reference to the IVS stage instance.
  const stageRef = useRef(undefined);

  // Create a ref for the strategy to hold a reference to the strategy configuration used in the IVS stage.
  const strategyRef = useRef();

  // Initialize a state variable to manage the muted status of the microphone
  const [isMicMuted, setIsMicMuted] = useState(true);

  // Initialize a state variable to manage the visibility status of the camera
  const [isCameraHidden, setIsCameraHidden] = useState(false);

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

  const updateLocalParticipantMedia = async () => {
    const { participant, streams } = localParticipant;

    // Create new local streams
    const newVideoStream = await createLocalStageStream(
      selectedVideoDeviceId,
      CAMERA
    );
    const newAudioStream = await createLocalStageStream(
      selectedAudioDeviceId,
      MIC
    );

    // Update the streams array with the new streams
    const updatedStreams = [newVideoStream, newAudioStream];

    // Update the participant object with the new streams
    const updatedParticipant = {
      participant,
      streams: updatedStreams,
    };

    setLocalParticipant(updatedParticipant);

    strategyRef.current.updateTracks(newAudioStream, newVideoStream);
    stageRef.current.refreshStrategy();
  };

  useEffect(() => {
    //Check to ensure that the stage and the strategy have completed initialization
    const isInitializingStreams =
      !strategyRef.current?.audioTrack && !strategyRef.current?.videoTrack;
    if (!isInitializeComplete || isInitializingStreams) return; // If initialization is not complete, return

    if (localParticipant.streams) {
      updateLocalParticipantMedia();
    }
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);


  const initialize = async () => {
    handleDeviceUpdate();
    setIsInitializeComplete(true);
  };

  return (
    <div>
      <Script
        src="https://web-broadcast.live-video.net/1.6.0/amazon-ivs-web-broadcast.js" // Load the Amazon IVS Web Broadcast JavaScript library
        onLoad={initialize} // Call the 'initialize' function after the script has loaded
      ></Script>
      <Header />
      <hr />
      <div className="row">
        <Select
          deviceType="Camera"
          updateDevice={setSelectedVideoDeviceId}
          devices={videoDevices}
        />
        <Select
          deviceType="Microphone"
          updateDevice={setSelectedAudioDeviceId}
          devices={audioDevices}
        />
        <Input
          label="Participant Token"
          value={participantToken}
          onChange={setParticipantToken}
        />
        {isInitializeComplete && (
          <div className="button-container row">
            <button
              className="button"
              onClick={() =>
                joinStage(
                  isInitializeComplete,
                  participantToken,
                  selectedAudioDeviceId,
                  selectedVideoDeviceId,
                  setIsConnected,
                  setIsMicMuted,
                  setLocalParticipant,
                  setParticipants,
                  strategyRef,
                  stageRef
                )
              }
            >
              Join Stage
            </button>
            <button
              className="button"
              onClick={() => leaveStage(stageRef.current, setIsConnected)}
            >
              Leave Stage
            </button>
          </div>
        )}
        <br />
      </div>
      {isConnected && (
        <>
          <h3>Local Participant</h3>
          <LocalParticipantVideo
            localParticipantInfo={localParticipant}
            isInitializeComplete={isInitializeComplete}
            participantSize={participants.length}
          />
        </>
      )}
      {isConnected && (
        <div className="static-controls">
          <button
            onClick={() =>
              handleMediaToggle(MIC, stageRef, setIsMicMuted)
            }
            className="button"
          >
            {isMicMuted ? "Unmute Mic" : "Mute Mic"}
          </button>
          <button
            onClick={() =>
              handleMediaToggle(CAMERA, stageRef, setIsCameraHidden)
            }
            className="button"
          >
            {isCameraHidden ? "Unhide Camera" : "Hide Camera"}
          </button>
        </div>
      )}
      {isConnected && (
        <>
          <h3>Remote Participants</h3>{" "}
          <div className="center">
            <RemoteParticipantVideos
              isInitializeComplete={isInitializeComplete}
              participants={participants}
              participantSize={participants.length}
            />
          </div>
        </>
      )}
    </div>
  );
}