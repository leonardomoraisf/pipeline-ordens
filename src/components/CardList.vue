<template>
    <div>

        <StatusTimeline :list="list" :corTextoStatus="corTextoStatus" :lastList="lastList"
            :ajustarCorTexto="ajustarCorTexto" @statusDeleted="onStatusDeleted">
        </StatusTimeline>

        <div class="text-center">
            <p class="text-xl font-semibold text-gray-500">{{ cards.length }}</p>
        </div>

        <MovimentoModalCreate :list="list" :cards="cards" class="px-2" @cardCreated="onCardCreated">
        </MovimentoModalCreate>

        <div class="pb-3 flex flex-col overflow-hidden mt-4 px-2">
            <div class="px-2 flex-1 overflow-y-auto cards-scrollbar" ref="listRef">

                <Draggable :list="cards" group="cards" class="space-y-3 pb-24 h-full draggable pt-2" tag="ul"
                    id="table-normal" drag-class="drag" ghost-class="ghost" @change="onChange" handle=".drag-card"
                    ref="list">

                    <CardListItem v-for="card in cards" :key="card.id_card" :card="card" :colorStatus="list.color"
                        :corTextoCard="corTextoStatus" :dataHoje="dataHoje" :isToInative="false"
                        @openModalEditComments="toggleModalEditComments" />

                </Draggable>

            </div>
        </div>

        <ModalEditCardComments :cardIsEditing="cardIsEditing" :toggleModal="isShowingModalEditComments"
            :colorStatus="list.color" :corTextoCard="corTextoStatus" :inInativeCards="false" ref="modalEditCommentsRef"
            @closeModalEditComments="toggleModalEditComments" :dataHoje="dataHoje"></ModalEditCardComments>

    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import MovimentoModalCreate from "./MovimentoModalCreate.vue";
import CardListItem from "./CardListItem.vue";
import { ref, nextTick } from "vue";
import StatusTimeline from "./StatusTimeline.vue";
import ModalEditCardComments from './ModalEditCardComments.vue';

