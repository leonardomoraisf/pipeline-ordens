<template>
  <li class="drag-card" :class="{ 'card-list': !inModalEditComments }">
    <div
      :style="{ backgroundColor: colorStatus }"
      class="group relative p-3 shadow rounded-md border-b border-gray-300 text-left"
    >
      <div
        class="h-28 flex flex-col justify-between"
        :class="{
          'hover:cursor-grab': !inInativeCardList && !inModalEditComments,
          'hover:cursor-pointer': inInativeCardList,
        }"
        :style="{ color: corTextoCard }"
      >
        <div class="absolute top-3 right-3" v-if="inInativeCardList && existeStatus && !statusInativo && card.movimento_ativo === 1">
          <button
            class="text-base text-black font-semibold bg-white hover:scale-105 p-2 rounded-md transition-all"
            @click="$emit('turnCardActive', card)"
          >
            Reativar
          </button>
        </div>

        <div v-if="inInativeCardList && !existeStatus || statusInativo" class="absolute top-2 right-2">
          <button
            @click="deleteCard"
            class="bg-rose-500 rounded-md hover:bg-rose-400 p-2 transition-colors"
          >
            Deletar
          </button>
        </div>

        <div
          class="bg-white/50 absolute inset-0 w-full h-full z-50 grid place-content-center"
          v-if="isDeleting"
        >
          <div class="half-circle-spinner">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
          </div>
        </div>

        <div class="space-y-1 overflow-hidden whitespace-nowrap text-ellipsis">
          <p
            class="text-base px-1 w-max rounded-md truncate"
            :class="{
              'bg-black/30': corTextoCard === '#FFFFFF',
              'bg-white/30': corTextoCard === '#000000',
            }"
          >
            {{ card.nome !== null ? card.nome : "Consumidor" }}
          </p>
          <p
            class="text-xs px-1 w-max rounded-md truncate"
            :class="{
              'bg-black/30': corTextoCard === '#FFFFFF',
              'bg-white/30': corTextoCard === '#000000',
            }"
          >
            {{ celular }}
          </p>
          <p
            class="text-xs px-1 w-max rounded-md truncate"
            :class="{
              'bg-black/30': corTextoCard === '#FFFFFF',
              'bg-white/30': corTextoCard === '#000000',
            }"
          >
            {{ tiposMovimento[card.tipo] }}({{ card.id_movimento }})
          </p>
          <p v-if="inInativeCardList" class="text-base font-normal truncate">
            <b>Status<span v-if="statusInativo"> inativo</span>:</b> {{ card.statusName }}
          </p>
        </div>

        <circular-count-down-timer
          v-if="isToInative"
          class="absolute top-1 right-3"
          :circles="circles"
          :stepLength="circles.stepLength"
          :main-circle-id="circles.id || '1'"
          :fill-color="colorStatus"
          :stroke-width="3"
          :stroke-color="corTextoCard"
          :underneath-stroke-color="colorStatus"
          v-tooltip="'Quando o tempo acabar, o card será colocado como inativo!'"
        />

        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div
              v-if="!inModalEditComments"
              class="hover:scale-125 transition-transform mr-2"
            >
              <button @click.stop="$emit('openModalEditComments', card)">
                <span
                  class="material-symbols-outlined opacity-70 pt-2"
                  v-if="card.comentarios === null || card.comentarios.length === 0"
                >
                  chat_bubble
                </span>
                <span
                  class="material-symbols-filled opacity-70 pt-2"
                  v-if="card.comentarios !== null && card.comentarios.length > 0"
                >
                  chat_bubble
                </span>
              </button>
            </div>

            <div
              v-if="diferencaDias !== 0 || diferencaDiasTotal !== 0"
              class="w-12 h-6 rounded-md text-center"
              :class="{
                'bg-green-600': diferencaDias >= 0 && diferencaDias < 3,
                'bg-rose-600': diferencaDias >= 3,
              }"
              v-tooltip.bottom="'Dias no status/Dias no pipeline'"
            >
              <span class="text-white font-semibold">{{ diferencaDias }}</span>
              <span class="text-white font-semibold">/{{ diferencaDiasTotal }}d</span>
            </div>

            <div
              v-if="diferencaDias === 0 && diferencaDiasTotal === 0"
              class="w-12 h-6 rounded-md text-center bg-green-600"
            >
              <span class="text-white font-semibold">Hoje</span>
            </div>
          </div>

          <div>
            <p class="font-normal">R$ {{ valorFormatado }}</p>
          </div>
        </div>

        <div
          v-if="card.movimento_ativo === 0"
          class="invisible absolute inset-0 text-center flex items-center bg-white group-hover:visible p-3"
        >
          <p class="text-black font-semibold text-xl">
            O movimento deste card está inativo!
          </p>
          <div v-if="inInativeCardList" class="absolute top-2 right-2">
            <button
              @click="deleteCard"
              class="bg-rose-500 rounded-md hover:bg-rose-400 p-2 transition-colors text-white"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { ref, nextTick } from "vue";

