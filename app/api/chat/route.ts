
import { openai } from '@ai-sdk/openai'
// Remover import - não existe no projeto atual
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Simulação de resposta até implementar streaming
    const response = {
      message: `Olá! Sou o assistente especializado em serviços jurídicos do Despachante DevTools.
      
      Posso ajudar com:
      - Documentação veicular (CNH, transferências, licenciamentos)
      - Serviços empresariais (abertura de empresa, alvarás)
      - Documentos pessoais (CPF, RG, certidões)
      - Regularização de débitos
      - Processos administrativos
      
      Como posso ajudá-lo hoje?`
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response('Erro interno do servidor', { status: 500 })
  }
}
