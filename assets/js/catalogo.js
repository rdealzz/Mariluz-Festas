/* =========================================================
   Mariluz Festas — catálogo de locação e lista de orçamento
   Carregado antes de main.js: os cards já existem quando os
   efeitos de botão e cursor são ligados.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var WA = '5541996865017';
  var STORE = 'mariluz-lista';

  /* ---------- Catálogo: edite aqui ----------
     img: foto em assets/img (opcional). Sem foto, o card usa a ilustração em "art".
     badge: selo opcional ("Mais procurado").
     tag: como a peça sai da loja.
     preco: valor em reais (só aparece no site com MOSTRAR_PRECOS = true).
     Os valores abaixo vieram da loja online antiga (mariluzfestas.com.br) e precisam ser
     confirmados pela Mariluz antes de serem exibidos. */
  var MOSTRAR_PRECOS = false;
  var CATEGORIES = [
    { id: 'doces', label: 'Suportes para doces' },
    { id: 'kits', label: 'Kits pegue e monte' },
    { id: 'moveis', label: 'Painéis e mesas' },
    { id: 'baloes', label: 'Balões' },
    { id: 'detalhes', label: 'Detalhes' }
  ];
  /* Público dos kits (campo "publico"; um kit pode servir a mais de um):
     Infantil (menino, menina), Adulto (masculino, feminino) e Bebê (batizado, chá de bebê/fraldas/revelação).
     O subfiltro por público aparece em "Kits pegue e monte" e em "Suportes para doces". */
  var PUBLICOS = [
    { id: 'menino', grupo: 'Infantil', label: 'Menino' },
    { id: 'menina', grupo: 'Infantil', label: 'Menina' },
    { id: 'masculino', grupo: 'Adulto', label: 'Masculino' },
    { id: 'feminino', grupo: 'Adulto', label: 'Feminino' },
    { id: 'batizado', grupo: 'Bebê', label: 'Batizado' },
    { id: 'cha', grupo: 'Bebê', label: 'Chá de bebê' }
  ];
  var PEGUE = 'Pegue e monte', MONTAGEM = 'Montagem no local';
  var RETIRA = 'Retire na loja'; /* suportes para doces: não usar "Pegue e monte" para não confundir com os kits */
  var CATALOG = [
    /* Kits pegue e monte · com foto */
    { id: 'kit-gabby', cat: 'kits', publico: ['menina'], nome: 'Kit A Casa Mágica da Gabby', desc: 'Painel redondo da Gabby, cilindros rosa, Pandy e os gatinhos da turma, com suportes e tapete rosa.', img: 'assets/img/pm-gabby.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-chuva-de-amor', cat: 'kits', publico: ['menina'], nome: 'Kit Chuva de amor arco-íris', desc: 'Nuvem com lacinho, arco-íris e painéis em tons pastel, com mesas em formato de nuvem e flores.', img: 'assets/img/pm-chuva-de-amor.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-metoo', cat: 'kits', publico: ['menina'], nome: 'Kit Metoo bonecas', desc: 'Bonecas Metoo, coelhinha, cômoda rosa e cilindros em verde-água e rosa, com flores.', img: 'assets/img/pm-metoo.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-borboletas', cat: 'kits', publico: ['menina'], nome: 'Kit Borboletas', desc: 'Painéis verde e rosa com flores, borboletas gigantes vazadas e cilindros brancos.', img: 'assets/img/pm-borboletas.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ursinha-girl', cat: 'kits', publico: ['menina', 'cha'], nome: 'Kit Ursinha provençal rosa', desc: 'Ursinhas de vestido, cômodas provençais rosa, cavalinho e letreiro GIRL, para aniversário ou chá de bebê.', img: 'assets/img/pm-ursinha-girl.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-dragon-ball', cat: 'kits', publico: ['menino'], nome: 'Kit Dragon Ball Z', desc: 'Painel do Goku, totens do Vegeta e do Goku, mesinhas laranja e azul e estrelas.', img: 'assets/img/pm-dragon-ball.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-one-piece', cat: 'kits', publico: ['menino'], nome: 'Kit One Piece', desc: 'Painel do Luffy, cilindros One Piece, bandeira pirata, totens e arco de balões.', img: 'assets/img/pm-one-piece.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-aviao', cat: 'kits', publico: ['menino'], nome: 'Kit Aviação', desc: 'Painel com avião sobre a cidade, cilindros de céu e nuvens, aviões de madeira, globo e ursinho.', img: 'assets/img/pm-aviao.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ursinho-brinquedos', cat: 'kits', publico: ['menino', 'cha'], nome: 'Kit Ursinho e brinquedos', desc: 'Painel listrado azul com ursinho e pipa, cilindros com cavalinho de pau e brinquedos de madeira.', img: 'assets/img/pm-ursinho-brinquedos.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-marinheiro', cat: 'kits', publico: ['menino', 'batizado'], nome: 'Kit Marinheiro', desc: 'Ursinhos marinheiros, timão vermelho, boias, farol, âncora e navio, com móvel de madeira.', img: 'assets/img/pm-marinheiro.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-futebol', cat: 'kits', publico: ['menino', 'masculino'], nome: 'Kit Futebol Copa do Mundo', desc: 'Painel de bola com bandeiras, cilindros de gramado, troféus, chuteira e tapete verde.', img: 'assets/img/pm-futebol-copa.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-safari-baby', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Safári baby', desc: 'Painel dos bichinhos no jipe, cilindros de folhagem, elefante e girafa, com pelúcias.', img: 'assets/img/pm-safari-baby.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-fundo-do-mar', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Fundo do mar aquarela', desc: 'Painel com submarino, cilindros de madeira e rede, timão e pelúcias de polvo, caranguejo e tubarão.', img: 'assets/img/pm-fundo-do-mar.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-baby-shark', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Baby Shark', desc: 'Painel do Baby Shark, arco de balões azuis, cilindros, timão, boia e polvo.', img: 'assets/img/pm-baby-shark.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-dinossauros', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Dinossauros baby', desc: 'Painel de dinos em aquarela, caixotes amarelos, gramado e dinossauros de pelúcia.', img: 'assets/img/pm-dinossauros.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'mini-table-dpa', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit DPA', desc: 'Painel D.P.A., cilindros temáticos, capas dos detetives e acessórios.', img: 'assets/img/pm-dpa.webp', tag: PEGUE, badge: 'Novidade', preco: 340 },
    { id: 'kit-pandas', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Pandas', desc: 'Painel de pandas com bambu, cômoda rosa, totem e pelúcias de panda e letreiro BOY.', img: 'assets/img/pm-pandas.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-chaves', cat: 'kits', publico: ['menino', 'menina', 'masculino', 'feminino'], nome: 'Kit Chaves', desc: 'Painel da vila, barril vermelho, totens do Chaves, Chiquinha, Quico e turma.', img: 'assets/img/pm-chaves.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-pascoa', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Páscoa', desc: 'Coelhos gigantes, aparador verde, cômoda rosa, ovos, pinheirinhos e vasos.', img: 'assets/img/pm-pascoa.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-patinho', cat: 'kits', publico: ['batizado', 'cha'], nome: 'Kit Patinho sálvia', desc: 'Painéis em arco branco e verde sálvia, mesas orgânicas, carrinho de vime, patinho e toalha de crochê.', img: 'assets/img/pm-patinho.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ursinho-baloes', cat: 'kits', publico: ['batizado', 'cha', 'menino', 'menina'], nome: 'Kit Ursinho com balões', desc: 'Painel do ursinho com balões em tons neutros, arco de balões, cilindros e ursos de pelúcia.', img: 'assets/img/pm-ursinho-baloes.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-cha-revelacao', cat: 'kits', publico: ['cha'], nome: 'Kit Chá revelação ursinhos', desc: 'Painel listrado com ursinho, cilindros rosa e azul, letreiros GIRL e BOY e silhuetas.', img: 'assets/img/pm-cha-revelacao.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-arco-rose', cat: 'kits', publico: ['feminino'], nome: 'Kit Arco rosé', desc: 'Painel em arco bege, cilindros rosa canelados, rosas brancas e suportes dourados.', img: 'assets/img/pm-arco-rose.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-arco-rose-madeira', cat: 'kits', publico: ['feminino'], nome: 'Kit Arco rosé madeira', desc: 'Painel em arco bege, cilindros rosa canelados, suportes de madeira e folhagens.', img: 'assets/img/pm-arco-rose-madeira.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-boho-dourado', cat: 'kits', publico: ['feminino'], nome: 'Kit Boho dourado', desc: 'Arco e mesas de ferro dourado com tampo de madeira, porta verde e arranjos de flores secas.', img: 'assets/img/pm-boho-dourado.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-verde-rose-dourado', cat: 'kits', publico: ['feminino'], nome: 'Kit Verde, rosé e dourado', desc: 'Arco de ferro com balões verde, rosé e dourado, mesas de ferro e madeira e copos-de-leite.', img: 'assets/img/pm-verde-rose-dourado.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-coracao', cat: 'kits', publico: ['feminino', 'masculino'], nome: 'Kit Coração verde', desc: 'Painel de coração branco, mesas orgânicas verdes, suportes de madeira e folhagens.', img: 'assets/img/pm-coracao-verde.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-love', cat: 'kits', publico: ['feminino', 'masculino'], nome: 'Kit Love', desc: 'Painel em arco bege, cilindros brancos, letras LOVE e folhagens, para noivados e aniversários.', img: 'assets/img/pm-love.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-rustico-verde', cat: 'kits', publico: ['masculino', 'feminino'], nome: 'Kit Rústico verde', desc: 'Painel em arco verde, treliça de madeira, cilindro branco, mesas de ferro e samambaia.', img: 'assets/img/pm-rustico-verde.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-cantina-italiana', cat: 'kits', publico: ['feminino', 'masculino'], nome: 'Kit Cantina italiana', desc: 'Mesa de madeira com toalha xadrez, rosas vermelhas, lampiões, massas e plantas.', img: 'assets/img/pm-cantina-italiana.webp', tag: PEGUE, badge: 'Novidade' },

    { id: 'kit-luna', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit O Show da Luna', desc: 'Painel em arco lilás, totens da Luna, do Júpiter e do Cláudio, guarda-chuva, melancias e móveis coloridos.', img: 'assets/img/pm-luna.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'mini-table-jardim-encantado', cat: 'kits', publico: ['menina'], nome: 'Kit Jardim Encantado', desc: 'Painel de cerejeira com gaiolas e passarinhos, cilindros rosa e verde, cômoda provençal e borboletas.', img: 'assets/img/pm-jardim-encantado.webp', tag: PEGUE, badge: 'Novidade', preco: 399 },
    { id: 'kit-masha', cat: 'kits', publico: ['menina'], nome: 'Kit Masha e o Urso', desc: 'Painel da Masha com o Urso na floresta, cilindros de folhagem e tronco, totens e criado-mudo rosa.', img: 'assets/img/pm-masha.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-lol', cat: 'kits', publico: ['menina'], nome: 'Kit LOL Surprise', desc: 'Painel das bonecas LOL, cômoda provençal rosa, criado-mudo azul, bonecas e tapete rosa.', img: 'assets/img/pm-lol.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-moranguinho', cat: 'kits', publico: ['menina'], nome: 'Kit Moranguinho', desc: 'Painel rosa para o nome, totem da Moranguinho, móveis provençais rosa e vermelho e gramado.', img: 'assets/img/pm-moranguinho.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-piquenique-morango', cat: 'kits', publico: ['menina', 'feminino'], nome: 'Kit Piquenique morango', desc: 'Painéis xadrez vermelho e branco com laço, caixotes brancos, rosas vermelhas, morangos e margaridas.', img: 'assets/img/pm-piquenique-morango.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-abelhinha', cat: 'kits', publico: ['menina'], nome: 'Kit Abelhinha e margaridas', desc: 'Painel rosa com casinha, cilindros rosa e creme, colmeias, margaridas e borboletas amarelas.', img: 'assets/img/pm-abelhinha.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ursinhos-rose', cat: 'kits', publico: ['menina', 'cha'], nome: 'Kit Ursinhos rosé', desc: 'Mesa com ursinhos de pelúcia, vasos e suportes rosa, arranjo de rosas e pinhas.', img: 'assets/img/pm-ursinhos-rose.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-coelhinha-baloes', cat: 'kits', publico: ['menina', 'cha'], nome: 'Kit Coelhinha rosé com balões', desc: 'Painel em arco rosa, arco de balões rosa e verde, aparador canelado, coelhinha e vestidinho.', img: 'assets/img/pm-coelhinha-baloes.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-sonic', cat: 'kits', publico: ['menino'], nome: 'Kit Sonic', desc: 'Painel do Sonic, cilindros amarelo, vermelho e azul, totem e pelúcias do Sonic.', img: 'assets/img/pm-sonic.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-minecraft', cat: 'kits', publico: ['menino'], nome: 'Kit Minecraft', desc: 'Painel do Minecraft, totem do Steve, tonel TNT, bonecos, cômoda de madeira e gramado.', img: 'assets/img/pm-minecraft.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-roblox', cat: 'kits', publico: ['menino'], nome: 'Kit Roblox', desc: 'Painel do Roblox, cilindros temáticos, vasos amarelos com topiarias e tapete vermelho.', img: 'assets/img/pm-roblox.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-fortnite', cat: 'kits', publico: ['menino'], nome: 'Kit Fortnite', desc: 'Painel do Fortnite, mesas de madeira, caixote, sacos de areia, cilindro de folhagem e gramado.', img: 'assets/img/pm-fortnite.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-games', cat: 'kits', publico: ['menino', 'masculino'], nome: 'Kit Games neon', desc: 'Painel escuro com controle em neon, cilindros preto e azul e cubos com os símbolos do videogame.', img: 'assets/img/pm-games.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-hot-wheels', cat: 'kits', publico: ['menino'], nome: 'Kit Hot Wheels', desc: 'Painel do Hot Wheels, cilindros quadriculados e de fogo, semáforo, cone e bandeiras de chegada.', img: 'assets/img/pm-hot-wheels.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-carros', cat: 'kits', publico: ['menino'], nome: 'Kit Carros', desc: 'Painel do Relâmpago McQueen, totem do carro, tonel vermelho, cilindro amarelo, semáforo e pódio.', img: 'assets/img/pm-carros.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-jurassic', cat: 'kits', publico: ['menino'], nome: 'Kit Jurassic', desc: 'Painel de dinossauros com vulcão, tronco, caixote, placa de perigo, dinossauros e gramado.', img: 'assets/img/pm-jurassic.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-patrulha-canina-pm', cat: 'kits', publico: ['menino'], nome: 'Kit Patrulha Canina', desc: 'Painéis em arco com torre da Patrulha, casinha e osso para o nome, cilindros e totens do Chase, Marshall e Rubble.', img: 'assets/img/pm-patrulha-canina.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-super-homem', cat: 'kits', publico: ['menino'], nome: 'Kit Super-Homem baby', desc: 'Painel de cidade com balões de HQ, cilindros de prédios, totem e escudo do Super-Homem.', img: 'assets/img/pm-super-homem.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-luccas-neto', cat: 'kits', publico: ['menino'], nome: 'Kit Luccas Neto', desc: 'Painel do Luccas Neto, cilindros azul, vermelho e amarelo, bonecos e tapete vermelho.', img: 'assets/img/pm-luccas-neto.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-futebol-gool', cat: 'kits', publico: ['menino', 'masculino'], nome: 'Kit Futebol preto e branco', desc: 'Painel de bola gigante, cômoda preta, cilindro de jogadores, troféus, chuteira e letreiro GOOL.', img: 'assets/img/pm-futebol-gool.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-athletico', cat: 'kits', publico: ['menino', 'masculino'], nome: 'Kit Athletico Paranaense', desc: 'Painéis em arco vermelho e com o escudo do CAP, bola gigante, caixotes, troféus e mascote.', img: 'assets/img/pm-athletico.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-elefantinho', cat: 'kits', publico: ['menino', 'cha'], nome: 'Kit Elefantinho', desc: 'Painel do elefantinho nas nuvens com balões, mesas cinza e azul, cômoda de madeira e pelúcias.', img: 'assets/img/pm-elefantinho.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ovelhinha', cat: 'kits', publico: ['menino', 'cha', 'batizado'], nome: 'Kit Ovelhinha azul', desc: 'Painel azul com bandeirinhas, cilindro e cômoda branca, letreiro BOY, ovelhinhas e banquinho.', img: 'assets/img/pm-ovelhinha.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-pequeno-principe', cat: 'kits', publico: ['menino', 'batizado'], nome: 'Kit Pequeno Príncipe', desc: 'Painel do Pequeno Príncipe com a raposa e a frase do livro, cômoda vermelha, cilindro e bonecos.', img: 'assets/img/pm-pequeno-principe.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'mini-table-mundo-bita', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Mundo Bita', desc: 'Painel do Bita com arco-íris e balões, totens do Bita, cilindros de bolinhas e caixotes coloridos.', img: 'assets/img/pm-mundo-bita.webp', tag: PEGUE, badge: 'Novidade', preco: 320 },
    { id: 'kit-pooh', cat: 'kits', publico: ['menino', 'menina', 'cha'], nome: 'Kit Ursinho Pooh', desc: 'Painel do Pooh com o Tigrão, totem com pote de mel, placas de aventura, tronco e cilindro azul.', img: 'assets/img/pm-pooh.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-snoopy', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Snoopy', desc: 'Painel do Snoopy, casinha vermelha, cilindros amarelo e azul, pelúcias e piso quadriculado.', img: 'assets/img/pm-snoopy.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-scooby-doo', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Scooby-Doo', desc: 'Painel da Máquina de Mistério, cilindros temáticos, bonecos do Scooby, Salsicha, Fred e Velma.', img: 'assets/img/pm-scooby-doo.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-rei-leao', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit Rei Leão', desc: 'Painel do Rei Leão, cilindros de selva, cômoda, girafa, zebra, leão e macaco de pelúcia.', img: 'assets/img/pm-rei-leao.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-pj-masks', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit PJ Masks', desc: 'Painel dos PJ Masks, tonel vermelho, mesinhas de madeira, totem da Corujita e estrelas.', img: 'assets/img/pm-pj-masks.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-arca-de-noe', cat: 'kits', publico: ['menino', 'menina', 'batizado'], nome: 'Kit Arca de Noé', desc: 'Painel da arca com bichinhos e arco-íris, cilindros de aquarela, totem de macaquinho e ovelhinha.', img: 'assets/img/pm-arca-de-noe.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-ursinhos-realeza', cat: 'kits', publico: ['menino', 'menina', 'batizado', 'cha'], nome: 'Kit Ursinhos realeza', desc: 'Painel listrado com ursinho, ursos de príncipe e princesa no banco com coroa, cilindros e rosas brancas.', img: 'assets/img/pm-ursinhos-realeza.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-batizado', cat: 'kits', publico: ['batizado'], nome: 'Kit Santo Anjo (batizado e 1ª comunhão)', desc: 'Painel do anjinho em oração, cilindros branco e dourado com Santo Anjo do Senhor e arranjos brancos.', img: 'assets/img/pm-santo-anjo.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-cha-revelacao-boho', cat: 'kits', publico: ['cha'], nome: 'Kit Chá revelação boho', desc: 'Placa Girl or Boy, aparador canelado nude, balões terracota e rosé, flores secas e ursinho.', img: 'assets/img/pm-cha-revelacao-boho.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-momentos', cat: 'kits', publico: ['feminino', 'masculino'], nome: 'Kit Momentos', desc: 'Painel Momentos que ficam para sempre, mesas de madeira, arranjos brancos e lanternas, para casamentos e bodas.', img: 'assets/img/pm-momentos.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-nude-dourado', cat: 'kits', publico: ['feminino'], nome: 'Kit Nude e dourado', desc: 'Painel em arco nude, mesas brancas com base dourada, toalha de crochê e bandejas douradas.', img: 'assets/img/pm-nude-dourado.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-happy-birthday-caramelo', cat: 'kits', publico: ['feminino', 'masculino'], nome: 'Kit Happy Birthday caramelo', desc: 'Painel em arco caramelo com Happy Birthday dourado, mesas pretas e de ferro e arranjo de flores.', img: 'assets/img/pm-happy-birthday-caramelo.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'kit-boho-happy-birthday', cat: 'kits', publico: ['feminino'], nome: 'Kit Boho Happy Birthday', desc: 'Painel branco, treliça, mesa de madeira, balões terracota e rosé, flores secas e placa Happy Birthday.', img: 'assets/img/pm-boho-happy-birthday.webp', tag: PEGUE, badge: 'Novidade' },
    /* Kits pegue e monte · ainda sem foto */
    { id: 'mini-table-wandinha', cat: 'kits', publico: ['menina'], nome: 'Kit Wandinha', desc: 'Tema Wandinha em composição enxuta, pronta para retirar e montar.', art: 'minitable', tag: PEGUE, badge: 'Mais procurado', preco: 420 },
    { id: 'mini-table-circo-rosa', cat: 'kits', publico: ['menina'], nome: 'Kit Circo Rosa', desc: 'Tema circo em tons de rosa, numa mesa pequena e delicada.', art: 'minitable', tag: PEGUE, preco: 320 },
    { id: 'mini-table-ariel', cat: 'kits', publico: ['menina'], nome: 'Kit Ariel', desc: 'Tema Pequena Sereia em composição leve e enxuta.', art: 'minitable', tag: PEGUE, preco: 420 },
    { id: 'mini-table-barbie', cat: 'kits', publico: ['menina'], nome: 'Kit Barbie', desc: 'Tema Barbie numa mesa pequena e marcante.', art: 'minitable', tag: PEGUE, preco: 420 },
    { id: 'kit-oh-baby', cat: 'kits', publico: ['menina', 'cha'], nome: 'Kit Oh Baby', desc: 'Chá de bebê em rosé, verde e dourado, com flores e arco de balões.', art: 'minitable', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'kit-cha-fraldas-menina', cat: 'kits', publico: ['menina', 'cha'], nome: 'Kit chá de fraldas menina (mamãe coruja)', desc: 'Tema mamãe coruja para o chá de fraldas da menina.', art: 'minitable', tag: PEGUE },
    { id: 'kit-batman', cat: 'kits', publico: ['menino'], nome: 'Kit Batman', desc: 'Tonel, plantas e personagem para uma mesa marcante.', art: 'minitable', tag: PEGUE },
    { id: 'kit-praia', cat: 'kits', publico: ['menino'], nome: 'Kit Praia e surf', desc: 'Prancha, remo e boia para uma festa leve e solar.', art: 'minitable', tag: PEGUE },
    { id: 'kit-star-wars', cat: 'kits', publico: ['menino'], nome: 'Kit Star Wars', desc: 'Personagens e peças da galáxia para os pequenos fãs.', art: 'minitable', tag: PEGUE },
    { id: 'kit-cha-fraldas-menino', cat: 'kits', publico: ['menino', 'cha'], nome: 'Kit chá de fraldas menino (mamãe coruja)', desc: 'Tema mamãe coruja para o chá de fraldas do menino.', art: 'minitable', tag: PEGUE },
    { id: 'kit-galinha-pintadinha', cat: 'kits', publico: ['menino', 'menina'], nome: 'Kit provençal Galinha Pintadinha', desc: 'Kit provençal básico no tema Galinha Pintadinha.', art: 'minitable', tag: PEGUE },

    /* Suportes para doces · kits com foto (infantil e adulto) */
    { id: 'kit-patrulha-canina', cat: 'doces', publico: ['menino'], nome: 'Kit de suportes Patrulha Canina', desc: 'Marshall, Rubble e Chase com vasos vermelhos, topiarias, suportes e bandejas em vermelho, azul e amarelo.', img: 'assets/img/kit-patrulha-canina.webp', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-realeza-rosa', cat: 'doces', publico: ['menina'], nome: 'Kit de suportes Realeza rosa', desc: 'Suportes, bandejas, vasos e pratos de coração em rosa, com coroa para o bolo e cestas floridas.', img: 'assets/img/kit-realeza-rosa.webp', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-ursinhos-lilas', cat: 'doces', publico: ['menina'], nome: 'Kit de suportes Ursinhos lilás', desc: 'Ursinhos de vestido e de terno, boleiras rendadas, bandejas e cachepôs lilás com lavandas.', img: 'assets/img/kit-ursinhos-lilas.webp', pos: 'center 88%', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-dourado-rosas', cat: 'doces', publico: ['feminino'], nome: 'Kit de suportes Dourado com rosas', desc: 'Vasos dourados com arranjos de rosas, suportes, bandejas de folha e caixas geométricas de vidro.', img: 'assets/img/kit-dourado-rosas.webp', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-azul-amarelo', cat: 'doces', publico: ['masculino'], nome: 'Kit de suportes Azul marinho e amarelo', desc: 'Suportes e bandejas em azul marinho e amarelo, com vasos amarelos e topiarias.', img: 'assets/img/kit-azul-amarelo.webp', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-azul-marinho-dourado', cat: 'doces', publico: ['masculino'], nome: 'Kit de suportes Azul marinho e dourado', desc: 'Vasos, boleiras e pratos azul marinho com bandejas espelhadas, suportes dourados e porcelana azul e branca.', img: 'assets/img/kit-azul-marinho-dourado.webp', pos: 'center 80%', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-terracota-preto', cat: 'doces', publico: ['masculino'], nome: 'Kit de suportes Terracota e preto', desc: 'Vasos pretos com pinheiros, boleiras terracota e nude, vasos terracota com folhagens e bandeja.', img: 'assets/img/kit-terracota-preto.webp', pos: 'center 82%', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-cristal', cat: 'doces', publico: ['feminino', 'masculino'], nome: 'Kit de suportes Cristal', desc: 'Boleira, bandejas com e sem pé, taças, vasinhos e cúpulas em vidro lapidado, para mesas clássicas e elegantes.', img: 'assets/img/kit-cristal.webp', pos: 'center 85%', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-rustico-madeira', cat: 'doces', publico: ['masculino', 'feminino'], nome: 'Kit de suportes Rústico madeira', desc: 'Suportes de madeira e ferro, cesto de fibra, corações e tábua de madeira, com vasos de palhinha.', img: 'assets/img/kit-rustico-madeira.webp', tag: RETIRA, badge: 'Novidade' },
    { id: 'kit-madeira-ferro', cat: 'doces', publico: ['masculino', 'feminino'], nome: 'Kit de suportes Madeira e ferro', desc: 'Suportes de madeira e de ferro preto, cesto de fibra, corações e tábua de madeira sobre trilho de juta.', img: 'assets/img/kit-madeira-ferro.webp', tag: RETIRA, badge: 'Novidade' },
    /* Suportes para doces · peças avulsas */
    { id: 'suporte-colonial', cat: 'doces', nome: 'Suporte para doces pé colonial', desc: 'Branco e liso, em alturas variadas para compor a mesa.', art: 'stand', tag: RETIRA, badge: 'Mais procurado' },
    { id: 'kit-porcelana', cat: 'doces', nome: 'Kit suportes de porcelana', desc: 'Suportes de porcelana para doces, em alturas variadas.', art: 'trio', tag: RETIRA, preco: 90 },
    { id: 'trio-suportes', cat: 'doces', nome: 'Trio de suportes para doces', desc: 'Três alturas, ideal para mesas pequenas e composições enxutas.', art: 'trio', tag: RETIRA },
    { id: 'bandejas-espelhadas', cat: 'doces', nome: 'Bandejas espelhadas', desc: 'Reflexo delicado para doces finos e lembrancinhas.', art: 'tray', tag: RETIRA },
    { id: 'bolo-cenografico', cat: 'doces', nome: 'Bolo cenográfico', desc: 'Andares decorados para o centro da mesa e para as fotos.', art: 'cake', tag: RETIRA },
    { id: 'kit-ceramica', cat: 'doces', nome: 'Kit decorativo de cerâmica', desc: 'Peças de cerâmica para completar a mesa do bolo.', art: 'ceramic', tag: RETIRA },

    /* Painéis e mesas · composições com foto */
    { id: 'painel-off-white-rosas', cat: 'moveis', nome: 'Painel em arco off-white com mesa cone', desc: 'Painel em arco off-white, mesa cone branca, suporte dourado, vaso e cesto de rosas e tapete felpudo.', img: 'assets/img/pn-off-white-rosas.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'paineis-lilas-rosa', cat: 'moveis', nome: 'Painéis em arco lilás e rosa com mesas douradas', desc: 'Dois painéis em arco, mesas e banqueta douradas com tampo de madeira, rosas, lanternas e número iluminado.', img: 'assets/img/pn-lilas-rosa.webp', tag: PEGUE, badge: 'Novidade' },
    { id: 'paineis-cinza-rosa', cat: 'moveis', nome: 'Painéis em arco cinza e rosa com mesas douradas', desc: 'Dois painéis em arco, mesas e banqueta douradas com tampo de madeira, rosas, lanternas e número iluminado.', img: 'assets/img/pn-cinza-rosa.webp', tag: PEGUE, badge: 'Novidade' },
    /* Painéis e mesas · peças avulsas */
    { id: 'mesa-provencal', cat: 'moveis', nome: 'Mesa provençal', desc: 'Pés torneados e acabamento clássico, o centro da composição.', art: 'provencal', tag: PEGUE, badge: 'Mais procurado' },
    { id: 'mesa-espelhada', cat: 'moveis', nome: 'Mesa espelhada', desc: 'Linhas retas e brilho discreto para festas modernas.', art: 'mirror', tag: PEGUE },
    { id: 'aparador-azul', cat: 'moveis', nome: 'Aparador envelhecido azul', desc: 'Acabamento envelhecido com charme provençal.', art: 'sideboard', tag: PEGUE },
    { id: 'estante-lembrancinhas', cat: 'moveis', nome: 'Estante shabby chic para lembrancinhas', desc: 'Para expor as lembrancinhas com charme.', art: 'shelf', tag: PEGUE },
    { id: 'lounge-luis-xv', cat: 'moveis', nome: 'Lounge decorativo Luís XV', desc: 'Estofados clássicos para um canto de estar elegante.', art: 'sofa', tag: PEGUE },
    { id: 'trio-cilindros', cat: 'moveis', nome: 'Trio de cilindros', desc: 'Três alturas para apoiar o bolo, os doces e os personagens.', art: 'cylinders', tag: PEGUE },
    { id: 'painel-redondo', cat: 'moveis', nome: 'Painel redondo', desc: 'Fundo neutro que recebe balões, flores e o nome do homenageado.', art: 'round', tag: PEGUE },
    { id: 'painel-floresta', cat: 'moveis', nome: 'Painel sublimado 3D floresta', desc: 'Fundo de floresta para festas de safári, jardim e aventura.', art: 'forest', tag: PEGUE },
    { id: 'colunas-espelhadas', cat: 'moveis', nome: 'Par de colunas espelhadas com arranjo', desc: 'Colunas espelhadas com arranjo artificial para entradas e corredores.', art: 'mirrorColumns', tag: PEGUE },
    { id: 'cortinado', cat: 'moveis', nome: 'Cortinado com estrutura', desc: 'Tecido em várias cores, com a estrutura para sustentar.', art: 'curtain', tag: PEGUE },
    { id: 'muro-ingles', cat: 'moveis', nome: 'Muro inglês', desc: 'Parede verde para cenários de fotos e mini weddings.', art: 'hedge', tag: PEGUE },

    { id: 'arco-desconstruido', cat: 'baloes', nome: 'Arco de balões desconstruído', desc: 'Montado no local, nas cores da sua festa.', art: 'arch', tag: MONTAGEM, badge: 'Mais procurado' },
    { id: 'painel-com-baloes', cat: 'baloes', nome: 'Painel redondo com balões', desc: 'Painel com arranjo orgânico de balões, pronto para as fotos.', art: 'roundBalloons', tag: MONTAGEM },
    { id: 'coluna-baloes', cat: 'baloes', nome: 'Par de colunas de balões', desc: 'Para a entrada ou para emoldurar a mesa principal.', art: 'column', tag: MONTAGEM },
    { id: 'suporte-chao-baloes', cat: 'baloes', nome: 'Suporte de chão para balões', desc: 'Estrutura de metal para montar colunas e buquês de balões.', art: 'balloonStand', tag: PEGUE },

    { id: 'vasos-de-vidro', cat: 'detalhes', nome: 'Vasos de vidro', desc: 'Vaso liso, taça canelada e duas taças bico de jaca em vidro, para arranjos e centros de mesa.', img: 'assets/img/vasos-de-vidro.webp', pos: 'center 78%', tag: PEGUE, badge: 'Novidade' },
    { id: 'letras-mdf', cat: 'detalhes', nome: 'Letras em MDF', desc: 'Iniciais e palavras em MDF para noivados e aniversários.', art: 'letters', tag: PEGUE },
    { id: 'arranjo-orquideas', cat: 'detalhes', nome: 'Arranjo de orquídeas para mesa', desc: 'Arranjo para as mesas dos convidados.', art: 'orchid', tag: PEGUE },
    { id: 'suqueira', cat: 'detalhes', nome: 'Suqueira 5 litros', desc: 'Para sucos e drinks na mesa de bebidas.', art: 'jar', tag: PEGUE }
  ];
  /* Vitrine: cada aba mostra primeiro as peças mais bonitas (até LIMITE) e o restante
     aparece no botão "Conferir todos os modelos". DESTAQUES vale para "Todos";
     VITRINE define a ordem dentro de cada categoria (o que não está listado vem depois). */
  var LIMITE = 12;
  var VITRINE = {
    kits: ['kit-gabby', 'kit-sonic', 'kit-safari-baby', 'kit-abelhinha', 'kit-ursinho-baloes', 'kit-patrulha-canina-pm', 'kit-coelhinha-baloes', 'kit-minecraft', 'kit-chuva-de-amor', 'kit-boho-dourado', 'kit-dragon-ball', 'mini-table-mundo-bita'],
    moveis: ['paineis-lilas-rosa', 'painel-off-white-rosas', 'paineis-cinza-rosa']
  };
  var DESTAQUES = ['kit-gabby', 'kit-patrulha-canina', 'kit-sonic', 'paineis-lilas-rosa', 'kit-safari-baby', 'kit-dourado-rosas', 'kit-abelhinha', 'kit-realeza-rosa', 'kit-ursinho-baloes', 'painel-off-white-rosas', 'kit-minecraft', 'kit-cristal'];

  /* ---------- Ilustrações em linha (peças ainda sem foto) ---------- */
  var circles = function (pts, cls) {
    return pts.map(function (p) { return '<circle class="' + (cls || 'b') + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + p[2] + '"/>'; }).join('');
  };
  var ART = {
    stand: '<ellipse class="f" cx="60" cy="52" rx="34" ry="6"/>' + circles([[46, 44, 5], [58, 42, 5.5], [71, 44, 5]], 'g') + '<path d="M56 58q-2 12 1 22M64 58q2 12-1 22"/><path class="f" d="M44 91q16-12 32 0z"/>',
    trio: [[30, 62], [60, 44], [90, 70]].map(function (s) {
      var x = s[0], y = s[1];
      return '<ellipse class="f" cx="' + x + '" cy="' + y + '" rx="15" ry="3.5"/>' + circles([[x - 6, y - 4, 3], [x + 1, y - 5, 3.2], [x + 7, y - 4, 3]], 'g') + '<path d="M' + (x - 2) + ' ' + (y + 3) + 'V91M' + (x + 2) + ' ' + (y + 3) + 'V91"/><path class="f" d="M' + (x - 9) + ' 94q9-7 18 0z"/>';
    }).join(''),
    tray: '<ellipse class="f" cx="60" cy="68" rx="42" ry="13"/><ellipse cx="60" cy="67" rx="33" ry="8.5"/><path class="soft" d="M36 72l10-9M46 74l10-10M74 73l8-7"/>' + circles([[44, 62, 4], [54, 60, 4.5], [65, 60, 4.5], [75, 62, 4]], 'g'),
    cake: '<path d="M24 94h72"/><rect class="f" x="34" y="70" width="52" height="24" rx="3"/><rect class="f" x="42" y="50" width="36" height="20" rx="3"/><rect class="f" x="50" y="34" width="20" height="16" rx="3"/><path class="soft" d="M34 76q6.5 5 13 0t13 0 13 0 13 0M42 55q6 4 12 0t12 0 12 0"/>' + circles([[60, 29, 4]], 'g'),
    provencal: '<rect class="f" x="18" y="44" width="84" height="8" rx="2"/><path class="f" d="M24 52h72q-6 12-36 12T24 52z"/><path d="M30 60c-5 12 4 20-2 34M90 60c5 12-4 20 2 34"/>' + circles([[60, 38, 5]], 'g'),
    mirror: '<rect class="f" x="24" y="40" width="72" height="52" rx="2"/><path d="M24 50h72"/><path class="soft" d="M36 86l14-30M48 86l14-30M70 86l10-22"/>',
    cylinders: [[34, 56], [60, 38], [86, 66]].map(function (c) {
      var x = c[0], y = c[1];
      return '<path class="f" d="M' + (x - 12) + ' ' + y + 'V94a12 3.5 0 0 0 24 0V' + y + '"/><ellipse class="f" cx="' + x + '" cy="' + y + '" rx="12" ry="3.5"/>';
    }).join(''),
    round: '<circle class="f" cx="60" cy="54" r="34"/><circle class="soft" cx="60" cy="54" r="27"/><path d="M46 85l-5 12M74 85l5 12M52 97h16"/>',
    hedge: '<rect class="f" x="26" y="24" width="68" height="70" rx="3"/>' + (function () {
      var p = [];
      for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) p.push([32 + c * 9.3 + (r % 2 ? 4 : 0), 30 + r * 9.6, 2.2]);
      return circles(p.filter(function (q) { return q[0] < 90; }), 'leaf');
    })(),
    arch: (function () {
      var p = [], n = 12;
      for (var i = 0; i < n; i++) {
        var a = Math.PI - (Math.PI * i) / (n - 1), rr = [8, 6, 9, 6.5][i % 4];
        p.push([60 + Math.cos(a) * 36, 92 - Math.sin(a) * 52, rr]);
      }
      return circles(p) + circles([[33, 52, 3], [84, 46, 3.4], [70, 34, 2.6]], 'g');
    })(),
    roundBalloons: '<circle class="f" cx="62" cy="50" r="32"/><path d="M50 80l-4 16M74 80l4 16"/>' + circles([[34, 78, 8.5], [26, 66, 6], [44, 88, 6.5], [30, 90, 5], [22, 80, 4.5], [88, 26, 6], [96, 36, 4.5]]) + circles([[40, 70, 3]], 'g'),
    minitable: '<circle class="f" cx="64" cy="48" r="28"/>' + circles([[38, 32, 7.5], [30, 44, 5.5], [46, 24, 5], [90, 60, 5]]) + circles([[40, 40, 2.4], [86, 34, 2.6]], 'g') + '<rect class="f" x="54" y="62" width="16" height="12" rx="2"/><path class="f" d="M34 74h56v4H34z"/><path d="M40 78v16M84 78v16"/><path class="f" d="M20 82v12a7 2 0 0 0 14 0V82"/><ellipse class="f" cx="27" cy="82" rx="7" ry="2"/>',
    sofa: '<path class="f" d="M28 62q0-14 14-14h36q14 0 14 14v8H28z"/><path class="f" d="M18 72q0-7 7-7t7 7v10h56V72q0-7 7-7t7 7v16H18z"/><path d="M24 88l-2 7M96 88l2 7"/>' + circles([[60, 56, 2]], 'g'),
    sideboard: '<path class="f" d="M46 50q-5-10 2-18h8q7 8 2 18z"/><rect class="f" x="22" y="50" width="76" height="34" rx="3"/><path d="M60 50v34M26 84l-2 10M94 84l2 10"/>' + circles([[55, 67, 1.8], [65, 67, 1.8]], 'g'),
    shelf: '<rect class="f" x="34" y="20" width="52" height="74" rx="3"/><path d="M34 44h52M34 68h52M40 94v4M80 94v4"/><rect class="f" x="41" y="33" width="10" height="11"/><rect class="f" x="55" y="35" width="9" height="9"/><rect class="f" x="68" y="32" width="11" height="12"/><rect class="f" x="44" y="57" width="12" height="11"/><rect class="f" x="62" y="58" width="10" height="10"/>',
    forest: '<rect class="f" x="24" y="20" width="72" height="68" rx="3"/><path class="tree" d="M34 80l11-30 11 30zM52 80l13-40 13 40zM72 80l8-22 8 22z"/><path d="M34 88l-4 8M86 88l4 8"/>',
    mirrorColumns: [38, 82].map(function (x) {
      return '<rect class="f" x="' + (x - 9) + '" y="52" width="18" height="42" rx="1"/><path class="soft" d="M' + (x - 5) + ' 90l8-34"/>' + circles([[x - 6, 46, 4.5], [x + 5, 45, 5], [x, 40, 4.5]]) + circles([[x, 46, 1.8]], 'g');
    }).join(''),
    curtain: '<path d="M18 22h84M20 22v76M100 22v76"/><path class="f" d="M24 22q5 40-2 74h20q-10-34 2-74zM96 22q-5 40 2 74H78q10-34-2-74z"/>',
    balloonStand: '<path d="M60 46v46"/><path class="f" d="M46 96q14-8 28 0z"/>' + circles([[60, 34, 10], [47, 42, 7], [73, 42, 7], [53, 22, 6.5], [68, 22, 6.5]]),
    jar: '<path class="f" d="M42 30h36v6q10 10 10 26v26a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V62q0-16 10-26z"/><path class="soft" d="M34 58h52"/><path d="M60 86v6h6"/>' + circles([[48, 72, 3.5], [62, 76, 3], [72, 68, 3.5]], 'g'),
    orchid: '<path class="f" d="M50 76h20l-3 20H53z"/><path d="M60 76q-2-22 8-40M60 76q-8-14-20-18"/>' + circles([[68, 34, 5.5], [76, 44, 5], [60, 42, 4.5], [40, 56, 5]]) + circles([[68, 34, 1.8], [76, 44, 1.6], [40, 56, 1.8]], 'g'),
    letters: '<path class="thick" d="M20 40v40h14"/><ellipse class="thick" cx="50" cy="60" rx="10" ry="20"/><path class="thick" d="M66 40l8 40 8-40M92 40h14M92 40v40h14M92 60h10"/>',
    ceramic: '<path class="f" d="M28 94q-8-16 2-30h12q10 14 2 30z"/><path class="f" d="M52 94q-6-26 4-44h8q10 18 4 44z"/><path class="f" d="M80 94q-6-12 2-22h10q8 10 2 22z"/><path d="M26 94h72"/>',
    column: [38, 82].map(function (x) {
      var p = [];
      for (var k = 0; k < 6; k++) p.push([x + (k % 2 ? 3 : -3), 92 - k * 10, 6.5]);
      p.push([x, 26, 9]);
      return circles(p) + '<path d="M' + (x - 9) + ' 98h18"/>';
    }).join('')
  };
  var artSvg = function (key) { return '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + (ART[key] || '') + '</svg>'; };
  /* Cada foto existe em 600px, 1200px e na versão máxima (sem sufixo) */
  var size = function (src, w) { return src.replace(/\.webp$/, '-' + w + '.webp'); };
  var mediaHtml = function (p, small) {
    /* pos: enquadramento da foto no card quadrado (ex.: fotos em pé com a placa no alto) */
    if (p.img) {
      var set = small ? '' : ' srcset="' + size(p.img, 600) + ' 600w, ' + size(p.img, 1200) + ' 1200w" sizes="(max-width: 600px) 46vw, (max-width: 1100px) 30vw, 300px"';
      return '<img src="' + size(p.img, 600) + '"' + set + ' alt="' + (small ? '' : p.nome) + '"' + (small ? '' : ' data-full="' + p.img + '"') + ' loading="lazy" decoding="async"' + (p.pos ? ' style="object-position:' + p.pos + '"' : '') + '>';
    }
    return '<div class="product-art" data-cat="' + p.cat + '">' + artSvg(p.art) + '</div>';
  };
  var byId = {};
  CATALOG.forEach(function (p) { byId[p.id] = p; });
  var catLabel = function (id) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label; return ''; };
  /* "Infantil · Menino e menina", "Adulto · Feminino"... */
  var pubLabel = function (p) {
    if (!p.publico) return '';
    var grupos = {};
    PUBLICOS.forEach(function (u) {
      if (p.publico.indexOf(u.id) < 0) return;
      (grupos[u.grupo] = grupos[u.grupo] || []).push(u.label);
    });
    return Object.keys(grupos).map(function (g) {
      return g + ' · ' + grupos[g].map(function (l, i) { return i ? l.toLowerCase() : l; }).join(' e ');
    }).join(' / ');
  };
  var fullCat = function (p) { var u = pubLabel(p); return catLabel(p.cat) + (u ? ' (' + u + ')' : ''); };
  /* Busca sem acento e sem maiúsculas: "pequeno principe" acha "Pequeno Príncipe" */
  var norm = function (t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

  /* ---------- Lista (persistida só neste navegador) ---------- */
  var list = {};
  try { list = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { list = {}; }
  Object.keys(list).forEach(function (id) { if (!byId[id] || !(list[id] > 0)) delete list[id]; });
  var save = function () { try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) { /* sem armazenamento: a lista vale só nesta visita */ } };
  var count = function () { return Object.keys(list).reduce(function (n, id) { return n + list[id]; }, 0); };
  var inList = function () { return CATALOG.filter(function (p) { return list[p.id]; }); };
  var lines = function () { return inList().map(function (p) { return list[p.id] + 'x ' + p.nome; }); };

  /* ---------- Mensagens para o WhatsApp: levam todos os dados da peça ---------- */
  var ref = function (p) { return p.id.toUpperCase(); };
  var absUrl = function (path) {
    if (!/^https?:$/.test(location.protocol)) return '';
    try { return new URL(path, location.href).href; } catch (e) { return ''; }
  };
  var photo = function (p) { return p.img ? absUrl(size(p.img, 1200)) : ''; };
  /* Uma linha por peça, usada na lista e no formulário (main.js) */
  var detailLines = function () {
    return inList().map(function (p) {
      var l = list[p.id] + 'x ' + p.nome + ' · ' + fullCat(p) + ' · ' + p.tag + ' · Ref. ' + ref(p);
      return photo(p) ? l + '\n   Foto: ' + photo(p) : l;
    });
  };
  var waUrl = function (lines) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')); };

  var live = document.createElement('div');
  live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  /* ---------- Cards ---------- */
  var grid = $('[data-products]'), chipsEl = $('[data-chips]'), countEl = $('[data-catalog-count]');
  if (!grid) return;
  var waIcon = '<svg class="i-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.5L3.5 21l1.6-4.4A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.2c.3 2.5 2.2 4.5 4.8 5l1-1 1.7.8c-.3 1-1.2 1.6-2.3 1.5-3.4-.4-6.1-3.1-6.5-6.5-.1-1.1.5-2 1.5-2.3l.8 1.7z"/></svg>';
  /* Pedido direto de uma peça: abre o WhatsApp já com o nome dela */
  var waLink = function (p) {
    var link = photo(p) || absUrl('#catalogo');
    var msg = ['Olá, Mariluz! Tudo bem? Vi a decoração *' + p.nome + '* no site e quero fazer o pedido de locação para a minha festa.'];
    if (link) msg.push(link);
    msg.push('',
      '*Produto:* ' + p.nome,
      '*Categoria:* ' + fullCat(p),
      '*Descrição:* ' + p.desc,
      '*Modalidade:* ' + p.tag,
      '*Quantidade:* 1',
      '*Ref.:* ' + ref(p));
    if (MOSTRAR_PRECOS && p.preco) msg.push('*Valor de referência:* ' + brl(p.preco));
    msg.push('', '*Data da festa:* a definir',
      'Pode me confirmar valores e disponibilidade? Obrigada!');
    return waUrl(msg);
  };
  var brl = function (v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }); };
  var zoomIcon = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4M11 8.5v5M8.5 11h5"/></svg>';
  var plus = '<svg class="i-plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><svg class="i-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  /* Vitrine: destaques primeiro, depois o restante na ordem do catálogo */
  var ordered = DESTAQUES.map(function (id) { return byId[id]; }).filter(Boolean);
  CATALOG.forEach(function (p) { if (ordered.indexOf(p) < 0) ordered.push(p); });
  ordered.forEach(function (p) {
    var li = document.createElement('li');
    li.className = 'product'; li.dataset.cat = p.cat; li.dataset.id = p.id;
    li.dataset.search = norm(p.nome + ' ' + p.desc + ' ' + fullCat(p));
    if (p.publico) li.dataset.publico = p.publico.join(' ');
    li.innerHTML =
      '<article>' +
        (p.img
          ? '<div class="product-media is-zoom" data-zoom role="button" tabindex="0" aria-label="Ampliar foto: ' + esc(p.nome) + '" data-title="' + esc(p.nome) + '" data-cat="' + esc(fullCat(p)) + '">' + mediaHtml(p) + '<span class="product-zoom" aria-hidden="true">' + zoomIcon + '</span>'
          : '<div class="product-media">' + mediaHtml(p)) + (p.badge ? '<span class="product-badge">' + esc(p.badge) + '</span>' : '') + '</div>' +
        '<div class="product-body">' +
          '<span class="product-cat">' + esc(p.publico ? (p.cat === 'kits' ? '' : catLabel(p.cat) + ' · ') + pubLabel(p) : catLabel(p.cat)) + '</span>' +
          '<h3>' + esc(p.nome) + '</h3>' +
          '<span class="product-ref">Ref. ' + esc(ref(p)) + '</span>' +
          (MOSTRAR_PRECOS && p.preco ? '<span class="product-price">a partir de <b>' + brl(p.preco) + '</b></span>' : '') +
          '<p>' + esc(p.desc) + '</p>' +
          '<span class="product-tag">' + esc(p.tag) + '</span>' +
          '<div class="product-foot">' +
            '<a class="btn btn-dark btn-sm product-wa" href="' + waLink(p) + '" target="_blank" rel="noopener">' + waIcon + '<span class="long">Pedir no WhatsApp</span><span class="short">Pedir</span><span class="sr-only"> ' + esc(p.nome) + '</span></a>' +
            '<button type="button" class="product-add" aria-pressed="false" data-add="' + p.id + '" aria-label="Adicionar ' + esc(p.nome) + ' à lista" title="Adicionar à lista">' + plus + '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    grid.appendChild(li);
  });
  var cards = $$('.product', grid);

  /* Filtros */
  var active = 'all';
  var chipDefs = [{ id: 'all', label: 'Todos' }].concat(CATEGORIES);
  chipDefs.forEach(function (c) {
    var n = c.id === 'all' ? CATALOG.length : CATALOG.filter(function (p) { return p.cat === c.id; }).length;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.filter = c.id;
    b.setAttribute('aria-pressed', c.id === active);
    b.innerHTML = esc(c.label) + '<small>' + n + '</small>';
    chipsEl.appendChild(b);
  });
  var chips = $$('.chip', chipsEl);

  /* Subfiltro por público: Infantil (menino, menina) e Adulto (masculino, feminino),
     nas categorias que têm peças com "publico" (kits pegue e monte e suportes para doces) */
  var COM_PUBLICO = ['kits', 'doces'];
  var publico = 'all';
  var subEl = document.createElement('div');
  subEl.className = 'subchips'; subEl.hidden = true;
  subEl.setAttribute('role', 'group'); subEl.setAttribute('aria-label', 'Filtrar por público');
  var subHtml = '<button type="button" class="subchip" data-publico="all" aria-pressed="true">Todos</button>';
  var grupoAtual = '';
  PUBLICOS.forEach(function (u) {
    if (u.grupo !== grupoAtual) {
      if (grupoAtual) subHtml += '</div>';
      grupoAtual = u.grupo;
      subHtml += '<div class="subchips-group"><span>' + esc(u.grupo) + '</span>';
    }
    subHtml += '<button type="button" class="subchip" data-publico="' + u.id + '" aria-pressed="false">' + esc(u.label) + '<small></small></button>';
  });
  subEl.innerHTML = subHtml + '</div>';
  chipsEl.parentNode.insertBefore(subEl, chipsEl.nextSibling);
  var subchips = $$('.subchip', subEl);
  /* Contagem de cada público dentro da categoria ativa */
  var countPublico = function () {
    subchips.forEach(function (c) {
      if (c.dataset.publico === 'all') return;
      var n = CATALOG.filter(function (p) { return p.cat === active && p.publico && p.publico.indexOf(c.dataset.publico) > -1; }).length;
      $('small', c).textContent = n;
      c.hidden = !n; /* ex.: "Bebê" só aparece onde há kits de batizado ou chá */
    });
    $$('.subchips-group', subEl).forEach(function (g) {
      g.hidden = !$$('.subchip', g).some(function (c) { return !c.hidden; });
    });
  };
  var setPublico = function (id) {
    publico = id;
    subchips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.publico === id); });
  };
  subchips.forEach(function (c) {
    c.addEventListener('click', function () {
      if (c.dataset.publico === publico) return;
      setPublico(c.dataset.publico);
      expanded = false;
      apply('all');
    });
  });

  var setCount = function (n) { countEl.textContent = n + (n === 1 ? ' peça' : ' peças'); };
  var expanded = false;
  var more = document.createElement('div');
  more.className = 'catalog-more';
  more.innerHTML = '<button type="button" class="btn btn-dark" data-magnetic><span></span> <small></small></button>';
  grid.parentNode.insertBefore(more, grid.nextSibling);
  var moreLabel = $('span', more), moreCount = $('small', more);

  /* Ordem dos cards na aba ativa: os escolhidos da vitrine primeiro, depois o catálogo */
  var arrange = function () {
    var first = active === 'all' ? DESTAQUES : (VITRINE[active] || []).concat(DESTAQUES);
    var rank = function (c) { var i = first.indexOf(c.dataset.id); return i < 0 ? first.length + CATALOG.indexOf(byId[c.dataset.id]) : i; };
    cards.slice().sort(function (a, b) { return rank(a) - rank(b); }).forEach(function (c) { grid.appendChild(c); });
    cards = $$('.product', grid);
  };

  var revealIn = function (els, stagger) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    if (!hasGsap || reduced || !els.length) return;
    gsap.fromTo(els, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: stagger, ease: 'expo.out', clearProps: 'transform' });
  };
  /* Busca por tema: procura no catálogo inteiro e mostra todos os resultados */
  var query = '';
  var searchEl = $('[data-catalog-search]');
  var noneEl = document.createElement('div');
  noneEl.className = 'catalog-empty'; noneEl.hidden = true;
  noneEl.innerHTML = '<p>Esse tema ainda não está no site, mas o nosso acervo é bem maior do que cabe aqui.</p><a class="btn btn-dark btn-sm" target="_blank" rel="noopener">Perguntar no WhatsApp</a>';
  grid.parentNode.insertBefore(noneEl, more);
  var apply = function (animate) {
    var shown = [], fresh = [], total = 0;
    var words = query ? query.split(/\s+/) : [];
    cards.forEach(function (c) {
      var on = active === 'all' || c.dataset.cat === active;
      if (on && COM_PUBLICO.indexOf(active) > -1 && publico !== 'all') on = (' ' + (c.dataset.publico || '') + ' ').indexOf(' ' + publico + ' ') > -1;
      if (on && words.length) on = words.every(function (w) { return c.dataset.search.indexOf(w) > -1; });
      if (on) total++;
      if (on && !expanded && !words.length) on = total <= LIMITE;
      if (on && c.hidden) fresh.push(c);
      c.hidden = !on;
      if (on) shown.push(c);
    });
    var limited = shown.length < total;
    if (limited) countEl.textContent = shown.length + ' de ' + total + ' peças';
    else setCount(shown.length);
    more.hidden = !limited;
    noneEl.hidden = total > 0;
    if (!total) $('a', noneEl).href = waUrl(['Olá, Mariluz! Tudo bem? Procurei no site e não achei o tema *' + searchEl.value.trim() + '*. Vocês têm decoração nesse tema?']);
    moreLabel.textContent = active === 'all' ? 'Ver todas as peças' : 'Conferir todos os modelos';
    moreCount.textContent = total;
    subEl.hidden = COM_PUBLICO.indexOf(active) < 0;
    if (!subEl.hidden) countPublico();
    if (animate) revealIn(animate === 'fresh' ? fresh : shown, .045);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  var filter = function (id, pub) {
    pub = pub || 'all';
    if (id === active && pub === publico) return;
    active = id;
    expanded = false;
    if (query) { query = ''; searchEl.value = ''; }
    arrange();
    setPublico(pub);
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.filter === id); });
    apply('all');
  };
  chips.forEach(function (c) { c.addEventListener('click', function () { filter(c.dataset.filter); }); });
  $('button', more).addEventListener('click', function () {
    expanded = true;
    var first = cards.filter(function (c) { return c.hidden; })[0];
    apply('fresh');
    if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
  });
  /* Atalhos de outras seções (ex.: portfólio "Ver suportes para doces"; data-catalog-publico opcional) */
  $$('[data-catalog-filter]').forEach(function (a) {
    a.addEventListener('click', function () { filter(a.dataset.catalogFilter, a.dataset.catalogPublico); });
  });
  var searchTimer = 0;
  searchEl.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      var q = norm(searchEl.value.trim());
      if (q === query) return;
      if (q && (active !== 'all' || publico !== 'all')) {
        active = 'all'; setPublico('all'); chipsEl.scrollLeft = 0;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.filter === 'all'); });
        arrange();
      }
      query = q;
      apply('all');
    }, 180);
  });
  apply(false);

  /* Entrada dos cards ao rolar */
  if (hasGsap && !reduced && 'IntersectionObserver' in window) {
    grid.classList.add('is-animated');
    var queue = [], flush = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (!e.target.classList.contains('is-in')) queue.push(e.target);
      });
      if (queue.length && !flush) flush = requestAnimationFrame(function () { revealIn(queue, .08); queue = []; flush = 0; });
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- Lista: botão flutuante, painel e formulário ---------- */
  var bag = $('.bag'), bagCount = $('[data-bag-count]');
  var drawer = $('#drawer'), itemsEl = $('[data-drawer-items]'), emptyEl = $('[data-drawer-empty]');
  var sendBtn = $('[data-bag-send]'), formBtn = $('[data-bag-form]');
  var formList = $('[data-form-list]'), formItems = $('[data-form-list-items]');
  var opener = null;

  var render = function () {
    var n = count();
    bagCount.textContent = n;
    bag.classList.toggle('is-on', n > 0);
    bag.setAttribute('aria-label', 'Minha lista de locação, ' + n + (n === 1 ? ' item' : ' itens'));

    $$('[data-add]', grid).forEach(function (b) {
      var on = !!list[b.dataset.add];
      b.setAttribute('aria-pressed', on);
      var nome = byId[b.dataset.add].nome;
      b.setAttribute('aria-label', on ? nome + ' está na lista. Remover da lista' : 'Adicionar ' + nome + ' à lista');
      b.title = on ? 'Na lista (clique para remover)' : 'Adicionar à lista';
    });

    itemsEl.innerHTML = '';
    CATALOG.forEach(function (p) {
      if (!list[p.id]) return;
      var li = document.createElement('li');
      li.className = 'drawer-item';
      li.innerHTML =
        '<div class="drawer-thumb">' + mediaHtml(p, true) + '</div>' +
        '<div><b>' + esc(p.nome) + '</b><span>' + esc(catLabel(p.cat)) + '</span><button type="button" class="drawer-remove" data-remove="' + p.id + '">Remover<span class="sr-only"> ' + esc(p.nome) + '</span></button></div>' +
        '<div class="stepper"><button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Diminuir quantidade de ' + esc(p.nome) + '">−</button><output aria-live="polite">' + list[p.id] + '</output><button type="button" data-step="1" data-id="' + p.id + '" aria-label="Aumentar quantidade de ' + esc(p.nome) + '">+</button></div>';
      itemsEl.appendChild(li);
    });
    itemsEl.hidden = n === 0;
    emptyEl.hidden = n > 0;
    sendBtn.disabled = n === 0;
    formBtn.classList.toggle('is-disabled', n === 0);

    formList.hidden = n === 0;
    formItems.innerHTML = lines().map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
  };

  var bump = function () {
    bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump');
  };
  var toggleItem = function (id) {
    var p = byId[id];
    if (list[id]) { delete list[id]; live.textContent = p.nome + ' removido da lista.'; }
    else { list[id] = 1; live.textContent = p.nome + ' adicionado à lista.'; bump(); }
    save(); render();
  };
  var step = function (id, d) {
    var q = (list[id] || 0) + d;
    if (q <= 0) delete list[id]; else list[id] = Math.min(q, 30);
    save(); render();
  };

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) toggleItem(b.dataset.add);
  });
  itemsEl.addEventListener('click', function (e) {
    var s = e.target.closest('[data-step]'), r = e.target.closest('[data-remove]');
    if (s) {
      var id = s.dataset.id, d = +s.dataset.step;
      step(id, d);
      var again = $('[data-step="' + d + '"][data-id="' + id + '"]', itemsEl);
      (again || $('[data-bag-close]', drawer.lastElementChild)).focus();
    }
    if (r) {
      delete list[r.dataset.remove]; save(); render();
      var next = $('[data-remove]', itemsEl);
      (next || $('.drawer-panel [data-bag-close]')).focus();
    }
  });

  /* Painel */
  var lenis = function () { return window.__lenis || null; };
  var focusables = function () { return $$('button:not([disabled]), a[href]', drawer.lastElementChild).filter(function (el) { return el.offsetParent !== null; }); };
  var openDrawer = function (from) {
    opener = from || document.activeElement;
    render();
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    root.classList.add('drawer-open'); bag.setAttribute('aria-expanded', 'true');
    if (lenis()) lenis().stop();
    setTimeout(function () { $('.drawer-panel [data-bag-close]').focus(); }, 60);
  };
  var closeDrawer = function (restore) {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    root.classList.remove('drawer-open'); bag.setAttribute('aria-expanded', 'false');
    if (lenis()) lenis().start();
    if (restore !== false && opener && opener.focus) opener.focus({ preventScroll: true });
  };
  $$('[data-bag-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
  $$('[data-bag-close]').forEach(function (b) { b.addEventListener('click', function () { closeDrawer(); }); });
  formBtn.addEventListener('click', function (e) {
    if (!count()) { e.preventDefault(); return; }
    closeDrawer(false); /* libera a rolagem antes do scroll para o formulário (main.js) */
  });
  document.addEventListener('keydown', function (e) {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); }
    if (e.key === 'Tab') {
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  sendBtn.addEventListener('click', function () {
    if (!count()) return;
    var msg = ['Olá, Mariluz! Tudo bem? Montei minha lista no site e quero fazer este pedido de locação para a minha festa:', ''].concat(detailLines().map(function (l) { return '• ' + l; }), ['', '*Total de peças:* ' + count(), '*Data da festa:* a definir', 'Pode me confirmar valores e disponibilidade? Obrigada!']);
    window.open(waUrl(msg), '_blank', 'noopener');
  });

  window.MariluzLista = { lines: detailLines, open: openDrawer };
  render();
})();
