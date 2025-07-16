# CI/CD Pipeline - OpenDelivery API Schema Validator 2

## Sobre o Pipeline

Este pipeline de CI/CD é executado automaticamente pelo GitHub Actions e tem como objetivo validar o código através de build e testes, garantindo a qualidade do projeto.

## Triggers

O pipeline é executado nos seguintes eventos:
- **Push** para a branch `main`
- **Pull Request** para a branch `main`

## Etapas do Pipeline

### 1. **Checkout do Código**
- Faz o checkout do código do repositório
- Usa `actions/checkout@v4`

### 2. **Configuração do Node.js**
- Instala Node.js versão 18
- Configura cache do npm automaticamente
- Usa `actions/setup-node@v4`

### 3. **Instalação de Dependências**
- Executa `npm run install:all`
- Instala dependências do projeto principal, backend e frontend

### 4. **Build do Backend**
- Navega para o diretório `backend/`
- Executa `npm run build`
- Compila o código TypeScript para JavaScript

### 5. **Testes do Backend**
- Executa `npm test` no backend
- Roda todas as suítes de testes (4 suítes, 18 testes)

### 6. **Build do Frontend**
- Navega para o diretório `frontend/`
- Executa `npm run build`
- Compila o projeto React/Vite

### 7. **Testes do Frontend**
- Executa `npm run test` no frontend
- Roda os testes com Vitest (2 suítes, 21 testes)

### 8. **Verificação dos Builds**
- Confirma que os diretórios `backend/dist` e `frontend/dist` foram criados
- Valida que ambos os builds foram bem-sucedidos

### 9. **Resumo Final**
- Exibe status de sucesso do pipeline
- Confirma que todos os testes passaram
- Indica que o projeto está pronto para deploy local

## Status dos Testes

O pipeline valida:
- **Backend**: 18 testes em 4 suítes
- **Frontend**: 21 testes em 2 suítes  
- **Total**: 39 testes devem passar para o pipeline ser bem-sucedido

## Visualização no GitHub

Para visualizar o status do pipeline:
1. Vá para a aba **Actions** no repositório GitHub
2. Clique no workflow **CI/CD - Build and Test**
3. Visualize os logs detalhados de cada execução

## Badges de Status

Você pode adicionar badges de status do CI/CD no README.md:

```markdown
[![CI/CD](https://github.com/marcioreck/opendelivery-api-schema-validator2/actions/workflows/ci.yml/badge.svg)](https://github.com/marcioreck/opendelivery-api-schema-validator2/actions/workflows/ci.yml)
```

## Resolução de Problemas

### Pipeline Falhando

Se o pipeline falhar, verifique:
1. **Testes**: Todos os 39 testes devem passar
2. **Build**: Ambos os builds (backend e frontend) devem ser bem-sucedidos
3. **Dependências**: Todas as dependências devem ser instaladas corretamente

### Comandos Locais

Para reproduzir o pipeline localmente:

```bash
# Instalar dependências
npm run install:all

# Build e teste do backend
cd backend
npm run build
npm test

# Build e teste do frontend
cd ../frontend
npm run build
npm run test
```

## Benefícios

- ✅ **Validação Automática**: Todo commit e PR é validado
- ✅ **Detecção Precoce**: Problemas são identificados rapidamente
- ✅ **Qualidade**: Garante que o código funcione antes do merge
- ✅ **Documentação**: Logs detalhados de cada execução
- ✅ **Simplicidade**: Foco apenas em build e testes (uso local)

---

*Este pipeline foi otimizado para o uso local do OpenDelivery API Schema Validator 2, garantindo qualidade de código sem complexidade desnecessária.*
