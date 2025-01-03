<template>
  <v-col class="room-info">
    <v-card rounded="0" theme="dark" flat>
      <v-window v-model="onboarding">
        <v-window-item v-for="n in length" :key="`card-${n}`" :value="n">
          <v-card class="d-flex justify-center align-center" height="200">
            <!-- <span class="text-h2"> Card {{ n }} </span> -->
            <v-img
              color="surface-variant"
              height="200"
              src="https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg"
              cover
            />
          </v-card>
        </v-window-item>
      </v-window>

      <v-card-actions class="justify-space-between">
        <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
        <v-item-group v-model="onboarding" class="text-center" mandatory>
          <v-item
            v-for="n in length"
            :key="`btn-${n}`"
            v-slot="{ isSelected, toggle }"
            :value="n"
          >
            <v-btn
              :variant="isSelected ? 'outlined' : 'text'"
              icon="mdi-record"
              @click="toggle"
            ></v-btn>
          </v-item>
        </v-item-group>
        <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
      </v-card-actions>
    </v-card>

    <v-row>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <legend>Thông tin chung</legend>
          <v-btn
            variant="outlined"
            color="blue"
            @click="handleEdit(buttonTypes.edit)"
          >
            {{ dataConfig.roomInfo.buttonType }}
          </v-btn>
        </div>
        <div
          class="d-flex mt-4"
          v-for="info in roomInfoView"
          :key="info.title"
          :class="{
            'align-center':
              !dataConfig.roomInfo.isView && info.componentType != 'textarea',
          }"
        >
          <span class="mr-2 title">{{ info.title }}:</span>
          <span v-show="dataConfig.roomInfo.isView">{{ info.value }}</span>
          <v-textarea
            v-if="
              !dataConfig.roomInfo.isView && info.componentType == 'textarea'
            "
            :hide-details="true"
          ></v-textarea>
          <v-text-field
            v-else-if="!dataConfig.roomInfo.isView"
            :hide-details="true"
            >{{ info.value }}</v-text-field
          >
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-space-between align-center">
          <legend>Dịch vụ phòng</legend>
          <v-btn
            variant="outlined"
            color="blue"
            @click="handleEdit(buttonTypes.addAndEdit)"
          >
            {{ dataConfig.serviceInfo.buttonType }}
          </v-btn>
        </div>
        <div
          class="d-flex mt-4 align-center"
          v-for="info in serviceInfoView"
          :key="info.title"
        >
          <span class="mr-2 title">{{ info.title }}:</span>
          <span>{{ info.value }}</span>
        </div>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { useRoomInfo } from "./roomInfo";

export default {
  name: "RoomInfo",
  setup() {
    const resource = useRoomInfo();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./RoomInfo";
</style>