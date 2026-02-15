// Script para gerar as questões do PAS 1 2025 em formato JSON
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions2025 = [];

// ===========================================
// PARTE 1 - LÍNGUA ESTRANGEIRA
// ===========================================

// ESPANHOL (Questões 1-10, páginas 1-2 da parte 1)
const espanholQuestions = [
  {
    num: 1,
    statement: "Proyecto Templo Mayor\n\nEl 21 de febrero de 1978 obreros de la Compañía de Luz y Fuerza localizaron la escultura monumental de Coyolxauhqui. El hallazgo de este monolito marcó un antes y un después en el estudio de la cultura mexica.\n\nDe acuerdo con el texto anterior, juzgue el siguiente ítem:\n\nEstá prohibido tomar fotografías en el Templo Mayor, tanto en las salas del museo como en la zona arqueológica.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 1
  },
  {
    num: 2,
    statement: "Se puede inferir que el museo permanece cerrado los lunes.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 3,
    statement: "La modificación del plan original de la institución cultural se produjo al haber encontrado una obra monumental.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 4,
    statement: "Los viajeros extranjeros que quieran visitar las instalaciones culturales y arqueológicas de forma gratuita deberán ir los domingos.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 5,
    statement: "Telescopio Espacial James Webb\n\nEl Telescopio Espacial James Webb es el instrumento de observación astronómica más potente jamás construido. Se empezó a desarrollar en 1996 y en 2002 fue renombrado como James Webb.\n\nCon base en la lectura del texto anterior, juzgue:\n\nEs posible inferir que el telescopio James Webb podrá ayudar a identificar la existencia de vida extraterrestre.",
    answer: "C",
    type: "C",
    hasImage: true,
    pageRef: 1
  },
  {
    num: 6,
    statement: "El escudo usado para el telescopio James Webb lo protege del frío intenso.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 7,
    statement: "El telescopio comenzó a desarrollarse mucho antes de tener el nombre con el que se le conoce actualmente.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 8,
    statement: "El componente reflector principal del telescopio está formado por varias piezas geométricas y recubierto con un material precioso que dificulta el reflejo de la luz infrarroja.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 9,
    statement: "La separación entre el telescopio y nuestro planeta es comparable a la que existe entre la Luna y la Tierra.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 1
  },
  {
    num: 10,
    statement: "Derechos humanos - La Constitución Federal de 1988 presentó una nueva perspectiva discursiva en lo que se refiere a la garantía de derechos en Brasil.\n\nSegún la Constitución brasileña en vigor, el principio de igualdad ante la ley",
    answer: "A",
    type: "C",
    hasImage: true,
    pageRef: 1,
    alternatives: [
      "A) abarca tanto a los ciudadanos del país como a las personas extranjeras que residen en él.",
      "B) beneficia únicamente a quienes poseen la nacionalidad brasileña.",
      "C) se aplica de manera diferenciada según la condición económica del individuo.",
      "D) excluye a los brasileños residentes en el exterior."
    ]
  }
];

espanholQuestions.forEach(q => {
  questions2025.push({
    id: `2025-esp-${q.num.toString().padStart(2, '0')}`,
    year: 2025,
    stage: 1,
    questionNumber: q.num,
    type: q.type,
    subject: "Espanhol",
    statement: q.statement,
    alternatives: q.alternatives || null,
    correctAnswer: q.answer,
    hasImage: q.hasImage,
    imageUrl: q.hasImage ? `/images/questions/2025/parte1-page-01.png` : null,
    pageRef: q.pageRef
  });
});

