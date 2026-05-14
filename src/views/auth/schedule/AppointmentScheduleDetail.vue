<template>
  <t-dynamic-popup
    :title="title"
    :width="600"
    :zIndexBase="2000"
    name="AppointmentScheduleDetail"
    class="appointment-schedule-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <v-text-field
            density="compact"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.appointment_time"
            :active="modal2"
            :focused="modal2"
            label="Thời gian hẹn"
            prepend-inner-icon="mdi-clock-time-four-outline"
            :rules="[rules.required]"
            :autofocus="true"
          >
            <v-dialog
              v-if="!viewing"
              v-model="modal2"
              activator="parent"
              width="auto"
            >
              <v-time-picker
                v-if="modal2"
                v-model="model.appointment_time"
                format="24hr"
                title="Chọn thời gian"
              ></v-time-picker>
            </v-dialog>
          </v-text-field>
        </v-col>
        <v-col class="ml-4">
          <v-text-field
            label="Ngày hẹn"
            density="compact"
            variant="outlined"
            v-model="selectedDate"
            prepend-inner-icon="mdi-calendar"
            color="blue-lighten-3"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-center">
        <v-col>
          <label> Tên người liên hệ <span class="required">*</span></label>
          <v-text-field
            density="compact"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập tên người liên hệ"
            v-model="model.to_user_name"
            :rules="[rules.required]"
            :readonly="viewing"
        /></v-col>
        <v-col class="ml-4">
          <label> Số điện thoại <span class="required">*</span></label>
          <v-text-field
            density="compact"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập số điện thoại"
            v-model="model.to_phone_number"
            :rules="[rules.required]"
            counter
            :readonly="viewing"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <label> Địa điểm </label>
          <v-text-field
            density="compact"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập địa điểm"
            :counter="255"
            v-model="model.appointment_address"
            :readonly="viewing"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <label> Ghi chú </label>
          <v-text-field
            density="compact"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Thêm ghi chú"
            :counter="255"
            v-model="model.appointment_note"
            :readonly="viewing"
          />
        </v-col>
      </v-row>
    </template>
    <!-- Chân popup -->
    <template #footer="{ close }">
      <div class="d-flex flex-row-reverse justify-space-between align-center">
        <div class="d-flex flex-row-reverse">
          <v-btn
            v-show="!viewing"
            class="ml-3"
            min-width="80"
            color="blue"
            @click="submit"
            >Lưu</v-btn
          >
          <v-btn
            v-show="!viewing"
            min-width="80"
            @click="close"
            variant="outlined"
            >Hủy</v-btn
          >
          <v-btn
            v-show="viewing"
            min-width="80"
            color="blue"
            prepend-icon="mdi-pencil"
            @click="viewing = !viewing"
            >Sửa</v-btn
          >
          <v-btn
            v-show="viewing"
            min-width="80"
            color="red"
            class="mr-4"
            prepend-icon="mdi-delete"
            @click="dialogConfig.showDialog = true"
            >Xóa</v-btn
          >
        </div>
      </div>
      <v-dialog v-model="dialogConfig.showDialog" width="auto">
        <v-card
          width="500"
          :prepend-icon="dialogConfig.icon"
          :title="dialogConfig.title"
          :text="dialogConfig.text"
        >
          <template #actions>
            <v-btn
              class="ms-auto"
              color="green"
              text="Đồng ý"
              @click="deleteItem"
            ></v-btn>
            <!-- <v-btn
              class="ms-auto"
              variant="outlined"
              text="Hủy"
              @click="dialogConfig.showDialog = false"
            ></v-btn> -->
          </template>
        </v-card>
      </v-dialog>
    </template>
  </t-dynamic-popup>
</template>

<script>
import { useAppointmentScheduleDetail } from "./appointmentScheduleDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "AppointmentScheduleDetail",
  components: {},
  setup() {
    const resource = useAppointmentScheduleDetail();
    return resource;
  },
};
</script>