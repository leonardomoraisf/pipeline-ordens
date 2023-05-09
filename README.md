# Pipeline - Fluxo de trabalho

Este projeto é uma tela que permite ao usuário controlar seu fluxo de trabalho,
conseguindo criar status e gerenciar os cards de acordo com a etapa em que aquele
serviço/venda está.
Se a empresa possuir um status criado, qualquer orçamento, consignado ou venda feita 
pela empresa, será criado também um card nessa tela, facilitando a organização e controle
de onde está aquele movimento.
Um card é criado se, e somente se, a empresa possui ao menos um status ativo, e/ou setar o
s_id_status_pipeline no back-end.

Por: Leonardo Morais Franca

**Tecnilogias usadas**

- VueJs 2
- Tailwind
- Pusher

## Funcionalidades

- Cards
    - Criar através da tela iframe 
    - Mover entre status
    - Mover entre posição
    - Editar comentários
    - Tornar inativo/finalizado
    - Pesquisar pela tela de cards finalizados

- Status
    - Criar
    - Editar cor e nome
    - Inativar, apenas se não possui cards em sua lista

## Instaladores

Se você quer buildar o projeto no sistema, precisará de:

- NodeJs
- VueCli

### Pré-requisitos

Para rodar esse projeto no modo de desenvolvimento, você necessita das ferramentas básicas
para um ambiente de desenvolvimento VueJs, que podem ser encontrados [aqui](https://nodejs.org/pt-br) e [aqui](https://cli.vuejs.org/).

Clone o repositório (como é ensinado abaixo) dentro da pasta "frontend" do sistema, que se encontra
na raiz do mesmo.

**Clonando o repositório**

```
$ git clone https://github.com/leonardomoraisf/pipeline-ordens

$ cd pipeline-ordens
```

**Instalando dependências**

```
$ npm install
```

**Rodando o projeto local**

O projeto será aberto na porta padrão do seu NodeJs e necessita do sistema up no docker.
Ele fará um proxy na porta 8585, porta padrão do sistema Simpllis.

```
$ npm run serve
```

**Buildando o projeto em SO Linux - MAIS RECOMENDADO**

Altere se necessário a linha "build" no arquivo package.json

```
$ npm run build
```

**Buildando o projeto em SO Windows**

Altere se necessário a linha "buildWindows" no arquivo package.json, onde estiver "caminho"
mude para o caminho completo até public/vue/pipeline, exemplo: D:/Blegon/dev_environment/core/public/vue/pipeline

```
$ npm run buildWindows
```


**Buildando o projeto no Docker**

Altere se necessário a linha "buildDocker" no arquivo package.json

```
$ npm run buildDocker
```

**Conclusão da instalação**

Se tudo ocorrer bem, uma view com template blade será criado no caminho app/v1/Views/
com o nome de "pipeline-kanban-ordens.blade.php".
Os assets estarão em public/vue/pipeline.
Isso tudo é configurado no arquivo "vue.config.js"

**Funcionamento das telas**

No componente principal "BoardKanban", é onde acontece a requisição da lista de status com cards 
e a inscrição ao pusher logo após, a tela só permite qualquer modificação após as 
duas requisições terminarem.

O projeto espera um json com status e cada status com seus respectivos cards em json, exemplo: 
[
    {
        "id_status": 128,
        "nome": "Aguardando confirmação do cliente",
        "color": "#ead625",
        "ativo": 1,
        "cards": "[{\"id_card\":267,\"id_status\":128,\"posicao\":263.672,\"comentarios\":null,\"data_hora_registro\":\"2023-05-08T14:41:26\",\"data_hora_cadastro\":\"2023-05-05T13:34:22\",\"ativo\":1,\"id_movimento\":321,\"tipo\":1,\"movimento_ativo\":1,\"valor\":387.6200000000,\"nome\":\"Leonardo Morais\",\"celulares\":[{\"number\": \"31971516241\"}],\"telefones\":null}]"
    },
    {
        "id_status": 129,
        "nome": "Aguardando confirmação do técnico",
        "color": "#9825ea",
        "ativo": 1,
        "cards": "[{\"id_card\":272,\"id_status\":129,\"posicao\":516.208,\"comentarios\":null,\"data_hora_registro\":\"2023-05-08T14:46:38\",\"data_hora_cadastro\":\"2023-05-05T13:34:57\",\"ativo\":1,\"id_movimento\":326,\"tipo\":0,\"movimento_ativo\":1,\"valor\":20.0000000000,\"nome\":null,\"celulares\":null,\"telefones\":null}, \n {\"id_card\":269,\"id_status\":129,\"posicao\":563.136,\"comentarios\":null,\"data_hora_registro\":\"2023-05-08T14:41:39\",\"data_hora_cadastro\":\"2023-05-05T13:34:25\",\"ativo\":1,\"id_movimento\":323,\"tipo\":1,\"movimento_ativo\":1,\"valor\":387.6200000000,\"nome\":\"Leonardo Morais\",\"celulares\":[{\"number\": \"31971516241\"}],\"telefones\":null}]"
    },
    {
        "id_status": 130,
        "nome": "Conserto",
        "color": "#2a8e93",
        "ativo": 1,
        "cards": "[{\"id_card\":264,\"id_status\":130,\"posicao\":469.28,\"comentarios\":null,\"data_hora_registro\":\"2023-05-08T15:17:47\",\"data_hora_cadastro\":\"2023-05-03T12:15:24\",\"ativo\":1,\"id_movimento\":318,\"tipo\":1,\"movimento_ativo\":1,\"valor\":100.0000000000,\"nome\":\"Leonardo Morais\",\"celulares\":[{\"number\": \"31971516241\"}],\"telefones\":null}]"
    },
    {
        "id_status": 131,
        "nome": "Entrega",
        "color": "#c621a0",
        "ativo": 1,
        "cards": "[{\"id_card\":271,\"id_status\":131,\"posicao\":27.8092,\"comentarios\":null,\"data_hora_registro\":\"2023-05-08T14:14:41\",\"data_hora_cadastro\":\"2023-05-05T13:34:52\",\"ativo\":1,\"id_movimento\":325,\"tipo\":0,\"movimento_ativo\":1,\"valor\":20.0000000000,\"nome\":null,\"celulares\":null,\"telefones\":null}]"
    },
    {
        "id_status": 132,
        "nome": "Concluído",
        "color": "#01bf01",
        "ativo": 1,
        "cards": null
    },
    {
        "id_empresa": 7
    }
]

Por fim, o id_empresa é necessário para a inscrição no pusher de maneira correta,
canal: private-company-{id_empresa}

**Futuras mudanças**

Caso queira alterar para que o pipeline será usado, basta criar um novo componente
como o "CardListItem", e alterar o que é retornado na parte de cards de cada status.
Após isso, uma verificação simples para diferenciar a lista recebida.

## Contribuindo

Envie dúvidas ou melhorias!

Email: mfrancaleonardo@gmail.com

Obrigado!

## Licença

Esse projeto é licenciado pelo MIT License - veja em [LICENSE.md](https://github.com/leonardomoraisf/pipeline-ordens/blob/main/README.md) para detalhes.