// FRANCÊS (Questões 1-10, páginas 1-2 da parte 1)
const francesQuestions = [
  {
    num: 1,
    statement: "Le droit international relatif aux droits humains\n\nLe droit international relatif aux droits humains énonce les obligations des États de protéger les droits et les libertés des individus et groupes d'individus.\n\nSelon le texte ci-dessus, jugez l'item suivant:\n\nLa Charte des Nations Unies a été adoptée par l'Assemblée générale de l'ONU en 1948.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 2
  },
  {
    num: 2,
    statement: "Le droit international des droits humains traite des devoirs de chaque État envers les individus et groupes d'individus.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 3,
    statement: "Le pronom « y », dans la dernière phrase du texte, fait référence au socle des droits humains.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 4,
    statement: "Fruit des recherches conduites au temple principal de la culture mexica\n\nLe 21 février 1978, les sous-sols de la grouillante ville de Mexico livrent l'un des secrets les plus exceptionnels de la Mésoamérique.\n\nD'après le texte présenté, jugez:\n\nLes fouilles archéologiques de l'ancienne cité de Tenochtitlán ont duré deux siècles.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 2
  },
  {
    num: 5,
    statement: "Les rituels, les arts et l'architecture de l'Empire mexica sont encore inconnus avant la découverte du site archéologique.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 6,
    statement: "La découverte de l'ancienne cité de Tenochtitlán a été prévue depuis le 21 février 1978.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 7,
    statement: "James Webb éclaire les zones d'ombre de l'astrophysique\n\nVéritable bijou de technologie, le télescope spatial James Webb explore depuis plus de deux ans les moindres recoins de l'Univers.\n\nA partir du texte ci-dessus, jugez:\n\nGrâce à son immense miroir, le JWST a une sensibilité très supérieure à celle du téléscope antérieur.",
    answer: "C",
    type: "C",
    hasImage: true,
    pageRef: 2
  },
  {
    num: 8,
    statement: "Le JWST permet l'étude de galaxies formées à environ une centaine de millions d'années avant le Big Bang.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 9,
    statement: "Le télescope spatial James Webb a été mis en service après juillet 2022.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 2
  },
  {
    num: 10,
    statement: "Dans « le James Webb Space Telescope (JWST) est en mesure d'explorer une palette beaucoup plus vaste de corps célestes », l'expression « une palette » peut être remplacée, sans perdre le sens, par",
    answer: "A",
    type: "C",
    hasImage: false,
    pageRef: 2,
    alternatives: [
      "A) une gamme.",
      "B) une bande.",
      "C) une partie.",
      "D) un chemin."
    ]
  }
];

francesQuestions.forEach(q => {
  questions2025.push({
    id: `2025-fra-${q.num.toString().padStart(2, '0')}`,
    year: 2025,
    stage: 1,
    questionNumber: q.num,
    type: q.type,
    subject: "Francês",
    statement: q.statement,
    alternatives: q.alternatives || null,
    correctAnswer: q.answer,
    hasImage: q.hasImage,
    imageUrl: q.hasImage ? `/images/questions/2025/parte1-page-02.png` : null,
    pageRef: q.pageRef
  });
});

// INGLÊS (Questões 1-10, páginas 2-3 da parte 1)
const inglesQuestions = [
  {
    num: 1,
    statement: "When Spanish conquistadors arrived in Tenochtitlán (modern-day Mexico City), they were astounded by the scale and grandeur of the Templo Mayor. However, they also witnessed human sacrifices taking place at its summit.\n\nAbout the previous text, judge the following item:\n\nAccording to the text, the depicture of Coyolxauhqui's dismembered body is present in the temple as a way of remembering the human sacrifices mentioned in the first paragraph.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 3
  },
  {
    num: 2,
    statement: "It would be reasonable to infer from the last sentence of the text that Coyolxauhqui was the goddess of the moon.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 3,
    statement: "The last sentence of the text confirms the Aztec origin of the Templo Mayor and its mythic symbology.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 4,
    statement: "The words \"However\" (last sentence of the first paragraph) and \"though\" (first sentence of the second paragraph) have a similar meaning in the text as each of them has the function of linking contrasting pieces of information.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 5,
    statement: "About 39% of the sky is potentially visible to Webb at any given time. Over the course of 6 months, Webb has a view of almost the entire sky.\n\nBased on the information about the James Webb space telescope, judge:\n\nThe verbs \"must\" and \"can\" could be used interchangeably without altering the original meaning of the text.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 3
  },
  {
    num: 6,
    statement: "It is correct to conclude from the text that the Continuous Viewing Zones are part of the 39% of the sky mentioned in the first sentence of the text.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 7,
    statement: "The text is clear when it states that the fact that Mars can be observed by Webb is due to the planet's high temperature.",
    answer: "E",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 8,
    statement: "In the first sentence of the second paragraph, the word \"its\" indicates that the \"ability\" mentioned after it refers to the Webb telescope.",
    answer: "C",
    type: "C",
    hasImage: false,
    pageRef: 3
  },
  {
    num: 9,
    statement: "Brazil's Constitution ratified in 1988 has strong provisions for land to serve a social function.\n\nBased on the presented text, judge:\n\nThe text states that the relation between the social function of land and the results of the allocation of land is objectively and explicitly defined in the articles of the Brazilian Constitution.",
    answer: "E",
    type: "C",
    hasImage: true,
    pageRef: 3
  },
  {
    num: 10,
    statement: "According to the text, the Brazilian Constitution",
    answer: "D",
    type: "C",
    hasImage: false,
    pageRef: 3,
    alternatives: [
      "A) protects poverty.",
      "B) opposes property.",
      "C) determines the distribution of land to the poor.",
      "D) establishes a variety of social rights."
    ]
  }
];

