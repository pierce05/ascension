const state = {
  system: null,
  selectedSkillCat: "ALL",
  completedVisible: false,
};

const difficultyLabels = {
  1: "Easy",
  1.2: "Normal",
  1.5: "Hard",
  2: "Legendary",
};

const categoryLabels = {
  CP: "Competitive Programming",
  DEV: "Development",
  ML: "Machine Learning",
  HEALTH: "Health",
  GRIND: "Grind",
  LIFE: "Life",
  SOCIAL: "Social",
  CUSTOM: "Custom",
};

const categoryIcons = {
  CP: "?",
  DEV: "??",
  ML: "??",
  HEALTH: "?",
  GRIND: "??",
  LIFE: "?",
  SOCIAL: "??",
  CUSTOM: "??",
};

const skillIcons = {
  CP: "?",
  DEV: "??",
  ML: "??",
  LIFE: "??",
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(Math.round(value));

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message ?? "Request failed.";
    throw new Error(message);
  }

  return payload.data;
};

const mapQuestCategory = (category) => {
  if (category === "SOCIAL" || category === "CUSTOM") {
    return "LIFE";
  }

  return category;
};

const getMultiplier = () => {
  const streak = state.system?.streakDays ?? 0;
  if (streak >= 7) return 1.5;
  if (streak >= 4) return 1.2;
  return 1;
};

const showPopup = (message, color) => {
  const element = document.createElement("div");
  element.className = "xp-popup";
  if (color) {
    element.style.background = color;
  }
  element.textContent = message;
  document.body.appendChild(element);
  setTimeout(() => element.remove(), 2600);
};

const setSystem = (system) => {
  state.system = system;
  renderAll();
};

const fetchSystem = async () => {
  const system = await request("/api/v1/systems/current", { headers: {} });
  setSystem(system);
};

const questDisplayXp = (quest) => Math.round(quest.xpReward * quest.difficultyMultiplier);

const updateHeader = () => {
  const system = state.system;
  if (!system) return;

  const xpPct = Math.min(100, Math.round((system.xp / system.xpToNextLevel) * 100));
  document.getElementById("uname").textContent = system.profileName;
  document.getElementById("xp-bar").style.width = `${xpPct}%`;
  document.getElementById("xp-text").textContent = `${formatNumber(system.xp)} / ${formatNumber(system.xpToNextLevel)}`;
  document.getElementById("level-disp").textContent = system.level;
  document.getElementById("coins-disp").textContent = formatNumber(system.coins);
  document.getElementById("gems-disp").textContent = formatNumber(system.gems);
};

const renderDashboard = () => {
  const system = state.system;
  if (!system) return;

  document.getElementById("streak-num").textContent = system.streakDays;
  document.getElementById("mult-disp").textContent = `x${getMultiplier().toFixed(1)}`;
  document.getElementById("today-score").textContent = `${formatNumber(system.todayScore)} XP`;
  document.getElementById("tasks-done-count").textContent = `${system.todayDone} tasks completed today`;

  document.getElementById("str-bar").style.width = `${system.attributes.strength}%`;
  document.getElementById("int-bar").style.width = `${system.attributes.intelligence}%`;
  document.getElementById("dis-bar").style.width = `${system.attributes.discipline}%`;
  document.getElementById("str-val").textContent = Math.round(system.attributes.strength);
  document.getElementById("int-val").textContent = Math.round(system.attributes.intelligence);
  document.getElementById("dis-val").textContent = Math.round(system.attributes.discipline);

  document.getElementById("hp-disp").textContent = formatNumber(system.vitals.hp);
  document.getElementById("mp-disp").textContent = formatNumber(system.vitals.mp);
  document.getElementById("en-disp").textContent = formatNumber(system.vitals.energy);
  document.getElementById("hp-bar").style.width = `${Math.max(0, Math.min(100, system.vitals.hp / 10))}%`;
  document.getElementById("mp-bar").style.width = `${Math.max(0, Math.min(100, system.vitals.mp / 10))}%`;
  document.getElementById("en-bar").style.width = `${Math.max(0, Math.min(100, system.vitals.energy))}%`;

  const active = system.quests.filter((quest) => !quest.completed);
  document.getElementById("q-count").textContent = `${active.length} active`;
  document.getElementById("dash-quests").innerHTML = active.length
    ? active.slice(0, 3).map((quest) => questHTML(quest)).join("")
    : '<div style="color:var(--text-dim);font-size:12px;padding:8px">No active quests. Forge some above.</div>';

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date().getDay();
  const calHTML = days.map((day) => `<div class="cal-day hdr">${day}</div>`).join("") +
    Array.from({ length: 28 }, (_, index) => {
      const isToday = index % 7 === today;
      const isDone = index < system.streakDays;
      return `<div class="cal-day ${isToday ? "today" : isDone ? "done" : ""}">${index + 1}</div>`;
    }).join("");
  document.getElementById("week-cal").innerHTML = calHTML;
};

