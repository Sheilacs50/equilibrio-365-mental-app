document.addEventListener("DOMContentLoaded", () => {

  const app = document.getElementById("app");
  const STORAGE_KEY = "equilibrio365_pin";
  const HUMOR_KEY = "equilibrio365_humor";

  function isRegistered(){
    return !!localStorage.getItem(STORAGE_KEY);
  }

  function savePin(pin){
    localStorage.setItem(STORAGE_KEY, pin);
  }

  function validatePin(pin){
    return localStorage.getItem(STORAGE_KEY) === pin;
  }

  function renderSetup(){
    app.innerHTML = `
      <div class="container">
        <div class="logo">
          <h1>🌿 Equilíbrio <span>365</span></h1>
        </div>

        <input type="password" id="newPin" maxlength="4" placeholder="Crie uma senha (4 dígitos)" />
        <button id="createBtn">Criar senha</button>
      </div>
    `;

    document.getElementById("createBtn").onclick = () => {
      const pin = document.getElementById("newPin").value;
      if(pin.length !== 4){
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
        </div>

        <input type="password" id="loginPin" maxlength="4" placeholder="Digite sua senha" />
        <button id="loginBtn">Entrar</button>
      </div>
    `;

    document.getElementById("loginBtn").onclick = () => {
      const pin = document.getElementById("loginPin").value;
      if(validatePin(pin)){
        renderAgenda();
      }else{
        alert("Senha incorreta.");
      }
    };
  }

  function renderAgenda(){

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const monthName = today.toLocaleDateString("pt-BR",{month:"long"});
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const savedHumor = JSON.parse(localStorage.getItem(HUMOR_KEY) || "{}");
    let daysHTML = "";

    for(let i=1; i<=daysInMonth; i++){

      const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
      const isToday = i === today.getDate();
      const mood = savedHumor[dateKey] || "🙂";

      daysHTML += `
        <div class="dayItem" data-date="${dateKey}" style="
          padding:14px;
          border-bottom:1px solid rgba(255,255,255,0.1);
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:${isToday ? "rgba(60,179,113,0.15)" : "transparent"};
          cursor:pointer;
        ">
          <span>Dia ${i}</span>
          <span>${mood}</span>
        </div>
      `;
    }

    app.innerHTML = `
      <div class="container">
        <div style="text-align:right; margin-bottom:8px;">
      <button id="logoutBtn" style="
        width:auto;
        padding:6px 12px;
        font-size:12px;
        border-radius:10px;
      ">Sair</button>
    </div>
      </div>
    `;

    document.querySelectorAll(".dayItem").forEach(item=>{
      item.onclick = () => {

        const date = item.dataset.date;

        const old = document.getElementById("moodSheet");
        if(old) old.remove();

        const moodBox = document.createElement("div");
        moodBox.id = "moodSheet";

        moodBox.innerHTML = `
          <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.35);
            display:flex;
            align-items:flex-end;
            z-index:9999;
          ">
            <div style="
              width:100%;
              background:#0b2a66;
              padding:18px;
              border-top-left-radius:20px;
              border-top-right-radius:20px;
              box-shadow:0 -10px 40px rgba(0,0,0,0.5);
            ">
              <div style="text-align:center; margin-bottom:12px; font-weight:900;">
                Escolha seu humor
              </div>

              <button class="moodOption" data-emoji="😊" type="button">😊 Feliz</button>
              <button class="moodOption" data-emoji="😌" type="button">😌 Calma</button>
              <button class="moodOption" data-emoji="😐" type="button">😐 Neutra</button>
              <button class="moodOption" data-emoji="😔" type="button">😔 Triste</button>
              <button class="moodOption" data-emoji="😡" type="button">😡 Irritada</button>

              <button id="cancelMood" type="button" style="
                margin-top:10px;
                width:100%;
                padding:12px;
                border-radius:14px;
                border:1px solid rgba(255,255,255,0.18);
                background:rgba(255,255,255,0.08);
                color:white;
                font-weight:800;
              ">Cancelar</button>

            </div>
          </div>
        `;

        document.body.appendChild(moodBox);

        moodBox.querySelectorAll(".moodOption").forEach(btn=>{
          btn.style.width = "100%";
          btn.style.padding = "12px";
          btn.style.marginBottom = "8px";
          btn.style.borderRadius = "14px";
          btn.style.border = "1px solid rgba(255,255,255,0.18)";
          btn.style.background = "rgba(255,255,255,0.08)";
          btn.style.color = "white";
          btn.style.fontWeight = "900";
          btn.style.cursor = "pointer";

          btn.onclick = ()=>{
            const emoji = btn.dataset.emoji;
            savedHumor[date] = emoji;
            localStorage.setItem(HUMOR_KEY, JSON.stringify(savedHumor));
            moodBox.remove();
            renderAgenda();
          };
        });

        moodBox.querySelector("#cancelMood").onclick = ()=> moodBox.remove();

        moodBox.firstElementChild.onclick = (e)=>{
          if(e.target === moodBox.firstElementChild) moodBox.remove();
        };

      };
    });

  }

  if(!isRegistered()){
    renderSetup();
  }else{
    renderLogin();
  }

});
