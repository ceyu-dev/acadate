interface CalendarPeriod {
    title: String
    start: string
    end: string
}
interface Calendar {
    title: String,
    terms: CalendarPeriod[]
    breaks: CalendarPeriod[]
}

const isDateInRange = (date: Date, rangeStart: Date, rangeEnd: Date): boolean => {
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
    const response = await fetch("https://raw.githubusercontent.com/yuans-dev/academic-calendar-json/refs/heads/main/calendars.json");
    const calendars: Calendar[] = await response.json();
    return calendars;
}
function getCalendarColor(calendar: Calendar) {
    switch (calendar.title) {
        case "Mapua University":
            return "#f56969";
        case "Far Eastern University":
            return "#84c779";
        default:
            return "#3761df";
    }
}

export { getCalendars, getCalendarColor, getDatesInRange, formatDate, isDateInRange }