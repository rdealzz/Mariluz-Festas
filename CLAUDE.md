# Mariluz Festas · regras do catálogo

## Kit de suportes para doces × Kit pegue e monte (não confundir)

- **Kit de suportes para doces** (`cat: 'doces'`): boleiras, suportes, bandejas, vasos e pratos
  que compõem a mesa do bolo e dos doces. Mesmo quando a foto tem um bichinho, personagem ou tema
  de menino/menina (ex.: Patrulha Canina, Realeza rosa, Ursinhos lilás), **continua sendo kit de
  suporte para doces**, não kit pegue e monte.
- **Kit pegue e monte** (`cat: 'kits'`): kit temático de **decoração** completa (painel, personagens,
  cilindros, balões etc.) que a cliente retira e monta.
- "Pegue e monte" também é a **forma de retirada** (`tag: PEGUE`) das demais peças; isso não define
  a categoria. Nos suportes para doces a etiqueta é **"Retire na loja"** (`tag: RETIRA`): a Mariluz
  não quer "Pegue e monte" aparecendo em nenhum card de suporte para doces.

## Fotos atuais

- `assets/img/kit-*.webp` (Patrulha Canina, Realeza rosa, Ursinhos lilás, Dourado com rosas, Azul
  marinho e amarelo, Azul marinho e dourado, Terracota e preto, Cristal, Rústico madeira, Madeira e
  ferro, e a leva de 05/10 por cor: Candy color, Branco e rose gold, Vermelho, Verde oliva, Rosé nude,
  Branco, Amarelo, Terracota canelado, Laranja, Verde menta, Verde musgo e Azul marinho torneados) são
  **kits de suportes para doces** (`cat: 'doces'`).
- `assets/img/pm-*.webp` são **kits pegue e monte** (`cat: 'kits'`), enviados pela Mariluz em 05/10/2026
  em duas levas (Gabby, Sonic, Minecraft, Safári baby, Patrulha Canina, Mundo Bita, Pooh, Santo Anjo,
  Chá revelação, Boho dourado, Momentos, Wandinha, Super-heróis, Coritiba, Corrida, Baleia rosa, e os
  adultos de 05/10 à tarde: Rústico fazenda, Rústico vintage, Muro inglês industrial, Marsala e dourado,
  Happy Birthday rosé, Love verde-água, Preto e branco, Arcos nude e dourado, Arcos terra e areia etc.). Fotos repetidas na mesma leva entram uma vez só.
- `assets/img/pn-*.webp` são composições de **Painéis e mesas** (`cat: 'moveis'`): só as 3 que a
  Mariluz indicou (arco off-white com mesa cone, arcos lilás e rosa, arcos cinza e rosa).
- **Só entram no catálogo peças com foto.** Os cards com ilustração em branco foram tirados a pedido
  (07/10/2026); abas sem nenhuma peça (ex.: Balões) somem sozinhas até chegarem fotos. A aba Detalhes foi
  tirada e os vasos de vidro passaram para Suportes para doces.
- `assets/img/pel-*.webp` são **Pelúcias** (`cat: 'pelucias'`, `tag: RETIRA`), enviadas em 07/10/2026. O subfiltro
  separa as **especiais Silvia Polito** (`pel-sp-*`, `publico: ['silvia-polito']`, cartazes com fundo decorado,
  selo "Silvia Polito") das **demais pelúcias** de personagens e bichinhos (fundo branco, `publico: ['personagens']`).
  Algumas pelúcias ficam também nos destaques da aba "Todos".
- Cada foto existe em 600px, 1200px e na versão máxima (Full HD, 1920px no lado maior), em `.webp`.
- Algumas fotos chegam com a estrelinha ✦ de editor de imagem no canto inferior direito: apague antes de
  publicar (cobrir só a marca com o fundo vizinho, sem cortar a foto).

Subfiltro `publico` dos kits: Infantil (`menino`, `menina`), Adulto (`masculino`, `feminino`) e Bebê
(`batizado`, `cha` = chá de bebê, de fraldas e revelação).

Vitrine: cada aba mostra até 12 peças (`VITRINE`/`DESTAQUES` em `catalogo.js`) e o botão "Conferir todos
os modelos" abre o resto. A busca por tema procura no catálogo inteiro.

Próximas fotos prometidas pela Mariluz: mais suportes para doces, festas montadas com balões, painéis e
mesas e bolos fakes. Ela avisou que o acervo é maior do que cabe no site.

Ao receber fotos novas, pergunte ou confirme pela conversa se são suportes para doces ou pegue e
monte antes de cadastrar. Na dúvida, suportes/boleiras/bandejas = `doces`.

## Fluidez no celular (a maioria das clientes acessa pelo celular)

- Nada de `backdrop-filter` em elementos que se repetem (cards, selos, lupas): use fundo quase opaco.
- No toque/telas < 900px (`lite` em `main.js`): sem Lenis, parallax, giro 3D, troca de cor do fundo
  e WebGL. Efeitos novos presos à rolagem (`scrub`) devem respeitar `lite`.
- Galeria e cards usam `sizes` que levam o celular a baixar a versão de 600px; a de 1200px fica para
  telas maiores e a versão máxima só abre na foto ampliada.
- O fundo da abertura no celular usa `hero-bg-*.webp` (pequeno e já desfocado); ao trocar as fotos da
  abertura, gere de novo (`convert foto-600.webp -resize 400x -blur 0x1.5 hero-bg-foto.webp`).
