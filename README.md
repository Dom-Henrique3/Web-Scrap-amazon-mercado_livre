# Web Scraping Mercado Livre

Sistema completo de web scraping para o Mercado Livre com interface web moderna e funcionalidades avançadas de seleção e aprovação de produtos.

## 🚀 Funcionalidades

- **Web Scraping Inteligente**: Extração automatizada de produtos do Mercado Livre
- **Interface Web Moderna**: Interface responsiva e intuitiva
- **Seleção Múltipla**: Seleção e aprovação em lote de produtos
- **Extração Completa**: Título, preço, imagem, loja, avaliações e mais
- **Sistema de Aprovação**: Workflow para aprovar/reprovar produtos
- **Agendamento**: Execução automática de scraping
- **Banco de Dados**: Armazenamento em Supabase

## 📋 Pré-requisitos

- Python 3.8+
- Firefox (para o GeckoDriver)
- Conta no Supabase (opcional)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Dom-Henrique3/Web-Scrap-amazon-mercado_livre.git
cd Web-Scrap-amazon-mercado_livre
```

2. **Crie um ambiente virtual**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Configure o GeckoDriver**
```bash
# Baixe o GeckoDriver para Firefox
wget https://github.com/mozilla/geckodriver/releases/download/v0.36.0/geckodriver-v0.36.0-linux64.tar.gz
tar -xzf geckodriver-v0.36.0-linux64.tar.gz
sudo mv geckodriver /usr/local/bin/
```

5. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
nano .env
```

### Configurações Necessárias:

**Para Supabase (opcional):**
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_KEY`: Chave de API do Supabase

**Para SerpAPI (Amazon scraping):**
- `SERPAPI_KEY`: Chave de API do SerpAPI (obrigatória para Amazon)

**Para obter a chave do SerpAPI:**
1. Acesse [serpapi.com](https://serpapi.com)
2. Crie uma conta gratuita
3. Obtenha sua chave de API
4. Adicione no arquivo `.env`

## 🚀 Como Usar

### Executar a Aplicação Web
```bash
python app.py
```
Acesse `http://localhost:5000` no seu navegador.

### Executar Scraping Manual
```bash
python scrap/run_scraper.py
```

### Executar Agendador
```bash
python agendador.py
```

## 📁 Estrutura do Projeto

```
Web-Scrap-amazon-mercado_livre/
├── app.py                 # Aplicação Flask principal
├── api.py                 # API REST
├── agendador.py           # Sistema de agendamento
├── scrap/                 # Módulos de scraping
│   ├── web_scrap_mercado_livre_segplano.py
│   ├── run_scraper.py
│   └── unificar_dados.py
├── db_base/               # Configuração do banco
│   └── supabase_client.py
├── static/                # Arquivos estáticos
│   ├── css/
│   └── js/
├── templates/             # Templates HTML
│   ├── components/
│   └── partials/
└── requirements.txt       # Dependências Python
```

## 🔧 Configuração

### Variáveis de Ambiente
O projeto usa um arquivo `.env` para configurações. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

**Configurações obrigatórias:**
```env
# SerpAPI (obrigatório para Amazon)
SERPAPI_KEY=sua_chave_do_serpapi

# Flask
FLASK_ENV=development
FLASK_SECRET_KEY=sua_chave_secreta_do_flask
```

**Configurações opcionais:**
```env
# Supabase (banco de dados)
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase

# Configurações avançadas
REQUEST_DELAY=2
MAX_REQUESTS_PER_MINUTE=30
```

### Configuração do Scraping
O sistema suporta configurações personalizadas para:
- Número de páginas a serem scrapadas
- Filtros de preço
- Categorias específicas
- Intervalos de execução

### APIs Utilizadas

**SerpAPI (Amazon):**
- Utilizada para scraping da Amazon
- Requer chave de API gratuita
- Limite de 100 consultas/mês no plano gratuito
- [Obter chave gratuita](https://serpapi.com)

**Selenium (Mercado Livre):**
- Utilizada para scraping do Mercado Livre
- Não requer chave de API
- Requer Firefox e GeckoDriver

## 📊 Dados Extraídos

Para cada produto, o sistema extrai:
- **Título**: Nome completo do produto
- **Preço**: Preço atual e histórico
- **Imagem**: URL da imagem principal
- **Loja**: Nome da loja vendedora
- **Avaliações**: Nota e número de avaliações
- **URL**: Link direto para o produto
- **Condição**: Novo ou usado
- **Frete**: Informações de entrega

## 🎯 Funcionalidades Avançadas

### Seleção Múltipla
- Seleção individual de produtos
- Seleção em lote (todos/nenhum)
- Contador de produtos selecionados
- Aprovação/reprovação em massa

### Sistema de Aprovação
- Workflow de aprovação de produtos
- Histórico de decisões
- Filtros por status
- Exportação de dados aprovados

### Agendamento
- Execução automática de scraping
- Configuração de horários
- Logs de execução
- Notificações de status

## 🔒 Segurança

- Rate limiting para evitar bloqueios
- Headers personalizados
- Delays aleatórios entre requisições
- User-Agent rotation
- Proxy support (configurável)

## 🐛 Solução de Problemas

### Problemas Comuns

1. **GeckoDriver não encontrado**
```bash
# Verifique se o GeckoDriver está no PATH
which geckodriver
```

2. **Erro de conexão com Supabase**
```bash
# Verifique as credenciais no arquivo .env
cat .env
```

3. **Erro de SerpAPI**
```bash
# Verifique se a chave está configurada
echo $SERPAPI_KEY

# Verifique se a chave está no arquivo .env
grep SERPAPI_KEY .env
```

3. **Imagens não carregando**
- O sistema implementa lazy loading para imagens
- Verifique a conexão com a internet
- Algumas imagens podem estar temporariamente indisponíveis

4. **Erro de SerpAPI**
- Verifique se a chave está configurada no arquivo `.env`
- Confirme se a chave é válida em [serpapi.com](https://serpapi.com)
- Verifique se não excedeu o limite de consultas gratuitas (100/mês)

### Logs
Os logs são salvos em:
- Console durante execução
- Arquivos de log (se configurado)
- Supabase (para histórico)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

## 🔄 Atualizações

### Versão 2.0
- ✅ Interface web moderna
- ✅ Seleção múltipla de produtos
- ✅ Sistema de aprovação
- ✅ Extração de imagens otimizada
- ✅ Extração de nomes de lojas
- ✅ Agendamento automático

### Próximas Funcionalidades
- [ ] Suporte a outros marketplaces
- [ ] Análise de preços históricos
- [ ] Alertas de preço
- [ ] Dashboard analítico
- [ ] API pública
