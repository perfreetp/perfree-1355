import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Excerpt } from '@/types';
import { getExcerptTypeText, getExcerptTypeColor, formatDateTime } from '@/utils';

interface ExcerptCardProps {
  excerpt: Excerpt;
  showChapter?: boolean;
  onClick?: () => void;
  onLike?: () => void;
  className?: string;
}

const ExcerptCard: React.FC<ExcerptCardProps> = ({
  excerpt,
  showChapter = true,
  onClick,
  onLike,
  className
}) => {
  const typeColor = getExcerptTypeColor(excerpt.type);

  return (
    <View
      className={classNames(styles.excerptCard, className)}
      onClick={onClick}
    >
      <View className={styles.cardHeader}>
        <View className={styles.memberInfo}>
          <Image src={excerpt.member.avatar} className={styles.avatar} />
          <View className={styles.memberText}>
            <Text className={styles.memberName}>{excerpt.member.name}</Text>
            <Text className={styles.createTime}>{formatDateTime(excerpt.createdAt)}</Text>
          </View>
        </View>
        <View
          className={styles.typeTag}
          style={{ backgroundColor: `${typeColor}15`, color: typeColor }}
        >
          {getExcerptTypeText(excerpt.type)}
        </View>
      </View>

      {showChapter && (
        <View className={styles.chapterInfo}>
          <Text className={styles.chapterText}>
            第{excerpt.chapter}章
            {excerpt.chapterTitle ? ` · ${excerpt.chapterTitle}` : ''}
          </Text>
        </View>
      )}

      <View className={styles.content}>
        <Text className={styles.quoteMark}>"</Text>
        <Text className={styles.contentText}>{excerpt.content}</Text>
      </View>

      {excerpt.note && (
        <View className={styles.noteSection}>
          <Text className={styles.noteLabel}>我的感悟：</Text>
          <Text className={styles.noteText}>{excerpt.note}</Text>
        </View>
      )}

      <View className={styles.cardFooter}>
        <View className={styles.actionItem} onClick={(e) => { e.stopPropagation(); onLike?.(); }}>
          <Text className={styles.actionIcon}>♥</Text>
          <Text className={styles.actionCount}>{excerpt.likes}</Text>
        </View>
        <View className={styles.actionItem}>
          <Text className={styles.actionIcon}>💬</Text>
          <Text className={styles.actionCount}>{excerpt.comments}</Text>
        </View>
      </View>
    </View>
  );
};

export default ExcerptCard;
