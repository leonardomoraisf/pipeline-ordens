<template>
  <div>
    <div
      class="group mb-0 relative hover:cursor-pointer"
      @click="toggleModalEditStatusFunc"
    >
      <div class="flex items-center">
        <div class="flex w-full bg-gray-700"
        :class="{'h-0': status.ordem === 1, 'h-0.5': status.ordem !== 1}"></div>
        <div
          :style="{ backgroundColor: status.color }"
          class="z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
        >
          <p :style="{ color: corTextoStatus }" class="text-xl">
            {{ status.ordem }}
          </p>
        </div>
        <div class="flex w-full bg-gray-700"
        :class="{'h-0': status.ordem === pipelineStore.lastList.ordem,
        'h-0.5': status.ordem !== pipelineStore.lastList.ordem}"></div>
      </div>

      <div
        class="mt-3 h-8 max-h-8 overflow-hidden whitespace-nowrap text-ellipsis px-2"
      >
        <p
          class="text-base font-semibold text-gray-900 text-center truncate"
          v-if="status.nome.length <= 35"
        >
          {{ status.nome }}
        </p>
        <p
          class="text-base font-semibold text-gray-900 text-center truncate"
          v-tooltip.bottom="{ content: status.nome }"
          v-if="status.nome.length > 35"
        >
          {{ status.nome }}
        </p>
      </div>
    </div>

    <SideModal
      :status="status"
      :toggleModal="toggleStatusEditModal"
      @closeModal="closeModalEditStatusFunc"
      :colorStatusText="corTextoStatus"
      :animated="animated"
      ref="sideModalEdit"
      :cards="cards"
    ></SideModal>
  </div>
</template>

<script>
import SideModal from "./SideModal.vue";
import { ref } from "vue";

export default {
  name: "StatusTimeline",
  inject: ["globalStore", "pipelineStore"],
  components: {
    SideModal,
  },
  props: {
    status: Object,
    corTextoStatus: String,
    cards: Array,
  },
  data() {
    return {
      toggleStatusEditModal: ref(false),
      animated: ref(false),
    };
  },
  methods: {

    /**
     * Faz modal de editar o status aparecer ,focar no input e animar a bolinha
     */
    async toggleModalEditStatusFunc() {
      this.toggleStatusEditModal = !this.toggleStatusEditModal;
      this.animated = true;
      setTimeout(() => {
        this.animated = false;
      }, 1000);
    },

    /**
     * Fecha a modal de edição
     */
    closeModalEditStatusFunc() {
      this.toggleStatusEditModal = !this.toggleStatusEditModal;
    },
  },
};
</script>

<style scoped>
.status-circle {
  transition: all 0.2s ease;
}
</style>
