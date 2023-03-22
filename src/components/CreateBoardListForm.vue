<template>
    <div>
        <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-black/50 hover:text-black/70 hover:scale-110 add" @click="showModal()">
            <div class="flex items-center justify-center">
                <div
                    class="z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 border-dashed border-gray-900/80 p-4 shrink-0">
                    <font-awesome-icon :icon="['fas', 'fa-plus']" />
                </div>
            </div>
            <div class="mt-3 flex justify-center text-center">
                <h3 class="text-lg font-semibold">Adicione um novo status</h3>
            </div>
        </div>
        <div v-if="toggleStatusFormModal"
            class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center">
            <div class="relative mx-auto w-1/2">
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
                        <form class="p-3 rounded-md mt-2" @submit.prevent="onSubmit"
                            @keydown.esc="toggleStatusFormModal = !toggleStatusFormModal">
                            <input ref="inputNameRef"
                                class="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5"
                                placeholder="Nome do status..." type="text" name="nomeStatus" required>
                            <div class="flex justify-start items-center mt-4">
                                <label for="inputColor" class="text-base font-semibold">Selecione a cor do status:</label>
                                <input class="ml-2" ref="inputColorRef" id="inputColor" type="color" value='#2563eb'
                                    name="colorStatus">
                            </div>
                            <p v-if="isShowingError" class="text-red-600/80 text-center text-sm my-1">{{ errorMessage }}</p>
                            <div class="mt-8 space-x-2 flex justify-end">
                                <button @click="toggleStatusFormModal = !toggleStatusFormModal" type="button"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
                                <button type="submit"
                                    class="px-4 py-2 text-sm font-medium text-white bg-green-600/90 hover:bg-green-600/70 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none">Adicionar
                                    status</button>
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
            colorStatus: '',
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

            const { nomeStatus, colorStatus } = Object.fromEntries(new FormData(event.target));
            this.nomeStatus = nomeStatus;
            this.colorStatus = colorStatus;
            this.colorStatus = this.colorStatus.toString();

            let body = { nomeStatus: this.nomeStatus, colorStatus: this.colorStatus };

            if (!this.nomeStatus == '') {

                this.axios.post(url + 'status/create', body, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(res => {
                        console.log(res);
                        this.setList();
                        this.$refs.inputNameRef.value = '';
                        this.$refs.inputColorRef.value = '#2563eb';
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

<style scoped>
.add {
    transition: all .2s ease-in-out;
}
</style>