const questHTML = (quest) => {
  const finalXp = questDisplayXp(quest);
  return `<div class="quest-item ${quest.completed ? "done" : ""}" onclick="completeQuest('${quest.id}')">
    <div class="quest-cb ${quest.completed ? "checked" : ""}">${quest.completed ? "?" : ""}</div>
    <div class="quest-info">
      <div class="quest-name">${quest.title}</div>
      <div class="quest-cat">${quest.category} · ${quest.difficultyMultiplier}x difficulty</div>
    </div>
    <div class="quest-rewards">
      <span class="xp-tag">+${formatNumber(finalXp)} XP</span>
      <span class="coin-tag">??${formatNumber(quest.coinReward)}</span>
    </div>
  </div>`;
};

const renderQuestList = () => {
  const system = state.system;
  if (!system) return;

  const active = system.quests.filter((quest) => !quest.completed);
  const done = system.quests.filter((quest) => quest.completed);

  document.getElementById("quest-list").innerHTML = active.length
    ? active.map((quest) => questHTML(quest)).join("")
    : '<div style="color:var(--text-dim);font-size:12px;padding:8px">No active quests. Forge some above.</div>';

  document.getElementById("completed-list").innerHTML = done.length
    ? done.map((quest) => questHTML(quest)).join("")
    : '<div style="color:var(--text-dim);font-size:12px;padding:8px">None completed yet.</div>';
};

const renderSkills = () => {
  const system = state.system;
  if (!system) return;

  const categories = ["ALL", ...new Set(system.skills.map((skill) => skill.category))];
  document.getElementById("skill-cats").innerHTML = categories.map((category) =>
    `<button class="btn btn-sm ${state.selectedSkillCat === category ? "" : "btn-gold"}" style="margin:0" onclick="filterSkills('${category}')">${category}</button>`
  ).join("");

  const filtered = state.selectedSkillCat === "ALL"
    ? system.skills
    : system.skills.filter((skill) => skill.category === state.selectedSkillCat);

  document.getElementById("skill-grid").innerHTML = filtered.map((skill) => {
    const progress = Math.round((skill.level / skill.maxLevel) * 100);
    return `
      <div class="skill-node ${skill.unlocked ? "unlocked" : "locked"}">
        <div class="skill-icon">${skillIcons[skill.category] ?? "?"}</div>
        <div class="skill-name">${skill.name}</div>
        <div class="skill-lv">Lv ${skill.level}/${skill.maxLevel}</div>
        <div class="skill-prog bar-track" style="margin-top:5px"><div class="bar-fill" style="width:${progress}%"></div></div>
        ${!skill.unlocked ? '<div style="font-size:9px;color:var(--text-dim);margin-top:3px">?? LOCKED</div>' : ""}
      </div>`;
  }).join("");

  document.getElementById("skill-bars").innerHTML = system.skills.filter((skill) => skill.unlocked).map((skill) => `
    <div class="stat-row">
      <div class="stat-row-top"><span>${skill.name} <span style="color:var(--text-dim);font-size:10px">[${skill.category}]</span></span><span>Lv ${skill.level}</span></div>
      <div class="bar-sm"><div class="bar-sm-fill" style="width:${Math.round(skill.level / skill.maxLevel * 100)}%"></div></div>
    </div>
  `).join("");
};

