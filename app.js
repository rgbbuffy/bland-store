const KEY="bland_products_v1", DKEY="bland_designs_v1", CKEY="bland_cart_v1";
const starter=[
 {id:"hat-1",name:"BLAND Classic 112",type:"hat",price:29.99,desc:"Richardson 112 trucker cap with a clean BLAND mark.",design:"BLAND"},
 {id:"tee-1",name:"Nothing Special Tee",type:"tee",price:34.99,desc:"Relaxed vintage-inspired graphic tee.",design:"NOTHING SPECIAL"},
 {id:"tee-2",name:"BLAND Dept. Tee",type:"tee",price:34.99,desc:"Casual Y2K-inspired department graphic.",design:"BLAND DEPT."}
];
let products=JSON.parse(localStorage.getItem(KEY)||"null")||starter;
let designs=JSON.parse(localStorage.getItem(DKEY)||"null")||[
 {id:"d1",name:"BLAND",text:"BLAND",image:""},
 {id:"d2",name:"Nothing Special",text:"NOTHING SPECIAL",image:""},
 {id:"d3",name:"BLAND Dept.",text:"BLAND DEPT.",image:""}
];
let cart=JSON.parse(localStorage.getItem(CKEY)||"[]");

function save(){localStorage.setItem(KEY,JSON.stringify(products));localStorage.setItem(DKEY,JSON.stringify(designs));localStorage.setItem(CKEY,JSON.stringify(cart));}
function art(p){
 let d=designs.find(x=>x.name===p.design);
 if(d&&d.image)return `<img src="${d.image}" alt="">`;
 return `<div class="mock">${(d?.text||p.design||"BLAND")}</div>`;
}
function cards(list){return `<div class="grid">${list.map(p=>`<article class="card"><a href="#/product/${p.id}"><div class="product-art">${art(p)}</div><div class="info"><strong>${p.name}</strong><br><span>${p.type==="hat"?"Richardson 112":"Relaxed graphic tee"}</span><br><span class="price">$${p.price.toFixed(2)}</span></div></a></article>`).join("")}</div>`}
function render(){
 let path=location.hash||"#/";
 let app=document.querySelector("#app");
 if(path==="#/"||path==="#"){app.innerHTML=`<section class="hero"><h1>BLAND</h1><p>Clothes for people who don't need to say much. Clean hats. Vintage-inspired tees. Nothing extra.</p><a class="btn" href="#/shop">SHOP BLAND</a></section><section class="section"><h2>NEW / SIMPLE / BLAND</h2>${cards(products)}</section>`}
 else if(path==="#/shop")app.innerHTML=`<section class="section"><h2>SHOP</h2>${cards(products)}</section>`;
 else if(path==="#/hats")app.innerHTML=`<section class="section"><h2>HATS</h2>${cards(products.filter(p=>p.type==="hat"))}</section>`;
 else if(path==="#/tees")app.innerHTML=`<section class="section"><h2>TEES</h2>${cards(products.filter(p=>p.type==="tee"))}</section>`;
 else if(path==="#/admin")admin();
 else if(path.startsWith("#/product/"))product(path.split("/")[2]);
 updateCart();
}
function product(id){let p=products.find(x=>x.id===id);document.querySelector("#app").innerHTML=`<section class="section"><div class="grid"><div class="product-art">${art(p)}</div><div><h1>${p.name}</h1><p>${p.desc}</p><h2>$${p.price.toFixed(2)}</h2><button class="btn" onclick="addCart('${p.id}')">ADD TO CART</button></div></div></section>`}
function admin(){
 document.querySelector("#app").innerHTML=`<section class="admin"><h1>DESIGN STUDIO</h1><div class="notice">Add a design once, then assign it to any BLAND hat or tee.</div><div class="panel"><h2>New design</h2><form class="form" onsubmit="addDesign(event)"><input id="dn" placeholder="Design name" required><input id="dt" placeholder="Text fallback (e.g. BLAND)" required><input id="di" type="file" accept="image/*"><button class="btn">ADD DESIGN</button></form><hr><h2>Designs</h2><div class="design-list">${designs.map(d=>`<div class="design">${d.image?`<img src="${d.image}">`:`<div class="preview"><b>${d.text}</b></div>`}<strong>${d.name}</strong></div>`).join("")}</div></div><div class="panel" style="margin-top:20px"><h2>Products</h2>${products.map(p=>`<div style="border-top:1px solid #aaa;padding:12px 0"><b>${p.name}</b> — $${p.price.toFixed(2)}<br><select onchange="setDesign('${p.id}',this.value)">${designs.map(d=>`<option ${d.name===p.design?"selected":""}>${d.name}</option>`).join("")}</select> <button onclick="removeProduct('${p.id}')">Remove</button></div>`).join("")}</div></section>`
}
function addDesign(e){e.preventDefault();let f=document.querySelector("#di").files[0], done=(img)=>{designs.push({id:"d"+Date.now(),name:dn.value,text:dt.value,image:img||""});save();render()};if(f){let r=new FileReader();r.onload=()=>done(r.result);r.readAsDataURL(f)}else done("")}
function setDesign(id,d){let p=products.find(x=>x.id===id);p.design=d;save();render()}
function removeProduct(id){products=products.filter(p=>p.id!==id);save();render()}
function addCart(id){cart.push(id);save();updateCart();alert("Added to cart.")}
function updateCart(){let n=document.querySelector("#cartCount");if(n)n.textContent=cart.length}
function showCart(){if(!cart.length)return alert("Your cart is empty.");let lines=cart.map(id=>{let p=products.find(x=>x.id===id);return `${p.name} — $${p.price.toFixed(2)}`}).join("\n");alert("BLAND CART\n\n"+lines+"\n\nCheckout connection can be added next.")}
window.addEventListener("hashchange",render);render();
