<template>
  <div>
    <div
      class="group mb-0 relative hover:cursor-pointer"
      @click="toggleModalEditStatusFunc"
    >
      <div class="flex items-center" v-if="ordem === 1 && lastList.ordem !== 1">
        <div class="flex w-full h-0 bg-gray-700"></div>
        <div
          :style="{ backgroundColor: list.color }"
          class="z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
        >
          <p :style="{ color: corTextoStatus }" class="text-xl">
            {{ ordem }}
          </p>
        </div>
        <div class="flex w-full h-0.5 bg-gray-700"></div>
      </div>

      <div class="flex items-center" v-if="ordem === 1 && lastList.ordem === 1">
        <div class="flex w-full h-0 bg-gray-700"></div>
        <div
          :style="{ backgroundColor: list.color }"
          class="z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
        >
          <p :style="{ color: corTextoStatus }" class="text-xl">
            {{ ordem }}
          </p>
        </div>
        <div class="flex w-full h-0 bg-gray-700"></div>
      </div>

      <div
        class="flex items-center"
        v-if="ordem !== 1 && ordem !== lastList.ordem"
      >
        <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
        <div
          :style="{ backgroundColor: list.color }"
          class="z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
        >
          <p :style="{ color: corTextoStatus }" class="text-xl">
            {{ ordem }}
          </p>
        </div>
        <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
      </div>

      <div
        class="flex items-center"
        v-if="ordem !== 1 && ordem === lastList.ordem"
      >
        <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
        <div
          :style="{ backgroundColor: list.color }"
          class="z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
        >
          <p :style="{ color: corTextoStatus }" class="text-xl">
            {{ ordem }}
          </p>
        </div>
        <div class="sm:flex w-full h-0 bg-gray-700"></div>
      </div>

      <div
        class="mt-3 h-8 max-h-8 overflow-hidden whitespace-nowrap text-ellipsis px-2"
      >
        <p
          class="text-base font-semibold text-gray-900 text-center truncate"
          v-if="list.nome.length <= 35"
        >
          {{ list.nome }}
        </p>
        <p
          class="text-base font-semibold text-gray-900 text-center truncate"
          v-tooltip.bottom="{ content: list.nome }"
          v-if="list.nome.length > 35"
        >
          {{ list.nome }}
        </p>
      </div>
    </div>

    <SideModal
      :list="list"
      :lastList="lastList"
      :toggleModal="toggleStatusEditModal"
      @closeModal="closeModalEditStatusFunc"
      :colorStatusText="corTextoStatus"
      :animated="animated"
      ref="sideModalEdit"
      :ajustarCorTexto="ajustarCorTexto"
      @statusDeleted="onStatusDeleted"
      :cards="cards"
    ></SideModal>
  </div>
</template>

<script>
import SideModal from "./SideModal.vue";
import { ref, nextTick } from "vue";

export default {
  name: "StatusTimeline",
  components: {
    SideModal,
  },
  props: {
    list: Object,
    ordem: Number,
    corTextoStatus: String,
    lastList: Object,
    ajustarCorTexto: Function,
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
     * Método para emitir o status deletado
     * @param {Object} list
     */
    onStatusDeleted(list) {
      this.$emit("statusDeleted", list);
    },

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
