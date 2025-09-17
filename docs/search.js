// 简单客户端搜索：加载 search_index.json 并在本地过滤标题与正文
let searchIndex = [];
fetch('/docs/search_index.json').then(r=>r.json()).then(data=>{searchIndex=data});

function createSearchUI() {
  const container = document.createElement('div');
  container.className = 'search-wrap';
  container.innerHTML = `
    <input id="site-search" placeholder="搜索术语或关键词（回车）" aria-label="搜索" />
    <div id="search-results" class="search-results" aria-live="polite"></div>
  `;
  return container;
}

function highlight(text, q){
  if(!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return text.replace(new RegExp(esc,'ig'), m=>`<mark>${m}</mark>`);
}

function performSearch(q){
  q = q.trim();
  const resultsEl = document.getElementById('search-results');
  if(!q){ resultsEl.innerHTML=''; return; }
  const tokens = q.split(/\s+/).filter(Boolean).map(s=>s.toLowerCase());
  const matches = searchIndex.map(item=>{
    const scoreTitle = tokens.reduce((acc,t)=> acc + (item.title.toLowerCase().includes(t)?2:0),0);
    const scoreBody = tokens.reduce((acc,t)=> acc + (item.body.toLowerCase().includes(t)?1:0),0);
    const scoreSection = tokens.reduce((acc,t)=> acc + (item.section.toLowerCase().includes(t)?1:0),0);
    const score = scoreTitle*3 + scoreBody*1 + scoreSection*1;
    return {...item,score};
  }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,10);

  if(matches.length===0){ resultsEl.innerHTML='<div class="no-results">未找到结果</div>'; return }

  resultsEl.innerHTML = matches.map(m=>{
    return `<a class="sr-item" href="${m.url}">
      <div class="sr-title">${highlight(m.title,q)}</div>
      <div class="sr-meta">${m.section}</div>
      <div class="sr-body">${highlight(m.body,q)}</div>
    </a>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  // 把搜索插入到 header 后面
  const header = document.querySelector('.container header');
  if(header){
    const ui = createSearchUI();
    header.parentNode.insertBefore(ui, header.nextSibling);
    const input = document.getElementById('site-search');
    input.addEventListener('input', e=>performSearch(e.target.value));
    input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ performSearch(e.target.value); } });
  }
});
