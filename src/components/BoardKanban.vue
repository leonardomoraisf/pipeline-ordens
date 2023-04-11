<template>
    <div class="flex flex-col h-screen bg-white relative text-center">

        <div class="shrink-0 p-4">
            <button class="float-left hover:scale-125 back-button" v-tooltip.bottom-end="'Voltar'">
                <a href="/app/vendas/nova-venda" class="text-base font-semibold"><font-awesome-icon class="w-10 h-10"
                        :icon="['fas', 'fa-arrow-left']" /></a>
            </button>

            <div class="flex flex-col align-middle items-center">
                <h1 class="text-2xl text-black font-bold">Pipeline das ordens de serviços</h1>

                <button class="px-3 py-2 font-medium text-sm text-gray-900 rounded-md flex justify-center">
                    <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-play']" />
                    <span class="ml-1">Tutorial</span>
                </button>
            </div>

            <div class="shrink-0 flex justify-center bg-white px-4 py-3 container mx-auto" v-if="!isRequesting">
                <input
                    class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                    v-model="search" type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
                <button
                    class="bg-gray-500 hover:bg-gray-600 text-white font-normal ml-4 py-2 px-8 rounded focus:outline-none focus:shadow-outline text-2xl hover:scale-110 transition-all"
                    type="button">
                    Buscar
                </button>
            </div>

            <div class="shrink-0 flex justify-center bg-white px-4 py-3 container mx-auto" v-if="isRequesting">
                <input
                    class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                    type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
                <button
                    class="bg-gray-500 hover:bg-gray-600 text-white font-normal ml-4 py-2 px-8 rounded focus:outline-none focus:shadow-outline text-2xl hover:scale-110 transition-all"
                    type="button">
                    Buscar
                </button>
            </div>

        </div>

        <div class="flex-1 overflow-hidden" v-if="search.length > 0">
            <div class="flex flex-col h-full">

                <div class="flex-1 overflow-x-auto mt-8">

                    <div class="inline-flex h-full items-start px-4 pb-4">
                        <CardList v-for="status in filteredStatus" :key="status.id_status" :list="status" :setList="setList"
                            :lastList="lastList" class="w-72 flex flex-col rounded-md p-2 max-h-full"
                            :ajustarCorTexto="ajustarCorTexto" :idEmpresa="idEmpresa" :newCard="newCard" />

                        <div class="flex flex-col rounded-md p-2 max-h-full w-72">

                            <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                                @click="openModalCreateStatusFunc">
                                <div class="flex items-center justify-center">
                                    <div
                                        class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0">
                                        <font-awesome-icon :icon="['fas', 'fa-plus']" />
                                    </div>
                                </div>
                                <div class="mt-3 flex justify-center text-center h-8 max-h-8">
                                    <!-- Esse texto abaixo some assim que o usuário cria mais de três status, 
                                        pois já, pelo menos aparentemente, aprendeu a usar -->
                                    <h3 class="text-base font-semibold" v-if="listBoards.length <= 3">Adicione um novo
                                        status</h3>
                                </div>
                            </div>

                            <SideModal :list="{ id_status: 0 }" :lastList="lastList" :toggleModal="toggleModalCreateStatus"
                                @closeModal="closeModalCreateStatusFunc" :animated="animated" :colorStatusText="'#FFFFFF'"
                                @statusCreated="onStatusCreated" ref="sideModalCreate" :ajustarCorTexto="ajustarCorTexto">
                            </SideModal>

                            <Draggable v-if="listBoards.length > 0" group="cards"
                                class="relative mt-40 w-full h-screen flex justify-center items-center text-center border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50 font-semibold text-xl"
                                handle=".drag-card" id="table-delete" drag-class="drag" ghost-class="ghost-delete" tag="ul">

                                <div class="absolute h-full w-full flex items-center justify-center trash">
                                    <p>Para remover do pipeline, arraste para cá</p>
                                    <div class="invisible absolute">
                                        <font-awesome-icon class="w-7 h-7" :icon="['fas', 'fa-trash']" />
                                    </div>
                                </div>

                            </Draggable>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LoadingSkeleton v-if="isRequesting"></LoadingSkeleton>

        <main class="flex-1 overflow-hidden" v-if="!isRequesting && search.length === 0">
            <div class="flex flex-col h-full">

                <div class="flex-1 overflow-x-auto mt-8">

                    <div class="inline-flex h-full items-start px-4 pb-4">
                        <CardList v-for="list in listBoards" :key="list.id_status" :list="list" :setList="setList"
                            :lastList="lastList" class="w-72 flex flex-col rounded-md p-2 max-h-full"
                            :ajustarCorTexto="ajustarCorTexto" :idEmpresa="idEmpresa" :newCard="newCard" />

                        <div class="flex flex-col rounded-md p-2 max-h-full w-72">

                            <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add"
                                @click="openModalCreateStatusFunc">
                                <div class="flex items-center justify-center">
                                    <div
                                        class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-black/70 p-6 shrink-0">
                                        <font-awesome-icon :icon="['fas', 'fa-plus']" />
                                    </div>
                                </div>
                                <div class="mt-3 flex justify-center text-center h-8 max-h-8">
                                    <!-- Esse texto abaixo some assim que o usuário cria mais de três status, 
                                    pois já, pelo menos aparentemente, aprendeu a usar -->
                                    <h3 class="text-base font-semibold" v-if="listBoards.length <= 3">Adicione um novo
                                        status</h3>
                                </div>
                            </div>

                            <SideModal :list="{ id_status: 0 }" :lastList="lastList" :toggleModal="toggleModalCreateStatus"
                                @closeModal="closeModalCreateStatusFunc" :animated="animated" :colorStatusText="'#FFFFFF'"
                                @statusCreated="onStatusCreated" ref="sideModalCreate" :ajustarCorTexto="ajustarCorTexto">
                            </SideModal>

                            <Draggable v-if="listBoards.length > 0" group="cards"
                                class="relative mt-40 w-full h-screen flex justify-center items-center text-center border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50 font-semibold text-xl"
                                handle=".drag-card" id="table-delete" drag-class="drag" ghost-class="ghost-delete" tag="ul">

                                <div class="absolute h-full w-full flex items-center justify-center trash">
                                    <p>Para remover do pipeline, arraste para cá</p>
                                    <div class="invisible absolute">
                                        <font-awesome-icon class="w-7 h-7" :icon="['fas', 'fa-trash']" />
                                    </div>
                                </div>

                            </Draggable>

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

