<template>
    <div>
        <transition name="modal">
            <div class="z-50 overflow-x-hidden overflow-y-auto flex justify-center items-center modal" v-if="toggleModal">
                <div class="relative mx-auto w-full">
                    <div class="bg-white w-full rounded-md h-screen">

                        <form @submit.prevent="onSubmit">
                            <div
                                class="w-full rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">

                                <div class="flex items-center space-x-4">
                                    <div :style="{ backgroundColor: isEdit === 0 ? regStatusColor : editStatusColor }"
                                        :class="{ 'shake': animated }" @click="toggleInputColor = !toggleInputColor"
                                        class="cursor-pointer hover:scale-125 z-10 flex items-center justify-center w-6 h-6 p-6 rounded-full shrink-0 group-hover:scale-110 status-circle">
                                        <p v-if="isEdit === 0" class="text-xl" :style="{ color: colorStatusTextRef }">{{
                                            lastList.ordem + 1
                                        }}</p>
                                        <p v-if="isEdit === 1" class="text-xl" :style="{ color: colorStatusTextRef }">{{
                                            list.ordem
                                        }}</p>
                                    </div>

                                    <div class="w-full">
                                        <div v-if="isEdit === 0" class="relative">
                                            <input
                                                class="text-2xl w-full font-semibold px-3 max-w-full py-6 rounded-md shadow appearance-none border outline-none text-gray-700 leading-tight focus:shadow-outline"
                                                type="text" ref="regStatusNameRef" placeholder="Nome do status..."
                                                name="regStatusName" v-model="regStatusName"
                                                :class="{ 'text-red-500': regStatusName.length > maxLength, 'border-red-500': regStatusName.length > maxLength }">
                                            <p class="fixed top-4 right-5 font-semibold text-sm text-gray-500"
                                                :class="{ 'text-red-500': regStatusName.length > maxLength }">{{
                                                    regStatusName.length }} | máx: {{ maxLength }}</p>
                                        </div>

                                        <div v-if="isEdit === 1" class="relative">
                                            <input
                                                class="text-2xl w-full font-semibold px-3 max-w-full py-6 rounded-md shadow appearance-none border outline-none text-gray-700 leading-tight focus:shadow-outline"
                                                type="text" ref="editStatusNameRef" placeholder="Nome do status..."
                                                name="editStatusName" v-model="editStatusName"
                                                :class="{ 'text-red-500': editStatusName.length > maxLength, 'border-red-500': editStatusName.length > maxLength }">
                                            <p class="fixed top-4 right-5 font-semibold text-sm text-gray-500"
                                                :class="{ 'text-red-500': editStatusName.length > maxLength }">{{
                                                    editStatusName.length }} | máx: {{ maxLength }}</p>
                                        </div>

                                    </div>
                                </div>

                                <div class="flex justify-start items-center max-w-fit" v-if="toggleInputColor">
                                    <ColorPicker v-if="isEdit === 0" :color="regColor"
                                        :onEndChange="color => onChange(color, 'end')" />
                                    <ColorPicker v-if="isEdit === 1" :color="editColor"
                                        :onEndChange="color => onChange(color, 'end')" />
                                </div>

                            </div>
                            <div class="p-4">
                                <div class="p-3 rounded-md mt-2">
                                    <p class="text-red-600/80 text-center text-xl font-semibold my-3" v-if="isShowingError">
                                        {{ errorMessage }}
                                    </p>

                                    <div class="absolute bottom-0 right-0 p-3 flex justify-end">

                                        <div v-if="!isSubmiting">
                                            <button type="button" @click="closeModal"
                                                class="px-8 py-4 text-xl font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none">Cancelar</button>
                                            <button type="submit"
                                                class="px-8 py-4 ml-6 text-xl font-medium text-white salvar rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-300 focus:outline-none hover:scale-110">{{
                                                    buttonName }}</button>
                                        </div>

                                        <div class="flex justify-end" v-if="isSubmiting">
                                            <div class="hollow-dots-spinner mt-24">
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                                <div class="dot"></div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </transition>
        <Transition name="fade" appear>
            <div v-if="toggleModal" class="absolute inset-0 z-40 bg-black/30"></div>
        </Transition>

    </div>
