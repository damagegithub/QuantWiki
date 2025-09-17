// Lightweight SPA using Preact + htm (no build)
(async ()=>{
  const { h, render } = window.preact;
  const htm = window.htm;
  const html = htm.bind(h);

  const dataRes = await fetch('./search_index.json');
  const data = await dataRes.json();

  // group by section and title
  const sections = {};
  data.forEach(item=>{
    const s = item.section || '其他';
    if(!sections[s]) sections[s]=[];
    sections[s].push(item);
  });

  function App(){
    const [selected, setSelected] = window.preactHooks.useState(null);
    const [filter, setFilter] = window.preactHooks.useState('');

    const sectionNames = Object.keys(sections);

    const flatList = Object.values(sections).flat();
    const filtered = flatList.filter(it=>{
      if(!filter) return true;
      const q = filter.toLowerCase();
      return it.title.toLowerCase().includes(q) || it.body.toLowerCase().includes(q) || it.section.toLowerCase().includes(q);
    });

    return html`
      <div class="app-layout">
        <aside class="sidebar">
          <div class="sidebar-top">
            <input class="search-small" placeholder="快速搜索" value=${filter} onInput=${e=>setFilter(e.target.value)} />
            <select onChange=${e=>setSelected(filtered[+e.target.value]||null)}>
              <option value="">选择条目</option>
              ${filtered.map((it,idx)=> html`<option value=${idx}>${it.section} — ${it.title}</option>`)}
            </select>
          </div>

          <nav class="side-nav">
            ${sectionNames.map(sec=> html`<div class="sec-block">
              <h4>${sec}</h4>
              <ul>
                ${sections[sec].map(it=> html`<li><a href="#" onClick=${e=>{e.preventDefault(); setSelected(it);}}>${it.title}</a></li>`)}
              </ul>
            </div>`)}
          </nav>
        </aside>

        <main class="content">
          ${selected ? html`<article>
            <h2>${selected.title}</h2>
            <p class="meta">${selected.section} · <a href=${selected.url}>源页面</a></p>
            <p>${selected.body}</p>
          </article>` : html`<div class="empty">请选择左侧主题或使用上方下拉/搜索查看详情</div>`}
        </main>
      </div>
    `;
  }

  // Mount app
  const mount = document.getElementById('app');
  render(html`<${App} />`, mount);
})();
