<template>
  <div>
    <StatusTimeline
      :list="list"
      :ordem="ordem"
      :corTextoStatus="corTextoStatus"
      :lastList="lastList"
      :ajustarCorTexto="ajustarCorTexto"
      @statusDeleted="$emit('statusDeleted', list)"
      :cards="cards"
    >
    </StatusTimeline>

    <div class="text-center">
      <p class="text-xl font-semibold text-gray-500">{{ cards.length }}</p>
    </div>

    <MovimentoModalCreate
      :list="list"
      :cards="cards"
      class="px-2"
      :pipelinePusher="pipelinePusher"
    >
    </MovimentoModalCreate>

    <div class="pb-3 flex flex-col overflow-hidden mt-4 px-2">
      <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
        <draggable
          v-model="cards"
          class="pb-24 h-full draggable pt-2 space-y-3"
          v-bind="dragOptions"
          @change="onChange"
          tag="ul"
          ref="list"
        >
          <CardListItem
            v-for="card in cards"
            :key="card.id_card"
            :card="card"
            :colorStatus="list.color"
            :corTextoCard="corTextoStatus"
            :dataHoje="dataHoje"
            :isToInative="false"
            @openModalEditComments="toggleModalEditComments"
            :tiposMovimento="tiposMovimento"
            :pusherSessionID="pusherSessionID"
          />
        </draggable>
      </div>
    </div>

    <ModalEditCardComments
      :cardIsEditing="cardIsEditing"
      :toggleModal="isShowingModalEditComments"
      :colorStatus="list.color"
      :corTextoCard="corTextoStatus"
      :inInativeCards="false"
      ref="modalEditCommentsRef"
      @closeModalEditComments="toggleModalEditComments"
      :dataHoje="dataHoje"
      :tiposMovimento="tiposMovimento"
      @editComment="onEditComment"
      :pusherSessionID="pusherSessionID"
    ></ModalEditCardComments>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import MovimentoModalCreate from "./MovimentoModalCreate.vue";
import CardListItem from "./CardListItem.vue";
import { ref, nextTick } from "vue";
import StatusTimeline from "./StatusTimeline.vue";
import ModalEditCardComments from "./ModalEditCardComments.vue";

