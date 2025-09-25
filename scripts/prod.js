// scripts/setupBlasiusProducts.js
require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

// Configuração Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Erro: Variáveis de ambiente do Firebase não encontradas!");
  process.exit(1);
}

console.log(`🔥 Conectando ao Firebase: ${firebaseConfig.projectId}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mapeamento de URLs específicas para cada produto (mantive o mesmo formato de objeto)
const productImages = {
  "Consulta Trabalhista Inicial": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Indicação de Testemunhas e Provas": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop",
  "Inventário e Partilha (Assessoria)": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
  "Emissão de Parecer Jurídico (2ª via)": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
  "Alteração Contratual (Ajuste de Cláusulas)": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=400&fit=crop",
  "Inclusão de Garantia/Alienação Fiduciária (Orientação)": "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=400&fit=crop",
  "Constituição de Sociedade (Primeiro Registro)": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
  "Licenciamento e Registros Empresariais": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Ação de Indenização por Sinistro": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Retificação de Documentos (Remarcação de Identificadores)": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Consultoria para Inclusão de Cláusulas Especiais (GNV ≈ cláusulas especiais)": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop",
  "Alteração de Objeto Contratual (Mutação de Cláusulas)": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Alteração de Representação (Substituição de Responsável)": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Reinício de Prazo Processual": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Restauração de Documentos e Registros": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Autorização para Publicação/Estampagem de Conteúdo (autorização de uso)": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=400&fit=crop",
  "Baixa de Anotação Administrativa (Artigo 270 ≈ anotações)": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Encerramento de Atividade (Baixa de Empresa/Filial)": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Remarcação de Cláusulas Contratuais (Remarcação de Chassi)": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Segunda via de Certificado/Etiqueta Jurídica": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
  "Ampliação de Objeto Social (Alongamento de cláusulas)": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Inclusão de Novo Sócio / Eixo Diretivo": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Autorização de Representante (Transporte Escolar ≈ autorização especial)": "https://simoesfilhofm.com.br/wp-content/uploads/2023/01/escolares-glr-08-800x445.jpg",
  "Regularização de Veículo Empresarial (Transporte Escolar ≈ regularização operacional)": "https://simoesfilhofm.com.br/wp-content/uploads/2023/01/escolares-glr-08-800x445.jpg"
}

// Função para obter URL da imagem baseada no título
function generateImageUrl(title, category, index) {
  return productImages[title] || `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=600&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&title=${title}&category=${category}`;
}

/**
 * =======================================================================================
 * PRODUTOS (SERVIÇOS JURÍDICOS) — mantendo a estrutura original e campos como no documento
 * =======================================================================================
 */
const BlasiusProducts = [
  // 1
  {
    title: "Consulta Trabalhista Inicial",
    description:
      "Documentos: CTPS (quando aplicável), contrato de trabalho, holerites, aviso prévio (se houver) e comprovante de endereço. Fluxo: análise preliminar, cálculo estimado de verbas, orientação sobre medidas administrativas e proposta de ação.",
    price: 0.00,
    image: generateImageUrl("Consulta Trabalhista Inicial", "trabalhista", 1),
    category: "trabalhista",
    features: ["CTPS", "Holerites", "Contrato de Trabalho", "Cálculo Preliminar"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 2
  {
    title: "Indicação de Testemunhas e Provas",
    description:
      "Serviço de orientação para identificação e coleta de provas, lista de testemunhas e elaboração de roteiro para depoimentos. Inclui verificação documental e sugestões de diligências.",
    price: 0.00,
    image: generateImageUrl("Indicação de Testemunhas e Provas", "provas", 2),
    category: "provas",
    features: ["Coleta de Provas", "Roteiro de Depoimentos", "Indicação de Testemunhas"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 3
  {
    title: "Inventário e Partilha (Assessoria)",
    description:
      "Documentos: Certidão de óbito, formal de partilha/mandato, documentos dos herdeiros (RG/CNH, comprovante de residência), certidões negativas. Fluxo: diagnóstico, escolha entre inventário judicial ou extrajudicial, elaboração das peças e acompanhamento.",
    price: 0.00,
    image: generateImageUrl("Inventário e Partilha (Assessoria)", "sucessorio", 3),
    category: "sucessorio",
    features: ["Formal de Partilha", "Documentos Herdeiros", "Inventário Judicial/Extrajudicial"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 4
  {
    title: "Emissão de Parecer Jurídico (2ª via)",
    description:
      "Emissão de parecer técnico-jurídico sobre determinada questão, com fundamentação, jurisprudência correlata e recomendações estratégicas. Ideal para suporte de decisões empresariais e litígios.",
    price: 0.00,
    image: generateImageUrl("Emissão de Parecer Jurídico (2ª via)", "parecer", 4),
    category: "parecer",
    features: ["Parecer Técnico", "Jurisprudência", "Recomendações"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 5
  {
    title: "Alteração Contratual (Ajuste de Cláusulas)",
    description:
      "Serviço de revisão e alteração de contratos comerciais ou civis, com proposta de novas cláusulas, mitigação de risco e versão final para assinatura.",
    price: 0.00,
    image: generateImageUrl("Alteração Contratual (Ajuste de Cláusulas)", "contratos", 5),
    category: "contratos",
    features: ["Revisão Contratual", "Cláusulas de Proteção", "Versão Final"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 6
  {
    title: "Inclusão de Garantia/Alienação Fiduciária (Orientação)",
    description:
      "Orientação para inclusão de garantia em contratos de financiamento, verificação documental e contato com instituições para registro do gravame.",
    price: 0.00,
    image: generateImageUrl("Inclusão de Garantia/Alienação Fiduciária (Orientação)", "gravames", 6),
    category: "gravames",
    features: ["Garantia Fiduciária", "Registro de Gravame", "Orientação Documental"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 7
  {
    title: "Constituição de Sociedade (Primeiro Registro)",
    description:
      "Documentos: contrato social, documentos dos sócios (RG/CPF/CNH), comprovante de endereço e certidões. Fluxo: elaboração do contrato, registro na junta comercial e obtenção de CNPJ.",
    price: 0.00,
    image: generateImageUrl("Constituição de Sociedade (Primeiro Registro)", "corporate", 7),
    category: "corporate",
    features: ["Contrato Social", "Registro Junta", "CNPJ"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 8
  {
    title: "Licenciamento e Registros Empresariais",
    description:
      "Verificação de licenças, alvarás e registros exigidos para atividade empresarial; orientação para regularização e encaminhamento aos órgãos competentes.",
    price: 0.00,
    image: generateImageUrl("Licenciamento e Registros Empresariais", "empresarial", 8),
    category: "empresarial",
    features: ["Alvará", "Licença Operacional", "Regularização"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 9
  {
    title: "Ação de Indenização por Sinistro",
    description:
      "Abertura de ação de indenização por danos materiais e morais em caso de sinistros, com produção de provas técnicas, orçamentos e acompanhamento judicial.",
    price: 0.00,
    image: generateImageUrl("Ação de Indenização por Sinistro", "civil", 9),
    category: "civil",
    features: ["Danos Materiais", "Danos Morais", "Perícias"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 10
  {
    title: "Retificação de Documentos (Remarcação de Identificadores)",
    description:
      "Atuação para retificação de documentos públicos ou contratuais, remoção de erro material e atualização de registros perante órgãos competentes.",
    price: 0.00,
    image: generateImageUrl("Retificação de Documentos (Remarcação de Identificadores)", "documentos", 10),
    category: "documentos",
    features: ["Retificação", "Atualização de Registros", "Protocolos"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 11
  {
    title: "Consultoria para Inclusão de Cláusulas Especiais",
    description:
      "Consultoria para inclusão de cláusulas técnicas em contratos (garantias, compliance, tech clauses), com análise de risco e redação específica.",
    price: 0.00,
    image: generateImageUrl("Consultoria para Inclusão de Cláusulas Especiais (GNV ≈ cláusulas especiais)", "contratos", 11),
    category: "contratos",
    features: ["Cláusulas Técnicas", "Compliance", "Redação"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 12
  {
    title: "Alteração de Objeto Contratual (Mutação de Cláusulas)",
    description:
      "Serviço de alteração do objeto social ou escopo contratual, com atualização de atos societários e suporte em registro oficial.",
    price: 0.00,
    image: generateImageUrl("Alteração de Objeto Contratual (Mutação de Cláusulas)", "contratos", 12),
    category: "societario",
    features: ["Alteração Contratual", "Atos Societários", "Registro Oficial"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 13
  {
    title: "Alteração de Representação (Substituição de Responsável)",
    description:
      "Atuação para alterar responsáveis legais por empresas ou contratos, produzindo as declarações e documentos necessários para atualização cadastral.",
    price: 0.00,
    image: generateImageUrl("Alteração de Representação (Substituição de Responsável)", "societario", 13),
    category: "societario",
    features: ["Substituição de Responsável", "Atualização Cadastral", "Documentos"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 14
  {
    title: "Reinício de Prazo Processual",
    description:
      "Pedido de reinício de prazo processual quando cabível, com fundamentação legal, petição específica e acompanhamento do andamento.",
    price: 0.00,
    image: generateImageUrl("Reinício de Prazo Processual", "processual", 14),
    category: "processual",
    features: ["Peticionamento", "Fundamentação", "Acompanhamento"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 15
  {
    title: "Restauração de Documentos e Registros",
    description:
      "Serviço de restauração e regularização de documentos extraviados ou danificados, emissão de certidões e prática dos atos necessários em cartório e órgãos oficiais.",
    price: 0.00,
    image: generateImageUrl("Restauração de Documentos e Registros", "documentos", 15),
    category: "documentos",
    features: ["Restauração", "Segunda Via", "Cartório"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 16
  {
    title: "Autorização para Publicação/Estampagem de Conteúdo",
    description:
      "Emissão e revisão de autorizações e cessões de uso de imagem, contratos de publicidade e termos para publicação de conteúdo.",
    price: 0.00,
    image: generateImageUrl("Autorização para Publicação/Estampagem de Conteúdo (autorização de uso)", "direitos", 16),
    category: "direitos",
    features: ["Cessão de Direitos", "Contrato de Imagem", "Autorização"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 17
  {
    title: "Baixa de Anotação Administrativa",
    description:
      "Atuação para requerer baixa ou esclarecimento de anotações administrativas registradas em cadastros públicos, com levantamento documental e protocolo.",
    price: 0.00,
    image: generateImageUrl("Baixa de Anotação Administrativa (Artigo 270 ≈ anotações)", "administrativo", 17),
    category: "administrativo",
    features: ["Baixa de Anotação", "Protocolo", "Levantamento Documental"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 18
  {
    title: "Encerramento de Atividade (Baixa de Empresa/Filial)",
    description:
      "Assessoria para baixa de CNPJ, encerramento de atividades e regularização final junto a órgãos federais, estaduais e municipais.",
    price: 0.00,
    image: generateImageUrl("Encerramento de Atividade (Baixa de Empresa/Filial)", "empresarial", 18),
    category: "empresarial",
    features: ["Baixa CNPJ", "Encerramento Atividades", "Regularização"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 19
  {
    title: "Remarcação de Cláusulas Contratuais",
    description:
      "Serviço de redrafting para cláusulas que necessitam de remarcação por erro, acordo entre as partes ou alteração de condições técnicas.",
    price: 0.00,
    image: generateImageUrl("Remarcação de Cláusulas Contratuais (Remarcação de Chassi)", "contratos", 19),
    category: "contratos",
    features: ["Redrafting", "Correção de Erro", "Acordo entre Partes"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 20
  {
    title: "Segunda via de Certificado/Etiqueta Jurídica",
    description:
      "Emissão de segunda via de certificados, certidões ou etiquetas judiciais/administrativas com protocolo e encaminhamento ao órgão emissor.",
    price: 0.00,
    image: generateImageUrl("Segunda via de Certificado/Etiqueta Jurídica", "documentos", 20),
    category: "documentos",
    features: ["Segunda Via", "Protocolo", "Emissão"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 21
  {
    title: "Ampliação de Objeto Social",
    description:
      "Assessoria para ampliação do objeto social na documentação societária, com elaboração da alteração contratual e registro em junta/comercial.",
    price: 0.00,
    image: generateImageUrl("Ampliação de Objeto Social (Alongamento de cláusulas)", "societario", 21),
    category: "societario",
    features: ["Alteração Contratual", "Registro Junta", "Objeto Social"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 22
  {
    title: "Inclusão de Novo Sócio / Eixo Diretivo",
    description:
      "Procedimentos para inclusão de sócio, alteração de quadro societário e atualização de documentos com procurações e assinaturas necessárias.",
    price: 0.00,
    image: generateImageUrl("Inclusão de Novo Sócio / Eixo Diretivo", "societario", 22),
    category: "societario",
    features: ["Alteração de Quadro", "Procuração", "Atualização Documental"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 23
  {
    title: "Autorização de Representante (Atos Especiais)",
    description:
      "Emissão de autorizações e procurações específicas para atuação em licitações, transporte escolar/serviços públicos e atos que exigem poderes especiais.",
    price: 0.00,
    image: generateImageUrl("Autorização de Representante (Transporte Escolar ≈ autorização especial)", "representacao", 23),
    category: "representacao",
    features: ["Procuração", "Autorização Especial", "Representação"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 24
  {
    title: "Regularização Operacional - Atos Empresariais",
    description:
      "Pacote de regularização para operações empresariais que exigem licenças específicas (ex.: transporte escolar/serviços regulados), com checklists e protocolo administrativo.",
    price: 0.00,
    image: generateImageUrl("Regularização Operacional - Atos Empresariais (Transporte Escolar ≈ regularização operacional)", "empresarial", 24),
    category: "empresarial",
    features: ["Licenças Especiais", "Checklists", "Protocolo Administrativo"],
    featured: true,
    size: "Único",
    isSmart: false
  },
];

/** ------------------------------------------------------------------------------------------------
 * Utilitários Firestore
 * ------------------------------------------------------------------------------------------------
 */
async function checkProductExists(title) {
  const q = query(collection(db, "products"), where("title", "==", title));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function setupBlasiusProducts() {
  console.log("🧾 Inserindo produtos/serviços (Beto Dehon)...");
  let added = 0, skipped = 0;

  for (const product of BlasiusProducts) {
    const exists = await checkProductExists(product.title);
    if (exists) {
      console.log(`⏭️  Já existe: ${product.title}`);
      skipped++;
    } else {
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: "documento-beto-dehon" // tag opcional para filtro
      };

      const docRef = await addDoc(collection(db, "products"), productData);
      console.log(`✅ Adicionado: ${product.title} (ID: ${docRef.id})`);
      added++;
    }
  }
  console.log(`🎯 Total: ${added} adicionados, ${skipped} ignorados.`);
}

setupBlasiusProducts().catch((error) => {
  console.error("❌ Erro ao inserir produtos:", error);
  process.exit(1);
});
