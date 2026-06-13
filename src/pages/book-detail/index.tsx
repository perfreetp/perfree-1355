import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import type { MemberBook, Book } from '@/types';

const BookDetailPage: React.FC = () => {
  const router = useRouter();
  const store = useAppStore();
  const currentUser = store.getCurrentUser();
  const [memberBook, setMemberBook] = useState<MemberBook | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [myRating, setMyRating] = useState(0);
  const [availableCopies, setAvailableCopies] = useState<MemberBook[]>([]);
  const [activeBorrows, setActiveBorrows] = useState<any[]>([]);

  useDidShow(() => {
    const id = router.params.id;
    if (id) {
      loadBookDetail(id);
    }
  });

  const loadBookDetail = (id: string) => {
    const mb = store.getMemberBookById(id);
    if (mb) {
      setMemberBook(mb);
      setBook(mb.book);
      setMyRating(store.getMyRating(mb.bookId));

      const copies = store.getMemberBooksByBookId(mb.bookId).filter(
        item => item.isAvailable
      );
      setAvailableCopies(copies);

      const borrows = store.getActiveBorrowsByBookId(mb.bookId);
      setActiveBorrows(borrows);

      console.log('[BookDetail] 加载书籍详情', { bookId: mb.bookId, title: mb.book.title, available: copies.length, borrowed: borrows.length });
    }
  };

  const handleBorrow = () => {
    if (!memberBook || !currentUser) return;
    if (memberBook.memberId === currentUser.id) {
      Taro.showToast({ title: '这是你自己的书', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/borrow-apply/index?memberBookId=${memberBook.id}`
    });
  };

  const handleViewOwner = () => {
    if (!memberBook) return;
    Taro.navigateTo({
      url: `/pages/member-detail/index?id=${memberBook.memberId}`
    });
  };

  const handleRate = (rating: number) => {
    if (!book) return;
    store.rateBook(book.id, rating);
    setMyRating(rating);
    Taro.showToast({ title: `感谢您的${rating}星评价`, icon: 'success' });
    console.log('[BookDetail] 用户评分', { bookId: book?.id, rating });
  };

  const handleViewOtherCopy = (copy: MemberBook) => {
    Taro.redirectTo({
      url: `/pages/book-detail/index?id=${copy.id}`
    });
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <View className={interactive ? styles.ratingStarsInteractive : styles.ratingStars}>
        {[1, 2, 3, 4, 5].map(star => {
          return (
            <Text
              key={star}
              className={interactive ? styles.starInteractive : styles.star}
              style={{ color: star <= rating ? '#FFD700' : (interactive ? '#E0E0E0' : 'rgba(255,255,255,0.3)') }}
              onClick={interactive ? () => handleRate(star) : undefined}
            >
              ★
            </Text>
          );
        })}
      </View>
    );
  };

  const getConditionText = (condition: string) => {
    const map: Record<string, string> = {
      new: '全新',
      good: '良好',
      fair: '一般',
      poor: '破旧'
    };
    return map[condition] || condition;
  };

  if (!book || !memberBook) {
    return (
      <View className={styles.pageContainer}>
        <View style={{ padding: 48, textAlign: 'center' }}>
          <Text style={{ fontSize: 32, color: '#999' }}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className={styles.heroSection}>
        <View className={styles.bookHeader}>
          <View className={styles.coverWrapper}>
            <Image src={book.cover} className={styles.coverImage} mode="aspectFill" />
          </View>
          <View className={styles.bookInfo}>
            <Text className={styles.bookTitle}>{book.title}</Text>
            <Text className={styles.bookAuthor}>{book.author}</Text>
            <View className={styles.ratingRow}>
              <Text className={styles.ratingScore}>{book.rating}</Text>
              {renderStars(Math.round(book.rating))}
              <Text className={styles.ratingCount}>({book.ratingCount}人评价)</Text>
            </View>
            <View className={styles.bookMeta}>
              <Text className={styles.metaTag}>{book.category}</Text>
              <Text className={styles.metaTag}>{book.totalChapters}章</Text>
              <Text className={styles.metaTag}>{book.publishDate.substring(0, 4)}年出版</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📖</Text>
            书籍简介
          </Text>
          <Text className={styles.description}>{book.description}</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📊</Text>
            书籍信息
          </Text>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue}>{availableCopies.length + activeBorrows.length}</Text>
              <Text className={styles.infoLabel}>馆藏总数</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue} style={{ color: '#4CAF50' }}>{availableCopies.length}</Text>
              <Text className={styles.infoLabel}>可借</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue} style={{ color: '#FF9800' }}>{activeBorrows.length}</Text>
              <Text className={styles.infoLabel}>在借</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue}>{book.rating}</Text>
              <Text className={styles.infoLabel}>评分</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>
            当前持有者
          </Text>
          <View className={styles.ownerSection} onClick={handleViewOwner}>
            <Image src={memberBook.member.avatar} className={styles.ownerAvatar} />
            <View className={styles.ownerInfo}>
              <Text className={styles.ownerName}>
                {memberBook.member.name}
                {memberBook.member.isAdmin && ' (管理员)'}
              </Text>
              <Text className={styles.ownerMeta}>
                加入于 {memberBook.member.joinDate.substring(0, 7)} · {memberBook.member.booksCount}本藏书
              </Text>
              <Text
                className={`${styles.availabilityTag} ${memberBook.isAvailable ? styles.available : styles.notAvailable}`}
              >
                {memberBook.isAvailable ? '可借阅' : '暂不可借'}
              </Text>
            </View>
          </View>
          <View className={styles.bookCondition}>
            <Text className={styles.conditionLabel}>书籍品相：</Text>
            <Text className={styles.conditionValue}>{getConditionText(memberBook.condition)}</Text>
            {memberBook.note && (
              <Text className={styles.conditionNote}>备注：{memberBook.note}</Text>
            )}
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⭐</Text>
            我的评分
          </Text>
          {myRating > 0 && (
            <Text style={{ textAlign: 'center', marginBottom: 16, fontSize: 24, color: '#8B5A2B' }}>
              您已给出 {myRating} 星评价
            </Text>
          )}
          {renderStars(myRating, true)}
        </View>

        {availableCopies.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📚</Text>
              可借副本 ({availableCopies.length})
            </Text>
            <View className={styles.otherCopies}>
              {availableCopies.map(copy => {
                return (
                  <View
                    key={copy.id}
                    className={styles.copyItem}
                    onClick={() => handleViewOtherCopy(copy)}
                  >
                    <Image src={copy.member.avatar} className={styles.copyAvatar} />
                    <View className={styles.copyInfo}>
                      <Text className={styles.copyName}>{copy.member.name}</Text>
                      <Text className={styles.copyMeta}>
                        品相：{getConditionText(copy.condition)}
                      </Text>
                    </View>
                    <Text style={{ color: '#4CAF50', fontSize: 24 }}>可借 →</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeBorrows.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📖</Text>
              在借中 ({activeBorrows.length})
            </Text>
            <View className={styles.otherCopies}>
              {activeBorrows.map(record => {
                return (
                  <View
                    key={record.id}
                    className={styles.copyItem}
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/pages/member-detail/index?id=${record.borrowerId}`
                      });
                    }}
                  >
                    <Image src={record.borrower.avatar} className={styles.copyAvatar} />
                    <View className={styles.copyInfo}>
                      <Text className={styles.copyName}>{record.borrower.name}</Text>
                      <Text className={styles.copyMeta}>
                        藏书人：{record.owner.name}
                      </Text>
                    </View>
                    <Text style={{ color: '#FF9800', fontSize: 24 }}>在借</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>

      <View className={styles.bottomActions}>
        <Button
          className={`${styles.actionButton} ${styles.secondaryButton}`}
          onClick={handleViewOwner}
        >
          查看主人
        </Button>
        <Button
          className={`${styles.actionButton} ${memberBook.isAvailable && memberBook.memberId !== currentUser?.id ? styles.primaryButton : styles.disabledButton}`}
          disabled={!memberBook.isAvailable || memberBook.memberId === currentUser?.id}
          onClick={handleBorrow}
        >
          {memberBook.memberId === currentUser?.id ? '这是我的书' : (memberBook.isAvailable ? '申请借阅' : '暂不可借')}
        </Button>
      </View>
    </ScrollView>
  );
};

export default BookDetailPage;
