import { useEffect, useState } from 'react';
import { Platform, type ImageSourcePropType } from 'react-native';
import { Asset } from 'expo-asset';

const CACHE_NAME = 'boneefied-anatomy-v1';

type ImageState = { assetId?: number; source?: ImageSourcePropType; error?: string };

/**
 * Cache only images the student has actually opened. The web preview keeps
 * running after a network loss, but Metro image URLs cannot be fetched again
 * when a lesson is remounted. Native keeps using Expo's bundled asset source.
 */
export function useOfflineImage(source?: number): ImageState {
  const [webImage, setWebImage] = useState<ImageState>({});

  useEffect(() => {
    if (Platform.OS !== 'web' || !source) return;
    let disposed = false;
    let objectUrl: string | undefined;

    async function load() {
      try {
        const uri = Asset.fromModule(source!).uri;
        if (!uri) throw new Error('Image URL is missing');
        if (!('caches' in globalThis)) throw new Error('Browser image storage is unavailable');
        const cache = await caches.open(CACHE_NAME);
        let response = await cache.match(uri);
        if (!response) {
          const fetched = await fetch(uri);
          if (!fetched.ok) throw new Error(`Image request failed (${fetched.status})`);
          // Await the write so the image is available before reporting it ready.
          await cache.put(uri, fetched.clone());
          response = fetched;
        }
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error('Image response is not an image');
        objectUrl = URL.createObjectURL(blob);
        if (!disposed) setWebImage({ assetId: source, source: { uri: objectUrl } });
        else URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.warn('Unable to cache anatomy image', error);
        if (!disposed) setWebImage({ assetId: source, error: 'Image unavailable offline. Open this lesson while connected to save its images.' });
      }
    }
    setWebImage({});
    void load();
    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source]);

  if (Platform.OS !== 'web') return { source };
  return webImage.assetId === source ? webImage : {};
}