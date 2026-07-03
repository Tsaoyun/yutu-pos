(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const m=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],J=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],b=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function K(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}function G({seatId:e,people:t}){const r=new Date;return{id:`YT-${r.getFullYear()}${String(r.getMonth()+1).padStart(2,"0")}${String(r.getDate()).padStart(2,"0")}-${String(r.getTime()).slice(-5)}`,createdAt:r.toISOString(),seatId:e,people:t,items:[],status:"open",paymentMethod:null,checkedOutAt:null}}function Q(e,t,r={}){const a=t.requiresTemperature??t.type==="drink",n=t.requiresServiceType??t.type!=="retail";return{...e,items:[...e.items,{lineId:K(),productId:t.id,name:t.name,category:t.category,type:t.type,quantity:1,requiresTemperature:a,requiresServiceType:n,temperature:a?r.temperature||"熱":"",serviceType:n?r.serviceType||"內用":"",price:t.price,cost:t.cost,profit:t.price-t.cost,served:!1,note:r.note||""}]}}function _(e,t,r){return{...e,items:e.items.map(a=>a.lineId===t?{...a,...r}:a)}}function X(e,t){return{...e,items:e.items.filter(r=>r.lineId!==t)}}function O(e){return e.items.reduce((t,r)=>{const a=Number(r.quantity)||0,n=Number(r.price)||0,s=Number(r.cost)||0;return t.total+=n*a,t.cost+=s*a,t.profit+=(n-s)*a,t.drinks+=r.type==="drink"?a:0,t.desserts+=r.type==="dessert"?a:0,t},{total:0,cost:0,profit:0,drinks:0,desserts:0})}function Z(e,t="cash"){return{...e,status:"paid",paymentMethod:t,checkedOutAt:new Date().toISOString()}}const L="yutu-pos-state-v1";function ee(e){try{const t=localStorage.getItem(L);return t?JSON.parse(t):e}catch(t){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",t),e}}function w(e){try{return localStorage.setItem(L,JSON.stringify(e)),!0}catch(t){return console.warn("[YUTU POS] localStorage write failed.",t),!1}}const P={drink:"飲品",dessert:"甜品",retail:"熟豆"},c=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),j=new URLSearchParams(window.location.search).get("debug")==="1",A={seats:b,products:C(J),orders:[],selectedSeatId:b[0].id,selectedCategoryId:m[0].id,selectedOrderId:null,orderDetailMode:"active",activeView:"floor",historyDate:l(),salesSort:"amount",notice:"",debug:{}};let o=$(ee(A));function C(e){return e.map((t,r)=>({...t,requiresTemperature:t.requiresTemperature??t.type==="drink",requiresServiceType:t.requiresServiceType??t.type!=="retail",sort:t.sort??r+1,note:t.note||""}))}function $(e){const t=Array.isArray(e.products)?e.products:Array.isArray(e.menuItems)?e.menuItems:A.products,r=C(t).map((n,s)=>({...n,id:n.id||`product-${Date.now()}-${s}`,name:n.name||"未命名商品",category:n.category||"espresso",type:n.type||"drink",price:Number(n.price)||0,cost:Number(n.cost)||0,requiresTemperature:n.requiresTemperature??n.type==="drink",requiresServiceType:n.requiresServiceType??n.type!=="retail",active:n.active!==!1,sort:Number(n.sort)||s+1,note:n.note||""})),a=Array.isArray(e.orders)?e.orders.map(n=>({...n,items:Array.isArray(n.items)?n.items.map(s=>({...s,quantity:Number(s.quantity)||1,price:Number(s.price)||0,cost:Number(s.cost)||0,profit:s.profit??(Number(s.price)||0)-(Number(s.cost)||0),temperature:s.temperature==="冰"?"冰":"熱",serviceType:s.serviceType==="外帶"?"外帶":"內用",requiresTemperature:s.requiresTemperature??s.type==="drink",requiresServiceType:s.requiresServiceType??s.type!=="retail",served:!!s.served,note:s.note||""})):[]})):[];return{...A,...e,seats:b,products:r,menuItems:r,orders:a,selectedSeatId:b.some(n=>n.id===e.selectedSeatId)?e.selectedSeatId:b[0].id,selectedCategoryId:m.some(n=>n.id===e.selectedCategoryId)?e.selectedCategoryId:m[0].id,historyDate:e.historyDate||l(),salesSort:e.salesSort||"amount"}}function l(e=new Date){return k(e)}function k(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?new Date().toISOString().slice(0,10):new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function te(e,t){const r=new Date(`${e}T00:00:00`);return r.setDate(r.getDate()+t),k(r)}function h(e){return new Date(e).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function i(e){o=$({...o,...e});const t=w(o);return v(),{storageSaveExecuted:t,renderAfterSaveExecuted:!0}}function u(e,t={}){console.warn(`[YUTU POS] ${e}`,t),o=$({...o,notice:e}),w(o),v()}function N(){return D(o.selectedSeatId)}function M(){return f()?.items?.length??0}function g(e,t=!1){j&&(o=$({...o,debug:{...o.debug,...e,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId,currentOpenOrderId:N()?.id||"",ordersLength:o.orders.length,selectedOrderItemsLength:M(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),w(o),t&&v())}function y(e,t={}){console.warn(`[YUTU POS] addProduct failed: ${e}`,t),g({addProductExecuted:!0,addProductFailureReason:e,...t})}function V(e){return o.seats.find(t=>t.id===e)}function E(e){return o.products.find(t=>t.id===e)}function D(e){return o.orders.find(t=>t.seatId===e&&t.status==="open")}function f(){if(o.selectedOrderId){const e=o.orders.find(t=>t.id===o.selectedOrderId);if(e?.status==="open"||e?.status==="paid"&&o.orderDetailMode==="history"||e&&o.activeView!=="floor")return e}return D(o.selectedSeatId)||null}function S(e){return o.orders.filter(t=>t.status==="paid"&&k(t.checkedOutAt)===e)}function q(e){return e.reduce((t,r)=>{const a=O(r);return t.revenue+=a.total,t.profit+=a.profit,t.drinks+=a.drinks,t.desserts+=a.desserts,t.retail+=r.items.reduce((n,s)=>n+(s.type==="retail"?s.quantity:0),0),t.orderCount+=1,t},{revenue:0,profit:0,drinks:0,desserts:0,retail:0,orderCount:0})}function B(e){const t=new Map;return S(e).forEach(r=>{r.items.forEach(a=>{const n=`${a.productId||a.name}-${a.name}-${a.price}-${a.cost}`,s=t.get(n)||{name:a.name,category:R(a.category),quantity:0,amount:0,cost:0,profit:0};s.quantity+=a.quantity,s.amount+=a.price*a.quantity,s.cost+=a.cost*a.quantity,s.profit+=(a.price-a.cost)*a.quantity,t.set(n,s)})}),[...t.values()].sort((r,a)=>o.salesSort==="quantity"&&a.quantity-r.quantity||a.amount-r.amount)}function R(e){return m.find(t=>t.id===e)?.name||e}function Y(){return[...o.products].sort((e,t)=>e.sort-t.sort||e.name.localeCompare(t.name,"zh-Hant"))}function re(){return Y().filter(e=>e.category===o.selectedCategoryId)}function ae(e){const t={drink:1,dessert:2,retail:3},r={冰:1,熱:2};return[...e].sort((a,n)=>{const s=(t[a.type]||9)-(t[n.type]||9);if(s!==0)return s;const d=a.name.localeCompare(n.name,"zh-Hant");return d!==0?d:(r[a.temperature]||9)-(r[n.temperature]||9)})}function T(e){const t=o.orders.find(s=>s.id===e.id),r=!!t,a=o.orders.map(s=>s.id===e.id?e:s),n=i({orders:a,selectedOrderId:e.id,activeView:"floor",notice:""});return g({replaceOrderExecuted:!0,replaceOrderMatched:r,beforeItemsLength:t?.items?.length??"",afterItemsLength:e.items?.length??"",storageSaveExecuted:n.storageSaveExecuted,renderAfterSaveExecuted:n.renderAfterSaveExecuted,selectedOrderItemsLength:e.items?.length??0},!0),{...n,replaced:r,afterItemsLength:e.items?.length??0}}function ne(e){const t=D(e);if(t){i({selectedSeatId:e,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active"});return}const r=Number(window.prompt("輸入人數","2"));if(!r||r<1)return;const a=G({seatId:e,people:r});i({orders:[a,...o.orders],selectedSeatId:e,selectedOrderId:a.id,activeView:"floor",orderDetailMode:"active"})}function oe(e,t="unknown"){try{g({clickedProductId:e||"",productClickSource:t,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const r=f(),a=E(e);if(g({productFound:!!a}),!a){y("product not found",{productId:e,source:t}),u("找不到商品資料，請到商品管理確認今日菜單。",{productId:e});return}if(a.active===!1){y("product inactive",{productId:e,productName:a.name,source:t}),u(`${a.name} 目前停售，無法加入訂單。`,{productId:e});return}if(!r){y("no open order",{productId:e,source:t,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId,currentOpenOrderId:N()?.id||""}),u("請先選擇座位並新增訂單。",{productId:e,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId});return}if(r.status!=="open"){y("selected order is not open",{productId:e,source:t,orderId:r.id,status:r.status}),u("這張訂單已結帳，請先新增或編輯訂單。",{orderId:r.id,status:r.status});return}const n=r.items.length,s=Q(r,a),d=s.items[s.items.length-1],p=s.items.length;if(g({productFound:!0,addProductFailureReason:"",beforeItemsLength:n,afterItemsLength:p,newItemLineId:d?.lineId||"",selectedOrderItemsLengthBefore:n}),p!==n+1){y("item length did not increase",{beforeItemsLength:n,afterItemsLength:p,lineId:d?.lineId}),u("商品加入失敗：訂單品項數沒有增加。");return}T(s)}catch(r){const a=r instanceof Error?`${r.name}: ${r.message}`:String(r);y(a,{productId:e,source:t}),u(`商品加入失敗：${a}`)}}function H(e,t,r=null){const a=r?.currentTarget||r?.target?.closest?.("button"),n=a?.getAttribute?.("data-product-id")||a?.dataset?.id||"",s=e||n;if(console.log("[YUTU POS] product click",{id:s,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId}),g({clickedProductId:s||"",productClickSource:t,eventTargetTag:r?.target?.tagName||"",closestButtonFound:!!a,closestButtonAction:a?.dataset?.action||"",datasetId:a?.dataset?.id||"",productDatasetId:a?.getAttribute?.("data-product-id")||"",productFound:!!E(s),addProductExecuted:!1,addProductFailureReason:""}),!s){y("missing product id from click event",{source:t}),u("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),v();return}oe(s,t)}function I(e,t){const r=f();!r||r.status!=="open"||T(_(r,e,t))}function F(e){const t=f();!t||t.status!=="open"||T(X(t,e))}function se(){const e=f();!e||e.status!=="open"||e.items.length===0||(T(Z(e,"cash")),i({selectedOrderId:null,activeView:"floor",historyDate:l()}))}function ie(){const e=f();!e||e.status!=="open"||e.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||i({orders:o.orders.filter(t=>t.id!==e.id),selectedOrderId:null,activeView:"floor"})}function ce(e){const t=o.orders.find(r=>r.id===e);!t||t.status!=="paid"||window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")&&i({orders:o.orders.map(r=>r.id===t.id?{...r,status:"open",paymentMethod:null,lastCheckedOutAt:r.checkedOutAt,checkedOutAt:null}:r),selectedOrderId:t.id,selectedSeatId:t.seatId,activeView:"floor"})}function de(e){o.orders.some(t=>t.id===e)&&window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")&&i({orders:o.orders.filter(t=>t.id!==e),selectedOrderId:o.selectedOrderId===e?null:o.selectedOrderId,activeView:"history"})}function ue(){return{name:document.querySelector("#product-name").value.trim(),category:document.querySelector("#product-category").value,type:document.querySelector("#product-type").value,price:Number(document.querySelector("#product-price").value),cost:Number(document.querySelector("#product-cost").value),sort:Number(document.querySelector("#product-sort").value)||o.products.length+1,note:document.querySelector("#product-note").value.trim(),active:document.querySelector("#product-active").checked}}function le(e=null){const t=ue();if(!t.name||Number.isNaN(t.price)||Number.isNaN(t.cost)){window.alert("請輸入品名、售價與成本。");return}if(e){i({products:o.products.map(r=>r.id===e?{...r,...t}:r)});return}i({products:[...o.products,{id:`custom-${Date.now()}`,...t}]})}function pe(e){i({products:o.products.map(t=>t.id===e?{...t,active:!t.active}:t)})}function U(e){i({activeView:"products",editingProductId:e||null})}function z(e,t){const r=new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),a=URL.createObjectURL(r),n=document.createElement("a");n.href=a,n.download=e,document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}function fe(e=new Date){const t=k(e),r=`${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`;return`${t}-${r}`}function ye(){return{version:"1.1",exportedAt:new Date().toISOString(),storageKey:L,state:o}}function ge(){z(`yutu-pos-backup-${fe()}.json`,ye())}function me(){const e=l(),t=S(e),r={version:"1.1",exportedAt:new Date().toISOString(),date:e,summary:q(t),sales:B(e),orders:t};z(`yutu-pos-today-${e}.json`,r)}function ve(e){const t=e?.state||e;if(!t||typeof t!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(!Array.isArray(t.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(t.products)&&!Array.isArray(t.menuItems))throw new Error("備份缺少 products 陣列。");return $(t)}function be(e){if(!e||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const t=new FileReader;t.onload=()=>{try{const r=JSON.parse(String(t.result||""));if(o=ve(r),!w(o))throw new Error("localStorage 寫入失敗。");v(),window.alert("備份已匯入。")}catch(r){const a=r instanceof Error?r.message:String(r);u(`匯入失敗：${a}`)}},t.onerror=()=>u("匯入失敗：無法讀取檔案。"),t.readAsText(e,"utf-8")}function he(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&i({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function $e(){const e=q(S(l()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${c.format(e.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${c.format(e.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
      <article><span>甜品數</span><strong>${e.desserts}</strong></article>
    </section>
  `}function Se(){return`
    <section class="seat-grid">
      ${o.seats.map(e=>{const t=D(e.id),r=t?O(t):null;return`
            <button class="seat ${t?"occupied":""} ${e.id===o.selectedSeatId?"selected":""}" data-action="seat" data-id="${e.id}">
              <span class="seat-icon">${e.icon}</span>
              <span class="seat-name">${e.name}</span>
              ${t?`<span class="seat-meta">${t.people}人 · ${h(t.createdAt)}</span><strong>${c.format(r.total)}</strong>`:'<span class="seat-meta">目前空位</span><strong>開始</strong>'}
            </button>
          `}).join("")}
    </section>
  `}function Ie(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${m.map(e=>`
              <button class="${e.id===o.selectedCategoryId?"active":""}" data-action="category" data-id="${e.id}">
                ${e.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${re().map(e=>`
              <button class="product ${e.active?"":"inactive"}" data-action="product" data-id="${e.id}" data-product-id="${e.id}" ${e.active?"":"disabled"}>
                <span>${e.name}</span>
                <strong>${c.format(e.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function Oe(e,t){if(!e.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let r="";return ae(e.items).map(a=>{const n=t,s=a.requiresTemperature??a.type==="drink",d=a.requiresServiceType??a.type!=="retail",p=[s&&a.temperature?a.temperature:"",d&&a.serviceType?a.serviceType:""].filter(Boolean),x=a.price*a.quantity,W=a.type!==r?`<div class="line-group">${P[a.type]||"其他"}</div>`:"";return r=a.type,`
        ${W}
        <article class="line ${a.served?"served":""}">
          <div class="line-title">
            <strong>${a.name}</strong>
            <span>${p.length?`${p.join(" · ")} · `:""}${c.format(a.price)} × ${a.quantity} = ${c.format(x)}</span>
          </div>
          ${n?`<div class="line-readonly"><span>數量 ${a.quantity}</span><span>單價 ${c.format(a.price)}</span><span>小計 ${c.format(x)}</span></div>`:`<div class="line-controls">
                  <button data-action="qty" data-id="${a.lineId}" data-value="${a.quantity-1}">−</button>
                  <span>${a.quantity}</span>
                  <button data-action="qty" data-id="${a.lineId}" data-value="${a.quantity+1}">＋</button>
                  ${s?`<button class="${a.temperature==="熱"?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="熱">熱</button>
                         <button class="${a.temperature==="冰"?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="冰">冰</button>`:""}
                  ${d?`<button class="${a.serviceType==="內用"?"active":""}" data-action="service" data-id="${a.lineId}" data-value="內用">內</button>
                         <button class="${a.serviceType==="外帶"?"active":""}" data-action="service" data-id="${a.lineId}" data-value="外帶">外</button>`:""}
                  <button class="served-toggle ${a.served?"active":""}" data-action="served" data-id="${a.lineId}">${a.served?"已出":"出單"}</button>
                  <button class="danger" data-action="remove" data-id="${a.lineId}">刪</button>
                </div>`}
        </article>
      `}).join("")}function we(){const e=f();if(!e)return'<aside class="order-panel empty"><span>選擇座位</span><strong>新增客人開始點餐</strong></aside>';const t=V(e.seatId),r=O(e),a=e.status==="paid";return a&&!e.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:e.id,status:e.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${t.icon} ${t.name}</span>
          <strong>${e.people}人 · 開單 ${h(e.createdAt)}</strong>
          ${a?`<span>結帳 ${h(e.checkedOutAt)} · ${e.paymentMethod==="cash"?"現金":e.paymentMethod||"未記錄付款"}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      <div class="line-list">${Oe(e,a)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${c.format(r.total)}</strong></div>
        <div><span>毛利</span><strong>${c.format(r.profit)}</strong></div>
        ${a?`<button class="paid" disabled>已結帳 · 現金</button>
               <button class="secondary" data-action="edit-paid" data-id="${e.id}">編輯訂單</button>
               <button class="secondary danger-action" data-action="delete-order" data-id="${e.id}">刪除紀錄</button>`:`<button class="primary" data-action="checkout" ${e.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function ke(){const e=o.editingProductId?E(o.editingProductId):null,t=e||{name:"",category:o.selectedCategoryId,type:"drink",price:"",cost:"",active:!0,sort:o.products.length+1,note:""};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${e?.id||""}">
        <label>品名<input id="product-name" value="${t.name}" /></label>
        <label>類別<select id="product-category">${m.map(r=>`<option value="${r.id}" ${r.id===t.category?"selected":""}>${r.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(P).map(([r,a])=>`<option value="${r}" ${r===t.type?"selected":""}>${a}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${t.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${t.cost}" /></label>
        <label>排序<input id="product-sort" type="number" step="1" value="${t.sort}" /></label>
        <label class="wide">備註<input id="product-note" value="${t.note||""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${t.active!==!1?"checked":""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${e?.id||""}">${e?"儲存商品":"新增商品"}</button>
        ${e?'<button class="secondary" type="button" data-action="new-product">清空表單</button>':""}
      </form>
      <div class="product-admin-list">
        ${Y().map(r=>`
              <article class="admin-product ${r.active?"":"inactive"}">
                <div>
                  <strong>${r.sort}. ${r.name}</strong>
                  <span>${R(r.category)} · ${P[r.type]} · ${c.format(r.price)} / 成本 ${c.format(r.cost)}</span>
                  ${r.note?`<small>${r.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${r.id}">編輯</button>
                <button class="${r.active?"danger-action":""}" data-action="toggle-product" data-id="${r.id}">${r.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function De(){const e=S(o.historyDate),t=q(e),r=B(o.historyDate);return`
    <section class="history">
      <div class="section-title">
        <h2>歷史查詢</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="history-tools">
        <button data-action="history-yesterday">昨天</button>
        <button data-action="history-today">今天</button>
        <input type="date" value="${o.historyDate}" data-action="history-date" />
      </div>
      <section class="stats report-stats" aria-label="指定日期統計">
        <article><span>營業額</span><strong>${c.format(t.revenue)}</strong></article>
        <article><span>毛利</span><strong>${c.format(t.profit)}</strong></article>
        <article><span>飲品杯數</span><strong>${t.drinks}</strong></article>
        <article><span>甜品數</span><strong>${t.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${t.retail}</strong></article>
        <article><span>訂單數</span><strong>${t.orderCount}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${o.salesSort==="amount"?"數量":"金額"}排序</button>
      </div>
      <div class="sales-table">
        ${r.length?r.map(a=>`<article><strong>${a.name}</strong><span>${a.category}</span><span>${a.quantity}</span><span>${c.format(a.amount)}</span><span>${c.format(a.cost)}</span><span>${c.format(a.profit)}</span></article>`).join(""):'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${e.length?e.map(a=>{const n=V(a.seatId),s=O(a);return`
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${a.id}">
                        <span>${a.id}</span>
                        <strong>${n?.name||"未命名座位"} · ${c.format(s.total)}</strong>
                        <small>${h(a.createdAt)} → ${h(a.checkedOutAt)}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${a.id}">刪除</button>
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function qe(){const e=S(l()),t=q(e);return`
    <section class="management">
      <div class="section-title">
        <h2>備份 / 資料</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-actions">
        <button class="primary" data-action="export-all">匯出全部資料</button>
        <button class="secondary" data-action="export-today">匯出今日資料</button>
        <button class="secondary" data-action="import-backup">匯入備份</button>
        <button class="secondary danger-action" data-action="reset-test-orders">重置測試資料</button>
        <input id="backup-file" type="file" accept="application/json,.json" hidden />
      </div>
      <div class="backup-summary">
        <article><span>目前訂單總數</span><strong>${o.orders.length}</strong></article>
        <article><span>商品數</span><strong>${o.products.length}</strong></article>
        <article><span>今日已結帳訂單</span><strong>${e.length}</strong></article>
        <article><span>今日營業額</span><strong>${c.format(t.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `}function Te(){return o.activeView==="backup"?qe():o.activeView==="products"?ke():o.activeView==="history"?De():`
    <main class="workspace">
      <section class="floor">
        <div class="section-title">
          <h2>目前店內</h2>
          <div class="actions">
            <button class="ghost" data-action="products">商品管理</button>
            <button class="ghost" data-action="history">歷史</button>
            <button class="ghost" data-action="backup">備份 / 資料</button>
          </div>
        </div>
        ${Se()}
        ${Ie()}
      </section>
      ${we()}
    </main>
  `}function Pe(){if(!j)return"";const e=o.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",e.clickedProductId||""],["selectedSeatId",e.selectedSeatId||o.selectedSeatId||""],["selectedOrderId",e.selectedOrderId||o.selectedOrderId||""],["current open order id",e.currentOpenOrderId||N()?.id||""],["product found",String(e.productFound??"")],["addProduct executed",String(e.addProductExecuted??"")],["failure reason",e.addProductFailureReason||""],["before items.length",String(e.beforeItemsLength??e.selectedOrderItemsLengthBefore??"")],["after items.length",String(e.afterItemsLength??"")],["new item lineId",e.newItemLineId||""],["replaceOrder executed",String(e.replaceOrderExecuted??"")],["storage save executed",String(e.storageSaveExecuted??"")],["render after save executed",String(e.renderAfterSaveExecuted??"")],["orders.length",String(e.ordersLength??o.orders.length)],["selected items.length",String(e.selectedOrderItemsLength??M())],["dataset.id",e.datasetId||""],["data-product-id",e.productDatasetId||""],["closest button",String(e.closestButtonFound??"")],["source",e.productClickSource||""],["updated",e.updatedAt||""]].map(([r,a])=>`<div><span>${r}</span><code>${a}</code></div>`).join("")}
    </aside>
  `}function Ae(){document.querySelectorAll(".product[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),H(e.getAttribute("data-product-id"),"direct-product-button",t)})})}function v(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div><span>YUTU Coffee</span><h1>隅途 POS</h1></div>
        <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
      </header>
      ${o.notice?`<div class="notice" role="status">${o.notice}</div>`:""}
      ${$e()}
      ${Te()}
      ${Pe()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(e=>{e.type="button"}),Ae()}document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t||t.disabled)return;e.preventDefault();const{action:r,id:a,value:n}=t.dataset;if(r==="seat"&&ne(a),r==="category"&&i({selectedCategoryId:a}),r==="product"&&H(a,"delegated-document-click",e),r==="qty"){const s=Number(n);s<=0?F(a):I(a,{quantity:s})}if(r==="temp"&&I(a,{temperature:n}),r==="service"&&I(a,{serviceType:n}),r==="served"){const d=f()?.items.find(p=>p.lineId===a);d&&I(a,{served:!d.served})}if(r==="remove"&&F(a),r==="checkout"&&se(),r==="cancel-order"&&ie(),r==="edit-paid"&&ce(a),r==="delete-order"&&de(a),r==="products"&&i({activeView:"products",editingProductId:null}),r==="backup"&&i({activeView:"backup"}),r==="new-product"&&U(null),r==="edit-product"&&U(a),r==="toggle-product"&&pe(a),r==="save-product"&&le(a||null),r==="export-all"&&ge(),r==="export-today"&&me(),r==="import-backup"&&document.querySelector("#backup-file")?.click(),r==="reset-test-orders"&&he(),r==="history"&&i({activeView:"history",historyDate:o.historyDate||l()}),r==="floor"&&i({activeView:"floor",orderDetailMode:"active"}),r==="open-history"){const s=o.orders.find(d=>d.id===a);s?i({selectedOrderId:a,selectedSeatId:s.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:a}),u("找不到這筆歷史訂單。"))}r==="history-yesterday"&&i({historyDate:te(l(),-1)}),r==="history-today"&&i({historyDate:l()}),r==="toggle-sales-sort"&&i({salesSort:o.salesSort==="amount"?"quantity":"amount"})});document.addEventListener("change",e=>{if(e.target?.id==="backup-file"){be(e.target.files?.[0]),e.target.value="";return}const t=e.target.closest("[data-action]");t&&t.dataset.action==="history-date"&&i({historyDate:t.value||l()})});v();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
