<template>
  <t-dynamic-popup
    title="Chi tiết Hợp Đồng"
    :width="850"
    name="ContractResidentsPopup"
    class="contract-residents-popup"
    @before-open="beforeOpen"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-container class="pa-0">
        <!-- Thông tin Hợp đồng -->
        <v-card variant="outlined" class="pa-4 mb-4 border-dashed" color="blue-lighten-4">
          <v-row class="text-black">
            <v-col cols="6" sm="3" class="py-1">
              <span class="text-grey-darken-1 text-subtitle-2 d-block">Mã hợp đồng:</span>
              <span class="font-weight-bold text-subtitle-1">{{ contract.contract_code }}</span>
            </v-col>
            <v-col cols="6" sm="3" class="py-1">
              <span class="text-grey-darken-1 text-subtitle-2 d-block">Tên phòng:</span>
              <span class="font-weight-bold text-subtitle-1">{{ contract.room_name || 'N/A' }}</span>
            </v-col>
            <v-col cols="6" sm="3" class="py-1">
              <span class="text-grey-darken-1 text-subtitle-2 d-block">Ngày bắt đầu:</span>
              <span class="font-weight-bold text-subtitle-1">{{ displayedStartDate }}</span>
            </v-col>
            <v-col cols="6" sm="3" class="py-1">
              <span class="text-grey-darken-1 text-subtitle-2 d-block">Ngày kết thúc:</span>
              <span class="font-weight-bold text-subtitle-1">{{ displayedEndDate }}</span>
            </v-col>
          </v-row>
        </v-card>

        <!-- Danh sách thành viên -->
        <div class="d-flex justify-between align-center mb-2">
          <h3 class="text-h6 font-weight-bold text-blue-darken-3">Danh sách thành viên phòng</h3>
        </div>

        <v-table class="border rounded-lg overflow-hidden custom-residents-table" density="comfortable">
          <thead>
            <tr class="bg-grey-lighten-4">
              <th class="text-left font-weight-bold text-subtitle-2 text-black">Họ và tên</th>
              <th class="text-left font-weight-bold text-subtitle-2 text-black">Số CCCD</th>
              <th class="text-center font-weight-bold text-subtitle-2 text-black" style="width: 110px;">Giới tính</th>
              <th class="text-center font-weight-bold text-subtitle-2 text-black" style="width: 120px;">Vai trò</th>
              <th class="text-center font-weight-bold text-subtitle-2 text-black" style="width: 180px;">Ngày bắt đầu HĐ</th>
              <th class="text-center font-weight-bold text-subtitle-2 text-black" style="width: 180px;">Ngày kết thúc HĐ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-6 text-grey">
                <v-progress-circular indeterminate color="blue" class="mr-2" size="20"></v-progress-circular>
                Đang tải danh sách thành viên...
              </td>
            </tr>
            <tr v-else-if="residents.length === 0">
              <td colspan="6" class="text-center py-6 text-grey-darken-1 italic">
                Không có thành viên nào trong phòng này
              </td>
            </tr>
            <tr v-else v-for="res in residents" :key="res.resident_id" class="table-row-hover">
              <td class="font-weight-medium text-black">{{ res.resident_name }}</td>
              <td>{{ res.identity_number || 'N/A' }}</td>
              <td class="text-center">{{ formatGender(res.resident_gender) }}</td>
              <td class="text-center">
                <v-chip
                  :color="res.is_owner ? 'blue-darken-1' : 'grey-darken-1'"
                  size="small"
                  variant="flat"
                  class="font-weight-bold"
                >
                  {{ res.is_owner ? 'Chủ hộ' : 'Thành viên' }}
                </v-chip>
              </td>
              <!-- Ngày vào -->
              <td class="text-center">
                <div v-if="res.is_owner" class="text-grey-darken-2 font-weight-bold text-body-2 py-2">
                  {{ displayedStartDate }}
                </div>
                <div v-else class="py-1 px-1">
                  <v-text-field
                    v-model="res.arrival_date"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="blue"
                  ></v-text-field>
                </div>
              </td>
              <!-- Ngày ra -->
              <td class="text-center">
                <div v-if="res.is_owner" class="text-grey-darken-2 font-weight-bold text-body-2 py-2">
                  {{ displayedEndDate }}
                </div>
                <div v-else class="py-1 px-1">
                  <v-text-field
                    v-model="res.departure_date"
                    type="date"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="blue"
                  ></v-text-field>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-container>
    </template>

    <!-- Chân popup -->
    <template #footer="{ close }">
      <div class="d-flex justify-end pr-2">
        <v-btn min-width="90" variant="outlined" class="mr-3 border" @click="close">Hủy</v-btn>
        <v-btn min-width="90" color="blue-darken-1" class="text-white" @click="saveFEDates(close)">
          Lưu
        </v-btn>
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
import { ref, computed } from "vue";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";
import contractAPI from "@/apis/dictionaryAPI/contractAPI";
import FilterOperator from "@/common/enum/FilterOperator";
import Gender from "@/common/enum/Gender";
import { formatDate, showMessage, MessageType } from "@/common/commonFunction";

