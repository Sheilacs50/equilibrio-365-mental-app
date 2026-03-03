
document.addEventListener("DOMContentLoaded", () => {

  const app = document.getElementById("app");

  const STORAGE_KEY = "equilibrio365_pin";

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

  

    app.innerHTML = `
      <div class="container">
        <div class="logo">
          <h1>🌿 Equilíbrio <span>365</span></h1>
          <p style="margin-top:6px; opacity:.8;">
            ${monthName} ${year}
          </p>
        </div>

        <div style="
          max-height:420px;
          overflow-y:auto;
          margin-top:10px;
        ">
          ${daysHTML}
        </div>
      </div>
    `;
  }

  if(!isRegistered()){
    renderSetup();
  }else{
    renderLogin();
  }

});function renderAgenda(){

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const monthName = today.toLocaleDateString("pt-BR",{month:"long"});

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const HUMOR_KEY = "equilibrio365_humor";

  const savedHumor = JSON.parse(localStorage.getItem(HUMOR_KEY) || "{}");

  let daysHTML = "";

  for(let i=1; i<=daysInMonth; i++){

    const dateKey = `${year}-${month+1}-${i}`;

    const isToday = i === today.getDate();

    const mood = savedHumor[dateKey] || "🙂";

    daysHTML += `
      <div class="dayItem" data-date="${dateKey}"
        style="
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
      <div class="logo">
        <h1>🌿 Equilíbrio <span>365</span></h1>
        <p style="margin-top:6px; opacity:.8;">
          ${monthName} ${year}
        </p>
      </div>

      <div style="max-height:420px; overflow-y:auto; margin-top:10px;">
        ${daysHTML}
      </div>
    </div>
  `;

  document.querySelectorAll(".dayItem").forEach(item=>{
  item.onclick = () => {

    const date = item.dataset.date;

    const moodBox = document.createElement("div");
    moodBox.innerHTML = `
      <div style="
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        background:#0b2a66;
        padding:20px;
        border-top-left-radius:20px;
        border-top-right-radius:20px;
        box-shadow:0 -10px 40px rgba(0,0,0,0.5);
      ">
        <div style="text-align:center; margin-bottom:12px; font-weight:bold;">
          Escolha seu humor
        </div>

        <div class="moodOption" data-emoji="😊">😊 Feliz</div>
        <div class="moodOption" data-emoji="😌">😌 Calma</div>
        <div class="moodOption" data-emoji="😐">😐 Neutra</div>
        <div class="moodOption" data-emoji="😔">😔 Triste</div>
        <div class="moodOption" data-emoji="😡">😡 Irritada</div>
      </div>
    `;

    document.body.appendChild(moodBox);

    document.querySelectorAll(".moodOption").forEach(option=>{
      option.style.padding = "12px";
      option.style.marginBottom = "8px";
      option.style.borderRadius = "12px";
      option.style.background = "rgba(255,255,255,0.08)";
      option.style.cursor = "pointer";

      option.onclick = ()=>{
        const emoji = option.dataset.emoji;
        savedHumor[date] = emoji;
        localStorage.setItem(HUMOR_KEY, JSON.stringify(savedHumor));
        document.body.removeChild(moodBox);
        renderAgenda();
      };
    });

  };
});

}
