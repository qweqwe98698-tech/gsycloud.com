import rss from '@astrojs/rss';
import { getAllPublished } from '@utils/collections';
import { postUrl } from '@utils/url';
import { SITE } from '@utils/site';

export async function GET(context) {
  const all = await getAllPublished();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: all.slice(0, 50).map(({ collection, entry }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: postUrl(collection, entry.id),
    })),
    customData: `<language>zh-CN</language>`,
  });
}