inglesQuestions.forEach(q => {
  questions2025.push({
    id: `2025-ing-${q.num.toString().padStart(2, '0')}`,
    year: 2025,
    stage: 1,
    questionNumber: q.num,
    type: q.type,
    subject: "Inglês",
    statement: q.statement,
    alternatives: q.alternatives || null,
    correctAnswer: q.answer,
    hasImage: q.hasImage,
    imageUrl: q.hasImage ? `/images/questions/2025/parte1-page-03.png` : null,
    pageRef: q.pageRef
  });
});

// ===========================================
// PARTE 2 - Questões Interdisciplinares
// ===========================================

// Gabarito parte 2 (excluindo anulados X, tipo B e tipo D):
// 11-X, 12-C, 13-C, 14-E, 15-E, 16-E, 17-C, 18-X, 19-C, 20-A
// 21-C, 22-E, 23-E, 24-C, 25-E, 26-C, 27-E, 28-C, 29-E, 30-C
// 31-E, 32-C, 33-C, 34-E, 35-E, 36-C, 37-E, 38-C, 39-C, 40-E, 41-E
// 42-E, 43-E, 44-E, 45-C, 46-C, 47-C, 48-B(625), 49-X, 50-C, 51-B
// 52-E, 53-C, 54-E, 55-C, 56-C, 57-B(124), 58-C, 59-E, 60-E, 61-C, 62-D
// 63-E, 64-C, 65-E, 66-C, 67-C, 68-E, 69-E, 70-C
// 71-C, 72-C, 73-E, 74-E, 75-C, 76-C, 77-X, 78-D
// 79-E, 80-C, 81-E, 82-C, 83-E, 84-C, 85-A
// 86-C, 87-E, 88-E, 89-C, 90-E, 91-E, 92-C, 93-E, 94-C, 95-B, 96-D, 97-B, 98-C
// 99-C, 100-E

