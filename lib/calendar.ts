import { act } from "react-test-renderer";
import { supabaseClient } from "./supabase";
import { getAddedUniversities } from "./user";

interface UniversityCalendar {
  university_id: number;
  university_name: string;
  university_color: string;
  calendars: YearCalendar[];
}
interface YearCalendar {
  id: number;
  year_end: number;
  year_start: number;
  terms: Period[];
  breaks: Period[];
}
interface Period {
  id: number;
  name: string;
  start: string;
  end: string;
}
interface Week {
  start: Date;
  end: Date;
}
interface ActivePeriods {
  university_id: number;
  university_color: string;
  university_name: string;
  periods: Period[];
}
interface SpecialDay {
  name: string,
  universities: { name: string, color: string }[]
  non_working_day: boolean
  date: string
}

export let specialDays: SpecialDay[] | null = null;
async function loadData() {

  if (!specialDays) {
    let { data, error } = await supabaseClient.from("special_days").select(`
      name,
      universities (
        name,
        color
    ),
    date,
    non_working_day
      `);
    specialDays = data;
  }
}
function checkIfSpecialDay(date: Date) {
  date.setHours(0);
  let s = specialDays;
  return s?.find((specialDay) => {
    let specialDayDate = new Date(specialDay.date);
    specialDayDate.setHours(0);

    if (formatDate(specialDayDate) == formatDate(date)) {

      return true;
    } else {
      return false;
    }
  });
}
function getSpecialDays(date: Date) {
  date.setHours(0);
  let s = specialDays;
  return s?.filter((specialDay) => {
    let specialDayDate = new Date(specialDay.date);
    specialDayDate.setHours(0);

    if (formatDate(specialDayDate) == formatDate(date)) {

      return true;
    } else {
      return false;
    }
  });
}

function getActiveTermsThisMonth(
  month: number,
  universityCalendars: UniversityCalendar[]
): ActivePeriods[] {
  let today = new Date();

  let activeTerms = universityCalendars.map((universityCalendar) => {
    let terms = universityCalendar.calendars.flatMap((calendar) => {
      return calendar.terms.filter((term) => {
        let termEnd = new Date(term.end);
        let termStart = new Date(term.start);
        let endMonth =
          termEnd.getMonth() +
          (termEnd.getFullYear() - today.getFullYear()) * 12;
        let startMonth =
          termStart.getMonth() +
          (termStart.getFullYear() - today.getFullYear()) * 12;

        return endMonth >= month && startMonth <= month;
      });
    });
    return {
      university_id: universityCalendar.university_id,
      university_color: universityCalendar.university_color,
      university_name: universityCalendar.university_name,
      periods: terms,
    };
  });
  return activeTerms.filter((term) => {
    return term.periods.length != 0;
  });
}
function getActiveBreaksThisMonth(
  month: number,
  universityCalendars: UniversityCalendar[]
): ActivePeriods[] {
  let today = new Date();

  let activeBreaks = universityCalendars.map((universityCalendar) => {
    let breaks = universityCalendar.calendars.flatMap((calendar) => {
      return calendar.breaks.filter((period) => {
        let periodEnd = new Date(period.end);
        let periodStart = new Date(period.start);
        let endMonth =
          periodEnd.getMonth() +
          (periodEnd.getFullYear() - today.getFullYear()) * 12;
        let startMonth =
          periodStart.getMonth() +
          (periodStart.getFullYear() - today.getFullYear()) * 12;

        return endMonth >= month && startMonth <= month;
      });
    });
    return {
      university_id: universityCalendar.university_id,
      university_color: universityCalendar.university_color,
      university_name: universityCalendar.university_name,
      periods: breaks,
    };
  });
  return activeBreaks.filter((breaks) => {
    return breaks.periods.length != 0;
  });
}
function getSchoolDays(date: Date, universityCalendars: UniversityCalendar[]) {
  return universityCalendars.filter((universityCalendar) => {
    return isSchoolDay(date, universityCalendar.calendars);
  });
}
function isSchoolDay(date: Date, calendars: YearCalendar[]) {
  const timestamp = date.getTime();

  if (checkIfSpecialDay(date)?.non_working_day) {
    return false;
  }

  return calendars.some((calendar) => {
    if (
      calendar.year_start > date.getFullYear() ||
      calendar.year_end < date.getFullYear()
    ) {
      return false;
    }


    return calendar.terms.some((term) => {
      const termStart = new Date(term.start).getTime();
      const termEnd = new Date(term.end).getTime();

      if (timestamp >= termStart && timestamp <= termEnd) {
        return !calendar.breaks.some((breakPeriod) => {
          const breakStart = new Date(breakPeriod.start).getTime();
          const breakEnd = new Date(breakPeriod.end).getTime();
          return (
            breakStart <= termEnd &&
            breakEnd >= termStart &&
            timestamp >= breakStart &&
            timestamp <= breakEnd
          );
        });
      }
      return false;
    });
  });
};