export default {
    name: 'BoardKanban',
    components: {
        SideModal,
        CardList,
        Draggable,
        LoadingSkeleton
    },
    data() {
        return {
            listBoards: [],
            lastList: {},
            isRequesting: ref(true),
            toggleModalCreateStatus: ref(false),
            animated: ref(false),
            isMouseOver: ref(false),
            idEmpresa: '',
            newCard: {},
            search: ''
        }
    },
    computed: {
        filteredStatus() {
            return this.listBoards.filter(status => {
                return status.nome.toLowerCase().includes(this.search.toLowerCase());
            })
        }
    },
    methods: {
        mouseOver() {
            this.isMouseOver = true
        },
        mouseOut() {
            this.isMouseOver = false
        },
        async openModalCreateStatusFunc() {
            this.toggleModalCreateStatus = !this.toggleModalCreateStatus;
            await nextTick();
            this.$refs.sideModalCreate.$refs.regStatusNameRef.focus();
            this.animated = true;
            setTimeout(() => {
                this.animated = false;
            }, 1000);
        },
        closeModalCreateStatusFunc() {
            this.toggleModalCreateStatus = !this.toggleModalCreateStatus;
        },
        /**
         * Método para requisitar e setar a lista de status e cards
         */
        setList() {
            this.isRequesting = true;
            this.axios.get('/v2/pipeline/list')
                .then(res => {
                    this.listBoards = res.data;
                    this.idEmpresa = this.listBoards[this.listBoards.length - 1].id_empresa;
                    let index = this.listBoards.indexOf(this.idEmpresa);
                    this.listBoards.splice(index, 1);
                    this.lastList = this.listBoards[this.listBoards.length - 1];
                    this.isRequesting = false;
                    this.bindChannels();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        onStatusCreated(newStatus) {
            this.listBoards.push(newStatus);
            this.lastList = this.listBoards[this.listBoards.length - 1];
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
        },
        bindChannels() {
            var channelCards = this.$pusher.subscribe('new-cards.' + this.idEmpresa);
            channelCards.bind('card-criado', (data) => {
                const newCard = data[0];
                this.newCard = newCard;
            });

            var channelStatus = this.$pusher.subscribe('new-status.' + this.idEmpresa);
            channelStatus.bind('status-criado', (data) => {
                const newStatus = data[0];
                newStatus['cards'] = [];
                this.onStatusCreated(newStatus);
            });
        }
    },
    mounted() {
        this.setList();

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
    border-radius: 0.375rem !important;
}

.vc-btn-grid {
    border-radius: 0 0 0 0 !important;
}

.vc-btn:nth-of-type(1) {
    color: white !important;
    background-color: rgba(229, 17, 17, 0.9) !important;
    border-radius: 0 0 0 0 !important;
}

.vc-btn:nth-of-type(1):hover {
    background-color: rgba(229, 17, 17, 0.7) !important;
}

.vc-btn:nth-of-type(2) {
    color: white !important;
    background-color: rgb(22 163 74 / 0.9) !important;
    border-radius: 0 0 0 0 !important;
}

.vc-btn:nth-of-type(2):hover {
    background-color: rgb(22 163 74 / 0.7) !important;
}

.vc-text {
    font-size: 1.25rem !important;
    line-height: 1.75rem !important;
    font-weight: 500 !important;
}

.trash {
    transition: all .2s ease;
}
</style>