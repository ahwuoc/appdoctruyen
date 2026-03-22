import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { createSlug } from '@/app/utils/common/utils';
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const routes = [
    '',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const { data: albums } = await supabase
      .from('albums')
      .select('id, title, updated_at, created_at')
      .order('updated_at', { ascending: false });

    const albumRoutes = (albums || []).map((album) => ({
      url: `${baseUrl}/album/${createSlug(album.title)}-${album.id}`,
      lastModified: new Date(album.updated_at || album.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...routes, ...albumRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return routes;
  }
}
