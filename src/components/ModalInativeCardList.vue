<template>
  <div>
    <transition name="modal">
      <div
        class="z-50 overflow-x-hidden overflow-y-hidden flex justify-center items-center modal"
        v-if="toggleModal"
      >
        <div class="relative mx-auto w-full">
          <div
            class="bg-white w-full rounded-md h-screen overflow-y-auto overflow-x-hidden"
            ref="scrollRef"
          >
            <div
              class="sticky top-0 z-50 bg-white rounded-t-md border-b-2 border-neutral-100 border-opacity-100 px-4 py-2 dark:border-opacity-50"
            >
              <div class="flex flex-shrink-0 items-center justify-between py-2">
                <h5 class="text-2xl text-black">Cards finalizados</h5>
                <button
                  type="button"
                  class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  @click="closeModal"
                >
                  <font-awesome-icon
                    class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                    :icon="['fas', 'fa-close']"
                  />
                </button>
              </div>

              <button
                class="flex items-center space-x-1"
                v-if="
                  isShowingFilters === false && !isRequestingAllInactiveStatus
                "
                @click="isShowingFilters = !isShowingFilters"
              >
                <span class="font-semibold">Filtros</span>
                <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-plus']" />
              </button>

              <transition name="fade">
                <div>
                  <button
                    class="float-left flex items-center space-x-1"
                    v-if="
                      isShowingFilters === true &&
                      !isRequestingAllInactiveStatus
                    "
                    @click="isShowingFilters = !isShowingFilters"
                  >
                    <span class="font-semibold">Filtros</span>
                    <font-awesome-icon
                      class="w-5 h-5"
                      :icon="['fas', 'fa-minus']"
                    />
                  </button>
                  <form
                    v-if="!isRequestingAllInactiveStatus && isShowingFilters"
                    @submit.prevent="buscaCards"
                    class="w-full flex flex-col justify-between xl:flex-row space-y-1 xl:space-x-2 pb-1 items-center"
                  >
                    <div class="w-full">
                      <div class="relative hover:scale-105 transition-all">
                        <div
                          class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none"
                        >
                          <font-awesome-icon
                            class="w-5 h-5 text-gray-500"
                            :icon="['fas', 'fa-search']"
                          />
                        </div>
                        <input
                          class="border rounded-full appearance-none py-4 pl-8 text-gray-700 leading-tight focus:outline-none w-full"
                          v-model="search"
                          name="search"
                          type="text"
                          placeholder="Digite algo"
                        />
                      </div>
                    </div>

                    <select
                      v-model="statusSelected"
                      class="border py-4 pl-1 w-full rounded-full focus:outline-none hover:cursor-pointer hover:scale-105 transition-all"
                    >
                      <option value="" selected>Todos os status</option>
                      <option
                        v-for="status in list"
                        :value="status.id_status"
                        :key="status.id_status"
                      >
                        {{ status.nome }}
                      </option>
                      <option
                        value=""
                        disabled
                        v-if="allInactiveStatus.length > 0"
                      >
                        ----- Status Inativos -----
                      </option>
                      <option
                        v-for="status in allInactiveStatus"
                        :value="status.id_status"
                        :key="status.id_status"
                      >
                        {{ status.nome }}
                      </option>
                    </select>

                    <div class="hover:scale-105 transition-all w-full">
                      <date-picker
                        v-model="date"
                        @change="setDate"
                        :format="'DD/MM/YYYY'"
                        :placeholder="'Data inicial - Data final'"
                        :input-class="'w-full py-4 pl-2 focus:outline-none border rounded-full'"
                        range
                      ></date-picker>
                    </div>

                    <button
                      type="submit"
                      class="transition-all rounded-full px-4 py-4 btn-buscar hover:scale-110 text-gray-700 w-full xl:w-min"
                      :class="{ 'bg-color-gray-700': isRequesting }"
                      :disabled="isRequesting"
                    >
                      Buscar
                    </button>
                  </form>
                </div>
              </transition>

              <div
                class="flex justify-center w-full"
                v-if="isRequestingAllInactiveStatus"
              >
                <div class="looping-rhombuses-spinner">
                  <div class="rhombus"></div>
                  <div class="rhombus"></div>
                  <div class="rhombus"></div>
                </div>
              </div>

              <transition name="fade">
                <div
                  class="flex justify-end w-full"
                  v-if="search !== '' || startDate !== null || endDate !== null"
                >
                  <button
                    type="button"
                    @click="limpaFiltros"
                    class="text-gray-700 hover:text-red-600 transition-all font-semibold text-sm"
                  >
                    Limpar filtros
                  </button>
                </div>
              </transition>
            </div>

            <div class="h-screen flex flex-row bg-white">
              <div class="w-full py-2">
                <ul class="space-y-3 px-4" v-if="!isRequesting">
                  <CardListItem
                    ref="list"
                    v-for="card in inativeCardsList"
                    :key="card.id_card"
                    :card="card"
                    :colorStatus="card.colorStatus"
                    :corTextoCard="card.corTextoCard"
                    :dataHoje="dataHoje"
                    :inInativeCardList="true"
                    @openModalEditComments="
                      $emit('openModalEditComments', card)
                    "
                    @turnCardActive="onTurnCardActive"
                    :existeStatus="card.existeStatus"
                    @cardDeleted="onDeleteCard"
                    :statusInativo="card.statusInativo"
                    :tiposMovimento="tiposMovimento"
                  ></CardListItem>

                  <div
                    class="flex-row justify-center py-4"
                    :class="{
                      visible: isRequestingMore,
                      invisible: !isRequestingMore,
                    }"
                  >
                    <div class="hollow-dots-spinner">
                      <div class="dot"></div>
                      <div class="dot"></div>
                      <div class="dot"></div>
                    </div>
                  </div>
                </ul>
                <div
                  class="flex flex-col justify-center items-center"
                  v-if="isRequesting"
                >
                  <div class="half-circle-spinner">
                    <div class="circle circle-1"></div>
                    <div class="circle circle-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <Transition name="fade" appear>
      <div
        v-if="toggleModal"
        class="absolute inset-0 z-40 bg-black/30"
        @click="closeModal"
      ></div>
    </Transition>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import CardListItem from "./CardListItem.vue";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/pt-br";

