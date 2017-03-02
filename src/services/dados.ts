export const estabelecimentos = [
    {
        nome: 'Passaporte do Gaúcho ',
        imagemCapa: 'http://passaportedogaucho.podepedir.com.br/uploads/og_image-57a0b38bebfd8.png',
        endereco: "Av x, 113",
        telefone: '9998-8928',
        celular: {
            numero: '9889-9485',
            whatsapp: true
        },
        $key: '1'
    },
    {
        nome: 'Marios Burgers',
        imagemCapa: 'http://static-images.ifood.com.br/image/upload/f_auto,t_low/logosgde/logomarca_mario_rgers.png',
        endereco: "Av Pratagy, 14",
        telefone: '9898-8928',
        celular: {
            numero: '9889-9123',
            whatsapp: true
        },
        $key: '2'
    },
    {
        nome: 'BigLoso',
        imagemCapa: 'https://igx.4sqi.net/img/general/200x200/Shlj7rjpt6Wac8NagXm6IDgQFZXW1Jn7mm6uwFgyJIk.jpg',
        endereco: "Av Tabuleiro, 42",
        telefone: '9898-8900',
        celular: {
            numero: '9923-9000',
            whatsapp: true
        },
        $key: '3'
    }   
];

export const lanches = [
        {
            nome: 'Salada de frango',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Creme de frango'},
                {nome: 'Tomate'},
                {nome: 'Cebola'},
                {nome: 'Alface'},
                {nome: 'Gergelim'}
            ],
            ingredientes_truncados: 'Pão, creme de frango, tomate, cebola, alface e gergelim',
            chave_estabelecimento: '1',
            nome_estabelecimento: 'Passaporte do gaúcho',
            preço: '15',
            $key: '1'
        },
        {
            nome: 'Passburguer',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Alcatra'},
                {nome: 'Queijo'},
                {nome: 'Alface'},
                {nome: 'Tomate'}
            ],
            ingredientes_truncados: 'Pão, alcatra, queijo, alface, tomate ',
            chave_estabelecimento: '1',
            nome_estabelecimento: 'Passaporte do gaúcho',
            preço: '17',
            $key: '2'
        },
        {
            nome: 'Passaporte de carne com salsicha',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Carne moída'},
                {nome: 'Salsicha'},
                {nome: 'Verdura'}
            ],
            ingredientes_truncados: 'Pão, carne moída, salsicha, verdura',
            chave_estabelecimento: '1',
            nome_estabelecimento: 'Passaporte do gaúcho',
            preço: '17',
            $key: '3'
        },
        {
            nome: 'Passaporte de frango com salsicha',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Frango desfiado'},
                {nome: 'Salsicha'},
                {nome: 'Verdura'}
            ],
            ingredientes_truncados: 'Pão, frango desfiado, salsicha, verdura',
            chave_estabelecimento: '1',
            nome_estabelecimento: 'Passaporte do gaúcho',
            preço: '16',
            $key: '4'
        },
        {
            nome: 'X-Alcatra',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Alcatra'},
                {nome: 'Queijo'},
                {nome: 'Presunto'}
            ],
            ingredientes_truncados: 'Pão, alcatra, queijo, presunto ',
            chave_estabelecimento: '2',
            nome_estabelecimento: 'Marios Burgers',
            preço: '15',
            $key: '5'
        },
        {
            nome: 'X-burguer',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Hamburguer'},
                {nome: 'Queijo'},
                {nome: 'Presunto'},
                {nome: 'Salada'}
            ],
            ingredientes_truncados: 'Pão, hamburguer, queijo, presunto, salada',
            chave_estabelecimento: '2',
            nome_estabelecimento: 'Marios Burgers',
            preço: '15',
            $key: '6'
        },
        {
            nome: 'X-filé de frango',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Frango'},
                {nome: 'Queijo'},
                {nome: 'Presunto'},
                {nome: 'Salada'}
            ],
            ingredientes_truncados: 'Pão, Frango, queijo, presunto, salada',
            chave_estabelecimento: '2',
            nome_estabelecimento: 'Marios Burgers',
            preço: '15',
            $key: '7'
        },
        {
            nome: 'X Burguer',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Hamburguer'},
                {nome: 'Queijo'},
                {nome: 'Presunto'},
                {nome: 'Salada'}
            ],
            ingredientes_truncados: 'Pão, hamburguer, queijo, presunto, salada',
            chave_estabelecimento: '3',
            nome_estabelecimento: 'Bigloso',
            preço: '16',
            $key: '8'
        },
        {
            nome: 'Filé de frango',
            ingredientes: [
                {nome: 'Pão'},
                {nome: 'Filé de frango'},
                {nome: 'Queijo'},
                {nome: 'Presunto'},
                {nome: 'Salada'}
            ],
            ingredientes_truncados: 'Pão, Filé de frango, queijo, presunto, salada',
            chave_estabelecimento: '3',
            nome_estabelecimento: 'Bigloso',
            preço: '15',
            $key: '9'
        }
    ]

