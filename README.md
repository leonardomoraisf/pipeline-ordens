# pipeline

Este projeto permite à empresa organizar seus serviços de maneira simpllis :)
Está localizada na aba "extras".

Essa tela espera um json com seus status, e cada status com seus cards em json, exemplo: 

[
    {
        "id_status": 128,
        "nome": "Aguardando confirmação do cliente",
        "color": "#ead625",
        "ativo": 1,
        "cards": null
    },
    {
        "id_status": 129,
        "nome": "Aguardando confirmação do técnico",
        "color": "#9825ea",
        "ativo": 1,
        "cards": "[{\"id_card\":264,\"id_status\":129,\"posicao\":703.125,\"comentarios\":null,\"data_hora_registro\":\"2023-05-04T14:03:14\",\"data_hora_cadastro\":\"2023-05-03T12:15:24\",\"ativo\":1,\"id_movimento\":318,\"tipo\":1,\"movimento_ativo\":1,\"valor\":100.0000000000,\"nome\":\"Leonardo Morais\",\"celulares\":[{\"number\": \"31971516241\"}],\"telefones\":null}, \n {\"id_card\":263,\"id_status\":129,\"posicao\":1406.25,\"comentarios\":null,\"data_hora_registro\":\"2023-05-04T14:01:33\",\"data_hora_cadastro\":\"2023-05-03T12:14:57\",\"ativo\":1,\"id_movimento\":317,\"tipo\":1,\"movimento_ativo\":1,\"valor\":25.0000000000,\"nome\":\"Adilson Barison\",\"celulares\":null,\"telefones\":null}, \n {\"id_card\":265,\"id_status\":129,\"posicao\":2109.38,\"comentarios\":\"Teste\",\"data_hora_registro\":\"2023-05-04T14:03:02\",\"data_hora_cadastro\":\"2023-05-03T12:15:45\",\"ativo\":1,\"id_movimento\":319,\"tipo\":1,\"movimento_ativo\":1,\"valor\":274.4400000000,\"nome\":\"Consumidor\",\"celulares\":null,\"telefones\":null}]"
    },
    {
        "id_status": 130,
        "nome": "Conserto",
        "color": "#06a2aa",
        "ativo": 1,
        "cards": null
    },{
        "id_empresa": 7
    }
]

Por último, a tela espera o id da empresa que está utilizando o pipeline. Ela remove esse id e utiliza para inscrição no pusher.

Essa tela utiliza o tailwind, além de css puro, ícones do FontAwesome e o axios para requisições na api.
Sua api está na v2, e se encontra em /v2/pipeline/*