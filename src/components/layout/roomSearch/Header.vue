<template>
  <v-row
    align="center"
    class="header position-sticky top-0"
    :style="{ height: height + 'px' }"
  >
    <v-col cols="2">
      <router-link :to="{ name: 'HomePage' }" class="ml-2">
        <v-btn class="ma-2" color="orange-darken-2" @click="onClickHomeBtn">
          <v-icon icon="mdi-home" start></v-icon>
          Trang chủ
        </v-btn>
      </router-link>
    </v-col>
    <v-col cols="5" class="pt-0 pb-0 d-flex justify-center">
      <v-btn class="mr-2" variant="plain" color="black" @click="openManagePage"
        >Quản lý phòng trọ</v-btn
      >
    </v-col>

    <v-col cols="5">
      <v-sheet class="d-flex justify-end">
        <v-btn
          prepend-icon="mdi-text-box-multiple-outline"
          @click="moveToPage('PostManagement')"
          >Quản lý bài đăng</v-btn
        >

        <!-- Bài đăng yêu thích -->
        <v-btn
          density="comfortable"
          class="ml-2"
          icon="mdi-book-heart-outline"
          v-tooltip:bottom="'Bài đăng yêu thích'"
          @click="moveToPage('PostManagement', { tab: 3 })"
        />

        <!-- Thông báo -->
        <v-btn
          density="comfortable"
          class="ml-2 mr-2"
          icon="mdi-bell-outline"
          v-tooltip:bottom="'Thông báo'"
        />

        <!-- Tài khoản -->

        <v-avatar
          v-if="avatarLink"
          :image="avatarLink"
          size="36"
          class="cursor-pointer account"
          @click="moveToPage('InfoUpdating')"
        />
        <v-btn
          v-else
          class="account"
          density="comfortable"
          icon="mdi-account-circle"
          @click="moveToPage('InfoUpdating')"
        />
        <v-menu open-on-hover activator=".account">
          <v-list>
            <v-list-item
              v-for="(item, index) in menuItems.filter((x) => !x.hide)"
              :key="index"
              :value="index"
              class="cursor-pointer"
              @click="onClickMenu(item.key)"
            >
              <v-list-item-title
                ><v-icon :icon="item.icon" class="mr-2" />
                {{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          prepend-icon="mdi-note-plus-outline"
          class="ml-2 mr-4"
          color="red"
          @click="moveToPage('PostDetailPopup')"
          >Đăng bài</v-btn
        >
      </v-sheet>
    </v-col>
  </v-row>
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      :width="dialogConfig.width ?? 500"
      :prepend-icon="dialogConfig.icon"
      :title="dialogConfig.title"
      :text="dialogConfig.text"
    >
      <v-card-item>
        <v-row v-if="dialogConfig.key == featureConfig.LinkToInnkeeper.key">
          <v-col>
            <v-text-field
              clearable
              label="Số diện thoại chủ phòng"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              :autofocus="true"
              v-model="phoneNumber"
          /></v-col>
        </v-row>
      </v-card-item>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          :text="dialogConfig.btnText"
          color="orange-lighten-2"
          @click="onSubmitDialog"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from "vue";
import { useContextStore } from "../../../stores/contextStore";
import { useAppStore } from "../../../stores/appStore";
import notificationAPI from "../../../apis/notificationAPI/notificationAPI";
import { useContextAdminStore } from "../../../stores/contextAdminStore";
import Role from "../../../common/enum/Role";
import NotificationType from "../../../common/enum/NotificationType";
import { useRoomPostStore } from "../../../stores/roomSearch/roomPostStore";
import { getContext, showMessage } from "../../../common/commonFunction";

export default {
  props: {
    height: {
      type: [Number, String],
      default: "70",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const contextStore = useContextStore();
    const user = contextStore.$state.user;
    const appStore = useAppStore();
    const adminContext = useContextAdminStore();

    const featureConfig = {
      LinkToInnkeeper: {
        icon: user?.innkeeper_id ? "mdi-link-off" : "mdi-link",
        title: user?.innkeeper_id
          ? "Hủy liên kết tới chủ phòng"
          : "Liên kết tới tới chủ phòng",
        text: "Yêu cầu sẽ được gửi đến chủ trọ để chờ xác nhận",
        btnText: "Gửi yêu cầu",
        key: "LinkToInnkeeper",
      },
      MoveToAdminPage: {
        key: "MoveToAdminPage",
      },
    };

    const tabsConfig = [
      { display: "Tìm trọ" },
      { display: "Quản lý trọ" },
      { display: "Giới thiệu" },
    ];

    /**
     * @description Quản lý phòng trọ
     */
    const openManagePage = () => {
      const originLink = window.location.origin;
      const newLink = `${originLink}/dang-nhap`;
      window.open(newLink, "_blank");
    };

    const openAdminPage = () => {
      const openNewTab = () => {
        const originLink = window.location.origin;
        const newLink = `${originLink}/admin`;
        window.open(newLink, "_blank");
      };

      if (!adminContext.$state.token) {
        appStore.toggleLoginPopup();
        appStore.$state.LoginWithRole = Role.Admin;
        return;
      }

      openNewTab();
    };

    const onClickHomeBtn = () => {
      const me = proxy;
      me.$emit("onClickHomeBtn");
    };

    const moveToPage = (pageName, query = {}) => {
      const me = proxy;

      if (!contextStore.$state.token) {
        appStore.toggleLoginPopup();
        appStore.$state.moveToPageAfterLogin = pageName;
        return;
      }

      me.$router.push({ name: pageName, query });
    };

    const avatarLink = contextStore.$state.user?.user_avatar;

    const onClickMenu = (key) => {
      switch (key) {
        case featureConfig.LinkToInnkeeper.key:
          dialogConfig.value = { ...featureConfig.LinkToInnkeeper };
          showDialog.value = true;
          break;
        case featureConfig.MoveToAdminPage.key:
          openAdminPage();
          break;
      }
    };

    const phoneNumber = ref();
    const linkToInnkeeper = async () => {
      debugger;
      const payload = {
        PhoneNumber: phoneNumber.value,
      };
      try {
        const res = await useRoomPostStore().linkToInnkeeper(payload);
        if (res) {
          showMessage("Đã gửi yêu cầu đến chủ phòng!");

          const notification = {
            from_user_id: contextStore.$state.user.user_id,
            to_user_id: res.innkeeper_id,
            notification_message: `Người dùng <b>${contextStore.$state.user.user_name}</b> với số điện thoại <b>${contextStore.$state.user.phone_number}</b> muốn liên kết với tài khoản của bạn.`,
            notification_type: NotificationType.confirmation,
            notification_title: "Yêu cầu liên kết",
            notification_data: JSON.stringify({
              room_seeker_id: contextStore.$state.user.user_id,
            }),
          };
          notificationAPI.sendNotify(notification);
        } else {
          showMessage("Không tìm thấy phòng chủ phòng!", MessageType.Warning);
        }
      } catch (error) {
        console.error(error);
        showMessage("Có lỗi xảy ra!", MessageType.Error);
      }
    };

    const menuItems = ref([
      {
        title: "Quản trị bài đăng",
        icon: "mdi-shield-account-outline",
        key: featureConfig.MoveToAdminPage.key,
      },
      {
        title: "Liên kết đến chủ trọ",
        icon: "mdi-link",
        hide: !contextStore.$state.token || !contextStore.$state.user?.user_id,
        key: featureConfig.LinkToInnkeeper.key,
      },
    ]);

    const showDialog = ref(false);
    const dialogConfig = ref({
      icon: "",
      title: "",
      text: "",
      btnText: "",
      width: 500,
    });

    const onSubmitDialog = async () => {
      try {
        switch (dialogConfig.value.key) {
          case featureConfig.LinkToInnkeeper.key:
            if (!user?.innkeeper_id) {
              await linkToInnkeeper();
            } else {
              const res = await useRoomPostStore().cancelLinkToInnkeeper();
              if (res) {
                showMessage("Đã hủy liên kết tới chủ phòng!");
                delete contextStore.$state.user.innkeeper_id;
                const context = getContext();
                delete context.user.innkeeper_id;
                localStorage.set("context", JSON.stringify(context));
              }
            }
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      } finally {
        showDialog.value = false;
      }
    };

    onMounted(() => {
      window._header = proxy;
    });

    return {
      tabsConfig,
      openManagePage,
      onClickHomeBtn,
      moveToPage,
      avatarLink,
      menuItems,
      dialogConfig,
      onSubmitDialog,
      showDialog,
      onClickMenu,
      featureConfig,
      phoneNumber,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  border: 1px solid #ccc;
  margin: unset;
  z-index: 1;
  background-color: #fff;

  .tabs {
    height: 100%;
    border: 1px solid #ccc;
  }
}
</style>