</template>

<script>
import { ref, nextTick } from "vue";
import { ColorPicker } from 'vue-color-gradient-picker';

export default {
    name: 'SideModal',
    components: {
        ColorPicker
    },
    props: {
        list: Object,
        lastList: Object,
        toggleModal: {
            type: Boolean,
            default: ref(false)
        },
        colorStatusText: String,
        animated: Boolean,
        ajustarCorTexto: Function
    },
    data() {
        return {
            isEdit: this.list.id_status !== 0 ? 1 : 0,
            bgStatusCircle: this.list.color ? this.list.color : '#2563eb',
            isSubmiting: ref(false),
            isShowingError: ref(false),
            errorMessage: '',
            editStatusName: '',
            buttonName: this.list.id_status !== 0 ? 'Salvar' : 'Adicionar',
            toggleInputColor: ref(false),
            maxLength: 50,
            regStatusName: '',
            regStatusColor: '#2563eb',
            editStatusName: this.list.nome,
            editStatusColor: this.list.color,
            backupEditStatusName: this.list.nome,
            backupEditStatusColor: this.list.color,
            regColor: {
                red: 37,
                green: 99,
                blue: 235,
                alpha: 1
            },
            editColor: {
                red: 37,
                green: 99,
                blue: 235,
                alpha: 1
            },
            colorStatusTextRef: ref(this.colorStatusText)
        }
    },
    mounted(){
        if(this.isEdit === 1){
            this.colorStatusTextRef = this.ajustarCorTexto(this.editStatusColor);
        }
    },
    methods: {
        rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        },
        onChange(attrs, name) {
            let color = this.rgb2hex(attrs.style);

            if (this.isEdit === 0) {
                this.regStatusColor = color;
                this.regColor.red = attrs.red;
                this.regColor.green = attrs.green;
                this.regColor.blue = attrs.blue;
                this.regColor.alpha = attrs.alpha;
                this.colorStatusTextRef = this.ajustarCorTexto(color);
            }

            if (this.isEdit === 1) {
                this.editStatusColor = color;
                this.editColor.red = attrs.red;
                this.editColor.green = attrs.green;
                this.editColor.blue = attrs.blue;
                this.editColor.alpha = attrs.alpha;
                this.colorStatusTextRef = this.ajustarCorTexto(color);
            }
        },
        async toggleInputColorFunc() {
            if (this.toggleInputColor === true) {
                this.toggleInputColor = !this.toggleInputColor;
                return;
            }

            this.toggleInputColor = !this.toggleInputColor;
            await nextTick();

            if (this.isEdit === 0) {
                this.$refs.regStatusColorRef.click();
            }

            if (this.isEdit === 1) {
                this.$refs.editStatusColorRef.click();
            }
        },
        closeModal() {
            if (this.isEdit === 1) {
                if (this.editStatusName !== this.backupEditStatusName || this.editStatusColor !== this.backupEditStatusColor) {
                    this.$confirm(
                        {
                            message: 'Você fez alterações! Deseja continuar editando?',
                            button: {
                                no: 'Não, descartar',
                                yes: 'Sim'
                            },
                            /**
                             * Callback Function
                             * @param {Boolean} confirm
                             */
                            callback: confirm => {
                                if (confirm) {

                                } else {
                                    this.toggleInputColor = false;
                                    this.editStatusName = this.list.nome;
                                    this.editStatusColor = this.list.color;
                                    this.backupEditStatusName = this.list.nome;
                                    this.backupEditStatusColor = this.list.color;
                                    this.colorStatusTextRef = this.colorStatusText;
                                    this.$emit('closeModal');
                                }
                            }
                        }
                    )
                } else {
                    this.toggleInputColor = false;
                    this.$emit('closeModal');
                }
            }
            if (this.isEdit === 0) {
                this.toggleInputColor = false;
                this.$emit('closeModal');
            }
        },
        onSubmit(ev) {
            this.isSubmiting = true;
            this.isShowingError = false;

            if (this.isEdit === 1) {
                // Salvar
                const { editStatusName } = Object.fromEntries(new FormData(ev.target));
                this.editStatusName = editStatusName;

                if (this.editStatusName == '') {
                    this.isSubmiting = false;
                    this.errorMessage = 'O nome não pode estar vazio!';
                    this.isShowingError = true;
                    return;
                }

                if (this.editStatusName.length > this.maxLength) {
                    this.isSubmiting = false;
                    this.errorMessage = 'O tamanho máximo do nome é de ' + this.maxLength + ' caracteres!';
                    this.isShowingError = true;
                    return;
                }

                let body = {
                    nome: this.editStatusName,
                    color: this.editStatusColor
                }

                this.axios.put('/v2/pipeline/status/' + this.list.id_status + '/edit', body)
                    .then(res => {
                        this.isSubmiting = false;
                        this.$emit('statusEdited', body);
                        this.$emit('closeModal');
                        this.backupEditStatusName = this.list.nome;
                        this.backupEditStatusColor = this.list.color;
                        Toast.fire(res.data.message, "Atualizando pipeline...", "success");
                    })
                    .catch(err => {
                        this.isSubmiting = false;
                        this.isShowingError = true;
                        this.errorMessage = res.data.message;
                    })
            }

            if (this.isEdit === 0) {
                // Adicionar
                const { regStatusName } = Object.fromEntries(new FormData(ev.target));
                this.regStatusName = regStatusName;

                if (this.regStatusName == '') {
                    this.isSubmiting = false;
                    this.errorMessage = 'O nome não pode estar vazio!';
                    this.isShowingError = true;
                    return;
                }

                if (this.regStatusName.length > this.maxLength) {
                    this.isSubmiting = false;
                    this.errorMessage = 'O tamanho máximo do nome é de ' + this.maxLength + ' caracteres!';
                    this.isShowingError = true;
                    return;
                }

                let body = {
                    nome: this.regStatusName,
                    color: this.regStatusColor
                }

                this.axios.post('/v2/pipeline/status/create', body)
                    .then(res => {
                        this.isSubmiting = false;
                        this.$refs.regStatusNameRef.value = '';
                        this.regColor = {
                            red: 37,
                            green: 99,
                            blue: 235,
                            alpha: 1
                        };
                        this.$emit('closeModal');
                        this.colorStatusTextRef = this.colorStatusText;
                        this.regStatusName = '';
                        this.regStatusColor = '#2563eb';
                        Toast.fire(res.data.message, "Atualizando pipeline...", "success");
                    })
                    .catch(err => {
                        this.isSubmiting = false;
                        this.isShowingError = true;
                        this.errorMessage = res.data.message;
                    })
            }
        }
    }
}
</script>

<style scoped>
.salvar {
    background-color: rgba(65 184 131 /1);
    transition: transform 0.2s ease-in-out;
}

.salvar:hover {
    background-color: rgb(61, 174, 123);
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

.modal-enter-active,
.modal-leave-active {
    transition: transform 0.5s ease-in-out;
}

.modal-enter,
.modal-leave-to {
    transform: translateX(100%);
}


.modal {
    position: fixed;
    top: 0;
    right: 0;
    width: 30%;
}

@media (max-width: 1536px) {
    .modal {
        width: 40%;
    }
}

@media (max-width: 1280px) {
    .modal {
        width: 50%;
    }
}

@media (max-width: 1024px) {
    .modal {
        width: 70%;
    }
}

@media (max-width: 768px) {
    .modal {
        width: 100%;
    }
}

.shake {
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>

<style src="vue-color-gradient-picker/dist/index.css" lang="css" />