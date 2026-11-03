/* testIA — navigation du prototype, catalogue et fiches.
   Aucun achat, formulaire ou appel distant. */
(() => {
  'use strict';
  const products = window.TESTIA_PRODUCTS || [];
  const families = window.TESTIA_TYPES || {};
  const typeNumber = {procedures:'01',outils:'02',formations:'03'};
  const typeSymbol = {procedures:'P',outils:'O',formations:'F'};

  function buildCard(product) {
    const link = document.createElement('a');
    link.className = 'product-card';
    link.href = './produit.html?id=' + encodeURIComponent(product.id);
    link.dataset.type = product.type;
    link.setAttribute('aria-label', 'Découvrir ' + product.title);

    const head = document.createElement('div');
    head.className = 'product-card-head';
    const number = document.createElement('span');
    number.textContent = product.number;
    const family = document.createElement('span');
    family.textContent = (families[product.type] || {}).singular || 'Offre';
    head.append(number,family);

    const mark = document.createElement('div');
    mark.className = 'product-mark';
    mark.setAttribute('aria-hidden','true');
    mark.textContent = typeSymbol[product.type] || '↗';

    const title = document.createElement('h3');
    title.textContent = product.title;
    const description = document.createElement('p');
    description.textContent = product.short;

    const foot = document.createElement('div');
    foot.className = 'product-card-foot';
    const status = document.createElement('span');
    status.textContent = product.status;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden','true');
    foot.append(status,arrow);
    link.append(head,mark,title,description,foot);
    return link;
  }
  function fillCards(element, list) {
    if (!element) return;
    element.replaceChildren(...list.map(buildCard));
  }
  function initMobileNav() {
    // L'accueil réutilise le contrôleur de Banque Outils IA (kinetic-hero.js).
    if (document.getElementById('kineticStage')) return;
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open ? 'Fermer le menu' : 'Ouvrir le menu');
      toggle.textContent = open ? 'FERMER ×' : 'MENU ☰';
    }
    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) {setOpen(false); toggle.focus();}
    });
  }
  function initHomepage() {
    const homeGrid = document.getElementById('featuredGrid');
    if (homeGrid) fillCards(homeGrid, ['conciergerie','redaction','formation-3d'].map(id => products.find(p => p.id === id)).filter(Boolean));
    const buttons = [...document.querySelectorAll('.selector-option')];
    if (!buttons.length) return;
    const title = document.getElementById('goalTitle');
    const description = document.getElementById('goalDescription');
    const link = document.getElementById('goalLink');
    function select(type) {
      const family = families[type];
      if (!family) return;
      buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.goal === type)));
      title.textContent = family.label;
      description.textContent = family.description;
      link.href = './catalogue.html?type=' + encodeURIComponent(type);
    }
    buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.goal)));
    select('procedures');
  }
  function initCatalogue() {
    const grid = document.getElementById('catalogueGrid');
    if (!grid) return;
    const search = document.getElementById('catalogSearch');
    const count = document.getElementById('catalogCount');
    const empty = document.getElementById('emptyState');
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const initial = new URLSearchParams(location.search).get('type');
    let filter = Object.prototype.hasOwnProperty.call(families, initial) ? initial : 'all';
    function render() {
      const query = (search.value || '').trim().toLocaleLowerCase('fr');
      const filtered = products.filter(p => {
        const matchType = filter === 'all' || p.type === filter;
        const text = [p.title,p.short,p.summary,p.audience,p.detail,(families[p.type] || {}).label].join(' ').toLocaleLowerCase('fr');
        return matchType && text.includes(query);
      });
      fillCards(grid,filtered);
      empty.hidden = filtered.length !== 0;
      count.textContent = filtered.length + (filtered.length > 1 ? ' offres' : ' offre');
      buttons.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === filter)));
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter || 'all';
      const url = new URL(location.href);
      if (filter === 'all') url.searchParams.delete('type');
      else url.searchParams.set('type',filter);
      history.replaceState(null,'',url.pathname + url.search + url.hash);
      render();
    }));
    search.addEventListener('input',render);
    window.addEventListener('popstate', () => {
      const value = new URLSearchParams(location.search).get('type');
      filter = families[value] ? value : 'all';
      render();
    });
    render();
  }
  function initProductDetail() {
    const root = document.getElementById('detailRoot');
    if (!root) return;
    const id = new URLSearchParams(location.search).get('id');
    const product = products.find(p => p.id === id);
    if (!product) {
      root.innerHTML = '<div class="detail-error"><span class="small-eyebrow">FICHE INTROUVABLE</span><h1>Ce produit n’est pas disponible.</h1><p>Retrouvez l’ensemble des produits dans le catalogue.</p><a class="detail-back" href="./catalogue.html">← Voir toutes les offres</a></div>';
      document.title = 'Produit introuvable — Studio IA';
      return;
    }
    const family = families[product.type];
    document.title = product.title + ' — Studio IA / prototype';
    root.innerHTML = '<div class="detail-layout"><div class="detail-main"><div class="breadcrumb"><a href="./index.html">ACCUEIL</a> / <a href="./catalogue.html">PRODUITS</a> / <span id="crumbFamily"></span></div><span class="small-eyebrow" id="detailEyebrow" style="display:block;margin-top:55px"></span><h1 id="detailTitle"></h1><p class="detail-lead" id="detailLead"></p><p class="detail-copy" id="detailCopy"></p><div class="detail-bullets"><h2>Ce que vous y trouverez</h2><ul id="detailFeatures"></ul></div><div class="detail-result"><span class="small-eyebrow">OBJECTIF</span><p id="detailResult"></p></div><a class="detail-back" id="detailBack" href="./catalogue.html">← Retour à cette collection</a></div><aside class="detail-aside"><span class="small-eyebrow">FICHE / APERÇU</span><div class="detail-symbol" id="detailSymbol" aria-hidden="true"></div><h2 id="asideTitle"></h2><div class="detail-fact"><span>Collection</span><b id="asideFamily"></b></div><div class="detail-fact"><span>Format</span><b id="asideFormat"></b></div><div class="detail-fact"><span>Public</span><b id="asideAudience"></b></div><div class="detail-fact"><span>Disponibilité</span><b id="asideStatus"></b></div><p class="detail-notice">Prototype de présentation : aucun achat ni inscription n’est possible depuis cette page.</p><a class="detail-action" id="detailCTA" href="./catalogue.html">Explorer la collection ↗</a></aside></div>';
    const set = (id,value) => { document.getElementById(id).textContent = value; };
    set('crumbFamily',family.label);
    set('detailEyebrow',product.number + ' / ' + family.singular.toUpperCase());
    set('detailTitle',product.title);
    set('detailLead',product.short);
    set('detailCopy',product.summary);
    set('detailResult',product.result);
    set('detailSymbol',typeNumber[product.type]);
    set('asideTitle',product.detail);
    set('asideFamily',family.label);
    set('asideFormat',product.detail);
    set('asideAudience',product.audience);
    set('asideStatus',product.status);
    const familyUrl = './catalogue.html?type=' + encodeURIComponent(product.type);
    document.getElementById('detailBack').href = familyUrl;
    document.getElementById('detailCTA').href = familyUrl;
    const ul = document.getElementById('detailFeatures');
    product.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      ul.appendChild(li);
    });
    const related = products.filter(p => p.type === product.type && p.id !== product.id).slice(0,3);
    if (related.length) {
      document.getElementById('relatedSection').hidden = false;
      fillCards(document.getElementById('relatedGrid'),related);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHomepage();
    initCatalogue();
    initProductDetail();
  });
})();
