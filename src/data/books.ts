import type { Book, MemberBook } from '@/types';
import { mockMembers } from './members';

export const mockBooks: Book[] = [
  {
    id: 'b1',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://picsum.photos/id/101/300/400',
    description: '从认知革命、农业革命到科学革命，讲述人类如何登上食物链顶端，成为地球的主宰者。这本书以宏大的视角重新审视人类历史，引发读者对人类未来的深刻思考。',
    isbn: '9787508647357',
    totalChapters: 20,
    publishDate: '2014-02-14',
    category: '历史',
    rating: 4.8,
    ratingCount: 256
  },
  {
    id: 'b2',
    title: '活着',
    author: '余华',
    cover: 'https://picsum.photos/id/102/300/400',
    description: '讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，可他嗜赌如命，终于赌光了家业。他的父亲被他活活气死，母亲则在穷困中患了重病，福贵前去求药，却在途中被国民党抓去当壮丁。',
    isbn: '9787506365437',
    totalChapters: 12,
    publishDate: '2012-08-01',
    category: '文学',
    rating: 4.9,
    ratingCount: 892
  },
  {
    id: 'b3',
    title: '思考，快与慢',
    author: '丹尼尔·卡尼曼',
    cover: 'https://picsum.photos/id/103/300/400',
    description: '诺贝尔经济学奖得主丹尼尔·卡尼曼力作，彻底改变你对思考的看法。书中揭示了我们在决策过程中存在的种种偏见，帮助读者更好地理解自己的思维模式。',
    isbn: '9787508633558',
    totalChapters: 38,
    publishDate: '2012-07-01',
    category: '心理学',
    rating: 4.7,
    ratingCount: 445
  },
  {
    id: 'b4',
    title: '三体',
    author: '刘慈欣',
    cover: 'https://picsum.photos/id/104/300/400',
    description: '文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划"红岸工程"取得了突破性进展。在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。',
    isbn: '9787536692930',
    totalChapters: 30,
    publishDate: '2008-01-01',
    category: '科幻',
    rating: 4.9,
    ratingCount: 1234
  },
  {
    id: 'b5',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: 'https://picsum.photos/id/106/300/400',
    description: '《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰，反映了拉丁美洲一个世纪以来风云变幻的历史。',
    isbn: '9787544253994',
    totalChapters: 20,
    publishDate: '2011-06-01',
    category: '文学',
    rating: 4.8,
    ratingCount: 678
  },
  {
    id: 'b6',
    title: '原则',
    author: '瑞·达利欧',
    cover: 'https://picsum.photos/id/108/300/400',
    description: '华尔街投资大神、对冲基金公司桥水创始人，人生经验之作。瑞·达利欧分享了他的生活和工作原则，帮助读者在个人生活和职业生涯中做出更好的决策。',
    isbn: '9787508683805',
    totalChapters: 22,
    publishDate: '2018-01-01',
    category: '商业',
    rating: 4.6,
    ratingCount: 356
  },
  {
    id: 'b7',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    cover: 'https://picsum.photos/id/119/300/400',
    description: '以一位飞行员作为故事叙述者，讲述了小王子从自己星球出发前往地球的过程中，所经历的各种历险。作者以小王子的孩子式的眼光，透视出成人的空虚、盲目，愚妄和死板教条。',
    isbn: '9787544733083',
    totalChapters: 27,
    publishDate: '2012-06-01',
    category: '童话',
    rating: 4.9,
    ratingCount: 1567
  },
  {
    id: 'b8',
    title: '围城',
    author: '钱钟书',
    cover: 'https://picsum.photos/id/160/300/400',
    description: '《围城》是钱钟书所著的长篇小说，是中国现代文学史上一部风格独特的讽刺小说。被誉为"新儒林外史"。故事主要写抗战初期知识分子的群相。',
    isbn: '9787020090006',
    totalChapters: 9,
    publishDate: '2012-09-01',
    category: '文学',
    rating: 4.8,
    ratingCount: 723
  },
  {
    id: 'b9',
    title: '刻意练习',
    author: '安德斯·艾利克森',
    cover: 'https://picsum.photos/id/201/300/400',
    description: '著名心理学家艾利克森在"专业特长科学"领域潜心几十年，研究了一系列行业或领域中的专家级人物：国际象棋大师、顶尖小提琴家、运动明星、记忆高手、拼字冠军、杰出医生等。',
    isbn: '9787111551287',
    totalChapters: 14,
    publishDate: '2016-11-01',
    category: '自我提升',
    rating: 4.7,
    ratingCount: 489
  },
  {
    id: 'b10',
    title: '明朝那些事儿',
    author: '当年明月',
    cover: 'https://picsum.photos/id/1015/300/400',
    description: '以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，语言幽默风趣。对明朝十七帝和其他王公权贵和小人物的命运进行全景展示。',
    isbn: '9787213046438',
    totalChapters: 150,
    publishDate: '2011-05-01',
    category: '历史',
    rating: 4.9,
    ratingCount: 2134
  },
  {
    id: 'b11',
    title: '非暴力沟通',
    author: '马歇尔·卢森堡',
    cover: 'https://picsum.photos/id/1016/300/400',
    description: '著名的马歇尔·卢森堡博士发现了神奇而平和的非暴力沟通方式，通过非暴力沟通，世界各地无数的人们获得了爱、和谐和幸福。',
    isbn: '9787508086156',
    totalChapters: 13,
    publishDate: '2015-12-01',
    category: '心理学',
    rating: 4.8,
    ratingCount: 567
  },
  {
    id: 'b12',
    title: '时间简史',
    author: '史蒂芬·霍金',
    cover: 'https://picsum.photos/id/1018/300/400',
    description: '《时间简史》是英国物理学家斯蒂芬·霍金撰写的科普著作，讲述的是探索时间和空间核心秘密的故事，是关于宇宙本性的最前沿知识。',
    isbn: '9787535794567',
    totalChapters: 12,
    publishDate: '2018-01-01',
    category: '科普',
    rating: 4.7,
    ratingCount: 678
  }
];

