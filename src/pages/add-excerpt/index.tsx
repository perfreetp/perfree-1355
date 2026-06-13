import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Input, Image, Button, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { mockReadingPlans, getCurrentPlan } from '@/data/reading-plans';
import { mockMembers } from '@/data/members';

const currentUser = mockMembers[0];

const typeOptions: Array<{ value: 'quote' | 'question' | 'thought'; label: string; emoji: string; tip: string }> = [
  { value: 'quote', label: '书摘', emoji: '📝', tip: '引用书中的精彩段落' },
  { value: 'question', label: '疑问', emoji: '❓', tip: '阅读中遇到的问题' },
  { value: 'thought', label: '感悟', emoji: '💡', tip: '你的思考和感悟' }
];

const AddExcerptPage: React.FC = () => {
  const router = useRouter();
  const [planId, setPlanId] = useState('');
  const [type, setType] = useState<'quote' | 'question' | 'thought'>('quote');
  const [chapter, setChapter] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');

  const currentPlan = useMemo(() => {
    return getCurrentPlan() || mockReadingPlans[0];
  }, []);

  useEffect(() => {
    const planIdFromRoute = router.params.planId;
    if (planIdFromRoute) {
      setPlanId(planIdFromRoute);
    } else if (currentPlan) {
      setPlanId(currentPlan.id);
    }
    const chapterFromRoute = router.params.chapter;
    if (chapterFromRoute) {
      setChapter(chapterFromRoute);
    }
  }, [router.params, currentPlan]);

  const selectedPlan = useMemo(() => {
    return mockReadingPlans.find(p => p.id === planId) || currentPlan;
  }, [planId, currentPlan]);

  const quickChapters = useMemo(() => {
    if (!selectedPlan) return [];
    const maxChapters = Math.min(selectedPlan.book.totalChapters, 10);
    const chapters: number[] = [];
    for (let i = 1; i <= maxChapters; i++) {
      chapters.push(i);
    }
    return chapters;
  }, [selectedPlan]);

  const canSubmit = chapter && content.trim();

  const handleQuickChapter = (ch: number) => {
    setChapter(String(ch));
  };

  const handleTypeChange = (newType: 'quote' | 'question' | 'thought') => {
    setType(newType);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const excerptData = {
      planId: selectedPlan?.id,
      bookId: selectedPlan?.book.id,
      memberId: currentUser.id,
      type,
      chapter: parseInt(chapter),
      chapterTitle,
      content,
      note
    };

    console.log('[AddExcerpt] 提交摘录', excerptData);

    Taro.showModal({
      title: '提交成功',
      content: '您的摘录已成功提交，感谢分享！',
      showCancel: false,
      success: () => {
        Taro.switchTab({ url: '/pages/discussion/index' });
      }
    });
  };

  const getTypePlaceholder = () => {
    switch (type) {
      case 'quote':
        return '请输入或粘贴书中的精彩段落...';
      case 'question':
        return '请写下你在阅读中遇到的问题...';
      case 'thought':
        return '请分享你的阅读感悟和思考...';
    }
  };

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      {selectedPlan && (
        <View className={styles.formCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📚</Text>
            当前共读书籍
          </Text>
          <View className={styles.bookInfo}>
            <Image src={selectedPlan.book.cover} className={styles.bookCover} mode="aspectFill" />
            <View className={styles.bookDetails}>
              <Text className={styles.bookTitle}>{selectedPlan.book.title}</Text>
              <Text className={styles.bookAuthor}>{selectedPlan.book.author}</Text>
              <Text className={styles.bookMeta}>
                {selectedPlan.month}月共读 · 共{selectedPlan.book.totalChapters}章
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📋</Text>
          摘录类型
          <Text className={styles.required}>*</Text>
        </Text>
        <View className={styles.typeSelector}>
          {typeOptions.map(opt => {
            return (
              <View
                key={opt.value}
                className={`${styles.typeOption} ${type === opt.value ? styles.typeOptionActive : ''}`}
                onClick={() => handleTypeChange(opt.value)}
              >
                <Text className={styles.typeEmoji}>{opt.emoji}</Text>
                <Text className={styles.typeLabel}>{opt.label}</Text>
              </View>
            );
          })}
        </View>
        <View className={styles.typeTips}>
          {typeOptions.map(opt => {
            return (
              <Text key={opt.value} className={styles.typeTipItem}>
                {opt.emoji} {opt.label}：{opt.tip}
              </Text>
            );
          })}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📖</Text>
          章节信息
          <Text className={styles.required}>*</Text>
        </Text>

        <View className={styles.formGroup}>
          <Text className={styles.label}>章节号</Text>
          <Text className={styles.tip}>选择或输入你正在阅读的章节</Text>
          <View className={styles.quickChapters} style={{ marginTop: 12 }}>
            {quickChapters.map(ch => {
              return (
                <View
                  key={ch}
                  className={`${styles.quickChapterBtn} ${chapter === String(ch) ? styles.chapterBtnActive : ''}`}
                  onClick={() => handleQuickChapter(ch)}
                >
                  第{ch}章
                </View>
              );
            })}
          </View>
          <View className={styles.chapterInput}>
            <Input
              className={styles.input}
              placeholder="输入章节号"
              type="number"
              value={chapter}
              onInput={e => setChapter(e.detail.value)}
            />
            <Text className={styles.chapterUnit}>章</Text>
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.label}>章节标题（选填）</Text>
          <Input
            className={styles.input}
            placeholder="输入章节标题，如：认知革命"
            value={chapterTitle}
            onInput={e => setChapterTitle(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>✍️</Text>
          {type === 'quote' ? '摘录内容' : type === 'question' ? '我的问题' : '我的感悟'}
          <Text className={styles.required}>*</Text>
        </Text>
        <Textarea
          className={styles.textarea}
          placeholder={getTypePlaceholder()}
          value={content}
          onInput={e => setContent(e.detail.value)}
          maxlength={1000}
        />
        <Text className={styles.charCount}>{content.length}/1000</Text>

        {type === 'quote' && content && (
          <View className={styles.previewSection}>
            <Text className={styles.previewLabel}>预览效果：</Text>
            <View className={styles.quoteStyle}>"{content}"</View>
          </View>
        )}
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📝</Text>
          补充说明（选填）
        </Text>
        <Textarea
          className={styles.textarea}
          placeholder="可以补充你的想法、上下文说明等..."
          value={note}
          onInput={e => setNote(e.detail.value)}
          maxlength={300}
          style={{ minHeight: 120 }}
        />
        <Text className={styles.charCount}>{note.length}/300</Text>
      </View>

      <View className={styles.bottomActions}>
        <Button
          className={`${styles.submitButton} ${!canSubmit ? styles.disabledButton : ''}`}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          提交{type === 'quote' ? '摘录' : type === 'question' ? '问题' : '感悟'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddExcerptPage;
