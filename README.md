# Mariluz Festas · site

Site institucional da **Mariluz Festas** (locação de peças pegue e monte, kits temáticos e pequenas
montagens com balões, Curitiba). O catálogo permite montar uma lista de locação e enviá-la pelo WhatsApp.
Página estática, sem etapa de build: publique a pasta inteira (Vercel, Netlify ou qualquer hospedagem).

## Estrutura

```
index.html              página única (SEO, JSON-LD LocalBusiness, acessibilidade)
assets/css/style.css    identidade visual (paleta neutra de luxo, vidro, sombras físicas)
assets/js/main.js       GSAP + ScrollTrigger + SplitText + Lenis: scroll cinematográfico,
                        portfólio por categoria, galeria em tela cheia, timeline, contadores,
                        formulário com validação que envia pelo WhatsApp
assets/js/catalogo.js   catálogo de locação (lista CATALOG), filtros, lista de orçamento
                        persistida no navegador e envio pelo WhatsApp
assets/js/hero-gl.js    cena Three.js do hero (carregada só em aparelhos com WebGL)
assets/vendor/          bibliotecas hospedadas localmente (gsap 3.13, three 0.170, lenis 1.3)
assets/fonts/           Inter variável (fallback do SF Pro)
assets/img/             fotos das decorações
```

## Antes de publicar

- **Fotos:** as imagens atuais foram recortadas de capturas de tela do Google. Substitua pelos
  arquivos originais em alta resolução mantendo os mesmos nomes em `assets/img/`.
- **Catálogo:** os produtos ficam na lista `CATALOG` no início de `assets/js/catalogo.js`
  (nome, categoria, descrição, selo "Mais procurado" e forma de retirada). Peças sem foto usam uma
  ilustração em linha; para usar a foto real, coloque o arquivo em `assets/img/` e preencha `img`
  (ex.: `img: 'assets/img/suporte-colonial.webp'`). Os kits de suportes para doces (fotos atuais) ficam
  em **Suportes para doces** e os kits de decoração em **Kits pegue e monte** (veja `CLAUDE.md`).
  Nas duas categorias o campo `publico` define o subfiltro: `menino`, `menina` (Infantil),
  `masculino`, `feminino` (Adulto), `batizado`, `cha` (Bebê); um kit pode ter mais de um. Não há preços no site: valores e
  disponibilidade são confirmados pelo WhatsApp conforme a data.
  O botão **Pedir** de cada peça abre o WhatsApp da loja com a mensagem pronta: nome, categoria,
  descrição, modalidade, quantidade, referência e o link da foto (o WhatsApp mostra a prévia da
  imagem quando o site está publicado no domínio). O link `wa.me` só aceita texto, então o arquivo
  da foto em si não pode ser anexado.
- **Preços:** cada peça pode ter `preco`. Os valores preenchidos vieram da loja online antiga e só
  aparecem no site com `MOSTRAR_PRECOS = true` (início de `assets/js/catalogo.js`), depois de
  confirmados pela Mariluz. `DESTAQUES` define as 12 peças da vitrine inicial.
- **Depoimentos:** avaliações reais publicadas no Casamentos.com.br. Para incluir as do Google, edite
  a lista `TESTIMONIALS` no início de `assets/js/main.js` com o texto exato e o nome da cliente.
- **Vídeo do hero (opcional):** coloque um vídeo em `assets/video/hero.mp4` e preencha
  `data-src="assets/video/hero.mp4"` na tag `<video class="hero-video">`.
- **Números:** a seção "Em números" usa dados públicos (15 anos, 67 avaliações, nota 4,5,
  6.800 seguidores). Para "eventos realizados" ou "clientes atendidos", ajuste `data-count`.

## Dados do negócio usados

R. Goiás, 226, Água Verde, Curitiba/PR, 80620-060 · (41) 3014-7567 · WhatsApp (41) 99686-5017 ·
mariluzfestas2@gmail.com · Instagram @mariluzfestas · Facebook /mariluzfestasprovencal ·
Seg a sex 9h–12h / 13h–18h, sábado a partir das 9h.
