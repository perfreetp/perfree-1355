import React, { useState, useMemo } from 'react';
import { View, Text, Input, Image, Button, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockBooks } from '@/data/books';
import { mockMembers } from '@/data/members';
import { formatDate } from '@/utils';
import type { Book } from '@/types';

const currentUser = mockMembers[0];

const PublishBookPage: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [description, setDescription] = useState('');
  const [searchText, setSearchText] = useState('');

  const selectedBook = useMemo(() => {
    return mockBooks.find(b => b.id === selectedBookId);
  }, [selectedBookId]);

  const filteredBooks = useMemo(() => {
    if (!searchText) return mockBooks;
    const text = searchText.toLowerCase();
    return mockBooks.filter(
      b => b.title.toLowerCase().includes(text) || b.author.toLowerCase().includes(text)
    );
  }, [searchText]);

  const months = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    return [0, 1, 2].map(offset => {
      const d = new Date(now.getFullYear(), currentMonth + offset, 1);
      return {
        value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: offset === 0 ? '本月' : (offset === 1 ? '下月' : `${d.getMonth() + 1}月`)
      };
    });
  }, []);

  const canSubmit = selectedBookId && month && description.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (!currentUser.isAdmin) {
      Taro.showToast({ title: '仅管理员可发布', icon: 'none' });
      return;
    }

    console.log('[PublishBook] 发布共读书目', {
      bookId: selectedBookId,
      month,
      description,
      adminId: currentUser.id
    });

    Taro.showModal({
      title: '发布成功',
      content: `已将《${selectedBook?.title}》设为${month}月共读书目`,
      showCancel: false,
      success: () => {
        Taro.switchTab({ url: '/pages/reading-plan/index' });
      }
    });
  };

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
    const book = mockBooks.find(b => b.id === bookId);
    if (book) {
      setDescription(`本月我们一起共读《${book.title}》，这是一本${book.category}类的经典著作，全书共${book.totalChapters}章。希望大家积极参与，共同探讨！`);
    }
  };

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      {!currentUser.isAdmin ? (
        <View className={styles.adminNotice}>
          <Text className={styles.noticeIcon}>🔒</Text>
          <Text className={styles.noticeText}>
            该功能仅管理员可使用。如需发布共读书目，请联系读书会管理员。
          </Text>
        </View>
      ) : (
        <>
          <View className={styles.adminNotice}>
            <Text className={styles.noticeIcon}>ℹ️</Text>
            <Text className={styles.noticeText}>
              选择一本书作为本期共读书目，成员可以报名参与并记录阅读进度。
            </Text>
          </View>

          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📅</Text>
              选择月份
            </Text>
            <View className={styles.monthSelector}>
              {months.map(m => {
                return (
                  <View
                    key={m.value}
                    className={`${styles.monthOption} ${month === m.value ? styles.monthOptionActive : ''}`}
                    onClick={() => setMonth(m.value)}
                  >
                    {m.label}
                  </View>
                );
              })}
            </View>
          </View>

          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📚</Text>
              选择共读书籍
            </Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索书名或作者"
              value={searchText}
              onInput={e => setSearchText(e.detail.value)}
            />
            <View className={styles.booksList}>
              {filteredBooks.map(book => {
                return (
                  <View
                    key={book.id}
                    className={`${styles.bookOption} ${selectedBookId === book.id ? styles.bookOptionActive : ''}`}
                    onClick={() => handleBookSelect(book.id)}
                  >
                    <Image src={book.cover} className={styles.bookOptionCover} mode="aspectFill" />
                    <View className={styles.bookOptionInfo}>
                      <Text className={styles.bookOptionTitle}>{book.title}</Text>
                      <Text className={styles.bookOptionAuthor}>
                        {book.author} · {book.category} · {book.totalChapters}章
                      </Text>
                    </View>
                    <View className={`${styles.radioCircle} ${selectedBookId === book.id ? styles.radioCircleActive : ''}`}>
                      {selectedBookId === book.id && <View className={styles.radioInner} />}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {selectedBook && (
            <View className={styles.formCard}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>👁️</Text>
                已选书籍预览
              </Text>
              <View className={styles.selectedBookPreview}>
                <Image src={selectedBook.cover} className={styles.previewCover} mode="aspectFill" />
                <View className={styles.previewInfo}>
                  <Text className={styles.previewTitle}>{selectedBook.title}</Text>
                  <Text className={styles.previewAuthor}>{selectedBook.author}</Text>
                  <Text className={styles.previewMeta}>
                    豆瓣评分 {selectedBook.rating} · {selectedBook.totalChapters}章 · {selectedBook.ratingCount}人读过
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>✏️</Text>
              共读说明
              <Text className={styles.required}>*</Text>
            </Text>
            <Text className={styles.tip}>
              写一段介绍或寄语，分享你推荐这本书的原因和期望的讨论方向。
            </Text>
            <View className={styles.formGroup} style={{ marginTop: 16 }}>
              <Textarea
                className={styles.textarea}
                placeholder="请输入共读说明..."
                value={description}
                onInput={e => setDescription(e.detail.value)}
                maxlength={500}
              />
              <Text className={styles.tip}>{description.length}/500</Text>
            </View>
          </View>
        </>
      )}

      {currentUser.isAdmin && (
        <View className={styles.bottomActions}>
          <Button
            className={`${styles.submitButton} ${!canSubmit ? styles.disabledButton : ''}`}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            发布共读计划
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default PublishBookPage;
