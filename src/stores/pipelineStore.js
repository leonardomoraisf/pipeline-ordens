import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
const Pusher = require('pusher-js');

export const usePipelineStore = defineStore('pipeline', {
    state: () => {
        return {
            isRequestingList: true,
            list: [],
            listLength: null,
            idEmpresa: null,
            lastList: {},
            pusher: new Pusher(
                process.env.NODE_ENV === 'development' ? process.env.VUE_APP_PUSHER_API_KEY : window.PUSHER_APP_KEY,
                {
                    cluster: process.env.NODE_ENV === 'development' ? 'sa1' : window.PUSHER_APP_CLUSTER,
                    authEndpoint: "/api/pusher/auth",
                }
            ),
            pusherChannel: null,
            pusherUserChannelCount: 0,
            tiposMovimento: {
                0: "Orçamento",
                1: "Venda",
                2: "Venda e-Commerce",
                3: "Consignado",
            },
            cardsToInactive: [],
            isShowingModalEditCardComments: false,
            editingCard: {
                celulares: null,
                comentarios: "",
                data_hora_cadastro: "0000-00-00T00:00:00",
                data_hora_registro: "0000-00-00T00:00:00",
                id_card: 0,
                id_status: 0,
                nome: "",
                posicao: 0,
                telefones: null,
                valor: 0,
                colorStatus: null,
                corTextoCard: null
            },
            lastEditedCard: {
                celulares: null,
                comentarios: "",
                data_hora_cadastro: "0000-00-00T00:00:00",
                data_hora_registro: "0000-00-00T00:00:00",
                id_card: 0,
                id_status: 0,
                nome: "",
                posicao: 0,
                telefones: null,
                valor: 0,
            },
            isShowingModalInactiveCardList: false,
            inactiveCardList: [],

            // PUSHER
            newCard: {},
            editedCard: {},
            editedCardStatus: {},

            funcQueue: [],
            isExecFuncQueue: false,

            updateListInactive: false,

            editedCardWAction: {},
            fromInactiveCardList: false
        }
    },
    getters: {
        getIsRequestingList: (state) => {
            return state.isRequestingList;
        },

        getList: (state) => {
            return state.list;
        },

        getLastList: (state) => {
            return state.lastList;
        },

        getIdEmpresa: (state) => {
            return state.idEmpresa;
        }
    },
    actions: {
        async setList() {

            const response = await apiService.pipeline.list();

            this.list = response;

            this.setListLength();

            this.setIdEmpresa();
        },

        setListLength() {
            this.listLength = this.list.length;
        },

        setIdEmpresa() {

            this.idEmpresa = this.list[this.listLength - 1].id_empresa;
            this.list.splice(this.listLength - 1, 1);

            this.listLength = this.list.length;

            this.setAdditionalInfos();
        },

        setAdditionalInfos() {

            if (this.listLength > 0) {

                this.list = this.list.map((status, index) => {
                    return {
                        ...status,
                        ordem: index + 1,
                        cards: status.cards !== null ? JSON.parse(status.cards) : [],
                    }
                });
            }

            this.setLastList();
            this.bindPusher();
        },

        setLastList() {

            if (this.listLength === 0) {
                this.lastList = {
                    ordem: 0,
                };
            } else {
                this.lastList = this.list[this.listLength - 1];
            }
        },

        async bindPusher() {

            this.pusherChannel = this.pusher.subscribe(
                "private-company-" + this.idEmpresa
            );

            this.pusherChannel.bind("card-criado", (data) => {
                if (!data[0]) return;

                var newCard = data[0];
                newCard.posicao = parseFloat(newCard.posicao);
                newCard.valor = parseFloat(newCard.valor);
                newCard.fixed = false;

                this.newCard = newCard;
            });

            this.pusherChannel.bind("client-card-editado", (data) => {
                if (!data.card) return;

                var editedCard = data.card;

                editedCard.posicao = parseFloat(editedCard.posicao);
                editedCard.valor = parseFloat(editedCard.valor);

                this.editedCard = editedCard;
            });

            this.pusherChannel.bind("client-card-editado-status", (data) => {
                if (!data.card) return;

                var editedCardStatus = data.card;

                editedCardStatus.posicao = parseFloat(editedCardStatus.posicao);
                editedCardStatus.valor = parseFloat(editedCardStatus.valor);

                this.editedCardStatus = editedCardStatus;
            });

            this.pusherChannel.bind("client-status-criado", (data) => {
                if (!data.status) return;

                var newStatus = data.status;
                this.addStatus(newStatus.id_status, newStatus);
                ToastTopStart5.fire("Opa!", `O status ${newStatus.nome} foi criado!`, "info");
            });

            this.pusherChannel.bind("client-status-editado", (data) => {
                if (!data.status) return;

                var editedStatus = data.status;
                this.editStatus(editedStatus);
            });

            this.pusherChannel.bind("client-card-inativo", (data) => {
                if (!data.card) return;

                this.editedCardWAction = data.card;
            });

            await new Promise((resolve, reject) => {
                this.pusherChannel.bind("pusher:subscription_succeeded", () => {
                    resolve();
                });
            });

            this.pusherChannel.bind("pusher:subscription_count", (data) => {
                this.pusherUserChannelCount = data.subscription_count;
            });

            this.isRequestingList = false;
        },

        async calculaOrdemLista() {

            this.list = this.list.map((status, index) => {
                return {
                    ...status,
                    ordem: index + 1
                }
            });
        },

        async editStatus(data) {
            if (data.ativo === 0) {
                ToastTopStart5.fire("Opa!", "Status inativado...", "info");
                return this.removeStatus(data.id_status);
            }

            this.list.forEach((status) => {
                if (data.id_status === status.id_status) {
                    status.nome = data.nome;
                    status.color = data.color;
                }
            });
            ToastTopStart5.fire("Opa!", "Status editado...", "info");
        },

        async addStatus(idStatus, data) {
            let statusFull = {
                id_status: idStatus,
                ...data,
                cards: [],
                ordem: this.lastList.ordem + 1
            };
            this.list.push(statusFull);

            await this.setListLength();
            this.setLastList();
        },

        async removeStatus(idStatus) {
            let index = this.list.findIndex((status) => status.id_status === idStatus);

            this.list.splice(index, 1);
            await this.setListLength();
            await this.calculaOrdemLista();
            this.setLastList();
        },

        /**
         * Adiciona uma função "func" à fila para alterar a posição de um cartão.
         * @param {Function} func - Função que altera a posição de um cartão.
         */
        addNewFunc(func) {
            this.addToFuncQueue(func);
        },

        /**
         * Adiciona uma função "func" à fila de funções para alterar a posição de cartões.
         * @param {Function} func - Função que altera a posição de um cartão.
         */
        async addToFuncQueue(func) {
            this.funcQueue.push(func);
            await this.executeNextFunc();
        },

        /**
         * Executa a próxima função na fila de funções para alterar a posição de cartões.
         */
        async executeNextFunc() {
            if (this.isExecOfQueue || this.funcQueue.length === 0) {
                return;
            }
            this.isExecOfQueue = true;
            const func = this.funcQueue.shift();
            try {
                await func();
            } catch (err) {
                console.error(err);
            } finally {
                this.isExecOfQueue = false;
                await this.executeNextFunc();
            }
        },

        async verificaCardInToInactive(idCard) {
            let index = this.cardsToInactive.findIndex((card) => card.id_card === idCard);
            if (index !== -1) return true;
            return false;
        },

        async triggerPusher(event, data) {
            if (this.pusherUserChannelCount > 1) {
                this.pusherChannel.trigger(event, data);
            }
        }
    },
})
