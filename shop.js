
/* ============================================================
   COURSE STUDY NOTES — combined skills in one build
   The bootcamp track (steps 1-5) is complete: live APIs, Node +
   Express, databases + REST, authentication, and React. This
   post-course portfolio build combines the front-end patterns
   from across the course in plain JavaScript:
   1. DATA-DRIVEN RENDERING — the catalogue below is an array of
      objects; cards are built from data, never hand-written HTML.
   2. STATE + PERSISTENCE — cart and wishlist live in variables,
      are saved to localStorage on every change (saveCart /
      saveWish), and are restored on load, so state survives
      page changes and reloads.
   3. DERIVED STATE — the visible list is computed from genre +
      search + sort on every render; totals in the cart are
      computed from the cart array, never stored.
   4. CONTROLLED FLOWS — the modal's condition selector changes
      the price (Used = 20% off), and checkout validates before
      it confirms. See cart.js for the validation pattern.
   ============================================================ */
const RECORDS = [
 {id:"r1", title:"Midnight in Memphis", artist:"The Delta Suns", genre:"Blues", price:28, year:1972, rating:4.9, cond:"Reissue", img:"images/r1.jpg", blurb:"Slow-burning electric blues cut live to tape, with a horn section that never hurries.", tracks:["Midnight in Memphis","Beale Street Rain","Low Down Lantern","Last Train South"]},
 {id:"r2", title:"Velvet Static", artist:"Nova Rae", genre:"Soul", price:32, year:1975, rating:4.8, cond:"Original", img:"images/r2.jpg", blurb:"Silk-and-grit soul with strings, a locked-in rhythm section, and one perfect ballad per side.", tracks:["Velvet Static","Sugar on the Wire","Half Past Loving You","Turntable Heart"]},
 {id:"r3", title:"Copper Skyline", artist:"Fern Hollow", genre:"Indie", price:26, year:2019, rating:4.7, cond:"New", img:"images/r3.jpg", blurb:"Jangly modern indie recorded in a converted barn studio over one long summer.", tracks:["Copper Skyline","Paper Kites","County Line","Slow Parade"]},
 {id:"r4", title:"Blue Note Reverie", artist:"Ellis Ward Quartet", genre:"Jazz", price:34, year:1963, rating:5.0, cond:"Reissue", img:"images/r4.jpg", blurb:" Late-night quartet jazz, brushed drums and a piano that thinks before it speaks.", tracks:["Reverie in Blue","Third Cup of Coffee","Ward's Waltz","After Hours"]},
 {id:"r5", title:"Funkyard Parade", artist:"The Groove Merchants", genre:"Funk", price:29, year:1977, rating:4.8, cond:"Original", img:"images/r5.jpg", blurb:"Nine-piece funk with parade horns, wah guitar, and choruses built for a block party.", tracks:["Funkyard Parade","Brass & Butter","Sidewalk Strut","Encore Weather"]},
 {id:"r6", title:"Dust and Diesel", artist:"Harlan Cole", genre:"Rock", price:27, year:1971, rating:4.6, cond:"Original", img:"images/r6.jpg", blurb:"Highway rock and roll, twin guitars and stories from three tours in a borrowed van.", tracks:["Dust and Diesel","Mile Marker 9","Cheap Motel Moon","Gasoline Hymn"]},
 {id:"r7", title:"Golden Hour Radio", artist:"June Calloway", genre:"Soul", price:31, year:1968, rating:4.9, cond:"Reissue", img:"images/r7.jpg", blurb:"Warm AM-gold soul, the kind of record a whole kitchen slows down for.", tracks:["Golden Hour Radio","Calloway's Lament","Sunday Dial","Signal Fires"]},
 {id:"r8", title:"Night Market", artist:"Sable and The Signals", genre:"Indie", price:25, year:2022, rating:4.5, cond:"New", img:"images/r8.jpg", blurb:"Synth-tinted indie pop about night buses, neon, and staying out one song longer.", tracks:["Night Market","Neon Confetti","Last Bus Home","Signal Lost"]},
 {id:"r9", title:"Riverbend Hymns", artist:"Hollow Creek Choir", genre:"Blues", price:30, year:1965, rating:4.7, cond:"Reissue", img:"images/r9.jpg", blurb:"Gospel-blues harmonies recorded in a one-room church at the bend of the river.", tracks:["Riverbend Hymns","Wade in the Sound","Choir Loft Blues","Amen Corner"]},
 {id:"r10", title:"Saturn Returns", artist:"Milo Vance Trio", genre:"Jazz", price:36, year:1959, rating:4.9, cond:"Original", img:"images/r10.jpg", blurb:"Sparse, searching piano trio jazz that rewards a quiet room and a good needle.", tracks:["Saturn Returns","Vance's Theme","Orbital","Twenty-Nine"]},
 {id:"r11", title:"Highway Honey", artist:"Ramona Lee", genre:"Rock", price:24, year:1974, rating:4.6, cond:"Original", img:"images/r11.jpg", blurb:"Sun-faded country rock with pedal steel, close harmonies, and choruses that roll.", tracks:["Highway Honey","Ramona's Run","Two-Lane Serenade","Exit 41"]},
 {id:"r12", title:"Low Sun Funk", artist:"The Copperfield Collective", genre:"Funk", price:30, year:1979, rating:4.8, cond:"Reissue", img:"images/r12.jpg", blurb:"End-of-decade funk, slinky basslines and a drum sound like a screen door in summer.", tracks:["Low Sun Funk","Copperfield Strut","Screen Door","Golden Groove"]},
];

