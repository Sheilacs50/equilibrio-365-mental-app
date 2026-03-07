// js/content.js
(function(){

  const CURRICULUM = [
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
Reserve alguns minutos para respirar, desacelerar e perceber como você está se sentindo hoje.`
        },
        {
          id:"f2",
          titulo:"Rotina mínima (15 min)",
          tipo:"prática",
          duracao:"15 min",
          texto:`Escolha três pequenas ações para iniciar o dia:
• beber água
• respirar profundamente
• organizar algo simples

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
• isso é um fato ou interpretação?
• existe outra forma de olhar para isso?`
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
• o que causou isso?
• o que poderia melhorar um ponto?`
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

  const STORAGE_DONE = "equilibrio365_content_done";
  const STORAGE_NOTES = "equilibrio365_content_notes";

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

  function getProgress(done){
    let total = 0;
    let ok = 0;

    CURRICULUM.forEach(mod => {
      mod.aulas.forEach(aula => {
        total++;
        if(done[aula.id]) ok++;
      });
    });

    return { ok, total };
  }

  function renderContent(){
    const done = loadDone();
    const notes = loadNotes();
    const progress = getProgress(done);

    let html = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div>
            <div style="font-weight:900; font-size:18px;">Conteúdo do Planner</div>
            <div class="small">Progresso: ${progress.ok}/${progress.total}</div>
          </div>
          <div class="badge">${Math.round((progress.ok / (progress.total || 1)) * 100)}%</div>
        </div>
      </div>
    `;

    CURRICULUM.forEach(mod => {
      html += `
        <div class="card">
          <div style="font-weight:900; font-size:18px;">${mod.titulo}</div>
          <div class="small" style="margin-bottom:10px;">${mod.descricao}</div>
      `;

      mod.aulas.forEach(aula => {
        const checked = !!done[aula.id];

        html += `
          <div style="padding:12px 0; border-top:1px solid rgba(255,255,255,0.10);">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
              <div>
                <div style="font-weight:900;">${aula.titulo}</div>
                <div class="small">${aula.tipo} • ${aula.duracao}</div>
              </div>

              <button class="badge contentToggle" data-aula="${aula.id}" type="button">
                ${checked ? "✅" : "⬜"}
              </button>
            </div>

            <div style="margin:10px 0; line-height:1.4; color:rgba(255,255,255,0.90); white-space:pre-line;">
              ${aula.texto}
            </div>

            <textarea class="contentNote" data-aula="${aula.id}" placeholder="Anote aqui (opcional)...">${notes[aula.id] || ""}</textarea>
          </div>
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

})();
