import React from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import styles from './index.module.scss';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  height?: number;
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showText = true,
  height = 12,
  color = '#8B5A2B',
  className
}) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <View className={classNames(styles.progressBar, className)}>
      <View className={styles.progressTrack} style={{ height: `${height}rpx` }}>
        <View
          className={styles.progressFill}
          style={{ width: `${percent}%`, height: `${height}rpx`, backgroundColor: color }}
        />
      </View>
      {showText && (
        <Text className={styles.progressText}>
          {current}/{total}章 · {percent}%
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;
