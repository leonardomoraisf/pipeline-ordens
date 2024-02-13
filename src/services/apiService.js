import axiosService from "./axiosService";

const axios = axiosService;

var response = {};
const throwError = (msg) => {
    ToastTopEnd5.fire("Erro!", msg, "error");
};

const apiService = {

    pipeline: {
        anonymousPost: async (url, data) => {

            await axios.post(url, data)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        list: async () => {

            await axios.get(`${window.API_V2}/pipeline/list`)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        setIdPipeline: async (idStatus) => {

            await axios.post(`${window.API_V2}/pipeline/setId`, idStatus)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },
    },

    status: {
        create: async (data) => {

            await axios.post(`${window.API_V2}/pipeline/status/create`, data)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        edit: async (idStatus, data) => {

            await axios.put(`${window.API_V2}/pipeline/status/${idStatus}/edit`, data)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        getAllInactive: async () => {

            await axios.get(`${window.API_V2}/pipeline/status/inactive`)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },
    },

    card: {
        edit: async (idCard, data) => {

            await axios.put(`${window.API_V2}/pipeline/cards/${idCard}/edit`, data)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        getInactive: async (data) => {

            await axios.post(`${window.API_V2}/pipeline/cards/inactive`, data)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        },

        delete: async(idCard) => {

            await axios.delete(`${window.API_V2}/pipeline/cards/${idCard}/delete`)
                .then(res => {
                    response = res.data;
                })
                .catch(err => {
                    throwError(err.message);
                    return {
                        error: true,
                        message: err.message
                    };
                });

            if (response.error || response.trace) {
                throwError(response.message);
            }

            return response;
        }
    }

}

export default apiService;
