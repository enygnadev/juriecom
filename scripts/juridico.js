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

// Mapeamento de URLs específicas para cada produto
const productImages = {
  "Transferência de veículo (compra e venda)": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Indicação de condutor": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop",
  "Transferência de veículo (herança/inventário)": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
  "2ª via do CRV": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
  "Troca de placa para Mercosul": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=400&fit=crop",
  "Inclusão de alienação": "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=400&fit=crop",
  "Primeiro emplacamento": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",
  "Licenciamento anual": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Baixa de sinistro": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Remarcação de motor": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Inclusão de GNV": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop",
  "Alteração de carroceria": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Alteração de motor": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Reinício de hodômetro": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Restauração de hodômetro": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
  "Autorização de estampagem": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=400&fit=crop",
  "Baixa do Artigo 270": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Baixa de veículo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  "Remarcação de chassi": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=400&fit=crop",
  "Segunda via de etiqueta": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
  "Alongamento de chassi": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Inclusão de segundo eixo direcional": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=400&fit=crop",
  "Autorização de condutor (Transporte Escolar)": "https://simoesfilhofm.com.br/wp-content/uploads/2023/01/escolares-glr-08-800x445.jpg",
  "Transporte Escolar (veículo)": "https://simoesfilhofm.com.br/wp-content/uploads/2023/01/escolares-glr-08-800x445.jpg"
}

// Função para obter URL da imagem baseada no título
function generateImageUrl(title, category, index) {
  return productImages[title] || `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=600&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&title=${title}&category=${category}`;
}

/**
 * =======================================================================================
 * PRODUTOS (SERVIÇOS) — derivados do documento "DOCUMENTOS BETO DEHON - Página 1"
 * Mantém a estrutura do e-commerce; valores de price estão como 0.00 (defina depois).
 * =======================================================================================
 */
