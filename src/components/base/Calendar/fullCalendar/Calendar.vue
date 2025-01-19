<template>
  <FullCalendar
    ref="fullCalendar"
    :options="calendarOptions"
    class="calendar"
    @select="handleSelect"
  >
    <template #eventContent="arg">
      <b>{{ arg.event.title }}</b>
      <div>
        {{ moment(arg.event.start).format("HH:mm DD/MM/YYYY") }}
        {{
          arg.event.end
            ? " - " + moment(arg.event.end).format("HH:mm DD/MM/YYYY")
            : ""
        }}
      </div>
    </template>
  </FullCalendar>
</template>

<script>
import { onMounted, reactive } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import moment from "moment";
import { INITIAL_EVENTS, createEventId } from "./event-utils.js";
// css
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!
import { capitalizeWords } from "../../../../common/commonFunction.js";
import _ from "lodash";

export default {
  name: "Calendar",
  components: { FullCalendar },
  setup() {
    const handleSelect = (selectInfo) => {
      let title = prompt("Please enter a new title for your event");
      let calendarApi = selectInfo.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
      }
    };

    const calendarOptions = reactive({
      plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
      initialView: "dayGridMonth",
      initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      themeSystem: "bootstrap5",
      timeZone: "UTC",
      dayMaxEvents: true, // allow "more" link when too many events
      weekends: true, // show Saturday, Sunday columns
      locale: "vi",
      firstDay: 1, // Sunday=0, Monday=1, Tuesday=2, etc.
      theme: "Flatly",
      headerToolbar: {
        center: "addEventButton",
        left: "prev,next today",
        right: "title",
      },
      customButtons: {
        addEventButton: {
          text: "add event...",
          click: function () {
            var dateStr = prompt("Enter a date in YYYY-MM-DD format");
            var date = new Date(dateStr + "T00:00:00"); // will be in local time

            if (!isNaN(date.valueOf())) {
              // valid?
              calendar.addEvent({
                title: "dynamic event",
                start: date,
                allDay: true,
              });
              alert("Great. Now, update your database...");
            } else {
              alert("Invalid date.");
            }
          },
        },
      },
      views: {
        dayGridMonth: {},
      },
      selectable: true,
      buttonText: {
        today: "Hôm nay",
      },
      select: handleSelect,
      title: "okla",
      titleFormat: (config) => {
        return `Tháng ${config.date.month + 1} Năm ${config.date.year}`;
      },
    });

    onMounted(() => {});

    return {
      calendarOptions,
      moment,
    };
  },
};
</script>


<style lang="scss">
.calendar {
  height: 100%;

  .fc-button-group button span::before {
    // vertical-align: unset !important;
  }

  .fc-view-harness {
    max-height: calc(-158px + 100vh);
  }
}
</style>