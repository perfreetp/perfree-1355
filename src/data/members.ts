import type { Member } from '@/types';

export const mockMembers: Member[] = [
  {
    id: 'm1',
    name: '李明轩',
    avatar: 'https://picsum.photos/id/1005/200/200',
    joinDate: '2023-01-15',
    participateCount: 12,
    booksCount: 8,
    isAdmin: true,
    bio: '读书会发起人，热爱文学和历史'
  },
  {
    id: 'm2',
    name: '王雨晴',
    avatar: 'https://picsum.photos/id/1011/200/200',
    joinDate: '2023-02-20',
    participateCount: 10,
    booksCount: 15,
    isAdmin: false,
    bio: '喜欢阅读心理学和哲学类书籍'
  },
  {
    id: 'm3',
    name: '张浩然',
    avatar: 'https://picsum.photos/id/1012/200/200',
    joinDate: '2023-03-10',
    participateCount: 8,
    booksCount: 6,
    isAdmin: false,
    bio: '科幻小说和技术书籍爱好者'
  },
  {
    id: 'm4',
    name: '陈思琪',
    avatar: 'https://picsum.photos/id/1014/200/200',
    joinDate: '2023-04-05',
    participateCount: 6,
    booksCount: 12,
    isAdmin: false,
    bio: '偏爱散文和诗集，喜欢分享阅读感悟'
  },
  {
    id: 'm5',
    name: '刘子豪',
    avatar: 'https://picsum.photos/id/1025/200/200',
    joinDate: '2023-05-18',
    participateCount: 5,
    booksCount: 9,
    isAdmin: false,
    bio: '商业和传记类书籍忠实读者'
  },
  {
    id: 'm6',
    name: '赵雅琳',
    avatar: 'https://picsum.photos/id/1027/200/200',
    joinDate: '2023-06-22',
    participateCount: 4,
    booksCount: 7,
    isAdmin: false,
    bio: '喜欢艺术和设计类书籍'
  },
  {
    id: 'm7',
    name: '周文博',
    avatar: 'https://picsum.photos/id/1062/200/200',
    joinDate: '2023-07-30',
    participateCount: 3,
    booksCount: 11,
    isAdmin: false,
    bio: '历史和军事题材爱好者'
  },
  {
    id: 'm8',
    name: '吴诗涵',
    avatar: 'https://picsum.photos/id/1069/200/200',
    joinDate: '2023-08-15',
    participateCount: 2,
    booksCount: 5,
    isAdmin: false,
    bio: '喜欢阅读治愈系小说'
  }
];

export const getMemberById = (id: string): Member | undefined => {
  return mockMembers.find(m => m.id === id);
};

export const getAdminMembers = (): Member[] => {
  return mockMembers.filter(m => m.isAdmin);
};
