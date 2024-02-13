<template>
  <div>
    <transition name="fade">
      <div
        v-if="pipelineStore.isShowingModalCard"
        class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center"
      >
        <div class="relative mx-auto modal-movimento">
          <div class="bg-white w-full rounded-md h-full">
            <div
              class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
            >
              <h5 class="font-semibold text-xl text-gray-900/70 mr-32">
                Mover card
              </h5>
              <button
                type="button"
                class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                @click="
                  pipelineStore.isShowingModalCard =
                    !pipelineStore.isShowingModalCard
                "
              >
                <font-awesome-icon
                  class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                  :icon="['fas', 'fa-close']"
                />
              </button>
            </div>

            <ul class="flex flex-col px-5 mt-2">
              <CardListItem
                :card="card"
                :colorStatus="card.colorStatus"
                :corTextoCard="card.corTextoCard"
                :inModalEditComments="true"
              />
            </ul>

            <div class="w-full h-full px-12 mt-4">
              <div>
                <label for="escolhaStatus">Para: </label>
                <select
                  v-model="escolhaStatus"
                  class="border py-4 pl-1 w-full 2xl:w-fit xl:w-fit l:w-fit rounded-full focus:outline-none hover:cursor-pointer hover:bg-gray-100 transition-all"
                  id="escolhaStatus"
                >
                  <option
                    v-for="status in pipelineStore.list"
                    :key="status.id_status"
                    :value="status.id_status"
                    v-show="
                      (!card.isToInactive &&
                        card.id_status !== status.id_status) ||
                      card.isToInactive
                    "
                  >
                    {{ status.ordem }} - {{ status.nome }}
                  </option>
                  <option :value="-1" v-show="!card.isToInactive">
                    x - Finalizar
                  </option>
                </select>
              </div>
              <div class="mt-10">
                <transition name="fade">
                  <button
                    @click="moverCard"
                    v-if="escolhaStatus !== null"
                    class="mt-2 mover px-6 py-2 ml-6 text-xl font-medium text-white salvar rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none hover:scale-110"
                  >
                    Mover
                  </button>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="pipelineStore.isShowingModalCard"
        class="absolute inset-0 z-40 opacity-25 bg-black"
      ></div>
    </transition>
  </div>
</template>

<script>
import CardListItem from "./CardListItem.vue";

export default {
  name: "ModalCard",
  inject: ["globalStore", "pipelineStore"],
  components: {
    CardListItem,
  },
  data() {
    return {
      escolhaStatus: null,
      escolhaPosicao: null,
      card: this.pipelineStore.cardToChange,
    };
  },
  methods: {
    async moverCard() {
      if (this.escolhaStatus === -1) {
        this.card.acao = "mobileAdded";
        this.card.timer = 60;
        this.pipelineStore.editedCardWAction = this.card;

        let data = {
          card: {
            ...this.card,
            acao: "added",
          },
        };
        this.pipelineStore.triggerPusher("client-card-inativo", data);
        this.pipelineStore.isShowingModalCard =
          !this.pipelineStore.isShowingModalCard;
        return;
      }

      let event = "client-card-editado";

      var posicao = 0;

      this.pipelineStore.list.forEach((status) => {
        if (status.id_status === this.escolhaStatus) {
          if (status.cards.length > 0) posicao = status.cards[0].posicao / 2;

          if (status.cards.length === 0) posicao = 60000;
        }
      });
      this.card.posicao = posicao;

      event = "client-card-editado-status";
      this.card.id_status = this.escolhaStatus;

      const body = {
        id_status: this.card.id_status,
        posicao: this.card.posicao
      };

      var data = {
        card: {
          ...this.card,
          fixed: true,
        },
      };
      let dataPusher = {
        card: {
          ...this.card,
          acao: "removed",
        },
      };
      this.pipelineStore.triggerPusher("client-card-inativo", dataPusher);
      this.pipelineStore.triggerPusher(event, data);
      this.card.timer = 60;
      this.pipelineStore.editedCardStatus = this.card;

      this.card.acao = "mobileRemoved";
      this.pipelineStore.editedCardWAction = this.card;
      this.pipelineStore.isShowingModalCard =
        !this.pipelineStore.isShowingModalCard;

      this.globalStore.addNewRequest(() => {
        return this.axios
          .put(
            `${window.API_V2}/pipeline/cards/${this.card.id_card}/edit`,
            body
          )
          .then((res) => {
            data.card.fixed = false;
            this.pipelineStore.triggerPusher("client-card-editado", data);
          });
      });
    },
  },
  watch: {
    "pipelineStore.cardToChange": function (newCard, oldCard) {
      this.card = newCard;
    },
    "pipelineStore.isShowingModalCard": function (newValue, oldValue) {
      this.escolhaStatus = null;
      this.escolhaPosicao = null;
    },
  },
};
</script>

<style scoped>
.modal-movimento {
  width: 60%;
  height: 40%;
  max-height: fit-content;
}

@media (max-width: 1536px) {
  .modal-movimento {
    width: 70%;
    height: 50%;
  }
}

@media (max-width: 1280px) {
  .modal-movimento {
    width: 80%;
    height: 60%;
  }
}

.mover {
  background-color: rgba(65 184 131 /1);
  transition: transform 0.2s ease-in-out;
}

.mover:hover {
  background-color: rgb(61, 174, 123);
}
</style>
