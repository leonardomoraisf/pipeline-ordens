<template>
    <div>

        <StatusTimeline @changeListInfo="changeListInfo" :setList="setList" :list="list" :corTextoStatus="corTextoStatus"
            :lastList="lastList" :ajustarCorTexto="ajustarCorTexto">
        </StatusTimeline>

        <div class="text-center">
            <p class="text-xl font-semibold text-gray-500">{{ cards.length }}</p>
        </div>

        <MovimentoModalCreate :list="list" :cards="cards" :setList="setList" @cardCreated="onCardCreated">
        </MovimentoModalCreate>

        <div class="absolute invisible">
            <button @click="addCard" class="bg-blue-600 text-white font-semibold px-2 py-3 rounded-md mt-3">Teste animação</button>
        </div>

        <div class="pb-3 flex flex-col overflow-hidden mt-6">
            <div class="px-2 flex-1 overflow-y-auto cards-scrollbar" ref="listRef">

                <Draggable :list="cards" group="cards" class="space-y-3 pb-24 h-full draggable pt-2" tag="ul"
                    drag-class="drag" ghost-class="ghost" @change="onChange" @end="onDropCard" handle=".drag-card"
                    ref="list">
                    <CardListItem v-for="card in cards" :key="card.id_card" :card="card" :setList="setList"
                        :colorStatus="list.color" :ajustarCorTexto="ajustarCorTexto" :corTextoCard="corTextoStatus" />
                </Draggable>

            </div>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import MovimentoModalCreate from "./MovimentoModalCreate.vue";
import CardListItem from "./CardListItem.vue";
import { ref, nextTick } from "vue";
import StatusTimeline from "./StatusTimeline.vue"

export default {
    name: 'CardList',
    components: {
        Draggable,
        MovimentoModalCreate,
        CardListItem,
        StatusTimeline
    },
    props: {
        list: Object,
        setList: Function,
        lastList: Object,
        ajustarCorTexto: Function,
        idEmpresa: Number,
        newCard: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            cards: ref(this.list.cards),
            corTextoStatus: '',
            isDeletingCard: ref(false)
        }
    },
    mounted() {
        this.corTextoStatus = this.ajustarCorTexto(this.list.color);
    },
    methods: {
        addCard() {
            let index = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000;
            let card = {
                celulares: '"[{"number": "31971516241"}]"',
                id_card: index,
                id_status: this.list.id_status,
                nome: 'Teste ' + index,
                posicao: 60000,
                telefones: null,
                valor: 100
            }
            this.onCardCreated(card);
        },
        /**
         * Método que é acionado quando um movimento/card é criado
         * @param {Object} novoCard 
         */
        async onCardCreated(novoCard) {
            this.cards.push(novoCard);
            await nextTick();

            const childrenList = this.$refs.list.$children;
            const lengthChildrenList = childrenList.length;
            const lastChildren = childrenList[lengthChildrenList - 1];
            const lastElement = lastChildren.$el;

            lastElement.style.transition = "transform 0.2s ease";
            setTimeout(() => {
                lastElement.style.transform = "scale(1.05)";
                lastElement.style.opacity = "0.8";
            }, 100);
            setTimeout(() => {
                lastElement.style.transform = "scale(1)";
                lastElement.style.opacity = "1";
            }, 1000);

            lastElement.scrollIntoView({
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
                posicao: posicao
            };

            this.axios.put("/v2/pipeline/cards/" + card.id_card + "/move", body)
                .then(res => {
                    this.cards[index].posicao = posicao;
                })
                .catch(err => {
                })
        },
        onDropCard(e) {
            const tableId = e.to.id;

            if (tableId === 'table-delete') {
                const movedCard = e.item._underlying_vm_;
                this.$confirm(
                    {
                        message: 'Tem certeza que deseja deletar esse card do pipeline?',
                        button: {
                            no: 'Cancelar',
                            yes: 'Sim'
                        },
                        /**
                         * Callback Function
                         * @param {Boolean} confirm
                         */
                        callback: confirm => {
                            if (confirm) {
                                this.deleteCard(movedCard);
                            } else {
                                this.onCardCreated(movedCard);
                            }
                        }
                    }
                )
            }
        },
        deleteCard(card) {
            ToastTopEnd5.fire('Aguarde', 'Deletando card...', 'warning');
            this.axios.delete('/v2/pipeline/cards/' + card.id_card + '/delete')
                .then(res => {
                    Toast.fire(res.data.message, '', 'success');
                })
        },
        /**
         * Método chamado quando o status é editado para evitar chamada no banco de dados,
         * ele seta o nome e cor por aqui e já troca a cor do texto
         * @param {String} nome 
         * @param {String} color 
         */
        changeListInfo(edit) {
            this.list.nome = edit.nome;
            this.list.color = edit.color;
            this.corTextoStatus = this.ajustarCorTexto(this.list.color);
        }
    },
    watch: {
        newCard(newCard, oldCard) {
            if(newCard.id_status == this.list.id_status){
                this.onCardCreated(newCard);
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