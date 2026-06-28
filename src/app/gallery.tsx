/* eslint-disable react-hooks/set-state-in-effect, react-hooks/immutability */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Album, Check, CheckSquare, Eye, ImagePlus, Images, PenLine, Plus, Search, Share2, SquareDashedBottom, Trash2, X, ZoomIn } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInView } from '@/components/portfolio/ui';
import { Radii, Spacing, type AppTheme } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import {
  addGalleryImages,
  deleteGalleryImages,
  filterGalleryImages,
  getSortedGalleryImages,
  loadGalleryStore,
  renameGalleryImage,
  shareGalleryImage,
  shareGalleryImages,
  setGallerySortMode,
  type GalleryImage,
  type GallerySortMode,
} from '@/services/gallery-service';

type ViewerState = {
  index: number;
  zoomed: boolean;
};

type BottomSheetKind = 'add' | 'actions' | null;
type ToastState = {
  id: number;
  message: string;
  tone: 'success' | 'error' | 'info';
};

const SORT_OPTIONS: { label: string; value: GallerySortMode }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' },
];

const SORT_STORAGE_KEY = 'portfolio-gallery-sort-v1';

export default function GalleryScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<GallerySortMode>('newest');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [albums, setAlbums] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bottomSheet, setBottomSheet] = useState<BottomSheetKind>(null);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const [renameTarget, setRenameTarget] = useState<GalleryImage | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const viewerRef = useRef<FlatList<GalleryImage> | null>(null);
  const selectionMode = selectedIds.length > 0;

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(SORT_STORAGE_KEY)
      .then((stored) => {
        if (mounted && (stored === 'newest' || stored === 'oldest' || stored === 'az' || stored === 'za')) {
          setSortMode(stored);
        }
      })
      .catch(() => {});

    loadGalleryStore()
      .then((store) => {
        if (!mounted) return;
        setImages(store.images);
        setAlbums(store.albums.map((album) => ({ id: album.id, name: album.name })));
        setSortMode(store.sortMode);
      })
      .catch(() => {
        if (mounted) {
          setToast({ id: Date.now(), message: 'Unable to load gallery data.', tone: 'error' });
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast]);

  const visibleImages = useMemo(() => {
    const filtered = filterGalleryImages(images, query);
    return getSortedGalleryImages(filtered, sortMode);
  }, [images, query, sortMode]);

  useEffect(() => {
    if (activeActionIndex != null && !visibleImages[activeActionIndex]) {
      setActiveActionIndex(null);
      setBottomSheet(null);
    }
  }, [activeActionIndex, visibleImages]);

  useEffect(() => {
    if (viewer) {
      const nextIndex = Math.max(0, Math.min(viewer.index, visibleImages.length - 1));
      if (nextIndex !== viewer.index) {
        setViewer({ ...viewer, index: nextIndex });
      }
    }
  }, [viewer, visibleImages.length]);

  const album = albums.find((item) => item.id === 'my-gallery');
  const columnCount = width >= 1100 ? 4 : width >= 760 ? 3 : 2;
  const contentPadding = Spacing.five;
  const gap = Spacing.three;
  const cardWidth = Math.floor((width - contentPadding * 2 - gap * (columnCount - 1)) / columnCount);

  const openToast = useCallback((message: string, tone: ToastState['tone'] = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const persistSortMode = useCallback(async (nextMode: GallerySortMode) => {
    setSortMode(nextMode);
    await setGallerySortMode(nextMode);
  }, []);

  const refreshFromStore = useCallback(async () => {
    const store = await loadGalleryStore();
    setImages(store.images);
    setAlbums(store.albums.map((entry) => ({ id: entry.id, name: entry.name })));
    setSortMode(store.sortMode);
  }, []);

  const handleAddPhotos = useCallback(async () => {
    setBottomSheet(null);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo access to add images to your gallery.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        orderedSelection: true,
        selectionLimit: 0,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      await addGalleryImages(result.assets);
      await refreshFromStore();
      openToast(`Added ${result.assets.length} photo${result.assets.length === 1 ? '' : 's'}.`, 'success');
    } catch {
      openToast('Could not add photos right now.', 'error');
    }
  }, [openToast, refreshFromStore]);

  const handleCreateAlbum = useCallback(() => {
    setBottomSheet(null);
    openToast('Create Album is coming soon.', 'info');
  }, [openToast]);

  const handleTilePress = useCallback(
    (image: GalleryImage, index: number) => {
      if (selectionMode) {
        setSelectedIds((current) =>
          current.includes(image.id) ? current.filter((id) => id !== image.id) : [...current, image.id],
        );
        return;
      }

      setActiveActionIndex(index);
      setBottomSheet('actions');
    },
    [selectionMode],
  );

  const handleTileLongPress = useCallback((image: GalleryImage) => {
    setSelectedIds((current) => (current.includes(image.id) ? current : [...current, image.id]));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedIds(visibleImages.map((image) => image.id));
  }, [visibleImages]);

  const openViewer = useCallback(
    (index: number, zoomed = false) => {
      setBottomSheet(null);
      setViewer({ index, zoomed });
    },
    [],
  );

  const openRenameModal = useCallback((image: GalleryImage) => {
    setBottomSheet(null);
    setRenameTarget(image);
    setRenameValue(image.name);
  }, []);

  const handleRenameSave = useCallback(async () => {
    if (!renameTarget) {
      return;
    }

    const nextName = renameValue.trim();
    if (!nextName) {
      Alert.alert('Rename image', 'Please enter a photo name.');
      return;
    }

    try {
      await renameGalleryImage(renameTarget.id, nextName);
      await refreshFromStore();
      setRenameTarget(null);
      openToast('Photo renamed.', 'success');
    } catch {
      openToast('Could not rename the photo.', 'error');
    }
  }, [openToast, refreshFromStore, renameTarget, renameValue]);

  const handleDeleteSingle = useCallback(async () => {
    if (activeActionIndex == null) {
      return;
    }

    const target = visibleImages[activeActionIndex];
    if (!target) {
      return;
    }

    setBottomSheet(null);
    Alert.alert('Delete image', `Delete "${target.name}" from your gallery?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGalleryImages([target.id]);
            await refreshFromStore();
            setSelectedIds((current) => current.filter((id) => id !== target.id));
            openToast('Photo deleted.', 'success');
          } catch {
            openToast('Could not delete the photo.', 'error');
          }
        },
      },
    ]);
  }, [activeActionIndex, openToast, refreshFromStore, visibleImages]);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedIds.length) {
      return;
    }

    Alert.alert('Delete selected', `Delete ${selectedIds.length} selected photo${selectedIds.length === 1 ? '' : 's'}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGalleryImages(selectedIds);
            await refreshFromStore();
            clearSelection();
            openToast('Selected photos deleted.', 'success');
          } catch {
            openToast('Could not delete selected photos.', 'error');
          }
        },
      },
    ]);
  }, [clearSelection, openToast, refreshFromStore, selectedIds]);

  const handleShareSingle = useCallback(async () => {
    if (activeActionIndex == null) {
      return;
    }

    const target = visibleImages[activeActionIndex];
    if (!target) {
      return;
    }

    try {
      await shareGalleryImage(target);
      openToast('Share sheet opened.', 'success');
    } catch {
      openToast('Could not share the photo.', 'error');
    }
  }, [activeActionIndex, openToast, visibleImages]);

  const handleShareSelected = useCallback(async () => {
    if (!selectedIds.length) {
      return;
    }

    const selection = images.filter((image) => selectedIds.includes(image.id));

    try {
      await shareGalleryImages(selection);
      openToast('Share sheet opened.', 'success');
    } catch {
      openToast('Could not share selected photos.', 'error');
    }
  }, [images, openToast, selectedIds]);

  const selectedCount = selectedIds.length;
  const selectedLabel = selectedCount ? `${selectedCount} selected` : `${images.length} photos`;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <FlatList
          data={visibleImages}
          key={columnCount}
          numColumns={columnCount}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: contentPadding }]}
          columnWrapperStyle={columnCount > 1 ? { gap } : undefined}
          ListHeaderComponent={
            <View style={styles.headerStack}>
              <FadeInView>
                <View style={styles.titleRow}>
                  <View style={styles.titleCopy}>
                    <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>Moments</Text>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Gallery</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                      A local-first photo library that stays with the APK, Expo Go, and offline sessions.
                    </Text>
                  </View>
                  <View style={[styles.albumPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Album size={18} color={theme.colors.primary} strokeWidth={2.2} />
                    <View>
                      <Text style={[styles.albumLabel, { color: theme.colors.text }]}>{album?.name ?? 'My Gallery'}</Text>
                      <Text style={[styles.albumMeta, { color: theme.colors.textMuted }]}>{selectedLabel}</Text>
                    </View>
                  </View>
                </View>
              </FadeInView>

              <View style={[styles.searchCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, ...theme.shadows.card }]}>
                <Search size={18} color={theme.colors.textSubtle} strokeWidth={2.1} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search photos or tags"
                  placeholderTextColor={theme.colors.textSubtle}
                  style={[styles.searchInput, { color: theme.colors.text }]}
                />
                {query ? (
                  <Pressable onPress={() => setQuery('')} hitSlop={12}>
                    <X size={18} color={theme.colors.textSubtle} strokeWidth={2.2} />
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.sortRow}>
                {SORT_OPTIONS.map((option) => {
                  const active = option.value === sortMode;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => persistSortMode(option.value)}
                      style={[
                        styles.sortChip,
                        {
                          backgroundColor: active ? theme.colors.primarySoft : theme.colors.surface,
                          borderColor: active ? theme.colors.primarySoftBorder : theme.colors.border,
                        },
                      ]}>
                      <Text style={[styles.sortChipText, { color: active ? theme.colors.primary : theme.colors.text }]}>{option.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectionMode ? (
                <View style={[styles.selectionBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={styles.selectionInfo}>
                    <CheckSquare size={18} color={theme.colors.primary} strokeWidth={2.2} />
                    <Text style={[styles.selectionText, { color: theme.colors.text }]}>Selection mode</Text>
                  </View>
                  <View style={styles.selectionActions}>
                    <Pressable onPress={selectAllVisible} style={styles.selectionAction}>
                      <Text style={[styles.selectionActionText, { color: theme.colors.primary }]}>Select All</Text>
                    </Pressable>
                    <Pressable onPress={handleShareSelected} style={styles.selectionAction}>
                      <Text style={[styles.selectionActionText, { color: theme.colors.primary }]}>Share Selected</Text>
                    </Pressable>
                    <Pressable onPress={handleDeleteSelected} style={styles.selectionAction}>
                      <Text style={[styles.selectionActionText, { color: theme.colors.danger }]}>Delete Selected</Text>
                    </Pressable>
                    <Pressable onPress={clearSelection} style={styles.selectionAction}>
                      <Text style={[styles.selectionActionText, { color: theme.colors.textMuted }]}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingState}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Loading your gallery...</Text>
              </View>
            ) : (
              <EmptyGallery onAddPress={() => setBottomSheet('add')} theme={theme} />
            )
          }
          renderItem={({ item, index }) => (
            <GalleryCard
              image={item}
              index={index}
              width={cardWidth}
              theme={theme}
              selected={selectedIds.includes(item.id)}
              selectionMode={selectionMode}
              onPress={() => handleTilePress(item, index)}
              onLongPress={() => handleTileLongPress(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: gap }} />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <FloatingActionButton
        theme={theme}
        onPress={() => setBottomSheet('add')}
      />

      <BottomSheet
        visible={bottomSheet === 'add'}
        theme={theme}
        title="Add Photos"
        subtitle="Save new photos permanently to this device."
        onClose={() => setBottomSheet(null)}
      >
        <SheetAction icon={ImagePlus} label="Add Photos" onPress={handleAddPhotos} theme={theme} />
        <SheetAction icon={SquareDashedBottom} label="Create Album" onPress={handleCreateAlbum} theme={theme} />
        <SheetAction icon={X} label="Cancel" onPress={() => setBottomSheet(null)} theme={theme} />
      </BottomSheet>

      <BottomSheet
        visible={bottomSheet === 'actions' && activeActionIndex != null}
        theme={theme}
        title={visibleImages[activeActionIndex ?? 0]?.name ?? 'Photo'}
        subtitle="Choose what you want to do with this photo."
        onClose={() => setBottomSheet(null)}>
        <SheetAction icon={Eye} label="View" onPress={() => openViewer(activeActionIndex ?? 0, false)} theme={theme} />
        <SheetAction icon={ZoomIn} label="Zoom" onPress={() => openViewer(activeActionIndex ?? 0, true)} theme={theme} />
        <SheetAction icon={PenLine} label="Rename" onPress={() => openRenameModal(visibleImages[activeActionIndex ?? 0])} theme={theme} />
        <SheetAction icon={Share2} label="Share" onPress={handleShareSingle} theme={theme} />
        <SheetAction icon={Trash2} label="Delete" destructive onPress={handleDeleteSingle} theme={theme} />
        <SheetAction icon={X} label="Cancel" onPress={() => setBottomSheet(null)} theme={theme} />
      </BottomSheet>

      <RenameSheet
        visible={!!renameTarget}
        theme={theme}
        value={renameValue}
        onChangeText={setRenameValue}
        onCancel={() => setRenameTarget(null)}
        onSave={handleRenameSave}
      />

      <ViewerSheet
        visible={!!viewer}
        ref={viewerRef}
        theme={theme}
        images={visibleImages}
        viewer={viewer}
        onClose={() => setViewer(null)}
        onIndexChange={(index) => setViewer((current) => (current ? { ...current, index } : current))}
      />

      <ToastBanner toast={toast} theme={theme} />
    </View>
  );
}

function GalleryCard({
  image,
  index,
  width,
  theme,
  selected,
  selectionMode,
  onPress,
  onLongPress,
}: {
  image: GalleryImage;
  index: number;
  width: number;
  theme: AppTheme;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const aspectRatio = image.width > 0 && image.height > 0 ? image.width / image.height : 1;
  const height = Math.max(164, Math.min(320, Math.round(width / aspectRatio)));
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Animated.View entering={FadeInUp.delay(index * 25).duration(260)} style={{ width }}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={240}
        android_ripple={{ color: theme.colors.surfacePressed }}
        style={[
          styles.card,
          {
            height,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <Image
          source={{ uri: image.uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={260}
          onLoadStart={() => setIsLoaded(false)}
          onLoadEnd={() => setIsLoaded(true)}
        />
        {!isLoaded ? (
          <View style={[StyleSheet.absoluteFill, styles.cardLoader]}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : null}
        <View style={[StyleSheet.absoluteFill, styles.cardOverlay]} />
        <View style={styles.cardFooter}>
          <View style={styles.cardText}>
            <Text style={styles.cardName} numberOfLines={1}>
              {image.name}
            </Text>
            <Text style={styles.cardMeta} numberOfLines={1}>
              {Math.max(1, Math.round(image.size / 1024))} KB
            </Text>
          </View>
          {selectionMode ? (
            <View style={[styles.selectionBadge, { borderColor: selected ? theme.colors.primary : theme.colors.border }]}>
              {selected ? <Check size={14} color={theme.colors.primary} strokeWidth={2.6} /> : null}
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

function FloatingActionButton({ theme, onPress }: { theme: AppTheme; onPress: () => void }) {
  const scale = useSharedValue(1);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.springify().mass(0.8)}
      style={[styles.fab, { backgroundColor: theme.dark ? theme.colors.surface : theme.colors.background }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: theme.colors.primarySoft }}
        onPressIn={() => {
          scale.value = withSpring(0.94);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.fabPressable}>
        <Plus size={24} color={theme.colors.primary} strokeWidth={2.6} />
      </Pressable>
    </Animated.View>
  );
}

function BottomSheet({
  visible,
  title,
  subtitle,
  children,
  onClose,
  theme,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  theme: AppTheme;
}) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <BlurView intensity={24} tint={theme.dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]} />
      </Pressable>
      <Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutDown.duration(180)} style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sheetSubtitle}>{subtitle}</Text> : null}
        <View style={styles.sheetDivider} />
        <View style={styles.sheetActions}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

function SheetAction({
  icon: Icon,
  label,
  onPress,
  theme,
  destructive,
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  onPress: () => void;
  theme: AppTheme;
  destructive?: boolean;
}) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable onPress={onPress} android_ripple={{ color: theme.colors.surfacePressed }} style={styles.sheetAction}>
      <Icon size={18} color={destructive ? theme.colors.danger : theme.colors.text} strokeWidth={2.2} />
      <Text style={[styles.sheetActionText, { color: destructive ? theme.colors.danger : theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

function RenameSheet({
  visible,
  value,
  onChangeText,
  onCancel,
  onSave,
  theme,
}: {
  visible: boolean;
  value: string;
  onChangeText: (next: string) => void;
  onCancel: () => void;
  onSave: () => void;
  theme: AppTheme;
}) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.sheetBackdrop} onPress={onCancel}>
        <BlurView intensity={22} tint={theme.dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]} />
      </Pressable>
      <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutDown.duration(180)} style={styles.renameSheet}>
        <Text style={styles.sheetTitle}>Rename Image</Text>
        <Text style={styles.sheetSubtitle}>Give this photo a clear, searchable name.</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Image name"
          placeholderTextColor={theme.colors.textSubtle}
          style={[styles.renameInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
        />
        <View style={styles.renameActions}>
          <Pressable onPress={onCancel} style={styles.renameButton}>
            <Text style={[styles.renameButtonText, { color: theme.colors.textMuted }]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={onSave} style={[styles.renameButton, styles.renamePrimaryButton]}>
            <Text style={[styles.renameButtonText, { color: theme.colors.buttonTextOnPrimary }]}>Save</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

function ViewerSheet({
  visible,
  images,
  viewer,
  onClose,
  onIndexChange,
  ref,
  theme,
}: {
  visible: boolean;
  images: GalleryImage[];
  viewer: ViewerState | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  ref: React.RefObject<FlatList<GalleryImage> | null>;
  theme: AppTheme;
}) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (visible && viewer) {
      const timer = setTimeout(() => {
        ref.current?.scrollToIndex({ index: viewer.index, animated: false });
      }, 24);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [ref, visible, viewer]);

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 60 }), []);
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        onIndexChange(viewableItems[0].index);
      }
    },
    [onIndexChange],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => (
      <ZoomablePage image={item} width={width} isActive={viewer?.index === index} zoomed={Boolean(viewer?.zoomed && viewer?.index === index)} theme={theme} />
    ),
    [theme, viewer?.index, viewer?.zoomed, width],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.viewerRoot}>
        <BlurView intensity={26} tint={theme.dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.modalOverlay }]} />

        <View style={styles.viewerTopBar}>
          <View style={styles.viewerIndicator}>
            <Text style={styles.viewerIndicatorText}>
              {viewer ? `${viewer.index + 1} / ${images.length}` : `0 / ${images.length}`}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.viewerClose}>
            <X size={20} color={theme.colors.text} strokeWidth={2.3} />
          </Pressable>
        </View>

        <FlatList
          ref={ref}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={viewer?.index ?? 0}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              ref.current?.scrollToIndex({ index: info.index, animated: false });
            }, 50);
          }}
        />
      </View>
    </Modal>
  );
}

