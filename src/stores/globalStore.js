import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => {
        return {
            actualDateFormatted: null,
            onlineStatus: navigator.onLine,
            requestQueue: [],
            isRequestingOfQueue: false
        }
    },
    getters: {
        getActualDateFormatted: (state) => {
            return state.actualDateFormatted;
        }
    },
    actions: {
        startNecessary() {
            this.setActualDateFormatted();
            this.verifyForInternet();
        },
        setActualDateFormatted() {

            let dataAtual = new Date();
            let ano = dataAtual.getFullYear();
            let mes = ("0" + (dataAtual.getMonth() + 1)).slice(-2);
            let dia = ("0" + dataAtual.getDate()).slice(-2);
            let dataFormatada = `${ano}-${mes}-${dia}`;
            this.actualDateFormatted = dataFormatada;
        },

        verifyForInternet() {
            window.addEventListener("online", this.verifyOnlineStatus);
            window.addEventListener("offline", this.verifyOfflineStatus);
        },

        verifyOnlineStatus() {
            this.onlineStatus = navigator.onLine;

            if (this.onlineStatus === true) {
                ToastConfirmCenter.fire("Opa!", "Sua conexão voltou!", "success");
            }
        },

        verifyOfflineStatus() {
            this.onlineStatus = navigator.onLine;

            if (this.onlineStatus === false) {
                ToastConfirmCenter.fire(
                    "Eita!",
                    "Parece que você perdeu sua conexão com a internet. Quaisquer modificações feitas no pipeline não serão salvas!",
                    "warning"
                );
            }
        },

        /**
         * Adiciona um objeto "request" que representa uma solicitação de edição de card à fila de solicitações.
         * @param {Function} request - Função que representa a solicitação de edição de card.
         */
        addNewRequest(request) {
            this.addToRequestQueue(request);
        },

        /**
         * Adiciona a solicitação "request" à fila de solicitações e inicia a execução da próxima solicitação.
         * @param {Function} request - Função que representa a solicitação de edição de card.
         */
        async addToRequestQueue(request) {
            this.requestQueue.push(request);
            await this.executeNextRequest();
        },

        /**
         * Executa a próxima solicitação da fila, se houver, e trata erros de forma adequada.
         */
        async executeNextRequest() {
            if (this.isRequestingOfQueue || this.requestQueue.length === 0) {
                return;
            }

            this.isRequestingOfQueue = true;
            const request = this.requestQueue.shift();

            try {
                await request();
            } catch (err) {
                ToastTopStart5.fire("Erro!", err.message, "error");
            } finally {
                this.isRequestingOfQueue = false;
                await this.executeNextRequest();
            }
        },
    },
})
