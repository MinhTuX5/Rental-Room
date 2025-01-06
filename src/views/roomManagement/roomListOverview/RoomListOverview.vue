<template>
  <v-container class="room-list-overview">
    <v-row>
      <v-col cols="auto" v-for="(room, index) in items" :key="index" class="mr-4">
        <v-card :title="room.roomName">
          <v-card-text>
            <p>Diện tích: {{ room.roomPrice }}</p>
            <p>Trạng thái: Còn trống</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRoomManagementList } from "./roomListOverview";

export default {
  name: "RoomListOverview",
  setup() {
    const resource = useRoomManagementList();
    return resource;
  },
};
</script>

<style lang="scss">
</style>