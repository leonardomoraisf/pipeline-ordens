<template>
    <li>
        <div class="group relative bg-white p-3 shadow rounded-md border-b border-gray-300 hover:bg-gray-50">

            <div v-if="toggleCardEditModal"
                class="z-50 fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center">
                <div class="relative mx-auto w-auto max-w-2xl">
                    <div class="bg-white w-full rounded-md">
                        <div
                            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                            <h5 class="font-semibold text-xl text-gray-900/70 mr-32">Edição de venda</h5>
                            <button type="button"
                                class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                @click="toggleCardEditModal = !toggleCardEditModal">
                                <font-awesome-icon class="w-6 h-6 text-gray-900/70 hover:text-rose-600"
                                    :icon="['fas', 'fa-close']" />
                            </button>
                        </div>
                        <div class="relative p-4">
                            <form class="p-3 rounded-md mt-2" @submit.prevent="onSubmit"
                                @keydown.esc="toggleCardEditModal = !toggleCardEditModal">
                                <input ref="inputCliente"
                                    class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    :value="nomeCliente" placeholder="Nome do cliente..." type="text" name="nomeCliente"
                                    required>
                                <input ref="inputPreco"
                                    class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    :value="precoMovimento" placeholder="Valor da venda/serviço..." type="number"
                                    name="precoMovimento" required>
                                <input ref="inputPedido"
                                    class="input mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    :value="pedidoMovimento" placeholder="Pedido..." type="text" name="pedidoMovimento"
                                    required>
                                <p v-if="isShowingError" class="text-red-600/80 text-center text-sm my-1">{{ errorMessage }}
                                </p>
                                <div class="mt-8 space-x-2 flex justify-end">
                                    <button type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Salvar
                                        mudanças
                                    </button>
                                    <button @click="toggleCardEditModal = !toggleCardEditModal" type="button"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="toggleCardEditModal" class="fixed inset-0 z-40 opacity-25 bg-black"></div>

            <div class="h-28 hover:cursor-grab">
                <p>{{ nomeCliente }}</p>
                <p>{{ precoMovimento }}</p>
                <p>{{ pedidoMovimento }}</p>
            </div>
            <button @click="showModal()"
                class="hidden absolute top-1 right-1 w-8 h-8 bg-gray-50 group-hover:grid place-content-center rounded-md text-gray-600 hover:text-black hover:bg-gray-200">
                <font-awesome-icon class="w-5 h-5" :icon="['fas', 'fa-ellipsis-vertical']" />
            </button>
        </div>
    </li>
</template>

<script>
import { ref, nextTick } from "vue";

const url = '/testes-nf-dragndrop/';

export default {
    name: 'CardListItem',
    components: {
    },
    props: {
        card: Object,
        setList: Function
    },
    data() {
        return {
            toggleCardEditModal: ref(false),
            nomeCliente: this.card.nome_cliente,
            precoMovimento: this.card.preco,
            pedidoMovimento: this.card.pedido,
            errorMessage: '',
            isShowingError: ref(false),
        }
    },
    methods: {
        async showModal() {
            this.toggleCardEditModal = !this.toggleCardEditModal;
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

            this.axios.get(url + 'cards/update/' + this.card.id_card + '/' + this.nomeCliente + '/' + this.precoMovimento + '/' + this.pedidoMovimento)
                .then(res => {
                    this.setList();
                    this.$refs.inputCliente.value = '';
                    this.$refs.inputPreco.value = '';
                    this.$refs.inputPedido.value = '';
                    this.toggleCardEditModal = false;
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

<style scoped> 
.drag > div{
     transform: rotate(5deg);
 }

 .ghost{
    background: lightgray;
    border-radius: 6px;
 }

 .ghost > div{
    visibility: hidden;
 }
</style>