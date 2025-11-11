
// Simple SPA with LocalStorage
const LS_PLAYERS = 'mb_players_v1';
const LS_USERS = 'mb_users_v1';
const LS_TEAMS = 'mb_teams_v1';
const LS_CURRENT = 'mb_current_v1';

// Default data
const defaultPlayers = [
  {id:1,name:'Леброн Джеймс',pos:'SF',price:30,pts:24.4,reb:7.8,ast:8.2,blk:0.6},
  {id:2,name:'Стефен Кари',pos:'PG',price:28,pts:24.5,reb:4.4,ast:6.0,blk:0.4},
  {id:3,name:'Кевин Дюрант',pos:'PF',price:26,pts:27.1,reb:7.1,ast:5.2,blk:0.7},
  {id:4,name:'Молодой Талант',pos:'SG',price:10,pts:7.9,reb:2.8,ast:1.6,blk:0.1},
  {id:5,name:'Центр Пример',pos:'C',price:18,pts:9.5,reb:9.8,ast:1.4,blk:1.1}
];

const defaultUsers = [
  {email:'coach@team', pass:'coach', name:'Тренер', role:'coach'},
  {email:'ivan@user', pass:'123', name:'Иван', role:'user'},
  {email:'anna@user', pass:'123', name:'Анна', role:'user'}
];

