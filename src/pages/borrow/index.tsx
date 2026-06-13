import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Image, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { getStatusText } from '@/data/borrows';
import { useAppStore } from '@/store';
import Empty from '@/components/Empty';
import { formatDate, formatDaysRemaining, getDaysRemaining } from '@/utils';
import type { BorrowRecord } from '@/types';

type TabType = 'borrowed' | 'lent' | 'pending';

const BorrowPage: React.FC = () => {
  const store = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('borrowed');
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [datePickerVisible, setDatePickerVisible] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  const currentUser = store.getCurrentUser();

  useDidShow(() => {
    loadRecords();
    loadPendingCount();
  });

  useEffect(() => {
    loadRecords();
  }, [activeTab]);

  const loadPendingCount = () => {
    if (!currentUser) return;
    const pending = store.getPendingBorrows(currentUser.id);
    setPendingCount(pending.length);
  };

  const loadRecords = () => {
    if (!currentUser) return;
    let result: BorrowRecord[] = [];

    switch (activeTab) {
      case 'borrowed':
        result = store.getBorrowRecordsByBorrowerId(currentUser.id);
        break;
      case 'lent':
        result = store.getBorrowRecordsByOwnerId(currentUser.id);
        break;
      case 'pending':
        result = store.getPendingBorrows(currentUser.id);
        break;
    }

    setRecords(result.sort((a, b) => new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime()));
    console.log('[Borrow] 加载借阅记录完成', { activeTab, count: result.length });
  };

  const openDatePicker = (recordId: string) => {
    setDatePickerVisible(recordId);
    setSelectedDate(formatDate(new Date()));
  };

  const closeDatePicker = () => {
    setDatePickerVisible(null);
    setSelectedDate('');
  };

  const handleApprove = (recordId: string) => {
    openDatePicker(recordId);
  };

  const handleApproveConfirm = (recordId: string) => {
    store.approveBorrow(recordId, selectedDate);
    closeDatePicker();
    loadRecords();
    loadPendingCount();
    Taro.showToast({
      title: '已同意借阅',
      icon: 'success'
    });
    console.log('[Borrow] 同意借阅', { recordId, actualBorrowDate: selectedDate });
  };

  const handleReject = (recordId: string) => {
    store.rejectBorrow(recordId);
    loadRecords();
    loadPendingCount();
    Taro.showToast({
      title: '已拒绝',
      icon: 'none'
    });
    console.log('[Borrow] 拒绝借阅', { recordId });
  };

  const handleConfirmPickup = (recordId: string) => {
    openDatePicker(recordId);
  };

  const handleConfirmPickupConfirm = (recordId: string) => {
    store.confirmPickup(recordId, selectedDate);
    closeDatePicker();
    loadRecords();
    Taro.showToast({
      title: '已确认取书',
      icon: 'success'
    });
    console.log('[Borrow] 确认取书', { recordId, actualBorrowDate: selectedDate });
  };

  const handleReturn = (recordId: string) => {
    openDatePicker(recordId);
  };

  const handleReturnConfirm = (recordId: string) => {
    store.confirmReturn(recordId, selectedDate);
    closeDatePicker();
    loadRecords();
    Taro.showToast({
      title: '已确认归还',
      icon: 'success'
    });
    console.log('[Borrow] 确认归还', { recordId, actualReturnDate: selectedDate });
  };

  const handleRemind = (recordId: string) => {
    Taro.showModal({
      title: '提醒归还',
      content: '确定要提醒对方归还书籍吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已发送提醒',
            icon: 'success'
          });
          console.log('[Borrow] 发送归还提醒', { recordId });
        }
      }
    });
  };

  const handleApply = () => {
    Taro.navigateTo({
      url: '/pages/borrow-apply/index'
    });
  };

  const getDaysRemainingClass = (returnDate: string) => {
    const days = getDaysRemaining(returnDate);
    if (days < 0) return styles.danger;
    if (days <= 3) return styles.warning;
    return styles.normal;
  };

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'borrowed', label: '我借的' },
    { key: 'lent', label: '我借出的' },
    { key: 'pending', label: '待处理', count: pendingCount }
  ];

  const getStatusClass = (status: BorrowRecord['status']) => {
    const classMap: Record<BorrowRecord['status'], string> = {
      pending: styles.pending,
      approved: styles.approved,
      borrowed: styles.borrowed,
      returned: styles.returned,
      rejected: styles.rejected
    };
    return classMap[status];
  };

  const showReminder = records.some(
    r => r.status === 'borrowed' && getDaysRemaining(r.expectedReturnDate) <= 3
  );

  if (!currentUser) {
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
      {showReminder && (
        <View className={styles.reminderSection}>
          <View className={styles.reminderHeader}>
            <Text className={styles.reminderIcon}>⏰</Text>
            <Text className={styles.reminderTitle}>归还提醒</Text>
          </View>
          <Text className={styles.reminderDesc}>
            有书籍即将到期，请及时归还或提醒对方归还
          </Text>
        </View>
      )}

      <View className={styles.tabSection}>
        {tabs.map(tab => (
          <Button
            key={tab.key}
            className={classNames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && ` (${tab.count})`}
          </Button>
        ))}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>
          {activeTab === 'borrowed' && '我的借阅'}
          {activeTab === 'lent' && '我的借出'}
          {activeTab === 'pending' && '待处理'}
        </Text>
        <Text className={styles.recordCount}>共{records.length}条</Text>
      </View>

      {records.length === 0 ? (
        <Empty
          icon="📖"
          title={
            activeTab === 'borrowed'
              ? '暂无借阅记录'
              : activeTab === 'lent'
              ? '暂无借出记录'
              : '暂无待处理事项'
          }
          description={activeTab === 'borrowed' ? '去书架看看有没有想借的书吧' : ''}
        />
      ) : (
        <View className={styles.borrowList}>
          {records.map(record => (
            <View key={record.id} className={styles.borrowCard}>
              <View className={styles.cardHeader}>
                <Image
                  src={record.memberBook.book.cover}
                  mode="aspectFill"
                  className={styles.bookCover}
                />
                <View className={styles.bookInfo}>
                  <Text className={styles.bookTitle}>
                    {record.memberBook.book.title}
                  </Text>
                  <Text className={styles.bookAuthor}>
                    {record.memberBook.book.author}
                  </Text>
                  <View className={styles.userInfo}>
                    {activeTab === 'borrowed' ? (
                      <>
                        <Image
                          src={record.owner.avatar}
                          className={styles.userAvatar}
                        />
                        <Text className={styles.userName}>
                          藏书人: {record.owner.name}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Image
                          src={record.borrower.avatar}
                          className={styles.userAvatar}
                        />
                        <Text className={styles.userName}>
                          借阅人: {record.borrower.name}
                        </Text>
                      </>
                    )}
                  </View>
                  <View
                    className={classNames(styles.statusBadge, getStatusClass(record.status))}
                  >
                    {getStatusText(record.status)}
                  </View>
                </View>
              </View>

              <View className={styles.borrowDetails}>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>申请日期</Text>
                  <Text className={styles.detailValue}>
                    {formatDate(record.applyDate)}
                  </Text>
                </View>
                <View className={styles.detailRow}>
                  <Text className={styles.detailLabel}>预计归还</Text>
                  <Text className={styles.detailValue}>
                    {formatDate(record.expectedReturnDate)}
                  </Text>
                </View>
                {record.status === 'borrowed' && (
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>借阅状态</Text>
                    <Text
                      className={classNames(
                        styles.detailValue,
                        styles.daysRemaining,
                        getDaysRemainingClass(record.expectedReturnDate)
                      )}
                    >
                      {formatDaysRemaining(record.expectedReturnDate)}
                    </Text>
                  </View>
                )}
                {record.actualBorrowDate && (
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>实际取书</Text>
                    <Text className={styles.detailValue}>
                      {formatDate(record.actualBorrowDate)}
                    </Text>
                  </View>
                )}
                {record.actualReturnDate && (
                  <View className={styles.detailRow}>
                    <Text className={styles.detailLabel}>实际归还</Text>
                    <Text className={styles.detailValue}>
                      {formatDate(record.actualReturnDate)}
                    </Text>
                  </View>
                )}
              </View>

              {record.status === 'pending' && record.ownerId === currentUser.id && (
                <View className={styles.cardActions}>
                  <Button
                    className={classNames(styles.actionBtn)}
                    onClick={() => handleReject(record.id)}
                  >
                    拒绝
                  </Button>
                  <Button
                    className={classNames(styles.actionBtn, styles.primary)}
                    onClick={() => handleApprove(record.id)}
                  >
                    同意
                  </Button>
                </View>
              )}

              {record.status === 'approved' && record.borrowerId === currentUser.id && (
                <View className={styles.cardActions}>
                  <Button
                    className={classNames(styles.actionBtn, styles.success)}
                    onClick={() => handleConfirmPickup(record.id)}
                  >
                    确认取书
                  </Button>
                </View>
              )}

              {record.status === 'borrowed' && record.ownerId === currentUser.id && (
                <View className={styles.cardActions}>
                  <Button
                    className={classNames(styles.actionBtn, styles.warning)}
                    onClick={() => handleRemind(record.id)}
                  >
                    提醒归还
                  </Button>
                  <Button
                    className={classNames(styles.actionBtn, styles.success)}
                    onClick={() => handleReturn(record.id)}
                  >
                    确认归还
                  </Button>
                </View>
              )}

              {datePickerVisible === record.id && (
                <View className={styles.datePickerSection}>
                  <View className={styles.datePickerHeader}>
                    <Text className={styles.datePickerTitle}>
                      {record.status === 'pending' && '请选择实际交接日期'}
                      {record.status === 'approved' && '请选择实际取书日期'}
                      {record.status === 'borrowed' && '请选择实际归还日期'}
                    </Text>
                  </View>
                  <Picker
                    mode="date"
                    value={selectedDate}
                    start={formatDate(new Date(Date.now() - 30 * 86400000))}
                    end={formatDate(new Date(Date.now() + 365 * 86400000))}
                    onChange={(e: any) => setSelectedDate(e.detail.value)}
                  >
                    <View className={styles.pickerInput}>
                      <Text>{selectedDate}</Text>
                      <Text className={styles.pickerIcon}>📅</Text>
                    </View>
                  </Picker>
                  <View className={styles.datePickerActions}>
                    <Button
                      className={classNames(styles.actionBtn)}
                      onClick={closeDatePicker}
                    >
                      取消
                    </Button>
                    <Button
                      className={classNames(styles.actionBtn, styles.primary)}
                      onClick={() => {
                        if (record.status === 'pending') {
                          handleApproveConfirm(record.id);
                        } else if (record.status === 'approved') {
                          handleConfirmPickupConfirm(record.id);
                        } else if (record.status === 'borrowed') {
                          handleReturnConfirm(record.id);
                        }
                      }}
                    >
                      确认
                    </Button>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default BorrowPage;
