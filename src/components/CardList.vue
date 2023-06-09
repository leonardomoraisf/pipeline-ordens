<template>
  <div>
    <StatusTimeline
      :status="status"
      :corTextoStatus="corTextoStatus"
      :cards="cards"
    />

    <div class="text-center">
      <p class="text-xl font-semibold text-gray-500">{{ cards.length }}</p>
    </div>

    <MovimentoModalCreate :status="status" class="px-2" />

    <div class="flex flex-col overflow-hidden mt-4 px-2">
      <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
        <draggable
          v-model="cards"
          class="pb-24 h-full draggable pt-2 space-y-3"
          v-bind="dragOptions"
          @change="onChange"
          tag="ul"
          ref="list"
          :move="onMove"
        >
          <CardListItem
            v-for="card in cards"
            :key="card.id_card"
            :card="card"
            :colorStatus="status.color"
            :corTextoCard="corTextoStatus"
            :isToInactive="false"
            @openModalEditComments="toggleModalEditComments"
          />
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import MovimentoModalCreate from "./MovimentoModalCreate.vue";
import CardListItem from "./CardListItem.vue";
import { nextTick } from "vue";
import StatusTimeline from "./StatusTimeline.vue";
import ModalEditCardComments from "./ModalEditCardComments.vue";
import { globalHelper } from "@/helpers/global";
import { pipelineHelper } from "@/helpers/pipeline";
import apiService from "@/services/apiService";

