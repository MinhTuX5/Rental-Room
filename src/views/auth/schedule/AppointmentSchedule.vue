<template>
  <v-container>
    <!-- <calendar /> -->
    <v-calendar
      ref="calendar"
      v-model="today"
      :events="events"
      color="primary"
      type="month"
    >
      <template #event="{ ...args }">
        <v-btn id="okla" @click="console.log(args)">okla</v-btn>
      </template>
    </v-calendar>
    <v-menu activator="#okla">
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar color="primary" dark>
          <v-btn icon>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-toolbar-title>Title</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-favorite</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title primary-title>
          <span>Titl</span>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="secondary"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
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