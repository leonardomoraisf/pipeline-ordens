<template>
  <div class="flex flex-col rounded-md py-2 max-h-full w-72">
    <!-- Essa div abaixo aparece assim que o usuário cria mais de três status,
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
    <div
      class="relative pb-8 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
      @click="toggleSideModal"
      v-if="pipelineStore.listLength > 3"
      v-tooltip.top="'Adicione um novo status'"
    >
      <div class="flex h-8 max-h-8 items-center justify-center mt-3">
        <div
          class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0"
        >
          <font-awesome-icon :icon="['fas', 'fa-plus']" />
        </div>
      </div>
    </div>

    <div
      class="relative pb-8 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
      @click="toggleSideModal"
      v-if="pipelineStore.listLength <= 3"
    >
      <div class="flex h-8 max-h-8 items-center justify-center mt-3">
        <div
          class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0"
        >
          <font-awesome-icon :icon="['fas', 'fa-plus']" />
        </div>
      </div>

      <div class="flex justify-center text-center absolute bottom-0 w-full">
        <h3 class="text-base font-semibold leading-3">
          Adicione um novo status
        </h3>
      </div>
    </div>

    <SideModal
      :status="{ id_status: 0 }"
      :toggleModal="isShowingSideModal"
      @closeModal="toggleSideModal"
      :animated="animated"
      :colorStatusText="'#FFFFFF'"
      ref="sideModalCreate"
      class="mb-4"
    >
    </SideModal>

    <div
      @click="
        pipelineStore.isShowingModalInactiveCardList =
          !pipelineStore.isShowingModalInactiveCardList
      "
      v-if="pipelineStore.listLength > 0"
      class="pb-3 hover:cursor-pointer relative h-screen flex flex-col overflow-hidden px-2 mt-36 border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50"
      v-tooltip="'Clique para visualizar os cards finalizados'"
    >
      <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
        <draggable
          v-model="pipelineStore.cardsToInactive"
          v-bind="dragOptions"
          class="space-y-3 pb-24 h-full draggable pt-2"
          ref="listInactiveRef"
          tag="ul"
          @change="onChange"
          v-if="showingCardList"
        >
          <CardListItem
            v-for="card in pipelineStore.cardsToInactive"
            :key="card.id_card"
            :card="card"
            :colorStatus="'#71717A'"
            :corTextoCard="'#FFFFFF'"
            :isToInactive="true"
            @cardToInactive="onCardToInactive"
            @deleteCard="onDeleteCard"
          />
          <div
            class="absolute inset-0 flex items-center justify-center trash"
            slot="header"
          >
            <p class="text-xl px-1">
              Para remover cards do pipeline, arraste para cá
            </p>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import CardListItem from "./CardListItem.vue";
import SideModal from "./SideModal.vue";
import { nextTick } from "vue";
import { pipelineHelper } from "@/helpers/pipeline";

