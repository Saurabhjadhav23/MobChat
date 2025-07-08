import { PermissionsAndroid, Platform } from 'react-native';

export const requestAudioPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    return granted['android.permission.RECORD_AUDIO'] === 'granted';
  }
  return true;
};
