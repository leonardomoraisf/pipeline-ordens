<template>
  <div class="shrink-0 2xl:p-4 p-2 flex justify-between space-x-1 2xl:block">
    <button
      class="hover:scale-125 transition-all lg:float-left"
      v-tooltip.bottom="'Voltar'"
    >
      <a href="/app/vendas/nova-venda" class="text-base font-semibold"
        ><font-awesome-icon class="w-8 h-8" :icon="['fas', 'fa-arrow-left']"
      /></a>
    </button>

    <div class="flex flex-col align-middle items-center">
      <h1 class="text-2xl text-black font-bold">
        Pipeline - Fluxo de trabalho
      </h1>
    </div>

    <button
      class="block 2xl:hidden float-right"
      @click="toggleMenu = !toggleMenu"
      :class="{ invisible: toggleMenu }"
    >
      <font-awesome-icon class="w-10 h-10" :icon="['fas', 'fa-bars']" />
    </button>

    <transition name="menu">
      <div
        class="z-40 overflow-x-hidden overflow-y-auto flex justify-center items-center fixed top-4 right-4 w-fit 2xl:hidden"
        v-if="toggleMenu"
      >
        <div class="relative mx-auto w-full">
          <div class="w-full rounded-md">
            <button class="float-right" @click="toggleMenu = !toggleMenu">
              <font-awesome-icon
                class="w-10 h-10"
                :icon="['fas', 'fa-close']"
              />
            </button>
            <div
              class="shrink-0 flex justify-center bg-gray-200 px-4 py-3 container mx-auto rounded-md"
            >
              <input
                class="shadow appearance-none border rounded w-full py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
                v-model="filter"
                type="text"
                placeholder="Filtre por nome do status"
                @input="avisoInput"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        class="fixed top-2 right-2 hidden 2xl:block"
        v-if="globalStore.isRequestingOfQueue"
        v-tooltip.bottom-start="'Não feche a página! Fazendo mudanças...'"
      >
        <div class="half-circle-spinner">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
        </div>
      </div>
    </transition>

    <div
      class="shrink-0 2xl:flex justify-center bg-white container mx-auto hidden mt-2"
    >
      <input
        class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
        v-model="filter"
        type="text"
        placeholder="Filtre por nome do status"
        @input="avisoInput"
      />
    </div>
  </div>
</template>

<script>
import { useGlobalStore } from "@/stores/globalStore";

export default {
  name: "Header",
  data() {
    return {
      globalStore: useGlobalStore(),
      filter: "",
      toggleMenu: false,
    };
  },
  methods: {
    /**
     * Método para avisar que a filtragem por status está inativa temporariamente
     */
    avisoInput() {
      ToastTopStart5.fire(
        "Opa!",
        "A filtragem por status está inativa temporariamente!",
        "info"
      );
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-enter-active,
.menu-leave-active {
  transition: transform 0.5s ease-in-out;
}

.menu-enter,
.menu-leave-to {
  transform: translateX(100%);
}
</style>