const renderBosses = () => {
  const system = state.system;
  if (!system) return;

  document.getElementById("boss-list").innerHTML = system.bosses.map((boss) => {
    const pct = Math.round((boss.currentHp / boss.totalHp) * 100);
    const dead = boss.currentHp === 0;
    return `<div class="boss-card" style="margin-bottom:10px;${dead ? "opacity:0.5" : ""}">
      <div class="boss-name">${dead ? "? [DEFEATED] " : ""}"${boss.name}"</div>
      <div class="boss-sub">${dead ? "MISSION ACCOMPLISHED" : "ELITE BOSS · ONGOING"}</div>
      <div class="boss-hp-bar"><div class="boss-hp-fill" style="width:${pct}%"></div></div>
      <div class="boss-stats">
        <span>HP: ${formatNumber(boss.currentHp)} / ${formatNumber(boss.totalHp)}</span>
        <span>${pct}% remaining</span>
        <span style="color:var(--gold)">?? ${boss.reward}</span>
      </div>
    </div>`;
  }).join("") || '<div style="color:var(--text-dim);padding:12px">No bosses summoned yet.</div>';
};

const renderShop = () => {
  const system = state.system;
  if (!system) return;

  document.getElementById("shop-coins").textContent = formatNumber(system.coins);
  document.getElementById("shop-items").innerHTML = system.shopItems.map((item) => `
    <div class="shop-item">
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${item.name}</div>
        <div class="shop-desc">${item.description}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <div class="shop-price">?? ${formatNumber(item.price)}</div>
        <button class="btn btn-sm btn-gold" onclick="buyItem('${item.id}')" ${system.coins < item.price ? 'disabled style="opacity:0.4"' : ""}>BUY</button>
      </div>
    </div>
  `).join("");

  document.getElementById("inventory-list").innerHTML = system.inventory.length
    ? system.inventory.map((item) =>
      `<div style="display:flex;align-items:center;gap:8px;padding:6px;border:1px solid var(--border);border-radius:3px;margin-bottom:4px;background:var(--bg3)">
        <span>${item.icon}</span><span style="font-size:12px">${item.name}</span><span style="font-size:10px;color:var(--text-dim);margin-left:auto">${item.purchasedAt}</span>
      </div>`
    ).join("")
    : '<div style="color:var(--text-dim);font-size:12px;padding:8px">Inventory empty. Visit the shop.</div>';
};

const renderLeaderboard = () => {
  const system = state.system;
  if (!system) return;

  document.getElementById("lb-list").innerHTML = system.leaderboard.map((player, index) => `
    <div class="lb-row ${player.isCurrentUser ? "you" : ""}">
      <div class="lb-rank ${index < 3 ? "top" : ""}">${index + 1}</div>
      <div class="lb-name">${player.name}</div>
      <div class="lb-lv">Lv ${player.level}</div>
      <div class="lb-xp">${formatNumber(player.xp)} XP</div>
    </div>
  `).join("");

  document.getElementById("total-xp-stat").textContent = formatNumber(system.totalXp);
  document.getElementById("total-quests-stat").textContent = system.questsDone;
};

const renderEvent = () => {
  const system = state.system;
  if (!system) return;

  const area = document.getElementById("event-area");
  if (!system.activeEvent) {
    area.innerHTML = "";
    return;
  }

  area.innerHTML = `<div class="event-banner">
    <div class="event-icon">${system.activeEvent.icon}</div>
    <div>
      <div class="event-title">${system.activeEvent.title}</div>
      <div class="event-desc">${system.activeEvent.description}</div>
    </div>
    <button class="btn btn-sm" style="margin-left:auto" onclick="dismissEvent()">DISMISS</button>
  </div>`;
};

