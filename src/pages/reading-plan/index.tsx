import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  Input
} from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { getMonthText, getProgressPercent, formatDate } from '@/utils';
import type { ReadingPlan, ReadingParticipant } from '@/types';

const ReadingPlanPage: React.FC = () => {
  const store = useAppStore();
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | undefined>();
  const [upcomingPlans, setUpcomingPlans] = useState<ReadingPlan[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState('');
  const [myProgress, setMyProgress] = useState<ReadingParticipant | undefined>();
  const [completedCount, setCompletedCount] = useState(0);

  const currentUser = store.getCurrentUser();

  useDidShow(() => {
    loadData();
  });

  useEffect(() => {
    loadData();
  }, [store.readingPlans]);

  const loadData = () => {
    const plan = store.getCurrentPlan();
    const upcoming = store.getUpcomingPlans();
    setCurrentPlan(plan);
    setUpcomingPlans(upcoming);

    if (plan && currentUser) {
      const participant = plan.participants.find(p => p.memberId === currentUser.id);
      setIsJoined(!!participant);
      setMyProgress(participant);
      if (participant) {
        setCurrentChapter(String(participant.currentChapter));
      }
      const completed = plan.participants.filter(p => p.currentChapter >= plan.book.totalChapters).length;
      setCompletedCount(completed);
    }
    console.log('[ReadingPlan] 加载数据完成', { plan, upcoming, isJoined: !!plan?.participants.find(p => p.memberId === currentUser?.id) });
  };

  const handleJoin = () => {
    if (!currentPlan || !currentUser) return;

    const newParticipant = store.joinReadingPlan(currentPlan.id);

    if (newParticipant) {
      const updatedPlan = store.getCurrentPlan();
      setCurrentPlan(updatedPlan);
      setIsJoined(true);
      setMyProgress(newParticipant);
      setCurrentChapter('0');

      Taro.showToast({
        title: '报名成功',
        icon: 'success'
      });
      console.log('[ReadingPlan] 报名成功', { planId: currentPlan.id, member: currentUser.name });
    }
  };

  const handleUpdateProgress = () => {
    if (!currentPlan || !myProgress || !currentUser) return;

    const chapter = parseInt(currentChapter) || 0;
    if (chapter < 0 || chapter > currentPlan.book.totalChapters) {
      Taro.showToast({
        title: `请输入1-${currentPlan.book.totalChapters}之间的章节数`,
        icon: 'none'
      });
      return;
    }

    const updatedParticipant = store.updateReadingProgress({
      planId: currentPlan.id,
      currentChapter: chapter
    });

    if (updatedParticipant) {
      const updatedPlan = store.getCurrentPlan();
      setCurrentPlan(updatedPlan);
      setMyProgress(updatedParticipant);
      setShowProgressModal(false);

      Taro.showToast({
        title: '进度已更新',
        icon: 'success'
      });
      console.log('[ReadingPlan] 阅读进度更新', { chapter, book: currentPlan.book.title });
    }
  };

  const handlePublish = () => {
    Taro.navigateTo({
      url: '/pages/publish-book/index'
    });
  };

  if (!currentPlan) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.heroSection}>
          <Text className={styles.monthLabel}>{getMonthText('2026-06')}</Text>
          <Text className={styles.heroTitle}>本月共读</Text>
        </View>
        <View className={styles.contentSection}>
          <View className={styles.emptySection}>
            <Text className={styles.emptyTitle}>暂无本月共读计划</Text>
            <Text className={styles.emptyDesc}>管理员正在准备中...</Text>
          </View>
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
        <Text className={styles.monthLabel}>{getMonthText(currentPlan.month)}</Text>
        <Text className={styles.heroTitle}>本月共读</Text>
        <View className={styles.bookHero}>
          <View className={styles.bookCoverWrapper}>
            <Image
              src={currentPlan.book.cover}
              mode="aspectFill"
              className={styles.heroBookImage}
            />
          </View>
          <View className={styles.heroBookInfo}>
            <Text className={styles.heroBookTitle}>{currentPlan.book.title}</Text>
            <Text className={styles.heroBookAuthor}>{currentPlan.book.author}</Text>
            <View className={styles.heroBookMeta}>
              <View className={styles.heroRating}>
                <Text className={styles.heroRatingStar}>★</Text>
                <Text className={styles.heroRatingValue}>{currentPlan.book.rating}</Text>
              </View>
            </View>
            <Text className={styles.heroBookDesc}>{currentPlan.book.description}</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.actionCard}>
          <View className={styles.statusRow}>
            <View className={classNames(styles.statusBadge, styles.statusOngoing)}>
              进行中
            </View>
            <Text className={styles.participantCount}>
              {currentPlan.participants.length}人参与 · {completedCount}人已完成
            </Text>
          </View>

          {!isJoined ? (
            <Button className={styles.joinButton} onClick={handleJoin}>
              立即报名参与
            </Button>
          ) : (
            <Button className={styles.joinedButton} disabled>
              ✓ 已报名参与
            </Button>
          )}
        </View>

        {isJoined && myProgress && (
          <View className={styles.progressSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.progressTitle}>我的阅读进度</Text>
              <Button className={styles.updateProgressBtn} onClick={() => setShowProgressModal(true)}>
                更新进度
              </Button>
            </View>
            <View>
              <View className={styles.progressMiniTrack}>
                <View
                  className={styles.progressMiniFill}
                  style={{
                    width: `${getProgressPercent(myProgress.currentChapter, currentPlan.book.totalChapters)}%`
                  }}
                />
              </View>
              <Text className={styles.progressMiniText}>
                第{myProgress.currentChapter}/{currentPlan.book.totalChapters}章 · {getProgressPercent(myProgress.currentChapter, currentPlan.book.totalChapters)}%
              </Text>
            </View>
          </View>
        )}

        <View className={styles.participantsSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.progressTitle}>参与成员</Text>
            <Text className={styles.participantCount}>
              {currentPlan.participants.length}人
            </Text>
          </View>
          <View className={styles.participantsList}>
            {currentPlan.participants.map(participant => {
              const isCompleted = participant.currentChapter >= currentPlan.book.totalChapters;
              return (
                <View key={participant.id} className={styles.participantItem}>
                  <Image
                    src={participant.member.avatar}
                    className={styles.participantAvatar}
                  />
                  <View className={styles.participantInfo}>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                      <Text className={styles.participantName}>
                        {participant.member.name}
                        {participant.member.isAdmin && ' (管理员)'}
                      </Text>
                      {isCompleted && <Text className={styles.completedBadge}>已完成</Text>}
                    </View>
                    <Text style={{ fontSize: '22rpx', color: '#8D6E63' }}>
                      {participant.lastReadAt ? `最近阅读: ${formatDate(participant.lastReadAt)}` : '即将开始'}
                    </Text>
                  </View>
                  <View className={styles.participantProgress}>
                    <View className={styles.progressMiniTrack}>
                      <View
                        className={classNames(styles.progressMiniFill, isCompleted && styles.progressMiniFillCompleted)}
                        style={{
                          width: `${getProgressPercent(participant.currentChapter, currentPlan.book.totalChapters)}%`
                        }}
                      />
                    </View>
                    <Text className={styles.progressMiniText}>
                      {isCompleted ? '已完成' : `${getProgressPercent(participant.currentChapter, currentPlan.book.totalChapters)}%`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {upcomingPlans.length > 0 && (
          <View className={styles.upcomingSection}>
            <View className={styles.upcomingHeader}>
              <Text className={styles.upcomingIcon}>📅</Text>
              <Text className={styles.upcomingTitle}>下月预告</Text>
            </View>
            {upcomingPlans.map(plan => (
              <View key={plan.id}>
                <View className={styles.upcomingBook}>
                  <Image
                    src={plan.book.cover}
                    mode="aspectFill"
                    className={styles.upcomingCover}
                  />
                  <View className={styles.upcomingInfo}>
                    <Text className={styles.upcomingBookTitle}>{plan.book.title}</Text>
                    <Text className={styles.upcomingBookAuthor}>{plan.book.author}</Text>
                  </View>
                  <View style={{ padding: '4rpx 16rpx', background: 'rgba(124, 179, 66, 0.1)', color: '#7CB342', borderRadius: '16rpx', fontSize: '22rpx' }}>
                    {getMonthText(plan.month)}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {currentUser?.isAdmin && (
          <View className={styles.adminSection}>
            <Button className={styles.publishButton} onClick={handlePublish}>
              + 发布下月共读书籍
            </Button>
          </View>
        )}
      </View>

      {showProgressModal && (
        <View className={styles.modalOverlay} onClick={() => setShowProgressModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>更新阅读进度</Text>
            <Input
              className={styles.modalInput}
              type="number"
              placeholder={`请输入当前章节（共${currentPlan.book.totalChapters}章）`}
              value={currentChapter}
              onInput={e => setCurrentChapter(e.detail.value)}
            />
            <View className={styles.modalButtons}>
              <Button className={styles.modalCancelBtn} onClick={() => setShowProgressModal(false)}>
                取消
              </Button>
              <Button className={styles.modalConfirmBtn} onClick={handleUpdateProgress}>
                确认
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ReadingPlanPage;
