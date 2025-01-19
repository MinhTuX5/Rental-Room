<template>
  <v-container class="appointment-schedule">
    <FullCalendar
      ref="fullCalendar"
      class="calendar"
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <v-row class="d-flex align-center pe-1 flex-sm-nowrap">
          <!-- <v-icon icon="mdi-circle-small"></v-icon> -->
          <div class="dot"></div>
          <v-btn
            variant="plain"
            class="event-btn"
            color="black"
            v-tooltip="
              `${arg.event.extendedProps.appointment_time} ${arg.event.title}`
            "
            >{{ arg.event.extendedProps.appointment_time }}
            {{ arg.event.title }}</v-btn
          >
        </v-row>
      </template>
    </FullCalendar>
  </v-container>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
// Client ID: 577142550866-gulcd7cjkjs3lpurpfkh03gdhogjs91i.apps.googleusercontent.com
// import googleCalendarPlugin from '@fullcalendar/google-calendar';
import moment from "moment";
// css
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!
import _ from "lodash";
import baseView from "../../base/baseView";
import _enum from "../../../common/enum";
import popupUtil from "../../../common/popupUtil";
import { useAppointmentScheduleStore } from "../../../stores/roomSearch/appointmentScheduleStore";

export default {
  extends: baseView,
  name: "Calendar",
  components: { FullCalendar },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useAppointmentScheduleStore();

    const selectedDate = ref();
    const handleSelect = (selectInfo) => {
      // let title = prompt("Please enter a new title for your event");
      selectedDate.value = selectInfo;
      const param = {
        editMode: _enum.Mode.Add,
        detailForm: "AppointmentScheduleDetail",
        dayInfo: selectInfo,
        appointment_date: selectInfo.start,
        options: {
          afterSubmit: addEvent,
        },
      };
      popupUtil.show(param.detailForm, param);
    };

    const addEvent = (data) => {
      let calendarApi = selectedDate.value.view.calendar;

      calendarApi.unselect(); // clear date selection

      const title = data.appointment_title;
      if (title) {
        calendarApi.addEvent({
          id: data.appointment_schedule_id,
          title,
          start: data.appointment_date, // selectInfo.startStr,
          allDay: true,
          ...data,
        });
      }
    };

    const handleEventClick = (arg) => {
      const param = {
        editMode: _enum.Mode.Update,
        detailForm: "AppointmentScheduleDetail",
        model: {
          ...arg.event.extendedProps,
        },
        options: {
          afterDelete: removeEvent,
        },
      };
      popupUtil.show(param.detailForm, param);
    };

    const removeEvent = (eventId) => {
      try {
        proxy.$refs.fullCalendar.calendar.getEventById(eventId).remove();
      } catch (error) {
        console.error(error);
      }
    };

    const calendarOptions = reactive({
      plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
      initialView: "dayGridMonth",
      themeSystem: "bootstrap5",
      timeZone: "UTC",
      dayMaxEvents: true, // allow "more" link when too many events
      weekends: true, // show Saturday, Sunday columns
      locale: "vi",
      firstDay: 1, // Sunday=0, Monday=1, Tuesday=2, etc.
      theme: "Flatly",
      headerToolbar: {
        // center: "addEventButton",
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
      moreLinkContent: function (args) {
        return "+" + args.num + " thẻ khác";
      },
      events: [],
      eventClick: handleEventClick,
      datesSet: async (config) => {
        const payload = {
          start: moment(config.start).format("YYYY-MM-DD"),
          end: moment(config.end).format("YYYY-MM-DD"),
        };
        const rs = await store.getEvents(payload);
        calendarOptions.events = rs.map((x) => ({
          id: x.appointment_schedule_id,
          title: x.to_user_name,
          start: x.appointment_date,
          allDay: true,
          ...x,
        }));
      },
    });

    onMounted(async () => {});

    return {
      calendarOptions,
      moment,
      handleEventClick,
    };
  },
};
</script>


<style lang="scss">
.appointment-schedule {
  .fc {
    .fc-header-toolbar {
      margin-bottom: 16px;
    }
  }

  .calendar {
    height: 100%;

    .fc {
      .fc-toolbar {
        margin-bottom: 16px;
      }
    }

    .fc-button-group button span::before {
      // vertical-align: unset !important;
    }

    .fc-view-harness {
      max-height: calc(-86px + 100vh);
    }

    .fc-more-link {
      width: 100%;
    }

    .fc-h-event {
      background-color: unset;
      border: unset;
      display: block;
      .fc-event-main {
        color: unset;

        .dot {
          width: 8px;
          height: 8px;
          background: green;
          border-radius: 50%;
        }

        .event-btn {
          height: fit-content;
          padding-right: unset;
          padding-left: 4px;
          font-size: 12px;

          .v-btn__content {
            overflow: hidden;
            text-overflow: ellipsis;
            justify-content: unset;
          }
        }
      }
    }
  }
}
</style>