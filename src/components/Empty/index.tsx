import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
}

const Empty: React.FC<EmptyProps> = ({
  title = '暂无数据',
  description = '快去添加一些内容吧',
  icon = '📚',
  className
}) => {
  return (
    <View className={classNames(styles.emptyContainer, className)}>
      <Text className={styles.emptyIcon}>{icon}</Text>
      <Text className={styles.emptyTitle}>{title}</Text>
      <Text className={styles.emptyDesc}>{description}</Text>
    </View>
  );
};

export default Empty;
