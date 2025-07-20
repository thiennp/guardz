import { NonNegativeNumber } from '@/types/NonNegativeNumber';

export const formatDuration = (durationInHours: NonNegativeNumber): string => {
  const totalMinutes = Math.round(durationInHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursString =
    hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '';
  const minutesString =
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'min' : 'mins'}` : '';

  if (hours > 0 && minutes > 0) {
    return `${hoursString} ${minutesString}`;
  } else if (hours > 0) {
    return hoursString;
  } else if (minutes > 0) {
    return minutesString;
  } else {
    return '0 mins';
  }
};
