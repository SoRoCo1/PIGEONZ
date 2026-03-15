export type Lang = 'pt' | 'en' | 'es' | 'zh';

export interface Translations {
  nav: {
    services: string;
    howItWorks: string;
    pricing: string;
    templates: string;
    contact: string;
  };
  hero: {
    badge: string;
    typed: string;
    subHeadline: string;
    subtitle: string;
    subtitleHighlight: string;
    ctaPricing: string;
    ctaContact: string;
  };
  whoWeAre: {
    commentLabel: string;
    title: string;
    subtitle: string;
    items: Array<{
      icon: string;
      title: string;
      desc: string;
    }>;
    closing: string;
  };
  services: {
    commentLabel: string;
    title: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  how: {
    commentLabel: string;
    title: string;
    steps: Array<{
      title: string;
      desc: string;
    }>;
  };
  pricing: {
    commentLabel: string;
    title: string;
    subtitle: string;
    footnote: string;
    plans: Array<{
      name: string;
      tag: string;
      price: string;
      priceNote: string;
      badge: string | null;
      cta: string;
      features: string[];
    }>;
  };
  contact: {
    commentLabel: string;
    title: string;
    subtitle: string;
    labels: {
      name: string;
      whatsapp: string;
      email: string;
      business: string;
      message: string;
    };
    placeholders: {
      name: string;
      whatsapp: string;
      email: string;
      message: string;
    };
    businessOptions: Array<{ value: string; label: string }>;
    security: string;
    submit: string;
    submitting: string;
    errors: {
      nameShort: string;
      emailInvalid: string;
      messageShort: string;
    };
    toast: {
      success: string;
      error: string;
    };
  };
  chat: {
    bubbleLine1: string;
    bubbleLine2: string;
    greeting: string;
    placeholder: string;
    errorConnection: string;
    title: string;
  };
  footer: {
    tagline: string;
    nav: {
      title: string;
      services: string;
      howItWorks: string;
      pricing: string;
      contact: string;
    };
    contact: {
      title: string;
      cta: string;
    };
    stack: {
      title: string;
      categories: Array<{ label: string; items: string[] }>;
    };
    copyright: string;
    madeWith: string;
  };
  login: {
    title: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    signUp: string;
    tagline: string;
    quickFill: string;
  };
  painel: {
    welcome: string;
    loading: string;
    tabs: { site: string; edit: string; templates: string; support: string; payments: string };
    status: { active: string; pending: string };
    save: string;
    saving: string;
    saved: string;
    logout: string;
    backToSite: string;
    logo: string;
    uploadLogo: string;
    changeLogo: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBg: string;
    uploadBg: string;
    changeBg: string;
    noBg: string;
    phone: string;
    address: string;
    hours: string;
    colors: string;
    primary: string;
    accent: string;
  };
  behindCode: {
    title: string;
    subtitle: string;
    steps: {
      icon: string;
      title: string;
      desc: string;
      backLines: string[];
    }[];
    registroBr: {
      title: string;
      desc: string;
      cta: string;
    };
    closing: string;
  };
  aboutDev: {
    title: string;
    bio1: string;
    bio1Psychology: string;
    bio1CompSci: string;
    bio2: string;
    bio3pre: string;
    bio3mid: string;
    bio3post: string;
    teubaldoDesc: string;
  };
  templates: {
    title: string;
    seeMore: string;
    collapse: string;
    cta: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
  };
  tplContent: {
    lawfirm: {
      lawOffice: string; tagline: string; freeConsult: string;
      specialties: string; practiceAreas: string;
      area1: string; area1d: string; area2: string; area2d: string;
      area3: string; area3d: string; area4: string; area4d: string;
      area5: string; area5d: string; area6: string; area6d: string;
      whyUs: string; proven: string; years: string; cases: string; satisfaction: string;
      ourTeam: string; lawyers: string;
      l1: string; l1lic: string; l1area: string;
      l2: string; l2lic: string; l2area: string;
      l3: string; l3lic: string; l3area: string;
      testimonials: string; whatClients: string; testimonial1: string; testimonial1Author: string;
      need: string; legalHelp: string; ctaSub: string; schedule: string;
      address: string; phone: string;
    };
    fitpulse: {
      welcome: string; myWorkout: string; today: string;
      workout1: string; workout1Meta: string; startWorkout: string;
      workoutsMonth: string; kcal: string; weeklyProgress: string;
      exercise: string; benchPress: string; setsLeft: string;
      reps: string; load: string; rest: string;
      completeSeries: string; skip: string;
      plans: string; choosePlan: string;
      free: string; f1a: string; f1b: string;
      f2a: string; f2b: string; f2c: string;
      f3a: string; f3b: string; f3c: string;
      planPro: string; weight: string; height: string;
      achievements: string; a1: string; a2: string; a3: string;
      tagline: string;
    };
    petvida: {
      hello: string; myPets: string;
      dogBreed: string; dogAlert: string; catBreed: string; catAlert: string;
      vaccines: string; bath: string; appointment: string; shop: string;
      schedule: string; chooseService: string;
      s1: string; s1t: string; s2: string; s2t: string;
      s3: string; s3t: string; s4: string; s4t: string;
      petShop: string; delivery: string; dailyOffer: string; offerText: string; useCode: string;
      p1: string; p2: string; p3: string; p4: string;
      profile: string; vacCard: string; flu: string; rabies: string;
      nextAppt: string; bathLabel: string; tomorrowTime: string;
      vaccineLabel: string; vaccineTime: string;
      tagline: string;
    };
    uaifood: {
      fastDelivery: string; address: string; search: string;
      cat1: string; cat2: string; cat3: string; cat4: string;
      prod1: string; prod1Time: string; prod1Fee: string;
      prod2: string; prod2Time: string;
      localProd: string;
      dish1: string; dish1d: string; dish2: string; dish2d: string;
      dish3: string; dish3d: string; dish4: string; dish4d: string;
      tracking: string; onWay: string; arrives: string;
      step1: string; step2: string; step3: string; step4: string;
      coupons: string; saveCoupon: string;
      c1code: string; c1desc: string; c1min: string;
      c2code: string; c2desc: string; c2min: string;
      c3code: string; c3desc: string; c3min: string;
      useBtn: string; subtitle: string;
      feat1: string; feat2: string; feat3: string;
    };
    cards: {
      cafe: string; cafeD: string;
      tattoo: string; tattooD: string;
      astral: string; astralD: string;
      law: string; lawD: string;
      fitpulse: string; fitpulseD: string;
      petvida: string; petvidaD: string;
      uaifood: string; uaifoodD: string;
    };
    /** Web template content */
    cafe: {
      title: string; subtitle: string; cta: string;
      phone: string; address: string; hours: string;
      feat1: string; feat1d: string; feat2: string; feat2d: string;
      prod1: string; prod1d: string; prod2: string; prod2d: string;
      about: string; aboutText: string;
    };
    joias: {
      title: string; subtitle: string; cta: string;
      phone: string; address: string; hours: string;
      stats: string; s1: string; s2: string; s3: string;
      prod1: string; prod1d: string; prod2: string; prod2d: string;
      about: string; aboutText: string;
    };
    tech: {
      title: string; subtitle: string; cta: string;
      phone: string; address: string;
      feat1: string; feat1d: string; feat2: string; feat2d: string;
      prod1: string; prod1d: string; prod2: string; prod2d: string;
      banner: string; bannerText: string; bannerBtn: string;
    };
    barber: {
      title: string; subtitle: string; cta: string;
      phone: string; address: string; hours: string;
      stats: string; s1: string; s2: string; s3: string;
      prod1: string; prod1d: string; prod2: string; prod2d: string;
      svc1: string; svc1d: string; svc2: string; svc2d: string; svc3: string; svc3d: string;
      about: string; aboutText: string;
    };
    tattooboo: {
      studioTag: string; bookSession: string;
      portfolio: string; ourWork: string;
      specialties: string; styles: string;
      s1: string; s1d: string; s2: string; s2d: string; s3: string; s3d: string;
      s4: string; s4d: string; s5: string; s5d: string; s6: string; s6d: string;
      team: string; artists: string;
      investment: string; prices: string;
      p1: string; p1size: string; p1price: string; p1d: string;
      p2: string; p2size: string; p2price: string; p2d: string;
      p3: string; p3size: string; p3price: string; p3d: string;
      ctaTitle: string; ctaSub: string; ctaBtn: string;
    };
    astralbike: {
      heroTitle1: string; heroTitle2: string;
      heroDesc: string; seePlans: string;
      noSub: string; cancelAnytime: string;
      stat1: string; stat2: string; stat3: string; stat4: string;
      whereWeAre: string;
      countryBR: string; countryAR: string; countryCL: string; countryCO: string;
      whyTitle: string;
      f1: string; f1d: string; f2: string; f2d: string; f3: string; f3d: string;
      f4: string; f4d: string; f5: string; f5d: string; f6: string; f6d: string;
      howTitle: string;
      h1: string; h1d: string; h2: string; h2d: string; h3: string; h3d: string;
      ctaTitle: string; ctaSub: string;
    };
  };
}

const translations: Record<Lang, Translations> = {
  pt: {
    nav: {
      services: "Serviços",
      howItWorks: "Como funciona",
      pricing: "Planos",
      templates: "Portfólio",
      contact: "Contato",
    },
    hero: {
      badge: "FULLSTACK STUDIO",
      typed: "Sites que voam.",
      subHeadline: "AI First.",
      subtitle: "Desenvolvimento fullstack para micro e médio empreendedor. Sites bonitos e funcionais, aplicativos mobile e softwares sob medida que",
      subtitleHighlight: "realmente convertem",
      ctaPricing: "Ver planos",
      ctaContact: "Entre em contato",
    },
    whoWeAre: {
      commentLabel: "// QUEM SOMOS",
      title: "O que a gente faz?",
      subtitle: "A gente transforma a sua ideia em algo real na internet. Sem complicação, sem enrolação.",
      items: [
        {
          icon: "🛒",
          title: "Loja online pra vender seus produtos",
          desc: "Quer vender roupas, doces, artesanato ou qualquer coisa? A gente cria sua loja completa com carrinho, pagamento por Pix e cartão, e tudo organizado pra você gerenciar.",
        },
        {
          icon: "📱",
          title: "Aplicativo pro celular",
          desc: "Seu negócio na palma da mão do cliente. Cardápio digital, agendamento, catálogo de produtos — funciona no Android e no iPhone.",
        },
        {
          icon: "🌐",
          title: "Site profissional pro seu negócio",
          desc: "Aquele site bonito que passa confiança. Com suas cores, sua logo, informações de contato e tudo que o cliente precisa pra te encontrar no Google.",
        },
        {
          icon: "🤖",
          title: "Atendimento automático com inteligência artificial",
          desc: "Um chatbot que responde seus clientes 24h, tira dúvidas, envia orçamentos e agenda serviços — enquanto você descansa.",
        },
        {
          icon: "📊",
          title: "Painel pra você acompanhar tudo",
          desc: "Nada de ficar perdido. Você vê quantas pessoas visitaram seu site, quantas compraram, e o que está funcionando melhor.",
        },
        {
          icon: "☁️",
          title: "Plataformas SaaS e sistemas sob medida",
          desc: "Sua empresa precisa de um sistema próprio? A gente desenvolve plataformas completas — SaaS, painéis administrativos, integrações com APIs, automações e tudo que sua operação precisa pra escalar.",
        },
      ],
      closing: "Do microempreendedor à empresa que quer escalar — a gente faz a tecnologia funcionar pro seu negócio.",
    },
    services: {
      commentLabel: "// O QUE A PIGEONZ FAZ",
      title: "Serviços",
      items: [
        {
          title: "Sites & Landing Pages",
          desc: "Presença digital que gera credibilidade. Design moderno, responsivo e otimizado para conversão.",
        },
        {
          title: "E-commerce Completo",
          desc: "Loja virtual com carrinho, checkout e integração com provedores de pagamento direto no seu CNPJ.",
        },
        {
          title: "Sistemas & Dashboards",
          desc: "Painéis admin, CRMs, ERPs e sistemas sob medida com API robusta e banco de dados estruturado.",
        },
        {
          title: "IA & Chatbots",
          desc: "Bot de atendimento com Claude/GPT, triagem automática, FAQ inteligente. Seu negócio nunca para.",
        },
        {
          title: "Integrações & APIs",
          desc: "Conectamos qualquer sistema. Webhooks, OAuth, ERPs, CRMs, marketplaces e o que precisar.",
        },
        {
          title: "Cloud & Infraestrutura",
          desc: "Deploy no Google Cloud, AWS, entre outros. Escalável do zero ao milhão de requests.",
        },
        {
          title: "Segurança & Proteção",
          desc: "Headers de segurança, rate limiting, HTTPS, proteção contra XSS, CSRF e injeção. Seu projeto blindado.",
        },
      ],
    },
    how: {
      commentLabel: "// COMO FUNCIONA",
      title: "Processo",
      steps: [
        {
          title: "Você conta seu negócio",
          desc: "A gente entende profundamente o que você precisa, quem é seu cliente e qual resultado você quer alcançar.",
        },
        {
          title: "Planejamos juntos",
          desc: "Proposta clara com escopo, prazo e preço. Sem surpresas. Você aprova antes de começar.",
        },
        {
          title: "A gente constrói",
          desc: "Desenvolvimento com stack moderna. Você acompanha cada etapa em tempo real.",
        },
        {
          title: "Você cresce",
          desc: "Site no ar, suporte garantido e evolução contínua. O pombo não abandona o ninho.",
        },
      ],
    },
    pricing: {
      commentLabel: "// INVESTIMENTO",
      title: "Planos",
      subtitle: "Valores transparentes. Parcelas disponíveis.",
      footnote: "* Parcelas disponíveis.",
      plans: [
        {
          name: "Starter",
          tag: "Para começar",
          price: "R$ 2.567",
          priceNote: "pacote completo",
          badge: null,
          cta: "Contratar",
          features: [
            "Página profissional do seu negócio",
            "Template pronto adaptado pra você",
            "Design personalizado com sua identidade",
            "Aparece no Google",
            "Botão de contato via e-mail ou WhatsApp",
            "1 mês de suporte incluído",
          ],
        },
        {
          name: "Pro",
          tag: "Mais popular ★",
          price: "R$ 5.123",
          priceNote: "pacote completo",
          badge: "★ MAIS POPULAR",
          cta: "Contratar",
          features: [
            "Tudo do plano Starter",
            "Site pronto em produção",
            "Design mais completo e elaborado",
            "Várias páginas e abas",
            "Integração de API de pagamentos (PIX, cartão...)",
            "Blog para postar conteúdo",
            "2 meses de suporte incluído",
          ],
        },
        {
          name: "Enterprise",
          tag: "Sob medida",
          price: "A combinar",
          priceNote: "projeto complexo",
          badge: null,
          cta: "Contato comercial",
          features: [
            "Projeto feito do zero pro seu negócio",
            "API de pagamento completa (PIX, cartão, boleto)",
            "Checkout customizado, webhooks e split",
            "Mobile app nativo (iOS & Android)",
            "Inteligência artificial personalizada",
            "Conecta com qualquer sistema",
            "Estrutura robusta e escalável",
            "Suporte dedicado",
          ],
        },
      ],
    },
    contact: {
      commentLabel: "// VAMOS CONVERSAR",
      title: "Entre em contato",
      subtitle: "Respondo em até 24 horas.",
      labels: {
        name: "Nome *",
        whatsapp: "WhatsApp",
        email: "E-mail *",
        business: "Seu negócio",
        message: "Mensagem *",
      },
      placeholders: {
        name: "Seu nome",
        whatsapp: "(00) 00000-0000",
        email: "seu@email.com",
        message: "Me conta um pouco sobre o seu projeto...",
      },
      businessOptions: [
        { value: "", label: "Selecione..." },
        { value: "landing", label: "Landing page / Site institucional" },
        { value: "ecommerce", label: "E-commerce / Loja virtual" },
        { value: "sistema", label: "Sistema / Painel admin" },
        { value: "ia", label: "Chatbot / IA" },
        { value: "outro", label: "Outro" },
      ],
      security: "Conexão segura · Dados protegidos · HTTPS",
      submit: "▸ Enviar mensagem",
      submitting: "Enviando...",
      errors: {
        nameShort: "Nome muito curto",
        emailInvalid: "E-mail inválido",
        messageShort: "Mensagem muito curta (mínimo 10 caracteres)",
      },
      toast: {
        success: "Mensagem enviada! O pombo já foi entregar. 🐦",
        error: "Erro ao enviar. Tente novamente ou mande WhatsApp!",
      },
    },
    chat: {
      bubbleLine1: "Tem dúvidas?",
      bubbleLine2: "Fale comigo!",
      greeting: "Oi! Sou o Teubaldo, assistente da pigeonz.ai. Como posso ajudar?",
      placeholder: "Pergunte algo...",
      errorConnection: "Erro de conexão. Tente novamente!",
      title: "Falar com o Teubaldo",
    },
    footer: {
      tagline: "Desenvolvimento fullstack para quem quer crescer de verdade.",
      nav: {
        title: "Navegação",
        services: "Serviços",
        howItWorks: "Como funciona",
        pricing: "Planos",
        contact: "Contato",
      },
      contact: {
        title: "Contato",
        cta: "Iniciar projeto",
      },
      stack: {
        title: "Stack",
        categories: [
          { label: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
          { label: "Backend", items: ["Django 5", "Python 3.12", "REST Framework", "Gunicorn"] },
          { label: "Banco", items: ["PostgreSQL 17", "Neon Serverless", "Redis"] },
          { label: "Cloud", items: ["Google Cloud Run", "AWS", "Docker", "GitHub Actions"] },
          { label: "IA", items: ["Claude AI", "Groq", "LLMs", "RAG / Embeddings"] },
          { label: "Pagamentos", items: ["PIX", "Cartão", "Boleto", "Webhooks"] },
          { label: "Auth / API", items: ["HMAC Tokens", "OAuth2", "REST", "Webhooks"] },
        ],
      },
      copyright: "Todos os direitos reservados",
      madeWith: "Feito com ♥ e muito café",
    },
    login: {
      title: "Acesse seu painel",
      email: "E-mail ou usuário",
      password: "Senha",
      submit: "Entrar",
      noAccount: "Não tem conta?",
      signUp: "Criar conta",
      tagline: "Sites que voam",
      quickFill: "Preenchimento rápido",
    },
    painel: {
      welcome: "Bem-vindo de volta",
      loading: "Carregando seu painel...",
      tabs: { site: "Meu Site", edit: "Editar", templates: "Templates", support: "Suporte", payments: "Pagamentos" },
      status: { active: "Site ativo", pending: "Aguardando pagamento" },
      save: "Salvar alterações",
      saving: "Salvando...",
      saved: "Salvo!",
      logout: "Sair",
      backToSite: "Voltar ao site",
      logo: "LOGO",
      uploadLogo: "Enviar logo",
      changeLogo: "Trocar logo",
      heroTitle: "Título",
      heroSubtitle: "Subtítulo",
      heroBg: "Imagem de fundo do Hero",
      uploadBg: "Enviar imagem de fundo",
      changeBg: "Trocar imagem",
      noBg: "Sem imagem",
      phone: "Telefone / WhatsApp",
      address: "Endereço",
      hours: "Horário de funcionamento",
      colors: "CORES",
      primary: "Principal",
      accent: "Destaque",
    },
    behindCode: {
      title: "Por Trás do Código",
      subtitle: "É muito mais do que copiar e colar imagens em templates prontos. Para criar um site robusto, de qualidade profissional, veja o que acontece nos bastidores:",
      steps: [
        {
          icon: "📐",
          title: "Planejamento & Design",
          desc: "Wireframes, protótipos, identidade visual, paleta de cores, tipografia, responsividade mobile — tudo pensado antes de escrever uma linha de código.",
          backLines: [
            ":root {",
            "  --primary: #48c0b8;",
            "  --accent: #f0a0d0;",
            "  --bg-dark: #1a0e2e;",
            "  --radius: 8px;",
            "}",
            "@media (max-width: 768px) {",
            "  .hero { font-size: clamp(18px, 4vw, 32px); }",
            "}",
          ],
        },
        {
          icon: "💻",
          title: "Desenvolvimento",
          desc: "Milhares de linhas de código em React, Next.js, TypeScript, Django, Python. Cada botão, animação e interação é construído do zero com código real — não é arrastar e soltar.",
          backLines: [
            "export default function Page() {",
            "  const [data, setData] = useState(null);",
            "  useEffect(() => {",
            "    fetch('/api/products')",
            "      .then(res => res.json())",
            "      .then(setData);",
            "  }, []);",
            "  return <ProductGrid items={data} />;",
            "}",
          ],
        },
        {
          icon: "🗄️",
          title: "Banco de Dados",
          desc: "Modelagem de tabelas, migrations, queries otimizadas, relacionamentos complexos. Seus dados precisam ser armazenados com segurança e eficiência.",
          backLines: [
            "CREATE TABLE orders (",
            "  id SERIAL PRIMARY KEY,",
            "  user_id INT REFERENCES users(id),",
            "  total DECIMAL(10,2) NOT NULL,",
            "  status VARCHAR(20) DEFAULT 'pending',",
            "  created_at TIMESTAMP DEFAULT NOW()",
            ");",
            "CREATE INDEX idx_orders_user",
            "  ON orders(user_id);",
          ],
        },
        {
          icon: "🔗",
          title: "Integração de APIs",
          desc: "Pagamentos (PIX, cartão, boleto), autenticação OAuth, webhooks, serviços de e-mail, WhatsApp — cada integração exige configuração, testes e tratamento de erros.",
          backLines: [
            "const payment = await provider.create({",
            "  amount: order.total,",
            "  method: 'pix',",
            "  webhook: '/api/webhook/payment',",
            "  customer: { email, cpf },",
            "});",
            "await sendEmail(user.email, {",
            "  template: 'order-confirmed',",
            "  data: { orderId, pixCode },",
            "});",
          ],
        },
        {
          icon: "🌐",
          title: "Domínio & DNS",
          desc: "Registrar o domínio, configurar DNS, apontar registros A/CNAME, verificar propagação. Sem isso, seu site não tem endereço na internet.",
          backLines: [
            "# Configuração DNS",
            "@ IN A 34.95.128.10",
            "www IN CNAME ghs.google.com.",
            "@ IN MX 10 mail.provider.com.",
            "@ IN TXT \"v=spf1 include:_spf...\"",
            "",
            "# Verificar propagação",
            "$ dig seusite.com.br +short",
            "34.95.128.10  ✓",
          ],
        },
        {
          icon: "☁️",
          title: "Hospedagem & Deploy",
          desc: "O site precisa rodar em um servidor 24h. Configurar Cloud Run, containers Docker, variáveis de ambiente, SSL/HTTPS, CI/CD — a infraestrutura que mantém tudo no ar.",
          backLines: [
            "FROM node:20-alpine",
            "WORKDIR /app",
            "COPY package*.json ./",
            "RUN npm ci --production",
            "COPY . .",
            "RUN npm run build",
            "EXPOSE 3000",
            "CMD [\"npm\", \"start\"]",
            "# deploy → Cloud Run ☁️",
          ],
        },
        {
          icon: "🔒",
          title: "Segurança",
          desc: "Proteção contra ataques (XSS, SQL Injection, CSRF), rate limiting, headers de segurança, HTTPS obrigatório. Um site sem segurança é um convite para problemas.",
          backLines: [
            "headers: [",
            "  { key: 'X-Frame-Options',",
            "    value: 'DENY' },",
            "  { key: 'Content-Security-Policy',",
            "    value: \"default-src 'self'\" },",
            "  { key: 'Strict-Transport-Security',",
            "    value: 'max-age=31536000' },",
            "]",
            "// rate limit: 20 req/min ✓",
          ],
        },
        {
          icon: "📈",
          title: "Escalabilidade",
          desc: "Quando seu negócio cresce, o site precisa acompanhar. Arquitetura robusta desde o início — cache, load balancing, banco otimizado — para não precisar reconstruir tudo depois.",
          backLines: [
            "// Caching strategy",
            "const cache = new Map();",
            "export async function getProducts() {",
            "  if (cache.has('products'))",
            "    return cache.get('products');",
            "  const data = await db.query(",
            "    'SELECT * FROM products'",
            "  );",
            "  cache.set('products', data);",
            "  return data; // 10x faster ⚡",
          ],
        },
        {
          icon: "🛡️",
          title: "Cybersegurança",
          desc: "Firewall, criptografia de dados, proteção contra DDoS, monitoramento de vulnerabilidades, backups automáticos. A segurança do seu negócio e dos seus clientes não é opcional.",
          backLines: [
            "# Firewall rules",
            "iptables -A INPUT -p tcp",
            "  --dport 443 -j ACCEPT",
            "# Encrypt sensitive data",
            "const hash = await bcrypt.hash(",
            "  password, 12",
            ");",
            "# Auto backup: daily 3am",
            "0 3 * * * pg_dump db > bkp.sql",
            "# DDoS protection: active ✓",
          ],
        },
        {
          icon: "🧪",
          title: "Testes & Manutenção",
          desc: "Debugging, testes de compatibilidade entre navegadores, monitoramento de performance, correção de bugs, atualizações de dependências. O trabalho não acaba no deploy.",
          backLines: [
            "$ npm run test",
            "",
            "PASS  tests/api/orders.test.ts",
            "  ✓ creates order (45ms)",
            "  ✓ validates payment (32ms)",
            "  ✓ sends confirmation (28ms)",
            "",
            "Tests: 3 passed, 3 total",
            "Time:  1.24s ✓",
          ],
        },
      ],
      registroBr: {
        title: "Registre seu domínio .com.br",
        desc: "O primeiro passo para ter seu site com endereço próprio é registrar um domínio. No Brasil, o Registro.br é o órgão oficial responsável por domínios .com.br.",
        cta: "Acessar Registro.br",
      },
      closing: "Agora imagine fazer tudo isso sozinho. É por isso que a pigeonz.ai existe — para você focar no seu negócio enquanto a gente cuida de toda essa complexidade.",
    },
    aboutDev: {
      title: "A Desenvolvedora",
      bio1: "Tenho 28 anos, sou formada em",
      bio1Psychology: "Psicologia",
      bio1CompSci: "Ciência da Computação",
      bio2: "Sou autista, nível 1 de suporte, e essa característica influencia diretamente a forma como trabalho. Tenho grande capacidade de concentração, atenção minuciosa aos detalhes e um compromisso profundo com a qualidade. Quando me envolvo em um projeto, sigo até o fim com precisão, consistência e cuidado em cada etapa, para que cada elemento esteja no lugar certo e cada solução funcione da melhor forma possível.",
      bio3pre: "nasceu do",
      bio3mid: "meu pombo de estimação. Ele se tornou a mascote oficial da marca, a inspiração por trás do nome e um símbolo de que ideias marcantes podem surgir dos lugares mais inesperados.",
      bio3post: "Desde a infância, sempre me fascinei pela forma como a tecnologia transforma o mundo e pela maneira como a mente humana funciona. Essa combinação me permitiu criar soluções digitais que unem lógica, sensibilidade e compreensão real das pessoas.",
      teubaldoDesc: "O pombo que inspirou tudo. Mascote oficial da pigeonz.ai",
    },
    templates: {
      title: "Alguns Projetos do Nosso Portfolio",
      seeMore: "Ver mais ↓",
      collapse: "Recolher ↑",
      cta: "Entre em contato",
      prevAriaLabel: "Template anterior",
      nextAriaLabel: "Próximo template",
    },
    tplContent: {
      lawfirm: {
        lawOffice: "Escritório de Advocacia", tagline: "Tradição, experiência e compromisso com a justiça há mais de 20 anos",
        freeConsult: "Consulta gratuita", specialties: "Especialidades", practiceAreas: "Áreas de Atuação",
        area1: "Direito Civil", area1d: "Contratos, família e sucessões",
        area2: "Direito Empresarial", area2d: "Societário e compliance",
        area3: "Direito Trabalhista", area3d: "Defesa do trabalhador",
        area4: "Direito Tributário", area4d: "Planejamento fiscal",
        area5: "Direito Imobiliário", area5d: "Compra, venda e locação",
        area6: "Direito Penal", area6d: "Defesa criminal",
        whyUs: "Por que nos escolher", proven: "Experiência Comprovada",
        years: "Anos de Atuação", cases: "Processos", satisfaction: "Satisfação",
        ourTeam: "Nossa Equipe", lawyers: "Advogados",
        l1: "Dr. Ricardo", l1lic: "OAB/MG 12.345", l1area: "Direito Civil",
        l2: "Dra. Marina", l2lic: "OAB/MG 23.456", l2area: "Direito Trabalhista",
        l3: "Dr. Henrique", l3lic: "OAB/MG 34.567", l3area: "Direito Penal",
        testimonials: "Depoimentos", whatClients: "O que dizem nossos clientes",
        testimonial1: "Profissionais excepcionais. Resolveram meu caso trabalhista com agilidade e total transparência. Recomendo a todos.",
        testimonial1Author: "— Maria S., Cliente desde 2019",
        need: "Precisa de", legalHelp: "orientação jurídica",
        ctaSub: "Agende uma consulta gratuita e conheça seus direitos",
        schedule: "Agendar consulta", address: "Rua Exemplo, 1000 — Sala 801", phone: "(00) 0000-0000",
      },
      fitpulse: {
        welcome: "Bem-vindo de volta", myWorkout: "Meu Treino", today: "Hoje",
        workout1: "Superior — Peito & Ombro", workout1Meta: "45 min · 6 exercícios",
        startWorkout: "INICIAR TREINO", workoutsMonth: "Treinos/mês", kcal: "Kcal queimadas",
        weeklyProgress: "Progresso semanal", exercise: "Exercício 3/6", benchPress: "Supino Reto",
        setsLeft: "séries restantes", reps: "Reps", load: "Carga", rest: "Descanso",
        completeSeries: "COMPLETAR SÉRIE", skip: "Pular exercício",
        plans: "Planos", choosePlan: "Escolha o ideal pra você",
        free: "Grátis", f1a: "3 treinos/semana", f1b: "Exercícios básicos",
        f2a: "Treinos ilimitados", f2b: "Vídeos HD", f2c: "Nutricionista",
        f3a: "Tudo do Pro", f3b: "Personal online", f3c: "Suplementos",
        planPro: "Plano Pro · 3 meses", weight: "Peso", height: "Altura",
        achievements: "Conquistas", a1: "7 dias seguidos", a2: "50 treinos", a3: "10k kcal",
        tagline: "Seu treino inteligente na palma da mão",
      },
      petvida: {
        hello: "Olá, Ana!", myPets: "Meus Pets",
        dogBreed: "Golden Retriever · 3 anos", dogAlert: "Vacina em 5 dias",
        catBreed: "Siamês · 2 anos", catAlert: "Banho agendado amanhã",
        vaccines: "Vacinas", bath: "Banho", appointment: "Consulta", shop: "Lojinha",
        schedule: "Agendar", chooseService: "Escolha o serviço",
        s1: "Banho & Tosa", s1t: "1h30", s2: "Vacinação", s2t: "30min",
        s3: "Consulta Veterinária", s3t: "45min", s4: "Tosa Higiênica", s4t: "40min",
        petShop: "Lojinha Pet", delivery: "Entrega em até 2h",
        dailyOffer: "Oferta do dia", offerText: "20% OFF em ração premium", useCode: "Use: PETVIDA20",
        p1: "Ração Premium", p2: "Coleira LED", p3: "Brinquedo Mordedor", p4: "Shampoo Pet",
        profile: "Golden Retriever · Macho · 3 anos", vacCard: "Carteira de Vacinação",
        flu: "Gripe", rabies: "Raiva",
        nextAppt: "Próximos Agendamentos", bathLabel: "Banho", tomorrowTime: "Amanhã 10h",
        vaccineLabel: "Vacina", vaccineTime: "15/03 14h",
        tagline: "Tudo pro seu pet em um só lugar",
      },
      uaifood: {
        fastDelivery: "Entrega rápida", address: "Rua Exemplo, 100", search: "Buscar produtor ou prato...",
        cat1: "Caseiro", cat2: "Queijos", cat3: "Tropeiro", cat4: "Orgânico",
        prod1: "Rancho da Dona Maria", prod1Time: "30-45min", prod1Fee: "Grátis",
        prod2: "Sítio Boa Vista", prod2Time: "40-55min",
        localProd: "Produtor local",
        dish1: "Feijão Tropeiro", dish1d: "Feijão, torresmo, couve, ovo caipira",
        dish2: "Frango com Quiabo", dish2d: "Frango caipira com quiabo do sítio",
        dish3: "Pão de Queijo Artesanal", dish3d: "Pacote com 20 unidades, polvilho azedo",
        dish4: "Cesta do Produtor", dish4d: "Queijo, doce de leite, café e rapadura",
        tracking: "Rastreio", onWay: "A caminho!", arrives: "Chega em ~12 minutos",
        step1: "Pedido confirmado", step2: "Preparando", step3: "Saiu para entrega", step4: "Entregue",
        coupons: "Cupons", saveCoupon: "Economize no seu pedido",
        c1code: "UAIPRIMEIRO", c1desc: "R$ 15 OFF no 1º pedido", c1min: "Mín. R$ 30",
        c2code: "FRETE0", c2desc: "Frete grátis", c2min: "Mín. R$ 25",
        c3code: "CESTA20", c3desc: "20% OFF em cestas", c3min: "Sem mínimo",
        useBtn: "Usar", subtitle: "Mercadinhos, negócios locais e comida artesanal",
        feat1: "30min ou grátis", feat2: "Cupons diários", feat3: "Rastreio real-time",
      },
      cards: {
        cafe: "Retro Café", cafeD: "Cafeteria aconchegante com cardápio artesanal",
        tattoo: "Tattoo Boo", tattooD: "Estúdio de tatuagem com estética dark",
        astral: "Astral Bike", astralD: "Aluguel de bikes elétricas urbanas",
        law: "Law Fall & Associados", lawD: "Escritório de advocacia tradicional",
        fitpulse: "FitPulse", fitpulseD: "App de treino e saúde",
        petvida: "PetVida", petvidaD: "App para cuidados com seu pet",
        uaifood: "UAIfood", uaifoodD: "Delivery de comida mineira artesanal",
      },
      cafe: {
        title: "Retro Café", subtitle: "// Café com sabor nostálgico", cta: "Ver Cardápio",
        phone: "(00) 1111-1111", address: "Rua Exemplo, 123", hours: "Seg a Sex: 7h–19h",
        feat1: "100% Artesanal", feat1d: "Grãos torrados na casa",
        feat2: "Receitas da Vovó", feat2d: "Bolos com sabor de infância",
        prod1: "Espresso Artesanal", prod1d: "Blend especial",
        prod2: "Bolo da Vovó", prod2d: "Receita secreta",
        about: "README.txt", aboutText: "Nasceu da paixão por café bom e design nostálgico.",
      },
      joias: {
        title: "Velaris Joias", subtitle: "Elegância que brilha em cada detalhe", cta: "Ver Coleção",
        phone: "(00) 1111-1111", address: "Rua Exemplo, 456", hours: "Seg a Sáb: 10h–19h",
        stats: "Em números", s1: "Anos de tradição", s2: "Joias vendidas", s3: "No Google",
        prod1: "Anel Solitário Ouro 18k", prod1d: "Diamante natural 0.3ct",
        prod2: "Colar Pérolas Naturais", prod2d: "Pérolas cultivadas",
        about: "Nossa História", aboutText: "Desde 2009 criando joias exclusivas com design autoral e pedras selecionadas.",
      },
      tech: {
        title: "TechStore", subtitle: "Tecnologia com os melhores preços", cta: "Ver Produtos",
        phone: "(00) 1111-1111", address: "Rua Exemplo, 789",
        feat1: "Pagamento Seguro", feat1d: "Criptografia ponta a ponta",
        feat2: "Entrega Expressa", feat2d: "Até 2 dias úteis",
        prod1: "Fone Bluetooth Pro", prod1d: "Cancelamento de ruído",
        prod2: "Smartwatch Ultra", prod2d: "GPS + monitor",
        banner: "10% OFF na primeira compra", bannerText: "Use o cupom TECH10.", bannerBtn: "Comprar Agora",
      },
      barber: {
        title: "Barbearia Dom", subtitle: "Entra feio, sai bonito", cta: "Agendar Horário",
        phone: "(00) 1111-1111", address: "Rua Exemplo, 100", hours: "Seg a Sáb: 9h–20h",
        stats: "Números", s1: "Cortes", s2: "Google", s3: "Anos",
        prod1: "Degradê Americano", prod1d: "Tesoura + máquina",
        prod2: "Corte + Barba", prod2d: "Combo completo",
        svc1: "Corte Masculino", svc1d: "Tesoura ou máquina",
        svc2: "Barba Completa", svc2d: "Navalha + toalha quente",
        svc3: "Corte + Barba", svc3d: "Combo premium",
        about: "Nossa História", aboutText: "Desde 2018 trazendo o melhor do estilo masculino com tradição e atitude.",
      },
      tattooboo: {
        studioTag: "Estúdio de Tatuagem & Body Art", bookSession: "Agendar sessão",
        portfolio: "Portfolio", ourWork: "Nossos Trabalhos",
        specialties: "Especialidades", styles: "Estilos",
        s1: "Blackwork", s1d: "Formas geométricas e preenchimento total",
        s2: "Fineline", s2d: "Traços finos e delicados",
        s3: "Realismo", s3d: "Retratos e texturas fotográficas",
        s4: "Old School", s4d: "Cores vibrantes e traços grossos",
        s5: "Dotwork", s5d: "Pontilhismo e mandalas",
        s6: "Lettering", s6d: "Fontes personalizadas e caligrafia",
        team: "Equipe", artists: "Artistas",
        investment: "Investimento", prices: "Preços",
        p1: "Tattoo P", p1size: "até 5cm", p1price: "R$ 150", p1d: "Peças pequenas e minimalistas",
        p2: "Tattoo M", p2size: "5–15cm", p2price: "R$ 350", p2d: "Braço, costela, tornozelo",
        p3: "Tattoo G", p3size: "15cm+", p3price: "A partir de R$ 600", p3d: "Peças grandes e fechamentos",
        ctaTitle: "Bora marcar sua tattoo?", ctaSub: "Agende pelo WhatsApp ou passe no estúdio", ctaBtn: "Agendar agora",
      },
      astralbike: {
        heroTitle1: "Pedala com", heroTitle2: "Astral Bike",
        heroDesc: "500 bicicletas elétricas espalhadas pelas cidades. Desbloqueie em segundos e pedale onde quiser.",
        seePlans: "Veja os planos",
        noSub: "Sem mensalidade obrigatória", cancelAnytime: "Cancele quando quiser",
        stat1: "estações", stat2: "bikes elétricas", stat3: "disponível", stat4: "elétrico",
        whereWeAre: "Onde estamos",
        countryBR: "Brasil", countryAR: "Argentina", countryCL: "Chile", countryCO: "Colômbia",
        whyTitle: "Por que Astral Bike?",
        f1: "100% Elétrica", f1d: "Motor elétrico que faz você subir ladeiras sem esforço.",
        f2: "Perto de você", f2d: "51 estações espalhadas pela cidade.",
        f3: "Simples e rápido", f3d: "Desbloqueie pelo app em segundos.",
        f4: "Plano recorrente", f4d: "Assine e tenha acesso ilimitado.",
        f5: "Avulso também", f5d: "Compre uma viagem quando precisar.",
        f6: "Ideal para a cidade", f6d: "Esquive do trânsito e chegue mais rápido.",
        howTitle: "Como funciona",
        h1: "Escolha seu plano", h1d: "Avulso, Mensal ou Anual.",
        h2: "Pague no app", h2d: "Conclua o pagamento com segurança no app.",
        h3: "Pedala!", h3d: "Desbloqueie qualquer bike nas estações.",
        ctaTitle: "Bora pro pedal?", ctaSub: "Escolha o plano ideal e comece hoje mesmo.",
      },
    },
  },

  en: {
    nav: {
      services: "Services",
      howItWorks: "How it works",
      pricing: "Plans",
      templates: "Portfolio",
      contact: "Contact",
    },
    hero: {
      badge: "FULLSTACK STUDIO",
      typed: "Sites that fly.",
      subHeadline: "AI First.",
      subtitle: "Fullstack development for small and mid-sized businesses. Beautiful, functional sites, mobile apps and custom software that",
      subtitleHighlight: "actually convert",
      ctaPricing: "See plans",
      ctaContact: "Get in touch",
    },
    whoWeAre: {
      commentLabel: "// WHO WE ARE",
      title: "What do we do?",
      subtitle: "We turn your idea into something real on the internet. No jargon, no hassle.",
      items: [
        {
          icon: "🛒",
          title: "Online store to sell your products",
          desc: "Want to sell clothes, sweets, crafts or anything else? We build your complete store with cart, Pix and card payments, all organized for you to manage.",
        },
        {
          icon: "📱",
          title: "Mobile app",
          desc: "Your business in your customer's pocket. Digital menu, scheduling, product catalog — works on Android and iPhone.",
        },
        {
          icon: "🌐",
          title: "Professional website for your business",
          desc: "That beautiful site that builds trust. With your colors, your logo, contact info and everything your customer needs to find you on Google.",
        },
        {
          icon: "🤖",
          title: "Automated customer service with AI",
          desc: "A chatbot that answers your customers 24/7, answers questions, sends quotes and schedules services — while you rest.",
        },
        {
          icon: "📊",
          title: "Dashboard to track everything",
          desc: "No more guessing. See how many people visited your site, how many bought, and what's working best.",
        },
        {
          icon: "☁️",
          title: "SaaS platforms and custom systems",
          desc: "Need your own system? We build complete platforms — SaaS, admin panels, API integrations, automations and everything your operation needs to scale.",
        },
      ],
      closing: "From solo entrepreneurs to companies ready to scale — we make technology work for your business.",
    },
    services: {
      commentLabel: "// WHAT PIGEONZ DOES",
      title: "Services",
      items: [
        {
          title: "Sites & Landing Pages",
          desc: "Digital presence that builds credibility. Modern, responsive design optimized for conversion.",
        },
        {
          title: "Full E-commerce",
          desc: "Online store with cart, checkout and payment provider integration. Simple setup for your business.",
        },
        {
          title: "Systems & Dashboards",
          desc: "Admin panels, CRMs, ERPs and custom systems with robust API and structured database.",
        },
        {
          title: "AI & Chatbots",
          desc: "Customer support bot with Claude/GPT, automatic triage, smart FAQ. Your business never stops.",
        },
        {
          title: "Integrations & APIs",
          desc: "We connect any system. Webhooks, OAuth, ERPs, CRMs, marketplaces — whatever you need.",
        },
        {
          title: "Cloud & Infrastructure",
          desc: "Deploy on Google Cloud, AWS, and more. Scalable from zero to millions of requests.",
        },
        {
          title: "Security & Protection",
          desc: "Security headers, rate limiting, HTTPS, protection against XSS, CSRF and injection. Your project shielded.",
        },
      ],
    },
    how: {
      commentLabel: "// HOW IT WORKS",
      title: "Process",
      steps: [
        {
          title: "You tell us about your business",
          desc: "We deeply understand what you need, who your customer is and what result you want to achieve.",
        },
        {
          title: "We plan together",
          desc: "Clear proposal with scope, timeline and price. No surprises. You approve before we start.",
        },
        {
          title: "We build it",
          desc: "Development with modern stack. You follow each step in real time.",
        },
        {
          title: "You grow",
          desc: "Site live, guaranteed support and continuous evolution. The pigeon never leaves the nest.",
        },
      ],
    },
    pricing: {
      commentLabel: "// INVESTMENT",
      title: "Plans",
      subtitle: "Transparent pricing. Installments available.",
      footnote: "* Installments available.",
      plans: [
        {
          name: "Starter",
          tag: "To get started",
          price: "R$ 2.567",
          priceNote: "full package",
          badge: null,
          cta: "Hire",
          features: [
            "Professional page for your business",
            "Ready template adapted for you",
            "Custom design with your identity",
            "Shows up on Google",
            "Contact button via email or WhatsApp",
            "1 month of support included",
          ],
        },
        {
          name: "Pro",
          tag: "Most popular ★",
          price: "R$ 5.123",
          priceNote: "full package",
          badge: "★ MOST POPULAR",
          cta: "Hire",
          features: [
            "Everything in Starter",
            "Production-ready site",
            "More complete and elaborate design",
            "Multiple pages and tabs",
            "Payment API integration (PIX, card...)",
            "Blog to post content",
            "2 months of support included",
          ],
        },
        {
          name: "Enterprise",
          tag: "Custom built",
          price: "Custom",
          priceNote: "complex project",
          badge: null,
          cta: "Sales contact",
          features: [
            "Project built from scratch for your business",
            "Full payment API (PIX, card, boleto)",
            "Custom checkout, webhooks and split",
            "Native mobile app (iOS & Android)",
            "Custom artificial intelligence",
            "Connects with any system",
            "Robust and scalable structure",
            "Dedicated support",
          ],
        },
      ],
    },
    contact: {
      commentLabel: "// LET'S TALK",
      title: "Get in touch",
      subtitle: "I'll respond within 24 hours.",
      labels: {
        name: "Name *",
        whatsapp: "WhatsApp",
        email: "E-mail *",
        business: "Your business",
        message: "Message *",
      },
      placeholders: {
        name: "Your name",
        whatsapp: "+1 (000) 000-0000",
        email: "you@email.com",
        message: "Tell me a bit about your project...",
      },
      businessOptions: [
        { value: "", label: "Select..." },
        { value: "landing", label: "Landing page / Institutional site" },
        { value: "ecommerce", label: "E-commerce / Online store" },
        { value: "sistema", label: "System / Admin panel" },
        { value: "ia", label: "Chatbot / AI" },
        { value: "outro", label: "Other" },
      ],
      security: "Secure connection · Protected data · HTTPS",
      submit: "▸ Send message",
      submitting: "Sending...",
      errors: {
        nameShort: "Name too short",
        emailInvalid: "Invalid e-mail",
        messageShort: "Message too short (minimum 10 characters)",
      },
      toast: {
        success: "Message sent! The pigeon is on its way. 🐦",
        error: "Error sending. Try again or send a WhatsApp!",
      },
    },
    chat: {
      bubbleLine1: "Got questions?",
      bubbleLine2: "Talk to me!",
      greeting: "Hi! I'm Teubaldo, pigeonz.ai assistant. How can I help?",
      placeholder: "Ask something...",
      errorConnection: "Connection error. Try again!",
      title: "Talk to Teubaldo",
    },
    footer: {
      tagline: "Fullstack development for those who want to grow for real.",
      nav: {
        title: "Navigation",
        services: "Services",
        howItWorks: "How it works",
        pricing: "Plans",
        contact: "Contact",
      },
      contact: {
        title: "Contact",
        cta: "Start project",
      },
      stack: {
        title: "Stack",
        categories: [
          { label: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
          { label: "Backend", items: ["Django 5", "Python 3.12", "REST Framework", "Gunicorn"] },
          { label: "Database", items: ["PostgreSQL 17", "Neon Serverless", "Redis"] },
          { label: "Cloud", items: ["Google Cloud Run", "AWS", "Docker", "GitHub Actions"] },
          { label: "AI", items: ["Claude AI", "Groq", "LLMs", "RAG / Embeddings"] },
          { label: "Payments", items: ["PIX", "Card", "Boleto", "Webhooks"] },
          { label: "Auth / API", items: ["HMAC Tokens", "OAuth2", "REST", "Webhooks"] },
        ],
      },
      copyright: "All rights reserved",
      madeWith: "Made with ♥ and lots of coffee",
    },
    login: {
      title: "Access your dashboard",
      email: "Email or username",
      password: "Password",
      submit: "Sign in",
      noAccount: "Don't have an account?",
      signUp: "Create account",
      tagline: "Sites that fly",
      quickFill: "Quick fill",
    },
    painel: {
      welcome: "Welcome back",
      loading: "Loading your dashboard...",
      tabs: { site: "My Site", edit: "Edit", templates: "Templates", support: "Support", payments: "Payments" },
      status: { active: "Site active", pending: "Awaiting payment" },
      save: "Save changes",
      saving: "Saving...",
      saved: "Saved!",
      logout: "Logout",
      backToSite: "Back to site",
      logo: "LOGO",
      uploadLogo: "Upload logo",
      changeLogo: "Change logo",
      heroTitle: "Title",
      heroSubtitle: "Subtitle",
      heroBg: "Hero background image",
      uploadBg: "Upload background",
      changeBg: "Change image",
      noBg: "No image",
      phone: "Phone / WhatsApp",
      address: "Address",
      hours: "Business hours",
      colors: "COLORS",
      primary: "Primary",
      accent: "Accent",
    },
    behindCode: {
      title: "Behind the Code",
      subtitle: "It's much more than copying and pasting images into ready-made templates. To build a robust, professional-quality site, here's what happens behind the scenes:",
      steps: [
        {
          icon: "📐",
          title: "Planning & Design",
          desc: "Wireframes, prototypes, visual identity, color palette, typography, mobile responsiveness — everything is planned before writing a single line of code.",
          backLines: [":root {","  --primary: #48c0b8;","  --accent: #f0a0d0;","  --bg-dark: #1a0e2e;","  --radius: 8px;","}","@media (max-width: 768px) {","  .hero { font-size: clamp(18px, 4vw, 32px); }","}"],
        },
        {
          icon: "💻",
          title: "Development",
          desc: "Thousands of lines of code in React, Next.js, TypeScript, Django, Python. Every button, animation and interaction is built from scratch with real code — no drag and drop.",
          backLines: ["export default function Page() {","  const [data, setData] = useState(null);","  useEffect(() => {","    fetch('/api/products')","      .then(res => res.json())","      .then(setData);","  }, []);","  return <ProductGrid items={data} />;","}"],
        },
        {
          icon: "🗄️",
          title: "Database",
          desc: "Table modeling, migrations, optimized queries, complex relationships. Your data needs to be stored securely and efficiently.",
          backLines: ["CREATE TABLE orders (","  id SERIAL PRIMARY KEY,","  user_id INT REFERENCES users(id),","  total DECIMAL(10,2) NOT NULL,","  status VARCHAR(20) DEFAULT 'pending',","  created_at TIMESTAMP DEFAULT NOW()",");","CREATE INDEX idx_orders_user","  ON orders(user_id);"],
        },
        {
          icon: "🔗",
          title: "API Integration",
          desc: "Payments (PIX, card, boleto), OAuth authentication, webhooks, email services, WhatsApp — each integration requires configuration, testing, and error handling.",
          backLines: ["const payment = await provider.create({","  amount: order.total,","  method: 'pix',","  webhook: '/api/webhook/payment',","  customer: { email, cpf },","});","await sendEmail(user.email, {","  template: 'order-confirmed',","  data: { orderId, pixCode },","});"],
        },
        {
          icon: "🌐",
          title: "Domain & DNS",
          desc: "Register the domain, configure DNS, point A/CNAME records, verify propagation. Without this, your site has no address on the internet.",
          backLines: ["# DNS Configuration","@ IN A 34.95.128.10","www IN CNAME ghs.google.com.","@ IN MX 10 mail.provider.com.","@ IN TXT \"v=spf1 include:_spf...\"","","# Verify propagation","$ dig yoursite.com.br +short","34.95.128.10  ✓"],
        },
        {
          icon: "☁️",
          title: "Hosting & Deploy",
          desc: "The site needs to run on a server 24/7. Setting up Cloud Run, Docker containers, environment variables, SSL/HTTPS, CI/CD — the infrastructure that keeps everything running.",
          backLines: ["FROM node:20-alpine","WORKDIR /app","COPY package*.json ./","RUN npm ci --production","COPY . .","RUN npm run build","EXPOSE 3000","CMD [\"npm\", \"start\"]","# deploy → Cloud Run ☁️"],
        },
        {
          icon: "🔒",
          title: "Security",
          desc: "Protection against attacks (XSS, SQL Injection, CSRF), rate limiting, security headers, mandatory HTTPS. A site without security is an invitation for trouble.",
          backLines: ["headers: [","  { key: 'X-Frame-Options',","    value: 'DENY' },","  { key: 'Content-Security-Policy',","    value: \"default-src 'self'\" },","  { key: 'Strict-Transport-Security',","    value: 'max-age=31536000' },","]","// rate limit: 20 req/min ✓"],
        },
        {
          icon: "📈", title: "Scalability",
          desc: "When your business grows, your site needs to keep up. Robust architecture from day one — caching, load balancing, optimized database — so you don't need to rebuild everything later.",
          backLines: ["// Caching strategy","const cache = new Map();","export async function getProducts() {","  if (cache.has('products'))","    return cache.get('products');","  const data = await db.query(","    'SELECT * FROM products'","  );","  cache.set('products', data);","  return data; // 10x faster ⚡"],
        },
        {
          icon: "🛡️", title: "Cybersecurity",
          desc: "Firewall, data encryption, DDoS protection, vulnerability monitoring, automatic backups. The security of your business and your customers is not optional.",
          backLines: ["# Firewall rules","iptables -A INPUT -p tcp","  --dport 443 -j ACCEPT","# Encrypt sensitive data","const hash = await bcrypt.hash(","  password, 12",");","# Auto backup: daily 3am","0 3 * * * pg_dump db > bkp.sql","# DDoS protection: active ✓"],
        },
        {
          icon: "🧪", title: "Testing & Maintenance",
          desc: "Debugging, cross-browser compatibility testing, performance monitoring, bug fixes, dependency updates. The work doesn't end at deploy.",
          backLines: ["$ npm run test","","PASS  tests/api/orders.test.ts","  ✓ creates order (45ms)","  ✓ validates payment (32ms)","  ✓ sends confirmation (28ms)","","Tests: 3 passed, 3 total","Time:  1.24s ✓"],
        },
      ],
      registroBr: {
        title: "Register your .com.br domain",
        desc: "The first step to having your own web address is registering a domain. In Brazil, Registro.br is the official authority for .com.br domains.",
        cta: "Visit Registro.br",
      },
      closing: "Now imagine doing all of this on your own. That's why pigeonz.ai exists — so you can focus on your business while we handle all this complexity.",
    },
    aboutDev: {
      title: "The Developer",
      bio1: "I'm 28 years old, with degrees in",
      bio1Psychology: "Psychology",
      bio1CompSci: "Computer Science",
      bio2: "I'm autistic, level 1 support, and this trait directly influences the way I work. I have great focus, meticulous attention to detail, and a deep commitment to quality. When I get involved in a project, I follow through with precision, consistency, and care at every stage, so that every element is in the right place and every solution works the best way possible.",
      bio3pre: "was born from",
      bio3mid: "my pet pigeon. He became the official brand mascot, the inspiration behind the name, and a symbol that remarkable ideas can come from the most unexpected places.",
      bio3post: "Since childhood, I've always been fascinated by how technology transforms the world and how the human mind works. This combination allowed me to create digital solutions that blend logic, sensitivity, and real understanding of people.",
      teubaldoDesc: "The pigeon that inspired it all. Official mascot of pigeonz.ai",
    },
    templates: {
      title: "Some Projects From Our Portfolio",
      seeMore: "See more ↓",
      collapse: "Collapse ↑",
      cta: "Get in touch",
      prevAriaLabel: "Previous template",
      nextAriaLabel: "Next template",
    },
    tplContent: {
      lawfirm: {
        lawOffice: "Law Office", tagline: "Tradition, experience and commitment to justice for over 20 years",
        freeConsult: "Free consultation", specialties: "Specialties", practiceAreas: "Practice Areas",
        area1: "Civil Law", area1d: "Contracts, family and succession",
        area2: "Corporate Law", area2d: "Corporate and compliance",
        area3: "Labor Law", area3d: "Worker's defense",
        area4: "Tax Law", area4d: "Tax planning",
        area5: "Real Estate Law", area5d: "Purchase, sale and lease",
        area6: "Criminal Law", area6d: "Criminal defense",
        whyUs: "Why choose us", proven: "Proven Experience",
        years: "Years of Practice", cases: "Cases", satisfaction: "Satisfaction",
        ourTeam: "Our Team", lawyers: "Lawyers",
        l1: "Dr. Ricardo", l1lic: "OAB/MG 12.345", l1area: "Civil Law",
        l2: "Dra. Marina", l2lic: "OAB/MG 23.456", l2area: "Labor Law",
        l3: "Dr. Henrique", l3lic: "OAB/MG 34.567", l3area: "Criminal Law",
        testimonials: "Testimonials", whatClients: "What our clients say",
        testimonial1: "Exceptional professionals. They resolved my labor case with agility and full transparency. I recommend them to everyone.",
        testimonial1Author: "— Maria S., Client since 2019",
        need: "Need", legalHelp: "legal guidance",
        ctaSub: "Schedule a free consultation and learn about your rights",
        schedule: "Schedule consultation", address: "Rua Exemplo, 1000 — Suite 801", phone: "(00) 0000-0000",
      },
      fitpulse: {
        welcome: "Welcome back", myWorkout: "My Workout", today: "Today",
        workout1: "Upper — Chest & Shoulder", workout1Meta: "45 min · 6 exercises",
        startWorkout: "START WORKOUT", workoutsMonth: "Workouts/mo", kcal: "Kcal burned",
        weeklyProgress: "Weekly progress", exercise: "Exercise 3/6", benchPress: "Bench Press",
        setsLeft: "sets left", reps: "Reps", load: "Load", rest: "Rest",
        completeSeries: "COMPLETE SET", skip: "Skip exercise",
        plans: "Plans", choosePlan: "Choose the best for you",
        free: "Free", f1a: "3 workouts/week", f1b: "Basic exercises",
        f2a: "Unlimited workouts", f2b: "HD Videos", f2c: "Nutritionist",
        f3a: "Everything in Pro", f3b: "Online personal trainer", f3c: "Supplements",
        planPro: "Pro Plan · 3 months", weight: "Weight", height: "Height",
        achievements: "Achievements", a1: "7-day streak", a2: "50 workouts", a3: "10k kcal",
        tagline: "Your smart workout in the palm of your hand",
      },
      petvida: {
        hello: "Hi, Ana!", myPets: "My Pets",
        dogBreed: "Golden Retriever · 3 years", dogAlert: "Vaccine in 5 days",
        catBreed: "Siamese · 2 years", catAlert: "Bath scheduled tomorrow",
        vaccines: "Vaccines", bath: "Bath", appointment: "Appointment", shop: "Shop",
        schedule: "Schedule", chooseService: "Choose a service",
        s1: "Bath & Grooming", s1t: "1h30", s2: "Vaccination", s2t: "30min",
        s3: "Vet Appointment", s3t: "45min", s4: "Hygienic Grooming", s4t: "40min",
        petShop: "Pet Shop", delivery: "Delivery within 2h",
        dailyOffer: "Daily offer", offerText: "20% OFF premium food", useCode: "Use: PETVIDA20",
        p1: "Premium Food", p2: "LED Collar", p3: "Chew Toy", p4: "Pet Shampoo",
        profile: "Golden Retriever · Male · 3 years", vacCard: "Vaccination Card",
        flu: "Flu", rabies: "Rabies",
        nextAppt: "Next Appointments", bathLabel: "Bath", tomorrowTime: "Tomorrow 10am",
        vaccineLabel: "Vaccine", vaccineTime: "03/15 2pm",
        tagline: "Everything for your pet in one place",
      },
      uaifood: {
        fastDelivery: "Fast delivery", address: "Rua Exemplo, 100", search: "Search producer or dish...",
        cat1: "Homemade", cat2: "Cheeses", cat3: "Tropeiro", cat4: "Organic",
        prod1: "Rancho da Dona Maria", prod1Time: "30-45min", prod1Fee: "Free",
        prod2: "Sítio Boa Vista", prod2Time: "40-55min",
        localProd: "Local producer",
        dish1: "Feijão Tropeiro", dish1d: "Beans, pork rinds, collard greens, free-range egg",
        dish2: "Chicken with Okra", dish2d: "Free-range chicken with farm okra",
        dish3: "Artisan Cheese Bread", dish3d: "Pack of 20, sour starch",
        dish4: "Producer's Basket", dish4d: "Cheese, dulce de leche, coffee and rapadura",
        tracking: "Tracking", onWay: "On the way!", arrives: "Arrives in ~12 minutes",
        step1: "Order confirmed", step2: "Preparing", step3: "Out for delivery", step4: "Delivered",
        coupons: "Coupons", saveCoupon: "Save on your order",
        c1code: "UAIFIRST", c1desc: "R$ 15 OFF 1st order", c1min: "Min. R$ 30",
        c2code: "FRETE0", c2desc: "Free delivery", c2min: "Min. R$ 25",
        c3code: "CESTA20", c3desc: "20% OFF baskets", c3min: "No minimum",
        useBtn: "Use", subtitle: "Local markets, small businesses and artisan food",
        feat1: "30min or free", feat2: "Daily coupons", feat3: "Real-time tracking",
      },
      cards: {
        cafe: "Retro Café", cafeD: "Cozy coffee shop with artisan menu",
        tattoo: "Tattoo Boo", tattooD: "Tattoo studio with dark aesthetic",
        astral: "Astral Bike", astralD: "Urban electric bike rental",
        law: "Law Fall & Associates", lawD: "Traditional law office",
        fitpulse: "FitPulse", fitpulseD: "Workout and health app",
        petvida: "PetVida", petvidaD: "App for your pet's care",
        uaifood: "UAIfood", uaifoodD: "Artisan Minas Gerais food delivery",
      },
      cafe: {
        title: "Retro Café", subtitle: "// Coffee with a nostalgic flavor", cta: "See Menu",
        phone: "(00) 1111-1111", address: "123 Example St.", hours: "Mon–Fri: 7am–7pm",
        feat1: "100% Handcrafted", feat1d: "House-roasted beans",
        feat2: "Grandma's Recipes", feat2d: "Cakes with a taste of childhood",
        prod1: "Artisan Espresso", prod1d: "Special blend",
        prod2: "Grandma's Cake", prod2d: "Secret recipe",
        about: "README.txt", aboutText: "Born from a passion for great coffee and nostalgic design.",
      },
      joias: {
        title: "Velaris Jewelry", subtitle: "Elegance that shines in every detail", cta: "See Collection",
        phone: "(00) 1111-1111", address: "456 Example St.", hours: "Mon–Sat: 10am–7pm",
        stats: "In numbers", s1: "Years of tradition", s2: "Jewelry sold", s3: "On Google",
        prod1: "18k Gold Solitaire Ring", prod1d: "Natural 0.3ct diamond",
        prod2: "Natural Pearl Necklace", prod2d: "Cultured pearls",
        about: "Our Story", aboutText: "Since 2009, creating exclusive jewelry with signature design and hand-picked stones.",
      },
      tech: {
        title: "TechStore", subtitle: "Technology at the best prices", cta: "See Products",
        phone: "(00) 1111-1111", address: "789 Example St.",
        feat1: "Secure Payment", feat1d: "End-to-end encryption",
        feat2: "Express Delivery", feat2d: "Up to 2 business days",
        prod1: "Bluetooth Pro Headphones", prod1d: "Noise cancellation",
        prod2: "Smartwatch Ultra", prod2d: "GPS + monitor",
        banner: "10% OFF your first purchase", bannerText: "Use coupon TECH10.", bannerBtn: "Buy Now",
      },
      barber: {
        title: "Dom Barbershop", subtitle: "Walk in rough, walk out sharp", cta: "Book Now",
        phone: "(00) 1111-1111", address: "100 Example St.", hours: "Mon–Sat: 9am–8pm",
        stats: "Numbers", s1: "Haircuts", s2: "Google", s3: "Years",
        prod1: "American Fade", prod1d: "Scissors + clippers",
        prod2: "Cut + Beard", prod2d: "Full combo",
        svc1: "Men's Haircut", svc1d: "Scissors or clippers",
        svc2: "Full Beard", svc2d: "Straight razor + hot towel",
        svc3: "Cut + Beard", svc3d: "Premium combo",
        about: "Our Story", aboutText: "Since 2018, bringing the best in men's style with tradition and attitude.",
      },
      tattooboo: {
        studioTag: "Tattoo Studio & Body Art", bookSession: "Book a session",
        portfolio: "Portfolio", ourWork: "Our Work",
        specialties: "Specialties", styles: "Styles",
        s1: "Blackwork", s1d: "Geometric shapes and solid fill",
        s2: "Fineline", s2d: "Thin and delicate strokes",
        s3: "Realism", s3d: "Portraits and photographic textures",
        s4: "Old School", s4d: "Vibrant colors and bold strokes",
        s5: "Dotwork", s5d: "Stippling and mandalas",
        s6: "Lettering", s6d: "Custom fonts and calligraphy",
        team: "Team", artists: "Artists",
        investment: "Investment", prices: "Prices",
        p1: "Tattoo S", p1size: "up to 5cm", p1price: "R$ 150", p1d: "Small and minimalist pieces",
        p2: "Tattoo M", p2size: "5–15cm", p2price: "R$ 350", p2d: "Arm, rib, ankle",
        p3: "Tattoo L", p3size: "15cm+", p3price: "Starting at R$ 600", p3d: "Large pieces and sleeves",
        ctaTitle: "Ready to get your tattoo?", ctaSub: "Book via WhatsApp or visit the studio", ctaBtn: "Book now",
      },
      astralbike: {
        heroTitle1: "Ride with", heroTitle2: "Astral Bike",
        heroDesc: "500 electric bikes across the cities. Unlock in seconds and ride wherever you want.",
        seePlans: "See plans",
        noSub: "No mandatory subscription", cancelAnytime: "Cancel anytime",
        stat1: "stations", stat2: "electric bikes", stat3: "available", stat4: "electric",
        whereWeAre: "Where we are",
        countryBR: "Brazil", countryAR: "Argentina", countryCL: "Chile", countryCO: "Colombia",
        whyTitle: "Why Astral Bike?",
        f1: "100% Electric", f1d: "Electric motor that takes you uphill effortlessly.",
        f2: "Near you", f2d: "51 stations across the city.",
        f3: "Simple and fast", f3d: "Unlock via the app in seconds.",
        f4: "Recurring plan", f4d: "Subscribe and get unlimited access.",
        f5: "Pay-per-ride too", f5d: "Buy a single ride when you need it.",
        f6: "Ideal for the city", f6d: "Skip traffic and arrive faster.",
        howTitle: "How it works",
        h1: "Choose your plan", h1d: "Single, Monthly or Annual.",
        h2: "Pay in the app", h2d: "Complete payment securely in the app.",
        h3: "Ride!", h3d: "Unlock any bike at the stations.",
        ctaTitle: "Ready to ride?", ctaSub: "Choose the ideal plan and start today.",
      },
    },
  },

  es: {
    nav: {
      services: "Servicios",
      howItWorks: "Cómo funciona",
      pricing: "Planes",
      templates: "Portafolio",
      contact: "Contacto",
    },
    hero: {
      badge: "FULLSTACK STUDIO",
      typed: "Sitios que vuelan.",
      subHeadline: "AI First.",
      subtitle: "Desarrollo fullstack para micro y medianas empresas. Sitios bonitos y funcionales, aplicaciones móviles y software a medida que",
      subtitleHighlight: "realmente convierten",
      ctaPricing: "Ver planes",
      ctaContact: "Contáctanos",
    },
    whoWeAre: {
      commentLabel: "// QUIÉNES SOMOS",
      title: "¿Qué hacemos?",
      subtitle: "Transformamos tu idea en algo real en internet. Sin complicaciones, sin rodeos.",
      items: [
        {
          icon: "🛒",
          title: "Tienda online para vender tus productos",
          desc: "¿Quieres vender ropa, dulces, artesanías o lo que sea? Creamos tu tienda completa con carrito, pago por Pix y tarjeta, todo organizado para que lo gestiones.",
        },
        {
          icon: "📱",
          title: "Aplicación para el celular",
          desc: "Tu negocio en la palma de la mano del cliente. Menú digital, agendamiento, catálogo de productos — funciona en Android y iPhone.",
        },
        {
          icon: "🌐",
          title: "Sitio web profesional para tu negocio",
          desc: "Ese sitio bonito que transmite confianza. Con tus colores, tu logo, información de contacto y todo lo que el cliente necesita para encontrarte en Google.",
        },
        {
          icon: "🤖",
          title: "Atención automática con inteligencia artificial",
          desc: "Un chatbot que atiende a tus clientes 24h, responde dudas, envía presupuestos y agenda servicios — mientras tú descansas.",
        },
        {
          icon: "📊",
          title: "Panel para que acompañes todo",
          desc: "Nada de andar perdido. Ves cuántas personas visitaron tu sitio, cuántas compraron y qué está funcionando mejor.",
        },
        {
          icon: "☁️",
          title: "Plataformas SaaS y sistemas a medida",
          desc: "¿Tu empresa necesita un sistema propio? Desarrollamos plataformas completas — SaaS, paneles administrativos, integraciones con APIs, automatizaciones y todo lo que tu operación necesita para escalar.",
        },
      ],
      closing: "Del microemprendedor a la empresa que quiere escalar — hacemos que la tecnología funcione para tu negocio.",
    },
    services: {
      commentLabel: "// QUÉ HACE PIGEONZ",
      title: "Servicios",
      items: [
        {
          title: "Sitios & Landing Pages",
          desc: "Presencia digital que genera credibilidad. Diseño moderno, responsivo y optimizado para conversión.",
        },
        {
          title: "E-commerce Completo",
          desc: "Tienda virtual con carrito, checkout e integración con proveedores de pago. Configuración sencilla para tu negocio.",
        },
        {
          title: "Sistemas & Dashboards",
          desc: "Paneles admin, CRMs, ERPs y sistemas a medida con API robusta y base de datos estructurada.",
        },
        {
          title: "IA & Chatbots",
          desc: "Bot de atención con Claude/GPT, triaje automático, FAQ inteligente. Tu negocio nunca para.",
        },
        {
          title: "Integraciones & APIs",
          desc: "Conectamos cualquier sistema. Webhooks, OAuth, ERPs, CRMs, marketplaces y lo que necesites.",
        },
        {
          title: "Cloud & Infraestructura",
          desc: "Deploy en Google Cloud, AWS, entre otros. Escalable desde cero hasta millones de requests.",
        },
        {
          title: "Seguridad & Protección",
          desc: "Headers de seguridad, rate limiting, HTTPS, protección contra XSS, CSRF e inyección. Tu proyecto blindado.",
        },
      ],
    },
    how: {
      commentLabel: "// CÓMO FUNCIONA",
      title: "Proceso",
      steps: [
        {
          title: "Nos contás tu negocio",
          desc: "Entendemos profundamente qué necesitás, quién es tu cliente y qué resultado querés alcanzar.",
        },
        {
          title: "Planificamos juntos",
          desc: "Propuesta clara con alcance, plazo y precio. Sin sorpresas. Aprobás antes de empezar.",
        },
        {
          title: "Lo construimos",
          desc: "Desarrollo con stack moderna. Seguís cada etapa en tiempo real.",
        },
        {
          title: "Vos crecés",
          desc: "Sitio en línea, soporte garantizado y evolución continua. El palomo no abandona el nido.",
        },
      ],
    },
    pricing: {
      commentLabel: "// INVERSIÓN",
      title: "Planes",
      subtitle: "Precios transparentes. Cuotas disponibles.",
      footnote: "* Cuotas disponibles.",
      plans: [
        {
          name: "Starter",
          tag: "Para empezar",
          price: "R$ 2.567",
          priceNote: "paquete completo",
          badge: null,
          cta: "Contratar",
          features: [
            "Página profesional de tu negocio",
            "Template listo adaptado para vos",
            "Diseño personalizado con tu identidad",
            "Aparece en Google",
            "Botón de contacto por e-mail o WhatsApp",
            "1 mes de soporte incluido",
          ],
        },
        {
          name: "Pro",
          tag: "Más popular ★",
          price: "R$ 5.123",
          priceNote: "paquete completo",
          badge: "★ MÁS POPULAR",
          cta: "Contratar",
          features: [
            "Todo lo del plan Starter",
            "Sitio listo en producción",
            "Diseño más completo y elaborado",
            "Varias páginas y pestañas",
            "Integración de API de pagos (PIX, tarjeta...)",
            "Blog para publicar contenido",
            "2 meses de soporte incluido",
          ],
        },
        {
          name: "Enterprise",
          tag: "A medida",
          price: "A convenir",
          priceNote: "proyecto complejo",
          badge: null,
          cta: "Contacto comercial",
          features: [
            "Proyecto hecho desde cero para tu negocio",
            "API de pago completa (PIX, tarjeta, boleto)",
            "Checkout customizado, webhooks y split",
            "App móvil nativa (iOS & Android)",
            "Inteligencia artificial personalizada",
            "Conecta con cualquier sistema",
            "Estructura robusta y escalable",
            "Soporte dedicado",
          ],
        },
      ],
    },
    contact: {
      commentLabel: "// HABLEMOS",
      title: "Contáctanos",
      subtitle: "Respondo en 24 horas.",
      labels: {
        name: "Nombre *",
        whatsapp: "WhatsApp",
        email: "E-mail *",
        business: "Tu negocio",
        message: "Mensaje *",
      },
      placeholders: {
        name: "Tu nombre",
        whatsapp: "+54 (000) 000-0000",
        email: "tu@email.com",
        message: "Contame un poco sobre tu proyecto...",
      },
      businessOptions: [
        { value: "", label: "Seleccioná..." },
        { value: "landing", label: "Landing page / Sitio institucional" },
        { value: "ecommerce", label: "E-commerce / Tienda virtual" },
        { value: "sistema", label: "Sistema / Panel admin" },
        { value: "ia", label: "Chatbot / IA" },
        { value: "outro", label: "Otro" },
      ],
      security: "Conexión segura · Datos protegidos · HTTPS",
      submit: "▸ Enviar mensaje",
      submitting: "Enviando...",
      errors: {
        nameShort: "Nombre muy corto",
        emailInvalid: "E-mail inválido",
        messageShort: "Mensaje muy corto (mínimo 10 caracteres)",
      },
      toast: {
        success: "¡Mensaje enviado! El palomo ya fue a entregar. 🐦",
        error: "Error al enviar. ¡Intentá de nuevo o mandá un WhatsApp!",
      },
    },
    chat: {
      bubbleLine1: "¿Tenés dudas?",
      bubbleLine2: "¡Hablá conmigo!",
      greeting: "¡Hola! Soy Teubaldo, asistente de pigeonz.ai. ¿Cómo puedo ayudarte?",
      placeholder: "Preguntá algo...",
      errorConnection: "Error de conexión. ¡Intentá de nuevo!",
      title: "Hablar con Teubaldo",
    },
    footer: {
      tagline: "Desarrollo fullstack para quienes quieren crecer de verdad.",
      nav: {
        title: "Navegación",
        services: "Servicios",
        howItWorks: "Cómo funciona",
        pricing: "Planes",
        contact: "Contacto",
      },
      contact: {
        title: "Contacto",
        cta: "Iniciar proyecto",
      },
      stack: {
        title: "Stack",
        categories: [
          { label: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
          { label: "Backend", items: ["Django 5", "Python 3.12", "REST Framework", "Gunicorn"] },
          { label: "Base datos", items: ["PostgreSQL 17", "Neon Serverless", "Redis"] },
          { label: "Cloud", items: ["Google Cloud Run", "AWS", "Docker", "GitHub Actions"] },
          { label: "IA", items: ["Claude AI", "Groq", "LLMs", "RAG / Embeddings"] },
          { label: "Pagos", items: ["PIX", "Tarjeta", "Boleto", "Webhooks"] },
          { label: "Auth / API", items: ["HMAC Tokens", "OAuth2", "REST", "Webhooks"] },
        ],
      },
      copyright: "Todos los derechos reservados",
      madeWith: "Hecho con ♥ y mucho café",
    },
    login: {
      title: "Accede a tu panel",
      email: "Correo o usuario",
      password: "Contraseña",
      submit: "Ingresar",
      noAccount: "¿No tienes cuenta?",
      signUp: "Crear cuenta",
      tagline: "Sitios que vuelan",
      quickFill: "Llenado rápido",
    },
    painel: {
      welcome: "Bienvenido de vuelta",
      loading: "Cargando tu panel...",
      tabs: { site: "Mi Sitio", edit: "Editar", templates: "Plantillas", support: "Soporte", payments: "Pagos" },
      status: { active: "Sitio activo", pending: "Esperando pago" },
      save: "Guardar cambios",
      saving: "Guardando...",
      saved: "¡Guardado!",
      logout: "Salir",
      backToSite: "Volver al sitio",
      logo: "LOGO",
      uploadLogo: "Subir logo",
      changeLogo: "Cambiar logo",
      heroTitle: "Título",
      heroSubtitle: "Subtítulo",
      heroBg: "Imagen de fondo del Hero",
      uploadBg: "Subir imagen de fondo",
      changeBg: "Cambiar imagen",
      noBg: "Sin imagen",
      phone: "Teléfono / WhatsApp",
      address: "Dirección",
      hours: "Horario",
      colors: "COLORES",
      primary: "Principal",
      accent: "Acento",
    },
    behindCode: {
      title: "Detrás del Código",
      subtitle: "Es mucho más que copiar y pegar imágenes en templates listos. Para crear un sitio robusto, de calidad profesional, mirá lo que pasa detrás de escena:",
      steps: [
        {
          icon: "📐", title: "Planificación & Diseño",
          desc: "Wireframes, prototipos, identidad visual, paleta de colores, tipografía, responsividad móvil — todo planificado antes de escribir una línea de código.",
          backLines: [":root {","  --primary: #48c0b8;","  --accent: #f0a0d0;","  --bg-dark: #1a0e2e;","  --radius: 8px;","}","@media (max-width: 768px) {","  .hero { font-size: clamp(18px, 4vw, 32px); }","}"],
        },
        {
          icon: "💻", title: "Desarrollo",
          desc: "Miles de líneas de código en React, Next.js, TypeScript, Django, Python. Cada botón, animación e interacción se construye desde cero con código real — no es arrastrar y soltar.",
          backLines: ["export default function Page() {","  const [data, setData] = useState(null);","  useEffect(() => {","    fetch('/api/products')","      .then(res => res.json())","      .then(setData);","  }, []);","  return <ProductGrid items={data} />;","}"],
        },
        {
          icon: "🗄️", title: "Base de Datos",
          desc: "Modelado de tablas, migraciones, consultas optimizadas, relaciones complejas. Tus datos necesitan ser almacenados con seguridad y eficiencia.",
          backLines: ["CREATE TABLE orders (","  id SERIAL PRIMARY KEY,","  user_id INT REFERENCES users(id),","  total DECIMAL(10,2) NOT NULL,","  status VARCHAR(20) DEFAULT 'pending',","  created_at TIMESTAMP DEFAULT NOW()",");","CREATE INDEX idx_orders_user","  ON orders(user_id);"],
        },
        {
          icon: "🔗", title: "Integración de APIs",
          desc: "Pagos (PIX, tarjeta, boleto), autenticación OAuth, webhooks, servicios de email, WhatsApp — cada integración requiere configuración, pruebas y manejo de errores.",
          backLines: ["const payment = await provider.create({","  amount: order.total,","  method: 'pix',","  webhook: '/api/webhook/payment',","  customer: { email, cpf },","});","await sendEmail(user.email, {","  template: 'order-confirmed',","  data: { orderId, pixCode },","});"],
        },
        {
          icon: "🌐", title: "Dominio & DNS",
          desc: "Registrar el dominio, configurar DNS, apuntar registros A/CNAME, verificar propagación. Sin esto, tu sitio no tiene dirección en internet.",
          backLines: ["# Configuración DNS","@ IN A 34.95.128.10","www IN CNAME ghs.google.com.","@ IN MX 10 mail.provider.com.","@ IN TXT \"v=spf1 include:_spf...\"","","# Verificar propagación","$ dig tusitio.com.br +short","34.95.128.10  ✓"],
        },
        {
          icon: "☁️", title: "Hosting & Deploy",
          desc: "El sitio necesita correr en un servidor 24/7. Configurar Cloud Run, containers Docker, variables de entorno, SSL/HTTPS, CI/CD — la infraestructura que mantiene todo funcionando.",
          backLines: ["FROM node:20-alpine","WORKDIR /app","COPY package*.json ./","RUN npm ci --production","COPY . .","RUN npm run build","EXPOSE 3000","CMD [\"npm\", \"start\"]","# deploy → Cloud Run ☁️"],
        },
        {
          icon: "🔒", title: "Seguridad",
          desc: "Protección contra ataques (XSS, SQL Injection, CSRF), rate limiting, headers de seguridad, HTTPS obligatorio. Un sitio sin seguridad es una invitación a problemas.",
          backLines: ["headers: [","  { key: 'X-Frame-Options',","    value: 'DENY' },","  { key: 'Content-Security-Policy',","    value: \"default-src 'self'\" },","  { key: 'Strict-Transport-Security',","    value: 'max-age=31536000' },","]","// rate limit: 20 req/min ✓"],
        },
        {
          icon: "📈", title: "Escalabilidad",
          desc: "Cuando tu negocio crece, el sitio necesita acompañar. Arquitectura robusta desde el inicio — cache, balanceo de carga, base optimizada — para no tener que reconstruir todo después.",
          backLines: ["// Caching strategy","const cache = new Map();","export async function getProducts() {","  if (cache.has('products'))","    return cache.get('products');","  const data = await db.query(","    'SELECT * FROM products'","  );","  cache.set('products', data);","  return data; // 10x faster ⚡"],
        },
        {
          icon: "🛡️", title: "Ciberseguridad",
          desc: "Firewall, encriptación de datos, protección DDoS, monitoreo de vulnerabilidades, backups automáticos. La seguridad de tu negocio y tus clientes no es opcional.",
          backLines: ["# Firewall rules","iptables -A INPUT -p tcp","  --dport 443 -j ACCEPT","# Encrypt sensitive data","const hash = await bcrypt.hash(","  password, 12",");","# Auto backup: daily 3am","0 3 * * * pg_dump db > bkp.sql","# DDoS protection: active ✓"],
        },
        {
          icon: "🧪", title: "Pruebas & Mantenimiento",
          desc: "Debugging, pruebas de compatibilidad entre navegadores, monitoreo de rendimiento, corrección de bugs, actualizaciones de dependencias. El trabajo no termina en el deploy.",
          backLines: ["$ npm run test","","PASS  tests/api/orders.test.ts","  ✓ creates order (45ms)","  ✓ validates payment (32ms)","  ✓ sends confirmation (28ms)","","Tests: 3 passed, 3 total","Time:  1.24s ✓"],
        },
      ],
      registroBr: {
        title: "Registrá tu dominio .com.br",
        desc: "El primer paso para tener tu propio sitio con dirección propia es registrar un dominio. En Brasil, Registro.br es el organismo oficial responsable de los dominios .com.br.",
        cta: "Acceder a Registro.br",
      },
      closing: "Ahora imaginá hacer todo esto solo. Por eso existe pigeonz.ai — para que vos te enfoques en tu negocio mientras nosotros nos encargamos de toda esta complejidad.",
    },
    aboutDev: {
      title: "La Desarrolladora",
      bio1: "Tengo 28 años, soy graduada en",
      bio1Psychology: "Psicología",
      bio1CompSci: "Ciencia de la Computación",
      bio2: "Soy autista, nivel 1 de soporte, y esta característica influye directamente en la forma en que trabajo. Tengo gran capacidad de concentración, atención minuciosa a los detalles y un compromiso profundo con la calidad. Cuando me involucro en un proyecto, sigo hasta el final con precisión, consistencia y cuidado en cada etapa, para que cada elemento esté en el lugar correcto y cada solución funcione de la mejor manera posible.",
      bio3pre: "nació de",
      bio3mid: "mi paloma mascota. Se convirtió en la mascota oficial de la marca, la inspiración detrás del nombre y un símbolo de que ideas notables pueden surgir de los lugares más inesperados.",
      bio3post: "Desde la infancia, siempre me fascinó la forma en que la tecnología transforma el mundo y cómo funciona la mente humana. Esa combinación me permitió crear soluciones digitales que unen lógica, sensibilidad y comprensión real de las personas.",
      teubaldoDesc: "La paloma que inspiró todo. Mascota oficial de pigeonz.ai",
    },
    templates: {
      title: "Algunos Proyectos de Nuestro Portfolio",
      seeMore: "Ver más ↓",
      collapse: "Colapsar ↑",
      cta: "Contáctanos",
      prevAriaLabel: "Template anterior",
      nextAriaLabel: "Siguiente template",
    },
    tplContent: {
      lawfirm: {
        lawOffice: "Estudio Jurídico", tagline: "Tradición, experiencia y compromiso con la justicia hace más de 20 años",
        freeConsult: "Consulta gratuita", specialties: "Especialidades", practiceAreas: "Áreas de Actuación",
        area1: "Derecho Civil", area1d: "Contratos, familia y sucesiones",
        area2: "Derecho Empresarial", area2d: "Societario y compliance",
        area3: "Derecho Laboral", area3d: "Defensa del trabajador",
        area4: "Derecho Tributario", area4d: "Planificación fiscal",
        area5: "Derecho Inmobiliario", area5d: "Compra, venta y alquiler",
        area6: "Derecho Penal", area6d: "Defensa criminal",
        whyUs: "Por qué elegirnos", proven: "Experiencia Comprobada",
        years: "Años de Actuación", cases: "Procesos", satisfaction: "Satisfacción",
        ourTeam: "Nuestro Equipo", lawyers: "Abogados",
        l1: "Dr. Ricardo", l1lic: "OAB/MG 12.345", l1area: "Derecho Civil",
        l2: "Dra. Marina", l2lic: "OAB/MG 23.456", l2area: "Derecho Laboral",
        l3: "Dr. Henrique", l3lic: "OAB/MG 34.567", l3area: "Derecho Penal",
        testimonials: "Testimonios", whatClients: "Lo que dicen nuestros clientes",
        testimonial1: "Profesionales excepcionales. Resolvieron mi caso laboral con agilidad y total transparencia. Los recomiendo a todos.",
        testimonial1Author: "— María S., Cliente desde 2019",
        need: "¿Necesita", legalHelp: "orientación jurídica",
        ctaSub: "Agende una consulta gratuita y conozca sus derechos",
        schedule: "Agendar consulta", address: "Rua Exemplo, 1000 — Sala 801", phone: "(00) 0000-0000",
      },
      fitpulse: {
        welcome: "Bienvenido de vuelta", myWorkout: "Mi Entrenamiento", today: "Hoy",
        workout1: "Superior — Pecho & Hombro", workout1Meta: "45 min · 6 ejercicios",
        startWorkout: "INICIAR ENTRENO", workoutsMonth: "Entrenos/mes", kcal: "Kcal quemadas",
        weeklyProgress: "Progreso semanal", exercise: "Ejercicio 3/6", benchPress: "Press de Banca",
        setsLeft: "series restantes", reps: "Reps", load: "Carga", rest: "Descanso",
        completeSeries: "COMPLETAR SERIE", skip: "Saltar ejercicio",
        plans: "Planes", choosePlan: "Elegí el ideal para vos",
        free: "Gratis", f1a: "3 entrenos/semana", f1b: "Ejercicios básicos",
        f2a: "Entrenos ilimitados", f2b: "Videos HD", f2c: "Nutricionista",
        f3a: "Todo del Pro", f3b: "Personal online", f3c: "Suplementos",
        planPro: "Plan Pro · 3 meses", weight: "Peso", height: "Altura",
        achievements: "Logros", a1: "7 días seguidos", a2: "50 entrenos", a3: "10k kcal",
        tagline: "Tu entreno inteligente en la palma de la mano",
      },
      petvida: {
        hello: "¡Hola, Ana!", myPets: "Mis Mascotas",
        dogBreed: "Golden Retriever · 3 años", dogAlert: "Vacuna en 5 días",
        catBreed: "Siamés · 2 años", catAlert: "Baño agendado mañana",
        vaccines: "Vacunas", bath: "Baño", appointment: "Consulta", shop: "Tiendita",
        schedule: "Agendar", chooseService: "Elegí el servicio",
        s1: "Baño & Corte", s1t: "1h30", s2: "Vacunación", s2t: "30min",
        s3: "Consulta Veterinaria", s3t: "45min", s4: "Corte Higiénico", s4t: "40min",
        petShop: "Tienda Pet", delivery: "Entrega en hasta 2h",
        dailyOffer: "Oferta del día", offerText: "20% OFF en alimento premium", useCode: "Usá: PETVIDA20",
        p1: "Alimento Premium", p2: "Collar LED", p3: "Juguete Mordedor", p4: "Shampoo Pet",
        profile: "Golden Retriever · Macho · 3 años", vacCard: "Carnet de Vacunación",
        flu: "Gripe", rabies: "Rabia",
        nextAppt: "Próximas Citas", bathLabel: "Baño", tomorrowTime: "Mañana 10h",
        vaccineLabel: "Vacuna", vaccineTime: "15/03 14h",
        tagline: "Todo para tu mascota en un solo lugar",
      },
      uaifood: {
        fastDelivery: "Entrega rápida", address: "Rua Exemplo, 100", search: "Buscar productor o plato...",
        cat1: "Casero", cat2: "Quesos", cat3: "Tropeiro", cat4: "Orgánico",
        prod1: "Rancho da Dona Maria", prod1Time: "30-45min", prod1Fee: "Gratis",
        prod2: "Sítio Boa Vista", prod2Time: "40-55min",
        localProd: "Productor local",
        dish1: "Feijão Tropeiro", dish1d: "Frijoles, chicharrón, col, huevo de campo",
        dish2: "Pollo con Quiabo", dish2d: "Pollo de campo con quiabo de la finca",
        dish3: "Pan de Queso Artesanal", dish3d: "Paquete con 20 unidades, almidón agrio",
        dish4: "Cesta del Productor", dish4d: "Queso, dulce de leche, café y rapadura",
        tracking: "Rastreo", onWay: "¡En camino!", arrives: "Llega en ~12 minutos",
        step1: "Pedido confirmado", step2: "Preparando", step3: "Salió a entregar", step4: "Entregado",
        coupons: "Cupones", saveCoupon: "Ahorrá en tu pedido",
        c1code: "UAIPRIMERO", c1desc: "R$ 15 OFF en el 1er pedido", c1min: "Mín. R$ 30",
        c2code: "FLETE0", c2desc: "Flete gratis", c2min: "Mín. R$ 25",
        c3code: "CESTA20", c3desc: "20% OFF en cestas", c3min: "Sin mínimo",
        useBtn: "Usar", subtitle: "Mercaditos, negocios locales y comida artesanal",
        feat1: "30min o gratis", feat2: "Cupones diarios", feat3: "Rastreo en tiempo real",
      },
      cards: {
        cafe: "Retro Café", cafeD: "Cafetería acogedora con menú artesanal",
        tattoo: "Tattoo Boo", tattooD: "Estudio de tatuaje con estética dark",
        astral: "Astral Bike", astralD: "Alquiler de bicis eléctricas urbanas",
        law: "Law Fall & Asociados", lawD: "Estudio jurídico tradicional",
        fitpulse: "FitPulse", fitpulseD: "App de entrenamiento y salud",
        petvida: "PetVida", petvidaD: "App para el cuidado de tu mascota",
        uaifood: "UAIfood", uaifoodD: "Delivery de comida minera artesanal",
      },
      cafe: {
        title: "Retro Café", subtitle: "// Café con sabor nostálgico", cta: "Ver Menú",
        phone: "(00) 1111-1111", address: "Calle Ejemplo, 123", hours: "Lun a Vie: 7h–19h",
        feat1: "100% Artesanal", feat1d: "Granos tostados en casa",
        feat2: "Recetas de la Abuela", feat2d: "Pasteles con sabor a infancia",
        prod1: "Espresso Artesanal", prod1d: "Blend especial",
        prod2: "Pastel de la Abuela", prod2d: "Receta secreta",
        about: "README.txt", aboutText: "Nació de la pasión por el buen café y el diseño nostálgico.",
      },
      joias: {
        title: "Velaris Joyas", subtitle: "Elegancia que brilla en cada detalle", cta: "Ver Colección",
        phone: "(00) 1111-1111", address: "Calle Ejemplo, 456", hours: "Lun a Sáb: 10h–19h",
        stats: "En números", s1: "Años de tradición", s2: "Joyas vendidas", s3: "En Google",
        prod1: "Anillo Solitario Oro 18k", prod1d: "Diamante natural 0.3ct",
        prod2: "Collar Perlas Naturales", prod2d: "Perlas cultivadas",
        about: "Nuestra Historia", aboutText: "Desde 2009 creando joyas exclusivas con diseño de autor y piedras seleccionadas.",
      },
      tech: {
        title: "TechStore", subtitle: "Tecnología a los mejores precios", cta: "Ver Productos",
        phone: "(00) 1111-1111", address: "Calle Ejemplo, 789",
        feat1: "Pago Seguro", feat1d: "Cifrado de punta a punta",
        feat2: "Entrega Express", feat2d: "Hasta 2 días hábiles",
        prod1: "Auriculares Bluetooth Pro", prod1d: "Cancelación de ruido",
        prod2: "Smartwatch Ultra", prod2d: "GPS + monitor",
        banner: "10% OFF en tu primera compra", bannerText: "Usa el cupón TECH10.", bannerBtn: "Comprar Ahora",
      },
      barber: {
        title: "Barbería Dom", subtitle: "Entra feo, sale guapo", cta: "Reservar Horario",
        phone: "(00) 1111-1111", address: "Calle Ejemplo, 100", hours: "Lun a Sáb: 9h–20h",
        stats: "Números", s1: "Cortes", s2: "Google", s3: "Años",
        prod1: "Degradé Americano", prod1d: "Tijera + máquina",
        prod2: "Corte + Barba", prod2d: "Combo completo",
        svc1: "Corte Masculino", svc1d: "Tijera o máquina",
        svc2: "Barba Completa", svc2d: "Navaja + toalla caliente",
        svc3: "Corte + Barba", svc3d: "Combo premium",
        about: "Nuestra Historia", aboutText: "Desde 2018 trayendo lo mejor del estilo masculino con tradición y actitud.",
      },
      tattooboo: {
        studioTag: "Estudio de Tatuaje & Body Art", bookSession: "Reservar sesión",
        portfolio: "Portfolio", ourWork: "Nuestros Trabajos",
        specialties: "Especialidades", styles: "Estilos",
        s1: "Blackwork", s1d: "Formas geométricas y relleno total",
        s2: "Fineline", s2d: "Trazos finos y delicados",
        s3: "Realismo", s3d: "Retratos y texturas fotográficas",
        s4: "Old School", s4d: "Colores vibrantes y trazos gruesos",
        s5: "Dotwork", s5d: "Puntillismo y mandalas",
        s6: "Lettering", s6d: "Fuentes personalizadas y caligrafía",
        team: "Equipo", artists: "Artistas",
        investment: "Inversión", prices: "Precios",
        p1: "Tattoo P", p1size: "hasta 5cm", p1price: "R$ 150", p1d: "Piezas pequeñas y minimalistas",
        p2: "Tattoo M", p2size: "5–15cm", p2price: "R$ 350", p2d: "Brazo, costilla, tobillo",
        p3: "Tattoo G", p3size: "15cm+", p3price: "Desde R$ 600", p3d: "Piezas grandes y mangas",
        ctaTitle: "¿Listo para tu tattoo?", ctaSub: "Agenda por WhatsApp o visita el estudio", ctaBtn: "Agendar ahora",
      },
      astralbike: {
        heroTitle1: "Pedalea con", heroTitle2: "Astral Bike",
        heroDesc: "500 bicicletas eléctricas por las ciudades. Desbloquea en segundos y pedalea donde quieras.",
        seePlans: "Ver planes",
        noSub: "Sin suscripción obligatoria", cancelAnytime: "Cancela cuando quieras",
        stat1: "estaciones", stat2: "bicis eléctricas", stat3: "disponible", stat4: "eléctrico",
        whereWeAre: "Dónde estamos",
        countryBR: "Brasil", countryAR: "Argentina", countryCL: "Chile", countryCO: "Colombia",
        whyTitle: "¿Por qué Astral Bike?",
        f1: "100% Eléctrica", f1d: "Motor eléctrico que te sube las cuestas sin esfuerzo.",
        f2: "Cerca de ti", f2d: "51 estaciones por la ciudad.",
        f3: "Simple y rápido", f3d: "Desbloquea por la app en segundos.",
        f4: "Plan recurrente", f4d: "Suscríbete y ten acceso ilimitado.",
        f5: "También por viaje", f5d: "Compra un viaje cuando lo necesites.",
        f6: "Ideal para la ciudad", f6d: "Evita el tráfico y llega más rápido.",
        howTitle: "Cómo funciona",
        h1: "Elige tu plan", h1d: "Individual, Mensual o Anual.",
        h2: "Paga en la app", h2d: "Completa el pago con seguridad en la app.",
        h3: "¡Pedalea!", h3d: "Desbloquea cualquier bici en las estaciones.",
        ctaTitle: "¿Vamos a pedalear?", ctaSub: "Elige el plan ideal y empieza hoy.",
      },
    },
  },

  zh: {
    nav: {
      services: "服务",
      howItWorks: "如何运作",
      pricing: "价格",
      templates: "作品集",
      contact: "联系",
    },
    hero: {
      badge: "全栈工作室",
      typed: "腾飞的网站。",
      subHeadline: "AI 优先。",
      subtitle: "为中小型企业提供全栈开发服务。精美实用的网站、移动应用和定制软件，",
      subtitleHighlight: "真正实现转化",
      ctaPricing: "查看方案",
      ctaContact: "联系我们",
    },
    whoWeAre: {
      commentLabel: "// 关于我们",
      title: "我们做什么？",
      subtitle: "我们把你的想法变成互联网上的现实。不复杂，不拖沓。",
      items: [
        {
          icon: "🛒",
          title: "在线商店，销售你的产品",
          desc: "想卖衣服、甜点、手工艺品或任何东西？我们为你创建完整的商店，带购物车、Pix和信用卡支付，一切井然有序。",
        },
        {
          icon: "📱",
          title: "手机应用",
          desc: "让你的生意在客户掌中。数字菜单、预约、产品目录——Android和iPhone都能用。",
        },
        {
          icon: "🌐",
          title: "专业的企业网站",
          desc: "一个漂亮的网站，建立信任感。你的颜色、你的标志、联系方式，以及客户在Google上找到你所需的一切。",
        },
        {
          icon: "🤖",
          title: "AI智能自动客服",
          desc: "一个24小时回答客户问题、发送报价、安排服务的聊天机器人——让你安心休息。",
        },
        {
          icon: "📊",
          title: "数据面板，掌握全局",
          desc: "不再迷茫。查看多少人访问了你的网站、多少人购买了、什么效果最好。",
        },
        {
          icon: "☁️",
          title: "SaaS平台和定制系统",
          desc: "需要自己的系统？我们构建完整的平台——SaaS、管理面板、API集成、自动化，以及你的业务扩展所需的一切。",
        },
      ],
      closing: "从个体户到准备扩展的企业——我们让技术为你的生意服务。",
    },
    services: {
      commentLabel: "// PIGEONZ 做什么",
      title: "服务",
      items: [
        {
          title: "网站 & 落地页",
          desc: "建立数字形象，提升可信度。现代响应式设计，专为转化优化。",
        },
        {
          title: "完整电商",
          desc: "带购物车、结账及支付服务商集成的在线商店。为您的业务简单设置。",
        },
        {
          title: "系统 & 仪表板",
          desc: "管理面板、CRM、ERP 及定制系统，配备强大 API 和结构化数据库。",
        },
        {
          title: "AI & 聊天机器人",
          desc: "基于 Claude/GPT 的客服机器人，自动分流，智能 FAQ。您的业务永不停歇。",
        },
        {
          title: "集成 & API",
          desc: "连接任何系统。Webhooks、OAuth、ERP、CRM、电商平台——一切所需。",
        },
        {
          title: "云 & 基础设施",
          desc: "部署于 Google Cloud、AWS 等平台。从零扩展至百万请求。",
        },
        {
          title: "安全 & 防护",
          desc: "安全头部、速率限制、HTTPS，防御 XSS、CSRF 和注入攻击。项目全面防护。",
        },
      ],
    },
    how: {
      commentLabel: "// 如何运作",
      title: "流程",
      steps: [
        {
          title: "您介绍您的业务",
          desc: "我们深入理解您的需求、您的客户是谁以及您想达到的目标。",
        },
        {
          title: "共同规划",
          desc: "清晰的范围、时间和价格提案。无意外。开始前您先审批。",
        },
        {
          title: "我们来构建",
          desc: "使用现代技术栈开发。您实时跟进每个步骤。",
        },
        {
          title: "您实现增长",
          desc: "网站上线，持续支持与迭代。鸽子永不离巢。",
        },
      ],
    },
    pricing: {
      commentLabel: "// 投资",
      title: "价格方案",
      subtitle: "价格透明。支持分期付款。",
      footnote: "* 支持分期。",
      plans: [
        {
          name: "入门版",
          tag: "快速起步",
          price: "R$ 2.567",
          priceNote: "完整套餐",
          badge: null,
          cta: "立即购买",
          features: [
            "专业的业务展示页面",
            "为您定制的现成模板",
            "含您品牌标识的个性化设计",
            "出现在 Google 搜索",
            "邮件或 WhatsApp 联系按钮",
            "含 1 个月支持",
          ],
        },
        {
          name: "专业版",
          tag: "最受欢迎 ★",
          price: "R$ 5.123",
          priceNote: "完整套餐",
          badge: "★ 最受欢迎",
          cta: "立即购买",
          features: [
            "包含入门版全部功能",
            "生产就绪网站",
            "更完整精致的设计",
            "多页面和选项卡",
            "支付 API 集成（PIX、信用卡...）",
            "内容发布博客",
            "含 2 个月支持",
          ],
        },
        {
          name: "企业版",
          tag: "量身定制",
          price: "面议",
          priceNote: "复杂项目",
          badge: null,
          cta: "商务咨询",
          features: [
            "为您的业务从零构建",
            "完整支付 API（PIX、信用卡、Boleto）",
            "定制结账、webhooks 和分账",
            "原生移动应用（iOS & Android）",
            "定制人工智能",
            "与任何系统对接",
            "稳健可扩展架构",
            "专属支持",
          ],
        },
      ],
    },
    contact: {
      commentLabel: "// 让我们交流",
      title: "联系我们",
      subtitle: "24 小时内回复。",
      labels: {
        name: "姓名 *",
        whatsapp: "WhatsApp",
        email: "电子邮件 *",
        business: "您的业务",
        message: "消息 *",
      },
      placeholders: {
        name: "您的姓名",
        whatsapp: "+86 000 0000 0000",
        email: "your@email.com",
        message: "请介绍一下您的项目...",
      },
      businessOptions: [
        { value: "", label: "请选择..." },
        { value: "landing", label: "落地页 / 企业官网" },
        { value: "ecommerce", label: "电商 / 网上商店" },
        { value: "sistema", label: "系统 / 管理后台" },
        { value: "ia", label: "聊天机器人 / AI" },
        { value: "outro", label: "其他" },
      ],
      security: "安全连接 · 数据保护 · HTTPS",
      submit: "▸ 发送消息",
      submitting: "发送中...",
      errors: {
        nameShort: "姓名太短",
        emailInvalid: "电子邮件无效",
        messageShort: "消息太短（最少 10 个字符）",
      },
      toast: {
        success: "消息已发送！鸽子正在路上。 🐦",
        error: "发送失败。请重试或发送 WhatsApp！",
      },
    },
    chat: {
      bubbleLine1: "有问题？",
      bubbleLine2: "跟我聊吧！",
      greeting: "你好！我是 Teubaldo，pigeonz.ai 助手。有什么可以帮您？",
      placeholder: "提问...",
      errorConnection: "连接错误。请重试！",
      title: "与 Teubaldo 对话",
    },
    footer: {
      tagline: "为真正想要成长的人提供全栈开发服务。",
      nav: {
        title: "导航",
        services: "服务",
        howItWorks: "如何运作",
        pricing: "价格",
        contact: "联系",
      },
      contact: {
        title: "联系",
        cta: "开始项目",
      },
      stack: {
        title: "技术栈",
        categories: [
          { label: "前端", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
          { label: "后端", items: ["Django 5", "Python 3.12", "REST Framework", "Gunicorn"] },
          { label: "数据库", items: ["PostgreSQL 17", "Neon Serverless", "Redis"] },
          { label: "云服务", items: ["Google Cloud Run", "AWS", "Docker", "GitHub Actions"] },
          { label: "AI", items: ["Claude AI", "Groq", "LLMs", "RAG / Embeddings"] },
          { label: "支付", items: ["PIX", "信用卡", "Boleto", "Webhooks"] },
          { label: "Auth / API", items: ["HMAC Tokens", "OAuth2", "REST", "Webhooks"] },
        ],
      },
      copyright: "版权所有",
      madeWith: "用 ♥ 和大量咖啡制作",
    },
    login: {
      title: "访问您的面板",
      email: "邮箱或用户名",
      password: "密码",
      submit: "登录",
      noAccount: "没有账户？",
      signUp: "创建账户",
      tagline: "会飞的网站",
      quickFill: "快速填写",
    },
    painel: {
      welcome: "欢迎回来",
      loading: "正在加载您的面板...",
      tabs: { site: "我的网站", edit: "编辑", templates: "模板", support: "支持", payments: "付款" },
      status: { active: "网站已激活", pending: "等待付款" },
      save: "保存更改",
      saving: "保存中...",
      saved: "已保存！",
      logout: "退出",
      backToSite: "返回网站",
      logo: "标志",
      uploadLogo: "上传标志",
      changeLogo: "更换标志",
      heroTitle: "标题",
      heroSubtitle: "副标题",
      heroBg: "主页背景图片",
      uploadBg: "上传背景",
      changeBg: "更换图片",
      noBg: "无图片",
      phone: "电话 / WhatsApp",
      address: "地址",
      hours: "营业时间",
      colors: "颜色",
      primary: "主色",
      accent: "强调色",
    },
    behindCode: {
      title: "代码背后",
      subtitle: "远不止在现成模板里复制粘贴图片。要创建一个稳健的、专业品质的网站，来看看幕后发生了什么：",
      steps: [
        {
          icon: "📐", title: "规划与设计",
          desc: "线框图、原型、视觉识别、调色板、排版、移动端响应式——一切都在编写一行代码之前规划好。",
          backLines: [":root {","  --primary: #48c0b8;","  --accent: #f0a0d0;","  --bg-dark: #1a0e2e;","  --radius: 8px;","}","@media (max-width: 768px) {","  .hero { font-size: clamp(18px, 4vw, 32px); }","}"],
        },
        {
          icon: "💻", title: "开发",
          desc: "用 React、Next.js、TypeScript、Django、Python 编写数千行代码。每个按钮、动画和交互都是用真实代码从零构建的——不是拖拽操作。",
          backLines: ["export default function Page() {","  const [data, setData] = useState(null);","  useEffect(() => {","    fetch('/api/products')","      .then(res => res.json())","      .then(setData);","  }, []);","  return <ProductGrid items={data} />;","}"],
        },
        {
          icon: "🗄️", title: "数据库",
          desc: "表建模、迁移、优化查询、复杂关系。您的数据需要安全高效地存储。",
          backLines: ["CREATE TABLE orders (","  id SERIAL PRIMARY KEY,","  user_id INT REFERENCES users(id),","  total DECIMAL(10,2) NOT NULL,","  status VARCHAR(20) DEFAULT 'pending',","  created_at TIMESTAMP DEFAULT NOW()",");","CREATE INDEX idx_orders_user","  ON orders(user_id);"],
        },
        {
          icon: "🔗", title: "API 集成",
          desc: "支付（PIX、信用卡、Boleto）、OAuth 认证、webhooks、邮件服务、WhatsApp——每个集成都需要配置、测试和错误处理。",
          backLines: ["const payment = await provider.create({","  amount: order.total,","  method: 'pix',","  webhook: '/api/webhook/payment',","  customer: { email, cpf },","});","await sendEmail(user.email, {","  template: 'order-confirmed',","  data: { orderId, pixCode },","});"],
        },
        {
          icon: "🌐", title: "域名与 DNS",
          desc: "注册域名、配置 DNS、指向 A/CNAME 记录、验证传播。没有这些，您的网站就没有互联网地址。",
          backLines: ["# DNS 配置","@ IN A 34.95.128.10","www IN CNAME ghs.google.com.","@ IN MX 10 mail.provider.com.","@ IN TXT \"v=spf1 include:_spf...\"","","# 验证传播","$ dig yoursite.com.br +short","34.95.128.10  ✓"],
        },
        {
          icon: "☁️", title: "托管与部署",
          desc: "网站需要在服务器上 24/7 运行。配置 Cloud Run、Docker 容器、环境变量、SSL/HTTPS、CI/CD——维持一切运行的基础设施。",
          backLines: ["FROM node:20-alpine","WORKDIR /app","COPY package*.json ./","RUN npm ci --production","COPY . .","RUN npm run build","EXPOSE 3000","CMD [\"npm\", \"start\"]","# deploy → Cloud Run ☁️"],
        },
        {
          icon: "🔒", title: "安全",
          desc: "防御攻击（XSS、SQL 注入、CSRF）、速率限制、安全头、强制 HTTPS。没有安全的网站就是在招惹麻烦。",
          backLines: ["headers: [","  { key: 'X-Frame-Options',","    value: 'DENY' },","  { key: 'Content-Security-Policy',","    value: \"default-src 'self'\" },","  { key: 'Strict-Transport-Security',","    value: 'max-age=31536000' },","]","// rate limit: 20 req/min ✓"],
        },
        {
          icon: "📈", title: "可扩展性",
          desc: "当您的业务增长时，网站需要跟上。从第一天起就采用稳健的架构——缓存、负载均衡、优化数据库——这样以后就不需要重建一切。",
          backLines: ["// Caching strategy","const cache = new Map();","export async function getProducts() {","  if (cache.has('products'))","    return cache.get('products');","  const data = await db.query(","    'SELECT * FROM products'","  );","  cache.set('products', data);","  return data; // 10x faster ⚡"],
        },
        {
          icon: "🛡️", title: "网络安全",
          desc: "防火墙、数据加密、DDoS防护、漏洞监控、自动备份。您的业务和客户的安全不是可选项。",
          backLines: ["# Firewall rules","iptables -A INPUT -p tcp","  --dport 443 -j ACCEPT","# Encrypt sensitive data","const hash = await bcrypt.hash(","  password, 12",");","# Auto backup: daily 3am","0 3 * * * pg_dump db > bkp.sql","# DDoS protection: active ✓"],
        },
        {
          icon: "🧪", title: "测试与维护",
          desc: "调试、跨浏览器兼容性测试、性能监控、Bug 修复、依赖更新。工作不会在部署后结束。",
          backLines: ["$ npm run test","","PASS  tests/api/orders.test.ts","  ✓ creates order (45ms)","  ✓ validates payment (32ms)","  ✓ sends confirmation (28ms)","","Tests: 3 passed, 3 total","Time:  1.24s ✓"],
        },
      ],
      registroBr: {
        title: "注册您的 .com.br 域名",
        desc: "拥有自己网址的第一步是注册域名。在巴西，Registro.br 是 .com.br 域名的官方管理机构。",
        cta: "访问 Registro.br",
      },
      closing: "现在想象一下自己完成所有这些。这就是 pigeonz.ai 存在的原因——让您专注于业务，我们来处理所有这些复杂性。",
    },
    aboutDev: {
      title: "开发者",
      bio1: "我28岁，毕业于",
      bio1Psychology: "心理学",
      bio1CompSci: "计算机科学",
      bio2: "我是自闭症谱系，一级支持需求，这个特质直接影响了我的工作方式。我拥有极强的专注力、对细节的细致关注以及对质量的深层承诺。当我投入一个项目时，我会以精确、一致和细心贯穿每个阶段，确保每个元素都在正确的位置，每个解决方案都以最佳方式运行。",
      bio3pre: "源自",
      bio3mid: "我的宠物鸽子。他成为了品牌的官方吉祥物、名字背后的灵感，也是一个象征——非凡的想法可以来自最意想不到的地方。",
      bio3post: "从小，我就对技术如何改变世界以及人类思维如何运作充满了好奇。这种结合让我创造出融合逻辑、感性和对人的真正理解的数字解决方案。",
      teubaldoDesc: "启发一切的鸽子。pigeonz.ai 的官方吉祥物",
    },
    templates: {
      title: "我们作品集中的一些项目",
      seeMore: "查看更多 ↓",
      collapse: "收起 ↑",
      cta: "联系我们",
      prevAriaLabel: "上一个模板",
      nextAriaLabel: "下一个模板",
    },
    tplContent: {
      lawfirm: {
        lawOffice: "律师事务所", tagline: "传统、经验和对正义的承诺，超过20年",
        freeConsult: "免费咨询", specialties: "专业领域", practiceAreas: "执业范围",
        area1: "民法", area1d: "合同、家庭和继承",
        area2: "商法", area2d: "公司和合规",
        area3: "劳动法", area3d: "劳动者权益",
        area4: "税法", area4d: "税务规划",
        area5: "房地产法", area5d: "买卖和租赁",
        area6: "刑法", area6d: "刑事辩护",
        whyUs: "为什么选择我们", proven: "经验丰富",
        years: "执业年限", cases: "案件", satisfaction: "满意度",
        ourTeam: "我们的团队", lawyers: "律师",
        l1: "Ricardo 博士", l1lic: "OAB/MG 12.345", l1area: "民法",
        l2: "Marina 博士", l2lic: "OAB/MG 23.456", l2area: "劳动法",
        l3: "Henrique 博士", l3lic: "OAB/MG 34.567", l3area: "刑法",
        testimonials: "客户评价", whatClients: "客户怎么说",
        testimonial1: "出色的专业人士。他们高效透明地解决了我的劳动案件。强烈推荐。",
        testimonial1Author: "— Maria S.，2019年起的客户",
        need: "需要", legalHelp: "法律指导",
        ctaSub: "预约免费咨询，了解您的权利",
        schedule: "预约咨询", address: "Rua Exemplo, 1000 — 801室", phone: "(00) 0000-0000",
      },
      fitpulse: {
        welcome: "欢迎回来", myWorkout: "我的训练", today: "今天",
        workout1: "上半身 — 胸部和肩部", workout1Meta: "45分钟 · 6个动作",
        startWorkout: "开始训练", workoutsMonth: "月训练次数", kcal: "消耗千卡",
        weeklyProgress: "每周进度", exercise: "动作 3/6", benchPress: "卧推",
        setsLeft: "组剩余", reps: "次数", load: "重量", rest: "休息",
        completeSeries: "完成组", skip: "跳过动作",
        plans: "方案", choosePlan: "选择适合您的",
        free: "免费", f1a: "每周3次训练", f1b: "基础动作",
        f2a: "无限训练", f2b: "高清视频", f2c: "营养师",
        f3a: "包含Pro全部", f3b: "线上私教", f3c: "补剂",
        planPro: "Pro方案 · 3个月", weight: "体重", height: "身高",
        achievements: "成就", a1: "连续7天", a2: "50次训练", a3: "10k千卡",
        tagline: "掌中智能训练",
      },
      petvida: {
        hello: "你好，Ana！", myPets: "我的宠物",
        dogBreed: "金毛寻回犬 · 3岁", dogAlert: "5天后接种疫苗",
        catBreed: "暹罗猫 · 2岁", catAlert: "明天预约洗澡",
        vaccines: "疫苗", bath: "洗澡", appointment: "就诊", shop: "商店",
        schedule: "预约", chooseService: "选择服务",
        s1: "洗澡和美容", s1t: "1小时30分", s2: "疫苗接种", s2t: "30分钟",
        s3: "兽医就诊", s3t: "45分钟", s4: "卫生修剪", s4t: "40分钟",
        petShop: "宠物商店", delivery: "2小时内送达",
        dailyOffer: "今日特惠", offerText: "优质粮食8折", useCode: "使用: PETVIDA20",
        p1: "优质粮食", p2: "LED项圈", p3: "磨牙玩具", p4: "宠物洗毛液",
        profile: "金毛寻回犬 · 公 · 3岁", vacCard: "疫苗接种卡",
        flu: "流感", rabies: "狂犬病",
        nextAppt: "即将到来的预约", bathLabel: "洗澡", tomorrowTime: "明天10点",
        vaccineLabel: "疫苗", vaccineTime: "3/15 14点",
        tagline: "宠物一站式服务",
      },
      uaifood: {
        fastDelivery: "快速配送", address: "Rua Exemplo, 100", search: "搜索生产者或菜品...",
        cat1: "家常", cat2: "奶酪", cat3: "Tropeiro", cat4: "有机",
        prod1: "Rancho da Dona Maria", prod1Time: "30-45分钟", prod1Fee: "免费",
        prod2: "Sítio Boa Vista", prod2Time: "40-55分钟",
        localProd: "本地生产者",
        dish1: "Feijão Tropeiro", dish1d: "豆类、猪皮、羽衣甘蓝、土鸡蛋",
        dish2: "秋葵鸡", dish2d: "农场散养鸡配农场秋葵",
        dish3: "手工奶酪面包", dish3d: "20个装，酸木薯粉",
        dish4: "生产者礼篮", dish4d: "奶酪、牛奶糖、咖啡和红糖",
        tracking: "追踪", onWay: "配送中！", arrives: "约12分钟到达",
        step1: "订单已确认", step2: "准备中", step3: "已出发配送", step4: "已送达",
        coupons: "优惠券", saveCoupon: "节省您的订单",
        c1code: "UAIFIRST", c1desc: "首单减R$15", c1min: "最低R$30",
        c2code: "FRETE0", c2desc: "免运费", c2min: "最低R$25",
        c3code: "CESTA20", c3desc: "礼篮8折", c3min: "无最低消费",
        useBtn: "使用", subtitle: "本地市场、小商户和手工美食",
        feat1: "30分钟或免费", feat2: "每日优惠券", feat3: "实时追踪",
      },
      cards: {
        cafe: "复古咖啡馆", cafeD: "温馨的手工咖啡馆",
        tattoo: "Tattoo Boo", tattooD: "暗黑风纹身工作室",
        astral: "Astral Bike", astralD: "城市电动自行车租赁",
        law: "Law Fall & 合伙人", lawD: "传统律师事务所",
        fitpulse: "FitPulse", fitpulseD: "健身健康应用",
        petvida: "PetVida", petvidaD: "宠物护理应用",
        uaifood: "UAIfood", uaifoodD: "手工米纳斯美食配送",
      },
      cafe: {
        title: "复古咖啡馆", subtitle: "// 怀旧风味的咖啡", cta: "查看菜单",
        phone: "(00) 1111-1111", address: "示例路123号", hours: "周一至周五: 7:00–19:00",
        feat1: "100% 手工制作", feat1d: "店内烘焙咖啡豆",
        feat2: "奶奶的配方", feat2d: "童年味道的蛋糕",
        prod1: "手工浓缩咖啡", prod1d: "特调拼配",
        prod2: "奶奶的蛋糕", prod2d: "秘密配方",
        about: "README.txt", aboutText: "源于对好咖啡和怀旧设计的热爱。",
      },
      joias: {
        title: "Velaris 珠宝", subtitle: "每个细节都闪耀优雅", cta: "查看系列",
        phone: "(00) 1111-1111", address: "示例路456号", hours: "周一至周六: 10:00–19:00",
        stats: "数据一览", s1: "年传统", s2: "已售珠宝", s3: "Google评分",
        prod1: "18K金单钻戒指", prod1d: "天然0.3克拉钻石",
        prod2: "天然珍珠项链", prod2d: "养殖珍珠",
        about: "我们的故事", aboutText: "自2009年起，以原创设计和精选宝石打造独家珠宝。",
      },
      tech: {
        title: "TechStore", subtitle: "最优价格的科技产品", cta: "查看产品",
        phone: "(00) 1111-1111", address: "示例路789号",
        feat1: "安全支付", feat1d: "端到端加密",
        feat2: "极速配送", feat2d: "最快2个工作日",
        prod1: "蓝牙Pro耳机", prod1d: "降噪功能",
        prod2: "Smartwatch Ultra", prod2d: "GPS + 监测",
        banner: "首购9折优惠", bannerText: "使用优惠码 TECH10。", bannerBtn: "立即购买",
      },
      barber: {
        title: "Dom 理发店", subtitle: "进来普通，出去帅气", cta: "预约时间",
        phone: "(00) 1111-1111", address: "示例路100号", hours: "周一至周六: 9:00–20:00",
        stats: "数据", s1: "理发次数", s2: "Google", s3: "年",
        prod1: "美式渐变", prod1d: "剪刀 + 推剪",
        prod2: "理发 + 修须", prod2d: "完整套餐",
        svc1: "男士理发", svc1d: "剪刀或推剪",
        svc2: "全面修须", svc2d: "直剃刀 + 热毛巾",
        svc3: "理发 + 修须", svc3d: "高级套餐",
        about: "我们的故事", aboutText: "自2018年起，以传统和态度带来最佳男士风格。",
      },
      tattooboo: {
        studioTag: "纹身工作室 & 人体艺术", bookSession: "预约纹身",
        portfolio: "作品集", ourWork: "我们的作品",
        specialties: "专长", styles: "风格",
        s1: "黑色图腾", s1d: "几何图形和实心填充",
        s2: "细线条", s2d: "纤细精致的线条",
        s3: "写实", s3d: "肖像和摄影级纹理",
        s4: "老派风格", s4d: "鲜艳色彩和粗线条",
        s5: "点刺", s5d: "点描和曼陀罗",
        s6: "字体设计", s6d: "定制字体和书法",
        team: "团队", artists: "艺术家",
        investment: "价格", prices: "价目表",
        p1: "小纹身", p1size: "5cm以内", p1price: "R$ 150", p1d: "小巧极简作品",
        p2: "中纹身", p2size: "5–15cm", p2price: "R$ 350", p2d: "手臂、肋骨、脚踝",
        p3: "大纹身", p3size: "15cm+", p3price: "R$ 600起", p3d: "大型作品和花臂",
        ctaTitle: "准备好纹身了吗？", ctaSub: "通过WhatsApp预约或到店咨询", ctaBtn: "立即预约",
      },
      astralbike: {
        heroTitle1: "骑行", heroTitle2: "Astral Bike",
        heroDesc: "500辆电动自行车遍布城市。几秒解锁，随心骑行。",
        seePlans: "查看套餐",
        noSub: "无强制订阅", cancelAnytime: "随时取消",
        stat1: "站点", stat2: "电动自行车", stat3: "全天候", stat4: "纯电动",
        whereWeAre: "我们在哪",
        countryBR: "巴西", countryAR: "阿根廷", countryCL: "智利", countryCO: "哥伦比亚",
        whyTitle: "为什么选择 Astral Bike？",
        f1: "100% 电动", f1d: "电动马达轻松爬坡。",
        f2: "就在身边", f2d: "51个站点遍布城市。",
        f3: "简单快捷", f3d: "通过应用几秒解锁。",
        f4: "订阅计划", f4d: "订阅后无限使用。",
        f5: "单次也行", f5d: "需要时购买单次骑行。",
        f6: "城市出行首选", f6d: "避开交通拥堵，更快到达。",
        howTitle: "如何使用",
        h1: "选择套餐", h1d: "单次、月付或年付。",
        h2: "应用内支付", h2d: "在应用内安全完成支付。",
        h3: "开始骑行！", h3d: "在站点解锁任意自行车。",
        ctaTitle: "准备骑行？", ctaSub: "选择理想套餐，今天开始。",
      },
    },
  },
};

export default translations;
