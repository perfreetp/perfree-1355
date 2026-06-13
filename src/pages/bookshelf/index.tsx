import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import styles from './index.module.scss';
import { useAppStore } from '@/store';
import BookCard from '@/components/BookCard';
import Empty from '@/components/Empty';
import type { MemberBook } from '@/types';

type FilterType = 'all' | 'available' | 'mine';

const BookshelfPage: React.FC = () => {
  const store = useAppStore();
  const currentUser = store.getCurrentUser();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [books, setBooks] = useState<MemberBook[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<Record<string, MemberBook[]>>({});

  useDidShow(() => {
    loadBooks();
  });

  const loadBooks = () => {
    if (!currentUser) return;

    let result: MemberBook[] = [];

    switch (filter) {
      case 'available':
        result = store.getAvailableMemberBooks();
        break;
      case 'mine':
        result = store.getMemberBooksByMemberId(currentUser.id);
        break;
      default:
        result = store.memberBooks;
    }

    if (selectedMember) {
      result = result.filter(b => b.memberId === selectedMember);
    }

    if (searchText) {
      const text = searchText.toLowerCase();
      result = result.filter(
        b =>
          b.book.title.toLowerCase().includes(text) ||
          b.book.author.toLowerCase().includes(text)
      );
    }

    setBooks(result);

    const grouped: Record<string, MemberBook[]> = {};
    result.forEach(book => {
      const key = book.memberId;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(book);
    });
    setGroupedBooks(grouped);

    console.log('[Bookshelf] 加载书籍完成', { filter, count: result.length });
  };

  const handleBookClick = (memberBook: MemberBook) => {
    Taro.navigateTo({
      url: `/pages/book-detail/index?id=${memberBook.id}`
    });
  };

  const handleAddBook = () => {
    Taro.navigateTo({
      url: '/pages/add-book/index'
    });
  };

  const handleMemberClick = (memberId: string) => {
    setSelectedMember(selectedMember === memberId ? null : memberId);
  };

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部藏书' },
    { key: 'available', label: '可借书籍' },
    { key: 'mine', label: '我的藏书' }
  ];

  const getMemberById = (id: string) => store.members.find(m => m.id === id);

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className={styles.filterSection}>
        {filterTabs.map(tab => (
          <Button
            key={tab.key}
            className={classNames(styles.filterTab, filter === tab.key && styles.active)}
            onClick={() => {
              setFilter(tab.key);
              setTimeout(loadBooks, 0);
            }}
          >
            {tab.label}
          </Button>
        ))}
      </View>

      <View className={styles.searchSection}>
        <Input
          className={styles.searchInput}
          placeholder="搜索书名或作者"
          value={searchText}
          onInput={e => {
            setSearchText(e.detail.value);
            setTimeout(loadBooks, 0);
          }}
        />
      </View>

      {filter === 'all' && (
        <ScrollView
          className={styles.memberFilter}
          scrollX
          enhanced
          showScrollbar={false}
        >
          <Button
            className={classNames(styles.memberFilterItem, !selectedMember && styles.active)}
            onClick={() => {
              setSelectedMember(null);
              setTimeout(loadBooks, 0);
            }}
          >
            全部成员
          </Button>
          {store.members.map(member => (
            <Button
              key={member.id}
              className={classNames(styles.memberFilterItem, selectedMember === member.id && styles.active)}
              onClick={() => {
                handleMemberClick(member.id);
                setTimeout(loadBooks, 0);
              }}
            >
              {member.name}
            </Button>
          ))}
        </ScrollView>
      )}

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>
          {filter === 'all' && '全部藏书'}
          {filter === 'available' && '可借书籍'}
          {filter === 'mine' && '我的藏书'}
        </Text>
        <Text className={styles.bookCount}>共{books.length}本</Text>
        {filter === 'mine' && (
          <Button className={styles.addButton} onClick={handleAddBook}>
            + 添加
          </Button>
        )}
      </View>

      {books.length === 0 ? (
        <Empty
          icon="📚"
          title="暂无书籍"
          description={filter === 'mine' ? '快去添加你的第一本藏书吧' : '暂无符合条件的书籍'}
        />
      ) : filter === 'all' && !selectedMember ? (
        Object.entries(groupedBooks).map(([memberId, memberBooks]) => {
          const member = getMemberById(memberId);
          if (!member) return null;
          return (
            <View key={memberId} className={styles.memberSection}>
              <View
                className={styles.memberHeader}
                onClick={() => Taro.navigateTo({ url: `/pages/member-detail/index?id=${memberId}` })}
              >
                <Image
                  src={member.avatar}
                  className={styles.memberAvatar}
                />
                <View className={styles.memberInfo}>
                  <Text className={styles.memberName}>
                    {member.name}
                    {member.isAdmin && ' (管理员)'}
                  </Text>
                  <Text className={styles.memberBooksCount}>
                    {memberBooks.length}本藏书 · {memberBooks.filter(b => b.isAvailable).length}本可借
                  </Text>
                </View>
              </View>
              <View className={styles.booksList}>
                {memberBooks.map(memberBook => (
                  <BookCard
                    key={memberBook.id}
                    book={memberBook.book}
                    memberBook={memberBook}
                    showAvailability
                    showOwner={false}
                    onClick={() => handleBookClick(memberBook)}
                  />
                ))}
              </View>
            </View>
          );
        })
      ) : (
        <View className={styles.booksList}>
          {books.map(memberBook => (
            <BookCard
              key={memberBook.id}
              book={memberBook.book}
              memberBook={memberBook}
              showAvailability
              showOwner={filter !== 'mine'}
              onClick={() => handleBookClick(memberBook)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default BookshelfPage;
