<template>
  <div class="flex flex-col h-screen bg-white relative text-center">
    <Header></Header>

    <LoadingSkeleton v-if="pipelineStore.isRequestingList"></LoadingSkeleton>

    <main class="flex-1 overflow-hidden" v-else-if="!pipelineStore.isRequestingList">
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-x-auto 2xl:mt-2">
          <div class="inline-flex h-full items-start px-4">
            <CardList
              v-for="status in pipelineStore.list"
              v-show="pipelineStore.statusFilter.length === 0 || status.nome.toLowerCase().includes(pipelineStore.statusFilter.toLowerCase())"
              :key="status.id_status"
              :status="status"
              class="w-72 flex flex-col rounded-md max-h-full pt-2"
            />

            <CardListInactive></CardListInactive>
          </div>
        </div>
      </div>
      <vue-confirm-dialog></vue-confirm-dialog>
      <ModalEditCardComments></ModalEditCardComments>
      <ModalInactiveCardList></ModalInactiveCardList>
      <ModalCard></ModalCard>
      <MovimentoModal></MovimentoModal>
    </main>
  </div>
</template>

<script>
import Header from "./Header.vue";
import SideModal from "./SideModal.vue";
import CardList from "./CardList.vue";
import CardListInactive from "./CardListInactive.vue";
import LoadingSkeleton from "./LoadingSkeleton";
import ModalEditCardComments from "./ModalEditCardComments.vue";
import ModalInactiveCardList from "./ModalInactiveCardList.vue";
import ModalCard from "./ModalCard.vue";
import MovimentoModal from "./MovimentoModal.vue";

export default {
  name: "Board",
  inject: ["globalStore", "pipelineStore"],
  components: {
    Header,
    SideModal,
    CardList,
    CardListInactive,
    LoadingSkeleton,
    ModalEditCardComments,
    ModalInactiveCardList,
    ModalCard,
    MovimentoModal
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.5s ease-in-out;
}

.modal-enter,
.modal-leave-to {
  transform: translateX(100%);
}

::-webkit-scrollbar {
  background-color: transparent;
  width: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #aeaeae;
  border-radius: 5px;
}
</style>