function readLS(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } }
function writeLS(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

// Initialize if empty
if(!readLS(LS_PLAYERS)) writeLS(LS_PLAYERS, defaultPlayers);
if(!readLS(LS_USERS)) writeLS(LS_USERS, defaultUsers);
if(!readLS(LS_TEAMS)) writeLS(LS_TEAMS, {}); // teams stored as { email: [playerId,...] }

// Helpers
function uid(){ return Date.now() + Math.floor(Math.random()*999); }
function q(sel){ return document.querySelector(sel); }
function qAll(sel){ return Array.from(document.querySelectorAll(sel)); }

// Views
const views = qAll('.view');
function showView(id){ views.forEach(v=> v.style.display = 'none'); q('#view-' + id).style.display = 'block'; history.replaceState({},'', '#'+id); }

// Navigation
qAll('.nav-btn').forEach(b=> b.addEventListener('click', ()=> {
  const v = b.dataset.view; showView(v); renderAll();
}));

// Auth
let current = readLS(LS_CURRENT) || null;
function setCurrent(user){ current = user; writeLS(LS_CURRENT, user); updateUserUI(); }
function logout(){ current = null; localStorage.removeItem(LS_CURRENT); updateUserUI(); showView('login'); renderAll(); }
function updateUserUI(){ q('#currentUser').textContent = current ? (current.name || current.email) : 'Гость'; q('#logoutBtn').style.display = current ? 'inline-block' : 'none'; }

q('#logoutBtn').addEventListener('click', ()=> logout());

q('#loginBtn').addEventListener('click', ()=> {
  const email = q('#email').value.trim(); const pass = q('#password').value;
  const users = readLS(LS_USERS, []);
  const u = users.find(x=> x.email===email && x.pass===pass);
  if(u){ setCurrent(u); alert('Вход выполнен'); showView('choose'); renderAll(); } else alert('Неверные данные');
});

q('#registerBtn').addEventListener('click', ()=> {
  const email = q('#email').value.trim(); const pass = q('#password').value;
  if(!email || !pass){ alert('Заполните email и пароль'); return; }
  const users = readLS(LS_USERS, []);
  if(users.find(x=> x.email===email)){ alert('Пользователь с таким email уже существует'); return; }
  const newUser = {email, pass, name: email.split('@')[0], role:'user'};
  users.push(newUser); writeLS(LS_USERS, users); setCurrent(newUser); alert('Регистрация успешна'); showView('choose'); renderAll();
});

// Data renderers
function renderPlayersGrid(){
  const players = readLS(LS_PLAYERS, []);
  const teams = readLS(LS_TEAMS, {});
  const myTeam = current ? (teams[current.email] || []) : [];
  const grid = q('#playersGrid'); grid.innerHTML = '';
  const budget = 100 - (myTeam.reduce((s,id)=> s + (players.find(p=>p.id===id)?.price || 0), 0));
  q('#budgetShow').textContent = 100; q('#countShow').textContent = myTeam.length;
  players.forEach(p=>{
    const card = document.createElement('article'); card.className='player-card';
    const html = `<div class="photo"></div><div><h3>${p.name}</h3><div class="meta">Позиция: ${p.pos} • Цена: ${p.price}</div></div>`;
    // If selected in myTeam, reveal stats, show Remove; else stats hidden
    const selected = myTeam.includes(p.id);
    let statsHtml = selected ? `<div class="meta">PTS:${p.pts} REB:${p.reb} AST:${p.ast} BLK:${p.blk}</div>` : `<div class="meta">PTS: ??? REB: ??? AST: ??? BLK: ???</div>`;
    const btnHtml = selected ? `<button class="btn small remove" data-id="${p.id}">Удалить</button>` : `<button class="btn small add" data-id="${p.id}">Добавить</button>`;
    card.innerHTML = html + statsHtml + '<div style="margin-top:8px">'+btnHtml+'</div>';
    grid.appendChild(card);
  });
  attachPlayerActions();
}

function attachPlayerActions(){
  qAll('.add').forEach(b=> b.addEventListener('click', ()=> {
    if(!current){ alert('Войдите, чтобы сохранить команду'); showView('login'); return; }
    const id = +b.dataset.id; const players = readLS(LS_PLAYERS, []); const p = players.find(x=> x.id===id);
    const teams = readLS(LS_TEAMS, {}); const my = teams[current.email] || [];
    if(my.includes(id)){ alert('Игрок уже в команде'); return; }
    if(my.length >=5){ alert('Достигнуто максимальное количество игроков (5)'); return; }
    const budgetLeft = 100 - my.reduce((s,i)=> s + (players.find(x=>x.id===i)?.price || 0), 0);
    if(budgetLeft - p.price < 0){ alert('Недостаточно бюджета'); return; }
    my.push(id); teams[current.email] = my; writeLS(LS_TEAMS, teams); renderAll();
  }));
  qAll('.remove').forEach(b=> b.addEventListener('click', ()=> {
    if(!current) return;
    const id = +b.dataset.id; const teams = readLS(LS_TEAMS, {}); const my = teams[current.email] || [];
    teams[current.email] = my.filter(x=> x!==id); writeLS(LS_TEAMS, teams); renderAll();
  }));
}

function renderMyTeam(){
  const players = readLS(LS_PLAYERS, []);
  const teams = readLS(LS_TEAMS, {});
  const my = current ? (teams[current.email] || []) : [];
  const container = q('#teamList'); container.innerHTML = '';
  const leftBudget = 100 - my.reduce((s,i)=> s + (players.find(x=>x.id===i)?.price || 0), 0);
  q('#leftBudget').textContent = leftBudget;
  my.forEach(id=>{
    const p = players.find(x=> x.id===id);
    const div = document.createElement('div'); div.className='team-item';
    div.innerHTML = `<div><strong>${p.name}</strong><div class="meta">${p.pos} • Цена: ${p.price}</div></div><div><button class="btn small remove" data-id="${p.id}">Удалить</button></div>`;
    container.appendChild(div);
  });
  attachPlayerActions();
  q('#editTeamBtn').addEventListener('click', ()=> { if(!current){ alert('Войдите'); showView('login'); } else { showView('choose'); } });
}

function renderRating(){
  const users = readLS(LS_USERS, []);
  const teams = readLS(LS_TEAMS, {});
  const players = readLS(LS_PLAYERS, []);
  const tbody = q('#ratingTable tbody'); tbody.innerHTML='';
  const rows = users.map(u=> {
    const team = teams[u.email] || [];
    const score = team.reduce((s,id)=> s + (players.find(p=>p.id===id)?.price || 0), 0);
    return {user:u, team, score};
  }).sort((a,b)=> b.score - a.score);
  rows.forEach((r,i)=> {
    const names = r.team.map(id=> players.find(p=>p.id===id)?.name || '').join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${r.user.name}</td><td>${r.score}</td><td>${names}</td>`;
    tbody.appendChild(tr);
  });
}

function renderCoachPlayers(){
  const players = readLS(LS_PLAYERS, []);
  const tbody = q('#coachPlayersTable tbody'); tbody.innerHTML='';
  players.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.pos}</td><td>${p.price}</td><td>${p.pts}</td><td>${p.reb}</td><td>${p.ast}</td><td>${p.blk}</td><td><button class="btn small editP" data-id="${p.id}">Ред</button> <button class="btn small danger delP" data-id="${p.id}">Удалить</button></td>`;
    tbody.appendChild(tr);
  });
  // actions
  qAll('.delP').forEach(b=> b.addEventListener('click', ()=> {
    if(!current || current.role!=='coach'){ alert('Требуется режим тренера'); return; }
    if(!confirm('Удалить игрока полностью?')) return;
    const id = +b.dataset.id; let players = readLS(LS_PLAYERS, []);
    players = players.filter(x=> x.id!==id); writeLS(LS_PLAYERS, players);
    // remove from teams
    const teams = readLS(LS_TEAMS, {});
    Object.keys(teams).forEach(email=> teams[email] = teams[email].filter(x=> x!==id));
    writeLS(LS_TEAMS, teams);
    renderAll();
  }));
  qAll('.editP').forEach(b=> b.addEventListener('click', ()=> {
    const id = +b.dataset.id; const players = readLS(LS_PLAYERS, []);
    const p = players.find(x=> x.id===id);
    q('#p_name').value = p.name; q('#p_pos').value = p.pos; q('#p_price').value = p.price;
    q('#p_pts').value = p.pts; q('#p_reb').value = p.reb; q('#p_ast').value = p.ast; q('#p_blk').value = p.blk;
    q('#savePlayerBtn').dataset.edit = id;
  }));
}

q('#savePlayerBtn').addEventListener('click', ()=> {
  if(!current || current.role!=='coach'){ alert('Требуется режим тренера'); return; }
  const name = q('#p_name').value.trim(); if(!name){ alert('Введите имя'); return; }
  const pos = q('#p_pos').value.trim()||'SG';
  const price = Number(q('#p_price').value)||10;
  const pts = Number(q('#p_pts').value)||0; const reb = Number(q('#p_reb').value)||0; const ast = Number(q('#p_ast').value)||0; const blk = Number(q('#p_blk').value)||0;
  let players = readLS(LS_PLAYERS, []);
  const editId = q('#savePlayerBtn').dataset.edit;
  if(editId){
    const p = players.find(x=> x.id==editId);
    Object.assign(p, {name,pos,price,pts,reb,ast,blk});
    delete q('#savePlayerBtn').dataset.edit;
  } else {
    const id = players.length ? Math.max(...players.map(x=>x.id)) + 1 : 1;
    players.push({id,name,pos,price,pts,reb,ast,blk});
  }
  writeLS(LS_PLAYERS, players);
  q('#p_name').value=''; q('#p_pos').value=''; q('#p_price').value=''; q('#p_pts').value=''; q('#p_reb').value=''; q('#p_ast').value=''; q('#p_blk').value='';
  renderAll();
});

q('#clearPlayerBtn').addEventListener('click', ()=> { q('#p_name').value=''; q('#savePlayerBtn').removeAttribute('data-edit'); });

function renderCoachTeams(){
  const teams = readLS(LS_TEAMS, {}); const players = readLS(LS_PLAYERS, []);
  const container = q('#coachTeams'); container.innerHTML='';
  Object.keys(teams).forEach(email=>{
    const users = readLS(LS_USERS, []); const user = users.find(u=> u.email===email);
    const team = teams[email]; if(!team || team.length===0) return;
    const div = document.createElement('div'); div.className='team-item';
    const names = team.map(id=> players.find(p=>p.id===id)?.name || '').join(', ');
    const score = team.reduce((s,id)=> s + (players.find(p=>p.id===id)?.price || 0), 0);
    div.innerHTML = `<strong>${user ? user.name : email}</strong> — ${score} очк. <div class="meta">${names}</div>`;
    container.appendChild(div);
  });
}

// Global render
function renderAll(){
  updateUserUI();
  renderPlayersGrid();
  renderMyTeam();
  renderRating();
  renderCoachPlayers();
  renderCoachTeams();
}

// Initial view
updateUserUI();
const hash = location.hash.replace('#','') || 'login';
showView(hash);
renderAll();
