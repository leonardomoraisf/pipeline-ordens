<template>
    <div class="flex flex-col h-screen bg-white relative text-center">

        <div class="shrink-0 p-4">
            <button class="float-left hover:scale-125 back-button" v-tooltip.bottom-end="'Voltar'">
                <a href="/app/vendas/nova-venda" class="text-base font-semibold"><font-awesome-icon class="w-10 h-10"
                        :icon="['fas', 'fa-arrow-left']" /></a>
            </button>

            <div class="flex flex-col align-middle items-center">
                <h1 class="text-2xl text-black font-bold">Pipeline das ordens de serviços</h1>
            </div>

            <div class="shrink-0 flex justify-center bg-white px-4 py-3 container mx-auto">
                <input
                    class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                    v-model="search" type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
            </div>

        </div>

        <LoadingSkeleton v-if="isRequesting"></LoadingSkeleton>

        <main class="flex-1 overflow-hidden" v-if="!isRequesting && search.length === 0">
            <div class="flex flex-col h-full">

                <div class="flex-1 overflow-x-auto mt-8">

                    <div class="inline-flex h-full items-start px-4 pb-4">
                        <CardList v-for="list in listBoards" :key="list.id_status" :list="list" :lastList="lastList"
                            class="w-72 flex flex-col rounded-md pt-2 max-h-full" :ajustarCorTexto="ajustarCorTexto"
                            :idEmpresa="idEmpresa" :newCard="newCard" :editedCard="editedCard"
                            @statusDeleted="onStatusDeleted" :dataHoje="dataHoje" @cardInWrongList="onCardInWrongList"
                            @cardIsNowInative="onCardIsNowInative"/>

                        <div class="flex flex-col rounded-md py-2 max-h-full w-72">

                            <!-- Essa div abaixo aparece assim que o usuário cria mais de três status, 
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
                            <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                                @click="toggleModalCreateStatusFunc" v-if="listBoards.length > 3"
                                v-tooltip="'Adicione um novo status'">

                                <div class="flex h-8 max-h-8 items-center justify-center mt-3">
                                    <div
                                        class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0">
                                        <font-awesome-icon :icon="['fas', 'fa-plus']" />
                                    </div>
                                </div>

                            </div>

                            <!-- Essa div abaixo some assim que o usuário cria mais de três status, 
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
                            <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                                @click="toggleModalCreateStatusFunc" v-if="listBoards.length <= 3">

                                <div class="flex h-8 max-h-8 items-center justify-center mt-3">
                                    <h3 class="text-base font-semibold">Adicione um novo
                                        status</h3>
                                </div>

                            </div>

                            <SideModal :list="{ id_status: 0 }" :lastList="lastList"
                                :toggleModal="isShowingModalCreateStatus" @closeModal="toggleModalCreateStatusFunc"
                                :animated="animated" :colorStatusText="'#FFFFFF'" ref="sideModalCreate"
                                :ajustarCorTexto="ajustarCorTexto" class="mb-2">
                            </SideModal>

                            <div @click="openModalInativeCards"
                                class="pb-3 hover:cursor-pointer relative h-screen flex flex-col overflow-hidden px-2 mt-48 border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50"
                                v-tooltip="'Clique para visualizar os cards inativos'">
                                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar" ref="listRef">
                                    <Draggable v-model="cardsToInativeList" group="cards"
                                        class="space-y-3 pb-24 h-full draggable pt-2" tag="ul" id="table-delete"
                                        drag-class="drag" ghost-class="ghost" handle=".drag-card" ref="listInativeRef">

                                        <CardListItem v-for="card in cardsToInativeList" :key="card.id_card" :card="card"
                                            :colorStatus="'#71717A'" :ajustarCorTexto="ajustarCorTexto"
                                            :corTextoCard="'#FFFFFF'" :dataHoje="dataHoje" :isToInative="true"
                                            @putCardToInative="onPutCardToInative"
                                            @openModalEditComments="toggleModalEditComments" />

                                        <div class="absolute inset-0 flex items-center justify-center trash" slot="header">
                                            <p class="text-xl px-1">Para remover cards do pipeline, arraste para cá</p>
                                            <div class="invisible absolute">
                                                <font-awesome-icon class="w-7 h-7" :icon="['fas', 'fa-trash']" />
                                            </div>
                                        </div>

                                    </Draggable>

                                </div>
                            </div>

                            <ModalEditCardComments :cardIsEditing="cardIsEditing" :toggleModal="isShowingModalEditComments"
                                :colorStatus="'#71717A'" :corTextoCard="'#FFFFFF'" :inInativeCards="false"
                                ref="modalEditCommentsRef" @closeModalEditComments="toggleModalEditComments"
                                :dataHoje="dataHoje"></ModalEditCardComments>

                            <ModalInativeCardList :list="listBoards" :toggleModal="isShowingModalInativeCardList"
                                :inativeCardsList="inativeCardsList" :dataHoje="dataHoje"
                                @closeModalInativeCardList="closeModalInativeCards"
                                @openModalEditComments="toggleModalEditComments" @turnCardActive="onTurnCardActive"
                                :ajustarCorTexto="ajustarCorTexto" @cardDeleted="onCardDeleted"
                                :isRequesting="isRequestingInativeCardList" :isRequestingMore="isRequestingMoreInativeCards"
                                @nextPagInativeCards="requestInativeCards">
                            </ModalInativeCardList>

                        </div>

                    </div>
                </div>
            </div>
            <vue-confirm-dialog></vue-confirm-dialog>
        </main>

    </div>
