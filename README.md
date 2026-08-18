# Edna Coutinho — Laces de Luxo Sob Medida

Landing page (link na bio) para a especialista em laces sob medida e mega hair
Edna Coutinho (@ednacoutinhomegahair). HTML/CSS/JS puros, sem build e sem
dependências — abra `index.html` direto no navegador ou publique a pasta
inteira em qualquer host estático.

## Antes de publicar — ajuste 3 coisas

1. **WhatsApp**: abra `assets/js/config.js` e troque `whatsapp` pelo número
   real (DDI + DDD + número, só dígitos). Enquanto não trocar, os botões
   apontam para um número de exemplo.
2. **Fotos**: troque os arquivos em `assets/img/` pelas fotos reais —
   `hero-retrato.svg` (retrato principal, 900×1200) e `resultado-1.svg` a
   `resultado-6.svg` (galeria de transformações, 1000×1250 cada). Os SVGs
   atuais são só placeholders de rascunho, com as medidas escritas neles.
3. **Depoimentos**: na seção "O que dizem as clientes" (`index.html`, busque
   por `EXEMPLO — SUBSTITUIR`), os três textos são só modelo de formato —
   troque pelo depoimento e nome reais de clientes e apague a tag
   "exemplo — substituir" de cada cartão.

Também vale revisar o FAQ (preço, prazo de produção, atendimento fora da
cidade) com os números reais da Edna antes de publicar.

## Estrutura

```
index.html              página única
assets/css/styles.css   todo o estilo (tokens de cor/tipografia no topo)
assets/js/config.js     ⚙️ único arquivo para editar no dia a dia
assets/js/main.js       comportamento (WhatsApp, validação do form, animações)
assets/img/             fotos e favicon
robots.txt, sitemap.xml SEO básico
scripts/build-preview.py gera um único .html com tudo embutido (ver abaixo)
```

## Como funciona o funil

Não há backend nem checkout: os dois pontos de conversão (formulário no
final da página e todos os botões "Agendar") apenas montam uma mensagem e
abrem o WhatsApp da Edna já com o texto preenchido — a conversa e o
fechamento continuam manualmente, como ela já faz hoje.

## Personalização rápida

- **Cores/fontes**: no topo de `assets/css/styles.css`, seção `:root`.
- **Textos**: direto em `index.html` (comentado por seção).
- **Instagram e horários**: em `assets/js/config.js`.

## Pré-visualizar um arquivo único

```
python3 scripts/build-preview.py preview.html
```

Gera `preview.html` com CSS, JS e imagens embutidos — útil para mandar por
e-mail/WhatsApp ou abrir sem depender da pasta `assets/`.

## SEO já incluso

Meta tags, Open Graph, dados estruturados (`HairSalon` + `FAQPage`),
`robots.txt` e `sitemap.xml`. Troque `https://ednacoutinho.com.br/` pelo
domínio real nesses arquivos e em `index.html` quando ele existir, e gere
uma imagem `assets/img/og-cover.jpg` (1200×630) para a prévia em redes
sociais.

## Acessibilidade

Testado para contraste AA, navegação por teclado, `prefers-reduced-motion`,
alvos de toque ≥44px e leitores de tela (landmarks, alt text, rótulos de
formulário, `aria-live` no envio). O formulário funciona mesmo sem
JavaScript (mostra um aviso e direciona para o Instagram).