function getWeek(day: Date) {
  let start = new Date(day.getFullYear(), day.getMonth());
  let end = new Date(day.getFullYear(), day.getMonth(), 1);
  let weekday = day.getDay();
  let date = day.getDate();
  let week: Week;

  start.setDate(date - weekday);
  end.setDate(date + (6 - weekday));

  week = { start: start, end: end };
  return week;
}
function getDaysPerMonth(
  daysInMonth: number,
  startingDay: number,
  trailingDays: number
) {
  const totalDays = daysInMonth + startingDay + trailingDays;

  const daysArray = new Array(totalDays);

  for (let i = 0; i < totalDays; i++) {
    daysArray[i] = i + 1 - startingDay;
  }

  return daysArray;
}
function ZellerCongruence(month: number, year: number) {
  let startTime = performance.now();
  if (month < 3) {
    month += 12;
    year -= 1;
  }

  const K = year % 100;
  const J = Math.floor(year / 100);
  const dayOfWeek =
    (1 +
      Math.floor((13 * (month + 1)) / 5) +
      K +
      Math.floor(K / 4) +
      Math.floor(J / 4) +
      5 * J) %
    7;

  // Adjust to match JavaScript's getDay() convention (0 = Sunday, 6 = Saturday)
  let endTime = performance.now();
  console.log(`Time to compute ${endTime - startTime}`);
  return dayOfWeek;
}
const isDateInRange = (
  date: Date,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  return date >= rangeStart && date <= rangeEnd;
};
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDatesInRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return dates;
};

async function getCalendars() {
  const universities: { id: number }[] = await getAddedUniversities();
  const { data, error } = await supabaseClient
    .from("universities")
    .select(
      `
        university_id:id,
        university_name:name,
        university_color:color,
        calendars(
        year_end,
        year_start,
          id,
          terms(
            id,
            name,
            start,
            end
          ),
          breaks(
            id,
            name,
            start,
            end
          )
        )
        `
    )
    .in(
      "id",
      universities.map((university) => university.id)
    );

  return data;
}
async function getUniversitySearchResults(query: string) {
  const { data, error } = await supabaseClient
    .from("universities")
    .select("id,name, logo, color")
    .ilike("name_keywords", `%${query}%`);

  return data;
}
async function getAllUniversities() {
  const { data, error } = await supabaseClient
    .from("universities")
    .select("id,name, logo, color, calendars(id)");
  if (data) {
    console.log(data[0].calendars);
  }
  return data;
}

export {
  UniversityCalendar,
  YearCalendar,
  Period,
  ActivePeriods,
  getActiveTermsThisMonth,
  getAllUniversities,
  getUniversitySearchResults,
  getCalendars,
  getDatesInRange,
  formatDate,
  isDateInRange,
  getDaysPerMonth,
  ZellerCongruence,
  getWeek,
  isSchoolDay,
  getSchoolDays,
  getActiveBreaksThisMonth,
  loadData,
  getSpecialDays
};
