# Wedding Bloom Foundation

Quero construir a base de um sistema de convites de casamento digitais multi-cliente, chamado "Solar Eclipse". Este é o Passo 1 (fundação) — ainda NÃO quero design/template visual elaborado, só a estrutura funcional, com um visual limpo e elegante mínimo (tons dourado/creme, tipografia serif, nada mais por agora).

BASE DE DADOS (usar Lovable Cloud / Supabase):

Tabela `weddings`:
- id (uuid, pk)
- slug (text, unique, not null) — identifica cada casamento na URL
- template (text, not null, default 'golden-classic') — qual design mostrar (por agora só vamos ter 'golden-classic' implementado)
- groom_name, bride_name, display_names (text)
- wedding_date (timestamptz)
- hashtag (text)
- groom_mother_name, groom_father_name, bride_mother_name, bride_father_name (text)
- ceremony_venue, ceremony_address, ceremony_time (text)
- civil_ceremony_venue, civil_ceremony_address, civil_ceremony_time (text, todos opcionais — nem todo casamento tem cerimónia civil separada)
- reception_venue, reception_address, reception_time (text)
- rsvp_deadline (date)
- bank_name, bank_account, bank_nib, bank_holder (text, para presentes)
- contact_1_name, contact_1_phone, contact_2_name, contact_2_phone (text)
- verse_text, verse_reference, verse_2_text, verse_2_reference (text, opcionais)
- cover_image_path (text, path no storage)
- music_path (text, path no storage)
- created_at (timestamptz default now())

Tabela `gallery`: id, wedding_id (fk), image_path, caption, sort_order
Tabela `schedule`: id, wedding_id (fk), time_label, title, description, sort_order
Tabela `gifts`: id, wedding_id (fk), title, description, link_or_info, sort_order
Tabela `rsvps`: id, wedding_id (fk), guest_name, guest_phone, attending (bool), guest_count (int, default 1), message, created_at

Storage: dois buckets — "wedding-gallery" (fotos, público para leitura) e "wedding-audio" (música, público para leitura). Upload só para utilizadores autenticados.

Auth e permissões:
- Sistema de login (email/password) com uma tabela `user_roles` (user_id, role) — role 'admin' pode gerir TODOS os casamentos.
- RLS: leitura pública dos dados de casamento (qualquer pessoa pode ver um convite pelo slug), escrita só para admins autenticados.
- Cria uma página /auth com login e um aviso "sem permissões" com instruções se o utilizador não for admin.

ROTAS PÚBLICAS (multi-tenant por slug):
- `/:slug` → capa do convite (nome do casal, data, botão "Abrir Convite", toca música ao clicar)
- `/:slug/home` → página principal do convite: contagem decrescente até à data, secção "Os Noivos" (nomes e pais), Programa do Dia (lista da tabela schedule, ou se vazia usa os campos de cerimónia/receção da tabela weddings), Localização (mapas), Galeria de fotos, Presentes (dados bancários), Formulário de Confirmação de Presença (RSVP) que grava na tabela rsvps.
- Suporte a parâmetro `?tipo=individual` ou `?tipo=casal` na URL — mostra um selo elegante "Convite válido para 1 pessoa" / "Convite válido para 2 pessoas" na capa E na home, com uma linha por baixo a dizer 'Ao confirmar presença, escreva "1" (ou "2") no campo "Número de convidados"'. Este parâmetro deve ser preservado ao navegar da capa para a home.

PAINEL INTERNO (protegido, só admins):
- `/admin` → lista todos os casamentos (nome do casal, data, slug, link direto). Botão "Novo Casamento" que abre um formulário para criar um casamento novo preenchendo todos os campos da tabela weddings. Cada casamento na lista tem um botão "Editar" que abre o mesmo formulário preenchido, e permite fazer upload de foto de capa e música (guardando nos buckets certos e atualizando cover_image_path/music_path).

Por agora não preciso de mais nenhum design visual além deste — vamos evoluir o template a seguir, este passo é só a fundação funcional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e7b7bddc-f3c2-4b9b-9de9-924ef63b37f9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