function ZoomablePage({
  image,
  width,
  isActive,
  zoomed,
  theme,
}: {
  image: GalleryImage;
  width: number;
  isActive: boolean;
  zoomed: boolean;
  theme: AppTheme;
}) {
  const scale = useSharedValue(zoomed ? 2 : 1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(zoomed ? 2 : 1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [loaded, setLoaded] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const nextScale = zoomed ? 2 : 1;
    scale.value = withTiming(nextScale, { duration: 180 });
    translateX.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(0, { duration: 180 });
    savedScale.value = nextScale;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [isActive, scale, savedScale, savedTranslateX, savedTranslateY, translateX, translateY, zoomed]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const nextScale = Math.max(1, Math.min(4, savedScale.value * event.scale));
      scale.value = nextScale;
    })
    .onEnd(() => {
      if (scale.value < 1.01) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }

      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onUpdate((event) => {
      if (scale.value <= 1.02) {
        return;
      }

      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      if (scale.value <= 1.02) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }

      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const nextScale = scale.value > 1.5 ? 1 : 2.25;
      scale.value = withSpring(nextScale);
      if (nextScale === 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
      savedScale.value = nextScale;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <View style={[styles.viewerPage, { width }]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.viewerImageStage, animatedStyle]}>
          <Image
            source={{ uri: image.uri }}
            style={styles.viewerImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={240}
            onLoadEnd={() => setLoaded(true)}
            onLoadStart={() => setLoaded(false)}
          />
          {!loaded ? (
            <View style={styles.viewerLoader}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : null}
        </Animated.View>
      </GestureDetector>
      <Text style={styles.viewerCaption} numberOfLines={1}>
        {image.name}
      </Text>
    </View>
  );
}

function EmptyGallery({ onAddPress, theme }: { onAddPress: () => void; theme: AppTheme }) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Animated.View entering={FadeInUp.duration(260)} style={styles.emptyState}>
      <View style={[styles.emptyIllustration, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Images size={44} color={theme.colors.primary} strokeWidth={2.1} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No photos yet</Text>
      <Text style={[styles.emptyCopy, { color: theme.colors.textMuted }]}>Tap + to add your first photo.</Text>
      <Pressable onPress={onAddPress} style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.emptyButtonText, { color: theme.colors.buttonTextOnPrimary }]}>Add Photos</Text>
      </Pressable>
    </Animated.View>
  );
}

function ToastBanner({ toast, theme }: { toast: ToastState | null; theme: AppTheme }) {
  if (!toast) {
    return null;
  }

  const styles = createStyles(theme);
  const toneColor =
    toast.tone === 'error' ? theme.colors.danger : toast.tone === 'info' ? theme.colors.primary : theme.colors.success;

  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutUp.duration(180)} style={[styles.toast, { borderColor: toneColor }]}>
      <Text style={[styles.toastText, { color: theme.colors.text }]}>{toast.message}</Text>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    listContent: {
      gap: Spacing.four,
      paddingTop: Spacing.five,
      paddingBottom: 120,
    },
    headerStack: {
      gap: Spacing.four,
      marginBottom: Spacing.two,
    },
    titleRow: {
      flexDirection: 'row',
      gap: Spacing.four,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    titleCopy: {
      flex: 1,
      gap: Spacing.one,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    title: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '500',
    },
    albumPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderWidth: 1,
      borderRadius: Radii.round,
    },
    albumLabel: {
      fontSize: 13,
      fontWeight: '800',
    },
    albumMeta: {
      fontSize: 12,
      fontWeight: '600',
    },
    searchCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      borderRadius: Radii.round,
      borderWidth: 1,
      paddingHorizontal: Spacing.four,
      minHeight: 50,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      paddingVertical: 0,
    },
    sortRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    sortChip: {
      borderWidth: 1,
      borderRadius: Radii.round,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
    },
    sortChipText: {
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    selectionBar: {
      borderWidth: 1,
      borderRadius: Radii.large,
      padding: Spacing.three,
      gap: Spacing.three,
    },
    selectionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },
    selectionText: {
      fontSize: 14,
      fontWeight: '800',
    },
    selectionActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },
    selectionAction: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radii.round,
      backgroundColor: theme.colors.surfaceSoft,
    },
    selectionActionText: {
      fontSize: 12,
      fontWeight: '800',
    },
    loadingState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 72,
      gap: Spacing.three,
    },
    loadingText: {
      fontSize: 14,
      fontWeight: '600',
    },
    card: {
      borderRadius: Radii.large,
      overflow: 'hidden',
      borderWidth: 1,
      ...theme.shadows.card,
    },
    cardLoader: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceSoft,
    },
    cardOverlay: {
      backgroundColor: 'rgba(2, 6, 23, 0.18)',
    },
    cardFooter: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: Spacing.three,
    },
    cardText: {
      alignSelf: 'stretch',
      gap: 2,
      marginTop: 'auto',
    },
    cardName: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },
    cardMeta: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: 12,
      fontWeight: '600',
    },
    selectionBadge: {
      alignSelf: 'flex-end',
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderWidth: 1,
    },
    fab: {
      position: 'absolute',
      right: Spacing.five,
      bottom: 28,
      borderRadius: Radii.round,
      ...theme.shadows.soft,
    },
    fabPressable: {
      width: 58,
      height: 58,
      borderRadius: Radii.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sheetBackdrop: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'flex-end',
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: Radii.xlarge,
      borderTopRightRadius: Radii.xlarge,
      paddingHorizontal: Spacing.five,
      paddingTop: Spacing.three,
      paddingBottom: Spacing.five,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      gap: Spacing.two,
      ...theme.shadows.card,
    },
    sheetHandle: {
      alignSelf: 'center',
      width: 42,
      height: 5,
      borderRadius: Radii.round,
      backgroundColor: theme.colors.border,
      marginBottom: Spacing.one,
    },
    sheetTitle: {
      color: theme.colors.text,
      fontSize: 19,
      fontWeight: '900',
    },
    sheetSubtitle: {
      color: theme.colors.textMuted,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '500',
    },
    sheetDivider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: Spacing.one,
    },
    sheetActions: {
      gap: Spacing.two,
    },
    sheetAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      minHeight: 48,
      borderRadius: Radii.large,
      paddingHorizontal: Spacing.three,
    },
    sheetActionText: {
      fontSize: 15,
      fontWeight: '800',
    },
    renameSheet: {
      position: 'absolute',
      left: Spacing.five,
      right: Spacing.five,
      top: '32%',
      padding: Spacing.five,
      borderRadius: Radii.xlarge,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: Spacing.three,
      ...theme.shadows.card,
    },
    renameInput: {
      minHeight: 52,
      borderRadius: Radii.large,
      borderWidth: 1,
      paddingHorizontal: Spacing.four,
      fontSize: 15,
      fontWeight: '600',
      backgroundColor: theme.colors.surfaceSoft,
    },
    renameActions: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    renameButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: Radii.large,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceSoft,
    },
    renamePrimaryButton: {
      backgroundColor: theme.colors.primary,
    },
    renameButtonText: {
      fontSize: 14,
      fontWeight: '800',
    },
    viewerRoot: {
      flex: 1,
      justifyContent: 'center',
    },
    viewerTopBar: {
      position: 'absolute',
      top: 56,
      left: Spacing.five,
      right: Spacing.five,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    viewerIndicator: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderRadius: Radii.round,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.16)',
    },
    viewerIndicatorText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    viewerClose: {
      width: 42,
      height: 42,
      borderRadius: Radii.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.14)',
    },
    viewerPage: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.nine,
      gap: Spacing.three,
    },
    viewerImageStage: {
      width: '100%',
      height: '82%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewerImage: {
      width: '100%',
      height: '100%',
    },
    viewerLoader: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewerCaption: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      paddingHorizontal: Spacing.five,
      textAlign: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 56,
      paddingHorizontal: Spacing.five,
      gap: Spacing.three,
    },
    emptyIllustration: {
      width: 96,
      height: 96,
      borderRadius: 28,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.soft,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: '900',
    },
    emptyCopy: {
      fontSize: 14,
      lineHeight: 22,
      fontWeight: '500',
      textAlign: 'center',
      maxWidth: 280,
    },
    emptyButton: {
      minHeight: 48,
      paddingHorizontal: Spacing.five,
      borderRadius: Radii.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyButtonText: {
      fontSize: 14,
      fontWeight: '800',
    },
    toast: {
      position: 'absolute',
      left: Spacing.five,
      right: Spacing.five,
      bottom: 92,
      borderRadius: Radii.large,
      borderWidth: 1,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.three,
      backgroundColor: theme.colors.surface,
      ...theme.shadows.card,
    },
    toastText: {
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
}
