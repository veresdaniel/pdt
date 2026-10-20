export interface EventInfo {
    id: number,
    title: string,
    slug: string,
    /** Fields returned by /events/past (used by the "Past events" block) */
    type?: number | string,
    dateTime?: string,
    location?: string,
    subtitle?: string,
    featuredImageUrl?: string
}
