import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const YT = 'https://www.googleapis.com/youtube/v3';

export interface YTVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: string;
  duration: string;
  ago: string;
  url: string;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '0:00';
  const h = parseInt(m[1] || '0');
  const min = parseInt(m[2] || '0');
  const s = parseInt(m[3] || '0');
  const mm = String(min).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function useYouTubeVideos(handle: string) {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Resolve handle → uploads playlist ID
        const chanRes = await fetch(`${YT}/channels?part=contentDetails&forHandle=${handle}&key=${API_KEY}`);
        const chanData = await chanRes.json();
        if (!chanData.items?.length) throw new Error('Channel not found');
        const uploadsId: string = chanData.items[0].contentDetails.relatedPlaylists.uploads;

        // Latest 3 video IDs + snippet
        const plRes = await fetch(`${YT}/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=3&key=${API_KEY}`);
        const plData = await plRes.json();
        if (!plData.items?.length) throw new Error('No videos found');

        const snippets = plData.items.map((i: any) => i.snippet);
        const ids = snippets.map((s: any) => s.resourceId.videoId).join(',');

        // Statistics + duration
        const statsRes = await fetch(`${YT}/videos?part=statistics,contentDetails&id=${ids}&key=${API_KEY}`);
        const statsData = await statsRes.json();

        const result: YTVideo[] = statsData.items.map((v: any, i: number) => ({
          id: v.id,
          title: snippets[i].title,
          thumbnail:
            snippets[i].thumbnails?.maxres?.url ||
            snippets[i].thumbnails?.high?.url ||
            snippets[i].thumbnails?.medium?.url,
          viewCount: formatViews(parseInt(v.statistics.viewCount || '0')),
          duration: parseDuration(v.contentDetails.duration),
          ago: timeAgo(snippets[i].publishedAt),
          url: `https://www.youtube.com/watch?v=${v.id}`,
        }));

        setVideos(result);
      } catch (e: any) {
        setError(e.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [handle]);

  return { videos, loading, error };
}