export const mockMemberBooks: MemberBook[] = [
  {
    id: 'mb1',
    memberId: 'm2',
    bookId: 'b1',
    book: mockBooks[0],
    member: mockMembers[1],
    isAvailable: true,
    addedDate: '2024-01-10',
    condition: 'good',
    note: '书脊有轻微磨损，内页干净'
  },
  {
    id: 'mb2',
    memberId: 'm3',
    bookId: 'b4',
    book: mockBooks[3],
    member: mockMembers[2],
    isAvailable: true,
    addedDate: '2024-02-15',
    condition: 'new',
    note: '全新，仅翻阅过一次'
  },
  {
    id: 'mb3',
    memberId: 'm4',
    bookId: 'b5',
    book: mockBooks[4],
    member: mockMembers[3],
    isAvailable: false,
    addedDate: '2024-01-20',
    condition: 'good',
    note: '有少量读书笔记'
  },
  {
    id: 'mb4',
    memberId: 'm5',
    bookId: 'b6',
    book: mockBooks[5],
    member: mockMembers[4],
    isAvailable: true,
    addedDate: '2024-03-01',
    condition: 'fair',
    note: '封面有折痕，不影响阅读'
  },
  {
    id: 'mb5',
    memberId: 'm6',
    bookId: 'b7',
    book: mockBooks[6],
    member: mockMembers[5],
    isAvailable: true,
    addedDate: '2024-02-28',
    condition: 'new',
    note: '精装版，收藏级'
  },
  {
    id: 'mb6',
    memberId: 'm7',
    bookId: 'b10',
    book: mockBooks[9],
    member: mockMembers[6],
    isAvailable: true,
    addedDate: '2024-01-05',
    condition: 'good',
    note: '全套9本，可整套借阅'
  },
  {
    id: 'mb7',
    memberId: 'm2',
    bookId: 'b3',
    book: mockBooks[2],
    member: mockMembers[1],
    isAvailable: false,
    addedDate: '2024-03-10',
    condition: 'good',
    note: '有大量划线笔记'
  },
  {
    id: 'mb8',
    memberId: 'm3',
    bookId: 'b9',
    book: mockBooks[8],
    member: mockMembers[2],
    isAvailable: true,
    addedDate: '2024-03-15',
    condition: 'good',
    note: '品相良好'
  },
  {
    id: 'mb9',
    memberId: 'm4',
    bookId: 'b2',
    book: mockBooks[1],
    member: mockMembers[3],
    isAvailable: true,
    addedDate: '2024-02-10',
    condition: 'good',
    note: '经典版本'
  },
  {
    id: 'mb10',
    memberId: 'm5',
    bookId: 'b8',
    book: mockBooks[7],
    member: mockMembers[4],
    isAvailable: true,
    addedDate: '2024-01-25',
    condition: 'fair',
    note: '书页有轻微泛黄'
  },
  {
    id: 'mb11',
    memberId: 'm6',
    bookId: 'b11',
    book: mockBooks[10],
    member: mockMembers[5],
    isAvailable: false,
    addedDate: '2024-03-20',
    condition: 'new',
    note: '近期购入'
  },
  {
    id: 'mb12',
    memberId: 'm7',
    bookId: 'b12',
    book: mockBooks[11],
    member: mockMembers[6],
    isAvailable: true,
    addedDate: '2024-02-05',
    condition: 'good',
    note: '插图版，值得收藏'
  }
];

export const getBookById = (id: string): Book | undefined => {
  return mockBooks.find(b => b.id === id);
};

export const getMemberBookById = (id: string): MemberBook | undefined => {
  return mockMemberBooks.find(mb => mb.id === id);
};

export const getAvailableMemberBooks = (): MemberBook[] => {
  return mockMemberBooks.filter(mb => mb.isAvailable);
};

export const getMemberBooksByMemberId = (memberId: string): MemberBook[] => {
  return mockMemberBooks.filter(mb => mb.memberId === memberId);
};