export const lanches_por_estabelecimento = [
    {
        1: {
            1:{
                nome_lanche: 'Salada de frango',
                nome_estabelecimento: 'Passaporte do gaúcho',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'Creme de frango'},
                    {nome: 'Tomate'},
                    {nome: 'Cebola'},
                    {nome: 'Alface'},
                    {nome: 'Gergelim'}
                ],
                preco: '15'
            },
                2:{
                    nome_lanche: 'Passburguer',
                    nome_estabelecimento: 'Passaporte do gaúcho',
                    ingredientes: [
                        {nome: 'Pão'},
                        {nome: 'Alcatra'},
                        {nome: 'Queijo'},
                        {nome: 'Alface'},
                        {nome: 'Tomate'}
                    ],
                    ingredientes_truncados: 'Pão, alcatra, queijo, alface, tomate ',
                    preco: '17'
                },
                3: {
                    nome_lanche: 'Passaporte de carne com salsicha',
                    nome_estabelecimento: 'Passaporte do gaúcho',
                    ingredientes: [
                        {nome: 'Pão'},
                        {nome: 'Carne moída'},
                        {nome: 'Salsicha'},
                        {nome: 'Verdura'}
                    ],
                    ingredientes_truncados: 'Pão, carne moída, salsicha, verdura',
                    preco: '17'
                },
                4: {
                    nome_lanche: 'Passaporte de frango com salsicha',
                    nome_estabelecimento: 'Passaporte do gaúcho',
                    ingredientes: [
                        {nome: 'Frango'},
                        {nome: 'Carne moída'},
                        {nome: 'Salsicha'},
                        {nome: 'Verdura'}
                    ],
                    ingredientes_truncados: 'Frango, carne moída, salsicha, verdura',
                    preco: '17'
                }
        },
        2:{
            5: {
                nome_lanche: 'X-Alcatra',
                nome_estabelecimento: 'Marios Burguers',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'Alcatra'},
                    {nome: 'Queijo'},
                    {nome: 'Presunto'}
                ],
                ingredientes_truncados: 'Pão, alcatra, queijo, presunto ',
                preco: '17'
            },
            6: {
                nome_lanche: 'X-burguer',
                nome_estabelecimento: 'Marios Burguers',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'Hamburguer'},
                    {nome: 'Queijo'},
                    {nome: 'Presunto'},
                    {nome: 'Salada'}
                ],
                ingredientes_truncados: 'Pão, hamburguer, queijo, presunto, salada',
                preco: '17'
            },
            7: {
                nome_lanche: 'X-filé de frango',
                nome_estabelecimento: 'Marios Burguers',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'frango'},
                    {nome: 'Queijo'},
                    {nome: 'Presunto'},
                    {nome: 'Salada'}
                ],
                ingredientes_truncados: 'Pão, frango, queijo, presunto, salada',
                preco: '17'
            },
            8:{
                nome_lanche: 'X Burguer',
                nome_estabelecimento: 'Bigloso',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'Hamburguer'},
                    {nome: 'Queijo'},
                    {nome: 'Presunto'},
                    {nome: 'Salada'}
                ],
                ingredientes_truncados: 'Pão, hamburguer, queijo, presunto, salada',
                preco: '17'
            },
            9: {
                nome_lanche: 'Filé de frango',
                nome_estabelecimento: 'Bigloso',
                ingredientes: [
                    {nome: 'Pão'},
                    {nome: 'Frango'},
                    {nome: 'Queijo'},
                    {nome: 'Presunto'},
                    {nome: 'Salada'}
                ],
                ingredientes_truncados: 'Pão, frango, queijo, presunto, salada',
                preco: '17'
            }
        }
    }
]

export const ingredientes = ['Pão', 'Creme de frango', 'Tomate', 'Cebola', 'Alface', 'Gergelim', 'Alcatra', 'Carne Moída', 'Salsicha', 'Frango', 'Hamburguer']