export default {
  name: "CardList",
  inject: ["globalStore", "pipelineStore"],
  components: {
    draggable,
    MovimentoModalCreate,
    CardListItem,
    StatusTimeline,
    ModalEditCardComments,
  },
  props: {
    status: Object,
  },
  data() {
    return {
      cards: this.status.cards.map((card) => {
        return {
          ...card,
          fixed: false,
          timer: 60,
        };
      }),
      corTextoStatus: "",
      isShowingModalEditComments: false,
      cardIsEditing: {},
    };
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
  mounted() {
    this.corTextoStatus = globalHelper.ajustarCorTexto(this.status.color);
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },

    /**
     * Método chamado para abrir a modal de edição de comentários de um card que está na lista
     * para transformar o card em inativo
     * @param {Object} card
     */
    async toggleModalEditComments(card) {
      this.isShowingModalEditComments = !this.isShowingModalEditComments;
      this.cardIsEditing = card;

      if (this.isShowingModalEditComments === true) {
        await nextTick();
        this.$refs.modalEditCommentsRef.$refs.textareaRef.focus();
      }
    },

    /**
     * Método que é acionado quando um movimento/card é criado
     * @param {Object} novoCard
     */
    async onCardCreated(novoCard) {
      let cardIndex = this.cards.findIndex(
        (obj) => obj.id_card === novoCard.id_card
      );
      if (cardIndex !== -1) return;

      this.cards.push(novoCard);
      await this.organizaListaCards();

      await nextTick();

      const childrenList = this.$refs.list.$children;
      const childrenIndex = childrenList.findIndex(
        (obj) => obj.card.id_card === novoCard.id_card
      );
      const element = childrenList[childrenIndex].$el;

      pipelineHelper.animaElementAparecendo(element);
    },

    /**
     * Método para verificar se o card possui timer e se ele está 0
     * se sim, remove o card
     * @param {Object} card
     */
    verificaTimerCard(card) {
      if (card.timer === 0) {
        const index = this.cards.findIndex(
          (obj) => obj.id_card === card.id_card
        );
        this.cards.splice(index, 1);
        this.pipelineStore.updateListInactive = true;
        setTimeout(() => (this.pipelineStore.updateListInactive = false), 1);
        return true;
      }
      return false;
    },

    /**
     * Método que é acionado quando acontece alguma mudança de status ou posição de cards do componente draggable
     * @param {Event} e
     */
    async onChange(e) {
      const item = e.added || e.moved;
      if (!item) return;

      var index =
        item.newIndex !== -1
          ? item.newIndex
          : this.cards.findIndex((obj) => obj.id_card === item.element.id_card);
      if (index === -1) {
        ToastTopEnd5.fire("Erro!", "Houve um erro ao mover o card!", "error");
        return;
      }

      const prevCard = this.cards[index - 1];
      const nextCard = this.cards[index + 1];
      var card = this.cards[index];

      let event = "client-card-editado";

      let result = this.verificaTimerCard(card);
      if (result === true) return;

      let posicao = card.posicao;

      if (prevCard && nextCard) {
        posicao = (prevCard.posicao + nextCard.posicao) / 2;
      } else if (prevCard) {
        posicao = prevCard.posicao + prevCard.posicao / 2;
      } else if (nextCard) {
        posicao = nextCard.posicao / 2;
      }

      if (card.id_status !== this.status.id_status) {
        card.data_hora_registro = `${this.globalStore.actualDateFormatted}T00:00:00`;
        event = "client-card-editado-status";
      }

      card.id_status = this.status.id_status;
      card.posicao = posicao;
      card.fixed = true;

      const body = {
        id_status: this.status.id_status,
        posicao: posicao,
        ativo: 1,
        comentarios: card.comentarios,
      };

      var data = {
        card: {
          ...card,
          fixed: true,
        },
      };
      this.pipelineStore.triggerPusher(event, data);

      this.globalStore.addNewRequest(() => {
        return this.axios
          .put(`${window.API_V2}/pipeline/cards/${card.id_card}/edit`, body)
          .then((res) => {
            card.fixed = false;
            data.card.fixed = false;
            this.pipelineStore.triggerPusher("client-card-editado", data);
          });
      });
    },

    /**
     * Organiza a lista dos cards de acordo com a sua posição
     */
    organizaListaCards() {
      this.cards.sort((a, b) => a.posicao - b.posicao);
    },

    /**
     * Método que verifica se o id_status do card é igual ao dessa lista e adiciona o card
     * @param {Object} newCard
     */
    verificaAdicionaCard(newCard) {
      if (newCard.id_status === this.status.id_status) {
        const cardIndex = this.cards.findIndex(
          (obj) => obj.id_card === newCard.id_card
        );
        if (cardIndex !== -1) return;

        this.onCardCreated(newCard);
      }
    },

    /**
     * Método assíncrono para chamar o método verificaAdicionaCard
     * @param {Object} newCard
     */
    async addNewCard(newCard) {
      await this.verificaAdicionaCard(newCard);
    },

    /**
     * Método assíncrono que verifica o card recebido do pusher que alterou de status
     * @param {Object} editedCard
     */
    async verificaEditedCardStatus(editedCard) {
      // Procura card na lista pelo seu id
      const cardIndex = await this.cards.findIndex(
        (obj) => obj.id_card === editedCard.id_card
      );

      // Se existe na lista com o mesmo id_card
      if (cardIndex !== -1) {
        const card = await this.cards[cardIndex];

        // Se alterou o status procura o element na lista, anima o sumiço e remove da lista
        if (editedCard.id_status !== card.id_status) {
          // anima o card sumindo
          const childrenList = await this.$refs.list.$children;
          const childrenIndex = await childrenList.findIndex(
            (obj) => obj.card.id_card === editedCard.id_card
          );
          const element = await childrenList[childrenIndex].$el;

          await new Promise((resolve) => {
            pipelineHelper.animaElementSumindo(element, resolve);
          });

          await this.cards.splice(cardIndex, 1);
          this.pipelineStore.newCard = editedCard;
          return;
        } else if (editedCard.id_status === card.id_status) return;
      }
    },

    /**
     * Método assíncrono que altera informações ou posição de um card
     * @param {Object} editedCard
     */
    async verificaEditedCard(editedCard) {
      // Procura card na lista pelo seu id
      var cardIndex = this.cards.findIndex(
        (obj) => obj.id_card === editedCard.id_card
      );

      // Se existe e continua ativo apenas altera a informação e organiza a lista
      if (cardIndex !== -1 && editedCard.ativo === 1) {
        await this.$set(this.cards, cardIndex, editedCard);
        this.organizaListaCards();
        return;
      }

      // Se existe na lista mas agora está inativo, anima sumindo e o remove da lista
      if (cardIndex !== -1 && editedCard.ativo === 0) {
        // Se existe na lista mas o ativo é 0, o card tem que sumir
        ToastTopEnd5.fire(
          "Opa!",
          `O card ${this.pipelineStore.tiposMovimento[editedCard.tipo]}(${
            editedCard.id_movimento
          }) foi inativado!`,
          "info"
        );

        // anima o card sumindo
        const childrenList = await this.$refs.list.$children;
        const childrenIndex = await childrenList.findIndex(
          (obj) => obj.card.id_card === editedCard.id_card
        );
        const element = await childrenList[childrenIndex].$el;

        await new Promise((resolve) => {
          pipelineHelper.animaElementSumindo(element, resolve);
        });

        await this.cards.splice(cardIndex, 1);
        return;
      }

      // Se não existe na lista, mas está ativo e com o mesmo id_status, emite o card como reativado, para chamar
      // a função de adicionar o card
      if (
        cardIndex === -1 &&
        editedCard.ativo === 1 &&
        editedCard.id_status === this.status.id_status
      ) {
        let result = await this.pipelineStore.verificaCardInToInactive(
          editedCard.id_card
        );
        if (result) return;

        ToastTopEnd5.fire(
          "Opa!",
          `O card ${this.pipelineStore.tiposMovimento[editedCard.tipo]}(${
            editedCard.id_movimento
          }) foi reativado!`,
          "info"
        );

        this.pipelineStore.newCard = editedCard;
        await this.verificaAdicionaCard(editedCard);
        return;
      }
    },

    async removeCard(card) {
      // Procura card na lista pelo seu id
      const cardIndex = await this.cards.findIndex(
        (obj) => obj.id_card === card.id_card
      );

      // anima o card sumindo
      const childrenList = await this.$refs.list.$children;
      const childrenIndex = await childrenList.findIndex(
        (obj) => obj.card.id_card === card.id_card
      );
      const element = await childrenList[childrenIndex].$el;

      await new Promise((resolve) => {
        pipelineHelper.animaElementSumindo(element, resolve);
      });

      this.cards.splice(cardIndex, 1);
    },
  },
  watch: {
    "status.color": function (newValue, oldValue) {
      this.corTextoStatus = globalHelper.ajustarCorTexto(newValue);
    },

    /**
     * Método para escutar o card recebido pelo canal new-cards e adicioná-lo na lista
     * @param {Object} newCard
     * @param {Object} oldCard
     */
    "pipelineStore.newCard"(newCard, oldCard) {
      this.addNewCard(newCard);
    },

    /**
     * Método para escutar o card recebido pelo canal edited-card e mudar as informações do card na lista
     * @param {Object} newEditedCard
     * @param {Object} oldEditedCard
     */
    "pipelineStore.editedCard"(newEditedCard, oldEditedCard) {
      this.pipelineStore.addNewFunc(() => {
        this.verificaEditedCard(newEditedCard);
      });
    },

    /**
     * Método para escutar o card recebido pelo canal edited-card-status e mudar as mandar para alterar sua posição
     * emite para o componente pai, colocar em uma fila para as animações funcionarem perfeitamente
     * @param {Object} newEditedCard
     * @param {Object} oldEditedCard
     */
    "pipelineStore.editedCardStatus"(newEditedCardStatus, oldEditedCardStatus) {
      this.pipelineStore.addNewFunc(() => {
        return this.verificaEditedCardStatus(newEditedCardStatus);
      });
    },

    "pipelineStore.lastEditedCard": function (newEditedCard, oldEditedCard) {
      this.cards.forEach((card) => {
        if (card.id_card === newEditedCard.id_card) {
          card.comentarios = newEditedCard.comentarios;
        }
      });
    },

    "pipelineStore.editedCardWAction": async function (newCard, oldCard) {
      if (newCard.acao === "removed" || newCard.acao === "mobileRemoved") {
        if (newCard.id_status !== this.status.id_status) return;

        this.pipelineStore.addNewFunc(async () => {
          await this.onCardCreated(newCard);
        });
      }
      if (newCard.acao === "added" || newCard.acao === "mobileAdded") {
        if (newCard.id_status !== this.status.id_status) return;

        this.pipelineStore.addNewFunc(async () => {
          await this.removeCard(newCard);
        });
      }
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

.cards-scrollbar {
  behavior: smooth;
}

.draggable {
  behavior: smooth;
}

.cards-scrollbar:hover::-webkit-scrollbar {
  width: 5px;
}

.status-circle {
  transition: all 0.2s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: opacity 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out;
}

.modal-slide-enter,
.modal-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.input-color {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  cursor: pointer;
}

.input-color::-webkit-color-swatch {
  border-radius: 50%;
}

.input-color::-moz-color-swatch {
  border-radius: 50%;
}
</style>
