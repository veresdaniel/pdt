import { API_BASE_URL } from '$env/static/private';
import type { EventModel } from "$lib/models/event-model.model";

export class EventService {

    async getUpcomingEvent(
        fetch: typeof global.fetch,
        lang: string
    ): Promise<EventModel> {
        const res: Response = await fetch(`${API_BASE_URL}/events/upcoming`, {
            headers: {
                'x-language': lang
            }
        });

        if (!res.ok) throw new Error(`Failed to fetch event url: ${JSON.stringify(await res.json())}`);

        return res.json();
    }
}