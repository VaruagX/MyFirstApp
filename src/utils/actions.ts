import { Alert, Linking, Share } from 'react-native';

export function openExternal(url: string) {
  Linking.openURL(url).catch(() => {
    Alert.alert('Unable to open link', url);
  });
}

export function showUnavailable(label: string) {
  Alert.alert(label, 'Connect this button to your hosted file or project URL.');
}

export function shareText(title: string, message: string) {
  Share.share({ title, message }).catch(() => {
    Alert.alert('Share unavailable', 'Sharing is not available right now.');
  });
}
