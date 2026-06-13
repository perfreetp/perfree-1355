import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Member,
  Book,
  MemberBook,
  ReadingPlan,
  ReadingParticipant,
  Excerpt,
  BorrowRecord,
  ActivityReview
} from '@/types';
import { mockMembers } from '@/data/members';
import { mockBooks, mockMemberBooks } from '@/data/books';
import { mockReadingPlans } from '@/data/reading-plans';
import { mockExcerpts } from '@/data/discussions';
import { mockBorrowRecords } from '@/data/borrows';
import { mockActivityReviews } from '@/data/activities';
import { formatDate, formatDateTime } from '@/utils';

interface BookRating {
  bookId: string;
  memberId: string;
  rating: number;
}

interface AppState {
  currentUserId: string;
  members: Member[];
  books: Book[];
  memberBooks: MemberBook[];
  readingPlans: ReadingPlan[];
  excerpts: Excerpt[];
  borrowRecords: BorrowRecord[];
  activityReviews: ActivityReview[];
  ratings: BookRating[];

  getCurrentUser: () => Member | undefined;
  getMemberById: (id: string) => Member | undefined;
  getBookById: (id: string) => Book | undefined;
  getMemberBookById: (id: string) => MemberBook | undefined;
  getCurrentPlan: () => ReadingPlan | undefined;
  getPlanById: (id: string) => ReadingPlan | undefined;
  getUpcomingPlans: () => ReadingPlan[];
  getCompletedPlans: () => ReadingPlan[];

  publishReadingPlan: (params: {
    bookId: string;
    month: string;
    description: string;
  }) => ReadingPlan;

  joinReadingPlan: (planId: string) => ReadingParticipant | undefined;
  updateReadingProgress: (params: {
    planId: string;
    currentChapter: number;
  }) => ReadingParticipant | undefined;

  addMemberBook: (params: {
    bookId?: string;
    bookData?: Partial<Book>;
    condition: 'new' | 'good' | 'fair' | 'poor';
    isAvailable: boolean;
    note?: string;
  }) => MemberBook;

  updateMemberBookAvailability: (
    memberBookId: string,
    isAvailable: boolean
  ) => void;

  getMemberBooksByMemberId: (memberId: string) => MemberBook[];
  getAvailableMemberBooks: () => MemberBook[];

  addExcerpt: (params: {
    planId: string;
    chapter: number;
    chapterTitle?: string;
    content: string;
    type: 'quote' | 'question' | 'thought';
    note?: string;
  }) => Excerpt;

  getExcerptsByPlanId: (planId: string) => Excerpt[];
  getExcerptsByMemberId: (memberId: string) => Excerpt[];

  rateBook: (bookId: string, rating: number) => void;
  getMyRating: (bookId: string) => number;
  getAverageRating: (bookId: string) => number;

  applyBorrow: (params: {
    memberBookId: string;
    expectedReturnDate: string;
    note?: string;
  }) => BorrowRecord;

  approveBorrow: (recordId: string, actualBorrowDate?: string) => void;
  rejectBorrow: (recordId: string) => void;
  confirmPickup: (recordId: string, actualBorrowDate?: string) => void;
  confirmReturn: (recordId: string, actualReturnDate?: string) => void;

  getBorrowRecordsByBorrowerId: (borrowerId: string) => BorrowRecord[];
  getBorrowRecordsByOwnerId: (ownerId: string) => BorrowRecord[];
  getPendingBorrows: (userId: string) => BorrowRecord[];
}

