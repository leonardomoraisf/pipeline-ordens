<template>
    <div class="flex flex-col h-screen bg-white">

        <div class="shrink-0 flex justify-between bg-white px-4 py-3">
            <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text" placeholder="Encontre por nome do cliente ou alguma informação adicionada">
            <button
                class="bg-gray-400 hover:bg-gray-500 text-white font-bold ml-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Buscar
            </button>
        </div>

        <main class="flex-1 overflow-hidden">
            <div class="flex flex-col h-full">

                <div class="shrink-0 flex justify-between items-center p-4">
                    <h1 class="text-2xl text-black font-bold">Pipeline ordem de serviços</h1>
                    <div>
                        <button
                            class="bg-blue-600/100 hover:bg-blue-600/80 px-3 py-2 font-medium text-sm text-white rounded-md">
                            <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-graduation-cap']" />
                            <span class="ml-1">Tutorial</span>
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-x-auto">

                    <div class="inline-flex h-full items-start px-4 pb-4 space-x-4">
                        <div 
                        v-for="item in Array.from({length:0})"
                        class="w-72 bg-gray-200 flex flex-col rounded-md p-2 max-h-full">

                            <div class="flex items-center justify-between px-3 py-2">
                                <h3 class="font-semibold text-sm text-gray-700">Backlog</h3>
                                <button class="rounded-md hover:bg-gray-300 grid place-content-center">
                                    <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-ellipsis']" />
                                </button>
                            </div>

                            <div
                                class="mb-5 mt-4 flex justify-center items-center w-full py-10 border-2 rounded-md border-dashed hover:cursor-pointer border-black/50 hover:border-black/80 text-black/50 hover:text-black/80">
                                <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-plus']" />
                            </div>

                            <div class="pb-3 flex flex-col overflow-hidden">
                                <div class="px-2 flex-1 overflow-y-auto" data-simplebar>
                                    <ul class="space-y-3">
                                        <li v-for="item in Array.from({ length: 100 })"
                                            class="group relative bg-white p-3 shadow rounded-md border-b border-gray-300 hover:bg-gray-50">
                                            <a href="#" class="text-sm">Card
                                                item</a>
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

                        <div class="w-72">
                            <CreateBoardListForm :board="board"></CreateBoardListForm>
                        </div>
                    </div>
                </div>

            </div>
        </main>

    </div>
</template>

<script>
import CreateBoardListForm from './CreateBoardListForm.vue';

export default {
    name: 'BoardKanban',
    components: {
        CreateBoardListForm,
    }
}
</script>

<style scoped></style>