<template>
    <li class="drag-card" :class="{'card-list' : !inModalEditComments}" @click="$emit('turnCardActive', card)">

        <div :style="{ backgroundColor: colorStatus }"
            class="group relative p-3 shadow rounded-md border-b border-gray-300 text-left">

            <div class="h-28 flex flex-col justify-between" :class="{'hover:cursor-grab' : !inInativeCardList, 'hover:cursor-pointer' : inInativeCardList}" :style="{ color: corTextoCard }">

                <div>
                    <p class="text-base">{{ card.nome }}</p>
                    <p class="text-base">{{ celular }}</p>
                </div>

                <circular-count-down-timer v-if="isToInative" class="absolute top-1 right-3" :circles="circles" :stepLength="circles.stepLength"
                :main-circle-id="circles.id || '1'" :fill-color="colorStatus" :stroke-width="3"
				:stroke-color="corTextoCard" v-tooltip="'Quando o tempo acabar, o card será colocado como inativo!'"/>

                <div v-if="inInativeCardList" class="absolute top-2 right-2">
                    <p class="text-base font-normal"><b>Status:</b> {{ card.statusName }}</p>
                </div>

                <div class="flex justify-between items-center">

                    <div class="flex items-center">
                        <div v-if="!inModalEditComments" class="hover:scale-125 transition-transform mr-2">
                            <button @click.stop="$emit('openModalEditComments', card)">
                                <font-awesome-icon v-if="card.comentarios === null || card.comentarios.length === 0"
                                    class="w-8 h-8 opacity-60" :icon="['far', 'comment']" />
                                <font-awesome-icon v-if="card.comentarios !== null && card.comentarios.length > 0"
                                    class="w-8 h-8 text-black/60 opacity-60" :icon="['fas', 'comment']" />
                            </button>
                        </div>

                        <div class="w-12 h-6 rounded-md text-center" :class="{
                            'bg-green-600': diferencaDias >= 0 && diferencaDias < 3,
                            'bg-rose-600': diferencaDias >= 3
                        }" v-tooltip.bottom="'Dias no status/Dias no pipeline'">
                            <span class="text-white font-semibold">{{ diferencaDias }}</span>
                            <span class="text-white font-semibold">/{{ diferencaDiasTotal }}d</span>
                        </div>

                    </div>

                    <div>
                        <p class="font-normal">R$ {{ valorFormatado }}</p>
                    </div>

                </div>

            </div>

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
        colorStatus: String,
        corTextoCard: String,
        dataHoje: String,
        isToInative: {
            type: Boolean,
            default: false
        },
        inModalEditComments: {
            type: Boolean,
            default: false
        },
        inInativeCardList: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            errorMessage: '',
            isShowingError: ref(false),
            celular: '',
            valorFormatado: String(parseFloat(this.card.valor.toFixed(2))).replace('.', ','),
            diferencaDias: 0,
            toggleModal: ref(false),
            diferencaDiasTotal: 0,
            circles: [
                {
                    id: '1',
                    steps: 60,
                    size: 45,
                    value: 60,
                    stepLength: -1,
                    label: 'segundos',
                    dependentCircles: ['1']
                }
            ]
        }
    },
    methods: {
        calculaDiferencaDias() {
            let dataHoje = new Date(this.dataHoje);

            let dataCard = new Date(this.card.data_hora_registro.substring(0, 10));
            let diferenca = Math.abs(dataHoje.getTime() - dataCard.getTime());
            let dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

            let dataCardTotal = new Date(this.card.data_hora_cadastro.substring(0, 10));
            let diferencaTotal = Math.abs(dataHoje.getTime() - dataCardTotal.getTime());
            let diasTotal = Math.ceil(diferencaTotal / (1000 * 60 * 60 * 24));

            this.diferencaDias = dias;
            this.diferencaDiasTotal = diasTotal;
        },
        cardToInative() {
            ToastTopStart5.fire('Sucesso!', 'O card de '+this.card.nome+' será colocado como inativo.', 'success');

            let body = {
                id_status: this.card.id_status,
                posicao: this.card.posicao,
                ativo: 0,
                comentarios: this.card.comentarios
            };

            let card = {...this.card, ativo: 0};

            this.$emit('putCardToInative', card);
            this.axios.put("/v2/pipeline/cards/" + card.id_card + "/edit", body)
                .then(res => {
                    
                })
                .catch(err => {
                })
        }
    },
    mounted() {
        this.calculaDiferencaDias();

        if (this.card.celulares !== null) {
            this.celular = this.card.celulares[0].number;
        } else if (typeof this.card.celuares === String) {
            this.celular = JSON.parse(this.card.celulares)[0].number;
        }

        if (this.isToInative === true) {
            this.timeoutInativeCard = setTimeout(() => {
                this.cardToInative();
            }, 60000);
        }
    },
    beforeDestroy() {
        clearTimeout(this.timeoutInativeCard);
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

.card-list {
    transition: transform .2s ease !important;
}

.card-list:hover {
    transform: scale(1.05) !important;
}
</style>