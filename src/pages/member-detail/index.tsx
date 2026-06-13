import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { getMemberById, mockMembers } from '@/data/members';
import { getMemberBooksByMemberId } from '@/data/books';
import { mockExcerpts } from '@/data/discussions';
import { mockActivityReviews } from '@/data/activities';
import type { Member, MemberBook, Excerpt, ActivityReview } from '@/types';

const currentUser = mockMembers[0];

const MemberDetailPage: React.FC = () => {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'activities' | 'excerpts'>('books');
  const [memberBooks, setMemberBooks] = useState<MemberBook[]>([]);
  const [memberExcerpts, setMemberExcerpts] = useState<Excerpt[]>([]);
  const [memberActivities, setMemberActivities] = useState<ActivityReview[]>([]);

  useEffect(() => {
    const id = router.params.id;
    if (id) {
      loadMemberDetail(id);
    }
  }, [router.params.id]);

  const loadMemberDetail = (memberId: string) => {
    const m = getMemberById(memberId);
    if (m) {
      setMember(m);

      const books = getMemberBooksByMemberId(memberId);
      setMemberBooks(books);

      const excerpts = mockExcerpts.filter(e => e.memberId === memberId);
      setMemberExcerpts(excerpts);

      const activities = mockActivityReviews.filter(a =>
        a.completedMembers.some(cm => cm.id === memberId)
      );
      setMemberActivities(activities);

      console.log('[MemberDetail] 加载成员详情', { memberId: m.id, name: m.name });
    }
  };

  const isSelf = member?.id === currentUser.id;

  const handleBookClick = (memberBook: MemberBook) => {
    Taro.navigateTo({
      url: `/pages/book-detail/index?id=${memberBook.id}`
    });
  };

  const handleContact = () => {
    if (!member) return;
    Taro.showModal({
      title: '联系方式',
      content: `是否向 ${member.name} 发送借阅或交流消息？`,
      confirmText: '发送消息',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '消息已发送', icon: 'success' });
          console.log('[MemberDetail] 发送消息给', { memberId: member.id });
        }
      }
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <View className={styles.ratingStars}>
        {[...Array(5)].map((_, i) => {
          return (
            <Text key={i} className={styles.star}>
              {i < fullStars ? '★' : '☆'}
            </Text>
          );
        })}
      </View>
    );
  };

  if (!member) {
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
        <View className={styles.avatarWrapper}>
          <Image src={member.avatar} className={styles.avatar} mode="aspectFill" />
        </View>
        <Text className={styles.memberName}>{member.name}</Text>
        {member.isAdmin && (
          <View className={styles.adminBadge}>👑 读书会管理员</View>
        )}
        <Text className={styles.memberBio}>{member.bio}</Text>
        <Text className={styles.joinDate}>
          加入于 {member.joinDate.replace(/-/g, '年').replace(/年(\d+)/, '年$1月')}日
        </Text>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{member.participateCount}</Text>
          <Text className={styles.statLabel}>参与活动</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{member.booksCount}</Text>
          <Text className={styles.statLabel}>藏书数量</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{memberExcerpts.length}</Text>
          <Text className={styles.statLabel}>分享摘录</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{memberActivities.length}</Text>
          <Text className={styles.statLabel}>完成共读</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.tabs}>
          <View
            className={`${styles.tabItem} ${activeTab === 'books' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 藏书
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'activities' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            🎯 共读
          </View>
          <View
            className={`${styles.tabItem} ${activeTab === 'excerpts' ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab('excerpts')}
          >
            ✍️ 摘录
          </View>
        </View>

        {activeTab === 'books' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitleInline}>
                <Text className={styles.sectionIcon}>📚</Text>
                TA的藏书 ({memberBooks.length})
              </Text>
              {memberBooks.length > 0 && (
                <Text className={styles.viewAll}>查看全部</Text>
              )}
            </View>
            {memberBooks.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📭</Text>
                <Text className={styles.emptyText}>暂无藏书</Text>
              </View>
            ) : (
              <ScrollView
                className={styles.booksList}
                scrollX
                enhanced
                showScrollbar={false}
              >
                {memberBooks.map(mb => {
                  return (
                    <View
                      key={mb.id}
                      className={styles.bookItem}
                      onClick={() => handleBookClick(mb)}
                    >
                      <Image
                        src={mb.book.cover}
                        className={styles.bookCover}
                        mode="aspectFill"
                      />
                      <Text className={styles.bookTitle}>{mb.book.title}</Text>
                      <Text
                        className={`${styles.bookStatus} ${mb.isAvailable ? styles.available : styles.notAvailable}`}
                      >
                        {mb.isAvailable ? '✓ 可借阅' : '✗ 暂不借'}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </>
        )}

        {activeTab === 'activities' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitleInline}>
                <Text className={styles.sectionIcon}>🎯</Text>
                参与的共读 ({memberActivities.length})
              </Text>
            </View>
            {memberActivities.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📖</Text>
                <Text className={styles.emptyText}>暂无共读记录</Text>
              </View>
            ) : (
              <View>
                {memberActivities.map(activity => {
                  return (
                    <View key={activity.id} className={styles.activityItem}>
                      <Image
                        src={activity.book.cover}
                        className={styles.activityBookCover}
                        mode="aspectFill"
                      />
                      <View className={styles.activityInfo}>
                        <Text className={styles.activityBookTitle}>{activity.book.title}</Text>
                        <View className={styles.activityMeta}>
                          <Text className={styles.activityRole}>{activity.month}月共读</Text>
                          {renderStars(activity.averageRating)}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {activeTab === 'excerpts' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitleInline}>
                <Text className={styles.sectionIcon}>✍️</Text>
                分享的摘录 ({memberExcerpts.length})
              </Text>
            </View>
            {memberExcerpts.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>✍️</Text>
                <Text className={styles.emptyText}>暂无摘录分享</Text>
              </View>
            ) : (
              <View className={styles.excerptList}>
                {memberExcerpts.map(excerpt => {
                  return (
                    <View key={excerpt.id} className={styles.excerptItem}>
                      <Text className={styles.excerptContent}>"{excerpt.content}"</Text>
                      <View className={styles.excerptMeta}>
                        <Text className={styles.excerptBook}>
                          第{excerpt.chapter}章 · {excerpt.type === 'quote' ? '书摘' : excerpt.type === 'question' ? '疑问' : '感悟'}
                        </Text>
                        <Text className={styles.excerptLikes}>❤️ {excerpt.likes}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      </View>

      {!isSelf && (
        <View className={styles.contactSection}>
          <Button className={styles.contactButton} onClick={handleContact}>
            💬 发送消息
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default MemberDetailPage;
