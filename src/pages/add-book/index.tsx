import React, { useState, useMemo } from 'react';
import { View, Text, Input, Image, Button, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import type { Book } from '@/types';

const conditionOptions = [
  { value: 'new', label: '全新', emoji: '✨' },
  { value: 'good', label: '良好', emoji: '📖' },
  { value: 'fair', label: '一般', emoji: '📚' },
  { value: 'poor', label: '破旧', emoji: '📕' }
];

const AddBookPage: React.FC = () => {
  const store = useAppStore();
  const currentUser = store.getCurrentUser();
  const [mode, setMode] = useState<'search' | 'manual'>('search');
  const [searchText, setSearchText] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('good');
  const [isAvailable, setIsAvailable] = useState(true);
  const [note, setNote] = useState('');

  const searchResults = useMemo(() => {
    if (!searchText || searchText.length < 1) return [];
    const text = searchText.toLowerCase();
    return store.books.filter(
      b => b.title.toLowerCase().includes(text) || b.author.toLowerCase().includes(text)
    );
  }, [searchText, store.books]);

  const canSubmit = useMemo(() => {
    if (selectedBook) {
      return true;
    }
    return title.trim() && author.trim();
  }, [selectedBook, title, author]);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn || '');
    setTotalChapters(String(book.totalChapters));
    setCategory(book.category);
    setDescription(book.description);
    console.log('[AddBook] 选择已有书籍', { bookId: book.id, title: book.title });
  };

  const handleSwitchMode = (newMode: 'search' | 'manual') => {
    setMode(newMode);
    if (newMode === 'manual') {
      setSelectedBook(null);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit || !currentUser) return;

    if (selectedBook) {
      store.addMemberBook({
        bookId: selectedBook.id,
        condition: condition as 'new' | 'good' | 'fair' | 'poor',
        isAvailable,
        note
      });
    } else {
      store.addMemberBook({
        bookData: {
          title,
          author,
          isbn,
          totalChapters: parseInt(totalChapters) || 0,
          category,
          description
        },
        condition: condition as 'new' | 'good' | 'fair' | 'poor',
        isAvailable,
        note
      });
    }

    console.log('[AddBook] 添加藏书', { title, author });

    Taro.showModal({
      title: '添加成功',
      content: `《${title}》已成功添加到你的书架`,
      showCancel: false,
      success: () => {
        Taro.switchTab({ url: '/pages/bookshelf/index' });
      }
    });
  };

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🔍</Text>
          查找书籍
        </Text>
        <View className={styles.availabilityToggle} style={{ marginBottom: 24 }}>
          <View
            className={`${styles.availabilityOption} ${mode === 'search' ? styles.availabilityOptionActive : ''}`}
            onClick={() => handleSwitchMode('search')}
          >
            从书库选择
          </View>
          <View
            className={`${styles.availabilityOption} ${mode === 'manual' ? styles.availabilityOptionActive : ''}`}
            onClick={() => handleSwitchMode('manual')}
          >
            手动添加
          </View>
        </View>

        {mode === 'search' ? (
          <>
            <Input
              className={styles.input}
              placeholder="搜索书名或作者"
              value={searchText}
              onInput={e => setSearchText(e.detail.value)}
            />
            <View className={styles.searchResult}>
              {searchText.length > 0 && searchResults.length === 0 && (
                <View className={styles.emptySearch}>
                  <Text>未找到相关书籍，试试手动添加吧</Text>
                </View>
              )}
              {searchResults.map(book => {
                return (
                  <View key={book.id} className={styles.searchItem}>
                    <Image src={book.cover} className={styles.searchItemCover} mode="aspectFill" />
                    <View className={styles.searchItemInfo}>
                      <Text className={styles.searchItemTitle}>{book.title}</Text>
                      <Text className={styles.searchItemAuthor}>{book.author}</Text>
                    </View>
                    <View className={styles.searchItemBtn} onClick={() => handleSelectBook(book)}>
                      选择
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <Text className={styles.tip}>
            如果书库中没有这本书，你可以手动添加书籍信息
          </Text>
        )}
      </View>

      {(selectedBook || mode === 'manual') && (
        <>
          {selectedBook && (
            <View className={styles.formCard}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>👁️</Text>
                已选书籍
              </Text>
              <View className={styles.bookPreview}>
                <View className={styles.previewCover}>
                  <Image src={selectedBook.cover} style={{ width: '100%', height: '100%', borderRadius: 8 }} mode="aspectFill" />
                </View>
                <View className={styles.previewInfo}>
                  <Text className={styles.previewTitle}>{selectedBook.title}</Text>
                  <Text className={styles.previewAuthor}>{selectedBook.author}</Text>
                  <Text className={styles.previewDesc}>{selectedBook.category} · {selectedBook.totalChapters}章</Text>
                </View>
              </View>
            </View>
          )}

          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>
              书籍信息
            </Text>

            <View className={styles.formGroup}>
              <Text className={styles.label}>
                书名<Text className={styles.required}>*</Text>
              </Text>
              <Input
                className={styles.input}
                placeholder="请输入书名"
                value={title}
                onInput={e => setTitle(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>
                作者<Text className={styles.required}>*</Text>
              </Text>
              <Input
                className={styles.input}
                placeholder="请输入作者"
                value={author}
                onInput={e => setAuthor(e.detail.value)}
              />
            </View>

            <View className={styles.inputRow}>
              <View className={styles.formGroup} style={{ flex: 1 }}>
                <Text className={styles.label}>ISBN</Text>
                <Input
                  className={styles.input}
                  placeholder="选填"
                  value={isbn}
                  onInput={e => setIsbn(e.detail.value)}
                />
              </View>
              <View className={styles.formGroup} style={{ flex: 1 }}>
                <Text className={styles.label}>章节数</Text>
                <Input
                  className={styles.input}
                  placeholder="选填"
                  type="number"
                  value={totalChapters}
                  onInput={e => setTotalChapters(e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>分类</Text>
              <Input
                className={styles.input}
                placeholder="如：文学、历史、科幻等"
                value={category}
                onInput={e => setCategory(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>简介</Text>
              <Textarea
                className={styles.textarea}
                placeholder="简要介绍这本书"
                value={description}
                onInput={e => setDescription(e.detail.value)}
                maxlength={300}
              />
            </View>
          </View>

          <View className={styles.formCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📦</Text>
              藏书状态
            </Text>

            <View className={styles.formGroup}>
              <Text className={styles.label}>书籍品相</Text>
              <View className={styles.conditionSelector}>
              {conditionOptions.map(opt => {
                return (
                  <View
                    key={opt.value}
                    className={`${styles.conditionOption} ${condition === opt.value ? styles.conditionOptionActive : ''}`}
                    onClick={() => setCondition(opt.value)}
                  >
                    <Text className={styles.conditionEmoji}>{opt.emoji}</Text>
                    <Text className={styles.conditionLabel}>{opt.label}</Text>
                  </View>
                );
              })}
            </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>是否可借阅</Text>
              <View className={styles.availabilityToggle}>
                <View
                  className={`${styles.availabilityOption} ${isAvailable ? styles.availabilityOptionActive : ''}`}
                  onClick={() => setIsAvailable(true)}
                >
                  可借阅
                </View>
                <View
                  className={`${styles.availabilityOption} ${!isAvailable ? styles.availabilityOptionActive : ''}`}
                  onClick={() => setIsAvailable(false)}
                >
                  暂不借
                </View>
              </View>
              <Text className={styles.tip}>
                {isAvailable ? '其他成员可以申请借阅这本书' : '这本书暂时不对外借阅'}
              </Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>备注</Text>
              <Textarea
                className={styles.textarea}
                placeholder="如：书脊有轻微磨损、有读书笔记等"
                value={note}
                onInput={e => setNote(e.detail.value)}
                maxlength={200}
              />
            </View>
          </View>
        </>
      )}

      <View className={styles.bottomActions}>
        <Button
          className={`${styles.submitButton} ${!canSubmit ? styles.disabledButton : ''}`}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          添加到书架
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddBookPage;
