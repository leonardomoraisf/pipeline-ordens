<template>
  <div id="app">
    <!-- O router view tem que estar no wrap do vue fragment para evitar o erro que
    começou a dar a partir da versão 1.5.2 do vue fragment, fazendo com que os cards
    sejam movidos sem erros! -->
    <fragment>
      <router-view></router-view>
    </fragment>
  </div>
</template>

<script>
import { usePipelineStore } from "@/stores/pipelineStore";
import { useGlobalStore } from "@/stores/globalStore";

export default {
  data() {
    return {
      pipelineStore: usePipelineStore(),
      globalStore: useGlobalStore(),
    };
  },
  provide() {
    return {
      pipelineStore: this.pipelineStore,
      globalStore: this.globalStore,
    };
  },
  created() {
    this.pipelineStore.setList();
    this.globalStore.startNecessary();
  },
};
</script>
