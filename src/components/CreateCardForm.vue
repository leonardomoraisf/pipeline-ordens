<template>
    <div>
        <button type="button" @click="showModal()"
            class="mt-6 w-full flex justify-center items-center py-6 border-2 rounded-md border-dashed hover:cursor-pointer border-black/50 hover:border-black/80 text-black/50 hover:text-black/80">
            <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-plus']" />
            <span class="font-semibold ml-1">Nova venda</span>
        </button>

        <div v-if="toggleCardFormModal" 
            class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center">
            <div class="relative mx-auto w-auto max-w-2xl">
                <div class="bg-white w-full rounded-md">
                    <div
                        class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <h5 class="font-semibold text-xl text-gray-900/70 mr-32">Nova venda para "{{ list.nomeStatus }}"</h5>
                        <button type="button"
                            class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            @click="toggleCardFormModal = !toggleCardFormModal">
                            <font-awesome-icon class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                                :icon="['fas', 'fa-close']" />
                        </button>
                    </div>
                    <div class="relative p-4">
                        <form class="p-3 rounded-md mt-2" @submit.prevent="onSubmit" @keydown.esc="toggleCardFormModal = !toggleCardFormModal">
                            <input ref="inputCliente"
                                class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Nome do cliente..." type="text" name="nomeCliente" required>
                            <input ref="inputPreco"
                                class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Valor da venda/serviço..." type="number" name="precoMovimento" required>
                            <input ref="inputPedido"
                                class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Pedido..." type="text" name="pedidoMovimento" required>
                            <p v-if="isShowingError" class="text-red-600/80 text-center text-sm my-1">{{ errorMessage }}</p>
                            <div class="mt-8 space-x-2 flex justify-end">
                                <button type="submit"
                                    class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Adicionar
                                    venda
                                </button>
                                <button @click="toggleCardFormModal = !toggleCardFormModal" type="button"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="toggleCardFormModal" class="absolute inset-0 z-40 opacity-25 bg-black"></div>
    </div>
</template>

<script>
import { ref, nextTick } from "vue";

const url = '/testes-nf-dragndrop/';

export default {
    name: 'CreateCardForm',
    components: {
    },
    props: {
        list: Object,
        setList: Function,
    },
    data() {
        return {
            toggleCardFormModal: ref(false),
            nomeCliente: '',
            precoMovimento: 0,
            pedidoMovimento: '',
            errorMessage: '',
            isShowingError: ref(false),
        }
    },
    methods: {
        async showModal() {
            this.toggleCardFormModal = !this.toggleCardFormModal;
            await nextTick();
            this.$refs.inputCliente.focus();
        },
        onSubmit(event) {
            this.isShowingError = false;

            if (this.$refs.inputCliente.value !== '' && this.$refs.inputPreco.value == 0 || this.$refs.inputPreco.value < 0) {
                this.$refs.inputPreco.focus();
            } else if (this.$refs.inputPreco.value !== 0 || this.$refs.inputPreco.value > 0 && this.$refs.inputPedido.value == '') {
                this.$refs.inputPedido.focus();
            }

            const { nomeCliente, precoMovimento, pedidoMovimento } = Object.fromEntries(new FormData(event.target));
            this.nomeCliente = nomeCliente;
            this.precoMovimento = precoMovimento;
            this.pedidoMovimento = pedidoMovimento;

            if (this.nomeCliente == '' || this.pedidoMovimento == '') {
                this.isShowingError = true;
                this.errorMessage = "Há campos não preenchidos!";
                return;
            }
            if (this.precoMovimento <= 0) {
                this.isShowingError = true;
                this.errorMessage = "O preço deve ser maior que 0!";
                return;
            }

            this.axios.get(url + 'movimento/create/' + this.nomeCliente + '/' + this.precoMovimento + '/' + this.pedidoMovimento + '/' + this.list.status)
                .then(res => {
                    this.setList();
                    this.$emit('cardCreated');
                    this.$refs.inputCliente.value = '';
                    this.$refs.inputPreco.value = '';
                    this.$refs.inputPedido.value = '';
                    this.toggleCardFormModal = false;
                })
                .catch(err => {
                    this.errorMessage = err.msg;
                    this.isShowingError = true;
                    return;
                });
        }
    }
}
</script>