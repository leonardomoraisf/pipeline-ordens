<template>
  <li
    class="drag-card flex-col md:flex-row"
    :class="{
      'card-list': !inModalEditComments && !inInactiveCardList,
      flex: inInactiveCardList,
    }"
    @click.stop="openModalCard"
  >
    <div
      :style="{ backgroundColor: colorStatus }"
      class="group relative p-2 shadow rounded-md text-left h-fit"
      :class="{ 'md:w-3/5': inInactiveCardList }"
    >
      <div
        class="h-fit flex flex-col justify-between"
        :class="{
          'hover:cursor-grab': !inInactiveCardList && !inModalEditComments,
        }"
        :style="{ color: corTextoCard }"
      >
        <div
          class="absolute top-1 right-1"
          v-if="
            inInactiveCardList &&
            existeStatus &&
            !statusInativo &&
            card.movimento_ativo === 1
          "
        >
          <button
            class="2xl:text-base text-sm text-black font-semibold bg-white hover:scale-105 hover:text-green-500 hover:bg-gray-200 p-1 rounded-md transition-all"
            @click="onClickToActive"
            v-if="!alreadyClickedToActive"
          >
            Reativar
          </button>
        </div>

        <div
          v-if="
            (inInactiveCardList && !existeStatus) ||
            (statusInativo && card.movimento_ativo === 1)
          "
          class="absolute top-1 right-1 flex flex-col gap-1"
        >
          <button
            v-if="!alreadyClickedToActive"
            class="text-base text-black font-semibold bg-white hover:scale-105 hover:text-green-500 hover:bg-gray-200 p-1 rounded-md transition-all"
            @click="onClickToActive"
            v-tooltip.bottom="
              'Se reativar esse card, ele voltará para o status 1!'
            "
          >
            Reativar
          </button>
          <button
            v-if="!alreadyClickedToActive"
            @click="deleteCard"
            class="text-base text-black font-semibold bg-white hover:text-red-500 hover:scale-105 hover:bg-gray-200 p-1 rounded-md transition-all"
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

        <div class="space-y-0 2xl:space-y-1 overflow-hidden whitespace-nowrap text-ellipsis">
          <div class="flex items-center justify-between">
            <p
              class="2xl:text-base text-sm px-1 w-max rounded-md truncate"
              :class="{
                'bg-black/30': corTextoCard === '#FFFFFF',
                'bg-white/30': corTextoCard === '#000000',
              }"
            >
              {{ card.nome !== null ? card.nome : "Consumidor" }}
            </p>
            <transition name="fade">
              <div v-if="card.fixed" v-tooltip="'Atualizando...'">
                <div class="half-circle-spinner">
                  <div
                    class="circle circle-1"
                    :style="{ borderTopColor: corTextoCard }"
                  ></div>
                  <div
                    class="circle circle-2"
                    :style="{ borderBottomColor: corTextoCard }"
                  ></div>
                </div>
              </div>
            </transition>
          </div>

          <p
            class="md:text-xs text-xs px-1 w-max rounded-md truncate"
            :class="{
              'bg-black/30': corTextoCard === '#FFFFFF',
              'bg-white/30': corTextoCard === '#000000',
            }"
          >
            {{ celular }}
          </p>
          <a
            @click="showModalMovimento"
            class="text-xs px-1 w-max rounded-md truncate hover:bg-black/10 transition-all hover:cursor-pointer"
            :class="{
              'bg-black/30': corTextoCard === '#FFFFFF',
              'bg-white/30': corTextoCard === '#000000',
            }"
          >
            {{ pipelineStore.tiposMovimento[card.tipo] }}({{
              card.codigo_movimento
            }})
          </a>
          <p
            v-if="inInactiveCardList"
            class="2xl:text-base font-normal truncate text-sm"
          >
            <b>Status<span v-if="statusInativo"> inativo</span>:</b>
            {{ card.statusName }}
          </p>
        </div>

        <div
          v-if="isToInactive"
          class="absolute top-0 right-1 text-sm font-semibold flex flex-col items-center"
          v-tooltip="'Quando o tempo acabar, o card será finalizado!'"
        >
          <span class="text-lg"> {{ card.timer <= 0 ? 0 : card.timer }} </span>
          <span>segundos</span>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div
              v-if="!inModalEditComments"
              class="hover:scale-125 transition-transform mr-2"
            >
              <button @click.stop="toggleModalEditCardComments">
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

            <div v-if="!inInactiveCardList" class="2xl:text-base text-sm">
              <div
                v-if="diferencaDias !== 0 || diferencaDiasTotal !== 0"
                class="w-fit h-fit rounded-md text-center px-1"
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
                class="w-fit h-fit rounded-md text-center bg-green-600 px-1"
              >
                <span class="text-white font-semibold">Hoje</span>
              </div>
            </div>

            <div
              v-if="inInactiveCardList"
              class="w-fit rounded-md text-center 2xl:text-base text-sm px-1"
              v-tooltip.bottom="'Dias no pipeline'"
            >
              <span class="font-semibold" :class="{ color: corTextoCard }">{{
                diferencaDiasTotal === 0 ? "Hoje" : diferencaDiasTotal + "d"
              }}</span>
            </div>
          </div>

          <div class="text-ellipsis overflow-hidden">
            <p class="font-normal truncate 2xl:text-base text-sm">
              $ {{ valorFormatado }}
            </p>
          </div>
        </div>

        <div v-if="card.movimento_ativo === 0" :class="{'absolute inset-0 text-center': !inInactiveCardList}">
          <div
            v-if="!inInactiveCardList"
            class="invisible bg-white/80 w-full h-full absolute group-hover:visible flex justify-center items-center"
          >
            <p class="font-semibold text-black text-xl">
              O movimento deste card está inativo!
            </p>
          </div>
          <div
            v-if="inInactiveCardList"
            class="absolute top-0 right-0 sm:top-2 sm:right-2 flex flex-col sm:flex-row sm:gap-1 gap-0 scale-75 sm:scale-100"
          >
            <p class="font-semibold" :style="{ color: corTextoCard }">
              Movimento inativo!
            </p>
            <button
              @click="deleteCard"
              class="text-base text-black font-semibold bg-white hover:text-red-500 hover:scale-105 hover:bg-gray-200 p-1 rounded-md transition-all"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="inInactiveCardList" class="mt-1 md:mt-0">
      <div
        class="flex flex-col md:pl-2 pl-1 justify-center text-left h-full overflow-hidden"
        v-if="card.log !== null && card.log !== undefined"
      >
        <div>
          <div class="flex flex-wrap space-x-1 items-center">
            <span class="2xl:text-base text-sm">Finalizado em</span>

            <div
              class="px-1 rounded-md"
              :class="{
                'bg-green-600':
                  diferencaDiasFinalizado >= 0 && diferencaDiasFinalizado < 5,
                'bg-rose-600': diferencaDiasFinalizado >= 5,
              }"
            >
              <span
                class="text-white font-semibold 2xl:text-base text-sm"
                v-if="diferencaDiasFinalizado <= 1"
                >{{ diferencaDiasFinalizado }} dia</span
              >
              <span
                class="text-white font-semibold 2xl:text-base text-sm"
                v-if="diferencaDiasFinalizado > 1"
                >{{ diferencaDiasFinalizado }} dias</span
              >
            </div>
          </div>

          <table class="w-full truncate 2xl:text-base text-xs">
            <tr>
              <td>Início:</td>
              <td>{{ diaCard }} {{ dataHoraCard }}</td>
            </tr>
            <tr>
              <td>Fim:</td>
              <td>{{ diaLog }} {{ dataHoraLog }}</td>
            </tr>
          </table>
        </div>
        <div class="flex flex-wrap">
          <span class="2xl:text-base text-xs truncate">{{
            cardLog.nome_pessoa
          }}</span>
        </div>
      </div>

      <div v-else class="mt-1 md:mt-0">
        <div class="md:pl-2 pl-1 text-left">
          <span class="2xl:text-base text-sm">Sem resultados</span>
        </div>
      </div>
    </div>

    <div
      v-if="inInactiveCardList"
      class="block md:hidden border border-gray-500 mb-2 mt-1"
    ></div>
  </li>
