import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { Alert, Platform, Share } from "react-native";

import { RESUME_FILE_NAME, RESUME_PDF } from "@/constants/files";
import { profile } from "@/constants/portfolio";

const PDF_MIME_TYPE = "application/pdf";
const PDF_UTI = "com.adobe.pdf";
const RESUME_LOG_PREFIX = "[Resume PDF]";
const ANDROID_ACTION_VIEW = "android.intent.action.VIEW";
const ANDROID_GRANT_READ_URI_PERMISSION = 1;
const DOWNLOADS_FOLDER = "Download";

type LocalResume = {
  exists: true;
  uri: string;
  size: number;
};

function logResume(message: string, details?: unknown) {
  if (details === undefined) {
    console.log(`${RESUME_LOG_PREFIX} ${message}`);
    return;
  }

  console.log(`${RESUME_LOG_PREFIX} ${message}`, details);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "An unknown error occurred.";
  }
}

function showResumeError(title: string, error: unknown) {
  const message = getErrorMessage(error);
  logResume(`${title.toLowerCase()} failed`, message);
  Alert.alert(title, message);
}

async function getResumeAsset() {
  const asset = Asset.fromModule(RESUME_PDF);
  logResume("bundled asset URI", {
    uri: asset.uri,
    localUri: asset.localUri,
  });

  await asset.downloadAsync();
  logResume("bundled asset URI after download", {
    uri: asset.uri,
    localUri: asset.localUri,
  });

  return asset;
}

function getLocalResumeUri() {
  if (!FileSystem.documentDirectory) {
    throw new Error("FileSystem.documentDirectory is not available.");
  }

  return `${FileSystem.documentDirectory}${RESUME_FILE_NAME}`;
}

async function getFileInfo(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  logResume("file exists", info.exists);
  logResume("file size", info.exists ? info.size : 0);

  return info;
}

async function ensureLocalResume(): Promise<LocalResume> {
  const asset = await getResumeAsset();
  const sourceUri = asset.localUri ?? asset.uri;
  if (!sourceUri) {
    throw new Error("Resume asset could not be prepared.");
  }

  const localUri = getLocalResumeUri();
  let localInfo = await getFileInfo(localUri);

  if (!localInfo.exists || localInfo.size <= 0) {
    if (localInfo.exists) {
      await FileSystem.deleteAsync(localUri, { idempotent: true });
    }

    await FileSystem.copyAsync({ from: sourceUri, to: localUri });
    logResume("copy success", { from: sourceUri, to: localUri });
    localInfo = await getFileInfo(localUri);
  } else {
    logResume("copy skipped", "local resume already exists");
  }

  if (!localInfo.exists || localInfo.size <= 0) {
    throw new Error(`Resume PDF is missing or empty at ${localUri}.`);
  }

  logResume("local copied URI", localUri);

  return {
    exists: true,
    uri: localInfo.uri,
    size: localInfo.size,
  };
}

function downloadOnWeb(uri: string) {
  const anchor = document.createElement("a");
  anchor.href = uri;
  anchor.download = RESUME_FILE_NAME;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function shareLocalResume(uri: string, dialogTitle: string) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      dialogTitle,
      mimeType: PDF_MIME_TYPE,
      UTI: PDF_UTI,
    });
    logResume("download/share success", { uri, dialogTitle });
    return;
  }

  await Share.share({
    title: RESUME_FILE_NAME,
    message: `${profile.name} - ${profile.title}`,
    url: uri,
  });
  logResume("download/share success", {
    uri,
    dialogTitle,
    fallback: "react-native Share",
  });
}

async function openAndroidResume(uri: string) {
  const contentUri = await FileSystem.getContentUriAsync(uri);
  await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
    data: contentUri,
    flags: ANDROID_GRANT_READ_URI_PERMISSION,
    type: PDF_MIME_TYPE,
  });
  logResume("open success", { uri, contentUri });
}

async function saveAndroidResumeToUserDirectory(uri: string) {
  const initialUri =
    FileSystem.StorageAccessFramework.getUriForDirectoryInRoot(
      DOWNLOADS_FOLDER,
    );
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
      initialUri,
    );

  if (!permissions.granted) {
    logResume(
      "download/share fallback",
      "directory picker canceled; opening share dialog",
    );
    return false;
  }

  const destinationUri =
    await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      RESUME_FILE_NAME,
      PDF_MIME_TYPE,
    );
  const base64Pdf = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await FileSystem.StorageAccessFramework.writeAsStringAsync(
    destinationUri,
    base64Pdf,
    {
      encoding: FileSystem.EncodingType.Base64,
    },
  );

  logResume("download/share success", {
    uri: destinationUri,
    method: "StorageAccessFramework",
  });
  Alert.alert(
    "Resume downloaded",
    "The resume PDF was saved to the selected folder.",
  );

  return true;
}

export async function viewResumePdf() {
  if (Platform.OS === "web") {
    try {
      const asset = await getResumeAsset();
      await WebBrowser.openBrowserAsync(asset.localUri ?? asset.uri);
      logResume("open success", asset.localUri ?? asset.uri);
      return;
    } catch (error) {
      showResumeError("Unable to open resume", error);
      return;
    }
  }

  try {
    const resumeFile = await ensureLocalResume();

    if (Platform.OS === "android") {
      await openAndroidResume(resumeFile.uri);
      return;
    }

    await shareLocalResume(resumeFile.uri, "Open resume");
  } catch (error) {
    showResumeError("Unable to open resume", error);
  }
}

export async function downloadResumePdf() {
  if (Platform.OS === "web") {
    try {
      const asset = await getResumeAsset();
      const uri = asset.localUri ?? asset.uri;
      downloadOnWeb(uri);
      logResume("download/share success", uri);
      return;
    } catch (error) {
      showResumeError("Unable to download resume", error);
      return;
    }
  }

  try {
    const destination = await ensureLocalResume();

    if (Platform.OS === "android") {
      try {
        const saved = await saveAndroidResumeToUserDirectory(destination.uri);
        if (saved) {
          return;
        }
      } catch (error) {
        logResume(
          "download/share fallback",
          `SAF failed; opening share dialog: ${getErrorMessage(error)}`,
        );
      }
    }

    await shareLocalResume(destination.uri, "Save resume");
  } catch (error) {
    showResumeError("Unable to download resume", error);
  }
}

export async function shareResumePdf() {
  try {
    const message = `${profile.name} - ${profile.title}`;
    const uri =
      Platform.OS === "web"
        ? (await getResumeAsset()).uri
        : (await ensureLocalResume()).uri;

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        dialogTitle: "Share resume",
        mimeType: PDF_MIME_TYPE,
        UTI: PDF_UTI,
      });
      logResume("download/share success", { uri, dialogTitle: "Share resume" });
      return;
    }

    await Share.share({ title: RESUME_FILE_NAME, message, url: uri });
    logResume("download/share success", {
      uri,
      fallback: "react-native Share",
    });
  } catch (error) {
    showResumeError("Unable to share resume", error);
  }
}