const parte2Questions = [
  // Questões 12-17 (História/Literatura - Carta de Caminha e Palmares 1999)
  { num: 12, subject: "História", answer: "C", statement: "Até o século XVII, a colonização portuguesa na América estava, em grande medida, baseada na escravização dos povos indígenas, que resistiam a esse processo, o que era, para os portugueses, uma dificuldade para a efetivação da colonização.", hasImage: true, page: 1 },
  { num: 13, subject: "História", answer: "C", statement: "Os colonizadores portugueses levaram mais de um século para transformar a ocupação do território em exploração econômica, centrada, a partir do século XVII, no tráfico transatlântico de pessoas oriundas do continente africano.", hasImage: false, page: 1 },
  { num: 14, subject: "Artes", answer: "E", statement: "No vídeo de referência de Palmares 1999, é possível identificar os instrumentos musicais bateria, baixo elétrico, um dueto de instrumentos de sopro formado por trompete e trombone, guitarra, teclado e percussão, além da presença do vocalista e de três mulheres como backing vocals.", hasImage: false, page: 1 },
  { num: 15, subject: "História", answer: "E", statement: "Visto que a colonização portuguesa na América se consolidou por meio do tráfico transatlântico de indivíduos nativos do continente africano, é correto afirmar que a sociedade em formação no território que viria a se tornar o Brasil era definida por somente uma língua e uma cultura: a africana.", hasImage: false, page: 1 },
  { num: 16, subject: "História", answer: "E", statement: "Em diferentes partes do mundo atlântico, a chamada diáspora africana, violento processo de imigração forçada de milhares de pessoas originárias do continente africano, resultou na aculturação dos sujeitos escravizados, que se tornaram pessoas sem quaisquer objetivos ou projetos de vida e sem capacidade de ação política autônoma.", hasImage: false, page: 1 },
  { num: 17, subject: "História", answer: "C", statement: "Embora a escravidão não seja uma invenção moderna, a transferência forçada de milhares de pessoas escravizadas do continente africano para as colônias europeias nas Américas é um dos elementos definidores da chamada Era Moderna.", hasImage: false, page: 1 },
  { num: 19, subject: "Artes", answer: "C", statement: "Palmares 1999 é uma música no estilo reggae, que é de origem caribenha e tem como características um ritmo lento em um compasso quaternário, com acentuação no segundo e no quarto tempos, que são os tempos fracos do compasso, feita geralmente pela guitarra, e com uma linha de baixo melódica de certa complexidade.", hasImage: false, page: 1 },
  { num: 20, subject: "Português", answer: "A", statement: "O trecho reproduzido da carta de Caminha", hasImage: true, page: 1, alternatives: ["A) revela um olhar etnocêntrico dos portugueses na medida em que eles não compreendem o valor da \"pedra ruim\" para o indígena, o que evidencia o início do estabelecimento de relações econômica e politicamente assimétricas.", "B) revela uma relação de reciprocidade igualitária baseada na troca justa entre uma \"pedra ruim\" e um \"sombreiro velho\".", "C) indica o reconhecimento da alteridade indígena pelos portugueses.", "D) indica que tanto os indígenas quanto os portugueses reconheceram valores universais compartilhados."] },
  
  // Questões 21-26 (Templo Mayor / Matemática / Química)
  { num: 21, subject: "Artes", answer: "C", statement: "A arquitetura pré-colombiana mesoamericana se caracteriza por complexos arquitetônicos piramidais de grandes proporções.", hasImage: true, page: 2 },
  { num: 22, subject: "História", answer: "E", statement: "O Templo Mayor de Tenochtitlán é um complexo arquitetônico que inclui fortificações piramidais para a defesa militar em períodos de guerra.", hasImage: false, page: 2 },
  { num: 23, subject: "Matemática", answer: "E", statement: "Se, a cada reconstrução, a altura do templo tiver aumentado de acordo com uma progressão aritmética, então a diferença de altura entre a primeira fase da construção e a sua versão final é de 29 metros.", hasImage: false, page: 2 },
  { num: 24, subject: "Matemática", answer: "C", statement: "Os ângulos correspondentes aos vértices D e C na seção transversal do Templo Mayor medem, respectivamente, 120° e 135°.", hasImage: true, page: 2 },
  { num: 25, subject: "Matemática", answer: "E", statement: "A área da seção transversal da terceira fase de construção do Templo Mayor é superior a 3.570 m².", hasImage: false, page: 2 },
  { num: 26, subject: "Matemática", answer: "C", statement: "Se, em um lote específico com 1.400 artefatos, os arqueólogos classificarem 540 deles como objetos cerimoniais, 400 como objetos para a guerra e o restante como fragmentos de cerâmica, então os fragmentos de cerâmica corresponderão a uma quantia inferior a 33% do total de artefatos do lote.", hasImage: false, page: 2 },
  
  // Questões 27-30 (Busto de Nefertiti / Química / Artes)
  { num: 27, subject: "Artes", answer: "E", statement: "O escultor do busto de Nefertiti aplicou à obra a regra da frontalidade da arte egípcia, o que decorre principalmente na sequência harmoniosa de cores que ele escolheu para os ornamentos da figura.", hasImage: true, page: 3 },
  { num: 28, subject: "Química", answer: "C", statement: "Ambas as substâncias CaO e CaSO₄∙2H₂O contêm um metal alcalinoterroso em sua constituição.", hasImage: false, page: 3 },
  { num: 29, subject: "Química", answer: "E", statement: "O óxido de cálcio da cal e o sulfato de cálcio di-hidratado do gesso são substâncias polar e apolar, respectivamente.", hasImage: false, page: 3 },
  { num: 30, subject: "Artes", answer: "C", statement: "Na arte egípcia antiga, a representação do faraó e de sua esposa devia retratar o caráter divino dos personagens por meio de uma expressão distante e atemporal conferida ao olhar das figuras.", hasImage: false, page: 3 },
  
  // Questões 31-41 (Sol no peito / Constituição / Direitos humanos)
  { num: 31, subject: "Filosofia", answer: "E", statement: "A tradição filosófica corrobora o entendimento expresso no texto constitucional, haja vista a reiterada afirmação, ainda pelos pensadores antigos e medievais, da igualdade entre mulheres e homens.", hasImage: true, page: 3 },
  { num: 32, subject: "Sociologia", answer: "C", statement: "Na canção Sol no peito, a preocupação da mãe expressa no verso \"Oi filho, você tá vivo? Me conta como foi seu dia?\" está fundada no fato de que o Brasil, de formação histórica patriarcal, é um dos países em que mais ocorrem atos de violência contra pessoas transgênero.", hasImage: false, page: 3 },
  { num: 33, subject: "Sociologia", answer: "C", statement: "A canção Sol no peito reafirma que o reconhecimento das diferenças é condição fundamental para a construção da igualdade de direitos.", hasImage: false, page: 3 },
  { num: 34, subject: "Sociologia", answer: "E", statement: "Conclui-se do verso \"Só quero mudar de nome\", da canção Sol no peito, e do trecho apresentado do art. 5.º da Constituição Federal de 1988 que as pessoas transgênero estão impedidas de trocar de nome oficialmente no Brasil.", hasImage: false, page: 3 },
  { num: 35, subject: "Sociologia", answer: "E", statement: "A luta e a organização do movimento LGBTQIA+ visa, entre outros objetivos, incluir na Constituição Federal de 1988 menção às pessoas transgênero, visto que a redação do art. 5.º não é inclusiva em relação a essas pessoas.", hasImage: false, page: 3 },
  { num: 36, subject: "Filosofia", answer: "C", statement: "A efetivação dos direitos humanos depende do reconhecimento da alteridade e do respeito às identidades diversas, pois a garantia da dignidade humana requer o acolhimento do outro em sua diferença.", hasImage: false, page: 3 },
  { num: 37, subject: "Português", answer: "E", statement: "Seriam preservados o sentido e a correção gramatical do caput do art. 5.º da Constituição Federal de 1988 caso o trecho \"do direito à vida, à liberdade, à igualdade, à segurança e à propriedade\" fosse assim reescrito: do direito à vida, a liberdade, a igualdade, a segurança e a propriedade.", hasImage: false, page: 3 },
  { num: 38, subject: "Português", answer: "C", statement: "O último verso desse trecho da canção apresenta elementos do português brasileiro coloquial.", hasImage: false, page: 3 },
  { num: 39, subject: "Filosofia", answer: "C", statement: "É própria dos seres humanos a possibilidade de autodeterminação, portanto a identidade de gênero pode ser distinta da identidade sexual biológica.", hasImage: false, page: 3 },
  { num: 40, subject: "História", answer: "E", statement: "Os cinco livros das Ordenações Filipinas seguiam os mesmos preceitos jurídicos das constituições modernas, de modo que noções como igualdade civil e liberdade eram princípios organizadores do antigo regime português.", hasImage: false, page: 3 },
  { num: 41, subject: "História", answer: "E", statement: "Nos antigos regimes, a censura era considerada uma violação do consagrado direito constitucional de liberdade de expressão e entendida como um abuso cometido pelos governantes.", hasImage: false, page: 3 },
  
  // Questões 42-47, 50-51 (Satélites / Física)
  { num: 42, subject: "Física", answer: "E", statement: "Se a altura da órbita do satélite for de 800 km, então a distância que o satélite terá percorrido desde o lançamento do foguete até dar uma volta completa na própria órbita terá sido igual a 800 + 1.600π km.", hasImage: true, page: 4 },
  { num: 43, subject: "Física", answer: "E", statement: "Desprezando-se a massa perdida pelo foguete devido ao consumo de combustível, a variação da energia potencial gravitacional do satélite ao subir até a altura h será mSgh.", hasImage: false, page: 4 },
  { num: 44, subject: "Física", answer: "E", statement: "Depois de lançar o satélite, o foguete irá cair, em queda livre, percorrendo o mesmo trajeto, na mesma direção radial em que ele subiu.", hasImage: false, page: 4 },
  { num: 45, subject: "Física", answer: "C", statement: "Não é possível lançar dois satélites, em órbitas circulares de mesma altura, que tenham diferentes períodos de revolução em torno da Terra.", hasImage: false, page: 4 },
  { num: 46, subject: "Física", answer: "C", statement: "A altura h atingida pelo foguete não depende da massa do foguete nem da do satélite.", hasImage: false, page: 4 },
  { num: 47, subject: "Física", answer: "C", statement: "A velocidade do satélite necessária para que ele tenha uma órbita circular em torno da Terra depende da raiz quadrada da massa da Terra.", hasImage: false, page: 4 },
  { num: 50, subject: "Física", answer: "C", statement: "Supondo que a trajetória vertical de subida do foguete possa ser descrita pela função quadrática h(t) = vLFt – gt²/2, assinale a opção que apresenta a altura máxima atingida pelo foguete.", hasImage: true, page: 4, alternatives: ["A) (vLF)²/g", "B) vLF/g", "C) (vLF)²/2g", "D) vLF/2g"] },
  { num: 51, subject: "Física", answer: "B", statement: "Suponha que o satélite S1 tenha sido lançado a uma altura de 6.400 km, e o satélite S2, a uma altura de 19.200 km. Assinale a opção que corresponde à razão entre as velocidades de S1 e S2.", hasImage: false, page: 4, alternatives: ["A) 2", "B) √2", "C) √3", "D) 3"] },
  
  // Questões 52-56 (Foguetes / Química)
  { num: 52, subject: "Química", answer: "E", statement: "O vapor d'água liberado em altas altitudes pelos foguetes não tem relevância para o efeito estufa, pois a água em estado gasoso não é um gás de efeito estufa.", hasImage: true, page: 5 },
  { num: 53, subject: "Química", answer: "C", statement: "O CO₂ retém parte da radiação infravermelha devolvida pela superfície terrestre ao espaço.", hasImage: false, page: 5 },
  { num: 54, subject: "Química", answer: "E", statement: "O oxigênio molecular (O₂) é uma molécula covalente polar de geometria linear.", hasImage: false, page: 5 },
  { num: 55, subject: "Química", answer: "C", statement: "O CO₂ gerado na queima do querosene é um gás de efeito estufa de longa duração, que contribui para o aquecimento global.", hasImage: false, page: 5 },
  { num: 56, subject: "Química", answer: "C", statement: "O querosene pode ser extraído do petróleo por meio de um processo de separação conhecido como destilação fracionada.", hasImage: false, page: 5 },
  
  // Questões 58-61 (Petrarca / Literatura)
  { num: 58, subject: "Português", answer: "C", statement: "Se amor não é qual é este sentimento? - Francesco Petrarca\n\nÉ correto concluir do emprego de vocativos na segunda estrofe do poema que o sujeito lírico dirige-se ao próprio sentimento, o qual ele nomeia de \"morte\" e \"mal\".", hasImage: true, page: 5 },
  { num: 59, subject: "Português", answer: "E", statement: "Ao recorrer a antíteses e contradições para abordar o tema do amor, o poeta trabalha literariamente com o estilo árcade.", hasImage: false, page: 5 },
  { num: 60, subject: "Português", answer: "E", statement: "As duas primeiras estrofes do poema seguem o esquema de rimas alternadas.", hasImage: false, page: 5 },
  { num: 61, subject: "Português", answer: "C", statement: "Esse poema de Francesco Petrarca classifica-se como soneto, forma poética fixa consagrada pelos poetas classicistas.", hasImage: false, page: 5 },
  
  // Questões 63-70 (Rameau / Epicteto / Teatro)
  { num: 63, subject: "Artes", answer: "E", statement: "No vídeo de referência da ópera barroca cômica Platée — \"Dis donc, dis donc pourquoi? Quoi?\" —, nota-se, na interpretação da música, uma presença maior de cantoras, dado o predomínio de vozes femininas, do que de cantores.", hasImage: true, page: 6 },
  { num: 64, subject: "Artes", answer: "C", statement: "Dos tipos de obra citados no texto como as principais obras de Rameau — motetos, cantatas e óperas —, é correto concluir que o compositor se concentrou mais em obras que incluíam canto do que em obras exclusivamente instrumentais.", hasImage: false, page: 6 },
  { num: 65, subject: "Português", answer: "E", statement: "No fragmento de texto apresentado, as formas verbais \"Queres\", \"examina\" e \"empreende\" estão flexionadas no modo imperativo, mas as ações por elas expressas direcionam-se a pessoas diferentes.", hasImage: true, page: 6 },
  { num: 66, subject: "Filosofia", answer: "C", statement: "Infere-se da argumentação de Epicteto no trecho apresentado que a responsabilidade do atleta está relacionada às suas possibilidades de autodeterminação e às suas escolhas éticas.", hasImage: false, page: 6 },
  { num: 67, subject: "Português", answer: "C", statement: "O propósito comunicativo do fragmento de texto apresentado é instruir ou orientar o interlocutor acerca da realização de um conjunto de atividades.", hasImage: false, page: 6 },
  { num: 68, subject: "Filosofia", answer: "E", statement: "Epicteto é reconhecido como pensador estoico cuja filosofia influenciou Sócrates e seus discípulos Platão e Aristóteles.", hasImage: false, page: 6 },
  { num: 69, subject: "Artes", answer: "E", statement: "Na tragédia grega clássica, o coro comentava e aconselhava as ações das personagens para promover a conscientização política e a reflexão do público, enquanto, na comédia grega clássica, os comentários do coro visavam alienar, com humor, o público.", hasImage: true, page: 6 },
  { num: 70, subject: "Artes", answer: "C", statement: "O coro, no teatro grego clássico, representava a voz do coletivo, ou seja, o ponto de vista da comunidade, promovendo reflexão e contribuindo para fazer do teatro um ato social.", hasImage: false, page: 6 },
  
  // Questões 71-76, 78 (Cerrado / Geografia / Biologia)
  { num: 71, subject: "Geografia", answer: "C", statement: "A interação histórica entre comunidades humanas e o ambiente em práticas de manejo sustentável no cerrado é conhecida como sociobiodiversidade.", hasImage: true, page: 7 },
  { num: 72, subject: "Português", answer: "C", statement: "Nos três primeiros parágrafos do segundo excerto apresentado anteriormente, o nome próprio \"Nina Laranjeiras\", a expressão \"A pesquisadora\" e o pronome \"Ela\" compõem uma cadeia que garante coesão referencial no texto.", hasImage: false, page: 7 },
  { num: 73, subject: "Português", answer: "E", statement: "Considerando-se a regência do verbo esquecer conforme preconizada pela norma padrão do português, o segmento \"Não nos esqueçamos que o Cerrado\" poderia ser substituído por Não esqueçamos de que o Cerrado, sem prejuízo da correção gramatical.", hasImage: false, page: 7 },
  { num: 74, subject: "Geografia", answer: "E", statement: "As práticas produtivas sustentáveis estão intrinsicamente relacionadas às comunidades tradicionais que ocupam o cerrado, sendo um exemplo dessas práticas o plantio direto, cujo princípio fundamental é o revolvimento intenso da terra.", hasImage: false, page: 7 },
  { num: 75, subject: "Geografia", answer: "C", statement: "No cerrado, o avanço do agronegócio já supera as taxas de desmatamento registradas na Amazônia, o que o consolida como a principal frente de expansão agropecuária do Brasil.", hasImage: false, page: 7 },
  { num: 76, subject: "Geografia", answer: "C", statement: "A ocupação tradicional do cerrado está condicionada a fatores físicos que influenciam tanto a distribuição espacial das comunidades tradicionais quanto suas práticas produtivas sustentáveis.", hasImage: false, page: 7 },
  { num: 78, subject: "Geografia", answer: "D", statement: "Considerando aspectos relativos ao relevo e ao clima da região Centro-Oeste, assinale a opção correta acerca da Chapada dos Veadeiros.", hasImage: false, page: 7, alternatives: ["A) Do ponto de vista geomorfológico, cachoeiras e corredeiras são feições típicas de regiões com relevo antigo.", "B) A abundância de água na Chapada dos Veadeiros deve-se às chuvas bem distribuídas durante todo o ano.", "C) O relevo da Chapada dos Veadeiros é predominantemente acidentado, o que impede a mecanização agrícola.", "D) O clima tropical sazonal, típico da região da Chapada dos Veadeiros, condiciona as práticas agrícolas e extrativistas das comunidades locais."] },
  
  // Questões 79-85 (Agricultura / Química / Biologia)
  { num: 79, subject: "Biologia", answer: "E", statement: "As enzimas, que são insensíveis a variações de temperatura ou pH, são consumidas durante as reações enzimáticas que ocorrem nos alimentos ao longo do período de armazenamento.", hasImage: true, page: 8 },
  { num: 80, subject: "Química", answer: "C", statement: "O termo \"higroscopicidade\" diz respeito à propriedade de certos materiais absorverem ou reterem umidade do ambiente.", hasImage: false, page: 8 },
  { num: 81, subject: "Química", answer: "E", statement: "A oxidação de lipídios e as reações enzimáticas são transformações químicas, ao passo que a degradação de vitaminas é um processo físico.", hasImage: false, page: 8 },
  { num: 82, subject: "Biologia", answer: "C", statement: "O nitrogênio (N) dos fertilizantes contribui para a síntese de proteínas nas plantas porque os aminoácidos (base das proteínas) contêm nitrogênio.", hasImage: false, page: 8 },
  { num: 83, subject: "Biologia", answer: "E", statement: "A fotossíntese, um processo de geração de energia que ocorre nos organismos clorofilados, acontece nas suas cristas mitocondriais.", hasImage: false, page: 8 },
  { num: 84, subject: "Química", answer: "C", statement: "Considere a oxidação enzimática da tirosina (C₉H₁₁NO₃) catalisada pela enzima tirosinase: a C₉H₁₁NO₃ + b O₂ → c C₉H₉NO₄ + d H₂O. Nesse caso, a = b = c = d = 1 satisfaz as condições para o correto balanceamento.", hasImage: false, page: 8 },
  { num: 85, subject: "Química", answer: "A", statement: "Sabendo-se que o nitrato de amônio (NH₄NO₃) é um fertilizante mineral rico em nitrogênio, é correto afirmar que o nitrato de amônio é um exemplo de substância em que estão presentes ligações", hasImage: false, page: 8, alternatives: ["A) iônicas e covalentes.", "B) iônicas e metálicas.", "C) covalentes e metálicas.", "D) iônicas, apenas."] },
  
  // Questões 86-98 (Ilhas oceânicas / Biologia / Matemática / Física)
  { num: 86, subject: "Matemática", answer: "C", statement: "Se a taxa de observação de interações I(t) tiver sido constante ao longo do tempo de observação t, em horas, então I(t) pode ser corretamente descrita pela função afim I(t) = 7,25t.", hasImage: true, page: 9 },
  { num: 87, subject: "Matemática", answer: "E", statement: "Considere que o peixe-limpador neon-cata-piolho fará a remoção de 800 parasitas de um tubarão-lixa, de maneira a garantir a remoção de 50% dos parasitas a cada sessão de limpeza. Nesse caso, após a 4.ª sessão de limpeza, o número de parasitas será inferior a 2,5% da quantidade inicial.", hasImage: false, page: 9 },
  { num: 88, subject: "Geografia", answer: "E", statement: "O atol das Rocas é uma reserva biológica sob proteção integral do Sistema Nacional de Unidades de Conservação (SNUC), de modo que é cobrada de visitantes e turistas uma taxa de preservação ambiental.", hasImage: false, page: 9 },
  { num: 89, subject: "Geografia", answer: "C", statement: "A formação geológica do arquipélago de Fernando de Noronha está relacionada a erupções vulcânicas submarinas ocorridas há milhões de anos, que resultaram na elevação de rochas magmáticas acima do nível do mar.", hasImage: false, page: 9 },
  { num: 90, subject: "Geografia", answer: "E", statement: "A pesca no entorno do Parque Nacional de Fernando de Noronha é um exemplo de prática de desenvolvimento econômico sustentável, já que promove o aumento da renda local sem provocar impactos relevantes nos ecossistemas marinhos.", hasImage: false, page: 9 },
  { num: 91, subject: "Matemática", answer: "E", statement: "Considere que a população do bodião-de-noronha satisfaz ao modelo P(t) = 8000 / (1 + 15e^(-0,15t)). Nesse caso, a população para de crescer no momento em que atinge 4.000 indivíduos.", hasImage: false, page: 9 },
  { num: 92, subject: "Português", answer: "C", statement: "No trecho \"quando os peixes predadores se concedem momentos de trégua e se submetem à limpeza realizada por outros peixes e camarões\", o vocábulo \"se\", em suas duas ocorrências, desempenha funções sintáticas diferentes.", hasImage: false, page: 9 },
  { num: 93, subject: "Biologia", answer: "E", statement: "De acordo com o texto apresentado, os peixes limpadores e as espécies clientes são competidores, mas mantêm a propriedade de sua história evolutiva concernente em eventualmente aceitar ajudar uns aos outros.", hasImage: false, page: 9 },
  { num: 94, subject: "Física", answer: "C", statement: "Caso a pressão máxima suportada por um peixe seja de 2 atm, então este peixe deve, para sua segurança e bem-estar, nadar sempre a uma profundidade menor que 10 m.", hasImage: false, page: 9 },
  { num: 95, subject: "Matemática", answer: "B", statement: "Sabendo-se que o atol das Rocas está localizado a aproximadamente 267 km de Natal, no Rio Grande do Norte, é correto afirmar que, em um mapa cuja escala seja de 1:5.000.000, a distância aproximada entre Natal e o atol das Rocas será igual a", hasImage: false, page: 9, alternatives: ["A) 2,67 cm.", "B) 5,34 cm.", "C) 13,35 cm.", "D) 53,40 cm."] },
  { num: 96, subject: "Biologia", answer: "D", statement: "Conclui-se do trecho reproduzido do texto Aliança do fundo do mar que a relação ecológica predominante entre os peixes-limpadores e seus clientes é o", hasImage: false, page: 9, alternatives: ["A) parasitismo.", "B) comensalismo.", "C) amensalismo.", "D) mutualismo."] },
  { num: 97, subject: "Física", answer: "B", statement: "Se um peixe de 100 kg estiver em repouso a 5 m de profundidade em uma região do mar sem corrente, então o volume ocupado pelo peixe será igual a", hasImage: false, page: 9, alternatives: ["A) 0,05 m³.", "B) 0,10 m³.", "C) 0,15 m³.", "D) 0,20 m³."] },
  { num: 98, subject: "Português", answer: "C", statement: "Predomina no segundo parágrafo do excerto a tipologia textual", hasImage: false, page: 9, alternatives: ["A) argumentativa.", "B) descritiva.", "C) expositiva.", "D) narrativa."] },
  
  // Questões 99-100 (A pena e a lei)
  { num: 99, subject: "Artes", answer: "C", statement: "A pena e a lei - Ariano Suassuna\n\nUma rubrica pode sinalizar ações e reações não verbais da peça, indicando comportamentos e hábitos das personagens para além do que dizem em diálogos.", hasImage: true, page: 10 },
  { num: 100, subject: "Artes", answer: "E", statement: "O trecho proporciona um entendimento preciso do que Ariano Suassuna queria indicar com as ações e escolhas estéticas da peça, de forma que não é possível qualquer outra proposta de montagem e estética, já que estas estão bem definidas na rubrica.", hasImage: false, page: 10 }
];

parte2Questions.forEach(q => {
  questions2025.push({
    id: `2025-${q.num.toString().padStart(2, '0')}`,
    year: 2025,
    stage: 1,
    questionNumber: q.num,
    type: q.alternatives ? "C" : "C",
    subject: q.subject,
    statement: q.statement,
    alternatives: q.alternatives || null,
    correctAnswer: q.answer,
    hasImage: q.hasImage,
    imageUrl: q.hasImage ? `/images/questions/2025/parte2-page-${q.page.toString().padStart(2, '0')}.png` : null,
    pageRef: q.page
  });
});

// Output - save to file
const outputPath = path.join(__dirname, '..', 'temp-2025-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions2025, null, 2), 'utf8');
console.log(`Saved ${questions2025.length} questions to ${outputPath}`);