export default {
    name: 'CardList',
    components: {
        Draggable,
        MovimentoModalCreate,
        CardListItem,
        StatusTimeline,
        ModalEditCardComments
    },
    props: {
        list: Object,
        lastList: Object,
        ajustarCorTexto: Function,
        idEmpresa: Number,
        newCard: {
            type: Object,
            default: () => ({})
        },
        editedCard: {
            type: Object,
            default: () => ({})
        },
        dataHoje: String,
    },
    data() {
        return {
            cards: ref(this.list.cards),
            corTextoStatus: '',
            isShowingModalEditComments: ref(false),
            cardIsEditing: {}
        }
    },
    mounted() {
        this.corTextoStatus = this.ajustarCorTexto(this.list.color);
    },
    methods: {
        /**
         * Método chamado para abrir a modal de edição de comentários de um card que está na lista
         * para transformar o card em inative
         * @param {Object} card 
         */
        async toggleModalEditComments(card) {
            this.isShowingModalEditComments = !this.isShowingModalEditComments;
            this.cardIsEditing = card;

            if (this.isShowingModalEditComments === true) {
                await nextTick();
                this.$refs.modalEditCommentsRef.$refs.textareaRef.focus();
            }
        },
        /**
         * Método que é chamado quando um status é deletado, ele emite qual lista for deletada,
         * para no componente pai ser procurado pelo index e ser retirado do array
         */
        onStatusDeleted(list) {
            this.$emit('statusDeleted', list);
        },
        /**
         * Método que é acionado quando um movimento/card é criado
         * @param {Object} novoCard 
         */
        async onCardCreated(novoCard) {
            this.cards.push(novoCard);

            // Reorganiza a lista
            this.cards.sort((a, b) => a.posicao - b.posicao);

            await nextTick();

            const childrenList = this.$refs.list.$children;
            const childrenIndex = childrenList.findIndex(obj => obj.card.id_card === novoCard.id_card);
            const element = childrenList[childrenIndex].$el;

            element.style.transition = "all 0.2s ease";
            setTimeout(() => {
                element.style.transform = "scale(1.05)";
                element.style.opacity = "0.8";
            }, 100);
            setTimeout(() => {
                element.style.transform = "scale(1)";
                element.style.opacity = "1";
            }, 1000);

            element.scrollIntoView({
                behavior: 'smooth'
            });
        },
        /**
         * Método que é acionado quando acontece alguma mudança de status ou posição de cards do componente draggable
         * @param {Event} e 
         */
        onChange(e) {
            // Pega o card que foi ou movido de tabela, ou movido de posição
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
                id_status: this.list.id_status,
                posicao: posicao,
                ativo: 1,
                comentarios: card.comentarios
            };

            this.axios.put("/v2/pipeline/cards/" + card.id_card + "/edit", body)
                .then(res => {

                })
                .catch(err => {
                })
        }
    },
    watch: {
        /**
         * Método para escutar o card recebido pelo canal new-cards e adicioná-lo na lista
         */
        newCard(newCard, oldCard) {
            if (newCard.id_status === this.list.id_status) {
                newCard.valor = parseFloat(newCard.valor);
                newCard.posicao = parseFloat(newCard.posicao);
                this.onCardCreated(newCard);
            }
        },
        /**
         * Método para escutar o card recebido pelo canal edited-cards e mudar as informações do card na lista
         */
        editedCard(newEditedCard, oldEditedCard) {
            const novoCard = newEditedCard;
            // Procura o card na lista
            let cardIndex = this.cards.findIndex(obj => obj.id_card === novoCard.id_card);
            if (cardIndex !== -1) {
                // Atualiza o card
                let cardInList = this.cards[cardIndex];
                novoCard.posicao = parseFloat(novoCard.posicao);
                novoCard.valor = parseFloat(novoCard.valor);
                cardInList = novoCard;

                if (cardInList.ativo === 0) {
                    // anima o card sumindo
                    const childrenList = this.$refs.list.$children;
                    const childrenIndex = childrenList.findIndex(obj => obj.card.id_card === cardInList.id_card);
                    const element = childrenList[childrenIndex].$el;

                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                    element.style.transition = "transform 0.2s ease-in-out";
                    element.style.transform = "scale(1.05)";

                    setTimeout(() => {
                        element.style.transition = "transform 1s ease-in-out";
                        element.style.transform = "scale(0)";
                    }, 500);

                    setTimeout(() => {
                        // emite o card para colocá-lo na lista de cards inativos
                        this.$emit('cardIsNowInative', cardInList);

                        // remove o card da lista atual
                        this.cards.splice(cardIndex, 1);
                    }, 2000);
                }

                // Verifica se o id_status continua o mesmo, se não continuou, remove o card dessa lista
                // e emite como um card novo pro componente pai
                if (cardInList.id_status !== this.list.id_status && cardInList.ativo === 1) {
                    // emite o card para colocá-lo na lista certa
                    this.$emit('cardInWrongList', cardInList);

                    // remove o card da lista atual
                    this.cards.splice(cardIndex, 1);
                }
            }
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

.cards-scrollbar {
    behavior: smooth;
}

.draggable {
    behavior: smooth;
}

.cards-scrollbar:hover::-webkit-scrollbar {
    width: 5px;
}

.status-circle {
    transition: all .2s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
    transition: opacity 0.5s ease-in-out;
    transition: transform 0.5s ease-in-out;
}

.modal-slide-enter,
.modal-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.input-color {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    cursor: pointer;
}

.input-color::-webkit-color-swatch {
    border-radius: 50%;
}

.input-color::-moz-color-swatch {
    border-radius: 50%;
}

.cards-enter-from {
    opacity: 0;
    transform: scale(0.6);
}

.cards-enter-to {
    opacity: 1;
    transform: scale(1);
}

.cards-enter-active {
    transition: all 0.4s ease;
}

.cards-leave-from {
    opacity: 1;
    transform: scale(1);
}

.cards-leave-to {
    opacity: 0;
    transform: scale(0.6);
}

.cards-leave-active {
    transition: all 0.4s ease;
}
</style>