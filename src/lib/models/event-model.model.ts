export interface EventModel {
    id: number;
    title: string,
    dateTime: Date,
    location: string,
    subtitle: string,
    description: string,
    header: string,
    subHeader: string,
    slug: string,
    featuredImageUrl: string,
    programs: EventProgram[]
}

export interface EventProgram {
    date: Date,
    title: string,
    subtitle: string,
    logoUrl: string,
    speakers: EventSpeaker[]
}

export interface EventSpeaker {
    name: string,
    description: string,
    imageUrl: string
}