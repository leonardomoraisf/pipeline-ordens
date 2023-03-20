<template>
    <div>
        <div class="relative mb-6 sm:mb-0 hover:cursor-pointer text-gray-900/70 hover:text-gray-900" @click="showForm()">
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
        <form class="p-3 bg-gray-300 rounded-md mt-2" v-if="isShowingForm" @submit.prevent="onSubmit">
            <input ref="inputNameRef"
                class="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nome do status..." type="text" name="nomeStatus" required>
            <p v-if="isShowingError" class="text-red-600/80 text-center text-sm my-1">{{ errorMessage }}</p>
            <div class="mt-2 space-x-2">
                <button type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Adicionar
                    status</button>
                <button @click="closeForm()" type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
            </div>
        </form>
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
            inputNameRef: ref(),
            isShowingForm: ref(false),
            nomeStatus: '',
            errorMessage: 'Erro teste',
            isShowingError: ref(false),
        }
    },
    methods: {
        async showForm() {
            if (this.isShowingForm == true) {
                this.isShowingForm = false;
            } else {
                this.isShowingForm = true;
                await nextTick();
                this.$refs.inputNameRef.focus();
            }
        },
        closeForm() {
            this.isShowingForm = false;
            this.isShowingError = false;
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
                        this.$refs.inputNameRef.reset();
                        this.$refs.inputNameRef.focus();
                    }).catch(err => {
                        this.errorMessage = err.msg;
                        this.isShowingError = true;
                    });

            } else {
                this.isShowingError = true;
                this.errorMessage = 'Campo obrigatório!';
            }

        }
    }
}
</script>

<style scoped></style>