<template>
    <div>
        <transition name="modal">
            <div class="z-50 overflow-x-hidden overflow-y-hidden flex justify-center items-center modal" v-if="toggleModal">
                <div class="relative mx-auto w-full">
                    <div class="bg-white w-full rounded-md h-screen overflow-y-auto" ref="scrollRef"
                        v-on:scroll="checkIfScrolledToEnd">

                        <div
                            class="sticky top-0 z-50 bg-white rounded-t-md border-b-2 border-neutral-100 border-opacity-100 px-4 py-2 dark:border-opacity-50">

                            <div class="flex flex-shrink-0 items-center justify-between py-2">
                                <h5 class="font-semibold text-xl text-gray-900/70">Clique em um card para torná-lo ativo
                                    novamente!</h5>
                                <button type="button"
                                    class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                    @click="closeModal">
                                    <font-awesome-icon class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                                        :icon="['fas', 'fa-close']" />
                                </button>
                            </div>

                        </div>

                        <div class="h-screen flex flex-row bg-white">

                            <div class="w-7/12 pl-4 py-2">
                                <ul class="space-y-2">
                                    <CardListItem v-for="card in filteredInativeCardsList" :key="card.id_card" :card="card"
                                        :colorStatus="card.colorStatus" :corTextoCard="card.corTextoCard"
                                        :dataHoje="dataHoje" :inInativeCardList="true"
                                        @openModalEditComments="$emit('openModalEditComments', card)"
                                        @turnCardActive="$emit('turnCardActive', card)" :existeStatus="card.existeStatus"
                                        @cardDeleted="$emit('cardDeleted', card)" v-if="!isRequesting"></CardListItem>

                                    <p v-if="filteredInativeCardsList.length === 0 && !isRequesting" class="font-semibold text-2xl">Sem
                                        resultados</p>

                                    <div v-if="isRequestingMore" class="flex flex-row justify-center py-4">
                                        <div class="hollow-dots-spinner">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                        </div>
                                    </div>

                                    <div class="flex flex-col justify-center items-center h-full" v-if="isRequesting">
                                        <div class="half-circle-spinner">
                                            <div class="circle circle-1"></div>
                                            <div class="circle circle-2"></div>
                                        </div>
                                        <span class="font-semibold">Carregando</span>
                                    </div>
                                </ul>
                            </div>

                            <div class="w-1/12 flex justify-center h-64">
                                <div class="border border-neutral-200">
                                </div>
                            </div>

                            <div class="w-4/12 rounded-md pt-2 pr-4">
                                <div>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                            <font-awesome-icon class="w-5 h-5 text-gray-500" :icon="['fas', 'fa-search']" />
                                        </div>
                                        <input
                                            class="shadow appearance-none pl-8 pr-4 py-4 rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
                                            v-model="search" @input="filter" name="search" type="text"
                                            placeholder="Pesquisa">
                                    </div>
                                </div>
                                <div class="pt-4 mb-4">
                                    <hr class="border-gray-700" />
                                </div>

                                <div class="space-y-2">
                                    <div class="flex items-center">
                                        <p class="w-10">De:</p>
                                        <input type="date" name="startDate" v-model="startDate" @change="filter"
                                            class="mx-auto">
                                    </div>

                                    <div class="flex items-center">
                                        <p class="w-10">Até:</p>
                                        <input type="date" name="endDate" v-model="endDate" @change="filter"
                                            class="mx-auto">
                                    </div>
                                </div>

                                <div class="mt-4 flex justify-end">
                                    <button @click="limpaFiltros"
                                        class="font-semibold hover:text-red-600 transition-colors rounded-md p-2">
                                        Limpar filtros
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </transition>
        <Transition name="fade" appear>
            <div v-if="toggleModal" class="absolute inset-0 z-40 bg-black/30"></div>
        </Transition>

    </div>
</template>

