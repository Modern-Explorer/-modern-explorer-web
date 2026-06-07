import { useState, useEffect } from 'react';

export interface YTVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  published: string;
  link: string;
  viewCount: string;
  duration: string;
  ago: string;
}

export function useYouTubeVideos(_handle: string) {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/youtube');
        const text = await res.text();
        if (!text) throw new Error('Empty response from YouTube proxy');
        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          console.error('YouTube proxy returned non-JSON:', text.slice(0, 200));
          throw new Error('YouTube proxy returned invalid JSON');
        }
        if (!res.ok) throw new Error(data.error || 'Failed to load videos');
        setVideos(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { videos, loading, error };
}
