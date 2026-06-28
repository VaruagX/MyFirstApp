import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import type { ImagePickerAsset } from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

export const GALLERY_ALBUM_ID = 'my-gallery';
export const GALLERY_ALBUM_NAME = 'My Gallery';
export const GALLERY_STORAGE_KEY = 'portfolio-gallery-v1';
export const GALLERY_SORT_KEY = 'portfolio-gallery-sort-v1';

export type GallerySortMode = 'newest' | 'oldest' | 'az' | 'za';

export type GalleryImage = {
  id: string;
  albumId: string;
  name: string;
  uri: string;
  createdAt: number;
  size: number;
  width: number;
  height: number;
  tags: string[];
  mimeType: string;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  createdAt: number;
  imageIds: string[];
};

export type GalleryStore = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
};

type PersistedGalleryData = GalleryStore & {
  sortMode: GallerySortMode;
};

const DEFAULT_SORT_MODE: GallerySortMode = 'newest';
const DEFAULT_IMAGE_MIME = 'image/jpeg';

function createDefaultStore(): PersistedGalleryData {
  return {
    images: [],
    albums: [
      {
        id: GALLERY_ALBUM_ID,
        name: GALLERY_ALBUM_NAME,
        createdAt: Date.now(),
        imageIds: [],
      },
    ],
    sortMode: DEFAULT_SORT_MODE,
  };
}

function getGalleryDirectory() {
  return new Directory(Paths.document, 'gallery');
}

