<template>
  <div class="flex flex-col h-screen bg-white relative text-center">
    <div class="shrink-0 p-4 flex justify-between space-x-1 lg:block">
      <button
        class="hover:scale-125 transition-all lg:float-left"
        v-tooltip.bottom="'Voltar'"
      >
        <a href="/app/vendas/nova-venda" class="text-base font-semibold"
          ><font-awesome-icon class="w-8 h-8" :icon="['fas', 'fa-arrow-left']"
        /></a>
      </button>

      <div class="flex flex-col align-middle items-center">
        <h1 class="text-2xl text-black font-bold">
          Pipeline - Fluxo de trabalho
        </h1>
      </div>

      <button
        class="block xl:hidden 2xl:hidden lg:hidden float-right"
        @click="toggleModalFilterStatus = !toggleModalFilterStatus"
        :class="{ invisible: toggleModalFilterStatus }"
      >
        <font-awesome-icon class="w-10 h-10" :icon="['fas', 'fa-bars']" />
      </button>

      <transition name="fade">
        <div
          class="fixed top-2 right-2 hidden lg:block"
          v-if="isRequestingEditCard"
          v-tooltip.bottom-start="'Não feche a página! Fazendo mudanças...'"
        >
          <div class="half-circle-spinner">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
          </div>
        </div>
      </transition>
    </div>

    <div
      class="shrink-0 lg:flex justify-center bg-white px-4 py-3 container mx-auto hidden"
    >
      <input
        class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
        v-model="search"
        type="text"
        placeholder="Filtre por nome do status"
      />
    </div>

    <LoadingSkeleton v-if="isRequesting"></LoadingSkeleton>

    <!-- main COM filtro de status -->
    <main
      class="flex-1 overflow-hidden"
      v-if="!isRequesting && search.length > 0"
    >
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-x-auto mt-8">
          <div class="inline-flex h-full items-start px-4 pb-4">
            <CardList
              v-for="list in filteredList"
              :key="list.id_status"
              :list="list"
              :lastList="lastList"
              :ordem="list.ordem"
              class="w-72 flex flex-col rounded-md pt-2 max-h-full"
              :ajustarCorTexto="ajustarCorTexto"
              :idEmpresa="idEmpresa"
              :newCard="newCard"
              :editedCard="editedCard"
              @statusDeleted="onStatusDeleted"
              :dataHoje="dataHoje"
              @cardInWrongList="onCardInWrongList"
              :pipelinePusher="pipelinePusher"
              :editedCardStatus="editedCardStatus"
              @turnCardActive="onTurnCardActive"
              :tiposMovimento="tiposMovimento"
              :pusherSessionID="pusherSessionID"
              :animaElementSumindo="animaElementSumindo"
              :isChangingCardPos="isChangingCardPos"
              @changeCardPos="onChangeCardPos"
              @newRequest="onNewRequest"
              @cardReativado="onCardReativado"
            />

            <div class="flex flex-col rounded-md py-2 max-h-full w-72">
              <!-- Essa div abaixo aparece assim que o usuário cria mais de três status,
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
              <div
                class="relative pb-8 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                @click="toggleModalCreateStatusFunc"
                v-if="listBoards.length > 3"
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
                @click="toggleModalCreateStatusFunc"
                v-if="listBoards.length <= 3"
              >
                <div class="flex h-8 max-h-8 items-center justify-center mt-3">
                  <div
                    class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0"
                  >
                    <font-awesome-icon :icon="['fas', 'fa-plus']" />
                  </div>
                </div>

                <div
                  class="flex justify-center text-center absolute bottom-0 w-full"
                >
                  <h3 class="text-base font-semibold leading-3">
                    Adicione um novo status
                  </h3>
                </div>
              </div>

              <SideModal
                :list="{ id_status: 0 }"
                :lastList="lastList"
                :toggleModal="isShowingModalCreateStatus"
                @closeModal="toggleModalCreateStatusFunc"
                :animated="animated"
                :colorStatusText="'#FFFFFF'"
                ref="sideModalCreate"
                :ajustarCorTexto="ajustarCorTexto"
                class="mb-2"
              >
              </SideModal>

              <div
                @click="toggleModalInativeCards"
                v-if="listBoards.length > 0"
                class="pb-3 hover:cursor-pointer relative h-screen flex flex-col overflow-hidden px-2 mt-40 border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50"
                v-tooltip="'Clique para visualizar os cards finalizados'"
              >
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <draggable
                    v-model="cardsToInativeList"
                    v-bind="dragOptions"
                    class="space-y-3 pb-24 h-full draggable pt-2"
                    ref="listInativeRef"
                    tag="ul"
                  >
                    <CardListItem
                      v-for="card in cardsToInativeList"
                      :key="card.id_card"
                      :card="card"
                      :colorStatus="'#71717A'"
                      :ajustarCorTexto="ajustarCorTexto"
                      :corTextoCard="'#FFFFFF'"
                      :dataHoje="dataHoje"
                      :isToInative="true"
                      @putCardToInative="onPutCardToInative"
                      @openModalEditComments="toggleModalEditComments"
                      @newRequest="onNewRequest"
                      :tiposMovimento="tiposMovimento"
                      :pusherSessionID="pusherSessionID"
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

              <ModalEditCardComments
                :cardIsEditing="cardIsEditing"
                :toggleModal="isShowingModalEditComments"
                :colorStatus="'#71717A'"
                :corTextoCard="'#FFFFFF'"
                :inInativeCards="false"
                ref="modalEditCommentsRef"
                @closeModalEditComments="toggleModalEditComments"
                :dataHoje="dataHoje"
                :tiposMovimento="tiposMovimento"
                @editComment="onEditComment"
                :pusherSessionID="pusherSessionID"
              ></ModalEditCardComments>

              <ModalInativeCardList
                :list="listBoards"
                :toggleModal="isShowingModalInativeCardList"
                :dataHoje="dataHoje"
                @closeModalInativeCardList="toggleModalInativeCards"
                @openModalEditComments="toggleModalEditComments"
                @turnCardActive="onTurnCardActive"
                :ajustarCorTexto="ajustarCorTexto"
                @cardDeleted="onCardDeleted"
                :tiposMovimento="tiposMovimento"
                :animaElementSumindo="animaElementSumindo"
                :editedCardComment="editedCardComment"
                :cardIsNowActive="cardIsNowActive"
              >
              </ModalInativeCardList>
            </div>
          </div>
        </div>
      </div>
      <vue-confirm-dialog></vue-confirm-dialog>
    </main>

    <!-- main SEM filtro de status -->
    <main
      class="flex-1 overflow-hidden"
      v-if="!isRequesting && search.length === 0"
    >
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-x-auto mt-8">
          <div class="inline-flex h-full items-start px-4 pb-4">
            <CardList
              v-for="list in listBoards"
              :key="list.id_status"
              :list="list"
              :lastList="lastList"
              :ordem="list.ordem"
              class="w-72 flex flex-col rounded-md pt-2 max-h-full"
              :ajustarCorTexto="ajustarCorTexto"
              :idEmpresa="idEmpresa"
              :newCard="newCard"
              :editedCard="editedCard"
              @statusDeleted="onStatusDeleted"
              :dataHoje="dataHoje"
              @cardInWrongList="onCardInWrongList"
              :pipelinePusher="pipelinePusher"
              :editedCardStatus="editedCardStatus"
              @turnCardActive="onTurnCardActive"
              :tiposMovimento="tiposMovimento"
              :pusherSessionID="pusherSessionID"
              :animaElementSumindo="animaElementSumindo"
              :isChangingCardPos="isChangingCardPos"
              @changeCardPos="onChangeCardPos"
              @newRequest="onNewRequest"
              @cardReativado="onCardReativado"
            />

            <div class="flex flex-col rounded-md py-2 max-h-full w-72">
              <!-- Essa div abaixo aparece assim que o usuário cria mais de três status,
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
              <div
                class="relative pb-8 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                @click="toggleModalCreateStatusFunc"
                v-if="listBoards.length > 3"
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
                @click="toggleModalCreateStatusFunc"
                v-if="listBoards.length <= 3"
              >
                <div class="flex h-8 max-h-8 items-center justify-center mt-3">
                  <div
                    class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0"
                  >
                    <font-awesome-icon :icon="['fas', 'fa-plus']" />
                  </div>
                </div>

                <div
                  class="flex justify-center text-center absolute bottom-0 w-full"
                >
                  <h3 class="text-base font-semibold leading-3">
                    Adicione um novo status
                  </h3>
                </div>
              </div>

              <SideModal
                :list="{ id_status: 0 }"
                :lastList="lastList"
                :toggleModal="isShowingModalCreateStatus"
                @closeModal="toggleModalCreateStatusFunc"
                :animated="animated"
                :colorStatusText="'#FFFFFF'"
                ref="sideModalCreate"
                :ajustarCorTexto="ajustarCorTexto"
                class="mb-2"
              >
              </SideModal>

              <div
                @click="toggleModalInativeCards"
                v-if="listBoards.length > 0"
                class="pb-3 hover:cursor-pointer relative h-screen flex flex-col overflow-hidden px-2 mt-40 border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50"
                v-tooltip="'Clique para visualizar os cards finalizados'"
              >
                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                  <draggable
                    v-model="cardsToInativeList"
                    v-bind="dragOptions"
                    class="space-y-3 pb-24 h-full draggable pt-2"
                    ref="listInativeRef"
                    tag="ul"
                  >
                    <CardListItem
                      v-for="card in cardsToInativeList"
                      :key="card.id_card"
                      :card="card"
                      :colorStatus="'#71717A'"
                      :ajustarCorTexto="ajustarCorTexto"
                      :corTextoCard="'#FFFFFF'"
                      :dataHoje="dataHoje"
                      :isToInative="true"
                      @putCardToInative="onPutCardToInative"
                      @openModalEditComments="toggleModalEditComments"
                      @newRequest="onNewRequest"
                      :tiposMovimento="tiposMovimento"
                      :pusherSessionID="pusherSessionID"
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

              <ModalEditCardComments
                :cardIsEditing="cardIsEditing"
                :toggleModal="isShowingModalEditComments"
                :colorStatus="'#71717A'"
                :corTextoCard="'#FFFFFF'"
                :inInativeCards="false"
                ref="modalEditCommentsRef"
                @closeModalEditComments="toggleModalEditComments"
                :dataHoje="dataHoje"
                :tiposMovimento="tiposMovimento"
                @editComment="onEditComment"
                :pusherSessionID="pusherSessionID"
              ></ModalEditCardComments>

              <ModalInativeCardList
                :list="listBoards"
                :toggleModal="isShowingModalInativeCardList"
                :dataHoje="dataHoje"
                @closeModalInativeCardList="toggleModalInativeCards"
                @openModalEditComments="toggleModalEditComments"
                @turnCardActive="onTurnCardActive"
                :ajustarCorTexto="ajustarCorTexto"
                @cardDeleted="onCardDeleted"
                :tiposMovimento="tiposMovimento"
                :animaElementSumindo="animaElementSumindo"
                :editedCardComment="editedCardComment"
                :cardIsNowActive="cardIsNowActive"
              >
              </ModalInativeCardList>
            </div>
          </div>
        </div>
      </div>
      <vue-confirm-dialog></vue-confirm-dialog>
    </main>

    <transition name="modal">
      <div
        class="z-40 overflow-x-hidden overflow-y-auto flex justify-center items-center fixed top-4 right-4 w-fit lg:hidden"
        v-if="toggleModalFilterStatus"
      >
        <div class="relative mx-auto w-full">
          <div class="w-full rounded-md">
            <button
              class="float-right"
              @click="toggleModalFilterStatus = !toggleModalFilterStatus"
            >
              <font-awesome-icon
                class="w-10 h-10"
                :icon="['fas', 'fa-close']"
              />
            </button>
            <div
              class="shrink-0 flex justify-center bg-gray-200 px-4 py-3 container mx-auto rounded-md"
            >
              <input
                class="shadow appearance-none border rounded w-full py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
                v-model="search"
                type="text"
                placeholder="Filtre por nome do status"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import SideModal from "./SideModal.vue";
