<template>
    <div>
        <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-gray-900/70 hover:text-gray-900" @click="showModal()">
            <div class="flex items-center justify-center">
                <div
                    class="z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-blue-500/80 sm:ring-8 shrink-0">
                    <font-awesome-icon :icon="['fas', 'fa-plus']" />
                </div>
            </div>
            <div class="mt-3 sm:pr-8 flex justify-center text-center">
                <h3 class="text-lg font-semibold">Adicione um novo status</h3>
            </div>
        </div>
        <div v-if="toggleStatusFormModal" 
            class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center">
            <div class="relative mx-auto w-auto max-w-2xl">
                <div class="bg-white w-full rounded-md">
                    <div
                        class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <h5 class="font-semibold text-xl text-gray-900/70 mr-32">Novo status</h5>
                        <button type="button"
                            class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            @click="toggleStatusFormModal = !toggleStatusFormModal">
                            <font-awesome-icon class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                                :icon="['fas', 'fa-close']" />
                        </button>
                    </div>
                    <div class="relative p-4">
                        <form class="p-3 rounded-md mt-2" @submit.prevent="onSubmit" @keydown.esc="toggleStatusFormModal = !toggleStatusFormModal">
                            <input ref="inputNameRef"
                                class="input mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Nome do status..." type="text" name="nomeStatus" required>
                            <p v-if="isShowingError" class="text-red-600/80 text-center text-sm my-1">{{ errorMessage }}</p>
                            <div class="mt-2 space-x-2 flex justify-end">
                                <button type="submit"
                                    class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Adicionar
                                    status</button>
                                <button @click="toggleStatusFormModal = !toggleStatusFormModal" type="button"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="toggleStatusFormModal" class="absolute inset-0 z-40 opacity-25 bg-black"></div>
    </div>
</template>

<script>
import { ref, nextTick } from "vue";

const url = '/testes-nf-dragndrop/';

export default {
    name: 'CreateBoardListForm',
    props: {
        setList: Function,
    },
    data() {
        return {
            toggleStatusFormModal: ref(false),
            inputNameRef: ref(),
            nomeStatus: '',
            errorMessage: '',
            isShowingError: ref(false),
        }
    },
    methods: {
        async showModal() {
            this.toggleStatusFormModal = !this.toggleStatusFormModal;
            await nextTick();
            this.$refs.inputNameRef.focus();
        },
        onSubmit(event) {
            this.isShowingError = false;

            const { nomeStatus } = Object.fromEntries(new FormData(event.target));
            this.nomeStatus = nomeStatus;

            if (!this.nomeStatus == '') {

                this.axios.get(url + 'status/create/' + this.nomeStatus)
                    .then(res => {
                        console.log(res);
                        this.setList();
                        this.$refs.inputNameRef.value = '';
                        this.$refs.inputNameRef.focus();
                    }).catch(err => {
                        this.errorMessage = err.msg;
                        this.isShowingError = true;
                        return;
                    });

            } else {
                this.isShowingError = true;
                this.errorMessage = 'Campo obrigatório!';
                return;
            }
        }
    }
}
</script>

<style scoped></style>