<template>
  <t-dynamic-popup
    :title="title"
    :width="800"
    name="ResidentDetail"
    class="room-category-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col class="mr-4">
          <label> Mã người thuê </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã người thuê"
            :autofocus="true"
            v-model="model[store.codeField]"
          />
        </v-col>

        <v-col>
          <label> Họ và tên </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập họ và tên"
            v-model="model[store.nameField]"
          />
        </v-col>

        <v-col class="ml-4">
          <label> Phòng </label>
          <v-autocomplete
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="allRooms"
            :item-title="roomStore.nameField"
            :item-value="roomStore.idField"
            v-model="model[roomStore.idField]"
            @update:modelValue="onSelectRoom"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mr-4">
          <label> Số điện thoại </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập số điện thoại"
            counter="10"
            maxlength="10"
            v-model="model.phone_number"
          />
        </v-col>

        <v-col class="mr-4">
          <label> Số CCCD </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập số căn cước công dân"
            v-model="model.identity_number"
          />
        </v-col>

        <v-col>
          <label>Giới tính</label>
          <v-radio-group
            class="mt-2"
            color="blue"
            hide-details
            inline
            v-model="model.resident_gender"
          >
            <v-radio label="Nam" :value="Gender.Male"></v-radio>
            <v-radio label="Nữ" :value="Gender.Female"></v-radio>
            <v-radio label="Khác" :value="Gender.Other"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row class="align-center">
        <v-col class="mr-4">
          <label>Ngày sinh</label>
          <v-text-field
            id="dob"
            variant="outlined"
            v-model="bod"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="end center"
            activator="#dob"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.resident_bod"
              hide-header
              show-adjacent-months
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="mr-4">
          <label> Nghề nghiệp </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập nghề nghiệp"
            v-model="model.resident_career"
          />
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-checkbox-btn
                label="Chủ phòng"
                color="blue"
                density="compact"
                :disabled="ownerDisable"
                v-model="model.is_owner"
              ></v-checkbox-btn>
            </v-col>
            <v-col>
              <v-checkbox-btn
                label="Tạm vắng"
                color="blue"
                density="compact"
                v-model="model.on_leave"
              ></v-checkbox-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
    <!-- Chân popup -->
    <template #footer="{ close }">
      <div class="d-flex flex-row-reverse">
        <v-btn class="ml-3" min-width="80" color="blue" @click="submit"
          >Lưu</v-btn
        >
        <v-btn min-width="80" @click="close" variant="outlined">Hủy</v-btn>
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
// resource
import { useResidentDetail } from "./residentDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "ResidentDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const resource = useResidentDetail();
    return {
      ...resource,
    };
  },
};
</script>

<style lang="scss">
</style>