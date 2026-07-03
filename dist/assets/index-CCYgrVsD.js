(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const v=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],Q=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],$=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function X(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}const Z=10;function ee(e){return e==="pourover"||e==="手沖"}function V(e){const t=Number(e.basePrice??e.price??e.effectivePrice)||0,r=ee(e.category)&&e.temperature==="冰"?Z:0,a=t+r;return{basePrice:t,effectivePrice:a,iceExtra:r,price:a,profit:a-(Number(e.cost)||0)}}function te({seatId:e,people:t}){const r=new Date;return{id:`YT-${r.getFullYear()}${String(r.getMonth()+1).padStart(2,"0")}${String(r.getDate()).padStart(2,"0")}-${String(r.getTime()).slice(-5)}`,createdAt:r.toISOString(),seatId:e,people:t,items:[],status:"open",paymentMethod:null,checkedOutAt:null}}function re(e,t,r={}){const a=t.requiresTemperature??t.type==="drink",n=t.requiresServiceType??t.type!=="retail",o=a?r.temperature||"熱":"",i={category:t.category,temperature:o,basePrice:t.price,cost:t.cost},u=V(i);return{...e,items:[...e.items,{lineId:X(),productId:t.id,name:t.name,category:t.category,type:t.type,quantity:1,requiresTemperature:a,requiresServiceType:n,temperature:o,serviceType:n?r.serviceType||"內用":"",basePrice:u.basePrice,effectivePrice:u.effectivePrice,iceExtra:u.iceExtra,price:u.price,cost:t.cost,profit:u.profit,served:!1,note:r.note||""}]}}function ae(e,t,r){return{...e,items:e.items.map(a=>{if(a.lineId!==t)return a;const n={...a,...r};return{...n,...V(n)}})}}function ne(e,t){return{...e,items:e.items.filter(r=>r.lineId!==t)}}function k(e){return e.items.reduce((t,r)=>{const a=Number(r.quantity)||0,n=Number(r.effectivePrice??r.price)||0,o=Number(r.cost)||0;return t.total+=n*a,t.cost+=o*a,t.profit+=(n-o)*a,t.drinks+=r.type==="drink"?a:0,t.desserts+=r.type==="dessert"?a:0,t},{total:0,cost:0,profit:0,drinks:0,desserts:0})}function oe(e,t="cash"){return{...e,status:"paid",paymentMethod:t,checkedOutAt:new Date().toISOString()}}const L="yutu-pos-state-v1";function se(e){try{const t=localStorage.getItem(L);return t?JSON.parse(t):e}catch(t){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",t),e}}function P(e){try{return localStorage.setItem(L,JSON.stringify(e)),!0}catch(t){return console.warn("[YUTU POS] localStorage write failed.",t),!1}}const O={drink:"飲品",dessert:"甜品",retail:"熟豆"},d=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),C=new URLSearchParams(window.location.search).get("debug")==="1",N={seats:$,products:B(Q),orders:[],selectedSeatId:$[0].id,selectedCategoryId:v[0].id,selectedOrderId:null,orderDetailMode:"active",orderViewMode:"production",activeView:"floor",historyDate:p(),salesSort:"amount",notice:"",debug:{}};let s=S(se(N));function B(e){return e.map((t,r)=>({...t,requiresTemperature:t.requiresTemperature??t.type==="drink",requiresServiceType:t.requiresServiceType??t.type!=="retail",sort:t.sort??r+1,note:t.note||""}))}function S(e){const t=Array.isArray(e.products)?e.products:Array.isArray(e.menuItems)?e.menuItems:N.products,r=B(t).map((n,o)=>({...n,id:n.id||`product-${Date.now()}-${o}`,name:n.name||"未命名商品",category:n.category||"espresso",type:n.type||"drink",price:Number(n.price)||0,cost:Number(n.cost)||0,requiresTemperature:n.requiresTemperature??n.type==="drink",requiresServiceType:n.requiresServiceType??n.type!=="retail",active:n.active!==!1,sort:Number(n.sort)||o+1,note:n.note||""})),a=Array.isArray(e.orders)?e.orders.map(n=>({...n,items:Array.isArray(n.items)?n.items.map(o=>{const i=Number(o.price)||0,u=Number(o.basePrice??i)||0,y=Number(o.effectivePrice??i)||0;return{...o,quantity:Number(o.quantity)||1,basePrice:u,effectivePrice:y,iceExtra:Number(o.iceExtra??y-u)||0,price:y,cost:Number(o.cost)||0,profit:y-(Number(o.cost)||0),temperature:o.temperature==="冰"?"冰":"熱",serviceType:o.serviceType==="外帶"?"外帶":"內用",requiresTemperature:o.requiresTemperature??o.type==="drink",requiresServiceType:o.requiresServiceType??o.type!=="retail",served:!!o.served,note:o.note||""}}):[]})):[];return{...N,...e,seats:$,products:r,menuItems:r,orders:a,selectedSeatId:$.some(n=>n.id===e.selectedSeatId)?e.selectedSeatId:$[0].id,selectedCategoryId:v.some(n=>n.id===e.selectedCategoryId)?e.selectedCategoryId:v[0].id,historyDate:e.historyDate||p(),salesSort:e.salesSort||"amount"}}function p(e=new Date){return D(e)}function D(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?new Date().toISOString().slice(0,10):new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function ie(e,t){const r=new Date(`${e}T00:00:00`);return r.setDate(r.getDate()+t),D(r)}function b(e){return new Date(e).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function c(e){s=S({...s,...e});const t=P(s);return h(),{storageSaveExecuted:t,renderAfterSaveExecuted:!0}}function l(e,t={}){console.warn(`[YUTU POS] ${e}`,t),s=S({...s,notice:e}),P(s),h()}function x(){return q(s.selectedSeatId)}function R(){return f()?.items?.length??0}function m(e,t=!1){C&&(s=S({...s,debug:{...s.debug,...e,selectedSeatId:s.selectedSeatId,selectedOrderId:s.selectedOrderId,currentOpenOrderId:x()?.id||"",ordersLength:s.orders.length,selectedOrderItemsLength:R(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),P(s),t&&h())}function g(e,t={}){console.warn(`[YUTU POS] addProduct failed: ${e}`,t),m({addProductExecuted:!0,addProductFailureReason:e,...t})}function F(e){return s.seats.find(t=>t.id===e)}function M(e){return s.products.find(t=>t.id===e)}function q(e){return s.orders.find(t=>t.seatId===e&&t.status==="open")}function f(){if(s.selectedOrderId){const e=s.orders.find(t=>t.id===s.selectedOrderId);if(e?.status==="open"||e?.status==="paid"&&s.orderDetailMode==="history"||e&&s.activeView!=="floor")return e}return q(s.selectedSeatId)||null}function I(e){return s.orders.filter(t=>t.status==="paid"&&D(t.checkedOutAt)===e)}function T(e){return e.reduce((t,r)=>{const a=k(r);return t.revenue+=a.total,t.profit+=a.profit,t.drinks+=a.drinks,t.desserts+=a.desserts,t.retail+=r.items.reduce((n,o)=>n+(o.type==="retail"?o.quantity:0),0),t.orderCount+=1,t},{revenue:0,profit:0,drinks:0,desserts:0,retail:0,orderCount:0})}function z(e){const t=new Map;return I(e).forEach(r=>{r.items.forEach(a=>{const n=Number(a.effectivePrice??a.price)||0,o=`${a.productId||a.name}-${a.name}-${n}-${a.cost}`,i=t.get(o)||{name:a.name,category:H(a.category),quantity:0,amount:0,cost:0,profit:0};i.quantity+=a.quantity,i.amount+=n*a.quantity,i.cost+=a.cost*a.quantity,i.profit+=(n-a.cost)*a.quantity,t.set(o,i)})}),[...t.values()].sort((r,a)=>s.salesSort==="quantity"&&a.quantity-r.quantity||a.amount-r.amount)}function H(e){return v.find(t=>t.id===e)?.name||e}function Y(){return[...s.products].sort((e,t)=>e.sort-t.sort||e.name.localeCompare(t.name,"zh-Hant"))}function ce(){return Y().filter(e=>e.category===s.selectedCategoryId)}function W(e){const t={drink:1,dessert:2,retail:3},r={冰:1,熱:2};return[...e].sort((a,n)=>{const o=(t[a.type]||9)-(t[n.type]||9);if(o!==0)return o;const i=a.name.localeCompare(n.name,"zh-Hant");return i!==0?i:(r[a.temperature]||9)-(r[n.temperature]||9)})}function E(e){const t=s.orders.find(o=>o.id===e.id),r=!!t,a=s.orders.map(o=>o.id===e.id?e:o),n=c({orders:a,selectedOrderId:e.id,activeView:"floor",notice:""});return m({replaceOrderExecuted:!0,replaceOrderMatched:r,beforeItemsLength:t?.items?.length??"",afterItemsLength:e.items?.length??"",storageSaveExecuted:n.storageSaveExecuted,renderAfterSaveExecuted:n.renderAfterSaveExecuted,selectedOrderItemsLength:e.items?.length??0},!0),{...n,replaced:r,afterItemsLength:e.items?.length??0}}function de(e){const t=q(e);if(t){c({selectedSeatId:e,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"});return}const r=Number(window.prompt("輸入人數","2"));if(!r||r<1)return;const a=te({seatId:e,people:r});c({orders:[a,...s.orders],selectedSeatId:e,selectedOrderId:a.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function ue(e,t="unknown"){try{m({clickedProductId:e||"",productClickSource:t,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const r=f(),a=M(e);if(m({productFound:!!a}),!a){g("product not found",{productId:e,source:t}),l("找不到商品資料，請到商品管理確認今日菜單。",{productId:e});return}if(a.active===!1){g("product inactive",{productId:e,productName:a.name,source:t}),l(`${a.name} 目前停售，無法加入訂單。`,{productId:e});return}if(!r){g("no open order",{productId:e,source:t,selectedOrderId:s.selectedOrderId,selectedSeatId:s.selectedSeatId,currentOpenOrderId:x()?.id||""}),l("請先選擇座位並新增訂單。",{productId:e,selectedOrderId:s.selectedOrderId,selectedSeatId:s.selectedSeatId});return}if(r.status!=="open"){g("selected order is not open",{productId:e,source:t,orderId:r.id,status:r.status}),l("這張訂單已結帳，請先新增或編輯訂單。",{orderId:r.id,status:r.status});return}const n=r.items.length,o=re(r,a),i=o.items[o.items.length-1],u=o.items.length;if(m({productFound:!0,addProductFailureReason:"",beforeItemsLength:n,afterItemsLength:u,newItemLineId:i?.lineId||"",selectedOrderItemsLengthBefore:n}),u!==n+1){g("item length did not increase",{beforeItemsLength:n,afterItemsLength:u,lineId:i?.lineId}),l("商品加入失敗：訂單品項數沒有增加。");return}E(o)}catch(r){const a=r instanceof Error?`${r.name}: ${r.message}`:String(r);g(a,{productId:e,source:t}),l(`商品加入失敗：${a}`)}}function J(e,t,r=null){const a=r?.currentTarget||r?.target?.closest?.("button"),n=a?.getAttribute?.("data-product-id")||a?.dataset?.id||"",o=e||n;if(console.log("[YUTU POS] product click",{id:o,selectedSeatId:s.selectedSeatId,selectedOrderId:s.selectedOrderId}),m({clickedProductId:o||"",productClickSource:t,eventTargetTag:r?.target?.tagName||"",closestButtonFound:!!a,closestButtonAction:a?.dataset?.action||"",datasetId:a?.dataset?.id||"",productDatasetId:a?.getAttribute?.("data-product-id")||"",productFound:!!M(o),addProductExecuted:!1,addProductFailureReason:""}),!o){g("missing product id from click event",{source:t}),l("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),h();return}ue(o,t)}function w(e,t){const r=f();!r||r.status!=="open"||E(ae(r,e,t))}function U(e){const t=f();!t||t.status!=="open"||window.confirm("確定刪除此品項嗎？")&&E(ne(t,e))}function le(){const e=f();!e||e.status!=="open"||e.items.length===0||(E(oe(e,"cash")),c({selectedOrderId:null,activeView:"floor",historyDate:p()}))}function pe(){const e=f();!e||e.status!=="open"||e.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||c({orders:s.orders.filter(t=>t.id!==e.id),selectedOrderId:null,activeView:"floor"})}function fe(e){const t=s.orders.find(r=>r.id===e);!t||t.status!=="paid"||window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")&&c({orders:s.orders.map(r=>r.id===t.id?{...r,status:"open",paymentMethod:null,lastCheckedOutAt:r.checkedOutAt,checkedOutAt:null}:r),selectedOrderId:t.id,selectedSeatId:t.seatId,activeView:"floor"})}function ye(e){s.orders.some(t=>t.id===e)&&window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")&&c({orders:s.orders.filter(t=>t.id!==e),selectedOrderId:s.selectedOrderId===e?null:s.selectedOrderId,activeView:"history"})}function ge(){return{name:document.querySelector("#product-name").value.trim(),category:document.querySelector("#product-category").value,type:document.querySelector("#product-type").value,price:Number(document.querySelector("#product-price").value),cost:Number(document.querySelector("#product-cost").value),sort:Number(document.querySelector("#product-sort").value)||s.products.length+1,note:document.querySelector("#product-note").value.trim(),active:document.querySelector("#product-active").checked}}function me(e=null){const t=ge();if(!t.name||Number.isNaN(t.price)||Number.isNaN(t.cost)){window.alert("請輸入品名、售價與成本。");return}if(e){c({products:s.products.map(r=>r.id===e?{...r,...t}:r)});return}c({products:[...s.products,{id:`custom-${Date.now()}`,...t}]})}function ve(e){c({products:s.products.map(t=>t.id===e?{...t,active:!t.active}:t)})}function j(e){c({activeView:"products",editingProductId:e||null})}function K(e,t){const r=new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),a=URL.createObjectURL(r),n=document.createElement("a");n.href=a,n.download=e,document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}function be(e=new Date){const t=D(e),r=`${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`;return`${t}-${r}`}function he(){return{version:"1.1",exportedAt:new Date().toISOString(),storageKey:L,state:s}}function $e(){K(`yutu-pos-backup-${be()}.json`,he())}function Se(){const e=p(),t=I(e),r={version:"1.1",exportedAt:new Date().toISOString(),date:e,summary:T(t),sales:z(e),orders:t};K(`yutu-pos-today-${e}.json`,r)}function Ie(e){const t=e?.state||e;if(!t||typeof t!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(!Array.isArray(t.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(t.products)&&!Array.isArray(t.menuItems))throw new Error("備份缺少 products 陣列。");return S(t)}function we(e){if(!e||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const t=new FileReader;t.onload=()=>{try{const r=JSON.parse(String(t.result||""));if(s=Ie(r),!P(s))throw new Error("localStorage 寫入失敗。");h(),window.alert("備份已匯入。")}catch(r){const a=r instanceof Error?r.message:String(r);l(`匯入失敗：${a}`)}},t.onerror=()=>l("匯入失敗：無法讀取檔案。"),t.readAsText(e,"utf-8")}function Oe(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&c({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function ke(){const e=T(I(p()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${d.format(e.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${d.format(e.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
      <article><span>甜品數</span><strong>${e.desserts}</strong></article>
    </section>
  `}function Pe(){return`
    <section class="seat-grid">
      ${s.seats.map(e=>{const t=q(e.id),r=t?k(t):null;return`
            <button class="seat ${t?"occupied":""} ${e.id===s.selectedSeatId?"selected":""}" data-action="seat" data-id="${e.id}">
              <span class="seat-icon">${e.icon}</span>
              <span class="seat-name">${e.name}</span>
              ${t?`<span class="seat-meta">${t.people}人 · ${b(t.createdAt)}</span><strong>${d.format(r.total)}</strong>`:'<span class="seat-meta">目前空位</span><strong>開始</strong>'}
            </button>
          `}).join("")}
    </section>
  `}function De(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${v.map(e=>`
              <button class="${e.id===s.selectedCategoryId?"active":""}" data-action="category" data-id="${e.id}">
                ${e.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${ce().map(e=>`
              <button class="product ${e.active?"":"inactive"}" data-action="product" data-id="${e.id}" data-product-id="${e.id}" ${e.active?"":"disabled"}>
                <span>${e.name}</span>
                <strong>${d.format(e.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function qe(e,t){if(!e.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let r="";return W(e.items).map(a=>{const n=t,o=a.requiresTemperature??a.type==="drink",i=a.requiresServiceType??a.type!=="retail",u=[o&&a.temperature?a.temperature:"",i&&a.serviceType?a.serviceType:""].filter(Boolean),y=Number(a.effectivePrice??a.price)||0,A=y*a.quantity,G=a.type!==r?`<div class="line-group">${O[a.type]||"其他"}</div>`:"";return r=a.type,`
        ${G}
        <article class="line ${a.served?"served":""}">
          <div class="line-title">
            <strong>${a.name}</strong>
            <span>${d.format(A)}</span>
          </div>
          <div class="line-meta">
            <span>${u.join("｜")||"一般"}</span>
            <span>×${a.quantity}</span>
            ${a.iceExtra?`<span>冰飲 +${d.format(a.iceExtra)}</span>`:""}
          </div>
          ${n?`<div class="line-readonly">
                  <span>數量 ${a.quantity}</span>
                  ${u.map(_=>`<span>${_}</span>`).join("")}
                  <span>單價 ${d.format(y)}</span>
                  ${a.iceExtra?`<span>冰飲加價 ${d.format(a.iceExtra)}</span>`:""}
                  <span>小計 ${d.format(A)}</span>
                  <span>${a.served?"已出":"未出"}</span>
                </div>`:`<div class="line-edit">
                  <section class="line-section">
                    <span class="line-section-label">數量</span>
                    <div class="quantity-control">
                      <button data-action="qty" data-id="${a.lineId}" data-value="${a.quantity-1}" aria-label="減少數量">−</button>
                      <strong>${a.quantity}</strong>
                      <button data-action="qty" data-id="${a.lineId}" data-value="${a.quantity+1}" aria-label="增加數量">＋</button>
                    </div>
                  </section>
                  ${o?`<section class="line-section">
                          <span class="line-section-label">溫度</span>
                          <div class="segmented-control">
                            <button class="${a.temperature==="熱"?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="熱">熱</button>
                            <button class="${a.temperature==="冰"?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="冰">冰</button>
                          </div>
                        </section>`:""}
                  ${i?`<section class="line-section">
                          <span class="line-section-label">用餐</span>
                          <div class="segmented-control">
                            <button class="${a.serviceType==="內用"?"active":""}" data-action="service" data-id="${a.lineId}" data-value="內用">內用</button>
                            <button class="${a.serviceType==="外帶"?"active":""}" data-action="service" data-id="${a.lineId}" data-value="外帶">外帶</button>
                          </div>
                        </section>`:""}
                  <section class="line-secondary-actions">
                    <button class="danger" data-action="remove" data-id="${a.lineId}">刪除</button>
                  </section>
                </div>`}
        </article>
      `}).join("")}function Te(e){return e.type==="drink"?`${e.temperature||""}${e.name}`:e.name}function Ee(e){const t=new Map;return W(e.items).forEach(r=>{const a=O[r.type]||"其他",n=Te(r),o=t.get(a)||[];o.push({...r,group:a,label:n}),t.set(a,o)}),Object.fromEntries(t)}function Ae(e){const t=F(e.seatId),r=Ee(e),a=e.status==="paid",n=["飲品","甜品","熟豆","其他"];return`
    <section class="production-list">
      <header>
        <strong>${t?.name||"未命名座位"}｜${e.people}人｜${b(e.createdAt)}</strong>
      </header>
      ${n.filter(o=>r[o]?.length).map(o=>`
              <section class="production-group">
                <h3>${o}</h3>
                <ul>
                  ${r[o].map(i=>`
                        <li>
                          <button class="production-item ${i.served?"served":""}" data-action="served" data-id="${i.lineId}" ${a?"disabled":""}>
                            <span class="production-check">${i.served?"✓":""}</span>
                            <span class="production-name">${i.label}${i.quantity>1?` ×${i.quantity}`:""}</span>
                            ${i.served?'<span class="production-status">已出</span>':""}
                          </button>
                        </li>
                      `).join("")}
                </ul>
              </section>
            `).join("")||'<div class="empty-note">尚無品項</div>'}
    </section>
  `}function Ne(){const e=f();if(!e)return'<aside class="order-panel empty"><span>選擇座位</span><strong>新增客人開始點餐</strong></aside>';const t=F(e.seatId),r=k(e),a=e.status==="paid",n=a&&s.orderDetailMode==="history",o=s.orderViewMode==="production";return a&&!e.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:e.id,status:e.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${t.icon} ${t.name}</span>
          <strong>${e.people}人 · 開單 ${b(e.createdAt)}</strong>
          ${a?`<span>結帳 ${b(e.checkedOutAt)} · ${e.paymentMethod==="cash"?"現金":e.paymentMethod||"未記錄付款"}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      <div class="order-view-toggle">
        <button class="${o?"active":""}" data-action="order-view" data-value="production">出品清單</button>
        <button class="${o?"":"active"}" data-action="order-view" data-value="edit">編輯訂單</button>
      </div>
      <div class="line-list">${o?Ae(e):qe(e,a)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${d.format(r.total)}</strong></div>
        <div><span>毛利</span><strong>${d.format(r.profit)}</strong></div>
        ${a?n?'<button class="paid" disabled>已結帳 · 現金</button>':`<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${e.id}">編輯訂單</button>
                 <button class="secondary danger-action" data-action="delete-order" data-id="${e.id}">刪除紀錄</button>`:`<button class="primary" data-action="checkout" ${e.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function Le(){const e=s.editingProductId?M(s.editingProductId):null,t=e||{name:"",category:s.selectedCategoryId,type:"drink",price:"",cost:"",active:!0,sort:s.products.length+1,note:""};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${e?.id||""}">
        <label>品名<input id="product-name" value="${t.name}" /></label>
        <label>類別<select id="product-category">${v.map(r=>`<option value="${r.id}" ${r.id===t.category?"selected":""}>${r.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(O).map(([r,a])=>`<option value="${r}" ${r===t.type?"selected":""}>${a}</option>`).join("")}</select></label>
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
                  <span>${H(r.category)} · ${O[r.type]} · ${d.format(r.price)} / 成本 ${d.format(r.cost)}</span>
                  ${r.note?`<small>${r.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${r.id}">編輯</button>
                <button class="${r.active?"danger-action":""}" data-action="toggle-product" data-id="${r.id}">${r.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function xe(){const e=I(s.historyDate),t=T(e),r=z(s.historyDate);return`
    <section class="history">
      <div class="section-title">
        <h2>歷史查詢</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="history-tools">
        <button data-action="history-yesterday">昨天</button>
        <button data-action="history-today">今天</button>
        <input type="date" value="${s.historyDate}" data-action="history-date" />
      </div>
      <section class="stats report-stats" aria-label="指定日期統計">
        <article><span>營業額</span><strong>${d.format(t.revenue)}</strong></article>
        <article><span>毛利</span><strong>${d.format(t.profit)}</strong></article>
        <article><span>飲品杯數</span><strong>${t.drinks}</strong></article>
        <article><span>甜品數</span><strong>${t.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${t.retail}</strong></article>
        <article><span>訂單數</span><strong>${t.orderCount}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${s.salesSort==="amount"?"數量":"金額"}排序</button>
      </div>
      <div class="sales-table">
        ${r.length?r.map(a=>`<article><strong>${a.name}</strong><span>${a.category}</span><span>${a.quantity}</span><span>${d.format(a.amount)}</span><span>${d.format(a.cost)}</span><span>${d.format(a.profit)}</span></article>`).join(""):'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${e.length?e.map(a=>{const n=F(a.seatId),o=k(a);return`
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${a.id}">
                        <span>${a.id}</span>
                        <strong>${n?.name||"未命名座位"} · ${d.format(o.total)}</strong>
                        <small>${b(a.createdAt)} → ${b(a.checkedOutAt)}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${a.id}">刪除</button>
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function Fe(){const e=I(p()),t=T(e);return`
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
        <article><span>目前訂單總數</span><strong>${s.orders.length}</strong></article>
        <article><span>商品數</span><strong>${s.products.length}</strong></article>
        <article><span>今日已結帳訂單</span><strong>${e.length}</strong></article>
        <article><span>今日營業額</span><strong>${d.format(t.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `}function Me(){return s.activeView==="backup"?Fe():s.activeView==="products"?Le():s.activeView==="history"?xe():`
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
        ${Pe()}
        ${De()}
      </section>
      ${Ne()}
    </main>
  `}function Ue(){if(!C)return"";const e=s.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",e.clickedProductId||""],["selectedSeatId",e.selectedSeatId||s.selectedSeatId||""],["selectedOrderId",e.selectedOrderId||s.selectedOrderId||""],["current open order id",e.currentOpenOrderId||x()?.id||""],["product found",String(e.productFound??"")],["addProduct executed",String(e.addProductExecuted??"")],["failure reason",e.addProductFailureReason||""],["before items.length",String(e.beforeItemsLength??e.selectedOrderItemsLengthBefore??"")],["after items.length",String(e.afterItemsLength??"")],["new item lineId",e.newItemLineId||""],["replaceOrder executed",String(e.replaceOrderExecuted??"")],["storage save executed",String(e.storageSaveExecuted??"")],["render after save executed",String(e.renderAfterSaveExecuted??"")],["orders.length",String(e.ordersLength??s.orders.length)],["selected items.length",String(e.selectedOrderItemsLength??R())],["dataset.id",e.datasetId||""],["data-product-id",e.productDatasetId||""],["closest button",String(e.closestButtonFound??"")],["source",e.productClickSource||""],["updated",e.updatedAt||""]].map(([r,a])=>`<div><span>${r}</span><code>${a}</code></div>`).join("")}
    </aside>
  `}function je(){document.querySelectorAll(".product[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),J(e.getAttribute("data-product-id"),"direct-product-button",t)})})}function h(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div><span>YUTU Coffee</span><h1>隅途 POS</h1></div>
        <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
      </header>
      ${s.notice?`<div class="notice" role="status">${s.notice}</div>`:""}
      ${ke()}
      ${Me()}
      ${Ue()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(e=>{e.type="button"}),je()}document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t||t.disabled)return;e.preventDefault();const{action:r,id:a,value:n}=t.dataset;if(r==="seat"&&de(a),r==="category"&&c({selectedCategoryId:a}),r==="product"&&J(a,"delegated-document-click",e),r==="qty"){const o=Number(n);o<=0?U(a):w(a,{quantity:o})}if(r==="temp"&&w(a,{temperature:n}),r==="service"&&w(a,{serviceType:n}),r==="served"){const i=f()?.items.find(u=>u.lineId===a);i&&w(a,{served:!i.served})}if(r==="remove"&&U(a),r==="checkout"&&le(),r==="cancel-order"&&pe(),r==="edit-paid"&&fe(a),r==="delete-order"&&ye(a),r==="products"&&c({activeView:"products",editingProductId:null}),r==="backup"&&c({activeView:"backup"}),r==="new-product"&&j(null),r==="edit-product"&&j(a),r==="toggle-product"&&ve(a),r==="save-product"&&me(a||null),r==="export-all"&&$e(),r==="export-today"&&Se(),r==="import-backup"&&document.querySelector("#backup-file")?.click(),r==="reset-test-orders"&&Oe(),r==="history"&&c({activeView:"history",historyDate:s.historyDate||p()}),r==="floor"&&c({activeView:"floor",orderDetailMode:"active"}),r==="open-history"){const o=s.orders.find(i=>i.id===a);o?c({selectedOrderId:a,selectedSeatId:o.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:a}),l("找不到這筆歷史訂單。"))}r==="history-yesterday"&&c({historyDate:ie(p(),-1)}),r==="history-today"&&c({historyDate:p()}),r==="toggle-sales-sort"&&c({salesSort:s.salesSort==="amount"?"quantity":"amount"}),r==="order-view"&&c({orderViewMode:n==="production"?"production":"edit"})});document.addEventListener("change",e=>{if(e.target?.id==="backup-file"){we(e.target.files?.[0]),e.target.value="";return}const t=e.target.closest("[data-action]");t&&t.dataset.action==="history-date"&&c({historyDate:t.value||p()})});h();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
