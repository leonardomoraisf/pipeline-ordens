<template>
  <div>
    <transition name="modal">
      <div
        class="z-40 overflow-x-hidden overflow-y-auto flex justify-center items-center modal"
        v-if="toggleModal"
      >
        <div class="relative mx-auto w-full">
          <div class="bg-white w-full rounded-md h-screen">
            <form @submit.prevent="onSubmit" v-if="!isDeletingStatus">
              <div
                class="w-full rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
              >
                <div class="flex items-center space-x-4">
                  <div
                    :style="{
                      backgroundColor:
                        isEdit === 0 ? regStatusColor : editStatusColor,
                    }"
                    :class="{ shake: animated }"
                    @click="
                      toggleInputColor = !isSubmiting
                        ? !toggleInputColor
                        : toggleInputColor
                    "
                    class="group relative cursor-pointer hover:scale-125 z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle"
                  >
                    <p
                      v-if="isEdit === 0"
                      class="text-xl"
                      :style="{ color: colorStatusTextRef }"
                    >
                      {{ pipelineStore.lastList.ordem + 1 }}
                    </p>
                    <p
                      v-if="isEdit === 1"
                      class="text-xl"
                      :style="{ color: colorStatusTextRef }"
                    >
                      {{ status.ordem }}
                    </p>
                    <button
                      type="button"
                      class="hidden absolute -top-2 right-0 group-hover:grid"
                      v-if="isEdit === 1"
                      @click="confirmDeleteStatus"
                    >
                      <font-awesome-icon
                        class="w-4 h-4 text-gray-600 hover:text-red-600 transition-all"
                        :icon="['fas', 'fa-close']"
                      />
                    </button>
                  </div>

                  <div class="w-full">
                    <div v-if="isEdit === 0" class="relative">
                      <input
                        class="text-2xl w-full font-semibold px-3 max-w-full py-6 rounded-md shadow appearance-none border outline-none text-gray-700 leading-tight focus:shadow-outline"
                        type="text"
                        ref="regStatusNameRef"
                        placeholder="Nome do status..."
                        name="regStatusName"
                        v-model="regStatusName"
                        :class="{
                          'text-red-500': regStatusName.length > maxLength,
                          'border-red-500': regStatusName.length > maxLength,
                        }"
                        maxlength="50"
                      />
                      <p
                        class="fixed top-4 right-5 font-semibold text-sm text-gray-500"
                        :class="{
                          'text-red-500': regStatusName.length > maxLength,
                        }"
                      >
                        {{ regStatusName.length }} | máx: {{ maxLength }}
                      </p>
                    </div>

                    <div v-if="isEdit === 1" class="relative">
                      <input
                        class="text-2xl w-full font-semibold px-3 max-w-full py-6 rounded-md shadow appearance-none border outline-none text-gray-700 leading-tight focus:shadow-outline"
                        type="text"
                        ref="editStatusNameRef"
                        placeholder="Nome do status..."
                        name="editStatusName"
                        v-model="editStatusName"
                        :class="{
                          'text-red-500': editStatusName.length > maxLength,
                          'border-red-500': editStatusName.length > maxLength,
                        }"
                        maxlength="50"
                        :disabled="isSubmiting"
                      />
                      <p
                        class="fixed top-4 right-5 font-semibold text-sm text-gray-500"
                        :class="{
                          'text-red-500': editStatusName.length > maxLength,
                        }"
                      >
                        {{ editStatusName.length }} | máx: {{ maxLength }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="flex justify-start items-center max-w-fit"
                  v-if="toggleInputColor"
                >
                  <ColorPicker
                    v-if="isEdit === 0"
                    :color="regColor"
                    :onEndChange="(color) => onChange(color, 'end')"
                  />
                  <ColorPicker
                    v-if="isEdit === 1"
                    :color="editColor"
                    :onEndChange="(color) => onChange(color, 'end')"
                  />
                </div>
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
                          class="px-8 py-4 ml-6 text-xl font-medium text-white salvar rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none hover:scale-110"
                          v-if="
                            (isEdit === 0 && regStatusName !== '') ||
                            regStatusColor !== '#2563eb'
                          "
                        >
                          {{ buttonName }}
                        </button>
                      </transition>
                      <transition name="fade">
                        <button
                          type="submit"
                          class="px-8 py-4 ml-6 text-xl font-medium text-white salvar rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none hover:scale-110"
                          v-if="
                            (isEdit === 1 &&
                              editStatusName !== backupEditStatusName) ||
                            editStatusColor !== backupEditStatusColor
                          "
                        >
                          {{ buttonName }}
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

            <div
              class="flex flex-col justify-center items-center h-full"
              v-if="isDeletingStatus"
            >
              <p class="text-2xl font-semibold mb-2">Inativando status</p>
              <div class="hollow-dots-spinner">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <Transition name="fade" appear>
      <div
        v-if="toggleModal"
        @click="closeModal"
        class="absolute inset-0 z-30 bg-black/30"
      ></div>
    </Transition>
  </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { ColorPicker } from "vue-color-gradient-picker";
import apiService from "../services/apiService";
import { globalHelper } from "@/helpers/global";

export default {
  name: "SideModal",
  inject: ["globalStore", "pipelineStore"],
  components: {
    ColorPicker,
  },
  props: {
    status: Object,
    toggleModal: {
      type: Boolean,
      default: ref(false),
    },
    colorStatusText: String,
    animated: Boolean,
    cards: {
      type: Array,
      default: () => {
        [];
      },
    },
  },
  data() {
    return {
      isEdit: this.status.id_status !== 0 ? 1 : 0,
      bgStatusCircle: this.status.color ? this.status.color : "#2563eb",
      isSubmiting: ref(false),
      isShowingError: ref(false),
      errorMessage: "",
      editStatusName: "",
      buttonName: this.status.id_status !== 0 ? "Salvar" : "Adicionar",
      toggleInputColor: ref(false),
      maxLength: 50,
      regStatusName: "",
      regStatusColor: "#2563eb",
      editStatusName: this.status.nome,
      editStatusColor: this.status.color,
      backupEditStatusName: this.status.nome,
      backupEditStatusColor: this.status.color,
      regColor: {
        red: 37,
        green: 99,
        blue: 235,
        alpha: 1,
      },
      editColor: {
        red: 37,
        green: 99,
        blue: 235,
        alpha: 1,
      },
      colorStatusTextRef: ref(this.colorStatusText),
      isDeletingStatus: ref(false),
    };
  },
  mounted() {
    // Se for edição ajusta o texto de acordo com o bg do status
    if (this.isEdit === 1) {
      this.colorStatusTextRef = globalHelper.ajustarCorTexto(
        this.editStatusColor
      );
    }
  },
  methods: {
    /**
     * Método para confirmar a inativação do status
     */
    confirmDeleteStatus() {
      if (this.isSubmiting) return;

      this.toggleInputColor = !this.toggleInputColor;
      if (this.cards.length > 0) {
        ToastCenter5.fire(
          "Você não pode inativar esse status!",
          "Esse status ainda possui cards, se quiser inativá-lo, mude os cards de status.",
          "warning"
        );
      } else if (this.cards.length === 0) {
        this.$confirm({
          title: "Opa!",
          message: "Tem certeza que deseja inativar esse status?",
          button: {
            no: "Não",
            yes: "Sim, inativar",
          },
          /**
           * Callback Function
           * @param {Boolean} confirm
           */
          callback: (confirm) => {
            if (confirm) {
              this.deleteStatus();
            } else {
            }
          },
        });
      }
    },

    /**
     * Método chamado quando um status é inativado
     */
    async deleteStatus() {
      this.isDeletingStatus = !this.isDeletingStatus;

      let body = {
        ...this.status,
        ativo: 0,
      };

      const response = await apiService.status.edit(
        this.status.id_status,
        body
      );

      this.isDeletingStatus = !this.isDeletingStatus;
      if (response.statusCode) {
        this.isSubmiting = false;
        this.isShowingError = true;
        this.errorMessage = response.message;

        return;
      }

      this.pipelineStore.removeStatus(this.status.id_status);

      this.$emit("closeModal");
      Toast.fire(response.message, "Atualizando pipeline...", "success");
    },

    /**
     * Método chamado quando o componente de escolher cor muda
     * @param {Object} attrs
     * @param {String} name
     */
    onChange(attrs, name) {
      let color = globalHelper.rgb2hex(attrs.style);

      if (this.isEdit === 0) {
        this.regStatusColor = color;
        this.regColor.red = attrs.red;
        this.regColor.green = attrs.green;
        this.regColor.blue = attrs.blue;
        this.regColor.alpha = attrs.alpha;
        this.colorStatusTextRef = globalHelper.ajustarCorTexto(color);
      }

      if (this.isEdit === 1) {
        this.editStatusColor = color;
        this.editColor.red = attrs.red;
        this.editColor.green = attrs.green;
        this.editColor.blue = attrs.blue;
        this.editColor.alpha = attrs.alpha;
        this.colorStatusTextRef = globalHelper.ajustarCorTexto(color);
      }
    },

    /**
     * Método que faz o componente de escolher cor abrir ao clicar na bolinha de status
     */
    async toggleInputColorFunc() {
      if (this.toggleInputColor === true) {
        this.toggleInputColor = !this.toggleInputColor;
        return;
      }

      this.toggleInputColor = !this.toggleInputColor;
      await nextTick();

      if (this.isEdit === 0) {
        this.$refs.regStatusColorRef.click();
      }

      if (this.isEdit === 1) {
        this.$refs.editStatusColorRef.click();
      }
    },

    /**
     * Método que verifica mudanças ou submit e fecha a modal
     */
    closeModal() {
      if (this.isSubmiting === true) return;
      if (this.isDeletingStatus === true) return;

      if (this.isEdit === 1) {
        if (
          this.editStatusName !== this.backupEditStatusName ||
          this.editStatusColor !== this.backupEditStatusColor
        ) {
          this.$confirm({
            title: "Você editou o status!",
            message: "E está saindo sem salvar!",
            button: {
              no: "Descartar alterações",
              yes: "Continuar editando",
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: (confirm) => {
              if (confirm) {
              } else {
                this.toggleInputColor = false;
                this.editStatusName = this.status.nome;
                this.editStatusColor = this.status.color;
                this.backupEditStatusName = this.status.nome;
                this.backupEditStatusColor = this.status.color;
                this.colorStatusTextRef = this.colorStatusText;
                this.isShowingError = false;
                this.errorMessage = "";
                this.$emit("closeModal");
              }
            },
          });
        } else {
          this.isShowingError = false;
          this.errorMessage = "";
          this.toggleInputColor = false;
          this.$emit("closeModal");
        }
      }
      if (this.isEdit === 0) {
        if (this.regStatusName !== "" || this.regStatusColor !== "#2563eb") {
          this.$confirm({
            title: "Você começou a adicionar um status!",
            message: "E está saindo sem adicionar!",
            button: {
              no: "Descartar",
              yes: "Continuar adicionando",
            },
            callback: (confirm) => {
              if (confirm) {
              } else {
                this.regStatusName = "";
                this.regStatusColor = "#2563eb";
                this.isShowingError = false;
                this.errorMessage = "";
                this.toggleInputColor = false;
                this.$emit("closeModal");
              }
            },
          });
        } else {
          this.isShowingError = false;
          this.errorMessage = "";
          this.toggleInputColor = false;
          this.$emit("closeModal");
        }
      }
    },

    /**
     * Método que faz o submit dependendo se é uma edição ou criação de status
     * @param {Event} ev
     */
    async onSubmit(ev) {
      this.isSubmiting = true;
      this.isShowingError = false;
      this.toggleInputColor = false;

      if (this.isEdit === 1) {
        // Salvar
        const { editStatusName } = Object.fromEntries(new FormData(ev.target));
        this.editStatusName = editStatusName;

        if (this.editStatusName == "") {
          this.isSubmiting = false;
          this.errorMessage = "O nome não pode estar vazio!";
          this.isShowingError = true;
          return;
        }

        if (this.editStatusName.length > this.maxLength) {
          this.isSubmiting = false;
          this.errorMessage =
            "O tamanho máximo do nome é de " + this.maxLength + " caracteres!";
          this.isShowingError = true;
          return;
        }

        let body = {
          ...this.status,
          nome: this.editStatusName,
          color: this.editStatusColor
        };

        delete body.cards;
        delete body.id_status;
        delete body.ordem;

        if (
          this.editStatusName === this.backupEditStatusName &&
          this.editStatusColor === this.backupEditStatusColor
        ) {
          this.isSubmiting = false;
          this.errorMessage = "Você não alterou nada!";
          this.isShowingError = true;
          return;
        }

        const response = await apiService.status.edit(
          this.status.id_status,
          body
        );

        this.isSubmiting = false;

        if (response.error || response.trace) {
          this.isShowingError = true;
          this.errorMessage = response.message;

          return;
        }

        this.pipelineStore.editStatus({
          id_status: this.status.id_status,
          nome: body.nome,
          color: body.color,
        });

        let data = {
          status: {
            id_status: this.status.id_status,
            ...body,
          },
        };
        this.pipelineStore.triggerPusher("client-status-editado", data);

        this.$emit("closeModal");
        this.backupEditStatusName = this.status.nome;
        this.backupEditStatusColor = this.status.color;
        Toast.fire(response.message, "Atualizando pipeline...", "success");
      }

      if (this.isEdit === 0) {
        // Adicionar
        const { regStatusName } = Object.fromEntries(new FormData(ev.target));
        this.regStatusName = regStatusName;

        if (this.regStatusName == "") {
          this.isSubmiting = false;
          this.errorMessage = "O nome não pode estar vazio!";
          this.isShowingError = true;
          return;
        }

        if (this.regStatusName.length > this.maxLength) {
          this.isSubmiting = false;
          this.errorMessage =
            "O tamanho máximo do nome é de " + this.maxLength + " caracteres!";
          this.isShowingError = true;
          return;
        }

        let body = {
          nome: this.regStatusName,
          color: this.regStatusColor
        };

        const response = await apiService.status.create(body);
        this.isSubmiting = false;

        if (response.error || response.trace) {
          this.isShowingError = true;
          this.errorMessage = response.message;

          return;
        }

        this.pipelineStore.addStatus(response.id_status, body);

        let data = {
          status: {
            id_status: response.id_status,
            ...body,
          },
        };
        this.pipelineStore.triggerPusher("client-status-criado", data);

        this.$refs.regStatusNameRef.value = "";
        this.regColor = {
          red: 37,
          green: 99,
          blue: 235,
          alpha: 1,
        };
        this.$emit("closeModal");
        this.colorStatusTextRef = this.colorStatusText;
        this.regStatusName = "";
        this.regStatusColor = "#2563eb";
        Toast.fire(response.message, "Atualizando pipeline...", "success");
      }
    },
  },
  watch: {
    "status.nome"(novoNome, nomeAntigo) {
      this.editStatusName = novoNome;
      this.backupEditStatusName = novoNome;
    },

    "status.color"(novaCor, corAntiga) {
      this.editStatusColor = novaCor;
      this.backupEditStatusColor = novaCor;
    },

    /**
     * Método que escuta a modal abrir e fechar para verificar se é edit
     * e transformar o valor do bg hex para rgb e setar no componente de escolher cor
     */
    toggleModal(newValue, oldValue) {
      if (newValue === true && oldValue === false && this.isEdit === 1) {
        let aRgb = globalHelper.hex2rgb(this.status.color);

        this.editColor = {
          red: aRgb.r,
          green: aRgb.g,
          blue: aRgb.b,
          alpha: 1,
        };
      }
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

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

<style src="vue-color-gradient-picker/dist/index.css" lang="css" />
