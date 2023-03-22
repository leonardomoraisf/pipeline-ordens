<template>
    <div class="flex flex-col h-screen bg-white relative">

        <div class="shrink-0 grid place-content-center p-4 mt-2">
            <h1 class="text-2xl text-black font-bold">Pipeline das ordens de serviços</h1>
            <button class="px-3 py-2 font-medium text-sm text-gray-900 rounded-md flex justify-center">
                <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-play']" />
                <span class="ml-1">Tutorial</span>
            </button>
        </div>

        <main class="flex-1 overflow-hidden ">
            <div class="flex flex-col h-full">

                <div class="shrink-0 flex justify-center bg-white px-4 py-3 container mx-auto">
                    <input
                        class="shadow appearance-none border rounded w-1/2 py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                        type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
                    <button
                        class="bg-gray-400 hover:bg-gray-400/80 text-white font-normal ml-4 py-2 px-8 rounded focus:outline-none focus:shadow-outline text-2xl"
                        type="button">
                        Buscar
                    </button>
                </div>

                <div class="flex-1 overflow-x-auto mt-8">

                    <div class="inline-flex h-full items-start px-4 pb-4">
                        <CardList v-for="list in listBoards" :key="list.status" :list="list" :setList="setList"
                            class="w-72 flex flex-col rounded-md p-2 max-h-full" />

                        <div class="flex flex-col rounded-md p-2 max-h-full w-72">

                            <CreateBoardListForm :setList="setList"></CreateBoardListForm>

                            <div v-if="listBoards.length !== 0"
                                class="mt-32 w-full h-screen flex justify-center items-center px-6 text-center border-2 rounded-md border-dashed border-black/30 hover:border-black/50 text-black/30 hover:text-black/50 font-semibold text-xl">
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
import CardList from './CardList.vue';

const url = '/testes-nf-dragndrop/';

export default {
    name: 'BoardKanban',
    components: {
        CreateBoardListForm,
        CardList,
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
    width: 5px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: #aeaeae;
    border-radius: 5px;
}
</style>