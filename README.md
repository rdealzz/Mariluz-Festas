# Mariluz Festas · site

Site institucional da **Mariluz Festas** (decoração de eventos e locação de peças, Curitiba).
Página estática, sem etapa de build: publique a pasta inteira (Vercel, Netlify ou qualquer hospedagem).

## Estrutura

```
index.html              página única (SEO, JSON-LD LocalBusiness, acessibilidade)
assets/css/style.css    identidade visual (paleta neutra de luxo, vidro, sombras físicas)
assets/js/main.js       GSAP + ScrollTrigger + SplitText + Lenis: scroll cinematográfico,
                        portfólio por categoria, galeria em tela cheia, timeline, contadores,
                        formulário com validação que envia pelo WhatsApp
assets/js/hero-gl.js    cena Three.js do hero (carregada só em aparelhos com WebGL)
assets/vendor/          bibliotecas hospedadas localmente (gsap 3.13, three 0.170, lenis 1.3)
assets/fonts/           Inter variável (fallback do SF Pro)
assets/img/             fotos das decorações
```

## Antes de publicar

- **Fotos:** as imagens atuais foram recortadas de capturas de tela do Google. Substitua pelos
  arquivos originais em alta resolução mantendo os mesmos nomes em `assets/img/`.
- **Depoimentos:** são ilustrativos. Edite a lista `TESTIMONIALS` no início de `assets/js/main.js`
  com avaliações reais (e remova o aviso `.sample-note` em `index.html`).
- **Vídeo do hero (opcional):** coloque um vídeo em `assets/video/hero.mp4` e preencha
  `data-src="assets/video/hero.mp4"` na tag `<video class="hero-video">`.
- **Números:** a seção "Em números" usa dados públicos (14 anos, 67 avaliações, nota 4,5,
  6.800 seguidores). Para "eventos realizados" ou "clientes atendidos", ajuste `data-count`.

## Dados do negócio usados

R. Goiás, 226, Água Verde, Curitiba/PR, 80620-060 · (41) 3014-7567 · WhatsApp (41) 99686-5017 ·
mariluzfestas2@gmail.com · Instagram @mariluzfestas · Facebook /mariluzfestasprovencal ·
Seg a sex 9h–12h / 13h–18h, sábado a partir das 9h.
