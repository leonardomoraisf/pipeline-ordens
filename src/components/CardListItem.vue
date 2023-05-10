<template>
  <li
    class="drag-card"
    :class="{
      'card-list': !inModalEditComments && !inInativeCardList,
      flex: inInativeCardList,
    }"
  >
    <div
      :style="{ backgroundColor: colorStatus }"
      class="group relative p-2 shadow rounded-md text-left"
      :class="{ 'w-3/5': inInativeCardList }"
    >
      <div
        class="h-fit flex flex-col justify-between"
        :class="{
          'hover:cursor-grab': !inInativeCardList && !inModalEditComments,
          'h-28': inativeCardsList
        }"
        :style="{ color: corTextoCard }"
      >
        <div
          class="absolute top-3 right-3"
          v-if="
            inInativeCardList &&
            existeStatus &&
            !statusInativo &&
            card.movimento_ativo === 1
          "
        >
          <button
            class="text-base text-black font-semibold bg-white hover:scale-105 hover:text-green-500 hover:bg-gray-200 p-1 rounded-md transition-all"
            @click="$emit('turnCardActive', card)"
          >
            Reativar
          </button>
        </div>

        <div
          v-if="(inInativeCardList && !existeStatus) || statusInativo &&
            card.movimento_ativo === 1"
          class="absolute top-2 right-2 flex flex-col gap-1"
        >
          <button
            @click="deleteCard"
            class="text-base text-black font-semibold bg-white hover:text-red-500 hover:scale-105 hover:bg-gray-200 p-1 rounded-md transition-all"
          >
            Deletar
          </button>
          <button
            class="text-base text-black font-semibold bg-white hover:scale-105 hover:text-green-500 hover:bg-gray-200 p-1 rounded-md transition-all"
            @click="$emit('turnCardActive', card)"
            v-tooltip.bottom="
              'Se reativar esse card, ele voltará para o status 1!'
            "
          >
            Reativar
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
            <b>Status<span v-if="statusInativo"> inativo</span>:</b>
            {{ card.statusName }}
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
          v-tooltip="'Quando o tempo acabar, o card será finalizado!'"
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
                  v-if="
                    card.comentarios === null || card.comentarios.length === 0
                  "
                >
                  chat_bubble
                </span>
                <span
                  class="material-symbols-filled opacity-70 pt-2"
                  v-if="
                    card.comentarios !== null && card.comentarios.length > 0
                  "
                >
                  chat_bubble
                </span>
              </button>
            </div>

            <div v-if="!inInativeCardList">
              <div
                v-if="diferencaDias !== 0 || diferencaDiasTotal !== 0"
                class="w-12 h-6 rounded-md text-center"
                :class="{
                  'bg-green-600': diferencaDias >= 0 && diferencaDias < 3,
                  'bg-rose-600': diferencaDias >= 3,
                }"
                v-tooltip.bottom="'Dias no status/Dias no pipeline'"
              >
                <span class="text-white font-semibold">{{
                  diferencaDias
                }}</span>
                <span class="text-white font-semibold"
                  >/{{ diferencaDiasTotal }}d</span
                >
              </div>

              <div
                v-if="diferencaDias === 0 && diferencaDiasTotal === 0"
                class="w-12 h-6 rounded-md text-center bg-green-600"
              >
                <span class="text-white font-semibold">Hoje</span>
              </div>
            </div>

            <div
              v-if="inInativeCardList"
              class="w-fit rounded-md text-center"
              v-tooltip.bottom="'Dias no pipeline'"
            >
              <span class="font-semibold"
              :class="{color: corTextoCard}"
                >{{ diferencaDiasTotal }}d</span
              >
            </div>
          </div>

          <div class="text-ellipsis overflow-hidden">
            <p class="font-normal truncate">R$ {{ valorFormatado }}</p>
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
              class="bg-rose-500 rounded-md hover:bg-rose-400 hover:scale-105 p-2 transition-all text-white font-semibold"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="inInativeCardList" class="w-2/5">
      <div
        class="flex flex-col text-left p-2 justify-center h-full overflow-hidden"
      >
        <div class="text-sm">
          <div class="flex space-x-2">
            <p class="truncate text-base break-all">Finalizado em</p>

            <div
              class="w-12 min-w-fit h-fit rounded-md text-center"
              :class="{
                'bg-green-600':
                  diferencaDiasFinalizado >= 0 && diferencaDiasFinalizado < 5,
                'bg-rose-600': diferencaDiasFinalizado >= 5,
              }"
            >
              <span
                class="text-white font-semibold"
                v-if="diferencaDiasFinalizado <= 1"
                >{{ diferencaDiasFinalizado }} dia</span
              >
              <span
                class="text-white font-semibold"
                v-if="diferencaDiasFinalizado > 1"
                >{{ diferencaDiasFinalizado }} dias</span
              >
            </div>
          </div>

          <table>
            <tr>
              <td>Início:</td>
              <td>{{ diaCard }}, {{ dataHoraCard }}</td>
            </tr>
            <tr>
              <td>Fim:</td>
              <td>{{ diaLog }}, {{ dataHoraLog }}</td>
            </tr>
          </table>
        </div>
        <div>
          <p class="truncate w-full break-all">{{ cardLog.nome_pessoa }}</p>
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
      default: false,
    },
    tiposMovimento: Object,
    pusherSessionID: Number,
  },
  data() {
    return {
      errorMessage: "",
      isShowingError: ref(false),
      celular: "",
      valorFormatado: String(parseFloat(this.card.valor.toFixed(2))).replace(
        ".",
        ","
      ),
      diferencaDias: 0,
      toggleModal: ref(false),
      diferencaDiasTotal: 0,
      circles: [
        {
          id: "1",
          steps: 60,
          size: 45,
          value: 60,
          stepLength: -1,
          label: "segundos",
          dependentCircles: ["1"],
        },
      ],
      isDeleting: ref(false),
      cardLog:
        this.card.log === null || this.card.log === undefined
          ? ""
          : JSON.parse(this.card.log)[0],
      dataHoraLog: "",
      diaLog: "",
      diaCard: "",
      dataHoraCard: "",
      diferencaDiasFinalizado: 0,
    };
  },
  methods: {
    /**
     * Método para deletar o card, caso seu status esteja inativo
     */
    deleteCard() {
      this.isDeleting = true;
      this.axios
        .delete(`${window.API_V2}/pipeline/cards/${this.card.id_card}/delete`)
        .then((res) => {
          this.isDeleting = false;
          this.$emit("cardDeleted", this.card);
          ToastTopStart5.fire("Sucesso!", res.data.message, "success");
        })
        .catch((err) => {
          this.isDeleting = true;
          ToastTopStart5.fire("Erro!", err.response.data.message, "error");
        });
    },

    /**
     * Método que calcula a diferença de dias que o card está no status e no pipeline
     */
    calculaDiferencaDias() {
      let dataHoje = new Date(this.dataHoje);

      let dataCard = new Date(this.card.data_hora_registro.substring(0, 10));
      let diferenca = Math.abs(dataHoje.getTime() - dataCard.getTime());
      let dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

      let dataCardTotal = new Date(
        this.card.data_hora_cadastro.substring(0, 10)
      );
      let diferencaTotal = Math.abs(
        dataHoje.getTime() - dataCardTotal.getTime()
      );
      let diasTotal = Math.ceil(diferencaTotal / (1000 * 60 * 60 * 24));

      this.diferencaDias = dias;
      this.diferencaDiasTotal = diasTotal;
    },

    /**
     * Método chamado após 60 segundos que o card está na lista para inativo
     * ele emite um evento para ser colocado como inativo e um evento de nova requisição
     */
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
        pusherSessionID: this.pusherSessionID,
      };

      let card = { ...this.card, ativo: 0 };

      this.$emit("putCardToInative", card);
      this.$emit("newRequest", () => {
        return this.axios.put(
          `${window.API_V2}/pipeline/cards/${card.id_card}/edit`,
          body
        );
      });
    },

    calculaInfosInInativeCardList() {
      let diasDaSemana = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];

      var dataHoraLog = new Date(this.cardLog.data_hora_cadastro);
      var diaDaSemanaHoraLog = diasDaSemana[dataHoraLog.getDay()];
      this.diaLog = diaDaSemanaHoraLog;

      const diaHoraLog = dataHoraLog.getDate();
      const mesHoraLog = dataHoraLog.getMonth() + 1;
      const anoHoraLog = dataHoraLog.getFullYear();
      const dataFormatadaHoraLog =
        diaHoraLog + "/" + mesHoraLog + "/" + anoHoraLog;
      const horaHoraLog = dataHoraLog.toLocaleTimeString();
      const dataHoraFormatadasHoraLog =
        dataFormatadaHoraLog + " | " + horaHoraLog;
      this.dataHoraLog = dataHoraFormatadasHoraLog;

      var dataHoraCard = new Date(this.card.data_hora_cadastro);
      var diaDaSemanaHoraCard = diasDaSemana[dataHoraCard.getDay()];
      this.diaCard = diaDaSemanaHoraCard;

      const diaHoraCard = dataHoraCard.getDate();
      const mesHoraCard = dataHoraCard.getMonth() + 1;
      const anoHoraCard = dataHoraCard.getFullYear();
      const dataFormatadaHoraCard =
        diaHoraCard + "/" + mesHoraCard + "/" + anoHoraCard;
      const horaHoraCard = dataHoraCard.toLocaleTimeString();
      const dataHoraFormatadasHoraCard =
        dataFormatadaHoraCard + " | " + horaHoraCard;
      this.dataHoraCard = dataHoraFormatadasHoraCard;

      let diferencaFinalizado = Math.abs(
        dataHoraLog.getTime() - dataHoraCard.getTime()
      );
      let diasFinalizado = Math.ceil(
        diferencaFinalizado / (1000 * 60 * 60 * 24)
      );

      this.diferencaDiasFinalizado = diasFinalizado;
    },
  },
  mounted() {
    this.calculaDiferencaDias();

    // Pega o primeiro celular da lista de celulares da pessoa do movimento se tiver
    if (this.card.celulares !== null) {
      this.celular = this.card.celulares[0].number;
    } else if (typeof this.card.celuares === String) {
      this.celular = JSON.parse(this.card.celulares)[0].number;
    }

    // Se o card foi montado na lista de para inativo, começa a contar 60 segundos
    if (this.isToInative) {
      this.timeoutInativeCard = setTimeout(() => {
        this.cardToInative();
      }, 60000);
    }

    // Se estiver na lista de cards inativos, calcula qual o dia da semana que ele foi finalizado
    if (this.inInativeCardList) {
      this.calculaInfosInInativeCardList();
    }
  },
  beforeDestroy() {
    // Limpa o timeout se ele foi colocado como inativo ou retirado da lista para inativo
    clearTimeout(this.timeoutInativeCard);
  },
  watch: {
    /**
     * Escuta se alguma informação alterou para calcular novamente os dias
     * @param {Object} newCard
     * @param {Object} oldCard
     */
    card(newCard, oldCard) {
      this.calculaDiferencaDias();
    },
    /**
     * Escuta a informação data_hora_registro para calcular a data novamente
     * @param {String} newValue
     * @param {String} oldValue
     */
    "card.data_hora_registro": function (newValue, oldValue) {
      this.calculaDiferencaDias();
    },
  },
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
