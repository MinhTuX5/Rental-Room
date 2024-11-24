<template>
  <v-container>
    <calendar />
  </v-container>
</template>

<script>
import Calendar from "@/components/base/Calendar/fullCalendar/Calendar.vue";
import { useAppointmentSchedule } from "./appointmentSchedule";

export default {
  name: "AppointmentSchedule",
  components: {
    Calendar,
  },
  setup() {
    const resource = useAppointmentSchedule();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./AppointmentSchedule";
</style>