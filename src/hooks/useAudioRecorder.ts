import { useRef, useState } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { requestAudioPermission } from '../utils/permission';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const path = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/voice.m4a`,
    android: `${RNFS.DocumentDirectoryPath}/voice.mp4`,
  });

  console.log(audioPath, 'audioPath in useAudioRecorder');

  const startRecording = async () => {
    try {
      const uri = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      console.log('Started recording at:', uri);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };
  const stopRecording = async () => {
    if (!recording) {
      console.warn('Tried to stop recording, but not recording');
      return null;
    }

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setAudioPath(result);
      console.log('Recording stopped at:', result);
      return result;
    } catch (err) {
      console.error('Error stopping recorder:', err);
      return null;
    }
  };

  return {
    recording,
    startRecording,
    stopRecording,
    audioPath,
  };
};