export default {
  name: "CardList",
  components: {
    draggable,
    MovimentoModalCreate,
    CardListItem,
    StatusTimeline,
    ModalEditCardComments,
  },
  props: {
    list: Object,
    lastList: Object,
    ajustarCorTexto: Function,
    idEmpresa: Number,
    dataHoje: String,
    newCard: {
      type: Object,
      default: () => ({}),
    },
    editedCard: {
      type: Object,
      default: () => ({}),
    },
    editedCardStatus: {
      type: Object,
      default: () => ({}),
    },
    pipelinePusher: Object,
    tiposMovimento: Object,
    pusherSessionID: Number,
    animaElementSumindo: Function,
    ordem: Number,
  },
  data() {
    return {
      cards: ref(this.list.cards),
      corTextoStatus: "",
      isShowingModalEditComments: ref(false),
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
        disabled: false,
        handle: ".drag-card",
      };
    },
  },
  mounted() {
    this.corTextoStatus = this.ajustarCorTexto(this.list.color);
  },
  methods: {
    /**
     * Método que seta o comentário do card que teve ser comentário editado
     * @param {Object} card
     */
    onEditComment(card) {
      let cardIndex = this.cards.findIndex(
        (obj) => obj.id_card === card.id_card
      );

      if (cardIndex !== -1) {
        this.cards[cardIndex].comentarios = card.comentarios;
      }
    },

    /**
     * Método chamado para abrir a modal de edição de comentários de um card que está na lista
     * para transformar o card em inative
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
      this.organizaListaCards();

      await nextTick();

      const childrenList = this.$refs.list.$children;
      const childrenIndex = childrenList.findIndex(
        (obj) => obj.card.id_card === novoCard.id_card
      );
      const element = childrenList[childrenIndex].$el;

      element.style.transition = "all 0.5s ease";

      element.style.transform = "scale(0)";
      element.style.opacity = "0";

      setTimeout(() => {
        element.style.transform = "scale(1.02)";
        element.style.opacity = "0.8";
      }, 500);

      element.scrollIntoView({
        behavior: "smooth",
      });

      setTimeout(() => {
        element.style.transform = "scale(1)";
        element.style.opacity = "1";
      }, 1000);
    },

    /**
     * Método que é acionado quando acontece alguma mudança de status ou posição de cards do componente draggable
     * @param {Event} e
     */
    onChange(e) {
      const item = e.added || e.moved;
      if (!item) return;

      const index =
        item.newIndex !== -1
          ? item.newIndex
          : this.cards.findIndex((obj) => obj.id_card === item.element.id_card);
      if (index === -1) {
        ToastTopEnd5.fire("Erro!", "Houve um erro ao mover o card!", "error");
        return;
      }

      const prevCard = this.cards[index - 1];
      const nextCard = this.cards[index + 1];
      const card = this.cards[index];

      let posicao = card.posicao;

      if (prevCard && nextCard) {
        posicao = (prevCard.posicao + nextCard.posicao) / 2;
      } else if (prevCard) {
        posicao = prevCard.posicao + prevCard.posicao / 2;
      } else if (nextCard) {
        posicao = nextCard.posicao / 2;
      }

      if(card.id_status !== this.list.id_status){
        card.data_hora_registro = `${this.dataHoje}T00:00:00`;
      }
      card.id_status = this.list.id_status;
      card.posicao = posicao;

      const body = {
        id_status: this.list.id_status,
        posicao,
        ativo: 1,
        comentarios: card.comentarios,
        pusherSessionID: this.pusherSessionID,
      };

      this.$emit("newRequest", () => {
        return this.axios.put(`${window.API_V2}/pipeline/cards/${card.id_card}/edit`, body);
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
      if (newCard.id_status === this.list.id_status) {
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
          ToastTopEnd5.fire(
            "Opa!",
            `O card ${this.tiposMovimento[editedCard.tipo]}(${
              editedCard.id_movimento
            }) mudou de status!`,
            "info"
          );

          // anima o card sumindo
          const childrenList = await this.$refs.list.$children;
          const childrenIndex = await childrenList.findIndex(
            (obj) => obj.card.id_card === editedCard.id_card
          );
          const element = await childrenList[childrenIndex].$el;

          await new Promise((resolve) => {
            this.animaElementSumindo(element, resolve);
          });

          await this.cards.splice(cardIndex, 1);
          await this.$emit("cardInWrongList", editedCard);
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
      const cardIndex = await this.cards.findIndex(
        (obj) => obj.id_card === editedCard.id_card
      );

      // Se existe e continua ativo apenas altera a informação e organiza a lista
      if (cardIndex !== -1 && editedCard.ativo === 1) {
        ToastTopEnd5.fire(
          "Opa!",
          `O card ${this.tiposMovimento[editedCard.tipo]}(${
            editedCard.id_movimento
          }) atualizado!`,
          "info"
        );

        await this.$set(this.cards, cardIndex, editedCard);
        await this.organizaListaCards();
        return;
      }

      // Se existe na lista mas agora está inativo, anima sumindo e o remove da lista
      if (cardIndex !== -1 && editedCard.ativo === 0) {
        // Se existe na lista mas o ativo é 0, o card tem que sumir
        ToastTopEnd5.fire(
          "Opa!",
          `O card ${this.tiposMovimento[editedCard.tipo]}(${
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
          this.animaElementSumindo(element, resolve);
        });

        await this.cards.splice(cardIndex, 1);
        return;
      }

      // Se não existe na lista, mas está ativo e com o mesmo id_status, emite o card como reativado, para chamar 
      // a funcção de adicionar o card
      if (
        cardIndex === -1 &&
        editedCard.ativo === 1 &&
        editedCard.id_status === this.list.id_status
      ) {
        ToastTopEnd5.fire(
          "Opa!",
          `O card ${this.tiposMovimento[editedCard.tipo]}(${
            editedCard.id_movimento
          }) foi reativado!`,
          "info"
        );

        this.$emit('cardReativado', editedCard);
        await this.verificaAdicionaCard(editedCard);
        return;
      }
    },
  },
  watch: {
    /**
     * Escuta a cor da lista mudar para ajustar a cor do texto automaticamente
     * @param {String} novoValor
     * @param {String} valorAntigo
     */
    "list.color": function (novoValor, valorAntigo) {
      this.corTextoStatus = this.ajustarCorTexto(novoValor);
    },

    /**
     * Método para escutar o card recebido pelo canal new-cards e adicioná-lo na lista
     * @param {Object} newCard
     * @param {Object} oldCard
     */
    newCard(newCard, oldCard) {
      this.addNewCard(newCard);
    },

    /**
     * Método para escutar o card recebido pelo canal edited-card e mudar as informações do card na lista
     * @param {Object} newEditedCard
     * @param {Object} oldEditedCard
     */
    editedCard(newEditedCard, oldEditedCard) {
      this.verificaEditedCard(newEditedCard);
    },

    /**
     * Método para escutar o card recebido pelo canal edited-card-status e mudar as mandar para alterar sua posição
     * emite para o componente pai, colocar em uma fila para as animações funcionarem perfeitamente
     * @param {Object} newEditedCard
     * @param {Object} oldEditedCard
     */
    editedCardStatus(newEditedCardStatus, oldEditedCardStatus) {
      this.$emit("changeCardPos", () => {
        return this.verificaEditedCardStatus(newEditedCardStatus);
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

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
