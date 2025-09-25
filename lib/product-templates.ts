
// Sistema de templates para documentos necessários por produto jurídico (Santa Catarina)
export interface ProductTemplate {
  id: string
  title: string
  description: string
  documents: string[]
}

export const productTemplates: Record<string, ProductTemplate> = {
  // Serviços Trabalhistas
  "consulta-trabalhista-inicial": {
    id: "consulta-trabalhista-inicial",
    title: "Consulta Trabalhista Inicial",
    description: "Análise preliminar de direitos trabalhistas conforme CLT e legislação catarinense.",
    documents: [
      "CTPS (Carteira de Trabalho)",
      "Contrato de trabalho ou carta de admissão",
      "Últimos 3 holerites",
      "Comprovante de endereço atualizado",
      "RG e CPF",
      "Aviso prévio (se houver)",
      "Termo de rescisão (se aplicável)"
    ]
  },

  // Provas e Testemunhas
  "indicacao-testemunhas-provas": {
    id: "indicacao-testemunhas-provas",
    title: "Indicação de Testemunhas e Provas",
    description: "Orientação para coleta de provas e indicação de testemunhas em processos judiciais.",
    documents: [
      "Procuração ou substabelecimento",
      "RG e CPF das testemunhas",
      "Comprovante de endereço das testemunhas",
      "Documentos probatórios (contratos, e-mails, mensagens)",
      "Declaração das testemunhas",
      "Termo de compromisso das testemunhas"
    ]
  },

  // Sucessório
  "inventario-partilha-assessoria": {
    id: "inventario-partilha-assessoria",
    title: "Inventário e Partilha (Assessoria)",
    description: "Assessoria para inventário judicial ou extrajudicial conforme Código Civil e Lei 11.441/07.",
    documents: [
      "Certidão de óbito",
      "RG e CPF de todos os herdeiros",
      "Comprovante de endereço dos herdeiros",
      "Certidão de casamento do falecido",
      "Certidão de nascimento dos filhos",
      "Testamento (se houver)",
      "Escritura dos bens imóveis",
      "Certidões negativas de débitos (Federal, Estadual, Municipal)",
      "Declaração de última vontade (se aplicável)"
    ]
  },

  // Pareceres Jurídicos
  "emissao-parecer-juridico": {
    id: "emissao-parecer-juridico",
    title: "Emissão de Parecer Jurídico (2ª via)",
    description: "Elaboração de parecer técnico-jurídico com fundamentação doutrinária e jurisprudencial.",
    documents: [
      "Documentos relacionados à questão jurídica",
      "Contratos ou instrumentos relevantes",
      "Correspondências e comunicações",
      "Legislação específica aplicável",
      "Jurisprudência correlata",
      "Procuração do consulente"
    ]
  },

  // Contratos
  "alteracao-contratual-clausulas": {
    id: "alteracao-contratual-clausulas",
    title: "Alteração Contratual (Ajuste de Cláusulas)",
    description: "Revisão e alteração de contratos conforme Código Civil e legislação comercial.",
    documents: [
      "Contrato original",
      "RG e CPF das partes",
      "Comprovante de endereço das partes",
      "Procuração (se houver representantes)",
      "Documentos societários (se pessoa jurídica)",
      "Ata de assembleia autorizativa (se necessário)",
      "Certidões negativas (se pessoa jurídica)"
    ]
  },

  "consultoria-clausulas-especiais": {
    id: "consultoria-clausulas-especiais",
    title: "Consultoria para Inclusão de Cláusulas Especiais",
    description: "Consultoria para inclusão de cláusulas de compliance, garantias e proteção contratual.",
    documents: [
      "Minuta do contrato",
      "Regulamentações específicas do setor",
      "Políticas internas da empresa",
      "Documentos de compliance",
      "Normas técnicas aplicáveis",
      "Procuração para representação"
    ]
  },

  "remarcacao-clausulas-contratuais": {
    id: "remarcacao-clausulas-contratuais",
    title: "Remarcação de Cláusulas Contratuais",
    description: "Redrafting de cláusulas contratuais por erro, acordo ou mudança de condições.",
    documents: [
      "Contrato com cláusulas a serem alteradas",
      "Acordo entre as partes",
      "RG e CPF dos contratantes",
      "Comprovante de endereço atualizado",
      "Procuração (se aplicável)",
      "Justificativa técnica para alteração"
    ]
  },

  // Gravames e Garantias
  "inclusao-garantia-alienacao": {
    id: "inclusao-garantia-alienacao",
    title: "Inclusão de Garantia/Alienação Fiduciária (Orientação)",
    description: "Orientação para inclusão de garantias reais conforme Lei 9.514/97 e CC/2002.",
    documents: [
      "Contrato de financiamento",
      "Escritura do bem",
      "RG e CPF do devedor/fiduciante",
      "Comprovante de endereço",
      "Certidões negativas do bem",
      "Avaliação do bem",
      "Procuração para registro"
    ]
  },

  // Corporate e Societário
  "constituicao-sociedade-registro": {
    id: "constituicao-sociedade-registro",
    title: "Constituição de Sociedade (Primeiro Registro)",
    description: "Constituição de sociedade conforme Lei 10.406/02 e Lei 8.934/94.",
    documents: [
      "RG e CPF dos sócios",
      "Comprovante de endereço dos sócios",
      "Comprovante de endereço da sede",
      "Declaração de desimpedimento",
      "Consulta de viabilidade do nome",
      "Contrato social",
      "FCN (Ficha de Cadastro Nacional)",
      "DBE (Declaração de Beneficiário Efetivo)"
    ]
  },

  "alteracao-objeto-contratual": {
    id: "alteracao-objeto-contratual",
    title: "Alteração de Objeto Contratual (Mutação de Cláusulas)",
    description: "Alteração do objeto social conforme Lei das S.A. e Código Civil.",
    documents: [
      "Contrato social vigente",
      "Ata de assembleia ou reunião",
      "RG e CPF dos sócios",
      "Comprovante de endereço atualizado",
      "Certidões negativas",
      "CNPJ da empresa",
      "Última alteração registrada"
    ]
  },

  "alteracao-representacao-responsavel": {
    id: "alteracao-representacao-responsavel",
    title: "Alteração de Representação (Substituição de Responsável)",
    description: "Alteração de administradores conforme legislação societária.",
    documents: [
      "Contrato social atual",
      "RG e CPF do novo administrador",
      "Comprovante de endereço",
      "Declaração de desimpedimento",
      "Ata de nomeação",
      "Procuração (se aplicável)",
      "Termo de renúncia do administrador anterior"
    ]
  },

  "ampliacao-objeto-social": {
    id: "ampliacao-objeto-social",
    title: "Ampliação de Objeto Social",
    description: "Ampliação das atividades empresariais conforme CNAE e legislação comercial.",
    documents: [
      "Contrato social vigente",
      "Ata de deliberação dos sócios",
      "Consulta CNAE das novas atividades",
      "Certidões negativas atualizadas",
      "Comprovante de endereço da sede",
      "Licenças específicas (se necessário)",
      "Alvará de funcionamento atualizado"
    ]
  },

  "inclusao-novo-socio": {
    id: "inclusao-novo-socio",
    title: "Inclusão de Novo Sócio / Eixo Diretivo",
    description: "Inclusão de sócio conforme Código Civil e legislação societária.",
    documents: [
      "Contrato social vigente",
      "RG e CPF do novo sócio",
      "Comprovante de endereço do novo sócio",
      "Declaração de desimpedimento",
      "Ata de assembleia de aprovação",
      "Instrumento de cessão de quotas (se aplicável)",
      "Comprovante de integralização do capital",
      "Procuração (se necessário)"
    ]
  },

  // Empresarial
  "licenciamento-registros-empresariais": {
    id: "licenciamento-registros-empresariais",
    title: "Licenciamento e Registros Empresariais",
    description: "Regularização de licenças conforme legislação municipal e estadual de SC.",
    documents: [
      "CNPJ da empresa",
      "Contrato social atualizado",
      "Alvará de funcionamento",
      "Licença ambiental (se aplicável)",
      "Auto de vistoria do Corpo de Bombeiros",
      "Certidão de regularidade sanitária",
      "Comprovante de endereço da sede",
      "Planta baixa do estabelecimento"
    ]
  },

  "encerramento-atividade-baixa": {
    id: "encerramento-atividade-baixa",
    title: "Encerramento de Atividade (Baixa de Empresa/Filial)",
    description: "Baixa de CNPJ conforme IN RFB e legislação estadual/municipal.",
    documents: [
      "Ata de dissolução da sociedade",
      "Demonstrações financeiras",
      "Certidões negativas de débitos",
      "DCTF (Declaração de Débitos e Créditos)",
      "Termo de rescisão dos funcionários",
      "Baixa na Previdência Social",
      "Cancelamento de inscrições estaduais/municipais",
      "Comprovante de entrega da RAIS negativa"
    ]
  },

  "regularizacao-operacional-empresarial": {
    id: "regularizacao-operacional-empresarial",
    title: "Regularização Operacional - Atos Empresariais",
    description: "Regularização completa para operações empresariais específicas em SC.",
    documents: [
      "CNPJ e contrato social",
      "Alvarás e licenças operacionais",
      "Certificados técnicos específicos",
      "Comprovantes de regularidade fiscal",
      "Licenças ambientais atualizadas",
      "Registros profissionais (CRC, OAB, etc.)",
      "Certificado de responsabilidade técnica",
      "Apólice de seguro (se exigido)"
    ]
  },

  // Civil
  "acao-indenizacao-sinistro": {
    id: "acao-indenizacao-sinistro",
    title: "Ação de Indenização por Sinistro",
    description: "Ação indenizatória por danos materiais e morais conforme CC/2002.",
    documents: [
      "Boletim de ocorrência",
      "Orçamentos dos danos",
      "Notas fiscais de conserto",
      "Laudo pericial",
      "Fotos dos danos",
      "Comprovante de propriedade",
      "Apólice de seguro",
      "Correspondências com a seguradora",
      "Atestado médico (se danos pessoais)"
    ]
  },

  // Documentos
  "retificacao-documentos-identificadores": {
    id: "retificacao-documentos-identificadores",
    title: "Retificação de Documentos (Remarcação de Identificadores)",
    description: "Retificação de documentos públicos conforme Lei 6.015/73.",
    documents: [
      "Documento original com erro",
      "Certidão atualizada correta",
      "RG e CPF do requerente",
      "Comprovante de endereço",
      "Procuração (se representado)",
      "Documentos comprobatórios da correção",
      "Petição fundamentada",
      "Taxa judiciária (se necessário)"
    ]
  },

  "restauracao-documentos-registros": {
    id: "restauracao-documentos-registros",
    title: "Restauração de Documentos e Registros",
    description: "Restauração de documentos perdidos ou danificados.",
    documents: [
      "Boletim de ocorrência (se perda/roubo)",
      "RG e CPF do titular",
      "Comprovante de endereço",
      "Testemunhas da existência do documento",
      "Cópias ou registros anteriores",
      "Declaração de próprio punho",
      "Procuração (se necessário)",
      "Taxa de emissão"
    ]
  },

  "segunda-via-certificado-etiqueta": {
    id: "segunda-via-certificado-etiqueta",
    title: "Segunda via de Certificado/Etiqueta Jurídica",
    description: "Emissão de segunda via de certificados e documentos oficiais.",
    documents: [
      "Documento de identidade",
      "Comprovante de endereço",
      "Protocolo original (se houver)",
      "Justificativa da necessidade",
      "Procuração (se representado)",
      "Taxa de emissão",
      "Formulário específico do órgão emissor"
    ]
  },

  // Processual
  "reinicio-prazo-processual": {
    id: "reinicio-prazo-processual",
    title: "Reinício de Prazo Processual",
    description: "Pedido de restituição de prazo processual conforme CPC/2015.",
    documents: [
      "Petição inicial ou contestação",
      "Procuração nos autos",
      "Comprovante do fato impeditivo",
      "Jurisprudência de apoio",
      "Certidão dos autos",
      "Substabelecimento (se necessário)",
      "Documentos do impedimento",
      "Memorial descritivo dos fatos"
    ]
  },

  // Representação
  "autorizacao-representante-especiais": {
    id: "autorizacao-representante-especiais",
    title: "Autorização de Representante (Atos Especiais)",
    description: "Autorização para representação em atos específicos conforme CC/2002.",
    documents: [
      "RG e CPF do representante",
      "RG e CPF do representado",
      "Comprovante de endereço de ambos",
      "Procuração específica",
      "Objeto específico da representação",
      "Declaração de capacidade civil",
      "Reconhecimento de firma",
      "Substabelecimento (se aplicável)"
    ]
  },

  // Direitos
  "autorizacao-publicacao-conteudo": {
    id: "autorizacao-publicacao-conteudo",
    title: "Autorização para Publicação/Estampagem de Conteúdo",
    description: "Cessão de direitos autorais e de imagem conforme Lei 9.610/98.",
    documents: [
      "RG e CPF do titular dos direitos",
      "Comprovante de endereço",
      "Descrição detalhada do conteúdo",
      "Termo de cessão de direitos",
      "Registro da obra (se houver)",
      "Contrato de licenciamento",
      "Comprovante de titularidade",
      "Autorização de uso de imagem"
    ]
  },

  // Administrativo
  "baixa-anotacao-administrativa": {
    id: "baixa-anotacao-administrativa",
    title: "Baixa de Anotação Administrativa",
    description: "Baixa de anotações em cadastros públicos conforme Lei 8.429/92.",
    documents: [
      "Certidão da anotação a ser baixada",
      "RG e CPF do interessado",
      "Comprovante de endereço",
      "Documentos comprobatórios da regularização",
      "Procuração (se representado)",
      "Petição fundamentada",
      "Comprovantes de pagamento (se aplicável)",
      "Certidões negativas atualizadas"
    ]
  }
}

