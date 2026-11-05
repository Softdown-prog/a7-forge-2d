/** Read-only time/weather projection for any UI framework. No DOM dependencies. */
import { dayNumber, displayTime } from "../sim/engine.js?v=a7a149bb38f1";
import { gameYear } from "../sim/era.js?v=a7a149bb38f1";
import { DAY_MINUTES } from "../sim/types.js?v=a7a149bb38f1";
import { GAME_LAST_MINUTE } from "../sim/mailCalendar.js?v=a7a149bb38f1";
import { weekdayName } from "../sim/campaignWeek.js?v=a7a149bb38f1";
import { futureNightClock } from "../sim/futureNightClock.js?v=a7a149bb38f1";
export function timeWeatherSnapshot(s) {
    const day = Math.max(0, Math.floor(s.totalMinutes / DAY_MINUTES));
    const night = s.nightMeetup ? futureNightClock(s.nightMeetup.fridayDay, s.nightMeetup.elapsed) : null;
    const date = String(day % 30 + 1).padStart(2, "0") + "/" +
        String(Math.floor(day % 360 / 30) + 1).padStart(2, "0") + "/" + gameYear(s);
    const rainy = s.weather === "rain", ended = s.totalMinutes >= GAME_LAST_MINUTE;
    return {
        day: night?.calendarDay ?? dayNumber(s), date: night?.date ?? date, time: displayTime(s),
        weekday: night?.weekday ?? weekdayName(day + 1), nightActive: !!night, ended,
        weather: rainy ? "Chuva" : "Tempo firme", weatherIcon: rainy ? "rain" : "sun",
        impact: rainy
            ? "A chuva reduz a procura e aumenta a chance de interrupções na conexão."
            : "Sem penalidade de chuva na procura; a conexão ainda pode apresentar falhas.",
        outlook: ended
            ? "Campanha concluída. Não há novos dias no calendário."
            : "O tempo de amanhã só será definido quando o próximo dia começar."
    };
}