export default {
  name: "ContractResidentsPopup",
  setup() {
    const contract = ref({});
    const residents = ref([]);
    const loading = ref(false);

    const displayedStartDate = computed(() => {
      return contract.value.start_date ? formatDate(contract.value.start_date) : "N/A";
    });

    const displayedEndDate = computed(() => {
      return contract.value.end_date ? formatDate(contract.value.end_date) : "N/A";
    });

    const formatDateToInput = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().substring(0, 10);
    };

    const beforeOpen = async ($event) => {
      const params = $event.ref.params?.value;
      if (params && params.model) {
        // If it's a fee record or incomplete contract object, we fetch the full contract details
        if (params.model.contract_id && (!params.model.start_date || !params.model.end_date)) {
          loading.value = true;
          try {
            const fullContract = await contractAPI.getById(params.model.contract_id);
            if (fullContract) {
              contract.value = {
                ...params.model,
                ...fullContract,
              };
            } else {
              contract.value = params.model;
            }
          } catch (e) {
            console.error("Failed to fetch contract details:", e);
            contract.value = params.model;
          } finally {
            loading.value = false;
          }
        } else {
          contract.value = params.model;
        }

        if (contract.value.room_id) {
          await loadResidents(contract.value.room_id);
        }
      }
    };

    const loadResidents = async (roomId) => {
      loading.value = true;
      try {
        const response = await residentAPI.getPaging({
          skip: 0,
          take: 100000,
          filters: [
            {
              Field: "room_id",
              Value: roomId,
              Operator: FilterOperator.Equal,
            },
          ],
        });
        const list = response?.data ?? [];
        
        // Load FE dates from localStorage
        const storedJson = localStorage.getItem("resident_room_dates");
        const savedDates = storedJson ? JSON.parse(storedJson) : {};
        
        residents.value = list.map((res) => {
          let arrival_date = "";
          let departure_date = "";
          
          if (res.is_owner) {
            arrival_date = contract.value.start_date ? formatDateToInput(contract.value.start_date) : "";
            departure_date = contract.value.end_date ? formatDateToInput(contract.value.end_date) : "";
          } else {
            const storedVal = savedDates[res.resident_id];
            if (storedVal) {
              arrival_date = storedVal.arrival_date || "";
              departure_date = storedVal.departure_date || "";
            }
          }

          return {
            ...res,
            arrival_date,
            departure_date,
          };
        });
      } catch (error) {
        console.error("Failed to load residents:", error);
        showMessage("Không thể tải danh sách thành viên phòng", MessageType.Error);
      } finally {
        loading.value = false;
      }
    };

    const formatGender = (gender) => {
      if (gender === Gender.Male) return "Nam";
      if (gender === Gender.Female) return "Nữ";
      return "Khác";
    };

    const saveFEDates = (closePopup) => {
      try {
        const storedJson = localStorage.getItem("resident_room_dates");
        const savedDates = storedJson ? JSON.parse(storedJson) : {};
        
        residents.value.forEach((res) => {
          if (!res.is_owner) {
            savedDates[res.resident_id] = {
              arrival_date: res.arrival_date || "",
              departure_date: res.departure_date || "",
            };
          }
        });

        localStorage.setItem("resident_room_dates", JSON.stringify(savedDates));
        showMessage("Lưu thông tin thành công!", MessageType.Success);
        closePopup();
      } catch (error) {
        console.error("Failed to save resident FE dates:", error);
        showMessage("Có lỗi xảy ra khi lưu!", MessageType.Error);
      }
    };

    return {
      contract,
      residents,
      loading,
      displayedStartDate,
      displayedEndDate,
      beforeOpen,
      formatGender,
      saveFEDates,
    };
  },
};
</script>

<style scoped lang="scss">
.contract-residents-popup {
  .border-dashed {
    border-style: dashed !important;
  }
  .custom-residents-table {
    border: 1px solid #e0e0e0;
    th {
      font-size: 0.875rem !important;
      font-weight: 700 !important;
      color: #333 !important;
    }
    .table-row-hover:hover {
      background-color: #fcfcfc;
    }
  }
}
</style>
