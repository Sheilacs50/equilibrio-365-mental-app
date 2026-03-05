// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const KEY_PIN = "equilibrio365_pin";
  const KEY_HUMOR = "equilibrio365_humor"; // {dateKey:{mood:"🙂",note:""}}
  const KEY_ALARMS = "equilibrio365_alarms"; // {dateKey:"HH:MM"}

  const KEY_CHECKLIST = "equilibrio365_checklist"; // {dateKey:{id:true}}

  const DEFAULT_TASKS = [
    { id:"agua", label:"Beber água" },
    { id:"respirar", label:"Respirar 1 minuto" },
    { id:"organizar", label:"Organizar 1 coisa" },
    { id:"caminhar", label:"Caminhar 5 min" },
    { id:"gratidao", label:"Gratidão (1 frase)" },
    { id:"financas", label:"Organizar finanças" },
  ];

  function isRegistered(){ return !!localStorage.getItem(KEY_PIN); }
  function savePin(pin){ localStorage.setItem(KEY_PIN, pin); }
  function validatePin(pin){ return localStorage.getItem(KEY_PIN) === pin; }

  function loadJSON(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function saveJSON(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function renderSetup(){
    app.innerHTML = `
      <div class="container">
        <div class="logo">
          <h1>🌿 Equilíbrio <span>365</span></h1>
          <p class="sub">Crie uma senha de 4 dígitos</p>
        </div>

        <input type="password" inputmode="numeric" id="newPin" maxlength="4" placeholder="Crie sua senha (4 dígitos)" />
        <button class="btnPrimary" id="createBtn" type="button">Criar senha</button>
      </div>
    `;

    document.getElementById("createBtn").onclick = () => {
      const pin = document.getElementById("newPin").value.trim();
      if(pin.length !== 4 || !/^\d{4}$/.test(pin)){
        alert("Digite 4 números.");
        return;
      }
      savePin(pin);
      renderLogin();
    };
  }

  function renderLogin(){
    app.innerHTML = `
      <div class="container">
        <div class="logo">
          <h1>🌿 Equilíbrio <span>365</span></h1>
          <p class="sub">Digite sua senha</p>
        </div>

        <input type="password" inputmode="numeric" id="loginPin" maxlength="4" placeholder="Digite sua senha" />
        <button class="btnPrimary" id="loginBtn" type="button">Entrar</button>
      </div>
    `;

    document.getElementById("loginBtn").onclick = () => {
      const pin = document.getElementById("loginPin").value.trim();
      if(validatePin(pin)) renderHome("agenda");
      else alert("Senha incorreta.");
    };
  }

  function renderHome(activeTab){
    const now = new Date();
    const monthName = UI.monthName(now);
    const year = now.getFullYear();

    app.innerHTML = `
      <div class="container" id="homeRoot">
        ${UI.header({
          titleLeft: `${monthName} ${year}`,
          titleRight: ``,
          onTopRight: `<button id="logoutBtn" class="tabBtn" type="button" style="width:auto;">Sair</button>`
        })}
        ${UI.tabs(activeTab)}
        <div id="viewArea"></div>
      </div>
    `;

    document.getElementById("logoutBtn").onclick = () => renderLogin();

    const root = document.getElementById("homeRoot");
    root.querySelectorAll(".tabBtn[data-tab]").forEach(b=>{
      b.addEventListener("click", ()=>{
        renderHome(b.dataset.tab);
      });
    });

    const view = document.getElementById("viewArea");
    if(activeTab === "agenda"){
      view.innerHTML = renderAgenda();
      bindAgenda(view);
    }
    if(activeTab === "content"){
      view.innerHTML = Content.renderContent();
      Content.bindContentEvents(view, ()=>renderHome("content"));
    }
    if(activeTab === "checklist"){
      view.innerHTML = renderChecklist();
      bindChecklist(view);
    }
  }

  // ---------- AGENDA ----------
  function renderAgenda(){
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const daysInMonth = new Date(y, m+1, 0).getDate();

    const savedHumor = loadJSON(KEY_HUMOR, {});
    const alarms = loadJSON(KEY_ALARMS, {});

    let registered = 0;
    for(let i=1;i<=daysInMonth;i++){
      const dk = `${y}-${String(m+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
      if(savedHumor[dk]?.mood) registered++;
    }

    let html = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div>
            <div style="font-weight:900; font-size:18px;">🌿 Equilíbrio 365</div>
            <div class="small">Dias registrados: ${registered}</div>
          </div>
          <div class="badge">${registered}</div>
        </div>
      </div>

      <div class="daysList">
    `;

    for(let i=1;i<=daysInMonth;i++){
      const dt = new Date(y, m, i);
      const weekday = UI.weekdayShort(dt);
      const dk = UI.dateKey(dt);
      const isToday = i === today.getDate();

      const mood = savedHumor[dk]?.mood || "🙂";
      const alarm = alarms[dk] ? `⏰ ${alarms[dk]}` : "🔔";

      html += `<div class="d
        <div class="dayItem ${isToday ? "today" : ""}" data-date="${dk}">
          <div class="left">
            <div style="font-weight:900;">${weekday} • Dia ${i}</div>
            <div class="small">${dk}</div>
          </div>

          <div style="display:flex; gap:10px; align-items:center;">
            <button class="badge bellBtn" data-bell="${dk}" type="button" title="Alarme">${alarm}</button>
            <button class="badge moodBtn" data-mood="${dk}" type="button" title="Humor">${mood}</button>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  function bindAgenda(view){
    // humor
    view.querySelectorAll(".moodBtn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const date = btn.dataset.mood;
        openMoodSheet(date, ()=>renderHome("agenda"));
      });
    });

    // alarme (sem notificação real: só salva horário)
    view.querySelectorAll(".bellBtn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const date = btn.dataset.bell;
        const alarms = loadJSON(KEY_ALARMS, {});
        const current = alarms[date] || "";
        const t = prompt("Defina o horário do alarme (HH:MM). Ex: 08:30\n\n(Obs: aqui salva o horário no app; notificação real dá pra adicionar depois.)", current);
        if(t === null) return;

        const ok = /^([01]\d|2[0-3]):[0-5]\d$/.test(t.trim());
        if(!ok){
          alert("Formato inválido. Use HH:MM (ex: 08:30).");
          return;
        }
        alarms[date] = t.trim();
        saveJSON(KEY_ALARMS, alarms);
        renderHome("agenda");
      });
    });
  }

  function openMoodSheet(dateKey, onDone){
    const savedHumor = loadJSON(KEY_HUMOR, {});
    const currentNote = savedHumor[dateKey]?.note || "";

    const sheetHtml = `
      <div class="sheetTitle">Escolha seu humor</div>

      <button class="moodOption" data-emoji="😊" type="button">😊 Feliz</button>
      <button class="moodOption" data-emoji="😌" type="button">😌 Calma</button>
      <button class="moodOption" data-emoji="😐" type="button">😐 Neutra</button>
      <button class="moodOption" data-emoji="😔" type="button">😔 Triste</button>
      <button class="moodOption" data-emoji="😡" type="button">😡 Irritada</button>

      <textarea id="dayNote" placeholder="Diário do dia (opcional)">${currentNote}</textarea>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="cancelMood" type="button">Cancelar</button>
        <button class="btnPrimary" id="saveNoteOnly" type="button">Salvar diário</button>
      </div>
    `;

    const wrap = document.createElement("div");
    wrap.innerHTML = UI.sheet(sheetHtml);
    document.body.appendChild(wrap);

    const backdrop = document.getElementById("sheetBackdrop");
    backdrop.addEventListener("click", (e)=>{
      if(e.target === backdrop) close();
    });

    // estilo dos botões mood com o css padrão
    wrap.querySelectorAll(".moodOption").forEach(b=>{
      b.classList.add("tabBtn");
      b.style.width = "100%";
      b.style.marginBottom = "10px";
    });

    function close(){
      wrap.remove();
    }

    wrap.querySelector("#cancelMood").onclick = close;

    wrap.querySelector("#saveNoteOnly").onclick = () => {
      const note = (wrap.querySelector("#dayNote").value || "").trim();
      const prevMood = savedHumor[dateKey]?.mood || "🙂";
      savedHumor[dateKey] = { mood: prevMood, note };
      saveJSON(KEY_HUMOR, savedHumor);
      close();
      onDone();
    };

    wrap.querySelectorAll(".moodOption").forEach(btn=>{
      btn.onclick = ()=>{
        const emoji = btn.dataset.emoji;
        const note = (wrap.querySelector("#dayNote").value || "").trim();
        savedHumor[dateKey] = { mood: emoji, note };
        saveJSON(KEY_HUMOR, savedHumor);
        close();
        onDone();
      };
    });
  }

  // ---------- CHECKLIST ----------
  function renderChecklist(){
    const today = new Date();
    const dk = UI.dateKey(today);

    const all = loadJSON(KEY_CHECKLIST, {});
    const done = all[dk] || {};

    let ok = 0;
    DEFAULT_TASKS.forEach(t => { if(done[t.id]) ok++; });

    let html = `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div>
            <div style="font-weight:900; font-size:18px;">Checklist de hoje</div>
            <div class="small">Concluído: ${ok}/${DEFAULT_TASKS.length}</div>
          </div>
          <div class="badge">${ok}/${DEFAULT_TASKS.length}</div>
        </div>
      </div>

      <div class="card">
    `;

    DEFAULT_TASKS.forEach(t=>{
      const isDone = !!done[t.id];
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.10);">
          <div style="font-weight:900;">${isDone ? "✅" : "⬜"} ${t.label}</div>
          <button class="tabBtn toggleTask" data-task="${t.id}" type="button" style="width:auto;">
            ${isDone ? "Desfazer" : "Feito"}
          </button>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  function bindChecklist(view){
    const today = new Date();
    const dk = UI.dateKey(today);

    view.querySelectorAll(".toggleTask").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.dataset.task;
        const all = loadJSON(KEY_CHECKLIST, {});
        const done = all[dk] || {};
        done[id] = !done[id];
        all[dk] = done;
        saveJSON(KEY_CHECKLIST, all);
        renderHome("checklist");
      });
    });
  }

  // ---------- START ----------
  if(!isRegistered()) renderSetup();
  else renderLogin();
});
