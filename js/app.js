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

});
