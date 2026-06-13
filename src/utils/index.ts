export const formatDate = (dateStr: string | Date): string => {
  if (!dateStr) return '';
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateStr: string | Date): string => {
  if (!dateStr) return '';
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const getMonthText = (monthStr: string): string => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `${year}年${parseInt(month)}月`;
};

export const getProgressText = (current: number, total: number): string => {
  if (total === 0) return '0%';
  const percent = Math.round((current / total) * 100);
  return `${percent}%`;
};

export const getProgressPercent = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

export const getConditionText = (condition: 'new' | 'good' | 'fair' | 'poor'): string => {
  const conditionMap = {
    new: '全新',
    good: '良好',
    fair: '一般',
    poor: '较旧'
  };
  return conditionMap[condition];
};

export const getExcerptTypeText = (type: 'quote' | 'question' | 'thought'): string => {
  const typeMap = {
    quote: '书摘',
    question: '提问',
    thought: '感想'
  };
  return typeMap[type];
};

export const getExcerptTypeColor = (type: 'quote' | 'question' | 'thought'): string => {
  const colorMap = {
    quote: '#8B5A2B',
    question: '#FF9800',
    thought: '#7CB342'
  };
  return colorMap[type];
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    ongoing: '#1677ff',
    upcoming: '#7CB342',
    completed: '#86909C',
    pending: '#FF9800',
    approved: '#1677ff',
    borrowed: '#7CB342',
    returned: '#86909C',
    rejected: '#F53F3F',
    reading: '#1677ff',
    paused: '#FF9800'
  };
  return colorMap[status] || '#86909C';
};

export const getStatusBgColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    ongoing: 'rgba(22, 119, 255, 0.1)',
    upcoming: 'rgba(124, 179, 66, 0.1)',
    completed: 'rgba(134, 144, 156, 0.1)',
    pending: 'rgba(255, 152, 0, 0.1)',
    approved: 'rgba(22, 119, 255, 0.1)',
    borrowed: 'rgba(124, 179, 66, 0.1)',
    returned: 'rgba(134, 144, 156, 0.1)',
    rejected: 'rgba(245, 63, 63, 0.1)',
    reading: 'rgba(22, 119, 255, 0.1)',
    paused: 'rgba(255, 152, 0, 0.1)'
  };
  return colorMap[status] || 'rgba(134, 144, 156, 0.1)';
};

export const getDaysRemaining = (dateStr: string): number => {
  if (!dateStr) return 0;
  const targetDate = new Date(dateStr);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDaysRemaining = (dateStr: string): string => {
  const days = getDaysRemaining(dateStr);
  if (days > 0) {
    return `还剩${days}天`;
  } else if (days === 0) {
    return '今天到期';
  } else {
    return `已逾期${Math.abs(days)}天`;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
