<template>
    <div>

        <div class="group relative mb-6 sm:mb-0 hover:cursor-pointer" @click="teste">
            <div class="flex items-center">
                <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
                <div :style="{ backgroundColor: list.colorStatus }"
                    class="z-10 flex items-center justify-center w-6 h-6 p-5 rounded-full shrink-0 group-hover:scale-110 status-circle">
                    <p :style="{ color: corTextoStatus }">{{ list.status }}</p>
                </div>
                <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
            </div>
            <div class="mt-3">
                <p class="text-base font-normal text-gray-900 text-center">{{ list.nomeStatus }}</p>
            </div>
        </div>

        <CreateCardForm :list="list" :setList="setList" @cardCreated="onCardCreated"></CreateCardForm>

        <div class="pb-3 flex flex-col overflow-hidden mt-6">
            <div class="px-2 flex-1 overflow-y-auto cards-scrollbar" ref="listRef">

                <Draggable v-model="cards" group="cards" class="space-y-3" tag="ul" drag-class="drag" ghost-class="ghost"
                    @change="onChange" handle=".drag-card">
                    <CardListItem v-for="card in cards" :key="card.id_card" :card="card" :setList="setList"
                        :colorStatus="list.colorStatus" :ajustarCorTexto="ajustarCorTexto"/>
                </Draggable>

            </div>
        </div>

    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import CreateCardForm from "./CreateCardForm.vue";
import CardListItem from "./CardListItem.vue";
import { ref } from "vue";

const url = '/testes-nf-dragndrop/';

export default {
    name: 'CardList',
    components: {
        Draggable,
        CreateCardForm,
        CardListItem,
    },
    props: {
        list: Object,
        setList: Function,
    },
    data() {
        return {
            cards: ref(this.list.cards),
            corTextoStatus: '',
        }
    },
    methods: {
        teste() {
            console.log('teste');
        },
        onCardCreated() {
            this.$refs.listRef.scrollTop = this.$refs.listRef.scrollHeight;
        },
        onChange(e) {
            let item = e.added || e.moved;

            if (!item) return;

            let index = item.newIndex;
            let prevCard = this.cards[index - 1];
            let nextCard = this.cards[index + 1];
            let card = this.cards[index];

            let posicao = card.posicao;

            if (prevCard && nextCard) {
                posicao = (prevCard.posicao + nextCard.posicao) / 2;
            } else if (prevCard) {
                posicao = prevCard.posicao + (prevCard.posicao / 2);
            } else if (nextCard) {
                posicao = nextCard.posicao / 2;
            }

            let body = {
                cardStatus: this.list.status,
                posicao: posicao
            };

            this.axios.post(url + "cards/move/" + card.id_card, body, { headers: { "Content-Type": "multipart/form-data" } })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        ajustarCorTexto(background) {
            // Converta a cor de fundo em RGB
            const r = parseInt(background.substr(1, 2), 16);
            const g = parseInt(background.substr(3, 2), 16);
            const b = parseInt(background.substr(5, 2), 16);

            // Determine o brilho usando a fórmula de luminosidade relativa
            const brilho = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

            // Defina a cor do texto com base no brilho
            const corTexto = brilho > 0.5 ? '#000000' : '#FFFFFF';

            this.corTextoStatus = corTexto;
        }
    },
    mounted() {
        this.ajustarCorTexto(this.list.colorStatus);
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

.status-circle {
    transition: all .2s ease-in-out;
}
</style>