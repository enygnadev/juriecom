# ⚖️ Despachante DevTools - E-Commerce de Serviços Jurídicos

Sistema completo de e-commerce especializado em serviços jurídicos para despachantes, desenvolvido com Next.js 15, TypeScript e Firebase.

## 🚀 Instalação e Configuração

### 1. **Clone e Instale:**
\`\`\`bash
git clone <repository-url>
cd despachante-devtools-ecommerce
npm install
\`\`\`

### 2. **Configure as Variáveis de Ambiente:**

O arquivo `.env.local` já está configurado com as credenciais do seu projeto Firebase:

\`\`\`env
# Firebase Configuration - Despachante DevTools
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAa1zWXWHm8MSsKKEvDaG2K_bMKKLdM6wk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=despachante-devtools.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=despachante-devtools
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=despachante-devtools.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=803132691747
NEXT_PUBLIC_FIREBASE_APP_ID=1:803132691747:web:cfe39848490e451a9a2896

# OpenAI API Key (for chatbot)
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### 3. **Configure o Firebase Console:**
- Acesse [Firebase Console](https://console.firebase.google.com/project/despachante-devtools)
- Ative **Authentication** → Sign-in methods → Email/Password e Google
- Crie um banco **Firestore** (modo teste)
- Ative o **Storage**

### 4. **Adicione Produtos Automaticamente:**
\`\`\`bash
npm run setup-products
\`\`\`

### 5. **Execute o Projeto:**
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev              # Desenvolvimento (usa .env.local)
npm run build            # Build de produção
npm run setup-products   # Adiciona produtos usando .env.local
npm run deploy           # Deploy para Vercel
\`\`\`

## 🔐 Configuração de Segurança

### **Firestore Rules:**
Configure no Firebase Console → Firestore → Rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - leitura pública, escrita apenas admin
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users - ler/escrever apenas próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Carts - ler/escrever apenas próprio carrinho
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## 💡 Produtos Pré-configurados

O script `setup-products` adiciona automaticamente serviços jurídicos de despachante:

1. **Transferência de Propriedade de Veículo** - R$ 150,00
2. **Licenciamento Anual de Veículo** - R$ 80,00
3. **Segunda Via de CNH** - R$ 120,00
4. **Abertura de Empresa (MEI)** - R$ 200,00
5. **Certidão Negativa de Débitos** - R$ 50,00
6. **Registro de Marca/Patente** - R$ 800,00
7. **Habilitação para Moto** - R$ 400,00
8. **Transporte Escolar (Documentação)** - R$ 300,00
9. **Alteração Contratual** - R$ 250,00
10. **Pacote Completo Empresarial** - R$ 1.200,00

## 🎯 Funcionalidades

### ✅ **Implementado:**
- 🔥 **Firebase totalmente integrado** usando `.env.local`
- 🛍️ **Catálogo de produtos** com categorias
- 🛒 **Carrinho de compras** persistente
- 🔐 **Autenticação** (Email + Google)
- 👨‍💼 **Painel administrativo**
- 🤖 **Chatbot especializado** em serviços jurídicos
- 📱 **PWA** - Instalável como app
- 🌙 **Modo escuro/claro**
- 📊 **Anti-duplicação** de produtos

### 🔄 **Próximos Passos:**
- [ ] Adicionar chave OpenAI no `.env.local`
- [ ] Configurar métodos de pagamento
- [ ] Implementar sistema de avaliações
- [ ] Adicionar cupons de desconto

## 🚨 **Importante:**

1. **Todas as configurações** agora usam o `.env.local`
2. **Script de produtos** verifica variáveis de ambiente
3. **Não há mais credenciais hardcoded** no código
4. **Validação automática** das variáveis necessárias

## 📞 Suporte

- 💬 **Chat IA** - Assistente 24/7 especializado em serviços jurídicos
- 📧 **Email** - suporte@despachantedevtools.com
- 🔧 **Documentação** - README.md completo

---

**Despachante DevTools** - *Simplificando seus processos jurídicos* ⚖️📋
# despachantedevtools
