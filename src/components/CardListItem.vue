<template>
    <li class="card-list drag-card">

        <div :style="{ backgroundColor: colorStatus }"
            class="group relative p-3 shadow rounded-md border-b border-gray-300 text-left">

            <div class="h-28 hover:cursor-grab font-semibold" :style="{ color: corTextoCard }">
                <p class="text-base">{{ card.nome }}</p>
                <p class="text-base">{{ celulares }}</p>
                <p class="font-normal  absolute bottom-2 right-2">R$ {{ valorFormatado }}</p>
            </div>
            <button @click="showModal()" :style="{ backgroundColor: colorStatus }"
                class="hidden absolute top-2 right-0 w-8 h-8 group-hover:grid place-content-center rounded-md text-gray-900 hover:text-white hover:bg-gray-200">
                <font-awesome-icon class="w-8 h-8" :icon="['fas', 'fa-ellipsis-vertical']" />
            </button>
        </div>

    </li>
</template>

<script>
import { ref, nextTick } from "vue";

export default {
    name: 'CardListItem',
    components: {
    },
    props: {
        card: Object,
        setList: Function,
        colorStatus: String,
        ajustarCorTexto: Function,
        corTextoCard: String,
    },
    data() {
        return {
            toggleCardEditModal: ref(false),
            errorMessage: '',
            isShowingError: ref(false),
            celulares: this.card.celulares[0].number,
            valorFormatado: parseInt(this.card.valor).toFixed(2).replace('.', ',')
        }
    },
    methods: {
        /**
         * Método para mostrar a modal de editar o card/movimento
         */
        async showModal() {
            this.toggleCardEditModal = !this.toggleCardEditModal;
            await nextTick();
            this.$refs.inputCliente.focus();
        }
    }
}
</script>

<style scoped>
 .ghost {
     background: lightgray;
     border-radius: 6px;
 }

 .ghost>div {
     visibility: hidden;
 }

 .ghost-delete {
     opacity: 0;
 }

 .ghost-delete>div {
     visibility: hidden;
 }

 .card-list{
    transition: transform .2s ease !important;
 }

 .card-list:hover{
    transform: scale(1.05) !important;
 }
</style>