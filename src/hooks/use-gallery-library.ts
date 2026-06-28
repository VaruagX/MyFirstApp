/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';

import {
  addGalleryImages,
  deleteGalleryImages,
  loadGalleryStore,
  renameGalleryImage,
  setGallerySortMode,
  type GalleryAlbum,
  type GalleryImage,
  type GallerySortMode,
} from '@/services/gallery-service';

type GallerySnapshot = {
  images: GalleryImage[];
  albums: GalleryAlbum[];
  sortMode: GallerySortMode;
};

const EMPTY_SNAPSHOT: GallerySnapshot = {
  images: [],
  albums: [],
  sortMode: 'newest',
};

export function useGalleryLibrary() {
  const [snapshot, setSnapshot] = useState<GallerySnapshot>(EMPTY_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const store = await loadGalleryStore();
      setSnapshot({
        images: store.images,
        albums: store.albums,
        sortMode: store.sortMode,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => {
      setIsLoading(false);
    });
  }, [refresh]);

  const addImages = useCallback(
    async (assets: Parameters<typeof addGalleryImages>[0]) => {
      const store = await addGalleryImages(assets);
      setSnapshot({
        images: store.images,
        albums: store.albums,
        sortMode: store.sortMode,
      });
    },
    [],
  );

  const renameImage = useCallback(async (imageId: string, nextName: string) => {
    const store = await renameGalleryImage(imageId, nextName);
    setSnapshot({
      images: store.images,
      albums: store.albums,
      sortMode: store.sortMode,
    });
  }, []);

  const deleteImages = useCallback(async (imageIds: string[]) => {
    const store = await deleteGalleryImages(imageIds);
    setSnapshot({
      images: store.images,
      albums: store.albums,
      sortMode: store.sortMode,
    });
  }, []);

  const updateSortMode = useCallback(async (sortMode: GallerySortMode) => {
    setSnapshot((current) => ({ ...current, sortMode }));
    await setGallerySortMode(sortMode);
  }, []);

  return {
    images: snapshot.images,
    albums: snapshot.albums,
    sortMode: snapshot.sortMode,
    isLoading,
    refresh,
    addImages,
    renameImage,
    deleteImages,
    updateSortMode,
  };
}
