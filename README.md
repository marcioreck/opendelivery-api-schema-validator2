# OpenDelivery API Schema Validator 2

Uma ferramenta avançada e abrangente para validação, verificação de compatibilidade e certificação de implementações da API OpenDelivery. Este projeto fornece tanto um serviço backend para validação de esquemas quanto uma interface frontend para fácil interação.

## Sobre o OpenDelivery

O **OpenDelivery** é um padrão de API REST que estabelece um protocolo único de comunicação entre comerciantes e aplicações de pedidos no ecossistema de delivery. Para mais informações sobre o padrão oficial, visite: [https://www.opendelivery.com.br/](https://www.opendelivery.com.br/)

## Funcionalidades

### Backend
- **Validação Multi-versão**: Suporte completo para validação de esquemas das versões 1.0.0 até 1.6.0-rc
- **Sistema de Gerenciamento de Esquemas**: Carregamento e gerenciamento automatizado de múltiplas versões de esquemas
- **Verificação de Compatibilidade**: Análise de compatibilidade entre diferentes versões da API
- **Validação de Segurança**: Verificação de requisitos de segurança e detecção de dados sensíveis
- **Sistema de Certificação**: Certificação "OpenDelivery Ready" com pontuação detalhada
- **API RESTful**: Endpoints bem definidos para todas as funcionalidades

### Frontend
- **Editor JSON Interativo**: Editor Monaco integrado com syntax highlighting
- **Seletor de Versões**: Interface para seleção de versão de esquema
- **Validação em Tempo Real**: Feedback imediato sobre a validação
- **Verificador de Compatibilidade**: Interface para análise de compatibilidade entre versões
- **Dashboard de Certificação**: Painel completo para certificação OpenDelivery Ready
- **Payloads de Teste**: Exemplos pré-definidos de payloads válidos e inválidos para testes
- **Verificador de Autenticidade**: Ferramenta para verificar a autenticidade da API OpenDelivery

## Estrutura do Projeto

```
opendelivery-api-schema-validator2/
├── backend/                    # Serviço backend
│   ├── src/
│   │   ├── services/          # Serviços principais
│   │   │   ├── ValidationService.ts
│   │   │   ├── CompatibilityService.ts
│   │   │   ├── CertificationService.ts
│   │   │   ├── SchemaManager.ts
│   │   │   └── ValidationEngine.ts
│   │   ├── controllers/       # Controladores da API
│   │   │   ├── validateController.ts
│   │   │   ├── compatibilityController.ts
│   │   │   └── certifyController.ts
│   │   ├── types/            # Definições de tipos
│   │   └── utils/            # Utilitários
│   ├── schemas/              # Esquemas JSON das versões OpenDelivery
│   │   ├── 1.0.0.yaml
│   │   ├── 1.1.0.yaml
│   │   ├── 1.2.0.yaml
│   │   ├── 1.3.0.yaml
│   │   ├── 1.4.0.yaml
│   │   ├── 1.5.0.yaml
│   │   ├── 1.6.0-rc.yaml
│   │   └── beta.yaml
│   ├── tests/                # Testes do backend
│   └── package.json
├── frontend/                  # Aplicação frontend
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── TestPayloads.tsx
│   │   │   ├── CompatibilityChecker.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── ValidatorPage.tsx
│   │   │   ├── CompatibilityPage.tsx
│   │   │   └── CertificationPage.tsx
│   │   ├── services/        # Serviços da API
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Assets estáticos
│   └── package.json
└── docs/                    # Documentação
    ├── SUPPORT.md          # Documentação de suporte
    ├── API.md              # Documentação da API
    └── ...
```

## Começando

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript >= 5.0.0

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/marcioreck/opendelivery-api-schema-validator2.git
cd opendelivery-api-schema-validator2
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

### Desenvolvimento

1. Inicie o serviço backend:
```bash
cd backend
npm run dev
```

2. Inicie a aplicação frontend:
```bash
cd frontend
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000

### Execução de Testes

#### Testes do Backend
```bash
cd backend
npm test
```

#### Testes do Frontend
```bash
cd frontend
npm test
```

## Endpoints da API

### Validação
- `POST /validate` - Validar payload contra esquema específico
- `POST /compatibility` - Verificar compatibilidade entre versões
- `POST /certify` - Obter certificação OpenDelivery Ready
- `GET /health` - Verificação de saúde do serviço

### Versões Suportadas
- 1.0.0, 1.0.1, 1.1.0, 1.1.1, 1.2.0, 1.2.1, 1.3.0, 1.4.0, 1.5.0, 1.6.0-rc, beta

## Testes Implementados

### Backend
- **Validator Tests**: Testes de validação de alto nível
- **Validation Engine Tests**: Testes da lógica de validação principal
- **Compatibility Checker Tests**: Testes de verificação de compatibilidade

### Frontend
- **TestPayloads Component Tests**: 14 testes abrangentes
- **CompatibilityChecker Tests**: Testes de verificação de autenticidade
- **Cobertura Completa**: Testes de payloads válidos, inválidos e de compatibilidade

## Funcionalidades Especiais

### Payloads de Teste
- **Payloads Válidos**: Exemplos básicos e completos
- **Payloads Inválidos**: Exemplos com erros comuns
- **Payloads de Compatibilidade**: Para teste de migração entre versões

### Verificador de Autenticidade
Ferramenta única que verifica se o validador está usando a API oficial OpenDelivery em todas as versões disponíveis.

### Certificação OpenDelivery Ready
Sistema de certificação com pontuação detalhada e níveis:
- **GOLD**: >= 90 pontos
- **SILVER**: >= 70 pontos  
- **BRONZE**: >= 50 pontos
- **NOT_CERTIFIED**: < 50 pontos

## Documentação

- **[Guia de Suporte](docs/SUPPORT.md)** - Instruções de uso e manutenção
- **[Documentação da API](docs/API.md)** - Referência completa da API

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Autor

**Márcio Reck**
- Portfólio: [https://fazmercado.com](https://fazmercado.com)
- GitHub: [@marcioreck](https://github.com/marcioreck)

## Suporte

Para suporte e documentação detalhada, consulte o arquivo [SUPPORT.md](docs/SUPPORT.md).

## Agradecimentos

- **OpenDelivery**: Pelo padrão aberto e documentação oficial
- **Comunidade**: Pelos feedbacks e contribuições
- **Programmers IT**: Pela inspiração do validador original

---

*OpenDelivery API Schema Validator 2 - Desenvolvido por Márcio Reck*
