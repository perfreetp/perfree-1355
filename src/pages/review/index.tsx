import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import Empty from '@/components/Empty';
import { getMonthText } from '@/utils';
import type { ActivityReview, MemberStats, Member } from '@/types';

type TabType = 'activities' | 'ranking';

const ReviewPage: React.FC = () => {
  const store = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('activities');
  const [activities, setActivities] = useState<ActivityReview[]>([]);
  const [memberStats, setMemberStats] = useState<MemberStats[]>([]);

  useDidShow(() => {
    loadData();
  });

  const computeMemberStats = (): MemberStats[] => {
    const { members, activityReviews, excerpts, borrowRecords, readingPlans } = store;

    return members.map((member: Member) => {
      const completedBooks = activityReviews.filter(ar =>
        ar.completedMembers.some(cm => cm.id === member.id)
      ).length;

      let totalParticipations = completedBooks;
      readingPlans.forEach(plan => {
        if (plan.participants.some(p => p.memberId === member.id)) {
          totalParticipations++;
        }
      });

      const totalExcerpts = excerpts.filter(e => e.memberId === member.id).length;
      const totalBorrows = borrowRecords.filter(br => br.borrowerId === member.id).length;
      const totalLents = borrowRecords.filter(br => br.ownerId === member.id).length;

      return {
        memberId: member.id,
        member,
        totalParticipations,
        completedBooks,
        totalExcerpts,
        totalBorrows,
        totalLents
      };
    }).sort((a, b) => b.totalParticipations - a.totalParticipations);
  };

  const loadData = () => {
    if (activeTab === 'activities') {
      const reviews = store.activityReviews;
      setActivities(reviews);
      console.log('[Review] 加载活动回顾完成', { count: reviews.length });
    } else {
      const stats = computeMemberStats();
      setMemberStats(stats);
      console.log('[Review] 加载成员排行完成', { count: stats.length });
    }
  };

  const handleActivityClick = (activity: ActivityReview) => {
    console.log('[Review] 查看活动详情', { activityId: activity.id, title: activity.title });
  };

  const getRankClass = (index: number) => {
    if (index === 0) return styles.rank1;
    if (index === 1) return styles.rank2;
    if (index === 2) return styles.rank3;
    return styles.rankOther;
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'activities', label: '往期活动' },
    { key: 'ranking', label: '成员排行' }
  ];

  const totalActivities = activities.length;
  const totalBooks = activities.length;
  const totalParticipants = activities.reduce((sum, a) => sum + a.totalParticipants, 0);
  const totalMembers = store.members.length;

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className={styles.statsOverview}>
        <Text className={styles.statsTitle}>读书会数据总览</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalActivities}</Text>
            <Text className={styles.statLabel}>期活动</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalBooks}</Text>
            <Text className={styles.statLabel}>本共读</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalMembers}</Text>
            <Text className={styles.statLabel}>位成员</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalParticipants}</Text>
            <Text className={styles.statLabel}>人次参与</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabSection}>
        {tabs.map(tab => (
          <Button
            key={tab.key}
            className={classNames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => {
              setActiveTab(tab.key);
              loadData();
            }}
          >
            {tab.label}
          </Button>
        ))}
      </View>

      {activeTab === 'activities' && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>往期活动回顾</Text>
            <Text className={styles.sectionCount}>共{activities.length}期</Text>
          </View>

          {activities.length === 0 ? (
            <Empty
              icon="📚"
              title="暂无活动回顾"
              description="完成第一期共读后来这里查看沉淀吧"
            />
          ) : (
            <View className={styles.activityList}>
              {activities.map(activity => (
                <View
                  key={activity.id}
                  className={styles.activityCard}
                  onClick={() => handleActivityClick(activity)}
                >
                  <View className={styles.activityHeader}>
                    <Image
                      src={activity.book.cover}
                      mode="aspectFill"
                      className={styles.activityBookCover}
                    />
                    <View className={styles.activityInfo}>
                      <Text className={styles.activityMonth}>
                        {getMonthText(activity.month)}
                      </Text>
                      <Text className={styles.activityBookTitle}>
                        {activity.title}
                      </Text>
                      <Text className={styles.activityBookAuthor}>
                        {activity.book.author}
                      </Text>
                      <View className={styles.activityMeta}>
                        <Text className={styles.activityMetaItem}>
                          ★ {activity.averageRating}
                        </Text>
                        <Text className={styles.activityMetaItem}>
                          ✓ {activity.completedMembers.length}/{activity.totalParticipants}完成
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text className={styles.activitySummary}>
                    {activity.summary}
                  </Text>

                  {activity.keyNotes.length > 0 && (
                    <View className={styles.keyNotes}>
                      {activity.keyNotes.slice(0, 3).map((note, index) => (
                        <View key={index} className={styles.keyNoteItem}>
                          <Text className={styles.keyNoteIcon}>•</Text>
                          <Text className={styles.keyNoteText}>{note}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View className={styles.activityMembers}>
                    <Text className={styles.activityMembersLabel}>完成名单：</Text>
                    <View className={styles.activityAvatars}>
                      {activity.completedMembers.slice(0, 5).map(member => (
                        <Image
                          key={member.id}
                          src={member.avatar}
                          className={styles.activityAvatar}
                        />
                      ))}
                      {activity.completedMembers.length > 5 && (
                        <View className={styles.moreMembers}>
                          +{activity.completedMembers.length - 5}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {activeTab === 'ranking' && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>成员参与排行</Text>
            <Text className={styles.sectionCount}>共{memberStats.length}人</Text>
          </View>

          {memberStats.length === 0 ? (
            <Empty
              icon="🏆"
              title="暂无排行数据"
              description="多多参与共读活动就能上榜哦"
            />
          ) : (
            <View className={styles.rankingSection}>
              <Text className={styles.rankingTitle}>参与次数排行</Text>
              <View className={styles.rankingList}>
                {memberStats.map((stat, index) => (
                  <View key={stat.memberId} className={styles.rankingItem}>
                    <View className={classNames(styles.rankingNumber, getRankClass(index))}>
                      {index + 1}
                    </View>
                    <Image
                      src={stat.member.avatar}
                      className={styles.rankingAvatar}
                    />
                    <View className={styles.rankingInfo}>
                      <Text className={styles.rankingName}>
                        {stat.member.name}
                        {stat.member.isAdmin && ' (管理员)'}
                      </Text>
                      <Text className={styles.rankingDesc}>
                        完成{stat.completedBooks}本书 · {stat.totalExcerpts}条摘录
                      </Text>
                    </View>
                    <Text className={styles.rankingScore}>
                      {stat.totalParticipations}次
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default ReviewPage;
