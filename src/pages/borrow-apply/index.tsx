import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Button, Textarea, ScrollView, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import { formatDate } from '@/utils';
import type { MemberBook } from '@/types';

const BorrowApplyPage: React.FC = () => {
  const store = useAppStore();
  const router = useRouter();
  const [memberBook, setMemberBook] = useState<MemberBook | null>(null);
  const [borrowDays, setBorrowDays] = useState(30);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [note, setNote] = useState('');
  const [useCustomDate, setUseCustomDate] = useState(false);

  const currentUser = store.getCurrentUser();

  useEffect(() => {
    const memberBookId = router.params.memberBookId;
    if (memberBookId) {
      const mb = store.getMemberBookById(memberBookId);
      if (mb) {
        setMemberBook(mb);
        console.log('[BorrowApply] 加载借阅书籍', { bookId: mb.bookId, title: mb.book.title });
      }
    }
  }, [router.params.memberBookId, store]);

  const quickDateOptions = useMemo(() => [
    { days: 7, label: '一周' },
    { days: 14, label: '两周' },
    { days: 30, label: '一个月' },
    { days: 60, label: '两个月' }
  ], []);

  const calculatedReturnDate = useMemo(() => {
    if (expectedReturnDate) return expectedReturnDate;
    const date = new Date();
    date.setDate(date.getDate() + borrowDays);
    return formatDate(date);
  }, [borrowDays, expectedReturnDate]);

  const canSubmit = memberBook && calculatedReturnDate && currentUser;

  const getConditionText = (condition: string) => {
    const map: Record<string, string> = {
      new: '全新',
      good: '良好',
      fair: '一般',
      poor: '破旧'
    };
    return map[condition] || condition;
  };

  const handleQuickDate = (days: number) => {
    setBorrowDays(days);
    setUseCustomDate(false);
    setExpectedReturnDate('');
  };

  const handleDateChange = (e: any) => {
    setExpectedReturnDate(e.detail.value);
    setUseCustomDate(true);
  };

  const handleSubmit = () => {
    if (!canSubmit || !memberBook || !currentUser) return;

    store.applyBorrow({
      memberBookId: memberBook.id,
      expectedReturnDate: calculatedReturnDate,
      note
    });

    console.log('[BorrowApply] 提交借阅申请', {
      memberBookId: memberBook.id,
      expectedReturnDate: calculatedReturnDate,
      note
    });

    Taro.showModal({
      title: '申请已提交',
      content: `借阅申请已发送给${memberBook.member.name}，请等待对方确认`,
      showCancel: false,
      success: () => {
        Taro.switchTab({ url: '/pages/borrow/index' });
      }
    });
  };

  if (!memberBook) {
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
      <View className={styles.notice}>
        <Text className={styles.noticeIcon}>ℹ️</Text>
        <Text className={styles.noticeText}>
          提交申请后，书主会收到通知。请在申请通过后及时完成书籍交接，并爱护书籍。
        </Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📚</Text>
          借阅书籍
        </Text>
        <View className={styles.bookInfo}>
          <Image src={memberBook.book.cover} className={styles.bookCover} mode="aspectFill" />
          <View className={styles.bookDetails}>
            <Text className={styles.bookTitle}>{memberBook.book.title}</Text>
            <Text className={styles.bookAuthor}>{memberBook.book.author}</Text>
            <View className={styles.ownerInfo}>
              <Image src={memberBook.member.avatar} className={styles.ownerAvatar} />
              <Text className={styles.ownerName}>持有者：{memberBook.member.name}</Text>
            </View>
            <Text className={styles.availabilityTag}>可借阅</Text>
          </View>
        </View>

        <View className={styles.bookCondition}>
          <Text className={styles.conditionTitle}>书籍品相：</Text>
          <Text className={styles.conditionValue}>{getConditionText(memberBook.condition)}</Text>
          {memberBook.note && (
            <Text className={styles.conditionNote}>备注：{memberBook.note}</Text>
          )}
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📅</Text>
          借阅时长
          <Text className={styles.required}>*</Text>
        </Text>

        <View className={styles.dateSelector}>
          {quickDateOptions.map(opt => {
            return (
              <View
                key={opt.days}
                className={`${styles.dateOption} ${borrowDays === opt.days && !useCustomDate ? styles.dateOptionActive : ''}`}
                onClick={() => handleQuickDate(opt.days)}
              >
                <Text className={styles.dateDays}>{opt.days}</Text>
                <Text className={styles.dateLabel}>{opt.label}</Text>
              </View>
            );
          })}
        </View>

        <View className={styles.customDateSection}>
          <Text className={styles.customDateLabel}>或选择具体归还日期：</Text>
          <Picker
            mode="date"
            value={expectedReturnDate || calculatedReturnDate}
            start={formatDate(new Date(Date.now() + 86400000))}
            onChange={handleDateChange}
          >
            <View className={styles.pickerInput}>
              <Text>{calculatedReturnDate}</Text>
              <Text className={styles.pickerIcon}>📅</Text>
            </View>
          </Picker>
          <Text className={styles.tip}>
            预计归还日期：{calculatedReturnDate}
            {!useCustomDate && `（${borrowDays}天后）`}
          </Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📝</Text>
          备注（选填）
        </Text>
        <Textarea
          className={styles.textarea}
          placeholder="可以说明借阅原因、约定交接时间地点等..."
          value={note}
          onInput={e => setNote(e.detail.value)}
          maxlength={200}
        />
        <Text className={styles.tip} style={{ textAlign: 'right' }}>{note.length}/200</Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📋</Text>
          借阅须知
        </Text>
        <View className={styles.borrowRules}>
          <Text className={styles.rulesTitle}>请遵守以下约定：</Text>
          <Text className={styles.ruleItem}>请按时归还书籍，如需续借请提前与书主沟通</Text>
          <Text className={styles.ruleItem}>爱护书籍，避免损坏、涂鸦或丢失</Text>
          <Text className={styles.ruleItem}>交接时请双方确认书籍状态</Text>
          <Text className={styles.ruleItem}>阅读时可以做笔记，但请尽量保持书本整洁</Text>
          <Text className={styles.ruleItem}>如有损坏或丢失，请协商赔偿事宜</Text>
        </View>
      </View>

      <View className={styles.bottomActions}>
        <Button
          className={`${styles.submitButton} ${!canSubmit ? styles.disabledButton : ''}`}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          提交借阅申请
        </Button>
      </View>
    </ScrollView>
  );
};

export default BorrowApplyPage;
