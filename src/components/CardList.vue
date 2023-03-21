<template>
    <div>

        <div class="relative mb-6 sm:mb-0">
            <div class="flex items-center">
                <div class="z-10 flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shrink-0">
                    <span class="text-white">{{ list.status }}</span>
                </div>
                <div class="sm:flex w-full h-0.5 bg-gray-700"></div>
            </div>
            <div class="mt-3 sm:pr-8">
                <h3 class="text-lg font-semibold text-gray-900 text-center">{{ list.nomeStatus }}
                </h3>
            </div>
        </div>

        <CreateCardForm :list="list" :setList="setList" @cardCreated="onCardCreated"></CreateCardForm>

        <div class="pb-3 flex flex-col overflow-hidden mt-6">
            <div class="px-2 flex-1 overflow-y-auto cards-scrollbar" ref="listRef">

                <Draggable :list="cards" group="cards" class="space-y-3" tag="ul" drag-class="drag" ghost-class="ghost"
                    @change="onChange">
                    <CardListItem v-for="card in cards" :key="card.id_card" :card="card" :setList="setList" />
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
            cards: ref(this.list.cards)
        }
    },
    methods: {
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

            this.axios.get(url + "cards/move/" + card.id_card + "/" + this.list.status + "/" + posicao)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
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