function ensureGalleryDirectory() {
  const directory = getGalleryDirectory();
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

function safeJsonParse(input: string | null): PersistedGalleryData | null {
  if (!input) {
    return null;
  }

  try {
    return JSON.parse(input) as PersistedGalleryData;
  } catch {
    return null;
  }
}

function cleanFileName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

function stripExtension(name: string) {
  return name.replace(/\.[^.]+$/, '');
}

function getNameFromUri(uri: string) {
  const file = new File(uri);
  return file.name || 'photo';
}

function getExtensionFromAsset(asset: { fileName?: string | null; mimeType?: string | null; uri: string }) {
  const fileName = asset.fileName?.trim();
  if (fileName && /\.[^.]+$/.test(fileName)) {
    return fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
  }

  const mimeType = asset.mimeType?.toLowerCase();
  if (mimeType?.includes('png')) return 'png';
  if (mimeType?.includes('webp')) return 'webp';
  if (mimeType?.includes('heic')) return 'heic';
  if (mimeType?.includes('gif')) return 'gif';
  if (mimeType?.includes('jpeg') || mimeType?.includes('jpg')) return 'jpg';
  if (mimeType?.includes('bmp')) return 'bmp';

  const uriName = getNameFromUri(asset.uri);
  const uriExt = uriName.split('.').pop();
  return uriExt && uriExt !== uriName ? uriExt.toLowerCase() : 'jpg';
}

function buildStorageName(id: string, extension: string) {
  return `${id}.${extension}`;
}

function getDisplayName(asset: { fileName?: string | null }, id: string) {
  const fallback = `Photo ${new Date().toLocaleDateString()}`;
  const baseName = asset.fileName ? stripExtension(asset.fileName) : fallback;
  const cleanBase = cleanFileName(baseName) || `photo-${id.slice(-4)}`;
  return cleanBase;
}

function sortImages(images: GalleryImage[], sortMode: GallerySortMode) {
  const items = [...images];

  items.sort((left, right) => {
    if (sortMode === 'newest') return right.createdAt - left.createdAt;
    if (sortMode === 'oldest') return left.createdAt - right.createdAt;

    const comparison = left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
    return sortMode === 'az' ? comparison : -comparison;
  });

  return items;
}

export function filterGalleryImages(images: GalleryImage[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return images;
  }

  return images.filter((image) => {
    const haystack = [image.name, ...image.tags].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function getSortedGalleryImages(images: GalleryImage[], sortMode: GallerySortMode) {
  return sortImages(images, sortMode);
}

async function readStore() {
  const stored = safeJsonParse(await AsyncStorage.getItem(GALLERY_STORAGE_KEY));
  const fallback = createDefaultStore();

  if (!stored) {
    return fallback;
  }

  const albums = stored.albums?.length ? stored.albums : fallback.albums;
  const images = stored.images?.length ? stored.images : [];
  const sortMode = stored.sortMode ?? fallback.sortMode;

  const validImages = images.filter((image) => new File(image.uri).exists);
  const validImageIds = new Set(validImages.map((image) => image.id));

  return {
    images: validImages,
    albums: albums.map((album) => ({
      ...album,
      imageIds: album.imageIds.filter((id) => validImageIds.has(id)),
    })),
    sortMode,
  };
}

async function writeStore(store: PersistedGalleryData) {
  await AsyncStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(store));
  await AsyncStorage.setItem(GALLERY_SORT_KEY, store.sortMode);
}

export async function loadGalleryStore() {
  const store = await readStore();
  const hasDefaultAlbum = store.albums.some((album) => album.id === GALLERY_ALBUM_ID);

  if (!hasDefaultAlbum) {
    store.albums.unshift({
      id: GALLERY_ALBUM_ID,
      name: GALLERY_ALBUM_NAME,
      createdAt: Date.now(),
      imageIds: store.images.map((image) => image.id),
    });
  }

  await writeStore(store);
  return store;
}

export async function loadGallerySortMode() {
  const stored = await AsyncStorage.getItem(GALLERY_SORT_KEY);
  if (stored === 'newest' || stored === 'oldest' || stored === 'az' || stored === 'za') {
    return stored;
  }

  const store = await readStore();
  return store.sortMode;
}

export async function setGallerySortMode(sortMode: GallerySortMode) {
  const store = await readStore();
  await writeStore({ ...store, sortMode });
}

export async function addGalleryImages(
  assets: (Pick<ImagePickerAsset, 'uri' | 'fileName' | 'mimeType' | 'width' | 'height' | 'fileSize'> & { file?: globalThis.File | null })[],
) {
  const store = await readStore();
  const galleryDirectory = ensureGalleryDirectory();
  const createdAt = Date.now();
  const addedImages: GalleryImage[] = [];

  for (const [index, asset] of assets.entries()) {
    const id = `gallery_${createdAt}_${index}_${Math.random().toString(36).slice(2, 8)}`;
    const extension = getExtensionFromAsset(asset);
    const storageName = buildStorageName(id, extension);
    const destination = new File(galleryDirectory, storageName);
    const sourceName = getDisplayName(asset, id);

    if (asset.file) {
      const bytes = new Uint8Array(await asset.file.arrayBuffer());
      destination.write(bytes);
    } else {
      const source = new File(asset.uri);
      await source.copy(destination, { overwrite: true });
    }

    const info = destination.info();
    const image: GalleryImage = {
      id,
      albumId: GALLERY_ALBUM_ID,
      name: cleanFileName(sourceName),
      uri: destination.uri,
      createdAt,
      size: info.size ?? asset.fileSize ?? 0,
      width: asset.width ?? 0,
      height: asset.height ?? 0,
      tags: [],
      mimeType: asset.mimeType ?? `image/${extension}`,
    };

    addedImages.push(image);
  }

  const nextStore: PersistedGalleryData = {
    ...store,
    images: [...addedImages, ...store.images],
    albums: store.albums.map((album) =>
      album.id === GALLERY_ALBUM_ID
        ? {
            ...album,
            imageIds: [...addedImages.map((image) => image.id), ...album.imageIds],
          }
        : album,
    ),
  };

  await writeStore(nextStore);
  return nextStore;
}

export async function renameGalleryImage(imageId: string, nextName: string) {
  const store = await readStore();
  const image = store.images.find((item) => item.id === imageId);
  if (!image) {
    return store;
  }

  const existingFile = new File(image.uri);
  const currentExtension = existingFile.extension.replace(/^\./, '') || 'jpg';
  const sanitizedInput = cleanFileName(nextName);
  const nextBase = stripExtension(sanitizedInput) || stripExtension(image.name);
  const nextFileName = sanitizedInput.includes('.') ? sanitizedInput : `${nextBase}.${currentExtension}`;
  const destination = new File(existingFile.parentDirectory, nextFileName);

  await existingFile.move(destination, { overwrite: true });

  const nextImages = store.images.map((item) =>
    item.id === imageId
      ? {
          ...item,
          name: stripExtension(nextFileName),
          uri: destination.uri,
        }
      : item,
  );

  const nextStore: PersistedGalleryData = { ...store, images: nextImages };
  await writeStore(nextStore);
  return nextStore;
}

export async function deleteGalleryImages(imageIds: string[]) {
  const ids = new Set(imageIds);
  const store = await readStore();

  for (const image of store.images.filter((item) => ids.has(item.id))) {
    const file = new File(image.uri);
    if (file.exists) {
      file.delete();
    }
  }

  const nextImages = store.images.filter((image) => !ids.has(image.id));
  const nextAlbums = store.albums.map((album) => ({
    ...album,
    imageIds: album.imageIds.filter((id) => !ids.has(id)),
  }));

  const nextStore: PersistedGalleryData = { ...store, images: nextImages, albums: nextAlbums };
  await writeStore(nextStore);
  return nextStore;
}

export async function shareGalleryImage(image: GalleryImage) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(image.uri, {
      dialogTitle: `Share ${image.name}`,
      mimeType: image.mimeType || DEFAULT_IMAGE_MIME,
    });
    return true;
  }

  await Share.share({ title: image.name, url: image.uri, message: image.name });
  return false;
}

export async function shareGalleryImages(images: GalleryImage[]) {
  for (const image of images) {
    await shareGalleryImage(image);
  }
}