const renderAll = () => {
  updateHeader();
  renderDashboard();
  renderQuestList();
  renderSkills();
  renderBosses();
  renderShop();
  renderLeaderboard();
  renderEvent();
};

const showTab = (id) => {
  document.querySelectorAll(".content").forEach((content) => content.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  document.getElementById(`tab-${id}`).classList.add("active");
  document.querySelectorAll(".tab").forEach((tab) => {
    const label = tab.textContent.toLowerCase();
    if (label.includes(id.slice(0, 4))) {
      tab.classList.add("active");
    }
  });
};

const completeQuest = async (id) => {
  try {
    const system = await request(`/api/v1/systems/quests/${id}/complete`, {
      method: "POST",
    });
    setSystem(system);
    showPopup("? Quest cleared. XP and coins updated.");
  } catch (error) {
    showPopup(`? ${error.message}`);
  }
};

const addQuest = async () => {
  const title = document.getElementById("q-title").value.trim();
  const xpReward = Number(document.getElementById("q-xp").value) || 50;
  const coinReward = Number(document.getElementById("q-coins").value) || 20;
  const category = mapQuestCategory(document.getElementById("q-cat").value);
  const difficultyMultiplier = Number(document.getElementById("q-diff").value) || 1;

  try {
    const system = await request("/api/v1/systems/quests", {
      method: "POST",
      body: JSON.stringify({
        title,
        xpReward,
        coinReward,
        category,
        difficultyMultiplier,
      }),
    });

    document.getElementById("q-title").value = "";
    document.getElementById("q-xp").value = "";
    document.getElementById("q-coins").value = "";
    setSystem(system);
    showPopup(`?? Quest forged: ${title}`);
    showTab("quests");
  } catch (error) {
    showPopup(`? ${error.message}`);
  }
};

const addBoss = async () => {
  const name = document.getElementById("boss-name").value.trim();
  const totalHp = Number(document.getElementById("boss-hp").value) || 1000;
  const reward = document.getElementById("boss-reward").value.trim();

  try {
    const system = await request("/api/v1/systems/bosses", {
      method: "POST",
      body: JSON.stringify({
        name,
        totalHp,
        reward,
      }),
    });

    document.getElementById("boss-name").value = "";
    document.getElementById("boss-hp").value = "";
    document.getElementById("boss-reward").value = "";
    setSystem(system);
    showPopup(`?? Boss summoned: ${name}`);
    showTab("boss");
  } catch (error) {
    showPopup(`? ${error.message}`);
  }
};

const buyItem = async (id) => {
  try {
    const system = await request(`/api/v1/systems/shop/${id}/purchase`, {
      method: "POST",
    });
    setSystem(system);
    showPopup("? Purchase completed.");
  } catch (error) {
    showPopup(`? ${error.message}`);
  }
};

const dismissEvent = async () => {
  try {
    const system = await request("/api/v1/systems/events/dismiss", {
      method: "POST",
    });
    setSystem(system);
  } catch (error) {
    showPopup(`? ${error.message}`);
  }
};

const filterSkills = (category) => {
  state.selectedSkillCat = category;
  renderSkills();
};

const toggleCompleted = () => {
  state.completedVisible = !state.completedVisible;
  document.getElementById("completed-list").style.display = state.completedVisible ? "block" : "none";
  document.getElementById("toggle-txt").textContent = state.completedVisible ? "[hide]" : "[show]";
};

window.showTab = showTab;
window.completeQuest = completeQuest;
window.addQuest = addQuest;
window.addBoss = addBoss;
window.buyItem = buyItem;
window.filterSkills = filterSkills;
window.toggleCompleted = toggleCompleted;
window.dismissEvent = dismissEvent;

fetchSystem().catch((error) => {
  showPopup(`? ${error.message ?? "Failed to load system."}`);
  console.error(error);
});
