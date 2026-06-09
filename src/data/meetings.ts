import { AvailabilitySlot, MeetingRequest } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'slot1',
    entrepreneurId: 'e1',
    date: '2026-06-12',
    time: '10:00',
    durationMinutes: 30
  },
  {
    id: 'slot2',
    entrepreneurId: 'e1',
    date: '2026-06-15',
    time: '14:00',
    durationMinutes: 45
  },
  {
    id: 'slot3',
    entrepreneurId: 'e2',
    date: '2026-06-13',
    time: '11:00',
    durationMinutes: 30
  }
];

export const meetingRequests: MeetingRequest[] = [
  {
    id: 'meet1',
    investorId: 'i1',
    entrepreneurId: 'e1',
    slotId: 'slot1',
    message: 'I would love to connect and review your platform in detail. Please confirm this slot if it works for you.',
    status: 'pending',
    createdAt: '2026-06-06T10:00:00Z'
  },
  {
    id: 'meet2',
    investorId: 'i2',
    entrepreneurId: 'e1',
    slotId: 'slot2',
    message: 'Looking forward to discussing the next phase for your business. This is a good time for me.',
    status: 'accepted',
    createdAt: '2026-06-04T14:20:00Z'
  }
];

export const getSlotsForEntrepreneur = (entrepreneurId: string): AvailabilitySlot[] => {
  return availabilitySlots
    .filter(slot => slot.entrepreneurId === entrepreneurId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
};

export const addAvailabilitySlot = (
  entrepreneurId: string,
  date: string,
  time: string,
  durationMinutes: number
): AvailabilitySlot => {
  const newSlot: AvailabilitySlot = {
    id: `slot${availabilitySlots.length + 1}`,
    entrepreneurId,
    date,
    time,
    durationMinutes
  };

  availabilitySlots.push(newSlot);
  return newSlot;
};

export const updateAvailabilitySlot = (
  slotId: string,
  updates: Partial<AvailabilitySlot>
): AvailabilitySlot | null => {
  const slotIndex = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (slotIndex === -1) return null;

  availabilitySlots[slotIndex] = {
    ...availabilitySlots[slotIndex],
    ...updates
  };

  return availabilitySlots[slotIndex];
};

export const removeAvailabilitySlot = (slotId: string): boolean => {
  const index = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (index === -1) return false;

  availabilitySlots.splice(index, 1);
  return true;
};

export const getMeetingRequestsForEntrepreneur = (entrepreneurId: string): MeetingRequest[] => {
  return meetingRequests
    .filter(request => request.entrepreneurId === entrepreneurId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getMeetingRequestsFromInvestor = (investorId: string): MeetingRequest[] => {
  return meetingRequests
    .filter(request => request.investorId === investorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createMeetingRequest = (
  investorId: string,
  entrepreneurId: string,
  slotId: string,
  message: string
): MeetingRequest => {
  const newRequest: MeetingRequest = {
    id: `meet${meetingRequests.length + 1}`,
    investorId,
    entrepreneurId,
    slotId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  meetingRequests.push(newRequest);
  return newRequest;
};

export const updateMeetingRequestStatus = (
  requestId: string,
  newStatus: 'pending' | 'accepted' | 'declined'
): MeetingRequest | null => {
  const requestIndex = meetingRequests.findIndex(request => request.id === requestId);
  if (requestIndex === -1) return null;

  meetingRequests[requestIndex] = {
    ...meetingRequests[requestIndex],
    status: newStatus
  };

  return meetingRequests[requestIndex];
};

export const findAvailabilitySlotById = (slotId: string): AvailabilitySlot | null => {
  return availabilitySlots.find(slot => slot.id === slotId) || null;
};
