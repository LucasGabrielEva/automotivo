const API='https://automotivo.onrender.com/api';
let sessao=null;
let chatOsId=null;
let stOsId=null;

// UTILS
function toast(msg,t='ok'){const el=document.createElement('div');el.className=`ti ti-${t}`;el.textContent=msg;document.getElementById('toast').appendChild(el);setTimeout(()=>el.remove(),3500)}
async function api(path,opts={}){
  const r=await fetch(API+path,{headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});
  if(!r.ok){let m=`Erro ${r.status}`;try{const j=await r.json();m=j.message||JSON.stringify(j.campos)||m;}catch(e){}throw new Error(m);}
  if(r.status===204)return null;return r.json();
}
function esc(t){return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function ini(n){if(!n)return '?';return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
const AVC=['av-t','av-b','av-a','av-p','av-r'];
function avc(id){return AVC[(id||0)%5]}
function fdt(dt){if(!dt)return '—';return new Date(dt).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function fdo(dt){if(!dt)return '—';return new Date(dt).toLocaleDateString('pt-BR')}
function pb(p){const m={CLIENTE:'b-info',N1:'b-ok',N2:'b-warn',N3:'b-purple'};return `<span class="badge ${m[p]||'b-gray'}">${p}</span>`}
function sb(s){const m={ABERTA:'b-warn',EM_ANDAMENTO:'b-info',AGUARDANDO_PECA:'b-err',FECHADA:'b-ok'};const l={ABERTA:'Aberta',EM_ANDAMENTO:'Em andamento',AGUARDANDO_PECA:'Ag. peça',FECHADA:'Fechada'};return `<span class="badge ${m[s]||'b-gray'}">${l[s]||s}</span>`}
function sl(s){return {ABERTA:'Aberta',EM_ANDAMENTO:'Em andamento',AGUARDANDO_PECA:'Ag. peça',FECHADA:'Fechada'}[s]||s}

// SESSÃO
async function carregarSessaoSelect(){
  try{
    const usu=await api('/usuarios');
    const sel=document.getElementById('sess-sel');
    sel.innerHTML='<option value="">Escolher usuário...</option>'+usu.map(u=>`<option value="${u.id}">[${u.perfil}] ${esc(u.nome)}</option>`).join('');
  }catch(e){}
}
function trocarSessao(){
  const sel=document.getElementById('sess-sel');
  const id=parseInt(sel.value);
  if(!id){sessao=null;atualizarSessUI();return;}
  const txt=sel.options[sel.selectedIndex].text;
  const m=txt.match(/\[(.+?)\]\s(.+)/);
  sessao=m?{id,perfil:m[1],nome:m[2]}:{id,perfil:'?',nome:txt};
  atualizarSessUI();
  toast(`Sessão: ${sessao.nome} (${sessao.perfil})`);
}
function atualizarSessUI(){
  const pC={CLIENTE:'var(--blue-l)',N1:'var(--acc-l)',N2:'var(--amber-l)',N3:'var(--purple-l)'};
  const pT={CLIENTE:'var(--blue)',N1:'var(--acc-d)',N2:'var(--amber)',N3:'var(--purple)'};
  document.getElementById('sess-av').textContent=sessao?ini(sessao.nome):'?';
  document.getElementById('sess-name').textContent=sessao?sessao.nome:'Nenhum';
  document.getElementById('sess-role').textContent=sessao?sessao.perfil:'Selecione abaixo';
  const bd=document.getElementById('sess-badge');
  if(!sessao){bd.textContent='Sem sessão';bd.style.background='var(--bg)';bd.style.color='var(--tx2)';return;}
  bd.textContent=`${sessao.perfil} — ${sessao.nome}`;
  bd.style.background=pC[sessao.perfil]||'var(--bg)';
  bd.style.color=pT[sessao.perfil]||'var(--tx2)';
}

// NAV
const PTITLES={dashboard:'Dashboard',usuarios:'Usuários',clientes:'Clientes',oficinas:'Oficinas',ordens:'Ordens de Serviço',agendamentos:'Agendamentos',chat:'Chat',relatorio:'Relatório'};
const LOADERS={dashboard:carregarDashboard,usuarios:carregarUsuarios,clientes:carregarClientes,oficinas:carregarOficinas,ordens:carregarOrdens,agendamentos:carregarAgendamentos,chat:carregarChatOrdens,relatorio:carregarRelatorio};
function showPage(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.getElementById('tb-title').textContent=PTITLES[id]||id;
  if(el)el.classList.add('active');
  else document.querySelectorAll('.ni').forEach(n=>{if(n.getAttribute('onclick')?.includes("'"+id+"'"))n.classList.add('active');});
  closeSidebar();
  if(LOADERS[id])LOADERS[id]();
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');document.getElementById('sovl').classList.toggle('open')}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('sovl').classList.remove('open')}
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.moverlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));

// DASHBOARD
async function carregarDashboard(){
  try{
    const [usu,cli,ofi,os]=await Promise.all([api('/usuarios'),api('/clientes'),api('/oficinas'),api('/ordens')]);
    document.getElementById('d-usu').textContent=usu.length;
    document.getElementById('d-cli').textContent=cli.length;
    document.getElementById('d-ofi').textContent=ofi.length;
    document.getElementById('d-os').textContent=os.filter(o=>o.status!=='FECHADA').length;
    const tb=document.getElementById('d-os-tb');
    tb.innerHTML=!os.length?'<tr><td colspan="3" class="empty">Nenhuma OS</td></tr>':
      os.slice(0,6).map(o=>`<tr><td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${o.id}</td><td>${esc(o.modeloVeiculo)}</td><td>${sb(o.status)}</td></tr>`).join('');
    const cnt={ABERTA:0,EM_ANDAMENTO:0,AGUARDANDO_PECA:0,FECHADA:0};
    os.forEach(o=>cnt[o.status]=(cnt[o.status]||0)+1);
    const tot=os.length||1;
    const bc={ABERTA:'var(--amber)',EM_ANDAMENTO:'var(--blue)',AGUARDANDO_PECA:'var(--coral)',FECHADA:'var(--acc)'};
    document.getElementById('d-bar').innerHTML=Object.entries(cnt).map(([s,c])=>`
      <div class="bar-row"><span class="bar-lbl">${sl(s)}</span>
      <div class="bar-trk"><div class="bar-fill" style="width:${Math.round(c/tot*100)}%;background:${bc[s]}"></div></div>
      <span class="bar-val">${c}</span></div>`).join('');
  }catch(e){toast('Erro dashboard: '+e.message,'err')}
}

// USUÁRIOS
async function carregarUsuarios(){
  document.getElementById('tb-usu').innerHTML='<tr><td colspan="5" class="loading"><div class="spin"></div></td></tr>';
  try{
    const d=await api('/usuarios');
    const tb=document.getElementById('tb-usu');
    if(!d.length){tb.innerHTML='<tr><td colspan="5" class="empty">Nenhum usuário</td></tr>';return;}
    tb.innerHTML=d.map(u=>`<tr>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="av ${avc(u.id)}">${ini(u.nome)}</div>${esc(u.nome)}</div></td>
      <td style="color:var(--tx2)">${esc(u.email)}</td><td>${pb(u.perfil)}</td>
      <td style="color:var(--tx2);font-size:12px">${fdo(u.dataCriacao)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delUsuario(${u.id})">Excluir</button></td>
    </tr>`).join('');
    await carregarSessaoSelect();
  }catch(e){document.getElementById('tb-usu').innerHTML=`<tr><td colspan="5" class="empty" style="color:var(--coral)">${e.message}</td></tr>`}
}
async function salvarUsuario(){
  const nome=document.getElementById('u-nome').value.trim();
  const email=document.getElementById('u-email').value.trim();
  const senha=document.getElementById('u-senha').value.trim();
  const perfil=document.getElementById('u-perfil').value;
  if(!nome||!email||!senha||!perfil){toast('Preencha todos os campos','err');return;}
  if(senha.length<6){toast('Senha min. 6 caracteres','err');return;}
  try{await api('/usuarios',{method:'POST',body:JSON.stringify({nome,email,senha,perfil})});
    toast('Usuário criado!');closeModal('m-u');
    ['u-nome','u-email','u-senha'].forEach(id=>document.getElementById(id).value='');document.getElementById('u-perfil').value='';
    carregarUsuarios();}catch(e){toast('Erro: '+e.message,'err')}
}
async function delUsuario(id){if(!confirm('Excluir usuário?'))return;try{await api('/usuarios/'+id,{method:'DELETE'});toast('Excluído');carregarUsuarios();}catch(e){toast('Erro: '+e.message,'err')}}

// CLIENTES
async function carregarClientes(){
  document.getElementById('tb-cli').innerHTML='<tr><td colspan="5" class="loading"><div class="spin"></div></td></tr>';
  try{
    const d=await api('/clientes');
    const tb=document.getElementById('tb-cli');
    if(!d.length){tb.innerHTML='<tr><td colspan="5" class="empty">Nenhum cliente</td></tr>';return;}
    tb.innerHTML=d.map(c=>`<tr>
      <td><b style="font-weight:500">${esc(c.razaoSocial||'—')}</b></td>
      <td style="font-family:var(--m);font-size:12px">${esc(c.documento)}</td>
      <td style="color:var(--tx2)">${esc(c.telefone||'—')}</td>
      <td style="color:var(--tx2)">${c.usuario?esc(c.usuario.nome)+' '+pb(c.usuario.perfil):'—'}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delCliente(${c.id})">Excluir</button></td>
    </tr>`).join('');
  }catch(e){document.getElementById('tb-cli').innerHTML=`<tr><td colspan="5" class="empty" style="color:var(--coral)">${e.message}</td></tr>`}
}
async function salvarCliente(){
  const razaoSocial=document.getElementById('c-razao').value.trim();
  const documento=document.getElementById('c-doc').value.trim();
  const telefone=document.getElementById('c-tel').value.trim();
  const uid=document.getElementById('c-uid').value.trim();
  if(!documento){toast('Documento obrigatório','err');return;}
  const body={documento,razaoSocial:razaoSocial||null,telefone:telefone||null};
  if(uid)body.usuarioId=parseInt(uid);
  try{await api('/clientes',{method:'POST',body:JSON.stringify(body)});
    toast('Cliente criado!');closeModal('m-c');
    ['c-razao','c-doc','c-tel','c-uid'].forEach(id=>document.getElementById(id).value='');
    carregarClientes();}catch(e){toast('Erro: '+e.message,'err')}
}
async function delCliente(id){if(!confirm('Excluir cliente?'))return;try{await api('/clientes/'+id,{method:'DELETE'});toast('Excluído');carregarClientes();}catch(e){toast('Erro: '+e.message,'err')}}

// OFICINAS
async function carregarOficinas(){
  const g=document.getElementById('ofi-grid');
  g.innerHTML='<div class="loading"><div class="spin"></div></div>';
  try{
    const d=await api('/oficinas');
    if(!d.length){g.innerHTML='<div class="empty">Nenhuma oficina</div>';return;}
    const C=[{bg:'var(--acc-l)',ic:'var(--acc-d)'},{bg:'var(--blue-l)',ic:'var(--blue)'},{bg:'var(--amber-l)',ic:'var(--amber)'},{bg:'var(--purple-l)',ic:'var(--purple)'}];
    g.innerHTML=d.map((o,i)=>{const c=C[i%4];return `
      <div class="card" style="margin:0">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:36px;border-radius:8px;background:${c.bg};display:flex;align-items:center;justify-content:center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${c.ic}" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <div><div style="font-weight:500;font-size:13px">${esc(o.nome)}</div><div style="font-size:11px;color:var(--tx2)">ID: ${o.id}</div></div>
        </div>
        <div style="font-size:12px;color:var(--tx2);margin-bottom:12px">${esc(o.endereco)}</div>
        <button class="btn btn-sm btn-danger" style="width:100%;justify-content:center" onclick="delOficina(${o.id})">Excluir</button>
      </div>`}).join('');
  }catch(e){g.innerHTML=`<div class="empty" style="color:var(--coral)">${e.message}</div>`}
}
async function salvarOficina(){
  const nome=document.getElementById('o-nome').value.trim();
  const endereco=document.getElementById('o-end').value.trim();
  if(!nome||!endereco){toast('Preencha todos os campos','err');return;}
  try{await api('/oficinas',{method:'POST',body:JSON.stringify({nome,endereco})});
    toast('Oficina criada!');closeModal('m-o');
    ['o-nome','o-end'].forEach(id=>document.getElementById(id).value='');
    carregarOficinas();}catch(e){toast('Erro: '+e.message,'err')}
}
async function delOficina(id){if(!confirm('Excluir oficina?'))return;try{await api('/oficinas/'+id,{method:'DELETE'});toast('Excluída');carregarOficinas();}catch(e){toast('Erro: '+e.message,'err')}}

// ORDENS
async function carregarOrdens(){
  document.getElementById('tb-os').innerHTML='<tr><td colspan="8" class="loading"><div class="spin"></div></td></tr>';
  const st=document.getElementById('filter-st').value;
  try{
    const d=await api('/ordens'+(st?'?status='+st:''));
    const tb=document.getElementById('tb-os');
    if(!d.length){tb.innerHTML='<tr><td colspan="8" class="empty">Nenhuma ordem</td></tr>';return;}
    tb.innerHTML=d.map(o=>`<tr>
      <td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${o.id}</td>
      <td>${esc(o.cliente?.razaoSocial||o.cliente?.documento||'—')}</td>
      <td style="font-size:12px">${esc(o.modeloVeiculo)}</td>
      <td style="color:var(--tx2);font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(o.descricaoProblema)}">${esc(o.descricaoProblema)}</td>
      <td style="font-size:12px">${o.responsavel?esc(o.responsavel.nome)+' '+pb(o.responsavel.perfil):'<span style="color:var(--tx3)">—</span>'}</td>
      <td>${sb(o.status)}</td>
      <td style="color:var(--tx2);font-size:12px">${fdt(o.dataCriacao)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm" onclick="abrirStatus(${o.id},'${o.status}')" style="margin-right:4px">Status</button>
        <button class="btn btn-sm btn-danger" onclick="delOS(${o.id})">✕</button>
      </td>
    </tr>`).join('');
  }catch(e){document.getElementById('tb-os').innerHTML=`<tr><td colspan="8" class="empty" style="color:var(--coral)">${e.message}</td></tr>`}
}
async function salvarOrdem(){
  const clienteId=document.getElementById('os-cli').value;
  const modeloVeiculo=document.getElementById('os-vei').value.trim();
  const descricaoProblema=document.getElementById('os-desc').value.trim();
  const respId=document.getElementById('os-resp').value;
  if(!clienteId||!modeloVeiculo||!descricaoProblema){toast('Preencha os campos obrigatórios','err');return;}
  const body={clienteId:parseInt(clienteId),modeloVeiculo,descricaoProblema};
  if(respId)body.responsavelId=parseInt(respId);
  try{await api('/ordens',{method:'POST',body:JSON.stringify(body)});
    toast('OS criada! Mensagem inicial enviada no chat.');closeModal('m-os');
    ['os-cli','os-vei','os-desc','os-resp'].forEach(id=>document.getElementById(id).value='');
    carregarOrdens();}catch(e){toast('Erro: '+e.message,'err')}
}
function abrirStatus(id,statusAtual){
  if(!sessao){toast('Selecione um usuário na sessão lateral para alterar status','warn');return;}
  stOsId=id;
  document.getElementById('m-st-id').textContent='OS #'+id;
  document.getElementById('novo-st').value=statusAtual;
  const pm={CLIENTE:'⛔ Clientes não podem alterar status de OS.',N1:'🟡 N1: pode mover para Em andamento ou Aguardando peça. Não pode fechar.',N2:'🔵 N2: pode fechar a OS. Não pode reabrir uma OS já fechada.',N3:'🟣 N3: acesso total — qualquer transição de status.'};
  document.getElementById('m-st-perm').textContent=pm[sessao.perfil]||'Perfil não reconhecido';
  openModal('m-st');
}
async function confirmarStatus(){
  const st=document.getElementById('novo-st').value;
  try{await api(`/ordens/${stOsId}/status?status=${st}&usuarioId=${sessao.id}`,{method:'PATCH'});
    toast('Status atualizado! Registro automático no chat.');closeModal('m-st');carregarOrdens();}
  catch(e){toast('Erro: '+e.message,'err')}
}
async function delOS(id){if(!confirm('Excluir esta OS e todo o chat?'))return;try{await api('/ordens/'+id,{method:'DELETE'});toast('OS excluída');carregarOrdens();}catch(e){toast('Erro: '+e.message,'err')}}

// CHAT
async function carregarChatOrdens(){
  const list=document.getElementById('chat-os-list');
  list.innerHTML='<div class="loading"><div class="spin"></div></div>';
  try{
    const d=await api('/ordens');
    if(!d.length){list.innerHTML='<div class="empty">Nenhuma OS</div>';return;}
    list.innerHTML=d.map(o=>`
      <div class="citem" onclick="selecionarOS(this,${o.id},'${esc(o.modeloVeiculo)}','${o.status}')">
        <div class="citem-id">OS #${o.id} · ${sl(o.status)}</div>
        <div class="citem-name">${esc(o.modeloVeiculo)}</div>
        <div style="font-size:11px;color:var(--tx3);margin-top:1px">${esc(o.cliente?.razaoSocial||o.cliente?.documento||'')}</div>
      </div>`).join('');
  }catch(e){list.innerHTML=`<div class="empty" style="color:var(--coral)">${e.message}</div>`}
}
async function selecionarOS(el,osId,veiculo,status){
  document.querySelectorAll('.citem').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');chatOsId=osId;
  document.getElementById('chat-title').textContent=`OS #${osId} — ${veiculo}`;
  document.getElementById('chat-sub').textContent=`Status: ${sl(status)} · ${sessao?'Enviando como: '+sessao.nome+' ('+sessao.perfil+')':'⚠ Selecione um usuário na sessão para enviar'}`;
  await carregarMensagens();
}
async function carregarMensagens(){
  if(!chatOsId)return;
  const msgs=document.getElementById('chat-msgs');
  msgs.innerHTML='<div class="loading"><div class="spin"></div></div>';
  try{
    const d=await api('/chat/ordem/'+chatOsId);
    if(!d.length){msgs.innerHTML='<div class="empty">Nenhuma mensagem ainda. Inicie a conversa!</div>';return;}
    const meuId=sessao?.id||0;
    msgs.innerHTML=d.map(m=>{
      const isSys=m.mensagem.startsWith('🔄')||m.mensagem.startsWith('📋');
      if(isSys)return `<div class="msg sys-msg"><div class="mbubble sys">${esc(m.mensagem)} <span style="opacity:.7">· ${esc(m.remetente.nome)} · ${fdt(m.dataEnvio)}</span></div></div>`;
      const mine=m.remetente.id===meuId;
      return `<div class="msg ${mine?'mine':''}">
        <div class="av ${avc(m.remetente.id)}" style="width:26px;height:26px;font-size:10px">${ini(m.remetente.nome)}</div>
        <div><div class="mbubble">${esc(m.mensagem)}</div>
        <div class="mtime">${esc(m.remetente.nome)} (${m.remetente.perfil}) · ${fdt(m.dataEnvio)}</div></div>
      </div>`;
    }).join('');
    msgs.scrollTop=msgs.scrollHeight;
  }catch(e){msgs.innerHTML=`<div class="empty" style="color:var(--coral)">${e.message}</div>`}
}
async function enviarMsg(){
  if(!chatOsId){toast('Selecione uma OS','warn');return;}
  if(!sessao){toast('Selecione um usuário na sessão lateral','warn');return;}
  const input=document.getElementById('cinput');
  const mensagem=input.value.trim();
  if(!mensagem)return;
  try{await api('/chat',{method:'POST',body:JSON.stringify({ordemServicoId:chatOsId,remetenteId:sessao.id,mensagem})});
    input.value='';await carregarMensagens();}
  catch(e){toast('Erro: '+e.message,'err')}
}

// RELATÓRIO
function agSb(s){const m={PENDENTE:'b-warn',CONFIRMADO:'b-ok',REAGENDADO:'b-info',CANCELADO:'b-err'};const l={PENDENTE:'Pendente',CONFIRMADO:'Confirmado',REAGENDADO:'Reagendado',CANCELADO:'Cancelado'};return `<span class="badge ${m[s]||'b-gray'}">${l[s]||s}</span>`}
async function carregarRelatorio(){
  try{
    const [os,usu,cli,ags]=await Promise.all([api('/ordens'),api('/usuarios'),api('/clientes'),api('/agendamentos')]);
    let msgs=[];
    for(const o of os){try{const m=await api('/chat/ordem/'+o.id);msgs=[...msgs,...m];}catch(e){}}
    const cnt={ABERTA:0,EM_ANDAMENTO:0,AGUARDANDO_PECA:0,FECHADA:0};
    os.forEach(o=>cnt[o.status]=(cnt[o.status]||0)+1);
    document.getElementById('r-total').textContent=os.length;
    document.getElementById('r-ab').textContent=cnt.ABERTA;
    document.getElementById('r-and').textContent=cnt.EM_ANDAMENTO;
    document.getElementById('r-ag').textContent=cnt.AGUARDANDO_PECA;
    document.getElementById('r-fec').textContent=cnt.FECHADA;
    document.getElementById('r-msg').textContent=msgs.length;
    document.getElementById('r-usu').textContent=usu.length;
    document.getElementById('r-cli').textContent=cli.length;
    if(document.getElementById('d-ag')) document.getElementById('d-ag').textContent=ags.length;
    const tot=os.length||1;
    const bc={ABERTA:'var(--amber)',EM_ANDAMENTO:'var(--blue)',AGUARDANDO_PECA:'var(--coral)',FECHADA:'var(--acc)'};
    document.getElementById('r-bar').innerHTML=Object.entries(cnt).map(([s,c])=>`
      <div class="bar-row"><span class="bar-lbl">${sl(s)}</span>
      <div class="bar-trk"><div class="bar-fill" style="width:${Math.round(c/tot*100)}%;background:${bc[s]}"></div></div>
      <span class="bar-val">${c}</span></div>`).join('');
    const oPC={};
    os.forEach(o=>{const cid=o.cliente?.id;if(!cid)return;if(!oPC[cid])oPC[cid]={c:o.cliente,t:0,a:0,f:0};oPC[cid].t++;if(o.status==='FECHADA')oPC[cid].f++;else oPC[cid].a++;});
    const tbC=document.getElementById('r-tb-cli');
    const arr=Object.values(oPC);
    tbC.innerHTML=!arr.length?'<tr><td colspan="5" class="empty">Sem dados</td></tr>':
      arr.sort((a,b)=>b.t-a.t).map(x=>`<tr>
        <td><div style="display:flex;align-items:center;gap:8px"><div class="av ${avc(x.c?.id)}" style="width:24px;height:24px;font-size:9px">${ini(x.c?.razaoSocial||x.c?.documento)}</div>${esc(x.c?.razaoSocial||'—')}</div></td>
        <td style="font-family:var(--m);font-size:12px">${esc(x.c?.documento||'—')}</td>
        <td style="font-family:var(--m);font-weight:500">${x.t}</td>
        <td>${x.a>0?`<span class="badge b-warn">${x.a}</span>`:'<span style="color:var(--tx3)">0</span>'}</td>
        <td>${x.f>0?`<span class="badge b-ok">${x.f}</span>`:'<span style="color:var(--tx3)">0</span>'}</td>
      </tr>`).join('');
    document.getElementById('r-tb-os').innerHTML=!os.length?'<tr><td colspan="7" class="empty">Sem OS</td></tr>':
      os.map(o=>`<tr>
        <td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${o.id}</td>
        <td>${esc(o.cliente?.razaoSocial||o.cliente?.documento||'—')}</td>
        <td style="font-size:12px">${esc(o.modeloVeiculo)}</td>
        <td style="color:var(--tx2);font-size:12px">${o.responsavel?esc(o.responsavel.nome):'—'}</td>
        <td>${sb(o.status)}</td>
        <td style="font-size:12px;color:var(--tx2)">${fdt(o.dataCriacao)}</td>
        <td style="font-size:12px;color:var(--tx2)">${o.dataFechamento?fdt(o.dataFechamento):'—'}</td>
      </tr>`).join('');
    document.getElementById('r-tb-msg').innerHTML=!msgs.length?'<tr><td colspan="5" class="empty">Nenhuma mensagem</td></tr>':
      msgs.sort((a,b)=>new Date(b.dataEnvio)-new Date(a.dataEnvio)).map(m=>`<tr>
        <td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${m.ordemServicoId}</td>
        <td><div style="display:flex;align-items:center;gap:6px"><div class="av ${avc(m.remetente.id)}" style="width:22px;height:22px;font-size:9px">${ini(m.remetente.nome)}</div>${esc(m.remetente.nome)}</div></td>
        <td>${pb(m.remetente.perfil)}</td>
        <td style="font-size:12px;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(m.mensagem)}">${esc(m.mensagem)}</td>
        <td style="font-size:12px;color:var(--tx2)">${fdt(m.dataEnvio)}</td>
      </tr>`).join('');
    document.getElementById('r-tb-ag').innerHTML=!ags.length?'<tr><td colspan="7" class="empty">Nenhum agendamento</td></tr>':
      ags.map(a=>`<tr>
        <td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${a.id}</td>
        <td>${esc(a.cliente?.razaoSocial||a.cliente?.documento||'—')}</td>
        <td style="font-size:12px">${esc(a.oficina?.nome||'—')}</td>
        <td style="font-family:var(--m);font-size:12px">${fdt(a.dataHora)}</td>
        <td style="font-size:12px">${esc(a.tipoServico)}</td>
        <td>${agSb(a.status)}</td>
        <td style="font-size:12px;color:var(--tx2)">${a.canceladoPor?esc(a.canceladoPor.nome):'—'}</td>
      </tr>`).join('');
  }catch(e){toast('Erro relatório: '+e.message,'err')}
}

// EXCLUIR TODAS
function abrirDelAll(){document.getElementById('del-conf').value='';openModal('m-del')}
async function excluirTodas(){
  if(document.getElementById('del-conf').value.trim()!=='CONFIRMAR'){toast('Digite CONFIRMAR para prosseguir','err');return;}
  try{await api('/ordens/todas',{method:'DELETE'});
    toast('Todas as OS foram excluídas.','warn');closeModal('m-del');
    carregarDashboard();carregarRelatorio();}
  catch(e){toast('Erro: '+e.message,'err')}
}


// =============================================
// AGENDAMENTOS
// =============================================
let agIdReag = null;
let agIdCancel = null;
let agIdHist = null;

const TIPOS_SERVICO = ['Revisao geral','Troca de oleo','Freio','Alinhamento e balanceamento','Troca de pneus','Suspensao','Sistema eletrico','Ar condicionado','Motor','Cambio','Outro'];

function agStBadge(s){
  const m={PENDENTE:'b-warn',CONFIRMADO:'b-ok',REAGENDADO:'b-info',CANCELADO:'b-err'};
  const l={PENDENTE:'Pendente',CONFIRMADO:'Confirmado',REAGENDADO:'Reagendado',CANCELADO:'Cancelado'};
  return `<span class="badge ${m[s]||'b-gray'}">${l[s]||s}</span>`;
}

async function carregarAgendamentos(){
  document.getElementById('tb-ag').innerHTML='<tr><td colspan="8" class="loading"><div class="spin"></div></td></tr>';
  const st=document.getElementById('ag-filter').value;
  try{
    const d=await api('/agendamentos'+(st?'?status='+st:''));
    const tb=document.getElementById('tb-ag');
    if(!d.length){tb.innerHTML='<tr><td colspan="8" class="empty">Nenhum agendamento encontrado</td></tr>';return;}
    tb.innerHTML=d.map(a=>{
      const cancelado = a.status==='CANCELADO';
      const acoes = cancelado ? `<button class="btn btn-sm" onclick="verHistorico(${a.id})">Historico</button>` : `
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${a.status!=='CONFIRMADO'?`<button class="btn btn-sm b-ok-btn" onclick="confirmarAg(${a.id})" style="background:var(--acc-l);color:var(--acc-d);border-color:var(--acc)">Confirmar</button>`:''}
          <button class="btn btn-sm" onclick="abrirReagendar(${a.id},'${esc(a.tipoServico)}','${a.dataHora}')">Reagendar</button>
          <button class="btn btn-sm btn-danger" onclick="abrirCancelar(${a.id},'${esc(a.tipoServico)}')">Cancelar</button>
          <button class="btn btn-sm" onclick="verHistorico(${a.id})" style="color:var(--tx2)">Hist.</button>
        </div>`;
      return `<tr>
        <td style="font-family:var(--m);font-size:12px;color:var(--tx2)">#${a.id}</td>
        <td>${esc(a.cliente?.razaoSocial||a.cliente?.documento||'—')}</td>
        <td style="font-size:12px">${esc(a.oficina?.nome||'—')}</td>
        <td style="font-family:var(--m);font-size:12px">${fdt(a.dataHora)}</td>
        <td style="font-size:12px">${esc(a.tipoServico)}</td>
        <td>${agStBadge(a.status)}</td>
        <td style="font-size:12px;color:var(--tx2)">${cancelado?(esc(a.canceladoPor?.nome||'—')+' <span style="color:var(--tx3)">— '+esc(a.motivoCancelamento||'')+'</span>'):'—'}</td>
        <td>${acoes}</td>
      </tr>`;
    }).join('');
  }catch(e){document.getElementById('tb-ag').innerHTML=`<tr><td colspan="8" class="empty" style="color:var(--coral)">${e.message}</td></tr>`}
}

async function popularOficinas(){
  try{
    const d=await api('/oficinas');
    const sel=document.getElementById('ag-ofi');
    sel.innerHTML='<option value="">Selecione a oficina...</option>'+
      d.map(o=>`<option value="${o.id}">${esc(o.nome)} — ${esc(o.endereco)}</option>`).join('');
  }catch(e){document.getElementById('ag-ofi').innerHTML='<option value="">Erro ao carregar</option>';}
}

document.getElementById('ag-tipo').addEventListener('change',function(){
  document.getElementById('ag-outro-wrap').style.display=this.value==='Outro'?'flex':'none';
});

async function salvarAgendamento(){
  const clienteId=document.getElementById('ag-cli').value;
  const oficinaId=document.getElementById('ag-ofi').value;
  const dataHora=document.getElementById('ag-dt').value;
  const tipoRaw=document.getElementById('ag-tipo').value;
  const tipoOutro=document.getElementById('ag-outro').value.trim();
  const tipoServico=tipoRaw==='Outro'?tipoOutro:tipoRaw;

  if(!clienteId){toast('Informe o ID do cliente','err');return;}
  if(!oficinaId){toast('Selecione a oficina','err');return;}
  if(!dataHora){toast('Informe a data e hora','err');return;}
  if(!tipoServico){toast('Selecione o tipo de servico','err');return;}

  const isoDate=dataHora.includes('T')?dataHora+':00':dataHora;
  try{
    await api('/agendamentos',{method:'POST',body:JSON.stringify({
      clienteId:parseInt(clienteId),
      oficinaId:parseInt(oficinaId),
      dataHora:isoDate,
      tipoServico
    })});
    toast('Agendamento criado!');closeModal('m-ag');
    document.getElementById('ag-cli').value='';
    document.getElementById('ag-ofi').value='';
    document.getElementById('ag-dt').value='';
    document.getElementById('ag-tipo').value='';
    document.getElementById('ag-outro').value='';
    document.getElementById('ag-outro-wrap').style.display='none';
    carregarAgendamentos();
  }catch(e){toast('Erro: '+e.message,'err')}
}

async function confirmarAg(id){
  try{
    await api('/agendamentos/'+id+'/confirmar',{method:'PATCH'});
    toast('Agendamento confirmado!');carregarAgendamentos();
  }catch(e){toast('Erro: '+e.message,'err')}
}

function abrirReagendar(id,tipo,dataHoraAtual){
  agIdReag=id;
  document.getElementById('reag-id').textContent='#'+id;
  document.getElementById('reag-info').textContent='Servico: '+tipo+' | Data atual: '+fdt(dataHoraAtual);
  document.getElementById('reag-dt').value='';
  document.getElementById('reag-obs').value='';
  openModal('m-reag');
}

async function confirmarReagendar(){
  if(!sessao){toast('Selecione um usuario na sessao lateral','warn');return;}
  const novaDataHora=document.getElementById('reag-dt').value;
  const observacao=document.getElementById('reag-obs').value.trim();
  if(!novaDataHora){toast('Informe a nova data e hora','err');return;}
  const isoDate=novaDataHora.includes('T')?novaDataHora+':00':novaDataHora;
  try{
    await api('/agendamentos/'+agIdReag+'/reagendar',{
      method:'PATCH',
      body:JSON.stringify({novaDataHora:isoDate,usuarioId:sessao.id,observacao:observacao||null})
    });
    toast('Reagendado com sucesso! Historico registrado.');
    closeModal('m-reag');carregarAgendamentos();
  }catch(e){toast('Erro: '+e.message,'err')}
}

function abrirCancelar(id,tipo){
  agIdCancel=id;
  document.getElementById('cancel-id').textContent='#'+id;
  document.getElementById('cancel-info').textContent='Servico: '+tipo+' | Esta acao nao pode ser desfeita.';
  document.getElementById('cancel-motivo').value='';
  openModal('m-cancel');
}

async function confirmarCancelar(){
  if(!sessao){toast('Selecione um usuario na sessao lateral','warn');return;}
  const motivo=document.getElementById('cancel-motivo').value.trim();
  if(!motivo){toast('Informe o motivo do cancelamento','err');return;}
  try{
    await api('/agendamentos/'+agIdCancel+'/cancelar',{
      method:'PATCH',
      body:JSON.stringify({usuarioId:sessao.id,motivo})
    });
    toast('Agendamento cancelado. Motivo registrado.');
    closeModal('m-cancel');carregarAgendamentos();
  }catch(e){toast('Erro: '+e.message,'err')}
}

async function verHistorico(id){
  agIdHist=id;
  document.getElementById('hist-id').textContent='Agendamento #'+id;
  document.getElementById('hist-content').innerHTML='<div class="loading"><div class="spin"></div><br>Carregando...</div>';
  openModal('m-hist');
  try{
    const d=await api('/agendamentos/'+id+'/historico');
    const el=document.getElementById('hist-content');
    if(!d.length){
      el.innerHTML='<div class="empty">Nenhum reagendamento registrado para este agendamento.</div>';
      return;
    }
    el.innerHTML=`<table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr>
        <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:500;color:var(--tx2);border-bottom:0.5px solid var(--bdr);text-transform:uppercase">Data anterior</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:500;color:var(--tx2);border-bottom:0.5px solid var(--bdr);text-transform:uppercase">Nova data</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:500;color:var(--tx2);border-bottom:0.5px solid var(--bdr);text-transform:uppercase">Alterado por</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:500;color:var(--tx2);border-bottom:0.5px solid var(--bdr);text-transform:uppercase">Observacao</th>
        <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:500;color:var(--tx2);border-bottom:0.5px solid var(--bdr);text-transform:uppercase">Registrado em</th>
      </tr></thead>
      <tbody>
        ${d.map(h=>`<tr>
          <td style="padding:10px 12px;border-bottom:0.5px solid rgba(0,0,0,0.05);font-size:12px;font-family:var(--m);color:var(--coral)">${fdt(h.dataHoraAnterior)}</td>
          <td style="padding:10px 12px;border-bottom:0.5px solid rgba(0,0,0,0.05);font-size:12px;font-family:var(--m);color:var(--acc-d)">${fdt(h.dataHoraNova)}</td>
          <td style="padding:10px 12px;border-bottom:0.5px solid rgba(0,0,0,0.05);font-size:12px">
            <div style="display:flex;align-items:center;gap:6px">
              <div class="av ${avc(h.alteradoPor.id)}" style="width:22px;height:22px;font-size:9px">${ini(h.alteradoPor.nome)}</div>
              ${esc(h.alteradoPor.nome)} ${pb(h.alteradoPor.perfil)}
            </div>
          </td>
          <td style="padding:10px 12px;border-bottom:0.5px solid rgba(0,0,0,0.05);font-size:12px;color:var(--tx2)">${esc(h.observacao||'—')}</td>
          <td style="padding:10px 12px;border-bottom:0.5px solid rgba(0,0,0,0.05);font-size:12px;color:var(--tx2)">${fdt(h.dataAlteracao)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  }catch(e){
    document.getElementById('hist-content').innerHTML=`<div class="empty" style="color:var(--coral)">${e.message}</div>`;
  }
}


// =============================================
// PDF EXPORT
// =============================================
async function exportarPDF() {
  const btn = document.getElementById('btn-pdf');
  btn.textContent = '⏳ Gerando PDF...';
  btn.disabled = true;

  try {
    const [os, usu, cli, ofi, ags] = await Promise.all([
      api('/ordens'), api('/usuarios'), api('/clientes'),
      api('/oficinas'), api('/agendamentos')
    ]);

    let todasMsgs = [];
    for (const o of os) {
      try { const m = await api('/chat/ordem/' + o.id); todasMsgs = [...todasMsgs, ...m]; } catch(e) {}
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const MARGIN = 14;
    const ACC = [29, 158, 117];
    const DARK = [17, 17, 17];
    const GRAY = [120, 120, 120];
    const LIGHT_BG = [245, 244, 240];
    let y = 0;

    const addPage = () => { doc.addPage(); y = 20; };

    const checkSpace = (needed) => { if (y + needed > PH - 16) addPage(); };

    const drawHeader = () => {
      doc.setFillColor(...ACC);
      doc.rect(0, 0, PW, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('AutoSystem — Relatório Geral', MARGIN, 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const now = new Date().toLocaleString('pt-BR');
      doc.text('Gerado em: ' + now, PW - MARGIN, 12, { align: 'right' });
      y = 26;
    };

    const sectionTitle = (title) => {
      checkSpace(14);
      doc.setFillColor(235, 250, 244);
      doc.rect(MARGIN - 2, y - 4, PW - MARGIN * 2 + 4, 9, 'F');
      doc.setDrawColor(...ACC);
      doc.setLineWidth(0.5);
      doc.line(MARGIN - 2, y - 4, MARGIN - 2, y + 5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...ACC);
      doc.text(title.toUpperCase(), MARGIN + 2, y + 1);
      doc.setTextColor(...DARK);
      y += 10;
    };

    const metricGrid = (items) => {
      checkSpace(22);
      const cols = Math.min(items.length, 4);
      const w = (PW - MARGIN * 2) / cols;
      items.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        if (col === 0 && row > 0) { y += 18; checkSpace(18); }
        const x = MARGIN + col * w;
        const bx = x + 1, by = y - 4, bw = w - 2, bh = 15;
        doc.setFillColor(...LIGHT_BG);
        doc.roundedRect(bx, by, bw, bh, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...GRAY);
        doc.text(item.label, bx + 4, by + 5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(item.color || DARK[0], item.color ? item.color : DARK[1], item.color ? item.color : DARK[2]);
        doc.text(String(item.value), bx + 4, by + 12);
      });
      y += 20;
    };

    const autoTable = (headers, rows, opts = {}) => {
      doc.autoTable({
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: [headers],
        body: rows,
        styles: { fontSize: 7, cellPadding: 2.5, textColor: DARK, lineColor: [220, 220, 220], lineWidth: 0.3 },
        headStyles: { fillColor: ACC, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        columnStyles: opts.columnStyles || {},
        didDrawPage: (data) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(...GRAY);
          doc.text('AutoSystem — Relatório Confidencial', MARGIN, PH - 8);
          doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, PW - MARGIN, PH - 8, { align: 'right' });
        },
        ...opts
      });
      y = doc.lastAutoTable.finalY + 8;
    };

    const statusLabel = (s) => ({ ABERTA: 'Aberta', EM_ANDAMENTO: 'Em andamento', AGUARDANDO_PECA: 'Ag. peca', FECHADA: 'Fechada' }[s] || s);
    const agStLabel = (s) => ({ PENDENTE: 'Pendente', CONFIRMADO: 'Confirmado', REAGENDADO: 'Reagendado', CANCELADO: 'Cancelado' }[s] || s);
    const fdt = (dt) => dt ? new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
    const fdo = (dt) => dt ? new Date(dt).toLocaleDateString('pt-BR') : '—';

    // ── PAGE 1 ──────────────────────────────────────
    drawHeader();

    sectionTitle('Resumo Geral');
    const cnt = { ABERTA: 0, EM_ANDAMENTO: 0, AGUARDANDO_PECA: 0, FECHADA: 0 };
    const agCnt = { PENDENTE: 0, CONFIRMADO: 0, REAGENDADO: 0, CANCELADO: 0 };
    os.forEach(o => cnt[o.status] = (cnt[o.status] || 0) + 1);
    ags.forEach(a => agCnt[a.status] = (agCnt[a.status] || 0) + 1);

    metricGrid([
      { label: 'Total de OS', value: os.length },
      { label: 'OS Abertas', value: cnt.ABERTA, color: 186 },
      { label: 'Em Andamento', value: cnt.EM_ANDAMENTO, color: 24 },
      { label: 'OS Fechadas', value: cnt.FECHADA, color: 29 },
      { label: 'Agendamentos', value: ags.length },
      { label: 'Ag. Pendentes', value: agCnt.PENDENTE, color: 186 },
      { label: 'Ag. Confirmados', value: agCnt.CONFIRMADO, color: 29 },
      { label: 'Ag. Cancelados', value: agCnt.CANCELADO, color: 163 },
      { label: 'Total Usuários', value: usu.length },
      { label: 'Total Clientes', value: cli.length },
      { label: 'Oficinas', value: ofi.length },
      { label: 'Mensagens Chat', value: todasMsgs.length },
    ]);

    sectionTitle('Distribuição de OS por Status');
    const total = os.length || 1;
    const statusRows = Object.entries(cnt).map(([s, c]) => [
      statusLabel(s),
      String(c),
      Math.round(c / total * 100) + '%'
    ]);
    autoTable(['Status', 'Quantidade', 'Percentual'], statusRows, {
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 } }
    });

    // ── ORDENS DE SERVIÇO ──
    sectionTitle('Todas as Ordens de Serviço');
    const osRows = os.map(o => [
      '#' + o.id,
      o.cliente?.razaoSocial || o.cliente?.documento || '—',
      o.modeloVeiculo,
      o.responsavel?.nome || '—',
      statusLabel(o.status),
      fdt(o.dataCriacao),
      o.dataFechamento ? fdt(o.dataFechamento) : '—'
    ]);
    autoTable(
      ['OS', 'Cliente', 'Veículo', 'Responsável', 'Status', 'Criado em', 'Fechado em'],
      osRows,
      { columnStyles: { 0: { cellWidth: 12 }, 5: { cellWidth: 28 }, 6: { cellWidth: 28 } } }
    );

    // ── OS POR CLIENTE ──
    checkSpace(20);
    sectionTitle('OS por Cliente');
    const osPorCli = {};
    os.forEach(o => {
      const cid = o.cliente?.id;
      if (!cid) return;
      if (!osPorCli[cid]) osPorCli[cid] = { nome: o.cliente?.razaoSocial || o.cliente?.documento || '—', doc: o.cliente?.documento || '—', total: 0, abertos: 0, fechados: 0 };
      osPorCli[cid].total++;
      if (o.status === 'FECHADA') osPorCli[cid].fechados++;
      else osPorCli[cid].abertos++;
    });
    const cliRows = Object.values(osPorCli).sort((a, b) => b.total - a.total).map(x => [
      x.nome, x.doc, String(x.total), String(x.abertos), String(x.fechados)
    ]);
    autoTable(['Cliente', 'Documento', 'Total OS', 'Em Aberto', 'Fechadas'], cliRows, {
      columnStyles: { 2: { cellWidth: 20 }, 3: { cellWidth: 22 }, 4: { cellWidth: 22 } }
    });

    // ── AGENDAMENTOS ──
    checkSpace(20);
    sectionTitle('Agendamentos');
    const agRows = ags.map(a => [
      '#' + a.id,
      a.cliente?.razaoSocial || a.cliente?.documento || '—',
      a.oficina?.nome || '—',
      fdt(a.dataHora),
      a.tipoServico,
      agStLabel(a.status),
      a.canceladoPor ? a.canceladoPor.nome : '—'
    ]);
    autoTable(
      ['#', 'Cliente', 'Oficina', 'Data/Hora', 'Tipo', 'Status', 'Cancelado por'],
      agRows,
      { columnStyles: { 0: { cellWidth: 10 }, 3: { cellWidth: 28 } } }
    );

    // ── HISTÓRICO DE MENSAGENS ──
    checkSpace(20);
    sectionTitle('Histórico de Mensagens do Chat');
    const msgRows = todasMsgs
      .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
      .map(m => [
        '#' + m.ordemServicoId,
        m.remetente?.nome || '—',
        m.remetente?.perfil || '—',
        m.mensagem.length > 80 ? m.mensagem.substring(0, 77) + '...' : m.mensagem,
        fdt(m.dataEnvio)
      ]);
    autoTable(
      ['OS', 'Remetente', 'Perfil', 'Mensagem', 'Enviado em'],
      msgRows,
      { columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 18 }, 4: { cellWidth: 30 } } }
    );

    // ── USUÁRIOS CADASTRADOS ──
    checkSpace(20);
    sectionTitle('Usuários Cadastrados');
    const usuRows = usu.map(u => [u.nome, u.email, u.perfil, fdo(u.dataCriacao)]);
    autoTable(['Nome', 'E-mail', 'Perfil', 'Cadastro'], usuRows);

    // ── SAVE ──
    const filename = 'autosystem-relatorio-' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(filename);
    toast('PDF gerado e baixado com sucesso!');
  } catch(e) {
    toast('Erro ao gerar PDF: ' + e.message, 'err');
    console.error(e);
  } finally {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> Exportar PDF';
    btn.disabled = false;
  }
}

// INIT
carregarDashboard();
carregarSessaoSelect();