<script>
import { ref, nextTick } from "vue";
import CardListItem from "./CardListItem.vue";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export default {
    name: 'ModalInativeCardList',
    components: {
        CardListItem
    },
    props: {
        inativeCardsList: Array,
        toggleModal: {
            type: Boolean,
            default: ref(false)
        },
        dataHoje: String,
        list: Array,
        ajustarCorTexto: Function,
        isRequesting: Boolean,
        isRequestingMore: Boolean
    },
    data() {
        return {
            startDate: null,
            endDate: null,
            search: ''
        }
    },
    computed: {
        /**
         * Método para filtrar os cards
         */
        filteredInativeCardsList() {
            if (!this.startDate && !this.endDate && this.search === '') {

                return this.inativeCardsList;
            }

            if (this.startDate && this.endDate && this.search === '') {

                const start = dayjs(this.startDate);
                const end = dayjs(this.endDate);
                return this.inativeCardsList.filter(card => dayjs(card.date).isBetween(start, end, null, '[]'));
            }

            if (this.search !== '' && !this.startDate || !this.endDate) {

                return this.inativeCardsList.filter(card => {

                    if (card.nome.toLowerCase().includes(this.search.toLowerCase())) {
                        return card.nome.toLowerCase().includes(this.search.toLowerCase());
                    }

                    if (card.statusName.toLowerCase().includes(this.search.toLowerCase())) {
                        return card.statusName.toLowerCase().includes(this.search.toLowerCase());
                    }
                })
            }

            if (this.search !== '' && this.startDate && this.endDate) {
                const start = dayjs(this.startDate);
                const end = dayjs(this.endDate);

                return this.inativeCardsList.filter(card => {

                    if (dayjs(card.date).isBetween(start, end, null, '[]')) {
                        if (card.nome.toLowerCase().includes(this.search.toLowerCase())) {
                            return card.nome.toLowerCase().includes(this.search.toLowerCase());
                        }

                        if (card.statusName.toLowerCase().includes(this.search.toLowerCase())) {
                            return card.statusName.toLowerCase().includes(this.search.toLowerCase());
                        }
                    }
                })
            }

        }
    },
    methods: {
        closeModal() {
            this.limpaFiltros();
            this.$emit('closeModalInativeCardList');
        },
        adicionaInfos() {
            this.inativeCardsList.forEach(card => {
                let statusIndex = this.list.findIndex(obj => obj.id_status === card.id_status);
                if (statusIndex !== -1) {
                    let status = this.list[statusIndex];
                    let statusName = status.nome;
                    let colorStatus = status.color;
                    card.statusName = statusName;
                    card.colorStatus = colorStatus;
                    card.corTextoCard = this.ajustarCorTexto(colorStatus);
                } else {
                    card.statusName = 'Removido do pipeline';
                    card.colorStatus = '#71717A';
                    card.corTextoCard = '#FFFFFF';
                    card.existeStatus = false;
                }
                card['date'] = card.data_hora_cadastro.substring(0, 10);
            });
        },
        filter() {
            this.adicionaInfos();
            this.$forceUpdate(); // atualiza a lista filtrada
        },
        checkIfScrolledToEnd() {
            const element = this.$refs.scrollRef;
            if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
                this.$emit('nextPagInativeCards');
            }
        },
        limpaFiltros() {
            this.startDate = null;
            this.endDate = null;
            this.search = '';
            this.filter();
        }
    },
    mounted() {
        this.adicionaInfos();
    },
    watch: {
        inativeCardsList(newArray, oldArray) {
            this.adicionaInfos();
        }
    }
}
</script>

<style scoped>
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

.filters-enter-active,
.filters-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.filters-enter,
.filters-leave-to {
    opacity: 0;
}

.filters-fade-enter-active,
.filters-fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.filters-fade-enter,
.filters-fade-leave-to {
    opacity: 0;
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

input[type="date"] {
    background-color: #2563eb;
    font-family: "Roboto Mono", monospace;
    color: #ffffff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 5px;
}

::-webkit-calendar-picker-indicator {
    background-color: #ffffff;
    padding: 2px;
    cursor: pointer;
    border-radius: 3px;
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
    border-top-color: black;
    animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
    border-bottom-color: black;
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