export default {
  name: "CardListItem",
  components: {},
  props: {
    card: Object,
    colorStatus: String,
    corTextoCard: String,
    dataHoje: String,
    isToInative: {
      type: Boolean,
      default: false,
    },
    inModalEditComments: {
      type: Boolean,
      default: false,
    },
    inInativeCardList: {
      type: Boolean,
      default: false,
    },
    existeStatus: {
      type: Boolean,
      default: true,
    },
    statusInativo: {
      type: Boolean,
      default: false
    },
    tiposMovimento: Object
  },
  data() {
    return {
      errorMessage: "",
      isShowingError: ref(false),
      celular: "",
      valorFormatado: String(parseFloat(this.card.valor.toFixed(2))).replace(".", ","),
      diferencaDias: 0,
      toggleModal: ref(false),
      diferencaDiasTotal: 0,
      circles: [
        {
          id: "1",
          steps: 60,
          size: 45,
          value: 59,
          stepLength: -1,
          label: "segundos",
          dependentCircles: ["1"],
        },
      ],
      isDeleting: ref(false),
    };
  },
  methods: {
    deleteCard() {
      this.isDeleting = true;
      this.axios
        .delete("/v2/pipeline/cards/" + this.card.id_card + "/delete")
        .then((res) => {
          this.isDeleting = false;
          this.$emit("cardDeleted", this.card);
          ToastTopStart5.fire("Sucesso!", res.data.message, "success");
        })
        .catch((err) => {
          this.isDeleting = true;
          ToastTopStart5.fire("Erro!", res.data.message, "error");
        });
    },
    calculaDiferencaDias() {
      let dataHoje = new Date(this.dataHoje);

      let dataCard = new Date(this.card.data_hora_registro.substring(0, 10));
      let diferenca = Math.abs(dataHoje.getTime() - dataCard.getTime());
      let dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

      let dataCardTotal = new Date(this.card.data_hora_cadastro.substring(0, 10));
      let diferencaTotal = Math.abs(dataHoje.getTime() - dataCardTotal.getTime());
      let diasTotal = Math.ceil(diferencaTotal / (1000 * 60 * 60 * 24));

      this.diferencaDias = dias;
      this.diferencaDiasTotal = diasTotal;
    },
    cardToInative() {
      ToastTopStart5.fire(
        "Sucesso!",
        "O card " +
          this.tiposMovimento[this.card.tipo] +
          "(" +
          this.card.id_movimento +
          ") será colocado como inativo.",
        "success"
      );

      let body = {
        id_status: this.card.id_status,
        posicao: this.card.posicao,
        ativo: 0,
        comentarios: this.card.comentarios,
      };

      let card = { ...this.card, ativo: 0 };

      this.$emit("putCardToInative", card);
      this.axios
        .put("/v2/pipeline/cards/" + card.id_card + "/edit", body)
        .then((res) => {})
        .catch((err) => {});
    },
  },
  mounted() {
    this.calculaDiferencaDias();

    if (this.card.celulares !== null) {
      this.celular = this.card.celulares[0].number;
    } else if (typeof this.card.celuares === String) {
      this.celular = JSON.parse(this.card.celulares)[0].number;
    }

    if (this.isToInative === true) {
      this.timeoutInativeCard = setTimeout(() => {
        this.cardToInative();
      }, 3000);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutInativeCard);
  },
  watch: {
    card(newCard,oldCard){
      this.calculaDiferencaDias();
    }
  }
};
</script>

<style scoped>
.drag > div {
  transform: rotate(5deg);
}
.ghost {
  background: lightgray;
  border-radius: 6px;
}

.ghost > div {
  visibility: hidden;
}

.ghost-delete {
  opacity: 0;
}

.ghost-delete > div {
  visibility: hidden;
}

.card-list {
  transition: transform 0.2s ease !important;
}

.card-list:hover {
  transform: scale(1.05) !important;
}

.half-circle-spinner,
.half-circle-spinner * {
  box-sizing: border-box;
}

.half-circle-spinner {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  position: relative;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: white;
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: white;
  animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
