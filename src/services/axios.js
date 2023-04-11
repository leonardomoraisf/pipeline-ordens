import axios from 'axios';

const axiosService = axios.create({


    
});

/*
axiosService.interceptors.response.use(function (response) {
  // Qualquer código de status que dentro do limite de 2xx faz com que está função seja acionada
  // Faz alguma coisa com os dados de resposta
  console.log(response);

      // Verifica se a resposta veio de dentro do iframe
      if (window.self !== response.config.window) {
        // Realiza a ação desejada
        console.log('iframe');
      }

  return response;
}, function (error) {
  // Qualquer código de status que não esteja no limite do código 2xx faz com que está função seja acionada
  // Faz alguma coisa com o erro da resposta
  return Promise.reject(error);
});
*/

export default axiosService;