import CardList from "./CardList.vue";
import draggable from "vuedraggable";
import LoadingSkeleton from "./LoadingSkeleton";
import { ref, nextTick } from "vue";
import ModalEditCardComments from "./ModalEditCardComments.vue";
import CardListItem from "./CardListItem.vue";
import ModalInativeCardList from "./ModalInativeCardList.vue";

export default {
  name: "BoardKanban",
  components: {
    SideModal,
    CardList,
    draggable,
    LoadingSkeleton,
    ModalEditCardComments,
    CardListItem,
    ModalInativeCardList,
  },
  data() {
    return {
      isRequesting: ref(true),
      // Lista da requisição
      listBoards: [],
      // Última lista
      lastList: {},
      idEmpresa: "",

      isShowingModalCreateStatus: ref(false),
      animated: ref(false),

      newCard: {},
      editedCard: {},
      editedCardStatus: {},

      search: "",

      dataHoje: "",

      // Lista de cards para inativo
      cardsToInativeList: [],

      isShowingModalEditComments: ref(false),
      cardIsEditing: {},

      isShowingModalInativeCardList: ref(false),

      // Armazena a quantidade de emits do cardlist para verificar se o card está ativo e tem que ser colocado na lista
      qtdEmitsCardList: 0,

      tiposMovimento: {
        0: "Orçamento",
        1: "Venda",
        2: "Venda e-Commerce",
        3: "Consignado",
      },

      fromInactiveCards: false,

      pusherSessionID: 0,

      editedCardComment: {},

      toggleModalFilterStatus: false,

      requestEditCardQueue: [],
      isRequestingEditCard: false,

      isChangingCardPos: false,
      cardsToChangePos: [],

      cardIsNowActive: {},

      onlineStatus: true
    };
  },
  computed: {
    /**
     * Método para filtrar o status por nome
     */
    filteredList() {
      return this.listBoards.filter((status) => {
        if (status.nome.toLowerCase().includes(this.search.toLowerCase())) {
          return status.nome.toLowerCase().includes(this.search.toLowerCase());
        }
      });
    },
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
  methods: {
    /**
     * Atualiza a propriedade "cardIsNowActive" com o objeto "card" que representa um card reativado.
     * @param {Object} card - Objeto que representa um cartão reativado.
     */
    onCardReativado(card) {
      this.cardIsNowActive = card;
    },

    /**
     * Adiciona um objeto "request" que representa uma solicitação de edição de card à fila de solicitações.
     * @param {Function} request - Função que representa a solicitação de edição de card.
     */
    onNewRequest(request) {
      this.addToRequestQueue(request);
    },

    /**
     * Adiciona a solicitação "request" à fila de solicitações e inicia a execução da próxima solicitação.
     * @param {Function} request - Função que representa a solicitação de edição de card.
     */
    async addToRequestQueue(request) {
      this.requestEditCardQueue.push(request);
      await this.executeNextRequest();
    },

    /**
     * Executa a próxima solicitação da fila, se houver, e trata erros de forma adequada.
     */
    async executeNextRequest() {
      if (this.isRequestingEditCard || this.requestEditCardQueue.length === 0) {
        return;
      }
      this.isRequestingEditCard = true;
      const request = this.requestEditCardQueue.shift();
      try {
        await request();
      } catch (err) {
        ToastTopStart5.fire("Erro!", err.response.data.message, "error");
      } finally {
        this.isRequestingEditCard = false;
        await this.executeNextRequest();
      }
    },

    /**
     * Adiciona uma função "func" à fila para alterar a posição de um cartão.
     * @param {Function} func - Função que altera a posição de um cartão.
     */
    onChangeCardPos(func) {
      this.addToFuncQueue(func);
    },

    /**
     * Adiciona uma função "func" à fila de funções para alterar a posição de cartões.
     * @param {Function} func - Função que altera a posição de um cartão.
     */
    async addToFuncQueue(func) {
      this.cardsToChangePos.push(func);
      await this.executeNextFunc();
    },

    /**
     * Executa a próxima função na fila de funções para alterar a posição de cartões.
     */
    async executeNextFunc() {
      if (this.isChangingCardPos || this.cardsToChangePos.length === 0) {
        return;
      }
      this.isChangingCardPos = true;
      const func = this.cardsToChangePos.shift();
      try {
        await func();
      } catch (err) {
        console.error(err);
      } finally {
        this.isChangingCardPos = false;
        await this.executeNextFunc();
      }
    },

    /**
     * Atualiza os comentários em um cartão. Se o cartão já estiver na lista de cartões a inativar, atualiza seus comentários nessa lista. Caso contrário, atualiza os comentários no objeto "editedCardComment".
     * @param {Object} cardObj - Objeto que representa um cartão e seus comentários.
     */
    onEditComment(cardObj) {
      let inCardToInativeList = false;
      this.cardsToInativeList.forEach((card) => {
        if (cardObj.id_card === card.id_card) {
          card.comentarios = cardObj.comentarios;
          inCardToInativeList = true;
        }
      });

      if (!inCardToInativeList) {
        this.editedCardComment = cardObj;
      }
    },

    /**
     * Método chamado quando um card que não possui mais status é deletado
     * @param {Object} card
     */
    onCardDeleted(card) {
      // Procura o índice do card na lista de cards inativos
      let cardIndex = this.inativeCardsList.findIndex(
        (obj) => obj.id_card === card.id_card
      );
      // Remove o card da lista de cards inativos
      this.inativeCardsList.splice(cardIndex, 1);
    },

    /**
     * Método que é chamado quando um card editado está numa lista errada
     * para nas outras telas esse card também mover de lista
     * @param {Object} card
     */
    onCardInWrongList(card) {
      // Define o card como o novo card a ser adicionado à lista correta
      this.newCard = card;
    },

    /**
     * Método chamado quando um card inativo é ativado novamente
     * @param {Object} card
     * @param {boolean} fromPusher - Parâmetro opcional que indica se o evento foi disparado pelo Pusher
     */
    onTurnCardActive(card, fromPusher = false) {
      // Procura o índice do status do card na lista de status dos quadros
      let statusIndex = this.listBoards.findIndex(
        (obj) => obj.id_status === card.id_status
      );

      // Se o status não for encontrado, exibe uma mensagem de erro e retorna
      if (statusIndex === -1) {
        const firstStatus = this.listBoards[0];

        card.id_status = firstStatus.id_status;
      }

      // Exibe uma mensagem de sucesso para o usuário
      ToastTopStart5.fire(
        "Sucesso!",
        "O card " +
          this.tiposMovimento[card.tipo] +
          "(" +
          card.id_movimento +
          ") está ativo novamente.",
        "success"
      );

      // Se o evento não foi disparado pelo Pusher, faz uma requisição PUT para atualizar o card no servidor
      if (fromPusher === false) {
        let body = {
          id_status: card.id_status,
          posicao: card.posicao,
          ativo: 1,
          comentarios: card.comentarios,
        };

        this.axios
          .put(`${window.API_V2}/pipeline/cards/${card.id_card}/edit`, body)
          .then((res) => {})
          .catch((err) => {
            ToastTopStart5.fire("Erro!", err.response.data.message, "error");
          });
      }

      // Define o card como o novo card a ser adicionado à lista correta
      this.newCard = card;
    },

    /**
     * Método para abrir e fechar a modal de cards inativos
     */
    toggleModalInativeCards() {
      this.isShowingModalInativeCardList = !this.isShowingModalInativeCardList;
    },

    /**
     *
     * Método chamado para abrir a modal de edição de comentários de um card que está na lista
     * para transformar o card em inative
     * @param {Object} card
     */
    async toggleModalEditComments(card) {
      if (this.isShowingModalEditComments === true) {
        this.isShowingModalEditComments = false;
        if (this.fromInactiveCards === true) this.toggleModalInativeCards();
      } else if (this.isShowingModalEditComments === false) {
        if (this.isShowingModalInativeCardList === true) {
          this.isShowingModalInativeCardList = false;
          this.fromInactiveCards = true;
        } else {
          this.fromInactiveCards = false;
        }

        this.isShowingModalEditComments = true;
      }

      this.cardIsEditing = card;

      if (this.isShowingModalEditComments === true) {
        await nextTick();
        this.$refs.modalEditCommentsRef.$refs.textareaRef.focus();
      }
    },

    /**
     * Método para remover o card da lista para inativo e colocar na lista de inativos
     * @param {Object} card
     */
    async onPutCardToInative(card) {
      this.onChangeCardPos(async () => {
        let cardIndex = this.cardsToInativeList.findIndex(
          (obj) => obj.id_card === card.id_card
        );

        if (cardIndex === -1) return;

        const childrenList = this.$refs.listInativeRef.$children;
        const childrenIndex = childrenList.findIndex(
          (obj) => obj.card.id_card === card.id_card
        );
        const element = childrenList[childrenIndex].$el;

        await new Promise((resolve) => {
          this.animaElementSumindo(element, resolve);
        });

        await this.cardsToInativeList.splice(cardIndex, 1);
      });
    },

    async animaElementSumindo(element, callback, scroll = true) {
      element.style.transition = "all 0.2s ease";

      if (scroll) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }

      element.style.transform = "scale(1.02)";
      element.style.opacity = "0.8";

      setTimeout(() => {
        element.style.transform = "scale(0)";
        element.style.opacity = "1";
      }, 600);

      setTimeout(() => {
        callback();
      }, 800);
    },

    /**
     * Método que é chamado para abrir ou fechar a modal de criação de status, ele pega a referencia do input,
     * de dentro do componente filho, faz o foco e anima a bolinha para balançar
     */
    async toggleModalCreateStatusFunc() {
      if (this.isShowingModalCreateStatus === false) {
        this.isShowingModalCreateStatus = true;
        await nextTick();
        this.$refs.sideModalCreate.$refs.regStatusNameRef.focus();
        this.animated = true;
        setTimeout(() => {
          this.animated = false;
        }, 1000);
      } else {
        this.isShowingModalCreateStatus = false;
      }
    },

    /**
     * Método para requisitar e setar a lista de status e cards
     */
    setList() {
      this.isRequesting = true;
      this.axios
        .get(`${window.API_V2}/pipeline/list`)
        .then((res) => {
          this.listBoards = res.data;

          // Remove o último índice que contém de qual empresa é essa lista, esse
          // dado é usado para cadastrar os canais do Pusher
          this.idEmpresa =
            this.listBoards[this.listBoards.length - 1].id_empresa;
          this.listBoards.splice(this.listBoards.length - 1, 1);

          // Calcula e adiciona a ordem para cada status
          if (this.listBoards.length > 0) {
            let ordem = 1;
            this.listBoards.forEach((status) => {
              if (status.cards !== null) {
                status.cards = JSON.parse(status.cards);
              } else if (status.cards === null) {
                status.cards = [];
              }
              status["ordem"] = ordem;
              ordem++;
            });

            // Pega qual é a última lista, para fazer os cálculos da linhas entre os status
            this.lastList = this.listBoards[this.listBoards.length - 1];
          }

          // da a ordem da última lista como 0, caso não tenha listas na resposta
          if (this.listBoards.length === 0) {
            this.lastList = {
              ordem: 0,
            };
          }

          this.bindChannels();
        })
        .catch((err) => {
          ToastTopStart5.fire("Erro!", err.response.data.message, "error");
        });
    },

    async calculaOrdem() {
      let ordem = 1;
      this.listBoards.forEach((status) => {
        status.ordem = ordem;
        ordem++;
      });
    },

    /**
     * Método que é chamado quando um status é criado, ele coloca o novo status na lista,
     * adiciona a ordem dele recalculando a ordem de todos
     */
    onStatusCreated(newStatus) {
      ToastTopEnd5.fire(
        "Opa!",
        `O status ${newStatus.nome} foi criado!`,
        "info"
      );
      this.listBoards.push(newStatus);
      this.calculaOrdem();

      // Pega a última lista novamente
      this.lastList = this.listBoards[this.listBoards.length - 1];
    },

    /**
     * Método que é chamado quando um status é deletado, ele procura pelo indice do status, o remove da lista
     * e recalcula a ordem dos status
     */
    onStatusDeleted(list) {
      let index = this.listBoards.indexOf(list);
      if (index === -1) return;

      ToastTopEnd5.fire("Opa!", `O status ${list.nome} foi inativado!`, "info");
      this.listBoards.splice(index, 1);
      this.calculaOrdem();

      // Pega a última lista novamente
      this.lastList = this.listBoards[this.listBoards.length - 1]
        ? this.listBoards[this.listBoards.length - 1]
        : { ordem: 0 };
    },

    /**
     * Método para bindar os canais do Pusher, e escutar os novos cards criados
     * e escutar os novos status criados, concatenando com o id da empresa correspondente
     */
    async bindChannels() {
      try {
        // Se inscreve no canal da empresa
        this.pipelinePusher = this.$pusher.subscribe(
          "private-company-" + this.idEmpresa
        );

        this.pusherSessionID = this.pipelinePusher.pusher.sessionID;

        // Escuta evento card-criado
        this.pipelinePusher.bind("card-criado", (data) => {
          if (data[0]) {
            const newCard = data[0];
            newCard.posicao = parseFloat(newCard.posicao);
            newCard.valor = parseFloat(newCard.valor);

            this.newCard = newCard;
          }
        });

        // Escuta evento card-editado
        this.pipelinePusher.bind("card-editado", (data) => {
          if (data["card"]) {
            if (data["pusherSessionID"] !== this.pusherSessionID) {
              const editedCard = data["card"][0];

              editedCard.posicao = parseFloat(editedCard.posicao);
              editedCard.valor = parseFloat(editedCard.valor);

              let index = this.cardsToInativeList.findIndex(
                (obj) => obj.id_card === editedCard.id_card
              );
              if (index !== -1) {
                this.cardsToInativeList.splice(index, 1);
                this.newCard = editedCard;
                return;
              }

              this.editedCardComment = editedCard;
              this.editedCard = editedCard;
            }
          }
        });

        // Escuta evento card-editado-status
        this.pipelinePusher.bind("card-editado-status", (data) => {
          if (data["card"]) {
            if (data["pusherSessionID"] !== this.pusherSessionID) {
              const editedCardStatus = data["card"][0];

              editedCardStatus.posicao = parseFloat(editedCardStatus.posicao);
              editedCardStatus.valor = parseFloat(editedCardStatus.valor);

              this.editedCardStatus = editedCardStatus;
            }
          }
        });

        this.pipelinePusher.bind("status-criado", (data) => {
          if (data.id_status) {
            const newStatus = data;

            newStatus["cards"] = [];
            this.onStatusCreated(newStatus);
          }
        });

        this.pipelinePusher.bind("status-editado", (data) => {
          if (data.id_status) {
            const editedStatus = data;

            this.listBoards.forEach((status) => {
              if (status.id_status === editedStatus.id_status) {
                status.nome = editedStatus.nome;
                status.color = editedStatus.color;
                status.ativo = editedStatus.ativo;
                if (editedStatus.ativo === 0) {
                  this.onStatusDeleted(status);
                }
              }
            });
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.isRequesting = false;
      }
    },

    /**
     * Método que pega uma cor em HEX e retorna uma cor de texto que fica com contraste
     * @param {String} background
     */
    ajustarCorTexto(background) {
      // Converta a cor de fundo em RGB
      const r = parseInt(background.substr(1, 2), 16);
      const g = parseInt(background.substr(3, 2), 16);
      const b = parseInt(background.substr(5, 2), 16);

      // Determine o brilho usando a fórmula de luminosidade relativa
      const brilho = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

      // Defina a cor do texto com base no brilho
      const corTexto = brilho > 0.5 ? "#000000" : "#FFFFFF";

      return corTexto;
    },

    /**
     * Método para verificar e enviar o Toast caso a conexão tenha caído
     */
    verificaOfflineStatus(){
      this.onlineStatus = navigator.onLine;

      if(this.onlineStatus === false){
        ToastConfirmCenter.fire("Eita!", "Parece que você perdeu sua conexão com a internet. Quaisquer modificações feitas no pipeline não serão salvas!", "warning");
      }
    },

    /**
     * Método para verificar e enviar o Toast caso a conexão tenha retornado
     */
    verificaOnlineStatus(){
      this.onlineStatus = navigator.onLine;

      if(this.onlineStatus === true){
        ToastConfirmCenter.fire("Opa!", "Sua conexão voltou!", "success");
      }
    }
  },
  mounted() {
    this.setList();

    // Pega a data atual e formata para fazer o cálculo dos dias dos cards
    let dataAtual = new Date();
    let ano = dataAtual.getFullYear();
    let mes = ("0" + (dataAtual.getMonth() + 1)).slice(-2);
    let dia = ("0" + dataAtual.getDate()).slice(-2);
    let dataFormatada = `${ano}-${mes}-${dia}`;
    this.dataHoje = dataFormatada;

    // Adiciona os eventListeners de internet off e on, para verificar e avisar ao usuário
    window.addEventListener('online', this.verificaOnlineStatus);
    window.addEventListener('offline', this.verificaOfflineStatus);
  },
};
</script>

<style scoped>
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

::-webkit-scrollbar {
  background-color: transparent;
  width: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #aeaeae;
  border-radius: 5px;
}
</style>

<style src="../assets/all.css"></style>
<style src="../assets/tooltip.css"></style>
