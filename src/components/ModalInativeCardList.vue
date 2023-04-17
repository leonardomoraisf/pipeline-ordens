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
                                    @click="$emit('closeModalInativeCardList')">
                                    <font-awesome-icon class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                                        :icon="['fas', 'fa-close']" />
                                </button>
                            </div>

                            <div class="flex justify-between items-center pt-4">
                                <div class="flex space-x-3">
                                    <div>
                                        <label for="dataInicio">De: </label>
                                        <input id="dataInicio" type="date" v-model="startDate" v-on:change="filterByDate"
                                            class="p-2" />
                                    </div>
                                    <div>
                                        <label for="dataFim">Até: </label>
                                        <input id="dataFim" type="date" v-model="endDate" v-on:change="filterByDate"
                                            class="p-2" />
                                    </div>
                                </div>
                                <button @click="limpaFiltros"
                                    class="bg-rose-500 rounded-md p-2 ml-5 hover:bg-rose-400 transition-colors text-white">Limpar
                                    Filtros</button>
                            </div>
                        </div>

                        <div class="px-8 py-2">
                            <ul class="space-y-3">
                                <CardListItem v-for="card in filteredInativeCardsList" :key="card.id_card" :card="card"
                                    :colorStatus="card.colorStatus" :corTextoCard="card.corTextoCard" :dataHoje="dataHoje"
                                    :inInativeCardList="true" @openModalEditComments="$emit('openModalEditComments', card)"
                                    @turnCardActive="$emit('turnCardActive', card)"></CardListItem>
                            </ul>
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
        ajustarCorTexto: Function
    },
    data() {
        return {
            startDate: null,
            endDate: null,
            startIndex: 6,
            itemsToAdd: 3
        }
    },
    computed: {
        /**
         * Método para filtrar os cards por data
         */
        filteredInativeCardsList() {
            if (!this.startDate || !this.endDate) {
                return this.inativeCardsList.slice(0, this.startIndex);
            }
            const start = dayjs(this.startDate);
            const end = dayjs(this.endDate);
            return this.inativeCardsList.filter(item => dayjs(item.date).isBetween(start, end, null, '[]'));
        }
    },
    methods: {
        adicionaInfos() {
            this.inativeCardsList.forEach(card => {
                let statusIndex = this.list.findIndex(obj => obj.id_status === card.id_status);
                let statusName = this.list[statusIndex].nome;
                let colorStatus = this.list[statusIndex].color;
                card['statusName'] = statusName;
                card['colorStatus'] = colorStatus;
                card['corTextoCard'] = this.ajustarCorTexto(colorStatus);
                card['date'] = card.data_hora_cadastro.substring(0, 10);
            });
        },
        filterByDate() {
            this.$forceUpdate(); // atualiza a lista filtrada
        },
        checkIfScrolledToEnd() {
            const element = this.$refs.scrollRef;
            if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
                this.startIndex += this.itemsToAdd;
                this.filterByDate();
            }
        },
        limpaFiltros() {
            this.startDate = null;
            this.endDate = null;
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
    background-color: #0080ff;
    font-family: "Roboto Mono", monospace;
    color: #ffffff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 5px;
}

::-webkit-calendar-picker-indicator {
    background-color: #ffffff;
    padding: 5px;
    cursor: pointer;
    border-radius: 3px;
}
</style>
