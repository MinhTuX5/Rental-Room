import { getCurrentInstance, onMounted } from "vue";
import { useDate } from 'vuetify'

export const useAppointmentSchedule = () => {
  const { proxy } = getCurrentInstance();

  const getEvents = ({ start, end }) => {
    const events = []

    const min = start
    const max = end
    const days = (max.getTime() - min.getTime()) / 86400000
    const eventCount = proxy.rnd(days, days + 20)

    for (let i = 0; i < eventCount; i++) {
      const allDay = proxy.rnd(0, 3) === 0
      const firstTimestamp = proxy.rnd(min.getTime(), max.getTime())
      const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      const secondTimestamp = proxy.rnd(2, allDay ? 288 : 8) * 900000
      const second = new Date(first.getTime() + secondTimestamp)

      events.push({
        title: proxy.titles[proxy.rnd(0, proxy.titles.length - 1)],
        start: first,
        end: second,
        color: proxy.colors[proxy.rnd(0, proxy.colors.length - 1)],
        allDay: !allDay,
      })
    }

    proxy.events = events
  }

  const getEventColor = (event) => {
    return event.color
  };

  const rnd = (a, b) => {
    return Math.floor((b - a + 1) * Math.random()) + a
  }

  onMounted(() => {
    const adapter = useDate()
      proxy.getEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
  }) 

  return {
    type: "month",
    types: ["month", "week", "day"],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { title: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
      { title: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
      { title: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { title: "Mon, Wed, Fri", value: [1, 3, 5] },
    ],
    value: [new Date()],
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    titles: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    getEventColor,
    rnd,
    getEvents
  };
};
