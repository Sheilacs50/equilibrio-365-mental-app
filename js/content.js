// js/content.js
(function(){
  // Conteúdo (você pode aumentar depois)
  const CURRICULUM = [
    {
      id: "fundamentos",
      titulo: "Fundamentos do Equilíbrio",
      descricao: "Base emocional, rotina e autocuidado.",
      aulas: [
        { id:"f1", titulo:"Autocuidado real", tipo:"leitura", duracao:"10 min", texto:"Separe 10 minutos para cuidar de você: água, banho calmo, respiração, alongamento e uma pausa sem culpa." },
        { id:"f2", titulo:"Rotina mínima (15 min)", tipo:"prática", duracao:"15 min", texto:"Escolha 3 passos: (1) respirar 1 min, (2) organizar 1 coisa, (3) caminhar 5 min. Faça o possível." },
        { id:"f3", titulo:"Mapa de gatilhos e sinais", tipo:"exercício", duracao:"20 min", texto:"Liste 3 gatilhos, 3 sinais no corpo e 3 ações de cuidado para cada um." },
      ]
    },
    {
      id: "ansiedade",
      titulo: "Ansiedade e Regulação",
      descricao: "Técnicas simples para reduzir pico de ansiedade.",
      aulas: [
        { id:"a1", titulo:"Respiração 4-7-8", tipo:"prática", duracao:"5 min", texto:"Inspire 4s, segure 7s, solte 8s. Repita 4 vezes." },
        { id:"a2", titulo:"Aterramento 5-4-3-2-1", tipo:"prática", duracao:"7 min", texto:"5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que prova." },
        { id:"a3", titulo:"Diário: pensamentos automáticos", tipo:"exercício", duracao:"15 min", texto:"Anote: situação → pensamento → emoção → resposta mais gentil possível." },
      ]
    }
  ];

  const STORAGE_DONE = "equilibrio365_content_done"; // {aulaId:true}
  const STORAGE_NOTES = "equilibrio365_content_notes"; // {aulaId:"texto"}

  function loadDone(){
    return JSON.parse(localStorage.getItem(STORAGE_DONE) || "{}");
  }
  function saveDone(obj){
    localStorage.setItem(STORAGE_DONE, JSON.stringify(obj));
  }

  function loadNotes(){
    return JSON.parse(localStorage.getItem(STORAGE_NOTES) || "{}");
  }
  function saveNotes(obj){
    localStorage.setItem(STORAGE_NOTES, JSON.stringify(obj));
  }

  function progress(done){
    let total = 0, ok = 0;
    CURRICULUM.forEach(mod => {
      mod.aulas.forEach(a => {
        total++;
        if(done[a.id]) ok++;
      });
    });
    return { ok, total };
  }

  function renderContent(){
    const done = loadDone();
    const notes = loadNotes();
    const p = progress(done);

    let html = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div>
            <div style="font-weight:900; font-size:18px;">Conteúdo Programático</div>
            <div class="small">Progresso: ${p.ok}/${p.total}</div>
          </div>
          <div class="badge">${Math.round((p.ok/(p.total||1))*100)}%</div>
        </div>
      </div>
    `;

    CURRICULUM.forEach(mod => {
      html += `
        <div class="card">
          <div style="font-weight:900; font-size:18px;">${mod.titulo}</div>
          <div class="small" style="margin-bottom:10px;">${mod.descricao}</div>
          <div style="border-top:1px solid rgba(255,255,255,0.10); margin:10px 0;"></div>
      `;

      mod.aulas.forEach(a => {
        const isDone = !!done[a.id];
        html += `
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.10);">
            <div style="min-width:0;">
              <div style="font-weight:900;">${a.titulo}</div>
              <div class="small">${a.tipo} • ${a.duracao}</div>
            </div>
            <button class="badge contentToggle" data-aula="${a.id}" type="button">
              ${isDone ? "✅" : "⬜"}
            </button>
          </div>

          <div style="margin:8px 0 12px; color:rgba(255,255,255,0.86);">
            ${a.texto}
          </div>

          <textarea class="contentNote" data-aula="${a.id}" placeholder="Anote aqui (opcional)..." style="margin-bottom:12px;">${notes[a.id] || ""}</textarea>
        `;
      });

      html += `</div>`;
    });

    return html;
  }

  function bindContentEvents(root, onRefresh){
    const done = loadDone();
    const notes = loadNotes();

    root.querySelectorAll(".contentToggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.aula;
        done[id] = !done[id];
        saveDone(done);
        onRefresh();
      });
    });

    root.querySelectorAll(".contentNote").forEach(area => {
      area.addEventListener("input", () => {
        const id = area.dataset.aula;
        notes[id] = area.value;
        saveNotes(notes);
      });
    });
  }

  window.Content = {
    renderContent,
    bindContentEvents
  };
  window.CURRICULUM = [

{
  id: "fundamentos",
  titulo: "Fundamentos do Equilíbrio",
  descricao: "Base emocional, rotina e autocuidado.",
  aulas: [
    {
      id:"f1",
      titulo:"Autocuidado real",
      tipo:"leitura",
      duracao:"10 min",
      texto:`Autocuidado não é apenas descanso ou lazer. 
É prestar atenção no que seu corpo e mente precisam.
Reserve alguns minutos para respirar, desacelerar e 
perceber como você está se sentindo hoje.`
    },
    {
      id:"f2",
      titulo:"Rotina mínima (15 min)",
      tipo:"prática",
      duracao:"15 min",
      texto:`Escolha três pequenas ações para iniciar o dia:
• beber água
• respirar profundamente
• organizar algo simples.
Pequenas rotinas constroem estabilidade emocional.`
    },
    {
      id:"f3",
      titulo:"Mapa de gatilhos",
      tipo:"exercício",
      duracao:"20 min",
      texto:`Escreva situações que geram ansiedade ou estresse.
Pergunte-se:
• o que aconteceu?
• como eu reagi?
• o que eu poderia fazer diferente?`
    }
  ]
},

{
  id: "ansiedade",
  titulo: "Ansiedade e Regulação",
  descricao: "Técnicas simples para reduzir pico de ansiedade.",
  aulas: [
    {
      id:"a1",
      titulo:"Respiração 4-7-8",
      tipo:"prática",
      duracao:"5 min",
      texto:`Inspire contando até 4.
Segure o ar por 7 segundos.
Expire lentamente por 8 segundos.
Repita 4 vezes.`
    },
    {
      id:"a2",
      titulo:"Aterramento 5-4-3-2-1",
      tipo:"prática",
      duracao:"7 min",
      texto:`Observe:
5 coisas que você vê
4 que pode tocar
3 que pode ouvir
2 que pode cheirar
1 que pode saborear`
    },
    {
      id:"a3",
      titulo:"Pensamentos automáticos",
      tipo:"exercício",
      duracao:"15 min",
      texto:`Escreva um pensamento negativo que apareceu hoje.
Pergunte:
• Isso é um fato ou interpretação?
• Existe outra forma de olhar para isso?`
    }
  ]
},

{
  id: "emocoes",
  titulo: "Gestão das Emoções",
  descricao: "Reconhecer e regular emoções.",
  aulas: [
    {
      id:"e1",
      titulo:"Nomeando emoções",
      tipo:"leitura",
      duracao:"10 min",
      texto:`Identificar emoções ajuda o cérebro a processá-las.
Pergunte:
Estou triste? frustrada? cansada?
Nomear emoções diminui a intensidade delas.`
    },
    {
      id:"e2",
      titulo:"Escala emocional",
      tipo:"exercício",
      duracao:"10 min",
      texto:`Avalie seu humor de 1 a 10.
Pergunte-se:
• O que causou isso?
• O que poderia melhorar um ponto?`
    },
    {
      id:"e3",
      titulo:"Pausa de regulação",
      tipo:"prática",
      duracao:"8 min",
      texto:`Pare por alguns minutos.
Respire profundamente.
Solte os ombros.
Observe o ambiente ao redor.
Permita que seu corpo desacelere.`
    }
  ]
},

{
  id: "rotina",
  titulo: "Rotina de Bem-Estar",
  descricao: "Pequenos hábitos para equilíbrio mental.",
  aulas: [
    {
      id:"r1",
      titulo:"Sono e descanso",
      tipo:"leitura",
      duracao:"10 min",
      texto:`Dormir bem é essencial para saúde mental.
Evite telas antes de dormir e crie um ritual de descanso.`
    },
    {
      id:"r2",
      titulo:"Organização mental",
      tipo:"prática",
      duracao:"12 min",
      texto:`Liste as 3 tarefas mais importantes do dia.
Concentre-se nelas antes de qualquer outra coisa.`
    },
    {
      id:"r3",
      titulo:"Gratidão diária",
      tipo:"exercício",
      duracao:"10 min",
      texto:`Escreva 3 coisas boas que aconteceram hoje.
Mesmo pequenas vitórias contam.`
    }
  ]
}

];
})();
