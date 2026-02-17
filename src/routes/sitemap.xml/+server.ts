import type { RequestHandler } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';
import { locales } from '$lib/i18n/i18n';
import type { EventInfo } from '$lib/models/event-info.model';

export const GET: RequestHandler = async ({ fetch, url }) => {

    function escapeXml(str: string) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    const urls: string[] = [];

    for (const locale of locales) {

        const res = await fetch(`${API_BASE_URL}/events`, {
            headers: {
                'x-language': locale
            }
        });

        if (!res.ok) continue;

        const events: EventInfo[] = await res.json();

        for (const event of events) {

            //TODO get real date
            urls.push(`
                <url>
                    <loc>${url.origin}/${locale}/events/${escapeXml(event.slug)}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.9</priority>
                </url>
            `);
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600'
        }
    });
};