const genId = (prefix: string) => `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const hydrateRelations = (
  state: Omit<AppState, keyof { [K in keyof AppState as AppState[K] extends Function ? K : never]: never }>
) => {
  state.memberBooks = state.memberBooks.map(mb => ({
    ...mb,
    member: state.members.find(m => m.id === mb.memberId) || mb.member,
    book: state.books.find(b => b.id === mb.bookId) || mb.book
  }));
  state.readingPlans = state.readingPlans.map(rp => ({
    ...rp,
    book: state.books.find(b => b.id === rp.bookId) || rp.book,
    admin: state.members.find(m => m.id === rp.adminId) || rp.admin,
    participants: rp.participants.map(p => ({
      ...p,
      member: state.members.find(m => m.id === p.memberId) || p.member
    }))
  }));
  state.excerpts = state.excerpts.map(e => ({
    ...e,
    member: state.members.find(m => m.id === e.memberId) || e.member
  }));
  state.borrowRecords = state.borrowRecords.map(br => ({
    ...br,
    memberBook: state.memberBooks.find(mb => mb.id === br.memberBookId) || br.memberBook,
    borrower: state.members.find(m => m.id === br.borrowerId) || br.borrower,
    owner: state.members.find(m => m.id === br.ownerId) || br.owner
  }));
  state.activityReviews = state.activityReviews.map(ar => {
    const cm = ar.completedMembers as any;
    const memberIds: string[] =
      cm.length > 0 && typeof cm[0] === 'string'
        ? cm
        : cm.map((m: Member) => m.id);
    return {
      ...ar,
      book: state.books.find(b => b.id === ar.bookId) || ar.book,
      completedMembers: memberIds
        .map((id: string) => state.members.find((m: Member) => m.id === id))
        .filter(Boolean) as Member[]
    };
  });
  return state;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: 'm1',
      members: JSON.parse(JSON.stringify(mockMembers)),
      books: JSON.parse(JSON.stringify(mockBooks)),
      memberBooks: JSON.parse(JSON.stringify(mockMemberBooks)),
      readingPlans: JSON.parse(JSON.stringify(mockReadingPlans)),
      excerpts: JSON.parse(JSON.stringify(mockExcerpts)),
      borrowRecords: JSON.parse(JSON.stringify(mockBorrowRecords)),
      activityReviews: JSON.parse(JSON.stringify(mockActivityReviews)),
      ratings: [],

      getCurrentUser: () => get().members.find(m => m.id === get().currentUserId),
      getMemberById: (id: string) => get().members.find(m => m.id === id),
      getBookById: (id: string) => get().books.find(b => b.id === id),
      getMemberBookById: (id: string) => get().memberBooks.find(mb => mb.id === id),
      getCurrentPlan: () => get().readingPlans.find(p => p.status === 'ongoing'),
      getPlanById: (id: string) => get().readingPlans.find(p => p.id === id),
      getUpcomingPlans: () => get().readingPlans.filter(p => p.status === 'upcoming'),
      getCompletedPlans: () => get().readingPlans.filter(p => p.status === 'completed'),

      publishReadingPlan: ({ bookId, month, description }) => {
        const state = get();
        const book = state.getBookById(bookId);
        const currentUser = state.getCurrentUser();
        if (!book || !currentUser) {
          throw new Error('Book or user not found');
        }

        const newPlan: ReadingPlan = {
          id: genId('plan'),
          bookId,
          book,
          month,
          adminId: currentUser.id,
          admin: currentUser,
          createdAt: formatDate(new Date()),
          status: month <= formatDate(new Date()).slice(0, 7) ? 'ongoing' : 'upcoming',
          description,
          participants: []
        };

        const updatedPlans = state.readingPlans.map(p => {
          if (p.status === 'ongoing' && newPlan.status === 'ongoing') {
            return { ...p, status: 'completed' as const };
          }
          return p;
        });

        set({ readingPlans: [newPlan, ...updatedPlans] });
        console.log('[Store] 发布共读计划', { planId: newPlan.id, book: book.title, month });
        return newPlan;
      },

      joinReadingPlan: (planId: string) => {
        const state = get();
        const plan = state.getPlanById(planId);
        const currentUser = state.getCurrentUser();
        if (!plan || !currentUser) return undefined;

        if (plan.participants.find(p => p.memberId === currentUser.id)) {
          return plan.participants.find(p => p.memberId === currentUser.id);
        }

        const newParticipant: ReadingParticipant = {
          id: genId('rp'),
          planId,
          memberId: currentUser.id,
          member: currentUser,
          joinedAt: formatDate(new Date()),
          currentChapter: 0,
          lastReadAt: '',
          status: 'reading'
        };

        const updatedPlans = state.readingPlans.map(p => {
          if (p.id === planId) {
            return { ...p, participants: [...p.participants, newParticipant] };
          }
          return p;
        });

        set({ readingPlans: updatedPlans });
        console.log('[Store] 报名参加共读', { planId, member: currentUser.name });
        return newParticipant;
      },

      updateReadingProgress: ({ planId, currentChapter }) => {
        const state = get();
        const plan = state.getPlanById(planId);
        const currentUser = state.getCurrentUser();
        if (!plan || !currentUser) return undefined;

        const isCompleted = currentChapter >= plan.book.totalChapters;

        const updatedPlans = state.readingPlans.map(p => {
          if (p.id === planId) {
            const updatedParticipants = p.participants.map(part => {
              if (part.memberId === currentUser.id) {
                return {
                  ...part,
                  currentChapter,
                  lastReadAt: formatDate(new Date()),
                  status: (isCompleted ? 'completed' : 'reading') as 'reading' | 'completed' | 'paused'
                };
              }
              return part;
            });
            return { ...p, participants: updatedParticipants };
          }
          return p;
        });

        set({ readingPlans: updatedPlans });
        const updated = updatedPlans
          .find(p => p.id === planId)
          ?.participants.find(part => part.memberId === currentUser.id);
        console.log('[Store] 更新阅读进度', { planId, chapter: currentChapter, completed: isCompleted });
        return updated;
      },

      addMemberBook: ({ bookId, bookData, condition, isAvailable, note }) => {
        const state = get();
        const currentUser = state.getCurrentUser();
        if (!currentUser) {
          throw new Error('User not found');
        }

        let targetBook: Book | undefined;
        if (bookId) {
          targetBook = state.getBookById(bookId);
        } else if (bookData && bookData.title && bookData.author) {
          const newBook: Book = {
            id: genId('b'),
            title: bookData.title,
            author: bookData.author,
            cover: `https://picsum.photos/seed/${encodeURIComponent(bookData.title)}/300/400`,
            description: bookData.description || '',
            isbn: bookData.isbn,
            totalChapters: bookData.totalChapters || 0,
            publishDate: bookData.publishDate || formatDate(new Date()),
            category: bookData.category || '未分类',
            rating: 0,
            ratingCount: 0
          };
          set({ books: [newBook, ...state.books] });
          targetBook = newBook;
        }

        if (!targetBook) {
          throw new Error('Book not found');
        }

        const newMemberBook: MemberBook = {
          id: genId('mb'),
          memberId: currentUser.id,
          bookId: targetBook.id,
          book: targetBook,
          member: currentUser,
          isAvailable,
          addedDate: formatDate(new Date()),
          condition,
          note
        };

        const updatedMembers = state.members.map(m => {
          if (m.id === currentUser.id) {
            return { ...m, booksCount: m.booksCount + 1 };
          }
          return m;
        });

        set({
          memberBooks: [newMemberBook, ...state.memberBooks],
          members: updatedMembers
        });
        console.log('[Store] 添加个人藏书', { book: targetBook.title, available: isAvailable });
        return newMemberBook;
      },

      updateMemberBookAvailability: (memberBookId: string, isAvailable: boolean) => {
        const state = get();
        const updated = state.memberBooks.map(mb => {
          if (mb.id === memberBookId) {
            return { ...mb, isAvailable };
          }
          return mb;
        });
        set({ memberBooks: updated });
        console.log('[Store] 更新藏书可借状态', { memberBookId, isAvailable });
      },

      getMemberBooksByMemberId: (memberId: string) =>
        get().memberBooks.filter(mb => mb.memberId === memberId),
      getAvailableMemberBooks: () => get().memberBooks.filter(mb => mb.isAvailable),

      addExcerpt: ({ planId, chapter, chapterTitle, content, type, note }) => {
        const state = get();
        const plan = state.getPlanById(planId);
        const currentUser = state.getCurrentUser();
        if (!plan || !currentUser) {
          throw new Error('Plan or user not found');
        }

        const newExcerpt: Excerpt = {
          id: genId('e'),
          planId,
          bookId: plan.bookId,
          memberId: currentUser.id,
          member: currentUser,
          chapter,
          chapterTitle,
          content,
          note,
          type,
          createdAt: formatDateTime(new Date()),
          likes: 0,
          comments: 0
        };

        set({ excerpts: [newExcerpt, ...state.excerpts] });
        console.log('[Store] 提交摘录', { planId, type, chapter });
        return newExcerpt;
      },

      getExcerptsByPlanId: (planId: string) =>
        get().excerpts.filter(e => e.planId === planId),
      getExcerptsByMemberId: (memberId: string) =>
        get().excerpts.filter(e => e.memberId === memberId),

      rateBook: (bookId: string, rating: number) => {
        const state = get();
        const currentUser = state.getCurrentUser();
        if (!currentUser) return;

        const existingIdx = state.ratings.findIndex(
          r => r.bookId === bookId && r.memberId === currentUser.id
        );

        let newRatings: BookRating[];
        if (existingIdx >= 0) {
          newRatings = [...state.ratings];
          newRatings[existingIdx] = { bookId, memberId: currentUser.id, rating };
        } else {
          newRatings = [...state.ratings, { bookId, memberId: currentUser.id, rating }];
        }

        const avgRating = state.getAverageRating(bookId);
        const count = newRatings.filter(r => r.bookId === bookId).length;

        const updatedBooks = state.books.map(b => {
          if (b.id === bookId) {
            return {
              ...b,
              rating: Math.round((avgRating + rating) / 2 * 10) / 10 || rating,
              ratingCount: count
            };
          }
          return b;
        });

        set({ ratings: newRatings, books: updatedBooks });
        console.log('[Store] 评分', { bookId, rating });
      },

      getMyRating: (bookId: string) => {
        const state = get();
        return (
          state.ratings.find(
            r => r.bookId === bookId && r.memberId === state.currentUserId
          )?.rating || 0
        );
      },

      getAverageRating: (bookId: string) => {
        const state = get();
        const bookRatings = state.ratings.filter(r => r.bookId === bookId);
        if (bookRatings.length === 0) return state.getBookById(bookId)?.rating || 0;
        const sum = bookRatings.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / bookRatings.length) * 10) / 10;
      },

      applyBorrow: ({ memberBookId, expectedReturnDate, note }) => {
        const state = get();
        const memberBook = state.getMemberBookById(memberBookId);
        const currentUser = state.getCurrentUser();
        if (!memberBook || !currentUser) {
          throw new Error('Book or user not found');
        }

        const newRecord: BorrowRecord = {
          id: genId('br'),
          memberBookId,
          memberBook,
          borrowerId: currentUser.id,
          borrower: currentUser,
          ownerId: memberBook.memberId,
          owner: memberBook.member,
          status: 'pending',
          applyDate: formatDate(new Date()),
          expectedReturnDate,
          note
        };

        set({ borrowRecords: [newRecord, ...state.borrowRecords] });
        console.log('[Store] 提交借阅申请', { book: memberBook.book.title, expectedReturnDate });
        return newRecord;
      },

      approveBorrow: (recordId: string, actualBorrowDate?: string) => {
        const state = get();
        const updated = state.borrowRecords.map(br => {
          if (br.id === recordId) {
            return {
              ...br,
              status: 'approved' as const,
              actualBorrowDate: actualBorrowDate || br.actualBorrowDate
            };
          }
          return br;
        });
        set({ borrowRecords: updated });
        console.log('[Store] 同意借阅', { recordId });
      },

      rejectBorrow: (recordId: string) => {
        const state = get();
        const updated = state.borrowRecords.map(br => {
          if (br.id === recordId) {
            return { ...br, status: 'rejected' as const };
          }
          return br;
        });
        set({ borrowRecords: updated });
        console.log('[Store] 拒绝借阅', { recordId });
      },

      confirmPickup: (recordId: string, actualBorrowDate?: string) => {
        const state = get();
        const updated = state.borrowRecords.map(br => {
          if (br.id === recordId) {
            return {
              ...br,
              status: 'borrowed' as const,
              actualBorrowDate: actualBorrowDate || formatDate(new Date())
            };
          }
          return br;
        });
        const record = updated.find(br => br.id === recordId);
        let updatedMemberBooks = state.memberBooks;
        if (record) {
          updatedMemberBooks = state.memberBooks.map(mb => {
            if (mb.id === record.memberBookId) {
              return { ...mb, isAvailable: false };
            }
            return mb;
          });
        }
        set({ borrowRecords: updated, memberBooks: updatedMemberBooks });
        console.log('[Store] 确认取书', { recordId });
      },

      confirmReturn: (recordId: string, actualReturnDate?: string) => {
        const state = get();
        const updated = state.borrowRecords.map(br => {
          if (br.id === recordId) {
            return {
              ...br,
              status: 'returned' as const,
              actualReturnDate: actualReturnDate || formatDate(new Date())
            };
          }
          return br;
        });
        const record = updated.find(br => br.id === recordId);
        let updatedMemberBooks = state.memberBooks;
        if (record) {
          updatedMemberBooks = state.memberBooks.map(mb => {
            if (mb.id === record.memberBookId) {
              return { ...mb, isAvailable: true };
            }
            return mb;
          });
        }
        set({ borrowRecords: updated, memberBooks: updatedMemberBooks });
        console.log('[Store] 确认归还', { recordId });
      },

      getBorrowRecordsByBorrowerId: (borrowerId: string) =>
        get().borrowRecords.filter(br => br.borrowerId === borrowerId),
      getBorrowRecordsByOwnerId: (ownerId: string) =>
        get().borrowRecords.filter(br => br.ownerId === ownerId),
      getPendingBorrows: (userId: string) =>
        get().borrowRecords.filter(
          br =>
            br.status === 'pending' &&
            (br.ownerId === userId || br.borrowerId === userId)
        )
    }),
    {
      name: 'bookclub-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return {
            getItem: (name: string) => {
              const val = window.localStorage.getItem(name);
              return val ? JSON.parse(val) : null;
            },
            setItem: (name: string, value: any) => {
              window.localStorage.setItem(name, JSON.stringify(value));
            },
            removeItem: (name: string) => {
              window.localStorage.removeItem(name);
            }
          };
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        };
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const hydrated = hydrateRelations(state as any);
          Object.assign(state, hydrated);
        }
      },
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        members: state.members,
        books: state.books,
        memberBooks: state.memberBooks.map(({ book, member, ...rest }) => rest),
        readingPlans: state.readingPlans.map(({ book, admin, participants, ...rest }) => ({
          ...rest,
          participants: participants.map(({ member, ...pRest }) => pRest)
        })),
        excerpts: state.excerpts.map(({ member, ...rest }) => rest),
        borrowRecords: state.borrowRecords.map(({ memberBook, borrower, owner, ...rest }) => rest),
        activityReviews: state.activityReviews.map(({ book, completedMembers, ...rest }) => ({
          ...rest,
          completedMembers: completedMembers.map(m => m.id)
        })),
        ratings: state.ratings
      })
    }
  )
);
