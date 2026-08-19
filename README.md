# Edna Coutinho — Confecção Profissional de Microtelas

Página de vendas (link na bio) para o e-book + mentoria de confecção de
microtelas da Edna Coutinho (@ednacoutinhomegahair): mega hair, perucas,
topos, rabos de cavalo e franjas, da matéria-prima ao acabamento. Público:
cabeleireiras e ateliês que confeccionam ou querem confeccionar peças
capilares — não é conteúdo para quem só usa lace. HTML/CSS/JS puros, sem
build e sem dependências — abra `index.html` direto no navegador ou publique
a pasta inteira em qualquer host estático.

## Antes de publicar — o que falta definir

1. **Preço e checkout**: abra `assets/js/config.js` e preencha `checkoutUrl`
   com o link de pagamento da plataforma de infoproduto (Hotmart, Kiwify,
   Eduzz...). Enquanto estiver vazio, os botões "Quero garantir o meu" levam
   para a seção de comparação de planos em vez de uma página de pagamento.
2. **WhatsApp para dúvidas**: no mesmo arquivo, troque `whatsapp` pelo
   número real (DDI + DDD + número, só dígitos).
3. **Depoimentos**: na seção "O que dizem quem já aprendeu" (`index.html`,
   busque por `EXEMPLO — SUBSTITUIR`), os três textos são só modelo de
   formato — troque pelo depoimento e nome reais de alunas.
4. **FAQ**: busque por `AJUSTE` em `index.html` — são as perguntas sobre
   prazo de acesso, formato/duração da mentoria, forma de pagamento e
   garantia, que dependem da plataforma e das condições que a Edna definir.

## Estrutura

```
index.html              página única
assets/css/styles.css   todo o estilo (tokens de cor/tipografia no topo)
assets/js/config.js     ⚙️ único arquivo para editar no dia a dia
assets/js/main.js       comportamento (WhatsApp, checkout, animações)
assets/img/             fotos e favicon
robots.txt, sitemap.xml SEO básico
scripts/build-preview.py gera um único .html com tudo embutido (ver abaixo)
```

## Como funciona o funil

Não há checkout embutido: os botões "Quero garantir o meu" e "Garantir o
meu" apontam para o link de pagamento configurado em `checkoutUrl` (ou, sem
esse link ainda, para a seção de planos). O botão "Falar comigo no
WhatsApp" abre uma conversa direta para quem prefere tirar dúvidas antes de
comprar — sem formulário, sem backend.

## Personalização rápida

- **Cores/fontes**: no topo de `assets/css/styles.css`, seção `:root`.
- **Textos**: direto em `index.html` (comentado por seção).
- **Instagram, WhatsApp e checkout**: em `assets/js/config.js`.

## Pré-visualizar um arquivo único

```
python3 scripts/build-preview.py preview.html
```

Gera `preview.html` com CSS, JS e imagens (svg/jpg/avif) embutidos — útil
para mandar por e-mail/WhatsApp ou abrir sem depender da pasta `assets/`.

## SEO já incluso

Meta tags, Open Graph, dados estruturados (`Product` + `FAQPage`),
`robots.txt` e `sitemap.xml`. Troque `https://ednacoutinho.com.br/` pelo
domínio real nesses arquivos e em `index.html` quando ele existir, e gere
uma imagem `assets/img/og-cover.jpg` (1200×630) para a prévia em redes
sociais.

## Animações

Entrada em cascata no hero, ícones da faixa de confiança e linhas da
tabela em sequência, tilt 3D nos cards ao passar o mouse, parallax sutil no
hero, números dos passos contando, galeria com revelação tipo cortina e
zoom lento contínuo, ícone +/× no FAQ, respiração no botão principal do
hero, carrossel automático de depoimentos no mobile, e bounce único na
barra fixa. Tudo respeita `prefers-reduced-motion` — com essa preferência
ativada no sistema, as animações somem e o conteúdo aparece direto.

## Acessibilidade

Testado para contraste AA, navegação por teclado, `prefers-reduced-motion`,
alvos de toque ≥44px e leitores de tela (landmarks, alt text, `aria-live`
no envio do carrossel). Funciona sem JavaScript: os links de WhatsApp e
Instagram continuam clicáveis mesmo assim.