const $ = s => document.querySelector(s);
const money = n => "$" + n.toFixed(2);
let cart = []; try { cart = JSON.parse(localStorage.getItem("cg_cart") || "[]"); } catch(e){ cart = []; }
let wish = []; try { wish = JSON.parse(localStorage.getItem("cg_wish") || "[]"); } catch(e){ wish = []; }
let genre = "All", query = "", sortBy = "featured", modalRec = null;

function saveCart(){ localStorage.setItem("cg_cart", JSON.stringify(cart)); updateCounts(); renderDrawer(); }
function saveWish(){ localStorage.setItem("cg_wish", JSON.stringify(wish)); }
function cartCount(){ return cart.reduce((a,i)=>a+i.qty,0); }
function updateCounts(){ document.querySelectorAll(".cart-count").forEach(el=>el.textContent = cartCount()); }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }

function visible(){
  let list = RECORDS.filter(r => (genre==="All"||r.genre===genre) && (r.title+" "+r.artist).toLowerCase().includes(query.toLowerCase()));
  if(sortBy==="price-low") list=[...list].sort((a,b)=>a.price-b.price);
  if(sortBy==="price-high") list=[...list].sort((a,b)=>b.price-a.price);
  if(sortBy==="title") list=[...list].sort((a,b)=>a.title.localeCompare(b.title));
  if(sortBy==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
  return list;
}
function render(){
  const list = visible();
  $("#result-count").textContent = list.length + (list.length===1?" record":" records") + (genre!=="All" ? " in "+genre : "") + (query ? ' matching "'+query+'"' : "");
  const g = $("#record-grid");
  if(!list.length){ g.innerHTML = '<p style="grid-column:1/-1">No records match that search yet. Try a different artist, title, or genre — the crates are deep.</p>'; return; }
  g.innerHTML = list.map(r=>`
   <article class="card">
    <img src="${r.img}" alt="Vinyl listening photograph for ${r.title} by ${r.artist}" loading="lazy">
    <div class="card-b">
      <h3>${r.title}</h3><p class="artist">${r.artist} · ${r.year}</p>
      <div class="tags"><span class="tag">${r.genre}</span><span class="tag">${r.cond}</span><span class="tag">★ ${r.rating.toFixed(1)}</span></div>
      <p style="margin:4px 0">${r.blurb}</p>
      <p class="price">${money(r.price)} <span style="font-size:.8rem;color:var(--muted)">New / Used from ${money(Math.round(r.price*0.8))}</span></p>
      <div class="row">
        <button class="smallbtn" data-add="${r.id}" type="button">Add to crate</button>
        <button class="smallbtn light" data-details="${r.id}" type="button">Details</button>
        <button class="heart ${wish.includes(r.id)?'on':''}" data-wish="${r.id}" type="button" aria-label="Save ${r.title} to wishlist">${wish.includes(r.id)?'♥':'♡'}</button>
      </div>
    </div></article>`).join("");
  g.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add,"New",1)));
  g.querySelectorAll("[data-details]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.details)));
  g.querySelectorAll("[data-wish]").forEach(b=>b.addEventListener("click",()=>toggleWish(b.dataset.wish)));
}
function toggleWish(id){
  wish = wish.includes(id) ? wish.filter(x=>x!==id) : [...wish, id];
  saveWish(); render();
  toast(wish.includes(id) ? "Saved to your wishlist." : "Removed from your wishlist.");
}
function addToCart(id, cond, qty){
  const key = id+"|"+cond;
  const found = cart.find(i=>i.key===key);
  if(found) found.qty += qty; else {
    const r = RECORDS.find(x=>x.id===id);
    const unit = cond==="Used" ? Math.round(r.price*0.8) : r.price;
    cart.push({key, id, title:r.title, artist:r.artist, cond, unit, qty});
  }
  saveCart(); toast("Added to your crate.");
}
function openModal(id){
  modalRec = RECORDS.find(r=>r.id===id);
  $("#modal-img").src = modalRec.img;
  $("#modal-title").textContent = modalRec.title;
  $("#modal-meta").textContent = modalRec.artist+" · "+modalRec.year+" · "+modalRec.genre+" · ★ "+modalRec.rating.toFixed(1);
  $("#modal-blurb").textContent = modalRec.blurb;
  $("#modal-tracks").innerHTML = modalRec.tracks.map((t,i)=>"<li>"+(i+1)+". "+t+"</li>").join("");
  $("#modal-cond").value = "New"; $("#modal-qty").value = 1; updateModalPrice();
  $("#modal").classList.add("open");
}
function updateModalPrice(){
  if(!modalRec) return;
  const cond = $("#modal-cond").value, qty = Math.max(1, parseInt($("#modal-qty").value||"1",10));
  const unit = cond==="Used" ? Math.round(modalRec.price*0.8) : modalRec.price;
  $("#modal-price").textContent = money(unit*qty) + " ("+money(unit)+" each, "+cond+")";
}
function renderDrawer(){
  const box = $("#drawer-items"); if(!box) return;
  if(!cart.length){ box.innerHTML = "<p>Your crate is empty. Flip through the shelves and add a record or two.</p>"; $("#drawer-total").textContent = money(0); return; }
  box.innerHTML = cart.map(i=>`<div class="ditem"><div><b>${i.title}</b><br>${i.artist} · ${i.cond} · ${money(i.unit)}<br>
    <button class="qtybtn" data-dec="${i.key}" type="button" aria-label="Decrease quantity">−</button> ${i.qty}
    <button class="qtybtn" data-inc="${i.key}" type="button" aria-label="Increase quantity">+</button>
    <button data-rem="${i.key}" type="button" style="margin-left:8px;cursor:pointer">Remove</button></div><div><b>${money(i.unit*i.qty)}</b></div></div>`).join("");
  $("#drawer-total").textContent = money(cart.reduce((a,i)=>a+i.unit*i.qty,0));
  box.querySelectorAll("[data-inc]").forEach(b=>b.addEventListener("click",()=>{ cart.find(i=>i.key===b.dataset.inc).qty++; saveCart(); }));
  box.querySelectorAll("[data-dec]").forEach(b=>b.addEventListener("click",()=>{ const it=cart.find(i=>i.key===b.dataset.dec); it.qty--; if(it.qty<1) cart=cart.filter(i=>i.key!==b.dataset.dec); saveCart(); }));
  box.querySelectorAll("[data-rem]").forEach(b=>b.addEventListener("click",()=>{ cart=cart.filter(i=>i.key!==b.dataset.rem); saveCart(); }));
}
document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{
  document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed","false"));
  c.setAttribute("aria-pressed","true"); genre=c.dataset.genre; render();
}));
$("#search").addEventListener("input",e=>{ query=e.target.value; render(); });
$("#sort").addEventListener("change",e=>{ sortBy=e.target.value; render(); });
$("#modal-cond").addEventListener("change",updateModalPrice);
$("#modal-qty").addEventListener("input",updateModalPrice);
$("#modal-add").addEventListener("click",()=>{ addToCart(modalRec.id, $("#modal-cond").value, Math.max(1,parseInt($("#modal-qty").value||"1",10))); $("#modal").classList.remove("open"); });
$("#close-modal").addEventListener("click",()=>$("#modal").classList.remove("open"));
$("#modal").addEventListener("click",e=>{ if(e.target.id==="modal") $("#modal").classList.remove("open"); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ $("#modal").classList.remove("open"); $("#drawer").classList.remove("open"); }});
$("#open-cart").addEventListener("click",()=>{ renderDrawer(); $("#drawer").classList.add("open"); });
$("#close-cart").addEventListener("click",()=>$("#drawer").classList.remove("open"));
updateCounts(); renderDrawer(); render();