export default {
  name: "ModalInativeCardList",
  components: {
    CardListItem,
    DatePicker,
  },
  props: {
    toggleModal: {
      type: Boolean,
      default: ref(false),
    },
    dataHoje: String,
    list: Array,
    ajustarCorTexto: Function,
    tiposMovimento: Object,
    animaElementSumindo: Function,
    editedCardComment: {
      type: Object,
      default: () => ({}),
    },
    cardIsNowActive: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      date: null,
      startDate: null,
      endDate: null,
      search: "",
      statusSelected: "",
      // Lista da requisição de cards inativos
      inativeCardsList: [],
      isRequesting: ref(false),
      isRequestingMore: ref(false),
      dataRequestInativeCardList: [],
      qtdRequests: 1,
      arrayURL: [],
      alreadyRequestedAllInactiveStatus: ref(false),
      allInactiveStatus: [],
      completeStatusList: [],
      isRequestingAllInactiveStatus: ref(false),
      isShowingFilters: true,
    };
  },
  methods: {
    async onDeleteCard(card) {
      const list = this.$refs.list;

      var elementIndex = list.findIndex(
        (obj) => obj.card.id_card === card.id_card
      );
      let element = list[elementIndex].$el;

      await this.animaElementSumindo(element);

      setTimeout(() => {
        // remove o card da lista atual
        this.inativeCardsList.splice(elementIndex, 1);
        this.$emit("cardDeleted", card);
      }, 2000);
    },
    async onTurnCardActive(card) {
      const list = this.$refs.list;

      var elementIndex = list.findIndex(
        (obj) => obj.card.id_card === card.id_card
      );
      if (elementIndex === -1) return;
      let element = list[elementIndex].$el;

      await new Promise((resolve) => {
        this.animaElementSumindo(element, resolve, false);
      });

      // remove o card da lista atual
      await this.inativeCardsList.splice(elementIndex, 1);
      await this.$emit("turnCardActive", card);
    },
    setDate() {
      this.startDate = this.date[0];
      this.endDate = this.date[1];
    },
    buscaCards() {
      let scroll = this.$refs.scrollRef;
      scroll.scrollTop = 0;

      var dataInicialFormatada = this.startDate;
      var dataFinalFormatada = this.endDate;

      if (this.startDate && this.endDate) {
        let dataInicial = new Date(this.startDate);
        let anoInicial = dataInicial.getFullYear();
        let mesInicial = ("0" + (dataInicial.getMonth() + 1)).slice(-2);
        let diaInicial = ("0" + dataInicial.getDate()).slice(-2);
        dataInicialFormatada = `${anoInicial}-${mesInicial}-${diaInicial}`;

        let dataFinal = new Date(this.endDate);
        let anoFinal = dataFinal.getFullYear();
        let mesFinal = ("0" + (dataFinal.getMonth() + 1)).slice(-2);
        let diaFinal = ("0" + dataFinal.getDate()).slice(-2);
        dataFinalFormatada = `${anoFinal}-${mesFinal}-${diaFinal}`;
      }

      let body = {
        busca: this.search,
        status: this.statusSelected === "" ? null : this.statusSelected,
        dataInicial: dataInicialFormatada,
        dataFinal: dataFinalFormatada,
      };

      this.isRequesting = true;
      this.axios
        .post("/v2/pipeline/cards/inactive", body)
        .then((res) => {
          const data = res.data;
          this.inativeCardsList = data;

          this.inativeCardsList.forEach((card) => {
            card.posicao = parseFloat(card.posicao);
            card.valor = parseFloat(card.valor);
          });

          this.adicionaInfos();

          this.isRequesting = false;
        })
        .catch((err) => {
          this.isRequesting = false;
          console.log(err);
        });
    },
    closeModal() {
      this.limpaFiltros();
      this.$emit("closeModalInativeCardList");
    },
    adicionaInfos() {
      this.inativeCardsList.forEach((card) => {
        var statusIndex = this.list.findIndex(
          (obj) => obj.id_status === card.id_status
        );
        if (statusIndex !== -1) {
          let status = this.list[statusIndex];
          let statusName = status.nome;
          let colorStatus = status.color;
          card.statusName = statusName;
          card.colorStatus = colorStatus;
          card.corTextoCard = this.ajustarCorTexto(colorStatus);
        } else {
          statusIndex = this.allInactiveStatus.findIndex(
            (obj) => obj.id_status === card.id_status
          );
          if (statusIndex !== -1) {
            let status = this.allInactiveStatus[statusIndex];
            let statusName = status.nome;
            let colorStatus = status.color;
            card.statusName = statusName;
            card.colorStatus = colorStatus;
            card.corTextoCard = this.ajustarCorTexto(colorStatus);
            card.statusInativo = true;
          } else {
            card.statusName = "Removido do pipeline";
            card.colorStatus = "#71717A";
            card.corTextoCard = "#FFFFFF";
            card.existeStatus = false;
          }
        }
        card["date"] = card.data_hora_cadastro.substring(0, 10);
      });
    },
    limpaFiltros() {
      this.date = null;
      this.startDate = null;
      this.endDate = null;
      this.search = "";
      this.statusSelected = "";
    },
    limpaSelect() {
      this.statusSelected = "";
    },
    getAllInactiveStatus() {
      this.isRequestingAllInactiveStatus = true;
      this.alreadyRequestedAllInactiveStatus = true;
      this.axios
        .get("/v2/pipeline/status/inactive")
        .then((res) => {
          this.allInactiveStatus = res.data;
          this.isRequestingAllInactiveStatus = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    toggleModal(newValue, oldValue) {
      if (newValue === true && oldValue === false) {
        if (this.alreadyRequestedAllInactiveStatus === false) {
          this.getAllInactiveStatus();
        }
      }
    },
    list(newList, oldList) {
      this.getAllInactiveStatus();
    },
    editedCardComment(newCard, oldCard) {
      this.inativeCardsList.forEach((card) => {
        if (newCard.id_card === card.id_card) {
          card.comentarios = newCard.comentarios;
        }
      });
    },
    cardIsNowActive(newCard, oldCard) {
      this.inativeCardsList.forEach((card) => {
        if (newCard.id_card === card.id_card) {
          this.onTurnCardActive(newCard);
        }
      });
    },
  },
};
</script>

<style scoped>
.btn-buscar {
  background-color: #cfe2f3;
}
::-webkit-scrollbar {
  background-color: transparent;
  width: 8px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #aeaeae;
  border-radius: 5px;
}

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

.modal {
  position: fixed;
  top: 0;
  right: 0;
  width: 45%;
}

@media (max-width: 1536px) {
  .modal {
    width: 45%;
  }
}

@media (max-width: 1280px) {
  .modal {
    width: 55%;
  }
}

@media (max-width: 1024px) {
  .modal {
    width: 70%;
  }
}

@media (max-width: 768px) {
  .modal {
    width: 100%;
  }
}

.input-date {
  background-color: transparent;
  border: 5px solid #cccccc;
  color: rgb(55, 65, 81);
  outline: none;
  border-radius: 0.25rem;
  padding: 1rem 0;
}

::-webkit-calendar-picker-indicator {
  background-color: #ffffff;
  padding: 2px;
  cursor: pointer;
  border-radius: 3px;
}

.looping-rhombuses-spinner,
.looping-rhombuses-spinner * {
  box-sizing: border-box;
}

.looping-rhombuses-spinner {
  width: calc(15px * 4);
  height: 15px;
  position: relative;
}

.looping-rhombuses-spinner .rhombus {
  height: 15px;
  width: 15px;
  background-color: black;
  left: calc(15px * 4);
  position: absolute;
  margin: 0 auto;
  border-radius: 2px;
  transform: translateY(0) rotate(45deg) scale(0);
  animation: looping-rhombuses-spinner-animation 2500ms linear infinite;
}

.looping-rhombuses-spinner .rhombus:nth-child(1) {
  animation-delay: calc(2500ms * 1 / -1.5);
}

.looping-rhombuses-spinner .rhombus:nth-child(2) {
  animation-delay: calc(2500ms * 2 / -1.5);
}

.looping-rhombuses-spinner .rhombus:nth-child(3) {
  animation-delay: calc(2500ms * 3 / -1.5);
}

@keyframes looping-rhombuses-spinner-animation {
  0% {
    transform: translateX(0) rotate(45deg) scale(0);
  }
  50% {
    transform: translateX(-233%) rotate(45deg) scale(1);
  }
  100% {
    transform: translateX(-466%) rotate(45deg) scale(0);
  }
}
</style>
