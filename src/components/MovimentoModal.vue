<template>
  <div>
    <div
      v-if="pipelineStore.movimentoModal.isShowingMovimentoModal"
      class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center"
    >
      <div class="relative mx-auto modal-movimento">
        <div class="bg-white w-full rounded-md h-full">
          <div
            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
          >
            <h5 class="font-semibold text-xl text-gray-900/70 mr-32">
              {{ title }}
            </h5>
            <button
              type="button"
              class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              @click="
                pipelineStore.movimentoModal.isShowingMovimentoModal =
                  !pipelineStore.movimentoModal.isShowingMovimentoModal
              "
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
              :src="pipelineStore.movimentoModal.url"
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
      v-if="pipelineStore.movimentoModal.isShowingMovimentoModal"
      class="absolute inset-0 z-40 opacity-25 bg-black"
    ></div>
  </div>
</template>

<script>
import apiService from "../services/apiService";

export default {
  name: "MovimentoModal",
  inject: ["globalStore", "pipelineStore"],
  components: {},
  data() {
    return {
      title: "",
      isLoadingIframe: true,
    };
  },
  methods: {
    /**
     * Método quando o iframe é carregado
     */
    onLoad() {
      this.isLoadingIframe = false;
    },

    /**
     * Método para abrir a modal de criação de vendas
     */
    async openModal() {
      ToastTopStart5.fire(
        "Aguarde...",
        "Já, já você poderá criar novos cards!",
        "info"
      );

      const response = await apiService.pipeline.setIdPipeline({
        id_status_pipeline: this.pipelineStore.movimentoModal.status.id_status,
      });

      if (response.error || response.trace) {
        ToastTopStart5.fire("Erro!", response.message, "error");
        this.pipelineStore.movimentoModal.isShowingMovimentoModal =
          !this.pipelineStore.movimentoModal.isShowingMovimentoModal;

        return;
      }
    },

    /**
     * Método para fechar a modal
     */
    closeModal() {
      this.pipelineStore.movimentoModal.isShowingMovimentoModal =
        !this.pipelineStore.movimentoModal.isShowingMovimentoModal;
    },
  },

  watch: {
    "pipelineStore.movimentoModal.isShowingMovimentoModal": function (
      newValue,
      oldValue
    ) {
      if (oldValue === false && newValue === true) {
        if (!this.pipelineStore.movimentoModal.isCreate) {
          this.title = "Editar";

          return;
        }

        this.title = "Adicionar";
        this.openModal();
      } else if (oldValue === true && newValue === false) {
        this.isLoadingIframe = true;
        if (this.pipelineStore.fromInactiveCardList)
          this.pipelineStore.isShowingModalInactiveCardList = true;
      }
    },
  },
};
</script>

<style scoped>
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
