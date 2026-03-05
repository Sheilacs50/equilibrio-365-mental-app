// js/ui.js
(function(){
  const UI = {};

  UI.escape = (s="") => String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  UI.monthName = (date) =>
    date.toLocaleDateString("pt-BR", { month: "long" });

  UI.weekdayShort = (date) =>
    date.toLocaleDateString("pt-BR", { weekday: "short" });

  UI.dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  };

  UI.btn = (label, cls="", attrs="") =>
    `<button class="${cls}" ${attrs}>${label}</button>`;

  UI.header = ({titleLeft="", titleRight="", onTopRight=false}) => `
    <div class="header">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <h2 style="margin:0;">${titleLeft}</h2>
        ${titleRight ? `<div class="small">${titleRight}</div>` : ``}
      </div>
      ${onTopRight ? onTopRight : ``}
    </div>
  `;

  UI.tabs = (active) => `
    <div class="tabs">
      <button class="tabBtn ${active==='agenda'?'active':''}" data-tab="agenda" type="button">Agenda</button>
      <button class="tabBtn ${active==='content'?'active':''}" data-tab="content" type="button">Conteúdo</button>
      <button class="tabBtn ${active==='checklist'?'active':''}" data-tab="checklist" type="button">Checklist</button>
    </div>
  `;

  UI.sheet = (innerHtml) => `
    <div class="sheetBackdrop" id="sheetBackdrop">
      <div class="sheet" role="dialog" aria-modal="true">
        ${innerHtml}
      </div>
    </div>
  `;

  window.UI = UI;
})();