// Função para encontrar template baseado no título do produto
export function findProductTemplate(productTitle: string): ProductTemplate | null {
  // Normalizar o título para comparação
  const normalizedTitle = productTitle.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, ' ')    // Normaliza espaços
    .trim()

  // Mapeamento de títulos dos produtos do script/prod.js para templates
  const titleMapping: Record<string, string> = {
    "consulta trabalhista inicial": "consulta-trabalhista-inicial",
    "indicação de testemunhas e provas": "indicacao-testemunhas-provas",
    "indicacao de testemunhas e provas": "indicacao-testemunhas-provas",
    "inventário e partilha assessoria": "inventario-partilha-assessoria",
    "inventario e partilha assessoria": "inventario-partilha-assessoria",
    "emissão de parecer jurídico 2ª via": "emissao-parecer-juridico",
    "emissao de parecer juridico 2ª via": "emissao-parecer-juridico",
    "alteração contratual ajuste de cláusulas": "alteracao-contratual-clausulas",
    "alteracao contratual ajuste de clausulas": "alteracao-contratual-clausulas",
    "inclusão de garantia alienação fiduciária orientação": "inclusao-garantia-alienacao",
    "inclusao de garantia alienacao fiduciaria orientacao": "inclusao-garantia-alienacao",
    "constituição de sociedade primeiro registro": "constituicao-sociedade-registro",
    "constituicao de sociedade primeiro registro": "constituicao-sociedade-registro",
    "licenciamento e registros empresariais": "licenciamento-registros-empresariais",
    "ação de indenização por sinistro": "acao-indenizacao-sinistro",
    "acao de indenizacao por sinistro": "acao-indenizacao-sinistro",
    "retificação de documentos remarcação de identificadores": "retificacao-documentos-identificadores",
    "retificacao de documentos remarcacao de identificadores": "retificacao-documentos-identificadores",
    "consultoria para inclusão de cláusulas especiais": "consultoria-clausulas-especiais",
    "consultoria para inclusao de clausulas especiais": "consultoria-clausulas-especiais",
    "alteração de objeto contratual mutação de cláusulas": "alteracao-objeto-contratual",
    "alteracao de objeto contratual mutacao de clausulas": "alteracao-objeto-contratual",
    "alteração de representação substituição de responsável": "alteracao-representacao-responsavel",
    "alteracao de representacao substituicao de responsavel": "alteracao-representacao-responsavel",
    "reinício de prazo processual": "reinicio-prazo-processual",
    "reinicio de prazo processual": "reinicio-prazo-processual",
    "restauração de documentos e registros": "restauracao-documentos-registros",
    "restauracao de documentos e registros": "restauracao-documentos-registros",
    "autorização para publicação estampagem de conteúdo": "autorizacao-publicacao-conteudo",
    "autorizacao para publicacao estampagem de conteudo": "autorizacao-publicacao-conteudo",
    "baixa de anotação administrativa": "baixa-anotacao-administrativa",
    "baixa de anotacao administrativa": "baixa-anotacao-administrativa",
    "encerramento de atividade baixa de empresa filial": "encerramento-atividade-baixa",
    "remarcação de cláusulas contratuais": "remarcacao-clausulas-contratuais",
    "remarcacao de clausulas contratuais": "remarcacao-clausulas-contratuais",
    "segunda via de certificado etiqueta jurídica": "segunda-via-certificado-etiqueta",
    "segunda via de certificado etiqueta juridica": "segunda-via-certificado-etiqueta",
    "ampliação de objeto social": "ampliacao-objeto-social",
    "ampliacao de objeto social": "ampliacao-objeto-social",
    "inclusão de novo sócio eixo diretivo": "inclusao-novo-socio",
    "inclusao de novo socio eixo diretivo": "inclusao-novo-socio",
    "autorização de representante atos especiais": "autorizacao-representante-especiais",
    "autorizacao de representante atos especiais": "autorizacao-representante-especiais",
    "regularização operacional atos empresariais": "regularizacao-operacional-empresarial",
    "regularizacao operacional atos empresariais": "regularizacao-operacional-empresarial"
  }

  // Buscar correspondência direta no mapeamento
  const templateId = titleMapping[normalizedTitle]
  if (templateId && productTemplates[templateId]) {
    return productTemplates[templateId]
  }

  // Buscar correspondência exata primeiro
  for (const template of Object.values(productTemplates)) {
    const normalizedTemplateTitle = template.title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    if (normalizedTitle === normalizedTemplateTitle) {
      return template
    }
  }

  // Buscar correspondência parcial por palavras-chave
  const keywordMatches: Record<string, string[]> = {
    "consulta-trabalhista-inicial": ["consulta", "trabalhista", "inicial"],
    "indicacao-testemunhas-provas": ["indicação", "testemunhas", "provas"],
    "inventario-partilha-assessoria": ["inventário", "partilha", "assessoria", "herança"],
    "emissao-parecer-juridico": ["parecer", "jurídico", "emissão", "via"],
    "alteracao-contratual-clausulas": ["alteração", "contratual", "cláusulas", "ajuste"],
    "inclusao-garantia-alienacao": ["garantia", "alienação", "fiduciária"],
    "constituicao-sociedade-registro": ["constituição", "sociedade", "registro"],
    "licenciamento-registros-empresariais": ["licenciamento", "registros", "empresariais"],
    "acao-indenizacao-sinistro": ["indenização", "sinistro", "ação"],
    "retificacao-documentos-identificadores": ["retificação", "documentos", "identificadores"],
    "consultoria-clausulas-especiais": ["consultoria", "cláusulas", "especiais"],
    "alteracao-objeto-contratual": ["alteração", "objeto", "contratual"],
    "alteracao-representacao-responsavel": ["alteração", "representação", "responsável"],
    "reinicio-prazo-processual": ["reinício", "prazo", "processual"],
    "restauracao-documentos-registros": ["restauração", "documentos", "registros"],
    "autorizacao-publicacao-conteudo": ["autorização", "publicação", "conteúdo"],
    "baixa-anotacao-administrativa": ["baixa", "anotação", "administrativa"],
    "encerramento-atividade-baixa": ["encerramento", "atividade", "baixa"],
    "remarcacao-clausulas-contratuais": ["remarcação", "cláusulas", "contratuais"],
    "segunda-via-certificado-etiqueta": ["segunda", "via", "certificado", "etiqueta"],
    "ampliacao-objeto-social": ["ampliação", "objeto", "social"],
    "inclusao-novo-socio": ["inclusão", "novo", "sócio", "eixo"],
    "autorizacao-representante-especiais": ["autorização", "representante", "especiais"],
    "regularizacao-operacional-empresarial": ["regularização", "operacional", "empresariais"]
  }

  // Encontrar melhor correspondência por palavras-chave
  let bestMatch: { templateId: string; score: number } | null = null

  for (const [templateId, keywords] of Object.entries(keywordMatches)) {
    let score = 0
    for (const keyword of keywords) {
      if (normalizedTitle.includes(keyword.toLowerCase())) {
        score++
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { templateId, score }
    }
  }

  if (bestMatch) {
    return productTemplates[bestMatch.templateId] || null
  }

  return null
}

// Função para obter documentos baseado no produto do carrinho
export function getDocumentsForCartItem(item: any): string[] {
  // Primeiro tenta usar o template baseado no título
  const template = findProductTemplate(item.title)
  if (template) {
    return template.documents
  }

  // Se tem features definidas, usa elas
  if (item.features && Array.isArray(item.features) && item.features.length > 0) {
    return item.features
  }

  // Fallback para documentos padrão jurídicos
  return [
    "RG e CPF",
    "Comprovante de endereço atualizado",
    "Procuração (se representado)",
    "Documentos específicos do caso"
  ]
}