export default {
  name: "CardListInactive",
  inject: ["globalStore", "pipelineStore"],
  components: {
    draggable,
    CardListItem,
    SideModal,
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "cards",
        ghostClass: "ghost",
        dragClass: "drag",
        disabled: this.$device.mobile,
        handle: ".drag-card",
      };
    },
  },
  data() {
    return {
      showingCardList: true,
      isShowingSideModal: false,
      isShowingModalInactiveCardList: false,
      animated: false,
    };
  },

  methods: {
    async onCardToInactive(card) {
      this.pipelineStore.addNewFunc(async () => {
        var cardIndex;
        this.pipelineStore.cardsToInactive.forEach((cardObj, index) => {
          if (cardObj.id_card === card.id_card) cardIndex = index;
        });

        const childrenList = this.$refs.listInactiveRef.$children;
        const childrenIndex = childrenList.findIndex(
          (obj) => obj.card.id_card === card.id_card
        );
        const element = childrenList[childrenIndex].$el;

        await new Promise((resolve) => {
          pipelineHelper.animaElementSumindo(element, resolve);
        });

        this.pipelineStore.cardsToInactive.splice(cardIndex, 1);
      });
    },

    /**
     * Método que é chamado para abrir ou fechar a modal de criação de status, ele pega a referencia do input,
     * de dentro do componente filho, faz o foco e anima a bolinha para balançar
     */
    async toggleSideModal() {
      if (this.isShowingSideModal === false) {
        this.isShowingSideModal = true;
        await nextTick();
        this.$refs.sideModalCreate.$refs.regStatusNameRef.focus();
        this.animated = true;
        setTimeout(() => {
          this.animated = false;
        }, 1000);
      } else {
        this.isShowingSideModal = false;
      }
    },

    /**
     * Método que esconde e mostra o componente draggable dos cards para inativo
     * fazendo com que ele "resete"
     */
    async resetDraggableInactiveCards() {
      this.showingCardList = false;
      setTimeout(() => {
        this.showingCardList = true;
      }, 1);
    },

    /**
     * Método para prevenir que o card com o timer em 10 volte para a lista visualmente
     * @param {Event} e
     */
    onChange(e) {
      const item = e.added || e.moved || e.removed;
      var card = item.element;
      if (e.added) {
        card.timer = 60;
        card.indexInactive = e.added.newIndex;

        let data = {
          card: {
            ...card,
            acao: "added",
          },
        };
        this.pipelineStore.triggerPusher("client-card-inativo", data);
      }
      if (e.moved) {
        card.indexInactive = e.moved.newIndex;

        if (card.timer <= 0) {
          this.pipelineStore.cardsToInactive.forEach((card, index) => {
            if (card === undefined) {
              this.pipelineStore.cardsToInactive.splice(index, 1);
            }
          });

          return this.resetDraggableInactiveCards();
        }
      }
      if (e.removed) {
        let data = {
          card: {
            ...card,
            acao: "removed",
          },
        };
        this.pipelineStore.triggerPusher("client-card-inativo", data);
      }
    },

    async onDeleteCard(idCard, msg) {
      this.pipelineStore.addNewFunc(async () => {
        let index = this.pipelineStore.inactiveCardList.findIndex((cardObj) => {
          cardObj.id_card === idCard;
        });

        await new Promise((resolve) => {
          pipelineHelper.animaElementSumindo(element, resolve);
        });

        this.pipelineStore.inactiveCardList.splice(index, 1);
      });
    },

    async addCard(card) {
      this.pipelineStore.addNewFunc(async () => {
        this.pipelineStore.cardsToInactive.push(card);
        await nextTick();

        const childrenList = this.$refs.listInactiveRef.$children;
        const childrenIndex = childrenList.findIndex(
          (obj) => obj.card.id_card === card.id_card
        );
        const element = childrenList[childrenIndex].$el;

        pipelineHelper.animaElementAparecendo(element);
      });
    },

    async removeCard(card) {
      this.pipelineStore.addNewFunc(async () => {
        // Procura card na lista pelo seu id
        const cardIndex = await this.pipelineStore.cardsToInactive.findIndex(
          (obj) => obj.id_card === card.id_card
        );

        // anima o card sumindo
        const childrenList = await this.$refs.listInactiveRef.$children;
        const childrenIndex = await childrenList.findIndex(
          (obj) => obj.card.id_card === card.id_card
        );
        const element = await childrenList[childrenIndex].$el;

        await new Promise((resolve) => {
          pipelineHelper.animaElementSumindo(element, resolve);
        });

        this.pipelineStore.cardsToInactive.splice(cardIndex, 1);
      });
    },
  },
  watch: {
    "pipelineStore.updateListInactive": function (newValue, oldValue) {
      this.resetDraggableInactiveCards();
    },
    "pipelineStore.editedCardWAction": async function (newCard, oldCard) {
      if (newCard.acao === "removed") {
        this.removeCard(newCard);
      }
      if (newCard.acao === "added") {
        this.addCard(newCard);
      }
    },

    /**
     * Método que escuta um card que teve seu comentário editado, para alterar na lista atual
     * @param {Object} newCard
     * @param {Object} oldCard
     */
    "pipelineStore.editedCard": function (newCard, oldCard) {
      this.pipelineStore.cardsToInactive.forEach((card) => {
        if (newCard.id_card === card.id_card) {
          card.comentarios = newCard.comentarios;
        }
      });
    },

    "pipelineStore.lastEditedCard": function (newEditedCard, oldEditedCard) {
      this.pipelineStore.cardsToInactive.forEach((card) => {
        if (card.id_card === newEditedCard.id_card) {
          card.comentarios = newEditedCard.comentarios;
        }
      });
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  background-color: transparent;
  width: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #aeaeae;
  border-radius: 5px;
}

.cards-scrollbar:hover::-webkit-scrollbar {
  width: 5px;
}
</style>
