<template>
  <div>
    <div class="px-2">
      <button
        type="button"
        @click="openModal"
        class="mt-4 w-full flex justify-center items-center py-6 border-2 rounded-md border-dashed hover:cursor-pointer border-black/30 hover:border-black/50 text-black/30 hover:text-black/50 hover:scale-105 add-card"
      >
        <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-plus']" />
        <span class="font-semibold ml-1">Adicionar</span>
      </button>
    </div>

    <div
      v-if="toggleCardFormModal"
      class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center"
    >
      <div class="relative mx-auto modal-movimento">
        <div class="bg-white w-full rounded-md h-full">
          <div
            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
          >
            <h5 class="font-semibold text-xl text-gray-900/70 mr-32">
              Nova venda
            </h5>
            <button
              type="button"
              class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              @click="closeModal"
            >
              <font-awesome-icon
                class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                :icon="['fas', 'fa-close']"
              />
            </button>
          </div>
          <div class="w-full h-full">
            <div v-if="isLoadingIframe" class="flex justify-center">
              <div class="hollow-dots-spinner mt-24">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
            <iframe
              v-show="!isLoadingIframe"
              :src="frameMovimentoUrl"
              ref="iframe"
              width="100%"
              height="100%"
              @load="onLoad"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="clickCancel"
      class="absolute inset-0 z-40 opacity-25 bg-black"
    ></div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "MovimentoModalCreate",
  components: {},
  props: {
    list: Object,
    cards: Array,
    pipelinePusher: Object,
  },
  data() {
    return {
      toggleCardFormModal: ref(false),
      nomeCliente: "",
      precoMovimento: 0,
      pedidoMovimento: "",
      errorMessage: "",
      isShowingError: ref(false),
      frameMovimentoUrl: `${window.APP_URL}/app/vendas/nova-venda?pipeline=1`,
      isLoadingIframe: ref(true),
      clickCancel: ref(false),
    };
  },
  methods: {
    /**
     * Método quando o iframe é carregado
     */
    onLoad() {
      this.isLoadingIframe = !this.isLoadingIframe;
    },

    /**
     * Método para abrir a modal de criação de vendas
     */
    openModal() {
      this.clickCancel = !this.clickCancel;
      ToastCenter.fire(
        "Abrindo...",
        "Já, já você poderá criar novos cards!",
        "info"
      );
      this.axios
        .post(`${window.API_V2}/pipeline/setId`, {
          id_status_pipeline: this.list.id_status,
        })
        .then((res) => {
          if (res.data.status === true) {
            this.toggleCardFormModal = !this.toggleCardFormModal;
            Toast.fire("Prontinho!", "", "success");
          } else {
            Toast.fire(res.data.message, "...", "error");
            this.clickCancel = !this.clickCancel;
          }
        })
        .catch((err) => {
          ToastTopStart5.fire("Erro!", err.response.data.message, "error");
          this.clickCancel = !this.clickCancel;
        });
    },

    /**
     * Método para fechar a modal
     */
    closeModal() {
      this.toggleCardFormModal = !this.toggleCardFormModal;
      this.clickCancel = !this.clickCancel;
      this.isLoadingIframe = !this.isLoadingIframe;
    },
  },
};
</script>

<style scoped>
.add-card {
  transition: all 0.2s ease-in-out;
}

.modal-movimento {
  width: 60%;
  height: 60%;
  max-height: fit-content;
}

@media (max-width: 1536px) {
  .modal-movimento {
    width: 70%;
    height: 70%;
  }
}

@media (max-width: 1280px) {
  .modal-movimento {
    width: 80%;
    height: 80%;
  }
}

@media (max-width: 1024px) {
  .modal-movimento {
    width: 100%;
    height: 100%;
  }
}
</style>