</template>

<script>
import SideModal from './SideModal.vue';
import CardList from './CardList.vue';
import Draggable from 'vuedraggable';;
import LoadingSkeleton from './LoadingSkeleton'
import { ref, nextTick } from "vue";
import ModalEditCardComments from './ModalEditCardComments.vue';
import CardListItem from './CardListItem.vue';
import ModalInativeCardList from './ModalInativeCardList.vue';

export default {
    name: 'BoardKanban',
    components: {
        SideModal,
        CardList,
        Draggable,
        LoadingSkeleton,
        ModalEditCardComments,
        CardListItem,
        ModalInativeCardList
    },
    data() {
        return {
            listBoards: [],
            lastList: {},
            isRequesting: ref(true),
            isShowingModalCreateStatus: ref(false),
            animated: ref(false),
            idEmpresa: '',
            newCard: {},
            editedCard: {},
            search: '',
            dataHoje: '',
            inativeCardsList: [],
            cardsToInativeList: [],
            isShowingModalEditComments: ref(false),
            cardIsEditing: {},
            isShowingModalInativeCardList: ref(false),
            isRequestingInativeCardList: ref(false),
            isRequestingMoreInativeCards: ref(false),
            dataRequestInativeCardList: [],
            qtdRequests: 1
        }
    },
    computed: {
        /**
         * Método para filtrar o status por nome
         */
        filteredList() {
            return this.listBoards.filter(status => {
                return status.nome.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    methods: {
        /**
         * Método chamado quando um card que não possui mais status é deletado
         * @param {Object} card 
         */
        onCardDeleted(card) {
            let cardIndex = this.inativeCardsList.findIndex(obj => obj.id_card === card.id_card);
            this.inativeCardsList.splice(cardIndex, 1);
        },
        /**
         * Método chamado quando um card recebido do pusher agora está inativo
         * esse método joga o card para a lista de cards inativos
         * @param {Object} card 
         */
        onCardIsNowInative(card) {
            this.inativeCardsList.push(card);
        },
        /**
         * Método que é chamado quando um card editado está numa lista errada
         * para nas outras telas esse card também mover de lista
         * @param {Object} card 
         */
        onCardInWrongList(card) {
            this.newCard = card;
        },
        onTurnCardActive(card) {
            let statusIndex = this.listBoards.findIndex(obj => obj.id_status === card.id_status);
            if (statusIndex === -1) return ToastTopStart5.fire('Erro!', 'O status em que esse card estava foi removido do pipeline!', 'error');

            // Toast para o usuário
            ToastTopStart5.fire('Sucesso!', 'O card de ' + card.nome + ' está ativo novamente!', 'success');

            let body = {
                id_status: card.id_status,
                posicao: card.posicao,
                ativo: 1,
                comentarios: card.comentarios
            };

            this.axios.put("/v2/pipeline/cards/" + card.id_card + "/edit", body)
                .then(res => {

                })
                .catch(err => {
                })

            // Tira o card da lista de cards inativos
            let cardIndex = this.inativeCardsList.findIndex(obj => obj.id_card === card.id_card);
            this.inativeCardsList.splice(cardIndex, 1);

            // Manda o card como novo card, para ele voltar para sua lista
            this.newCard = card;
        },
        requestInativeCards() {
            if (this.qtdRequests === 1) {
                this.isRequestingInativeCardList = true;
                this.axios.get('/v2/pipeline/cards/inactive')
                    .then(res => {
                        const data = res.data;
                        this.inativeCardsList = data.data;

                        delete data.data;
                        this.dataRequestInativeCardList = data;

                        this.inativeCardsList.forEach(card => {
                            card.posicao = parseFloat(card.posicao);
                            card.valor = parseFloat(card.valor);
                        });
                        this.isRequestingInativeCardList = false;
                        this.qtdRequests += 1;
                    })
                    .catch(err => {
                        ToastTopStart5.fire('Erro!', err.data, 'error');
                    })
            } else if (this.qtdRequests > 1) {
                if (this.dataRequestInativeCardList.next_page_url === null) return;

                this.isRequestingMoreInativeCards = true;
                let url = this.dataRequestInativeCardList.next_page_url;
                this.axios.get(url.substring(22))
                    .then(res => {
                        const data = res.data;

                        const cards = data.data;
                        cards.forEach(card => {
                            card.posicao = parseFloat(card.posicao);
                            card.valor = parseFloat(card.valor);
                        });
                        this.inativeCardsList = this.inativeCardsList.concat(cards);

                        delete data.data;
                        this.dataRequestInativeCardList = data;

                        this.isRequestingMoreInativeCards = false;
                    })
                    .catch(err => {
                        ToastTopStart5.fire('Erro!', err.data, 'error');
                    })
            }
        },
        /**
         * Método para abrir a modal de cards inativos
         */
        openModalInativeCards() {
            this.isShowingModalInativeCardList = true;
            this.requestInativeCards();
        },
        /**
         * Método para echar a modal de cards inativos
         */
        closeModalInativeCards() {
            this.isShowingModalInativeCardList = false;
        },
        /**
         * 
         * Método chamado para abrir a modal de edição de comentários de um card que está na lista
         * para transformar o card em inative
         * @param {Object} card 
         */
        async toggleModalEditComments(card) {
            this.isShowingModalEditComments = !this.isShowingModalEditComments;
            this.cardIsEditing = card;

            if (this.isShowingModalInativeCardList === true) {
                this.isShowingModalInativeCardList = false;
            }

            if (this.isShowingModalEditComments === true) {
                await nextTick();
                this.$refs.modalEditCommentsRef.$refs.textareaRef.focus();
            }
        },
        /**
         * Método para remover o card da lista para inativo e colocar na lista de inativos
         * @param {Object} card 
         */
        onPutCardToInative(card) {
            let cardIndex = this.cardsToInativeList.findIndex(obj => obj.id_card === card.id_card);

            const childrenList = this.$refs.listInativeRef.$children;
            const childrenIndex = childrenList.findIndex(obj => obj.card.id_card === card.id_card);
            const element = childrenList[childrenIndex].$el;

            element.style.transition = "transform 0.2s ease-in-out";
            element.style.transform = "scale(1.05)";

            setTimeout(() => {
                element.style.transition = "transform 1s ease-in-out";
                element.style.transform = "scale(0)";
            }, 500);

            setTimeout(() => {
                this.cardsToInativeList.splice(cardIndex, 1);

                this.inativeCardsList.push(card);
            }, 2000);
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
            this.axios.get('/v2/pipeline/list')
                .then(res => {
                    this.listBoards = res.data;

                    // Remove o último índice que contém de qual empresa é essa lista, esse
                    // dado é usado para cadastrar os canais do Pusher
                    this.idEmpresa = this.listBoards[this.listBoards.length - 1].id_empresa;
                    this.listBoards.splice(this.listBoards.length - 1, 1);

                    // Transforma as informações dos cards inativos para float
                    if (this.inativeCardsList.length > 0) {
                        this.inativeCardsList.forEach(card => {
                            card.posicao = parseFloat(card.posicao);
                            card.valor = parseFloat(card.valor);
                        })
                    }

                    // Calcula e adiciona a ordem para cada status
                    if (this.listBoards.length > 0) {
                        let ordem = 1;
                        this.listBoards.forEach(status => {
                            if (status.cards !== null) {
                                status.cards = JSON.parse(status.cards);
                            } else if (status.cards === null) {
                                status.cards = [];
                            }
                            status['ordem'] = ordem;
                            ordem++;
                        });

                        // Pega qual é a última lista, para fazer os cálculos da linhas entre os status
                        this.lastList = this.listBoards[this.listBoards.length - 1];
                    }

                    // da a ordem da última lista como 0, caso não tenha listas na resposta
                    if (this.listBoards.length === 0) {
                        this.lastList = {
                            ordem: 0
                        }
                    }

                    this.isRequesting = false;
                    this.bindChannels();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        calculaOrdem() {
            let novaOrdem = 1;
            this.listBoards.forEach(status => {
                status['ordem'] = novaOrdem;
                novaOrdem++;
            });
        },
        /**
         * Método que é chamado quando um status é criado, ele coloca o novo status na lista,
         * adiciona a ordem dele recalculando a ordem de todos
         */
        onStatusCreated(newStatus) {
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
            if (index !== -1) {
                this.listBoards.splice(index, 1);
            }

            this.calculaOrdem();

            // Pega a última lista novamente
            this.lastList = this.listBoards[this.listBoards.length - 1];
        },
        /**
         * Método para bindar os canais do Pusher, e escutar os novos cards criados 
         * e escutar os novos status criados, concatenando com o id da empresa correspondente
         */
        bindChannels() {
            /*
            // Se inscreve no canal
            var pipeline = this.$pusher.subscribe('pipeline.' + this.idEmpresa);

            // Escuta evento card-criado
            pipeline.bind('card-criado', (data) => {
                const newCard = data.card[0];
                this.newCard = newCard;
            });

            // Escuta evento card-editado
            pipeline.bind('card-editado', (data) => {
                if (data.pusher === true) {
                    const editedCard = data.card[0];

                    // Verifica se o card editado tem o ativo === 1 para verificar se ele está na lista de cards inativos
                    // Se sim, ele retira da lista e joga como novo card
                    // Se não, ele só envia como card editado
                    if (editedCard.ativo === 1) {
                        this.editedCard = editedCard;

                    } else if (editedCard.ativo === 0) {
                        let cardIndex = this.inativeCardsList.findIndex(obj => obj.id_card === editedCard.id_card);
                        if (cardIndex !== -1) return this.editedCard = editedCard;

                        // Atualiza
                        editedCard.posicao = parseFloat(editedCard.posicao);
                        editedCard.valor = parseFloat(editedCard.valor);
                        this.inativeCardsList[cardIndex] = editedCard;
                    }
                }
            });

            pipeline.bind('status-criado', (data) => {
                if (data.pusher === true) {
                    const newStatus = data.status;

                    newStatus['cards'] = [];
                    this.onStatusCreated(newStatus);
                }
            });

            pipeline.bind('status-editado', (data) => {
                if (data.pusher === true) {
                    const editedStatus = data.status;

                    this.listBoards.forEach(status => {
                        if (status.id_status === editedStatus.id_status) {
                            status.nome = editedStatus.nome;
                            status.color = editedStatus.color;
                        }
                    })
                }
            });
            */
        },
        /**
         * Método para ajustar a cor do texto de acordo com o backgroud do status
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
            const corTexto = brilho > 0.5 ? '#000000' : '#FFFFFF';

            return corTexto;
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
    }
}
</script>

<style scoped>
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

<style>
.container {
    max-width: 100% !important;
}

.add {
    transition: all .2s ease-in-out;
}

.hollow-dots-spinner,
.hollow-dots-spinner * {
    box-sizing: border-box;
}

.hollow-dots-spinner {
    height: 15px;
    width: calc(30px * 3);
}

.hollow-dots-spinner .dot {
    width: 15px;
    height: 15px;
    margin: 0 calc(15px / 2);
    border: calc(15px / 5) solid #2563eb;
    border-radius: 50%;
    float: left;
    transform: scale(0);
    animation: hollow-dots-spinner-animation 1000ms ease infinite 0ms;
}

.hollow-dots-spinner .dot:nth-child(1) {
    animation-delay: calc(300ms * 1);
}

.hollow-dots-spinner .dot:nth-child(2) {
    animation-delay: calc(300ms * 2);
}

.hollow-dots-spinner .dot:nth-child(3) {
    animation-delay: calc(300ms * 3);

}

@keyframes hollow-dots-spinner-animation {
    50% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

half-circle-spinner,
.half-circle-spinner * {
    box-sizing: border-box;
}

.half-circle-spinner {
    width: 40px;
    height: 40px;
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

.back-button {
    transition: all .2s ease;
}


.tooltip {
    display: block !important;
    z-index: 10000;
}

.tooltip .tooltip-inner {
    background: #45b6af;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #45b6af;
    z-index: 1;
}

.tooltip[x-placement^="top"] {
    margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
    margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
    margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip[x-placement^="left"] {
    margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip.popover .popover-inner {
    background: #f9f9f9;
    color: black;
    padding: 24px;
    border-radius: 5px;
    box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
    border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
}

.vc-overlay {
    background-color: rgba(0, 0, 0, 0.25) !important;
}

.vc-container {
    width: 512px !important;
    width: 512px !important;
    border-radius: 0.375rem !important;
}

.vc-btn-grid {
    border-radius: 0 0 0.375rem 0.375rem !important;
}

.vc-btn:nth-of-type(2) {
    color: white !important;
    background-color: rgba(229, 17, 17, 0.9) !important;
    border-radius: 0 0 0 0.375rem !important;
}

.vc-btn:nth-of-type(2):hover {
    background-color: rgba(229, 17, 17, 0.7) !important;
}

.vc-btn:nth-of-type(1) {
    color: white !important;
    background-color: rgb(22 163 74 / 0.9) !important;
    border-radius: 0 0 0, 375rem 0 !important;
}

.vc-btn:nth-of-type(1):hover {
    background-color: rgb(22 163 74 / 0.7) !important;
}

.vc-text {
    font-size: 2rem !important;
    line-height: 2rem !important;
    font-weight: 500 !important;
}

.trash {
    transition: all .2s ease;
}
</style>