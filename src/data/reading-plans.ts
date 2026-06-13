import type { ReadingPlan, ReadingParticipant } from '@/types';
import { mockBooks } from './books';
import { mockMembers } from './members';

const mockParticipants: ReadingParticipant[] = [
  {
    id: 'rp1',
    planId: 'rp1',
    memberId: 'm1',
    member: mockMembers[0],
    joinedAt: '2026-06-01',
    currentChapter: 8,
    lastReadAt: '2026-06-12',
    status: 'reading'
  },
  {
    id: 'rp2',
    planId: 'rp1',
    memberId: 'm2',
    member: mockMembers[1],
    joinedAt: '2026-06-01',
    currentChapter: 12,
    lastReadAt: '2026-06-13',
    status: 'reading'
  },
  {
    id: 'rp3',
    planId: 'rp1',
    memberId: 'm3',
    member: mockMembers[2],
    joinedAt: '2026-06-02',
    currentChapter: 5,
    lastReadAt: '2026-06-10',
    status: 'reading'
  },
  {
    id: 'rp4',
    planId: 'rp1',
    memberId: 'm4',
    member: mockMembers[3],
    joinedAt: '2026-06-03',
    currentChapter: 20,
    lastReadAt: '2026-06-11',
    status: 'completed'
  },
  {
    id: 'rp5',
    planId: 'rp1',
    memberId: 'm5',
    member: mockMembers[4],
    joinedAt: '2026-06-05',
    currentChapter: 3,
    lastReadAt: '2026-06-08',
    status: 'paused'
  }
];

export const mockReadingPlans: ReadingPlan[] = [
  {
    id: 'plan1',
    bookId: 'b1',
    book: mockBooks[0],
    month: '2026-06',
    adminId: 'm1',
    admin: mockMembers[0],
    createdAt: '2026-05-25',
    status: 'ongoing',
    description: '本月我们将一起阅读《人类简史》，探索人类从认知革命到科学革命的伟大历程。每周三晚8点线上讨论，月末线下交流会。',
    participants: mockParticipants
  },
  {
    id: 'plan2',
    bookId: 'b4',
    book: mockBooks[3],
    month: '2026-07',
    adminId: 'm1',
    admin: mockMembers[0],
    createdAt: '2026-06-10',
    status: 'upcoming',
    description: '下月共读书目《三体》，让我们一起进入刘慈欣笔下的科幻世界，感受宇宙的浩瀚与人类的渺小。',
    participants: [
      {
        id: 'rp6',
        planId: 'plan2',
        memberId: 'm1',
        member: mockMembers[0],
        joinedAt: '2026-06-10',
        currentChapter: 0,
        lastReadAt: '',
        status: 'reading'
      },
      {
        id: 'rp7',
        planId: 'plan2',
        memberId: 'm2',
        member: mockMembers[1],
        joinedAt: '2026-06-11',
        currentChapter: 0,
        lastReadAt: '',
        status: 'reading'
      }
    ]
  }
];

export const getCurrentPlan = (): ReadingPlan | undefined => {
  return mockReadingPlans.find(p => p.status === 'ongoing');
};

export const getUpcomingPlans = (): ReadingPlan[] => {
  return mockReadingPlans.filter(p => p.status === 'upcoming');
};

export const getCompletedPlans = (): ReadingPlan[] => {
  return mockReadingPlans.filter(p => p.status === 'completed');
};

export const getPlanById = (id: string): ReadingPlan | undefined => {
  return mockReadingPlans.find(p => p.id === id);
};