const BlasiusProducts = [
  // Transferência de veículo (compra e venda)
  {
    title: "Transferência de veículo (compra e venda)",
    description:
      "Documentos: CRV/ATPV (se aplicável), CRLV, CNH, Comprovante de residência, Vistoria aprovada. Fluxo: verificar documentos, indicar local de vistoria, abrir processo no Detrannet, enviar para conferência.",
    price: 0.00,
    image: generateImageUrl("Transferência de veículo compra e venda", "transferencia", 1),
    category: "transferencia",
    features: ["CRV/ATPV", "CRLV", "CNH", "Comprovante de residência", "Vistoria aprovada"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Indicação de condutor (multa)
  {
    title: "Indicação de condutor",
    description:
      "Documentos: Requerimento, CNH do proprietário e CNH do infrator. Passos: verificar documentos, abrir processo no Detrannet, remeter para conferência.",
    price: 0.00,
    image: generateImageUrl("Indicação de condutor", "multas", 2),
    category: "multas",
    features: ["Requerimento", "CNH Proprietário", "CNH Infrator"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Transferência de veículo (herança/inventário)
  {
    title: "Transferência de veículo (herança/inventário)",
    description:
      "Documentos: Formal de partilha/Sentença (judicial) OU Inventário autenticado (cartório), documentos dos herdeiros (CNH e comprovante de residência), CRV (ou solicitar nº), Vistoria aprovada. Passos: solicitar nº de CRV, cadastro de sociedade (havendo mais de 1 herdeiro), abrir no Detrannet, concluir conforme análise.",
    price: 0.00,
    image: generateImageUrl("Transferência de veículo herança inventário", "transferencia", 3),
    category: "transferencia",
    features: ["Formal de Partilha/Sentença", "Inventário", "CNH Herdeiros", "Comprovante de residência", "CRV", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // 2ª via do CRV
  {
    title: "2ª via do CRV",
    description:
      "Documentos: CNH, (Comprovante de residência — não obrigatório), Requerimento assinado, CRLV, Vistoria aprovada. Passos: requerer 2ª via, indicar vistoria, abrir no Detrannet, enviar para conferência.",
    price: 0.00,
    image: generateImageUrl("2a via do CRV", "documentos", 4),
    category: "documentos",
    features: ["CNH", "CRLV", "Requerimento", "Comprovante de residência (opcional)", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Troca de placa para Mercosul
  {
    title: "Troca de placa para Mercosul",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria aprovada. Observação: se reprovar, regularizar e refazer vistoria.",
    price: 0.00,
    image: generateImageUrl("Troca de placa Mercosul", "placas", 5),
    category: "placas",
    features: ["CRV", "CRLV", "CNH", "Comprovante de residência", "Requerimento", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Inclusão de alienação
  {
    title: "Inclusão de alienação",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência. Observação: alguns bancos liberam direto no sistema; conferir antes.",
    price: 0.00,
    image: generateImageUrl("Inclusão de alienação", "gravames", 6),
    category: "gravames",
    features: ["CRV", "CRLV", "CNH", "Comprovante de residência"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Primeiro emplacamento
  {
    title: "Primeiro emplacamento",
    description:
      "Documentos: Nota fiscal, CNH, Comprovante de residência, Foto do motor e do chassi (em reboques: CAT e foto do reboque). Se empresa: contrato social e CNPJ.",
    price: 0.00,
    image: generateImageUrl("Primeiro emplacamento", "emplacamento", 7),
    category: "emplacamento",
    features: ["Nota Fiscal", "CNH", "Comprovante de residência", "Fotos Motor/Chassi", "CAT (reboque)", "Contrato Social/CNPJ (empresa)"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Licenciamento anual
  {
    title: "Licenciamento anual",
    description:
      "Documentos: CNH do proprietário. Observação: em alguns estados, pode ser feito online.",
    price: 0.00,
    image: generateImageUrl("Licenciamento anual", "licenciamento", 8),
    category: "licenciamento",
    features: ["CNH", "Possibilidade online (alguns estados)"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Baixa de sinistro (média/alta monta — conforme caso)
  {
    title: "Baixa de sinistro",
    description:
      "Documentos: BO de sinistro, CRV, CRLV, CNH, Comprovante de residência, Notas fiscais do conserto, Termo de ciência de CSV, Inmetro e Vistoria. Fluxo: solicitar autorização no Inmetro; depois processo segue ao Detran para conclusão.",
    price: 0.00,
    image: generateImageUrl("Baixa de sinistro", "baixa", 9),
    category: "baixa",
    features: ["BO Sinistro", "CRV", "CRLV", "CNH", "Comprovante", "NF Conserto", "Termo CSV", "Inmetro", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Remarcação de motor
  {
    title: "Remarcação de motor",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria reprovada, Laudo + NF da remarcação.",
    price: 0.00,
    image: generateImageUrl("Remarcação de motor", "remarcacao", 10),
    category: "remarcacao",
    features: ["CRV", "CRLV", "CNH", "Comprovante de residência", "Requerimento", "Vistoria reprovada", "Laudo e NF remarcação"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Inclusão de GNV
  {
    title: "Inclusão de GNV",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, NF da instalação, Atestado de qualidade, Inmetro e Vistoria aprovada. Fluxo: autorização Inmetro → execução → conclusão em escritório.",
    price: 0.00,
    image: generateImageUrl("Inclusão de GNV", "combustivel", 11),
    category: "combustivel",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "NF Instalação", "Atestado Qualidade", "Inmetro", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Alteração de carroceria
  {
    title: "Alteração de carroceria",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Nota fiscal, CAT (nota > 2002), Inmetro e Vistoria. Fluxo: autorização Inmetro; em doação, requerimento autenticado.",
    price: 0.00,
    image: generateImageUrl("Alteração de carroceria", "carroceria", 12),
    category: "carroceria",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "NF", "CAT (pós-2002)", "Inmetro", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Alteração de motor
  {
    title: "Alteração de motor",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento autenticado, Nota Fiscal, Vistoria. NF deve conter: número do motor, potência, cilindrada, combustível, marca e, se usado, placa de origem (ou cadeia completa de notas até o proprietário).",
    price: 0.00,
    image: generateImageUrl("Alteração de motor", "motor", 13),
    category: "motor",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Req. autenticado", "NF com dados técnicos", "Vistoria"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Reinício de hodômetro
  {
    title: "Reinício de hodômetro",
    description:
      "Documentos: CRV, CRLV, CNH do vendedor e do comprador, Comprovante de residência, Declaração assinada pelo vendedor. Fluxo: pedido ao Detran → vistoria aprovada → conclusão no escritório.",
    price: 0.00,
    image: generateImageUrl("Reinício de hodometro", "hodometro", 14),
    category: "hodometro",
    features: ["CRV", "CRLV", "CNH vendedor", "CNH comprador", "Comprovante", "Declaração vendedor"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Restauração de hodômetro
  {
    title: "Restauração de hodômetro",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Nota fiscal, Laudo de restauração. Fluxo: pedido ao Detran → restauração → vistoria → conclusão.",
    price: 0.00,
    image: generateImageUrl("Restauração de hodometro", "hodometro", 15),
    category: "hodometro",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "NF", "Laudo de restauração"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Autorização de estampagem (placa)
  {
    title: "Autorização de estampagem",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado (informar dianteira/traseira), BO (perda) ou foto (má conservação). Solicitação por e-mail.",
    price: 0.00,
    image: generateImageUrl("Autorização de estampagem", "placas", 16),
    category: "placas",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "BO/Fotos"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Baixa do Art. 270
  {
    title: "Baixa do Artigo 270",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento de esclarecimento do motivo, Vistoria aprovada e NF do item administrativo, seguido de requerimento para baixa administrativa.",
    price: 0.00,
    image: generateImageUrl("Baixa do Artigo 270", "baixa", 17),
    category: "baixa",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "Vistoria", "NF item administrativo"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Baixa de veículo
  {
    title: "Baixa de veículo",
    description:
      "Documentos: CRV, CNH, Comprovante de residência, Requerimento, Recorte de chassi, Par de placas.",
    price: 0.00,
    image: generateImageUrl("Baixa de veículo", "baixa", 18),
    category: "baixa",
    features: ["CRV", "CNH", "Comprovante", "Requerimento", "Recorte de chassi", "Par de placas"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Remarcação de chassi
  {
    title: "Remarcação de chassi",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria reprovada, Nota fiscal e laudo da remarcação. Fluxo: autorização Detran → remarcação → conclusão.",
    price: 0.00,
    image: generateImageUrl("Remarcação de chassi", "remarcacao", 19),
    category: "remarcacao",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "Vistoria reprovada", "NF + Laudo"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Segunda via de etiqueta
  {
    title: "Segunda via de etiqueta",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria reprovada. Fluxo: ofício ao Detran → vistoria aprovada → conclusão (pode ficar ADM até chegarem as etiquetas).",
    price: 0.00,
    image: generateImageUrl("Segunda via de etiqueta", "etiquetas", 20),
    category: "etiquetas",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "Vistoria reprovada"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Alongamento de chassi
  {
    title: "Alongamento de chassi",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria aprovada, CSV e Nota fiscal. Fluxo: autorização Inmetro → Inmetro + vistoria → conclusão no escritório.",
    price: 0.00,
    image: generateImageUrl("Alongamento de chassi", "carroceria", 21),
    category: "carroceria",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "Vistoria", "CSV", "NF"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Inclusão de segundo eixo direcional
  {
    title: "Inclusão de segundo eixo direcional",
    description:
      "Documentos: CRV, CRLV, CNH, Comprovante de residência, Requerimento assinado, Vistoria aprovada, CSV e Nota fiscal.",
    price: 0.00,
    image: generateImageUrl("Inclusão de segundo eixo direcional", "eixos", 22),
    category: "eixos",
    features: ["CRV", "CRLV", "CNH", "Comprovante", "Requerimento", "Vistoria", "CSV", "NF"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Autorização de condutor para transporte escolar
  {
    title: "Autorização de condutor (Transporte Escolar)",
    description:
      "Documentos: CRV, Documento de andar, Antecedentes criminais, Termo da prefeitura, CSIVE (semestral), Requerimento, Contrato social, CNPJ, Alvará, Cronotacógrafo, Certificados condutores, CNH + comprovantes de residência, Consulta de infrações, DARE (receita 2135/classe 2433).",
    price: 0.00,
    image: generateImageUrl("Autorização de condutor Transporte Escolar", "escolar", 23),
    category: "escolar",
    features: ["CRV", "Documento de andar", "Antecedentes", "Termo prefeitura", "CSIVE", "Requerimento", "Contrato Social", "CNPJ", "Alvará", "Cronotacógrafo", "Certificados", "CNH + residência", "Consulta infrações", "DARE 2135/2433"],
    featured: false,
    size: "Único",
    isSmart: false
  },

  // Transportes escolares (veículo)
  {
    title: "Transporte Escolar (veículo)",
    description:
      "Documentos: CRV, CRLV, Contrato social, CNPJ, CNH de quem assina pela empresa, Laudo de Transporte Escolar (LTE/inspeção), Autorização de funcionamento emitida pela Prefeitura do município do emplacamento.",
    price: 0.00,
    image: generateImageUrl("Transporte Escolar veículo", "escolar", 24),
    category: "escolar",
    features: ["CRV", "CRLV", "Contrato Social", "CNPJ", "CNH do responsável", "LTE (inspeção)", "Autorização Prefeitura"],
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