import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking, Platform, Share } from 'react-native';

import { RESUME_FILE_NAME, RESUME_PDF } from '@/constants/files';
import { profile } from '@/constants/portfolio';

const PDF_MIME_TYPE = 'application/pdf';
const PDF_UTI = 'com.adobe.pdf';

async function getResumeAsset() {
  const asset = Asset.fromModule(RESUME_PDF);
  await asset.downloadAsync();

  return asset;
}

async function getResumeFile() {
  const asset = await getResumeAsset();
  if (!asset.localUri) {
    throw new Error('Resume asset could not be prepared.');
  }

  const sourceFile = new File(asset.localUri);
  const destinationFile = new File(Paths.document, RESUME_FILE_NAME);

  if (destinationFile.exists) {
    destinationFile.delete();
  }

  sourceFile.copy(destinationFile);
  return destinationFile;
}

function downloadOnWeb(uri: string) {
  const anchor = document.createElement('a');
  anchor.href = uri;
  anchor.download = RESUME_FILE_NAME;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function viewResumePdf() {
  if (Platform.OS === 'web') {
    const asset = await getResumeAsset();
    await WebBrowser.openBrowserAsync(asset.uri);
    return;
  }

  const resumeFile = await getResumeFile();
  if (Platform.OS === 'android') {
    const uri = await FileSystemLegacy.getContentUriAsync(resumeFile.uri);

    try {
      await Linking.openURL(uri);
      return;
    } catch {
      // Fall through to the share sheet as a backup.
    }
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(resumeFile.uri, {
      dialogTitle: 'Open resume',
      mimeType: PDF_MIME_TYPE,
      UTI: PDF_UTI,
    });
    return;
  }

  Alert.alert('Unable to open resume', 'No PDF viewer is available on this device.');
}

export async function downloadResumePdf() {
  if (Platform.OS === 'web') {
    const asset = await getResumeAsset();
    const uri = asset.localUri ?? asset.uri;
    downloadOnWeb(uri);
    return;
  }

  const destination = await getResumeFile();

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(destination.uri, {
      dialogTitle: 'Save resume',
      mimeType: PDF_MIME_TYPE,
      UTI: PDF_UTI,
    });
    return;
  }

  Alert.alert('Resume downloaded', `Saved to ${destination.uri}`);
}

export async function shareResumePdf() {
  const message = `${profile.name} - ${profile.title}`;
  const uri =
    Platform.OS === 'web'
      ? (await getResumeAsset()).uri
      : (await getResumeFile()).uri;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      dialogTitle: 'Share resume',
      mimeType: PDF_MIME_TYPE,
      UTI: PDF_UTI,
    });
    return;
  }

  await Share.share({ title: RESUME_FILE_NAME, message, url: uri });
}
