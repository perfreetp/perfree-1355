import type { ActivityReview, MemberStats } from '@/types';
import { mockBooks } from './books';
import { mockMembers } from './members';

export const mockActivityReviews: ActivityReview[] = [
  {
    id: 'ar1',
    title: '2026年5月共读《活着》',
    month: '2026-05',
    bookId: 'b2',
    book: mockBooks[1],
    completedMembers: [mockMembers[0], mockMembers[1], mockMembers[2], mockMembers[3], mockMembers[4]],
    totalParticipants: 6,
    averageRating: 4.8,
    summary: '本月我们一起读完了余华的《活着》，这本书让我们深刻体会到了生命的坚韧与重量。福贵的一生充满了苦难，但他始终保持着对生活的热爱和对家人的责任。通过这次共读，我们不仅理解了小说中"活着"的深刻内涵，也反思了自己的人生态度。',
    keyNotes: [
      '人是为活着本身而活着，而不是为了活着之外的任何事物而活着',
      '苦难是人生的常态，但选择如何面对苦难，决定了我们生命的质量',
      '家人的陪伴和爱是支撑我们走过艰难岁月的最重要力量',
      '余华用平实的语言写出了最深沉的痛苦，也写出了最温暖的希望',
      '对比福贵的一生，我们更应该珍惜当下的幸福生活'
    ],
    createdAt: '2026-05-31'
  },
  {
    id: 'ar2',
    title: '2026年4月共读《三体》',
    month: '2026-04',
    bookId: 'b4',
    book: mockBooks[3],
    completedMembers: [mockMembers[0], mockMembers[1], mockMembers[2], mockMembers[5]],
    totalParticipants: 5,
    averageRating: 4.9,
    summary: '本月我们探索了刘慈欣笔下的科幻世界，《三体》带给我们的不仅是震撼的宇宙图景，更是对人类文明、人性本质的深刻思考。从"黑暗森林法则"到"降维打击"，书中的每一个概念都引发了我们激烈的讨论。',
    keyNotes: [
      '宇宙就是一座黑暗森林，每个文明都是带枪的猎人',
      '弱小和无知不是生存的障碍，傲慢才是',
      '给岁月以文明，而不是给文明以岁月',
      '三体问题无解，就像人生中的许多困境一样',
      '当人类面临末日时，最考验的是人性的光辉与阴暗'
    ],
    createdAt: '2026-04-30'
  },
  {
    id: 'ar3',
    title: '2026年3月共读《小王子》',
    month: '2026-03',
    bookId: 'b7',
    book: mockBooks[6],
    completedMembers: [mockMembers[0], mockMembers[1], mockMembers[3], mockMembers[4], mockMembers[6], mockMembers[7]],
    totalParticipants: 7,
    averageRating: 4.9,
    summary: '这本薄薄的小书，却蕴含着最深刻的人生哲理。我们跟随小王子的星际旅行，重新发现了什么是真正重要的东西——爱、友谊和责任。每个人都从书中找到了属于自己的那个"小王子"和"玫瑰"。',
    keyNotes: [
      '只有用心灵才能看得清事物本质，真正重要的东西是肉眼无法看见的',
      '你为你的玫瑰花费了时间，这才使你的玫瑰变得如此重要',
      '所有的大人都曾经是小孩，虽然只有少数人记得',
      '当你爱上一朵花，你看满天的星星都像开满了花',
      '仪式感是一件经常被遗忘的事情，它使某一天与其他日子不同，使某一时刻与其他时刻不同'
    ],
    createdAt: '2026-03-31'
  },
  {
    id: 'ar4',
    title: '2026年2月共读《思考，快与慢》',
    month: '2026-02',
    bookId: 'b3',
    book: mockBooks[2],
    completedMembers: [mockMembers[0], mockMembers[1], mockMembers[2], mockMembers[4]],
    totalParticipants: 5,
    averageRating: 4.6,
    summary: '诺贝尔经济学奖得主卡尼曼为我们揭示了人类思维的两套系统——快思考和慢思考。通过阅读这本书，我们认识到了自己思维中的种种偏见和陷阱，学会了如何做出更理性的决策。',
    keyNotes: [
      '我们的大脑有快与慢两种作决定的方式，要学会在适当的时候切换',
      '锚定效应、损失厌恶、框架效应...这些认知偏差每天都在影响我们',
      '直觉往往是不可靠的，特别是在处理复杂问题时',
      '承认自己的无知和偏见，是提升决策质量的第一步',
      '系统2虽然慢而费力，但它是我们理性思考的基石'
    ],
    createdAt: '2026-02-28'
  }
];

export const mockMemberStats: MemberStats[] = mockMembers.map((member, index) => ({
  memberId: member.id,
  member,
  totalParticipations: member.participateCount,
  completedBooks: member.participateCount - index,
  totalExcerpts: 3 + index * 2,
  totalBorrows: 2 + index,
  totalLents: index
}));

export const getActivityReviews = (): ActivityReview[] => {
  return mockActivityReviews;
};

export const getActivityReviewById = (id: string): ActivityReview | undefined => {
  return mockActivityReviews.find(ar => ar.id === id);
};

export const getActivityReviewByMonth = (month: string): ActivityReview | undefined => {
  return mockActivityReviews.find(ar => ar.month === month);
};

export const getMemberStatsList = (): MemberStats[] => {
  return mockMemberStats.sort((a, b) => b.totalParticipations - a.totalParticipations);
};

export const getMemberStatsById = (memberId: string): MemberStats | undefined => {
  return mockMemberStats.find(ms => ms.memberId === memberId);
};
