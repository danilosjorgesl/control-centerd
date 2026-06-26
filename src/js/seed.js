export const SEED = {
  schemaVersion: 3,
  acessoLiberado: false,
  ultimaDataUso: '',
  caixaAtual: 0,
  caixaOntem: 0,
  movimentacoes: [],

  operacao: {
    uberHoje: 0,
    app99Hoje: 0,
    metaHoje: 600,
    kmRodados: 0,
    tempoLigado: '00h 00m',
    consumoMedio: 0,
    autonomia: 0,
    ritmoHora: 0,
    abastecimento: 0,
    checkpoints: [],
  },

  contas: [
    {
      id: "combustivel",
      nome: "Combustível",
      valor: 0,
      vencimento: "uso diário",
      categoria: "Operação",
      critica: true,
      pago: false
    },
    {
      id: "kovi-2026-06-27",
      nome: "Kovi",
      valor: 1035,
      vencimento: "2026-06-27",
      categoria: "Carro",
      critica: true,
      pago: false
    },
    {
      id: "kovi-2026-06-29",
      nome: "Kovi",
      valor: 995,
      vencimento: "2026-06-29",
      categoria: "Carro",
      critica: true,
      pago: false
    },
    {
      id: "unicesumar-2026-07-01",
      nome: "Unicesumar",
      valor: 409.01,
      vencimento: "2026-07-01",
      categoria: "Educação",
      critica: true,
      pago: false
    },
    {
      id: "internet-2026-07-05",
      nome: "Internet",
      valor: 99.90,
      vencimento: "2026-07-05",
      categoria: "Casa",
      critica: true,
      pago: false
    },
    {
      id: "telefone-2026-07-05",
      nome: "Telefone",
      valor: 409,
      vencimento: "2026-07-05",
      categoria: "Telefone",
      critica: true,
      pago: false
    },
    {
      id: "transporte-escolar-2026-07-10",
      nome: "Transporte Escolar",
      valor: 400,
      vencimento: "2026-07-10",
      categoria: "Família",
      critica: true,
      pago: false
    },
    {
      id: "pensao-2026-07-10",
      nome: "Pensão",
      valor: 400,
      vencimento: "2026-07-10",
      categoria: "Família",
      critica: true,
      pago: false
    },
    {
      id: "vivo-2026-07-10",
      nome: "Vivo",
      valor: 150,
      vencimento: "2026-07-10",
      categoria: "Telefone",
      critica: true,
      pago: false
    },
    {
      id: "claro-2026-07-10",
      nome: "Claro",
      valor: 60,
      vencimento: "2026-07-10",
      categoria: "Telefone",
      critica: false,
      pago: false
    },
    {
      id: "agua-2026-07-15",
      nome: "Água",
      valor: 280,
      vencimento: "2026-07-15",
      categoria: "Casa",
      critica: true,
      pago: false
    },
    {
      id: "arc4-2026-07-23",
      nome: "ARC4",
      valor: 39.10,
      vencimento: "2026-07-23",
      categoria: "Sistema",
      critica: false,
      pago: false
    },
    {
      id: "boticario-2026-07-26",
      nome: "Boticário",
      valor: 109.52,
      vencimento: "2026-07-26",
      categoria: "Casa",
      critica: false,
      pago: false
    },
    {
      id: "mercado-2026-07-30",
      nome: "Mercado",
      valor: 500,
      vencimento: "2026-07-30",
      categoria: "Casa",
      critica: true,
      pago: false
    }
  ],

  metas: [
    { id: 1, nome: 'Saldo Robusto', meta: 1000, atual: 0, icone: 'reserva', frase: 'A primeira muralha da liberdade.' },
    { id: 2, nome: 'Reserva R$ 3.000', meta: 3000, atual: 0, icone: 'crescimento', frase: 'A segunda reserva dá conforto.' },
    { id: 3, nome: 'Reserva R$ 5.000', meta: 5000, atual: 0, icone: 'alvo', frase: 'Liberdade começa com proteção.' },
    { id: 4, nome: 'Nome limpo', meta: 1, atual: 0, icone: 'check', frase: 'Limpar o nome abre portas.' },
    { id: 5, nome: 'Carro próprio', meta: 30000, atual: 0, icone: 'carro', frase: 'Teu carro, tua liberdade.' },
    { id: 6, nome: 'Sair da Kovi', meta: 1, atual: 0, icone: 'chave', frase: 'Independência total.' },
  ],

  projetos: [
    {
      id: "garagem",
      nome: "Garagem",
      descricao: "Construir a garagem e organizar a frente da casa.",
      valorMeta: 8000,
      valorAtual: 0,
      categoria: "Casa",
      prioridade: 1
    },
    {
      id: "carro-eletrico",
      nome: "Carro elétrico",
      descricao: "Construir o caminho para sair da dependência da Kovi.",
      valorMeta: 120000,
      valorAtual: 0,
      categoria: "Mobilidade",
      prioridade: 2
    },
    {
      id: "quartos",
      nome: "Quartos",
      descricao: "Melhorar o conforto da família dentro de casa.",
      valorMeta: 10000,
      valorAtual: 0,
      categoria: "Casa",
      prioridade: 3
    },
    {
      id: "churrasqueira",
      nome: "Churrasqueira",
      descricao: "Criar um espaço de descanso e família.",
      valorMeta: 5000,
      valorAtual: 0,
      categoria: "Casa",
      prioridade: 4
    },
    {
      id: "filhos",
      nome: "Filhos",
      descricao: "Construir segurança e oportunidades para os filhos.",
      valorMeta: 10000,
      valorAtual: 0,
      categoria: "Família",
      prioridade: 5
    }
  ],

  diario: {
    abastecimento: 0,
    observacao: '',
    classificacao: '',
  },

  planejamento: [
    { data: '2026-06-27', objetivo: 'Proteger Kovi', necessario: 1035 },
    { data: '2026-06-29', objetivo: 'Proteger segunda Kovi', necessario: 995 },
    { data: '2026-07-01', objetivo: 'Pagar Unicesumar', necessario: 409.01 },
    { data: '2026-07-30', objetivo: 'Fechar Mercado do mês', necessario: 500 },
  ],
};
