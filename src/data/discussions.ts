import type { Excerpt } from '@/types';
import { mockMembers } from './members';
import { mockBooks } from './books';

export const mockExcerpts: Excerpt[] = [
  {
    id: 'e1',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm1',
    member: mockMembers[0],
    chapter: 2,
    chapterTitle: '认知革命',
    content: '正是这些虚拟故事的力量，让互不相识的陌生人能够为了共同的目标而合作。这就是人类能够超越其他动物的关键所在。',
    note: '这个观点非常有启发性，原来宗教、国家、公司这些"想象的共同体"是人类合作的基础。',
    type: 'thought',
    createdAt: '2026-06-05 14:30',
    likes: 12,
    comments: 3
  },
  {
    id: 'e2',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm2',
    member: mockMembers[1],
    chapter: 3,
    chapterTitle: '亚当和夏娃的一天',
    content: '狩猎采集者的生活方式其实比农业革命后的农民更加健康和多样化。他们每周工作时间更短，饮食结构更均衡，疾病也更少。',
    note: '',
    type: 'quote',
    createdAt: '2026-06-06 09:15',
    likes: 8,
    comments: 2
  },
  {
    id: 'e3',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm3',
    member: mockMembers[2],
    chapter: 5,
    chapterTitle: '史上最大骗局',
    content: '农业革命真的是人类的进步吗？作者认为这是一个骗局：农民们比狩猎采集者工作更辛苦，饮食更差，还更容易受到疾病和自然灾害的影响。',
    note: '大家怎么看待这个观点？我们是否真的"进步"了？',
    type: 'question',
    createdAt: '2026-06-08 20:45',
    likes: 15,
    comments: 8
  },
  {
    id: 'e4',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm4',
    member: mockMembers[3],
    chapter: 7,
    chapterTitle: '记忆过载',
    content: '文字的发明改变了人类的思维方式，从依靠大脑记忆转向依靠外部存储。这使得大规模的行政系统和复杂的社会结构成为可能。',
    note: '联想到现在的互联网和AI，我们正在经历另一场记忆革命...',
    type: 'thought',
    createdAt: '2026-06-10 16:20',
    likes: 20,
    comments: 5
  },
  {
    id: 'e5',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm2',
    member: mockMembers[1],
    chapter: 10,
    chapterTitle: '金钱的味道',
    content: '金钱是有史以来最普遍也最有效的互信系统。人们愿意相信贝壳、金币、纸币这些本身没有价值的东西，因为它们是所有人都接受的"通用交换媒介"。',
    note: '',
    type: 'quote',
    createdAt: '2026-06-12 11:30',
    likes: 10,
    comments: 4
  },
  {
    id: 'e6',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm1',
    member: mockMembers[0],
    chapter: 12,
    chapterTitle: '宗教的法则',
    content: '宗教通过设定一套"超人的秩序"和具有约束力的规范，来解决人类社会的合作问题。它为人们的行为提供了神圣的合法性。',
    note: '作者对宗教的功能性解释很有意思，大家怎么看？',
    type: 'question',
    createdAt: '2026-06-13 08:45',
    likes: 7,
    comments: 6
  },
  {
    id: 'e7',
    planId: 'plan1',
    bookId: 'b1',
    memberId: 'm4',
    member: mockMembers[3],
    chapter: 14,
    chapterTitle: '发现自己的无知',
    content: '科学革命与之前所有知识传统的最大不同，在于它承认自己的"无知"。这种对未知的探索欲望，是现代科学进步的根本动力。',
    note: '这个观点太深刻了！承认无知才是进步的开始。',
    type: 'thought',
    createdAt: '2026-06-13 19:20',
    likes: 25,
    comments: 10
  }
];

export const getExcerptsByPlanId = (planId: string): Excerpt[] => {
  return mockExcerpts.filter(e => e.planId === planId);
};

export const getExcerptsByChapter = (planId: string, chapter: number): Excerpt[] => {
  return mockExcerpts.filter(e => e.planId === planId && e.chapter === chapter);
};

export const getExcerptsByMemberId = (memberId: string): Excerpt[] => {
  return mockExcerpts.filter(e => e.memberId === memberId);
};

export const getExcerptById = (id: string): Excerpt | undefined => {
  return mockExcerpts.find(e => e.id === id);
};
