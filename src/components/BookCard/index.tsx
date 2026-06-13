import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Book, MemberBook } from '@/types';
import { getConditionText } from '@/utils';

interface BookCardProps {
  book: Book;
  memberBook?: MemberBook;
  showOwner?: boolean;
  showAvailability?: boolean;
  showProgress?: boolean;
  progress?: { current: number; total: number };
  onClick?: () => void;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  memberBook,
  showOwner = false,
  showAvailability = false,
  showProgress = false,
  progress,
  onClick,
  className
}) => {
  const percent = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <View
      className={classNames(styles.bookCard, className)}
      onClick={onClick}
    >
      <View className={styles.bookCover}>
        <Image
          src={book.cover}
          mode="aspectFill"
          className={styles.coverImage}
        />
        {showAvailability && memberBook && (
          <View
            className={classNames(
              styles.availabilityTag,
              memberBook.isAvailable ? styles.available : styles.unavailable
            )}
          >
            {memberBook.isAvailable ? '可借' : '借出中'}
          </View>
        )}
      </View>
      <View className={styles.bookInfo}>
        <Text className={styles.bookTitle}>{book.title}</Text>
        <Text className={styles.bookAuthor}>{book.author}</Text>
        <View className={styles.bookMeta}>
          <View className={styles.rating}>
            <Text className={styles.ratingStar}>★</Text>
            <Text className={styles.ratingValue}>{book.rating}</Text>
            <Text className={styles.ratingCount}>({book.ratingCount})</Text>
          </View>
          <Text className={styles.bookCategory}>{book.category}</Text>
        </View>
        {showProgress && progress && (
          <View className={styles.progressSection}>
            <View className={styles.progressTrack}>
              <View
                className={styles.progressFill}
                style={{ width: `${percent}%` }}
              />
            </View>
            <Text className={styles.progressText}>
              已读 {progress.current}/{progress.total} 章
            </Text>
          </View>
        )}
        {showOwner && memberBook && (
          <View className={styles.ownerInfo}>
            <Image
              src={memberBook.member.avatar}
              className={styles.ownerAvatar}
            />
            <Text className={styles.ownerName}>{memberBook.member.name}</Text>
            <Text className={styles.bookCondition}>
              · {getConditionText(memberBook.condition)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BookCard;
