export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationType: 'in-person' | 'virtual' | 'hybrid';
  hostName: string;
  hostId: string;
  coverUrl: string;
  rsvps: Record<string, 'yes' | 'maybe' | 'no'>;
  maxAttendees?: number | null;
  ticketPrice?: string;
  visibility?: 'public' | 'private';
  requireApproval?: boolean;
  createdAt?: any;
}
