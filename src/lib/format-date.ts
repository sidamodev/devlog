// app/utils/formatDate.ts
import { format, formatDistanceToNow, isSameYear } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000; // 현재 시간과의 차이(초)

  // 1분 미만일 때
  if (diff < 60) {
    return '방금 전';
  }

  // 3일 미만일 때 - 상대 시간 표시
  if (diff < 60 * 60 * 24 * 3) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  // 3일 이상일 때
  // 올해 게시물이면 "MM월 dd일"
  if (isSameYear(d, now)) {
    return format(d, 'M월 d일', { locale: ko });
  }

  // 작년 이전 게시물이면 "yyyy.MM.dd"
  return format(d, 'yyyy.MM.dd');
}
