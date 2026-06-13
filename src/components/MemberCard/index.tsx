import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';
import type { Member } from '@/types';

interface MemberCardProps {
  member: Member;
  showStats?: boolean;
  onClick?: () => void;
  className?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  showStats = true,
  onClick,
  className
}) => {
  return (
    <View
      className={classNames(styles.memberCard, className)}
      onClick={onClick}
    >
      <View className={styles.memberHeader}>
        <Image src={member.avatar} className={styles.avatar} />
        <View className={styles.memberInfo}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{member.name}</Text>
            {member.isAdmin && (
              <View className={styles.adminTag}>管理员</View>
            )}
          </View>
          <Text className={styles.bio}>{member.bio}</Text>
        </View>
      </View>
      {showStats && (
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{member.participateCount}</Text>
            <Text className={styles.statLabel}>参与次数</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{member.booksCount}</Text>
            <Text className={styles.statLabel}>藏书</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {member.joinDate ? member.joinDate.slice(0, 7) : '-'}
            </Text>
            <Text className={styles.statLabel}>加入时间</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MemberCard;
