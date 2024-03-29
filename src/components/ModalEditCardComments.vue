<template>
  <div>
    <Transition name="modal">
      <div
        class="z-50 overflow-x-hidden overflow-y-auto flex justify-center items-center modal"
        v-if="pipelineStore.isShowingModalEditCardComments"
      >
        <div class="relative mx-auto w-full">
          <div class="bg-white w-full rounded-md h-screen p-3">
            <ul>
              <CardListItem
                :card="pipelineStore.editingCard"
                :colorStatus="pipelineStore.editingCard.colorStatus"
                :corTextoCard="pipelineStore.editingCard.corTextoCard"
                :inModalEditComments="true"
              ></CardListItem>
            </ul>

            <form class="mt-6" @submit.prevent="onSubmit">
              <div class="relative">
                <div class="absolute top-0 right-0">
                  <p
                    class="font-semibold text-sm text-gray-500"
                    :class="{
                      'text-red-500': cardComentarios.length > maxLength,
                    }"
                  >
                    {{ cardComentarios.length }} | máx: {{ maxLength }}
                  </p>
                </div>
                <label
                  for="message"
                  class="block mb-2 text-sm font-medium text-gray-900 text-left"
                  >Comentários/Observações</label
                >
                <textarea
                  id="message"
                  rows="10"
                  name="comentarios"
                  v-model="cardComentarios"
                  ref="textareaRef"
                  class="block p-2.5 w-full text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  :class="{
                    'text-red-500': cardComentarios.length > maxLength,
                    border: cardComentarios.length > maxLength,
                    'border-red-500': cardComentarios.length > maxLength,
                  }"
                  placeholder="Escreva aqui..."
                  maxlength="1000"
                  :disabled="isSubmiting"
                ></textarea>
              </div>

              <div class="p-4">
                <div class="p-3 rounded-md mt-2">
                  <p
                    class="text-red-600/80 text-center text-xl font-semibold my-3"
                    v-if="isShowingError"
                  >
                    {{ errorMessage }}
                  </p>

                  <div class="absolute bottom-0 right-0 p-3 flex justify-end">
                    <div v-if="!isSubmiting">
                      <button
                        type="button"
                        @click="closeModal"
                        class="px-8 py-4 text-xl font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      >
                        Cancelar
                      </button>
                      <transition name="fade">
                        <button
                          type="submit"
                          v-if="cardComentarios !== backupCardComentarios"
                          class="px-8 py-4 ml-6 text-xl font-medium text-white salvar rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none hover:scale-110"
                        >
                          Salvar
                        </button>
                      </transition>
                    </div>

                    <div class="flex justify-end" v-if="isSubmiting">
                      <div class="hollow-dots-spinner mt-24">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade" appear>
      <div
        class="absolute inset-0 z-40 bg-black/30"
        v-if="pipelineStore.isShowingModalEditCardComments"
        @click="closeModal"
      ></div>
    </Transition>
  </div>
</template>

<script>
import { ref } from "vue";
import CardListItem from "./CardListItem.vue";

export default {
  name: "ModalEditCardComments",
  inject: ["globalStore", "pipelineStore"],
  components: {
    CardListItem,
  },
  data() {
    return {
      isSubmiting: ref(false),
      isShowingError: ref(false),
      errorMessage: "",
      cardComentarios: "",
      backupCardComentarios: "",
      maxLength: 1000,
    };
  },
  methods: {
    /**
     * Método para fechar a modal
     * Verifica se o submit está sendo feito, se sim bloqueia o fechamento da modal
     */
    closeModal() {
      if (this.isSubmiting === true) return;
      if (this.backupCardComentarios !== this.cardComentarios) {
        this.$confirm({
          message: "Você fez alterações! Deseja mantê-las?",
          button: {
            no: "Não, descartar",
            yes: "Sim",
          },
          /**
           * Callback Function
           * @param {Boolean} confirm
           */
          callback: (confirm) => {
            if (confirm) {
            } else {
              this.errorMessage = "";
              this.isShowingError = false;
              this.pipelineStore.isShowingModalEditCardComments = false;
              if (this.pipelineStore.fromInactiveCardList)
                this.pipelineStore.isShowingModalInactiveCardList = true;
            }
          },
        });
      } else {
        this.errorMessage = "";
        this.isShowingError = false;
        this.pipelineStore.isShowingModalEditCardComments = false;
        if (this.pipelineStore.fromInactiveCardList)
          this.pipelineStore.isShowingModalInactiveCardList = true;
      }
    },

    /**
     * Método que faz a requisição de edição dos comentários do card
     * @param {Event} ev
     */
    async onSubmit(ev) {
      this.isSubmiting = true;
      this.isShowingError = false;

      const { comentarios } = Object.fromEntries(new FormData(ev.target));
      this.cardComentarios = comentarios;

      if (this.cardComentarios.length > this.maxLength) {
        this.isSubmiting = false;
        this.errorMessage =
          "O tamanho máximo dos comentários é de " +
          this.maxLength +
          " caracteres!";
        this.isShowingError = true;
        return;
      }

      const body = {
        comentarios: this.cardComentarios.length === 0 ? true : this.cardComentarios,
      };

      this.globalStore.addNewRequest(() => {
        this.axios
          .put(
            `${window.API_V2}/pipeline/cards/${this.pipelineStore.editingCard.id_card}/edit`,
            body
          )
          .then((res) => {
            let data = {
              card: {
                ...this.pipelineStore.editingCard,
                comentarios: this.cardComentarios,
              },
            };
            this.pipelineStore.triggerPusher("client-card-editado", data);

            this.isSubmiting = false;
            ToastTopStart3.fire(
              "Sucesso!",
              "O comentário do seu card foi salvo!",
              "success"
            );
            this.pipelineStore.lastEditedCard = {
              ...this.pipelineStore.editingCard,
              comentarios: this.cardComentarios,
            };
            this.pipelineStore.isShowingModalEditCardComments = false;
            if (this.pipelineStore.fromInactiveCardList)
              this.pipelineStore.isShowingModalInactiveCardList = true;
          });
      });
    },
  },
  watch: {
    "pipelineStore.editingCard": function (newCard, oldCard) {
      this.cardComentarios =
        newCard.comentarios !== null ? newCard.comentarios : "";
      this.backupCardComentarios =
        newCard.comentarios !== null ? newCard.comentarios : "";
    },
  },
};
</script>

<style scoped>
.salvar {
  background-color: rgba(65 184 131 /1);
  transition: transform 0.2s ease-in-out;
}

.salvar:hover {
  background-color: rgb(61, 174, 123);
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
  width: 30%;
}

@media (max-width: 1536px) {
  .modal {
    width: 40%;
  }
}

@media (max-width: 1280px) {
  .modal {
    width: 50%;
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
</style>
