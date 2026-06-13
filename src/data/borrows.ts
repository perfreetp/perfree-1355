import type { BorrowRecord } from '@/types';
import { mockMemberBooks } from './books';
import { mockMembers } from './members';

export const mockBorrowRecords: BorrowRecord[] = [
  {
    id: 'br1',
    memberBookId: 'mb1',
    memberBook: mockMemberBooks[0],
    borrowerId: 'm3',
    borrower: mockMembers[2],
    ownerId: 'm2',
    owner: mockMembers[1],
    status: 'borrowed',
    applyDate: '2026-06-01',
    expectedReturnDate: '2026-06-30',
    actualBorrowDate: '2026-06-05',
    note: '线下活动时交接'
  },
  {
    id: 'br2',
    memberBookId: 'mb4',
    memberBook: mockMemberBooks[3],
    borrowerId: 'm6',
    borrower: mockMembers[5],
    ownerId: 'm5',
    owner: mockMembers[4],
    status: 'pending',
    applyDate: '2026-06-12',
    expectedReturnDate: '2026-07-12',
    note: '希望能尽快拿到'
  },
  {
    id: 'br3',
    memberBookId: 'mb5',
    memberBook: mockMemberBooks[4],
    borrowerId: 'm7',
    borrower: mockMembers[6],
    ownerId: 'm6',
    owner: mockMembers[5],
    status: 'approved',
    applyDate: '2026-06-10',
    expectedReturnDate: '2026-07-10',
    actualBorrowDate: '2026-06-15',
    note: ''
  },
  {
    id: 'br4',
    memberBookId: 'mb2',
    memberBook: mockMemberBooks[1],
    borrowerId: 'm4',
    borrower: mockMembers[3],
    ownerId: 'm3',
    owner: mockMembers[2],
    status: 'returned',
    applyDate: '2026-05-01',
    expectedReturnDate: '2026-05-31',
    actualBorrowDate: '2026-05-05',
    actualReturnDate: '2026-05-28',
    note: '书保护得很好，谢谢！'
  },
  {
    id: 'br5',
    memberBookId: 'mb9',
    memberBook: mockMemberBooks[8],
    borrowerId: 'm1',
    borrower: mockMembers[0],
    ownerId: 'm4',
    owner: mockMembers[3],
    status: 'borrowed',
    applyDate: '2026-06-03',
    expectedReturnDate: '2026-06-28',
    actualBorrowDate: '2026-06-06',
    note: '看完马上归还'
  },
  {
    id: 'br6',
    memberBookId: 'mb6',
    memberBook: mockMemberBooks[5],
    borrowerId: 'm8',
    borrower: mockMembers[7],
    ownerId: 'm7',
    owner: mockMembers[6],
    status: 'pending',
    applyDate: '2026-06-13',
    expectedReturnDate: '2026-08-13',
    note: '想看全套，可以借久一点吗？'
  },
  {
    id: 'br7',
    memberBookId: 'mb8',
    memberBook: mockMemberBooks[7],
    borrowerId: 'm2',
    borrower: mockMembers[1],
    ownerId: 'm3',
    owner: mockMembers[2],
    status: 'returned',
    applyDate: '2026-04-15',
    expectedReturnDate: '2026-05-15',
    actualBorrowDate: '2026-04-18',
    actualReturnDate: '2026-05-12',
    note: '非常有启发的书'
  }
];

export const getBorrowRecordsByBorrowerId = (borrowerId: string): BorrowRecord[] => {
  return mockBorrowRecords.filter(br => br.borrowerId === borrowerId);
};

export const getBorrowRecordsByOwnerId = (ownerId: string): BorrowRecord[] => {
  return mockBorrowRecords.filter(br => br.ownerId === ownerId);
};

export const getPendingBorrows = (): BorrowRecord[] => {
  return mockBorrowRecords.filter(br => br.status === 'pending');
};

export const getBorrowedBooks = (): BorrowRecord[] => {
  return mockBorrowRecords.filter(br => br.status === 'borrowed');
};

export const getBorrowRecordById = (id: string): BorrowRecord | undefined => {
  return mockBorrowRecords.find(br => br.id === id);
};

export const getStatusText = (status: BorrowRecord['status']): string => {
  const statusMap: Record<BorrowRecord['status'], string> = {
    pending: '待审核',
    approved: '待取书',
    borrowed: '借阅中',
    returned: '已归还',
    rejected: '已拒绝'
  };
  return statusMap[status];
};