</template>

<script>
import { ref } from "vue";
import apiService from "../services/apiService";

export default {
  name: "CardListItem",
  inject: ["globalStore", "pipelineStore"],
  components: {},
  props: {
    card: Object,
    colorStatus: String,
    corTextoCard: String,
    isToInactive: {
      type: Boolean,
      default: false,
    },
    inModalEditComments: {
      type: Boolean,
      default: false,
    },
    inInactiveCardList: {
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
      alreadyClickedToActive: false
    };
  },
  methods: {
    showModalMovimento() {
      if (this.isToInactive)
        return ToastTopStart5.fire(
          "Opa!",
          "Retire o card da lista de remoção para acessar a tela de edição!",
          "info"
        );

      if (this.inInactiveCardList) {
        this.pipelineStore.isShowingModalInactiveCardList = false;
        this.pipelineStore.fromInactiveCardList = true;
      } else {
        this.pipelineStore.fromInactiveCardList = false;
      }
      this.pipelineStore.movimentoModal.isCreate = false;
      this.pipelineStore.movimentoModal.url = `${window.APP_URL}/app/vendas/${this.card.id_movimento}/editar?pipeline=1`;
      this.pipelineStore.movimentoModal.isShowingMovimentoModal =
        !this.pipelineStore.movimentoModal.isShowingMovimentoModal;
    },

    toggleModalEditCardComments() {
      this.pipelineStore.editingCard = {
        ...this.card,
        colorStatus: this.colorStatus,
        corTextoCard: this.corTextoCard,
      };
      this.pipelineStore.isShowingModalEditCardComments = true;
      if (this.inInactiveCardList) {
        this.pipelineStore.isShowingModalInactiveCardList = false;
        this.pipelineStore.fromInactiveCardList = true;
      }
      if (!this.inInactiveCardList)
        this.pipelineStore.fromInactiveCardList = false;
    },

    onClickToActive() {
      this.alreadyClickedToActive = true;
      this.$emit("turnCardActive", this.card);
    },

    /**
     * Método para deletar o card, caso seu status esteja inativo
     */
    async deleteCard() {
      this.isDeleting = true;

      const response = await apiService.card.delete(this.card.id_card);
      this.isDeleting = false;

      if (response.error || response.trace) {
        ToastTopStart5.fire("Erro!", response.message, "error");

        return;
      }

      this.$emit("deleteCard", this.card.id_card, response.message);
    },

    /**
     * Método que calcula a diferença de dias que o card está no status e no pipeline
     */
    calculaDiferencaDias() {
      let dataHoje = new Date(this.globalStore.actualDateFormatted);

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
    cardToInactive() {
      ToastTopStart5.fire(
        "Sucesso!",
        "O card " +
          this.pipelineStore.tiposMovimento[this.card.tipo] +
          "(" +
          this.card.codigo_movimento +
          ") será colocado como inativo.",
        "success"
      );

      if (this.$device.mobile) {
        if (this.pipelineStore.cardToChange.id_card === this.card.id_card) {
          this.pipelineStore.isShowingModalCard = false;
        }
      }

      let body = {
        ativo: 0
      };

      let card = { ...this.card, ativo: 0 };

      this.$emit("cardToInactive", card);

      if (this.card.acao && this.card.acao === "added") return;

      apiService.card.edit(card.id_card, body);

      var data = {
        card: card,
      };
      this.pipelineStore.triggerPusher("client-card-editado", data);
    },

    calculaInfosInInactiveCardList() {
      if (this.card.log === "") return;
      let diasDaSemana = ["Dom", "Seg", "Terç", "Qua", "Qui", "Sex", "Sáb"];

      var dataHoraLog = new Date(this.cardLog.data_hora_cadastro);
      var diaDaSemanaHoraLog = diasDaSemana[dataHoraLog.getDay()];
      this.diaLog = diaDaSemanaHoraLog;

      const diaHoraLog = dataHoraLog.getDate();
      const mesHoraLog = dataHoraLog.getMonth() + 1;
      const anoHoraLog = dataHoraLog.getFullYear();
      const dataFormatadaHoraLog =
        diaHoraLog + "/" + mesHoraLog + "/" + anoHoraLog;
      const horaHoraLog = dataHoraLog.toLocaleTimeString([], {
        timeStyle: "short",
      });
      const dataHoraFormatadasHoraLog =
        dataFormatadaHoraLog + "," + horaHoraLog;
      this.dataHoraLog = dataHoraFormatadasHoraLog;

      var dataHoraCard = new Date(this.card.data_hora_cadastro);
      var diaDaSemanaHoraCard = diasDaSemana[dataHoraCard.getDay()];
      this.diaCard = diaDaSemanaHoraCard;

      const diaHoraCard = dataHoraCard.getDate();
      const mesHoraCard = dataHoraCard.getMonth() + 1;
      const anoHoraCard = dataHoraCard.getFullYear();
      const dataFormatadaHoraCard =
        diaHoraCard + "/" + mesHoraCard + "/" + anoHoraCard;
      const horaHoraCard = dataHoraCard.toLocaleTimeString([], {
        timeStyle: "short",
      });
      const dataHoraFormatadasHoraCard =
        dataFormatadaHoraCard + "," + horaHoraCard;
      this.dataHoraCard = dataHoraFormatadasHoraCard;

      let diferencaFinalizado = Math.abs(
        dataHoraLog.getTime() - dataHoraCard.getTime()
      );
      let diasFinalizado = Math.ceil(
        diferencaFinalizado / (1000 * 60 * 60 * 24)
      );

      this.diferencaDiasFinalizado = diasFinalizado;
    },

    openModalCard() {
      if (!this.$device.mobile || this.inInactiveCardList) return;
      let cardObj = {
        ...this.card,
        colorStatus: this.colorStatus,
        corTextoCard: this.corTextoCard,
        isToInactive: this.isToInactive ? true : false,
      };
      this.pipelineStore.cardToChange = cardObj;
      this.pipelineStore.isShowingModalCard =
        !this.pipelineStore.isShowingModalCard;
    },

    formataValorCard() {
        this.valorFormatado = String(parseFloat(this.card.valor.toFixed(2))).replace(
        ".",
        ","
      )
    }
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
    if (this.isToInactive) {
      this.intervalInactiveCard = setInterval(() => {
        this.card.timer -= 1;
        this.$forceUpdate();
        if (this.card.timer <= 0) {
          this.cardToInactive();
          clearInterval(this.intervalInactiveCard);
        }
      }, 1000);
    }

    // Se estiver na lista de cards inativos, calcula qual o dia da semana que ele foi finalizado
    if (this.inInactiveCardList) {
      this.calculaInfosInInactiveCardList();
    }
  },
  beforeDestroy() {
    // Limpa o interval se ele foi colocado como inativo ou retirado da lista para inativo
    clearInterval(this.intervalInactiveCard);
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

    "card.valor": function (newValue, oldValue){
        this.formataValorCard();
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
  width: 20px;
  height: 20px;
  border-radius: 100%;
  position: relative;
}

.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(20px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
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
