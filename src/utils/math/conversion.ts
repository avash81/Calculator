import nepaliCalendarData from '../../data/nepali-calendar.json';

const nepaliMonths = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const nepaliDays = [
  'Aaitabar', 'Sombar', 'Mangalbar', 'Budhabar', 'Bihibar', 'Sukrabar', 'Sanibar'
];

const englishDays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Reference date: 2000-01-01 BS = 1943-04-14 AD
const refBS = { year: 2000, month: 1, day: 1 };
const refAD = new Date(1943, 3, 14);

export function convertBStoAD(bsY: number, bsM: number, bsD: number) {
  const calendar = nepaliCalendarData as Record<string, number[]>;
  if (!calendar[bsY]) return null;

  let totalDays = 0;

  // Days from refBS to target BS
  for (let y = refBS.year; y < bsY; y++) {
    if (calendar[y]) {
      totalDays += calendar[y].reduce((a, b) => a + b, 0);
    }
  }
  
  for (let m = 0; m < bsM - 1; m++) {
    totalDays += calendar[bsY][m];
  }
  
  totalDays += bsD - refBS.day;

  const resultAD = new Date(refAD);
  resultAD.setDate(refAD.getDate() + totalDays);
  
  return {
    adYear: resultAD.getFullYear(),
    adMonth: resultAD.getMonth() + 1,
    adDay: resultAD.getDate(),
    adDayName: englishDays[resultAD.getDay()],
    bsMonthName: nepaliMonths[bsM - 1],
    fullDate: resultAD.toDateString()
  };
}

export function convertADtoBS(adY: number, adM: number, adD: number) {
  const calendar = nepaliCalendarData as Record<string, number[]>;
  const targetAD = new Date(adY, adM - 1, adD);
  
  let totalDays = Math.floor((targetAD.getTime() - refAD.getTime()) / (1000 * 60 * 60 * 24));
  
  let bsYear = refBS.year;
  let bsMonth = refBS.month;
  let bsDay = refBS.day;

  while (totalDays > 0) {
    const daysInMonth = calendar[bsYear][bsMonth - 1];
    if (totalDays >= daysInMonth) {
      totalDays -= daysInMonth;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    } else {
      bsDay += totalDays;
      totalDays = 0;
    }
  }

  return {
    bsYear,
    bsMonth,
    bsDay,
    bsMonthName: nepaliMonths[bsMonth - 1],
    adDayName: englishDays[targetAD.getDay()]
  };
}

export function getTodayInBS() {
  const today = new Date();
  return convertADtoBS(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

export function getBSMonthName(monthIndex: number) {
  return nepaliMonths[monthIndex - 1];
}

export function getNepaliDayName(dayIndex: number) {
  return nepaliDays[dayIndex];
}
