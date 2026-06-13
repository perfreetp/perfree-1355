import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import ExcerptCard from '@/components/ExcerptCard';
import Empty from '@/components/Empty';
import { getExcerptTypeText } from '@/utils';
import type { ReadingPlan, Excerpt } from '@/types';

type FilterType = 'all' | 'quote' | 'question' | 'thought';

const DiscussionPage: React.FC = () => {
  const store = useAppStore();
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | undefined>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [myRating, setMyRating] = useState(0);

  const currentUser = store.getCurrentUser();

  useDidShow(() => {
    loadData();
  });

  useEffect(() => {
    loadData();
  }, [store.readingPlans, store.excerpts, store.ratings]);

  useEffect(() => {
    if (currentPlan) {
      loadExcerpts();
      if (currentUser) {
        setMyRating(store.getMyRating(currentPlan.bookId));
      }
    }
  }, [currentPlan, filter, selectedChapter]);

  const loadData = () => {
    const plan = store.getCurrentPlan();
    setCurrentPlan(plan);
    if (plan && currentUser) {
      setMyRating(store.getMyRating(plan.bookId));
    }
    console.log('[Discussion] 加载数据完成', { plan });
  };

  const loadExcerpts = () => {
    if (!currentPlan) return;

    let result: Excerpt[] = [];

    const planExcerpts = store.getExcerptsByPlanId(currentPlan.id);

    if (selectedChapter !== null) {
      result = planExcerpts.filter(e => e.chapter === selectedChapter);
    } else {
      result = planExcerpts;
    }

    if (filter !== 'all') {
      result = result.filter(e => e.type === filter);
    }

    setExcerpts(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    console.log('[Discussion] 加载摘录完成', { filter, selectedChapter, count: result.length });
  };

  const handleAddExcerpt = () => {
    Taro.navigateTo({
      url: '/pages/add-excerpt/index'
    });
  };

  const handleLike = (excerptId: string) => {
    setExcerpts(prev =>
      prev.map(e =>
        e.id === excerptId ? { ...e, likes: e.likes + 1 } : e
      )
    );
    console.log('[Discussion] 点赞摘录', { excerptId });
  };

  const handleChapterClick = (chapter: number) => {
    setSelectedChapter(selectedChapter === chapter ? null : chapter);
  };

  const handleRating = (rating: number) => {
    if (!currentPlan) return;
    store.rateBook(currentPlan.bookId, rating);
    setMyRating(rating);
    Taro.showToast({
      title: `已打${rating}星`,
      icon: 'success'
    });
    console.log('[Discussion] 打分完成', { rating, bookId: currentPlan.bookId });
  };

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'quote', label: '书摘' },
    { key: 'question', label: '提问' },
    { key: 'thought', label: '感想' }
  ];

  if (!currentPlan) {
    return (
      <View className={styles.pageContainer}>
        <Empty
          icon="💬"
          title="暂无共读计划"
          description="请先加入共读计划后再查看讨论"
        />
      </View>
    );
  }

  const chapters: number[] = [];
  for (let i = 1; i <= currentPlan.book.totalChapters; i++) {
    chapters.push(i);
  }

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className={styles.currentBookSection}>
        <Text className={styles.currentBookHeader}>本月共读书籍</Text>
        <View className={styles.currentBookInfo}>
          <Image
            src={currentPlan.book.cover}
            mode="aspectFill"
            className={styles.currentBookCover}
          />
          <View className={styles.currentBookText}>
            <Text className={styles.currentBookTitle}>{currentPlan.book.title}</Text>
            <Text className={styles.currentBookAuthor}>{currentPlan.book.author}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{excerpts.length}</Text>
            <Text className={styles.statLabel}>条摘录</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentPlan.participants.length}</Text>
            <Text className={styles.statLabel}>人参与</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentPlan.book.rating}</Text>
            <Text className={styles.statLabel}>平均评分</Text>
          </View>
        </View>
      </View>

      <View className={styles.ratingSection}>
        <View className={styles.ratingHeader}>
          <Text className={styles.ratingTitle}>给这本书打分</Text>
          <View className={styles.myRating}>
            <View className={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map(star => {
                return (
                  <Text
                    key={star}
                    className={classNames(styles.star, star <= myRating && styles.filled)}
                    onClick={() => handleRating(star)}
                  >
                    ★
                  </Text>
                );
              })}
            </View>
            {myRating > 0 && (
              <Text className={styles.ratingValue}>{myRating}.0</Text>
            )}
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        {filterTabs.map(tab => {
          return (
            <Button
              key={tab.key}
              className={classNames(styles.filterTab, filter === tab.key && styles.active)}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </Button>
          );
        })}
      </View>

      <View className={styles.chapterFilter}>
        <Text style={{ fontSize: '28rpx', fontWeight: '500', color: '#2C1810', marginBottom: '16rpx' }}>
          按章节查看
        </Text>
        <ScrollView
          className={styles.chapterList}
          scrollX
          enhanced
          showScrollbar={false}
        >
          <Button
            className={classNames(styles.chapterItem, selectedChapter === null && styles.active)}
            onClick={() => setSelectedChapter(null)}
          >
            全部章节
          </Button>
          {chapters.map(chapter => {
            return (
              <Button
                key={chapter}
                className={classNames(styles.chapterItem, selectedChapter === chapter && styles.active)}
                onClick={() => handleChapterClick(chapter)}
              >
                第{chapter}章
              </Button>
            );
          })}
        </ScrollView>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>讨论摘录</Text>
        <Text className={styles.excerptCount}>共{excerpts.length}条</Text>
        <Button className={styles.addExcerptBtn} onClick={handleAddExcerpt}>
          + 写摘录
        </Button>
      </View>

      {excerpts.length === 0 ? (
        <Empty
          icon="✍️"
          title="暂无摘录"
          description="快来分享你的读书感悟吧"
        />
      ) : (
        <View className={styles.excerptsList}>
          {excerpts.map(excerpt => {
            return (
              <ExcerptCard
                key={excerpt.id}
                excerpt={excerpt}
                showChapter={selectedChapter === null}
                onLike={() => handleLike(excerpt.id)}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default DiscussionPage;
