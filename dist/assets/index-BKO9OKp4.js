(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}})();const h=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],Tt=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],D=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function At(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}const Pt=10;function qt(t){return t==="pourover"||t==="手沖"}function st(t){const e=Number(t.basePrice??t.price??t.effectivePrice)||0,a=qt(t.category)&&t.temperature==="冰"?Pt:0,r=e+a;return{basePrice:e,effectivePrice:r,iceExtra:a,price:r,profit:r-(Number(t.cost)||0)}}function ot({seatId:t,people:e}){const a=new Date;return{id:`YT-${a.getFullYear()}${String(a.getMonth()+1).padStart(2,"0")}${String(a.getDate()).padStart(2,"0")}-${String(a.getTime()).slice(-5)}`,createdAt:a.toISOString(),seatId:t,people:e,items:[],activityLog:[],status:"open",paymentMethod:null,checkedOutAt:null}}function Et(t,e,a={}){const r=e.requiresTemperature??e.type==="drink",n=e.requiresServiceType??e.type!=="retail",s=r?a.temperature||"熱":"",i=a.serviceType||(t.seatId==="takeout"?"外帶":"內用"),c={category:e.category,temperature:s,basePrice:e.price,cost:e.cost},u=st(c);return{...t,items:[...t.items,{lineId:At(),productId:e.id,name:e.name,variantName:a.variantName||"",category:e.category,type:e.type,quantity:1,requiresTemperature:r,requiresServiceType:n,temperature:s,serviceType:n?i:"",basePrice:u.basePrice,effectivePrice:u.effectivePrice,iceExtra:u.iceExtra,price:u.price,cost:e.cost,profit:u.profit,served:!1,note:a.note||""}]}}function Nt(t,e,a){return{...t,items:t.items.map(r=>{if(r.lineId!==e)return r;const n={...r,...a};return{...n,...st(n)}})}}function Lt(t,e){return{...t,items:t.items.filter(a=>a.lineId!==e)}}function O(t){return t.items.reduce((e,a)=>{const r=Number(a.quantity)||0,n=Number(a.effectivePrice??a.price)||0,s=Number(a.cost)||0;return e.total+=n*r,e.cost+=s*r,e.profit+=(n-s)*r,e.drinks+=a.type==="drink"?r:0,e.desserts+=a.type==="dessert"?r:0,e},{total:0,cost:0,profit:0,drinks:0,desserts:0})}function xt(t,e="cash"){const a=new Date().toISOString();return{...t,status:"paid",paymentMethod:e,checkedOutAt:a,activityLog:[...Array.isArray(t.activityLog)?t.activityLog:[],{type:"checkout",at:a}]}}function it(t){const e=t instanceof Date?t:new Date(t);return Number.isNaN(e.getTime())?"":new Date(e.getTime()-e.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function Rt(t){return it(t.checkedOutAt||t.createdAt)}function Ct(t){const e=new Date(t.checkedOutAt||t.createdAt);return Number.isNaN(e.getTime())?"--:00":`${String(e.getHours()).padStart(2,"0")}:00`}function E(t){return Number(t.effectivePrice??t.price)||0}function G(t){return Number(t.cost)||0}function T(t){return Number(t.quantity)||0}function q(t,e){return e?t/e:0}function ct(t,e={}){return e[t]||t||"其他"}function Mt(t,e={}){return t==="takeout"?e.takeout||"外帶":e[t]||t||"未命名座位"}function jt(t={}){return Object.values(t).map(e=>({category:e,quantity:0,revenue:0,cost:0,profit:0,marginRate:0}))}function Vt(t,e,a){const r=e||it(new Date),n=a||r;return(Array.isArray(t)?t:[]).filter(s=>{if(s.status!=="paid")return!1;const i=Rt(s);return i>=r&&i<=n})}function Ft(t){const e=(Array.isArray(t)?t:[]).reduce((a,r)=>(a.orderCount+=1,a.people+=Number(r.people)||0,r.items?.forEach(n=>{const s=T(n),i=E(n)*s,c=G(n)*s,u=i-c;a.revenue+=i,a.cost+=c,a.profit+=u,a.drinks+=n.type==="drink"?s:0,a.desserts+=n.type==="dessert"?s:0,a.retail+=n.type==="retail"?s:0}),a),{revenue:0,cost:0,profit:0,marginRate:0,orderCount:0,people:0,averageTicket:0,drinks:0,desserts:0,retail:0});return e.marginRate=q(e.profit,e.revenue),e.averageTicket=e.orderCount?e.revenue/e.orderCount:0,e}function Ut(t,e={}){const a=e.categoryLabels||{},r=e.sortBy||"quantity",n=new Map;(Array.isArray(t)?t:[]).forEach(i=>{i.items?.forEach(c=>{const u=T(c),v=E(c),$=G(c),d=v*u,f=$*u,Ot=d-f,at=`${c.productId||c.name}-${c.name}`,g=n.get(at)||{productId:c.productId||"",name:c.name,category:ct(c.category,a),quantity:0,revenue:0,cost:0,profit:0,marginRate:0,iced:0,hot:0,dineIn:0,takeaway:0,variants:{}};g.quantity+=u,g.revenue+=d,g.cost+=f,g.profit+=Ot,g.iced+=c.type==="drink"&&c.temperature==="冰"?u:0,g.hot+=c.type==="drink"&&c.temperature==="熱"?u:0,g.dineIn+=c.serviceType==="內用"?u:0,g.takeaway+=c.serviceType==="外帶"?u:0,c.variantName&&(g.variants[c.variantName]=(g.variants[c.variantName]||0)+u),g.marginRate=q(g.profit,g.revenue),n.set(at,g)})});const s={quantity:(i,c)=>c.quantity-i.quantity||c.revenue-i.revenue,revenue:(i,c)=>c.revenue-i.revenue||c.quantity-i.quantity,profit:(i,c)=>c.profit-i.profit||c.revenue-i.revenue};return[...n.values()].sort(s[r]||s.quantity)}function Bt(t,e={}){const a=e.categoryLabels||{},r=jt(a),n=new Map(r.map(s=>[s.category,s]));return(Array.isArray(t)?t:[]).forEach(s=>{s.items?.forEach(i=>{const c=T(i),u=E(i)*c,v=G(i)*c,$=u-v,d=ct(i.category,a),f=n.get(d)||{category:d,quantity:0,revenue:0,cost:0,profit:0,marginRate:0};f.quantity+=c,f.revenue+=u,f.cost+=v,f.profit+=$,f.marginRate=q(f.profit,f.revenue),n.set(d,f)})}),[...n.values()]}function Ht(t){const e={iced:0,hot:0,total:0,icedRate:0,hotRate:0};return(Array.isArray(t)?t:[]).forEach(a=>{a.items?.forEach(r=>{if(r.type!=="drink")return;const n=T(r);e.iced+=r.temperature==="冰"?n:0,e.hot+=r.temperature==="熱"?n:0,e.total+=n})}),e.icedRate=q(e.iced,e.total),e.hotRate=q(e.hot,e.total),e}function zt(t){const e=new Map;return(Array.isArray(t)?t:[]).forEach(a=>{const r=Ct(a),n=e.get(r)||{hour:r,orderCount:0,revenue:0,drinks:0};n.orderCount+=1,a.items?.forEach(s=>{const i=T(s);n.revenue+=E(s)*i,n.drinks+=s.type==="drink"?i:0}),e.set(r,n)}),[...e.values()].sort((a,r)=>a.hour.localeCompare(r.hour))}function _t(t,e={}){const a=e.seatLabels||{},r=new Map;return(Array.isArray(t)?t:[]).forEach(n=>{const s=Mt(n.seatId,a),i=r.get(s)||{seatName:s,orderCount:0,people:0,revenue:0,averageTicket:0};i.orderCount+=1,i.people+=Number(n.people)||0,n.items?.forEach(c=>{i.revenue+=E(c)*T(c)}),i.averageTicket=i.orderCount?i.revenue/i.orderCount:0,r.set(s,i)}),[...r.values()].sort((n,s)=>s.revenue-n.revenue||s.orderCount-n.orderCount)}function Yt(t,e={}){const a=Vt(t,e.startDate,e.endDate);return{startDate:e.startDate,endDate:e.endDate,paidOrders:a,overview:Ft(a),productRanking:Ut(a,e),categorySummary:Bt(a,e),temperatureSummary:Ht(a),hourlySummary:zt(a),seatSummary:_t(a,e)}}const X="yutu-pos-state-v1";function Kt(t){try{const e=localStorage.getItem(X);return e?JSON.parse(e):t}catch(e){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",e),t}}function U(t){try{return localStorage.setItem(X,JSON.stringify(t)),!0}catch(e){return console.warn("[YUTU POS] localStorage write failed.",e),!1}}const j={drink:"飲品",dessert:"甜品",retail:"熟豆"},Wt="feature/analytics-dashboard",b="takeout",Q={id:b,name:"外帶",icon:"🥡"},Jt=5,l=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),P=new Intl.NumberFormat("zh-TW",{style:"percent",maximumFractionDigits:1}),dt=new URLSearchParams(window.location.search).get("debug")==="1",ut=1,lt="YUTU_POS",W={seats:D,products:yt(Tt),orders:[],selectedSeatId:D[0].id,selectedCategoryId:h[0].id,selectedOrderId:null,orderDetailMode:"active",orderViewMode:"production",activeView:"floor",historyDate:y(),analyticsRange:"today",analyticsStartDate:y(),analyticsEndDate:y(),analyticsSort:"quantity",salesSort:"amount",notice:"",debug:{}};let o=N(Kt(W));function B(t){return Array.isArray(t)?t.map(e=>{if(typeof e=="string"){const a=e.trim();return a?{name:a,active:!0}:null}if(e&&typeof e=="object"){const a=String(e.name||"").trim();return a?{...e,name:a,active:e.active!==!1}:null}return null}).filter(Boolean):[]}function M(t,{activeOnly:e=!1}={}){return B(t?.variants).filter(a=>!e||a.active!==!1).map(a=>a.name)}function pt(t){return Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[]}function yt(t){return t.map((e,a)=>({...e,requiresTemperature:e.requiresTemperature??e.type==="drink",requiresServiceType:e.requiresServiceType??e.type!=="retail",sort:e.sort??a+1,note:e.note||"",variants:B(e.variants),options:pt(e.options)}))}function N(t){const e=Array.isArray(t.products)?t.products:Array.isArray(t.menuItems)?t.menuItems:W.products,a=yt(e).map((n,s)=>({...n,id:n.id||`product-${Date.now()}-${s}`,name:n.name||"未命名商品",category:n.category||"espresso",type:n.type||"drink",price:Number(n.price)||0,cost:Number(n.cost)||0,requiresTemperature:n.requiresTemperature??n.type==="drink",requiresServiceType:n.requiresServiceType??n.type!=="retail",active:n.active!==!1,sort:Number(n.sort)||s+1,note:n.note||"",variants:B(n.variants),options:pt(n.options)})),r=Array.isArray(t.orders)?t.orders.map(n=>({...n,activityLog:Array.isArray(n.activityLog)?n.activityLog:[],items:Array.isArray(n.items)?n.items.map(s=>{const i=Number(s.price)||0,c=Number(s.basePrice??i)||0,u=Number(s.effectivePrice??i)||0,v=n.seatId===b?"外帶":"內用";return{...s,quantity:Number(s.quantity)||1,basePrice:c,effectivePrice:u,iceExtra:Number(s.iceExtra??u-c)||0,price:u,cost:Number(s.cost)||0,profit:u-(Number(s.cost)||0),temperature:s.temperature==="冰"?"冰":"熱",serviceType:s.serviceType==="外帶"?"外帶":v,requiresTemperature:s.requiresTemperature??s.type==="drink",requiresServiceType:s.requiresServiceType??s.type!=="retail",variantName:s.variantName||"",served:!!s.served,note:s.note||""}}):[]})):[];return{...W,...t,seats:D,products:a,menuItems:a,orders:r,selectedSeatId:t.selectedSeatId===b?b:D.some(n=>n.id===t.selectedSeatId)?t.selectedSeatId:D[0].id,selectedCategoryId:h.some(n=>n.id===t.selectedCategoryId)?t.selectedCategoryId:h[0].id,historyDate:t.historyDate||y(),analyticsRange:t.analyticsRange||"today",analyticsStartDate:t.analyticsStartDate||y(),analyticsEndDate:t.analyticsEndDate||y(),analyticsSort:t.analyticsSort||"quantity",salesSort:t.salesSort||"amount"}}function y(t=new Date){return H(t)}function H(t){const e=t instanceof Date?t:new Date(t);return Number.isNaN(e.getTime())?new Date().toISOString().slice(0,10):new Date(e.getTime()-e.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function J(t,e){const a=new Date(`${t}T00:00:00`);return a.setDate(a.getDate()+e),H(a)}function Gt(t=y()){return`${t.slice(0,7)}-01`}function ft(t=o.analyticsRange){const e=y();if(t==="yesterday"){const a=J(e,-1);return{label:"昨日",startDate:a,endDate:a}}if(t==="seven-days")return{label:"近 7 天",startDate:J(e,-6),endDate:e};if(t==="month")return{label:"本月",startDate:Gt(e),endDate:e};if(t==="custom"){const a=o.analyticsStartDate||e,r=o.analyticsEndDate||a;return{label:`${a} - ${r}`,startDate:a<=r?a:r,endDate:a<=r?r:a}}return{label:"今日",startDate:e,endDate:e}}function Xt(){return ft(o.analyticsRange)}function w(t){return new Date(t).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function gt(t,e=new Date){const a=new Date(t),r=e instanceof Date?e:new Date(e);return Number.isNaN(a.getTime())||Number.isNaN(r.getTime())?0:Math.max(0,Math.floor((r.getTime()-a.getTime())/6e4))}function L(t){return gt(t.createdAt,t.checkedOutAt||new Date)}function mt(t){return`已坐 ${L(t)} 分鐘`}function vt(t){return t.seatId===b?`已等 ${L(t)} 分鐘`:mt(t)}function Qt(t){const e=L(t);return e>=90?"stay-danger":e>=60?"stay-warning":""}function p(t){o=N({...o,...t});const e=U(o);return A(),{storageSaveExecuted:e,renderAfterSaveExecuted:!0}}function m(t,e={}){console.warn(`[YUTU POS] ${t}`,e),o=N({...o,notice:t}),U(o),A()}function Z(){return x(o.selectedSeatId)}function bt(){return S()?.items?.length??0}function k(t,e=!1){dt&&(o=N({...o,debug:{...o.debug,...t,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId,currentOpenOrderId:Z()?.id||"",ordersLength:o.orders.length,selectedOrderItemsLength:bt(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),U(o),e&&A())}function I(t,e={}){console.warn(`[YUTU POS] addProduct failed: ${t}`,e),k({addProductExecuted:!0,addProductFailureReason:t,...e})}function $t(t){return t===b?Q:o.seats.find(e=>e.id===t)}function z(t){const e=typeof t=="string"?t:t?.seatId;return $t(e)?.name||"未命名座位"}function Zt(t){const e=typeof t=="string"?t:t?.seatId;return $t(e)?.icon||""}function _(t){return o.products.find(e=>e.id===t)}function x(t){return o.orders.find(e=>e.seatId===t&&e.status==="open")}function te(){return o.orders.filter(t=>t.seatId===b&&t.status==="open").sort((t,e)=>new Date(t.createdAt)-new Date(e.createdAt))}function S(){if(o.selectedOrderId){const t=o.orders.find(e=>e.id===o.selectedOrderId);if(t?.status==="open"||t?.status==="paid"&&o.orderDetailMode==="history"||t&&o.activeView!=="floor")return t}return x(o.selectedSeatId)||null}function R(t){return o.orders.filter(e=>e.status==="paid"&&H(e.checkedOutAt)===t)}function Y(t){const e=t.reduce((a,r)=>{const n=O(r);return a.revenue+=n.total,a.profit+=n.profit,a.drinks+=n.drinks,a.desserts+=n.desserts,a.retail+=r.items.reduce((s,i)=>s+(i.type==="retail"?i.quantity:0),0),a.orderCount+=1,a},{revenue:0,profit:0,drinks:0,desserts:0,retail:0,orderCount:0,averageTicket:0});return e.averageTicket=e.orderCount?e.revenue/e.orderCount:0,e}function ht(t){const e=new Map;return R(t).forEach(a=>{a.items.forEach(r=>{const n=Number(r.effectivePrice??r.price)||0,s=`${r.productId||r.name}-${r.name}-${n}-${r.cost}`,i=e.get(s)||{name:r.name,category:St(r.category),quantity:0,amount:0,cost:0,profit:0};i.quantity+=r.quantity,i.amount+=n*r.quantity,i.cost+=r.cost*r.quantity,i.profit+=(n-r.cost)*r.quantity,e.set(s,i)})}),[...e.values()].sort((a,r)=>o.salesSort==="quantity"&&r.quantity-a.quantity||r.amount-a.amount)}function St(t){return h.find(e=>e.id===t)?.name||t}function ee(){return Object.fromEntries(h.map(t=>[t.id,t.name]))}function ae(){return{...Object.fromEntries(o.seats.map(t=>[t.id,t.name])),[b]:Q.name}}function It(){return[...o.products].sort((t,e)=>t.sort-e.sort||t.name.localeCompare(e.name,"zh-Hant"))}function re(){return It().filter(t=>t.category===o.selectedCategoryId)}function Dt(t){const e={drink:1,dessert:2,retail:3},a={冰:1,熱:2};return[...t].sort((r,n)=>{const s=(e[r.type]||9)-(e[n.type]||9);if(s!==0)return s;const i=r.name.localeCompare(n.name,"zh-Hant");return i!==0?i:(a[r.temperature]||9)-(a[n.temperature]||9)})}function K(t){const e=o.orders.find(s=>s.id===t.id),a=!!e,r=o.orders.map(s=>s.id===t.id?t:s),n=p({orders:r,selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",notice:""});return k({replaceOrderExecuted:!0,replaceOrderMatched:a,beforeItemsLength:e?.items?.length??"",afterItemsLength:t.items?.length??"",storageSaveExecuted:n.storageSaveExecuted,renderAfterSaveExecuted:n.renderAfterSaveExecuted,selectedOrderItemsLength:t.items?.length??0},!0),{...n,replaced:a,afterItemsLength:t.items?.length??0}}function ne(t){const e=x(t);if(e){p({selectedSeatId:t,selectedOrderId:e.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"});return}const a=Number(window.prompt("輸入人數","2"));if(!a||a<1)return;const r=ot({seatId:t,people:a});p({orders:[r,...o.orders],selectedSeatId:t,selectedOrderId:r.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function V(t){return t.variantName?`${t.name}（${t.variantName}）`:t.name}function se(t){const e=Object.entries(t.variants||{});return e.length?`
    <details class="variant-details">
      <summary>${e.length} 種口味</summary>
      ${e.map(([a,r])=>`<span>${a} ${r}</span>`).join("")}
    </details>
  `:"-"}function F(t){return(Array.isArray(t.activityLog)?t.activityLog:[]).map(a=>`${a.type==="checkout"?"結帳":a.type==="undoCheckout"?"撤銷":a.type} ${w(a.at)}`).join("、")}function oe(){const t=ot({seatId:b,people:1});p({orders:[t,...o.orders],selectedSeatId:b,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function ie(t){const e=o.orders.find(a=>a.id===t);e&&p({selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",orderDetailMode:e.status==="paid"?"history":"active",orderViewMode:"production"})}function tt(t){return t.items.map(e=>`${e.requiresTemperature&&e.temperature?e.temperature:""}${V(e)}×${e.quantity}`).join("、")}function ce(t,e="unknown"){try{k({clickedProductId:t||"",productClickSource:e,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const a=S(),r=_(t);if(k({productFound:!!r}),!r){I("product not found",{productId:t,source:e}),m("找不到商品資料，請到商品管理確認今日菜單。",{productId:t});return}if(r.active===!1){I("product inactive",{productId:t,productName:r.name,source:e}),m(`${r.name} 目前停售，無法加入訂單。`,{productId:t});return}if(!a){I("no open order",{productId:t,source:e,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId,currentOpenOrderId:Z()?.id||""}),m("請先選擇座位並新增訂單。",{productId:t,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId});return}if(a.status!=="open"){I("selected order is not open",{productId:t,source:e,orderId:a.id,status:a.status}),m("這張訂單已結帳，請先新增或編輯訂單。",{orderId:a.id,status:a.status});return}const n=$e(r);if(n===null)return;const s=a.items.length,i=Et(a,r,{variantName:n}),c=i.items[i.items.length-1],u=i.items.length;if(k({productFound:!0,addProductFailureReason:"",beforeItemsLength:s,afterItemsLength:u,newItemLineId:c?.lineId||"",selectedOrderItemsLengthBefore:s}),u!==s+1){I("item length did not increase",{beforeItemsLength:s,afterItemsLength:u,lineId:c?.lineId}),m("商品加入失敗：訂單品項數沒有增加。");return}K(i)}catch(a){const r=a instanceof Error?`${a.name}: ${a.message}`:String(a);I(r,{productId:t,source:e}),m(`商品加入失敗：${r}`)}}function wt(t,e,a=null){const r=a?.currentTarget||a?.target?.closest?.("button"),n=r?.getAttribute?.("data-product-id")||r?.dataset?.id||"",s=t||n;if(console.log("[YUTU POS] product click",{id:s,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId}),k({clickedProductId:s||"",productClickSource:e,eventTargetTag:a?.target?.tagName||"",closestButtonFound:!!r,closestButtonAction:r?.dataset?.action||"",datasetId:r?.dataset?.id||"",productDatasetId:r?.getAttribute?.("data-product-id")||"",productFound:!!_(s),addProductExecuted:!1,addProductFailureReason:""}),!s){I("missing product id from click event",{source:e}),m("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),A();return}ce(s,e)}function C(t,e){const a=S();!a||a.status!=="open"||K(Nt(a,t,e))}function rt(t){const e=S();!e||e.status!=="open"||window.confirm("確定刪除此品項嗎？")&&K(Lt(e,t))}function de(){const t=S();if(!t||t.status!=="open"||t.items.length===0)return;const e=O(t);window.confirm(["確定要完成結帳嗎？","",`座位 / 外帶：${z(t)}`,`人數：${t.people}`,`總金額：${l.format(e.total)}`,`品項：${tt(t)}`].join(`
`))&&(K(xt(t,"cash")),p({selectedOrderId:null,activeView:"floor",historyDate:y()}))}function ue(){return[...o.orders].filter(t=>t.status==="paid"&&t.checkedOutAt).sort((t,e)=>new Date(e.checkedOutAt)-new Date(t.checkedOutAt))[0]}function le(){const t=ue();if(!t){m("目前沒有可撤銷的已結帳訂單。");return}if(gt(t.checkedOutAt,new Date)>Jt){m("最後一筆結帳已超過 5 分鐘，無法撤銷。");return}if(t.seatId!==b&&x(t.seatId)){m("此座位已有進行中的訂單，無法撤銷。");return}if(!window.confirm("確定要撤銷最後一次結帳嗎？"))return;const e=new Date().toISOString();p({orders:o.orders.map(a=>a.id===t.id?{...a,status:"open",paymentMethod:null,checkedOutAt:null,activityLog:[...Array.isArray(a.activityLog)?a.activityLog:[],{type:"undoCheckout",at:e}]}:a),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production",historyDate:y(),notice:"已撤銷最後一次結帳。"})}function pe(){const t=S();!t||t.status!=="open"||t.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||p({orders:o.orders.filter(e=>e.id!==t.id),selectedOrderId:null,activeView:"floor"})}function ye(t){const e=o.orders.find(a=>a.id===t);!e||e.status!=="paid"||window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")&&p({orders:o.orders.map(a=>a.id===e.id?{...a,status:"open",paymentMethod:null,lastCheckedOutAt:a.checkedOutAt,checkedOutAt:null}:a),selectedOrderId:e.id,selectedSeatId:e.seatId,activeView:"floor"})}function fe(t){o.orders.some(e=>e.id===t)&&window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")&&p({orders:o.orders.filter(e=>e.id!==t),selectedOrderId:o.selectedOrderId===t?null:o.selectedOrderId,activeView:"history"})}function ge(){const t=document.querySelector(".product-form"),e=t?.dataset?.editing?_(t.dataset.editing):null,a=B(e?.variants),r=document.querySelector("#product-variants").value.split(/[\n,，、]/).map(n=>n.trim()).filter(Boolean);return{name:document.querySelector("#product-name").value.trim(),category:document.querySelector("#product-category").value,type:document.querySelector("#product-type").value,price:Number(document.querySelector("#product-price").value),cost:Number(document.querySelector("#product-cost").value),sort:Number(document.querySelector("#product-sort").value)||o.products.length+1,note:document.querySelector("#product-note").value.trim(),variants:r.map(n=>a.find(s=>s.name===n)||n),active:document.querySelector("#product-active").checked}}function me(t=null){const e=ge();if(!e.name||Number.isNaN(e.price)||Number.isNaN(e.cost)){window.alert("請輸入品名、售價與成本。");return}if(t){p({products:o.products.map(a=>a.id===t?{...a,...e}:a)});return}p({products:[...o.products,{id:`custom-${Date.now()}`,...e}]})}function ve(t){p({products:o.products.map(e=>e.id===t?{...e,active:!e.active}:e)})}function nt(t){p({activeView:"products",editingProductId:t||null})}function kt(t,e){const a=new Blob([JSON.stringify(e,null,2)],{type:"application/json;charset=utf-8"}),r=URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download=t,document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(r)}function be(t=new Date){const e=H(t),a=`${String(t.getHours()).padStart(2,"0")}${String(t.getMinutes()).padStart(2,"0")}`;return`${e}-${a}`}function $e(t){const e=M(t,{activeOnly:!0});if(!e.length)return"";const a=[`選擇 ${t.name} 口味 / 規格：`,...e.map((i,c)=>`${c+1}. ${i}`)].join(`
`),r=window.prompt(a,"1");if(r===null)return null;const n=Number(r)-1;if(Number.isInteger(n)&&e[n])return e[n];const s=r.trim();return e.includes(s)?s:(window.alert("找不到這個口味 / 規格，請重新點選商品。"),null)}function he(t=o){return{selectedSeatId:t.selectedSeatId||D[0].id,selectedCategoryId:t.selectedCategoryId||h[0].id,selectedOrderId:t.selectedOrderId||null,orderDetailMode:t.orderDetailMode||"active",orderViewMode:t.orderViewMode||"production",activeView:t.activeView||"floor",historyDate:t.historyDate||y(),analyticsRange:t.analyticsRange||"today",analyticsStartDate:t.analyticsStartDate||y(),analyticsEndDate:t.analyticsEndDate||y(),analyticsSort:t.analyticsSort||"quantity",salesSort:t.salesSort||"amount"}}function Se(){return{schemaVersion:ut,app:lt,exportType:"full",exportedAt:new Date().toISOString(),storageKey:X,orders:o.orders,products:o.products,seats:o.seats,settings:he()}}function Ie(){kt(`yutu-pos-backup-${be()}.json`,Se())}function De(t=y()){const e=R(t);return{schemaVersion:ut,app:lt,exportType:"daily",date:t,exportedAt:new Date().toISOString(),dailySummary:Y(e),productSalesSummary:ht(t),orders:e,productsSnapshot:o.products}}function et(t=y()){kt(`yutu-pos-daily-${t}.json`,De(t))}function we(){et(y())}function ke(){o.orders.filter(e=>e.status==="open").length&&!window.confirm("目前仍有未結帳訂單，是否仍要匯出今日報表？")||et(y())}function Oe(t){const e=t?.exportType==="full"?{...t.settings||{},orders:t.orders,products:t.products||t.menuItems,menuItems:t.products||t.menuItems,seats:t.seats||D}:t?.state||t;if(!e||typeof e!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(t?.exportType&&t.exportType!=="full")throw new Error("此檔案不是完整備份，請選擇匯出全部資料的 JSON。");if(!Array.isArray(e.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(e.products)&&!Array.isArray(e.menuItems))throw new Error("備份缺少 products 陣列。");return N(e)}function Te(t){if(!t||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const e=new FileReader;e.onload=()=>{try{const a=JSON.parse(String(e.result||""));if(o=Oe(a),!U(o))throw new Error("localStorage 寫入失敗。");A(),window.alert("備份已匯入。")}catch(a){const r=a instanceof Error?a.message:String(a);m(`匯入失敗：${r}`)}},e.onerror=()=>m("匯入失敗：無法讀取檔案。"),e.readAsText(t,"utf-8")}function Ae(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&p({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function Pe(){const t=Y(R(y()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${l.format(t.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${l.format(t.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${t.drinks}</strong></article>
      <article><span>甜品數</span><strong>${t.desserts}</strong></article>
    </section>
  `}function qe(){return`
    <section class="floor-block">
      <div class="floor-subtitle"><h3>內用座位</h3></div>
      <div class="seat-grid">
        ${o.seats.map(t=>{const e=x(t.id),a=e?O(e):null,r=e?Qt(e):"";return`
              <button class="seat ${e?"occupied":""} ${r} ${t.id===o.selectedSeatId?"selected":""}" data-action="seat" data-id="${t.id}">
                <span class="seat-icon">${t.icon}</span>
                <span class="seat-name">${t.name}</span>
                ${e?`<span class="seat-meta">${e.people}人 · ${w(e.createdAt)}</span><span class="seat-stay">${mt(e)}</span><strong>${l.format(a.total)}</strong>`:'<span class="seat-meta">目前空位</span><strong>開始</strong>'}
              </button>
            `}).join("")}
      </div>
    </section>
    ${Ee()}
  `}function Ee(){const t=te();return`
    <section class="floor-block takeout-block">
      <div class="floor-subtitle">
        <h3>外帶訂單</h3>
        <button class="ghost" data-action="new-takeout">新增外帶</button>
      </div>
      <div class="takeout-list">
        ${t.length?t.map(e=>{const a=O(e);return`
                    <button class="takeout-card ${e.id===o.selectedOrderId?"selected":""}" data-action="select-order" data-id="${e.id}">
                      <span>${Q.icon} 外帶 · ${w(e.createdAt)}</span>
                      <strong>${l.format(a.total)}</strong>
                      <small>${e.items.length?tt(e):"尚無品項"} · ${vt(e)}</small>
                    </button>
                  `}).join(""):'<div class="empty-note">目前沒有未結帳外帶訂單</div>'}
      </div>
    </section>
  `}function Ne(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${h.map(t=>`
              <button class="${t.id===o.selectedCategoryId?"active":""}" data-action="category" data-id="${t.id}">
                ${t.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${re().map(t=>`
              <button class="product ${t.active?"":"inactive"}" data-action="product" data-id="${t.id}" data-product-id="${t.id}" ${t.active?"":"disabled"}>
                <span>${t.name}</span>
                <strong>${l.format(t.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function Le(t,e){if(!t.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let a="";return Dt(t.items).map(r=>{const n=e,s=r.requiresTemperature??r.type==="drink",i=r.requiresServiceType??r.type!=="retail",c=[s&&r.temperature?r.temperature:"",i&&r.serviceType?r.serviceType:""].filter(Boolean),u=Number(r.effectivePrice??r.price)||0,v=u*r.quantity,$=r.type!==a?`<div class="line-group">${j[r.type]||"其他"}</div>`:"";return a=r.type,`
        ${$}
        <article class="line ${r.served?"served":""}">
          <div class="line-title">
            <strong>${V(r)}</strong>
            <span>${l.format(v)}</span>
          </div>
          <div class="line-meta">
            <span>${c.join("｜")||"一般"}</span>
            <span>×${r.quantity}</span>
            ${r.iceExtra?`<span>冰飲 +${l.format(r.iceExtra)}</span>`:""}
          </div>
          ${n?`<div class="line-readonly">
                  <span>數量 ${r.quantity}</span>
                  ${c.map(d=>`<span>${d}</span>`).join("")}
                  <span>單價 ${l.format(u)}</span>
                  ${r.iceExtra?`<span>冰飲加價 ${l.format(r.iceExtra)}</span>`:""}
                  <span>小計 ${l.format(v)}</span>
                  <span>${r.served?"已出":"未出"}</span>
                </div>`:`<div class="line-edit">
                  <section class="line-section">
                    <span class="line-section-label">數量</span>
                    <div class="quantity-control">
                      <button data-action="qty" data-id="${r.lineId}" data-value="${r.quantity-1}" aria-label="減少數量">−</button>
                      <strong>${r.quantity}</strong>
                      <button data-action="qty" data-id="${r.lineId}" data-value="${r.quantity+1}" aria-label="增加數量">＋</button>
                    </div>
                  </section>
                  ${s?`<section class="line-section">
                          <span class="line-section-label">溫度</span>
                          <div class="segmented-control">
                            <button class="${r.temperature==="熱"?"active":""}" data-action="temp" data-id="${r.lineId}" data-value="熱">熱</button>
                            <button class="${r.temperature==="冰"?"active":""}" data-action="temp" data-id="${r.lineId}" data-value="冰">冰</button>
                          </div>
                        </section>`:""}
                  ${i?`<section class="line-section">
                          <span class="line-section-label">用餐</span>
                          <div class="segmented-control">
                            <button class="${r.serviceType==="內用"?"active":""}" data-action="service" data-id="${r.lineId}" data-value="內用">內用</button>
                            <button class="${r.serviceType==="外帶"?"active":""}" data-action="service" data-id="${r.lineId}" data-value="外帶">外帶</button>
                          </div>
                        </section>`:""}
                  <section class="line-secondary-actions">
                    <button class="danger" data-action="remove" data-id="${r.lineId}">刪除</button>
                  </section>
                </div>`}
        </article>
      `}).join("")}function xe(t){return t.type==="drink"?`${t.temperature||""}${V(t)}`:V(t)}function Re(t){const e=new Map;return Dt(t.items).forEach(a=>{const r=j[a.type]||"其他",n=xe(a),s=e.get(r)||[];s.push({...a,group:r,label:n}),e.set(r,s)}),Object.fromEntries(e)}function Ce(t){const e=Re(t),a=t.status==="paid",r=["飲品","甜品","熟豆","其他"];return`
    <section class="production-list">
      <header>
        <strong>${z(t)}｜${t.people}人｜${w(t.createdAt)}</strong>
      </header>
      ${r.filter(n=>e[n]?.length).map(n=>`
              <section class="production-group">
                <h3>${n}</h3>
                <ul>
                  ${e[n].map(s=>`
                        <li>
                          <button class="production-item ${s.served?"served":""}" data-action="served" data-id="${s.lineId}" ${a?"disabled":""}>
                            <span class="production-check">${s.served?"✓":""}</span>
                            <span class="production-name">${s.label}${s.quantity>1?` ×${s.quantity}`:""}</span>
                            ${s.served?'<span class="production-status">已出</span>':""}
                          </button>
                        </li>
                      `).join("")}
                </ul>
              </section>
            `).join("")||'<div class="empty-note">尚無品項</div>'}
    </section>
  `}function Me(){const t=S();if(!t)return'<aside class="order-panel empty"><span>選擇座位</span><strong>新增客人開始點餐</strong></aside>';const e=O(t),a=t.status==="paid",r=a&&o.orderDetailMode==="history",n=o.orderViewMode==="production";return a&&!t.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:t.id,status:t.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${Zt(t)} ${z(t)}</span>
          <strong>${t.people}人 · 開單 ${w(t.createdAt)}</strong>
          ${a?`<span>結帳 ${w(t.checkedOutAt)} · 停留 ${L(t)} 分鐘 · ${t.paymentMethod==="cash"?"現金":t.paymentMethod||"未記錄付款"}</span>`:`<span>${vt(t)}</span>`}
          ${a&&F(t)?`<span>${F(t)}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      <div class="order-view-toggle">
        <button class="${n?"active":""}" data-action="order-view" data-value="production">出品清單</button>
        <button class="${n?"":"active"}" data-action="order-view" data-value="edit">編輯訂單</button>
      </div>
      <div class="line-list">${n?Ce(t):Le(t,a)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${l.format(e.total)}</strong></div>
        <div><span>毛利</span><strong>${l.format(e.profit)}</strong></div>
        ${a?r?'<button class="paid" disabled>已結帳 · 現金</button>':`<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${t.id}">編輯訂單</button>
                 <button class="secondary danger-action" data-action="delete-order" data-id="${t.id}">刪除紀錄</button>`:`<button class="primary" data-action="checkout" ${t.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function je(){const t=o.editingProductId?_(o.editingProductId):null,e=t||{name:"",category:o.selectedCategoryId,type:"drink",price:"",cost:"",active:!0,sort:o.products.length+1,note:"",variants:[]};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${t?.id||""}">
        <label>品名<input id="product-name" value="${e.name}" /></label>
        <label>類別<select id="product-category">${h.map(a=>`<option value="${a.id}" ${a.id===e.category?"selected":""}>${a.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(j).map(([a,r])=>`<option value="${a}" ${a===e.type?"selected":""}>${r}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${e.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${e.cost}" /></label>
        <label>排序<input id="product-sort" type="number" step="1" value="${e.sort}" /></label>
        <label class="wide">口味 / 規格<textarea id="product-variants" placeholder="焙茶、伯爵">${M(e).join(`
`)}</textarea></label>
        <label class="wide">備註<input id="product-note" value="${e.note||""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${e.active!==!1?"checked":""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${t?.id||""}">${t?"儲存商品":"新增商品"}</button>
        ${t?'<button class="secondary" type="button" data-action="new-product">清空表單</button>':""}
      </form>
      <div class="product-admin-list">
        ${It().map(a=>`
              <article class="admin-product ${a.active?"":"inactive"}">
                <div>
                  <strong>${a.sort}. ${a.name}</strong>
                  <span>${St(a.category)} · ${j[a.type]} · ${l.format(a.price)} / 成本 ${l.format(a.cost)}</span>
                  ${M(a).length?`<small>口味 / 規格：${M(a).join("、")}</small>`:""}
                  ${a.note?`<small>${a.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${a.id}">編輯</button>
                <button class="${a.active?"danger-action":""}" data-action="toggle-product" data-id="${a.id}">${a.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function Ve(){const t=R(o.historyDate),e=Y(t),a=ht(o.historyDate);return`
    <section class="history">
      <div class="section-title">
        <h2>打烊報表</h2>
        <div class="actions">
          <button class="ghost" data-action="undo-checkout">撤銷最後結帳</button>
          <button class="ghost" data-action="floor">返回點餐</button>
        </div>
      </div>
      <div class="history-tools">
        <button data-action="history-yesterday">昨天</button>
        <button data-action="history-today">今天</button>
        <input type="date" value="${o.historyDate}" data-action="history-date" />
        <button data-action="export-report-date">匯出此日期</button>
      </div>
      <section class="stats report-stats" aria-label="指定日期統計">
        <article><span>營業額</span><strong>${l.format(e.revenue)}</strong></article>
        <article><span>毛利</span><strong>${l.format(e.profit)}</strong></article>
        <article><span>訂單數</span><strong>${e.orderCount}</strong></article>
        <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
        <article><span>甜品數</span><strong>${e.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${e.retail}</strong></article>
        <article><span>平均客單價</span><strong>${l.format(e.averageTicket)}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${o.salesSort==="amount"?"數量":"金額"}排序</button>
      </div>
      <div class="sales-table">
        ${a.length?`<article class="sales-header"><strong>商品名稱</strong><span>類別</span><span>數量</span><span>銷售金額</span><span>成本</span><span>毛利</span></article>
               ${a.map(r=>`<article><strong>${r.name}</strong><span>${r.category}</span><span>${r.quantity}</span><span>${l.format(r.amount)}</span><span>${l.format(r.cost)}</span><span>${l.format(r.profit)}</span></article>`).join("")}`:'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${t.length?t.map(r=>{const n=O(r);return`
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${r.id}">
                        <span>${w(r.checkedOutAt||r.createdAt)} · ${z(r)} · ${r.people}人</span>
                        <strong>${l.format(n.total)}</strong>
                        <small>${tt(r)||"無商品"} · 停留 ${L(r)} 分鐘${F(r)?` · ${F(r)}`:""}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${r.id}">刪除</button>
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function Fe(){const t=R(y()),e=Y(t);return`
    <section class="management">
      <div class="section-title">
        <h2>備份 / 資料</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-actions">
        <button class="primary" data-action="export-all">匯出全部資料</button>
        <button class="secondary" data-action="export-today">匯出今日資料</button>
        <button class="secondary" data-action="export-closing">結束營業 / 匯出今日報表</button>
        <button class="secondary" data-action="import-backup">匯入備份</button>
        <button class="secondary danger-action" data-action="reset-test-orders">清空測試訂單資料</button>
        <input id="backup-file" type="file" accept="application/json,.json" hidden />
      </div>
      <div class="backup-summary">
        <article><span>目前訂單總數</span><strong>${o.orders.length}</strong></article>
        <article><span>商品數</span><strong>${o.products.length}</strong></article>
        <article><span>今日已結帳訂單</span><strong>${t.length}</strong></article>
        <article><span>今日營業額</span><strong>${l.format(e.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `}function Ue(){const t=Xt(),e=Yt(o.orders,{startDate:t.startDate,endDate:t.endDate,sortBy:o.analyticsSort,categoryLabels:ee(),seatLabels:ae()}),{overview:a,productRanking:r,categorySummary:n,temperatureSummary:s,hourlySummary:i,seatSummary:c}=e,u=r.slice(0,8),v=[["today","今日"],["yesterday","昨日"],["seven-days","近 7 天"],["month","本月"],["custom","自訂日期"]],$=[["quantity","銷售數量"],["revenue","營收"],["profit","毛利"]];return`
    <section class="analytics-page">
      <div class="section-title">
        <div>
          <h2>經營分析</h2>
          <span class="analytics-range-label">${t.label}</span>
        </div>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>

      <div class="analytics-toolbar">
        <div class="analytics-range-tabs">
          ${v.map(([d,f])=>`
                <button class="${o.analyticsRange===d?"active":""}" data-action="analytics-range" data-value="${d}">${f}</button>
              `).join("")}
        </div>
        <div class="analytics-custom-dates">
          <label>開始<input type="date" value="${t.startDate}" data-action="analytics-start-date" /></label>
          <label>結束<input type="date" value="${t.endDate}" data-action="analytics-end-date" /></label>
        </div>
      </div>

      <section class="stats analytics-stats" aria-label="經營分析概覽">
        <article><span>營業額</span><strong>${l.format(a.revenue)}</strong></article>
        <article><span>毛利</span><strong>${l.format(a.profit)}</strong></article>
        <article><span>毛利率</span><strong>${P.format(a.marginRate)}</strong></article>
        <article><span>訂單數</span><strong>${a.orderCount}</strong></article>
        <article><span>人數</span><strong>${a.people}</strong></article>
        <article><span>平均客單價</span><strong>${l.format(a.averageTicket)}</strong></article>
        <article><span>飲品杯數</span><strong>${a.drinks}</strong></article>
        <article><span>甜點數</span><strong>${a.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${a.retail}</strong></article>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact">
          <h2>商品銷售排行</h2>
          <div class="analytics-sort">
            ${$.map(([d,f])=>`<button class="${o.analyticsSort===d?"active":""}" data-action="analytics-sort" data-value="${d}">${f}</button>`).join("")}
          </div>
        </div>
        <div class="analytics-table product-ranking-table">
          ${u.length?`<div class="analytics-table-head">
                    <span>排名</span><span>商品名稱</span><span>類別</span><span>數量</span><span>營收</span><span>成本</span><span>毛利</span><span>毛利率</span><span>口味 / 規格</span><span>冰 / 熱</span><span>內用 / 外帶</span>
                 </div>
                 ${u.map((d,f)=>`
                       <div>
                         <span>${f+1}</span>
                         <strong>${d.name}</strong>
                         <span>${d.category}</span>
                         <span>${d.quantity}</span>
                         <span>${l.format(d.revenue)}</span>
                         <span>${l.format(d.cost)}</span>
                         <span>${l.format(d.profit)}</span>
                         <span>${P.format(d.marginRate)}</span>
                         <span>${se(d)}</span>
                         <span>${d.iced||d.hot?`冰 ${d.iced} / 熱 ${d.hot}`:"-"}</span>
                         <span>內用 ${d.dineIn} / 外帶 ${d.takeaway}</span>
                       </div>
                     `).join("")}`:'<div class="empty-note">此區間尚無已結帳銷售</div>'}
        </div>
      </section>

      <section class="analytics-grid">
        <article class="analytics-panel">
          <div class="section-title compact"><h2>類別分析</h2></div>
          <div class="analytics-table category-summary-table">
            ${n.length?`<div class="analytics-table-head"><span>類別</span><span>數量</span><span>營收</span><span>毛利</span><span>毛利率</span></div>
                   ${n.map(d=>`
                         <div>
                           <strong>${d.category}</strong>
                           <span>${d.quantity}</span>
                           <span>${l.format(d.revenue)}</span>
                           <span>${l.format(d.profit)}</span>
                           <span>${P.format(d.marginRate)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無類別資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>冰熱分析</h2></div>
          <div class="temperature-summary">
            <article><span>冰飲數量</span><strong>${s.iced}</strong><small>${P.format(s.icedRate)}</small></article>
            <article><span>熱飲數量</span><strong>${s.hot}</strong><small>${P.format(s.hotRate)}</small></article>
          </div>
        </article>
      </section>

      <section class="analytics-grid">
        <article class="analytics-panel">
          <div class="section-title compact"><h2>時段分析</h2></div>
          <div class="analytics-table hourly-summary-table">
            ${i.length?`<div class="analytics-table-head"><span>小時</span><span>訂單數</span><span>營業額</span><span>飲品杯數</span></div>
                   ${i.map(d=>`
                         <div>
                           <strong>${d.hour}</strong>
                           <span>${d.orderCount} 單</span>
                           <span>${l.format(d.revenue)}</span>
                           <span>${d.drinks} 杯</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無時段資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>座位分析</h2></div>
          <div class="analytics-table seat-summary-table">
            ${c.length?`<div class="analytics-table-head"><span>座位名稱</span><span>訂單數</span><span>人數</span><span>營業額</span><span>平均客單價</span></div>
                   ${c.map(d=>`
                         <div>
                           <strong>${d.seatName}</strong>
                           <span>${d.orderCount}</span>
                           <span>${d.people}</span>
                           <span>${l.format(d.revenue)}</span>
                           <span>${l.format(d.averageTicket)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無座位資料</div>'}
          </div>
        </article>
      </section>
    </section>
  `}function Be(){return o.activeView==="analytics"?Ue():o.activeView==="backup"?Fe():o.activeView==="products"?je():o.activeView==="history"?Ve():`
    <main class="workspace">
      <section class="floor">
        <div class="section-title">
          <h2>目前店內</h2>
          <div class="actions">
            <button class="ghost" data-action="products">商品管理</button>
            <button class="ghost" data-action="history">歷史</button>
            <button class="ghost" data-action="analytics">經營分析</button>
            <button class="ghost" data-action="backup">備份 / 資料</button>
            <button class="ghost danger-action" data-action="undo-checkout">撤銷最後結帳</button>
          </div>
        </div>
        ${qe()}
        ${Ne()}
      </section>
      ${Me()}
    </main>
  `}function He(){if(!dt)return"";const t=o.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",t.clickedProductId||""],["selectedSeatId",t.selectedSeatId||o.selectedSeatId||""],["selectedOrderId",t.selectedOrderId||o.selectedOrderId||""],["current open order id",t.currentOpenOrderId||Z()?.id||""],["product found",String(t.productFound??"")],["addProduct executed",String(t.addProductExecuted??"")],["failure reason",t.addProductFailureReason||""],["before items.length",String(t.beforeItemsLength??t.selectedOrderItemsLengthBefore??"")],["after items.length",String(t.afterItemsLength??"")],["new item lineId",t.newItemLineId||""],["replaceOrder executed",String(t.replaceOrderExecuted??"")],["storage save executed",String(t.storageSaveExecuted??"")],["render after save executed",String(t.renderAfterSaveExecuted??"")],["orders.length",String(t.ordersLength??o.orders.length)],["selected items.length",String(t.selectedOrderItemsLength??bt())],["dataset.id",t.datasetId||""],["data-product-id",t.productDatasetId||""],["closest button",String(t.closestButtonFound??"")],["source",t.productClickSource||""],["updated",t.updatedAt||""]].map(([a,r])=>`<div><span>${a}</span><code>${r}</code></div>`).join("")}
    </aside>
  `}function ze(){document.querySelectorAll(".product[data-product-id]").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),wt(t.getAttribute("data-product-id"),"direct-product-button",e)})})}function A(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      ${`<div class="dev-banner">🟠 開發版本 ${Wt}</div>`}
      <header class="topbar">
        <div><span>YUTU Coffee</span><h1>隅途 POS</h1></div>
        <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
      </header>
      ${o.notice?`<div class="notice" role="status">${o.notice}</div>`:""}
      ${Pe()}
      ${Be()}
      ${He()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(t=>{t.type="button"}),ze()}document.addEventListener("click",t=>{const e=t.target.closest("button");if(!e||e.disabled)return;t.preventDefault();const{action:a,id:r,value:n}=e.dataset;if(a==="seat"&&ne(r),a==="new-takeout"&&oe(),a==="select-order"&&ie(r),a==="category"&&p({selectedCategoryId:r}),a==="product"&&wt(r,"delegated-document-click",t),a==="qty"){const s=Number(n);s<=0?rt(r):C(r,{quantity:s})}if(a==="temp"&&C(r,{temperature:n}),a==="service"&&C(r,{serviceType:n}),a==="served"){const i=S()?.items.find(c=>c.lineId===r);i&&C(r,{served:!i.served})}if(a==="remove"&&rt(r),a==="checkout"&&de(),a==="undo-checkout"&&le(),a==="cancel-order"&&pe(),a==="edit-paid"&&ye(r),a==="delete-order"&&fe(r),a==="products"&&p({activeView:"products",editingProductId:null}),a==="analytics"&&p({activeView:"analytics"}),a==="backup"&&p({activeView:"backup"}),a==="new-product"&&nt(null),a==="edit-product"&&nt(r),a==="toggle-product"&&ve(r),a==="save-product"&&me(r||null),a==="export-all"&&Ie(),a==="export-today"&&we(),a==="export-closing"&&ke(),a==="export-report-date"&&et(o.historyDate||y()),a==="import-backup"&&document.querySelector("#backup-file")?.click(),a==="reset-test-orders"&&Ae(),a==="history"&&p({activeView:"history",historyDate:o.historyDate||y()}),a==="floor"&&p({activeView:"floor",orderDetailMode:"active"}),a==="open-history"){const s=o.orders.find(i=>i.id===r);s?p({selectedOrderId:r,selectedSeatId:s.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:r}),m("找不到這筆歷史訂單。"))}if(a==="history-yesterday"&&p({historyDate:J(y(),-1)}),a==="history-today"&&p({historyDate:y()}),a==="toggle-sales-sort"&&p({salesSort:o.salesSort==="amount"?"quantity":"amount"}),a==="order-view"&&p({orderViewMode:n==="production"?"production":"edit"}),a==="analytics-range"){const s=n||"today",i={analyticsRange:s};if(s!=="custom"){const c=ft(s);i.analyticsStartDate=c.startDate,i.analyticsEndDate=c.endDate}p(i)}a==="analytics-sort"&&p({analyticsSort:n||"quantity"})});document.addEventListener("change",t=>{if(t.target?.id==="backup-file"){Te(t.target.files?.[0]),t.target.value="";return}const e=t.target.closest("[data-action]");e&&(e.dataset.action==="history-date"&&p({historyDate:e.value||y()}),e.dataset.action==="analytics-start-date"&&p({analyticsRange:"custom",analyticsStartDate:e.value||y()}),e.dataset.action==="analytics-end-date"&&p({analyticsRange:"custom",analyticsEndDate:e.value||y()}))});A();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
