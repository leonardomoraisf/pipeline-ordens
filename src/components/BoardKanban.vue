<template>
    <div class="flex flex-col h-screen bg-white relative">

        <div class="shrink-0 flex justify-between items-center p-4 mt-4">
            <h1 class="text-2xl text-black font-bold">Pipeline ordem de serviços</h1>
            <div>
                <button class="bg-blue-600/100 hover:bg-blue-600/80 px-3 py-2 font-medium text-sm text-white rounded-md">
                    <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-graduation-cap']" />
                    <span class="ml-1">Tutorial</span>
                </button>
            </div>
        </div>

        <main class="flex-1 overflow-hidden mt-6">
            <div class="flex flex-col h-full">

                <div class="shrink-0 flex justify-between bg-white px-4 py-3 container mx-auto">
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
                    <button
                        class="bg-gray-400 hover:bg-gray-400/80 text-white font-bold ml-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">
                        Buscar
                    </button>
                </div>

                <div class="flex-1 overflow-x-auto mt-12">

                    <div class="inline-flex h-full items-start px-4 pb-4">
                        <div v-for="list in listBoards" :key="list.status"
                            class="w-72 flex flex-col rounded-md p-2 max-h-full">

                            <div class="relative mb-6 sm:mb-0">
                                <div class="flex items-center">
                                    <div
                                        class="z-10 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full ring-0 ring-blue-500/60 sm:ring-8 shrink-0">
                                        <span class="text-white">{{ list.status }}</span>
                                    </div>
                                    <div class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                                </div>
                                <div class="mt-3 sm:pr-8">
                                    <h3 class="text-lg font-semibold text-gray-900">{{ list.nomeStatus }}
                                    </h3>
                                </div>
                            </div>

                            <div
                                class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md border-dashed hover:cursor-pointer border-black/50 hover:border-black/80 text-black/50 hover:text-black/80">
                                <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-plus']" />
                                <span class="font-semibold ml-1">Nova venda</span>
                            </div>

                            <div class="pb-3 flex flex-col overflow-hidden mt-6">
                                <div class="px-2 flex-1 overflow-y-auto cards-scrollbar">
                                    <ul class="space-y-3">
                                        <li v-for="card in list.cards"
                                            :key="card.id_card"
                                            class="group relative bg-white p-3 shadow rounded-md border-b border-gray-300 hover:bg-gray-50">
                                            <div class="h-16">
                                                <span>{{ card.nome_cliente }}</span>
                                            </div>
                                            <button
                                                class="hidden absolute top-1 right-1 w-8 h-8 bg-gray-50 group-hover:grid place-content-center rounded-md text-gray-600 hover:text-black hover:bg-gray-200">
                                                <font-awesome-icon class="w-5 h-5"
                                                    :icon="['fas', 'fa-ellipsis-vertical']" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div class="w-72 flex flex-col rounded-md p-2 max-h-full">

                            <CreateBoardListForm :setList="setList"></CreateBoardListForm>

                            <div
                                class="mt-6 w-full h-48 flex justify-center items-center px-6 text-center border-2 rounded-md border-dashed border-black/50 hover:border-black/80 text-black/50 hover:text-black/80 font-semibold text-xl">
                                <p>Para remover do pipeline, arraste pra cá</p>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </main>

    </div>
</template>

<script>
import CreateBoardListForm from './CreateBoardListForm.vue';

const url = '/testes-nf-dragndrop/';

export default {
    name: 'BoardKanban',
    components: {
        CreateBoardListForm,
    },
    data() {
        return {
            listBoards: {}
        }
    },
    methods: {
        setList() {
            this.axios.get(url + 'cards')
                .then(res => {
                    this.listBoards = res.data;
                })
                .catch(err => {
                    console.log(err);
                })
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
    width: 0px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #aeaeae;
    border-radius: 5px;
}

.cards-scrollbar:hover::-webkit-scrollbar {
    width: 5px;
}
</style>