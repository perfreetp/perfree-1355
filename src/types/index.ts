export interface Member {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  participateCount: number;
  booksCount: number;
  isAdmin: boolean;
  bio: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  isbn?: string;
  totalChapters: number;
  publishDate: string;
  category: string;
  rating: number;
  ratingCount: number;
}

export interface MemberBook {
  id: string;
  memberId: string;
  bookId: string;
  book: Book;
  member: Member;
  isAvailable: boolean;
  addedDate: string;
  condition: 'new' | 'good' | 'fair' | 'poor';
  note?: string;
}

export interface ReadingPlan {
  id: string;
  bookId: string;
  book: Book;
  month: string;
  adminId: string;
  admin: Member;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  participants: ReadingParticipant[];
}

export interface ReadingParticipant {
  id: string;
  planId: string;
  memberId: string;
  member: Member;
  joinedAt: string;
  currentChapter: number;
  lastReadAt: string;
  status: 'reading' | 'completed' | 'paused';
}

export interface Excerpt {
  id: string;
  planId: string;
  bookId: string;
  memberId: string;
  member: Member;
  chapter: number;
  chapterTitle?: string;
  content: string;
  note?: string;
  type: 'quote' | 'question' | 'thought';
  createdAt: string;
  likes: number;
  comments: number;
}

export interface BorrowRecord {
  id: string;
  memberBookId: string;
  memberBook: MemberBook;
  borrowerId: string;
  borrower: Member;
  ownerId: string;
  owner: Member;
  status: 'pending' | 'approved' | 'borrowed' | 'returned' | 'rejected';
  applyDate: string;
  expectedReturnDate: string;
  actualBorrowDate?: string;
  actualReturnDate?: string;
  note?: string;
}

export interface ActivityReview {
  id: string;
  title: string;
  month: string;
  bookId: string;
  book: Book;
  completedMembers: Member[];
  totalParticipants: number;
  averageRating: number;
  summary: string;
  keyNotes: string[];
  createdAt: string;
}

export interface MemberStats {
  memberId: string;
  member: Member;
  totalParticipations: number;
  completedBooks: number;
  totalExcerpts: number;
  totalBorrows: number;
  totalLents: number;
}
