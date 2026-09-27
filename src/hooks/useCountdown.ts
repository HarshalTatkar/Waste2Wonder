import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export function useCountdown(targetDate?: Date | string): TimeLeft {
  const calculate = (): TimeLeft => {
    // Default to upcoming Sunday 23:59:59 if no target given
    let target: number;
    if (targetDate) {
      target = new Date(targetDate).getTime();
    } else {
      const now = new Date();
      const nextSunday = new Date(now);
      const day = now.getDay();
      const diff = 7 - (day === 0 ? 7 : day);
      nextSunday.setDate(now.getDate() + diff);
      nextSunday.setHours(23, 59, 59, 999);
      target = nextSunday.getTime();
    }

    const difference = target - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEnded: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}
