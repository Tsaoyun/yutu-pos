(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const w=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"signature",name:"特調"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],Qt=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],L=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function zt(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}function T(e){if(e==null||e==="")return null;const t=Number(e);return Number.isFinite(t)?t:null}function Ge(e){const t=Number(e.basePrice??e.price??e.effectivePrice)||0,n=Number(e.iceExtraPrice??e.iceExtra??0)||0,a=e.temperature==="冰"?n:0,s=t+a,r=T(e.cost);return{basePrice:t,effectivePrice:s,iceExtra:a,iceExtraPrice:n,price:s,profit:r===null?null:s-r}}function Je({seatId:e,people:t}){const n=new Date;return{id:`YT-${n.getFullYear()}${String(n.getMonth()+1).padStart(2,"0")}${String(n.getDate()).padStart(2,"0")}-${String(n.getTime()).slice(-5)}`,createdAt:n.toISOString(),seatId:e,people:t,items:[],activityLog:[],status:"open",paymentMethod:null,checkedOutAt:null}}function Yt(e,t,n={}){const a=t.requiresTemperature??t.type==="drink",s=t.requiresServiceType??t.type!=="retail",r=a?n.temperature||"熱":"",c=n.serviceType||(e.seatId==="takeout"?"外帶":"內用"),i={category:t.category,temperature:r,basePrice:t.price,cost:T(t.cost),iceExtraPrice:Number(t.iceExtraPrice)||0},l=Ge(i);return{...e,items:[...e.items,{lineId:zt(),productId:t.id,name:t.name,variantName:n.variantName||"",category:t.category,type:t.type,quantity:1,requiresTemperature:a,requiresServiceType:s,supportsHot:t.supportsHot,supportsIce:t.supportsIce,iceExtraPrice:l.iceExtraPrice,temperature:r,serviceType:s?c:"",basePrice:l.basePrice,effectivePrice:l.effectivePrice,iceExtra:l.iceExtra,price:l.price,cost:i.cost,profit:l.profit,served:!1,note:n.note||""}]}}function Wt(e,t,n){return{...e,items:e.items.map(a=>{if(a.lineId!==t)return a;const s={...a,...n};return{...s,...Ge(s)}})}}function Gt(e,t){return{...e,items:e.items.filter(n=>n.lineId!==t)}}function D(e){return e.items.reduce((t,n)=>{const a=Number(n.quantity)||0,s=Number(n.effectivePrice??n.price)||0,r=T(n.cost);return t.total+=s*a,r===null?(t.unknownCostItems+=1,t.unknownCostQuantity+=a,t.unknownCostRevenue+=s*a):(t.cost+=r*a,t.knownCostRevenue+=s*a,t.profit+=(s-r)*a),t.drinks+=n.type==="drink"?a:0,t.desserts+=n.type==="dessert"?a:0,t.retail+=n.type==="retail"?a:0,t},{total:0,cost:0,profit:0,knownCostRevenue:0,unknownCostRevenue:0,unknownCostItems:0,unknownCostQuantity:0,drinks:0,desserts:0,retail:0})}function Jt(e,t="cash"){const n=new Date().toISOString();return{...e,status:"paid",paymentMethod:t,checkedOutAt:n,activityLog:[...Array.isArray(e.activityLog)?e.activityLog:[],{type:"checkout",at:n}]}}const Ze=["purchase","production","roasting","waste","personal","test","complimentary","stock_adjustment"],Zt=["sale","waste","personal","test","complimentary","other"],Kt=["purchase","waste","personal","test","complimentary"],Xt=["product","material","manual"],Ke={purchase:"採購",production:"生產",roasting:"烘豆",waste:"報廢",personal:"自用",test:"測試",complimentary:"招待",stock_adjustment:"盤點修正"},en=new Set(Ze),Ue=new Set(Zt),tn=new Set(["waste","personal","test","complimentary"]),nn=new Set(Xt);function an(e="event"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function sn(e){return en.has(e)?e:"stock_adjustment"}function rn(e,t){return tn.has(t)?Ue.has(e)?e:t:Ue.has(e)?e:null}function on(e){return nn.has(e)?e:"manual"}function Z(e){return Number(e)||0}function cn(e){return Math.max(1,Math.trunc(Number(e)||1))}function Xe({formOnly:e=!1}={}){return(e?Kt:Ze).map(n=>[n,Ke[n]||n])}function et(e){return Ke[e]||e||"未知事件"}function tt(e={}){const t=new Date().toISOString(),n=sn(e.type),a=cn(e.quantity),s=e.costAmount&&a?Z(e.costAmount)/a:0,r=Number.isFinite(Number(e.unitCost))?Z(e.unitCost):s,c=Number.isFinite(Number(e.costAmount))?Z(e.costAmount):r*a;return{id:e.id||an("business-event"),date:e.date||t.slice(0,10),type:n,usageType:rn(e.usageType,n),itemId:e.itemId||"",itemSource:on(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",quantity:a,unit:e.unit||"",unitCost:r,amount:Z(e.amount),costAmount:c,vendor:e.vendor||"",note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function Se(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>tt(t)):[]}function un(e,t,n){const a=t||"",s=n||a;return Se(e).filter(r=>!a&&!s?!0:!(a&&r.date<a||s&&r.date>s))}function nt(e,t={}){return(t.startDate||t.endDate?un(e,t.startDate,t.endDate):Se(e)).reduce((a,s)=>((s.type==="waste"||s.usageType==="waste")&&(a.wasteCost+=s.costAmount),(s.type==="personal"||s.usageType==="personal")&&(a.personalCost+=s.costAmount),(s.type==="test"||s.usageType==="test")&&(a.testCost+=s.costAmount),(s.type==="complimentary"||s.usageType==="complimentary")&&(a.complimentaryCost+=s.costAmount),s.type==="purchase"&&(a.purchaseAmount+=s.amount||s.costAmount),a),{wasteCost:0,personalCost:0,testCost:0,complimentaryCost:0,purchaseAmount:0})}const Ie=[["google_maps","Google 地圖"],["instagram","Instagram"],["threads","Threads"],["walk_in","路過"],["friend_referral","朋友介紹"],["xiaohongshu","小紅書"],["returning_customer","再次回訪"],["other","其他"],["not_asked","未詢問"]],dn=new Set(Ie.map(([e])=>e)),ln=new Set(["other","friend_referral"]),ee=Object.fromEntries(Ie);function pn(e){return Number(e.effectivePrice??e.price)||0}function mn(e){return Number(e.quantity)||0}function we(){return Ie}function at(){return ee}function O(e){return dn.has(e)?e:"not_asked"}function oe(e){const t=O(e);return ee[t]||ee.not_asked}function st(e){return ln.has(O(e))}function rt(e,t={}){const n=t.customerSourceLabels||ee,a=new Map;return(Array.isArray(e)?e:[]).forEach(s=>{const r=O(s.customerSource),c=a.get(r)||{source:r,label:n[r]||oe(r),orderCount:0,revenue:0,averageTicket:0};c.orderCount+=1,s.items?.forEach(i=>{c.revenue+=pn(i)*mn(i)}),c.averageTicket=c.orderCount?c.revenue/c.orderCount:0,a.set(r,c)}),[...a.values()].sort((s,r)=>r.revenue-s.revenue||r.orderCount-s.orderCount)}function ot(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?"":new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function yn(e){return ot(e.checkedOutAt||e.createdAt)}function fn(e){const t=new Date(e.checkedOutAt||e.createdAt);return Number.isNaN(t.getTime())?"--:00":`${String(t.getHours()).padStart(2,"0")}:00`}function ke(e){return Number(e.effectivePrice??e.price)||0}function x(e){return Number(e.quantity)||0}function be(e,t){return t?e/t:0}function it(e,t={}){return t[e]||e||"未分類"}function vn(e,t={}){return e==="takeout"?t.takeout||"外帶":t[e]||e||"未指定座位"}function ie(){return{revenue:0,cost:0,profit:0,knownCostRevenue:0,unknownCostRevenue:0,unknownCostItems:0,unknownCostQuantity:0,marginRate:0}}function De(e,t){const n=x(t),a=ke(t)*n,s=T(t.cost);if(e.revenue+=a,s===null){e.unknownCostRevenue+=a,e.unknownCostItems+=1,e.unknownCostQuantity+=n;return}const r=s*n;e.cost+=r,e.knownCostRevenue+=a,e.profit+=a-r}function Ae(e){return e.marginRate=be(e.profit,e.knownCostRevenue||e.revenue),e}function gn(e={}){return Object.values(e).map(t=>({category:t,quantity:0,...ie()}))}function bn(e,t,n){const a=t||ot(new Date),s=n||a;return(Array.isArray(e)?e:[]).filter(r=>{if(r.status!=="paid")return!1;const c=yn(r);return c>=a&&c<=s})}function $n(e){const t=(Array.isArray(e)?e:[]).reduce((n,a)=>(n.orderCount+=1,n.people+=Number(a.people)||0,a.items?.forEach(s=>{const r=x(s);De(n,s),n.drinks+=s.type==="drink"?r:0,n.desserts+=s.type==="dessert"?r:0,n.retail+=s.type==="retail"?r:0}),n),{...ie(),orderCount:0,people:0,averageTicket:0,drinks:0,desserts:0,retail:0});return Ae(t),t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function hn(e,t={}){const n=t.categoryLabels||{},a=t.sortBy||"quantity",s=new Map;(Array.isArray(e)?e:[]).forEach(c=>{c.items?.forEach(i=>{const l=x(i),u=`${i.productId||i.name}-${i.name}`,f=s.get(u)||{productId:i.productId||"",name:i.name,category:it(i.category,n),quantity:0,...ie(),iced:0,hot:0,dineIn:0,takeaway:0,variants:{}};f.quantity+=l,De(f,i),f.iced+=i.type==="drink"&&i.temperature==="冰"?l:0,f.hot+=i.type==="drink"&&i.temperature==="熱"?l:0,f.dineIn+=i.serviceType==="內用"?l:0,f.takeaway+=i.serviceType==="外帶"?l:0,i.variantName&&(f.variants[i.variantName]=(f.variants[i.variantName]||0)+l),Ae(f),s.set(u,f)})});const r={quantity:(c,i)=>i.quantity-c.quantity||i.revenue-c.revenue,revenue:(c,i)=>i.revenue-c.revenue||i.quantity-c.quantity,profit:(c,i)=>i.profit-c.profit||i.revenue-c.revenue};return[...s.values()].sort(r[a]||r.quantity)}function Sn(e,t={}){const n=t.categoryLabels||{},a=gn(n),s=new Map(a.map(r=>[r.category,r]));return(Array.isArray(e)?e:[]).forEach(r=>{r.items?.forEach(c=>{const i=x(c),l=it(c.category,n),u=s.get(l)||{category:l,quantity:0,...ie()};u.quantity+=i,De(u,c),Ae(u),s.set(l,u)})}),[...s.values()]}function In(e){const t={iced:0,hot:0,total:0,icedRate:0,hotRate:0};return(Array.isArray(e)?e:[]).forEach(n=>{n.items?.forEach(a=>{if(a.type!=="drink")return;const s=x(a);t.iced+=a.temperature==="冰"?s:0,t.hot+=a.temperature==="熱"?s:0,t.total+=s})}),t.icedRate=be(t.iced,t.total),t.hotRate=be(t.hot,t.total),t}function wn(e){const t=new Map;return(Array.isArray(e)?e:[]).forEach(n=>{const a=fn(n),s=t.get(a)||{hour:a,orderCount:0,revenue:0,drinks:0};s.orderCount+=1,n.items?.forEach(r=>{const c=x(r);s.revenue+=ke(r)*c,s.drinks+=r.type==="drink"?c:0}),t.set(a,s)}),[...t.values()].sort((n,a)=>n.hour.localeCompare(a.hour))}function kn(e,t={}){const n=t.seatLabels||{},a=new Map;return(Array.isArray(e)?e:[]).forEach(s=>{const r=vn(s.seatId,n),c=a.get(r)||{seatName:r,orderCount:0,people:0,revenue:0,averageTicket:0};c.orderCount+=1,c.people+=Number(s.people)||0,s.items?.forEach(i=>{c.revenue+=ke(i)*x(i)}),c.averageTicket=c.orderCount?c.revenue/c.orderCount:0,a.set(r,c)}),[...a.values()].sort((s,r)=>r.revenue-s.revenue||r.orderCount-s.orderCount)}function Dn(e,t={}){const n=bn(e,t.startDate,t.endDate),a=$n(n),s=hn(n,t),r=Sn(n,t),c=In(n),i=wn(n),l=kn(n,t),u=rt(n,t),f=nt(t.businessEvents||[],{startDate:t.startDate,endDate:t.endDate});return{schemaVersion:1,startDate:t.startDate,endDate:t.endDate,paidOrders:n,overview:a,salesSummary:a,productRanking:s,productSummary:s,categorySummary:r,temperatureSummary:c,hourlySummary:i,seatSummary:l,customerSourceSummary:u,businessEventSummary:f,comparisonSummary:null}}const ct=["dessert","roasted_beans"],An=["active","archived"],Cn=["product","material","manual"],ut={dessert:"甜點批次",roasted_beans:"熟豆批次"},On={active:"使用中",archived:"已封存"},En=new Set(ct),Tn=new Set(An),Nn=new Set(Cn);function Pn(e="lot"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function ge(e){return Number(e)||0}function Be(e){return Math.max(0,Math.trunc(Number(e)||0))}function dt(e){return En.has(e)?e:"dessert"}function Ln(e){return Tn.has(e)?e:"active"}function xn(e){return Nn.has(e)?e:"manual"}function lt(){return ct.map(e=>[e,ut[e]||e])}function qn(e){return ut[e]||e||"未分類"}function Rn(e){return On[e]||e||"未分類"}function Ce(e){return dt(e)==="roasted_beans"?"g":"片"}function pt(e={}){const t=new Date().toISOString(),n=dt(e.lotType),a=Be(e.initialQuantity),s=e.remainingQuantity===void 0?a:Be(e.remainingQuantity),r=e.costAmount&&a?ge(e.costAmount)/a:0,c=Number.isFinite(Number(e.unitCost))?ge(e.unitCost):r,i=Number.isFinite(Number(e.costAmount))?ge(e.costAmount):c*a;return{lotId:e.lotId||e.id||Pn("inventory-lot"),itemSource:xn(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",lotType:n,sourceEventId:e.sourceEventId||"",madeDate:e.madeDate||"",roastDate:e.roastDate||"",purchaseDate:e.purchaseDate||"",expireDate:e.expireDate||"",initialQuantity:a,remainingQuantity:s,unit:e.unit||Ce(n),unitCost:c,costAmount:i,status:Ln(e.status),note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function Mn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>pt(t)):[]}const Oe="yutu-pos-state-v1";function Vn(e){try{const t=localStorage.getItem(Oe);return t?JSON.parse(t):e}catch(t){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",t),e}}function F(e){try{return localStorage.setItem(Oe,JSON.stringify(e)),!0}catch(t){return console.warn("[YUTU POS] localStorage write failed.",t),!1}}const te={drink:"飲品",dessert:"甜品",retail:"熟豆"},I="takeout",mt={id:I,name:"外帶",icon:"🥡"},jn=5,Fn=["漏登訂單","紙本紀錄補登","系統故障","誤刪後重建","其他"],_n={cash:"現金",electronic:"電子支付"},p=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),z=new Intl.NumberFormat("zh-TW",{style:"percent",maximumFractionDigits:1}),Un={espresso:{type:"drink",supportsHot:!0,supportsIce:!0,iceExtraPrice:0},pourover:{type:"drink",supportsHot:!0,supportsIce:!0,iceExtraPrice:10},tea:{type:"drink",supportsHot:!0,supportsIce:!0,iceExtraPrice:0},signature:{type:"drink",supportsHot:!0,supportsIce:!0,iceExtraPrice:0},dessert:{type:"dessert",supportsHot:!1,supportsIce:!1,iceExtraPrice:0},beans:{type:"retail",supportsHot:!1,supportsIce:!1,iceExtraPrice:0}};function yt(e){return Un[e]||{}}function $e(e){const t=String(e??"").trim();if(t==="")return null;const n=Number(t);return Number.isFinite(n)?n:null}function Bn(e){const t=T(e);return t===null?"成本未知":p.format(t)}function S(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Hn(e){const t=String(e||""),n=["今日已","結束"].join(""),a=t.includes(n)&&t.includes("建立")&&t.includes("訂單"),s=t.includes("漏登")&&t.includes("補登");return a||s?"":t}const ft=new URLSearchParams(window.location.search).get("debug")==="1",Ee=1,Te="YUTU_POS",he={seats:L,products:gt(Qt),orders:[],dailyClosings:[],businessEvents:[],inventoryLots:[],inventoryItems:[],inventoryMovements:[],selectedSeatId:L[0].id,selectedCategoryId:w[0].id,selectedOrderId:null,orderDetailMode:"active",orderViewMode:"production",activeView:"floor",historyDate:y(),analyticsRange:"today",analyticsStartDate:y(),analyticsEndDate:y(),analyticsSort:"quantity",salesSort:"amount",businessEventDate:y(),businessEventFormType:"purchase",businessEventItemSource:"manual",businessEventProductId:"",businessEventTypeFilter:"all",editingBusinessEventId:null,inventoryLotType:"dessert",inventoryLotItemSource:"product",inventoryLotProductId:"",inventoryLotStatusFilter:"active",notice:"",debug:{}};let o=q(Vn(he));function ce(e){return Array.isArray(e)?e.map(t=>{if(typeof t=="string"){const n=t.trim();return n?{name:n,active:!0}:null}if(t&&typeof t=="object"){const n=String(t.name||"").trim();return n?{...t,name:n,active:t.active!==!1}:null}return null}).filter(Boolean):[]}function X(e,{activeOnly:t=!1}={}){return ce(e?.variants).filter(n=>!t||n.active!==!1).map(n=>n.name)}function vt(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object"):[]}function Ne(e){const t=e.category||"espresso",n=yt(t),a=e.type||n.type||"drink",s=a==="drink",r=a==="retail";return{type:a,supportsHot:e.supportsHot??n.supportsHot??s,supportsIce:e.supportsIce??n.supportsIce??s,supportsTakeout:e.supportsTakeout??!r,iceExtraPrice:Number(e.iceExtraPrice??(s?n.iceExtraPrice:0))||0}}function Qn(e){if(!Array.isArray(e))return[];const t=e.filter(a=>a&&typeof a=="object").map((a,s)=>{const r=Number(a.totalSales)||0,c=Number(a.grossProfit)||0,i=a.date||y(),l=a.closedAt||a.exportedAt||new Date().toISOString();return{...a,id:a.id||`closing-${i}-${s}`,date:i,businessDate:a.businessDate||i,closedAt:l,orderCount:Number(a.orderCount)||0,totalSales:r,revenue:Number(a.revenue??r)||0,totalCost:Number(a.totalCost)||0,grossProfit:c,grossMargin:Number(a.grossMargin??(r?c/r:0))||0,knownCostRevenue:Number(a.knownCostRevenue)||0,knownGrossMargin:Number(a.knownGrossMargin)||0,unknownCostRevenue:Number(a.unknownCostRevenue)||0,unknownCostItems:Number(a.unknownCostItems)||0,unknownCostQuantity:Number(a.unknownCostQuantity)||0,paymentSummary:a.paymentSummary||{},customerSourceSummary:Array.isArray(a.customerSourceSummary)?a.customerSourceSummary:[],businessEventSummary:a.businessEventSummary||{wasteCost:0,personalCost:0,testCost:0,complimentaryCost:0,purchaseAmount:0},openOrderCount:Number(a.openOrderCount)||0,snapshotVersion:Number(a.snapshotVersion)||1,supersedesId:a.supersedesId||null,changeSummary:a.changeSummary||null,drinkCount:Number(a.drinkCount)||0,dessertCount:Number(a.dessertCount)||0,retailCount:Number(a.retailCount)||0,exported:!!a.exported,backupStatus:a.backupStatus||"pending",backupDownloadedAt:a.backupDownloadedAt||null,exportedAt:a.exportedAt||null,createdAt:a.createdAt||l,version:Number(a.version)||null,status:a.status==="superseded"?"superseded":"official",isOfficial:a.isOfficial!==!1&&a.status!=="superseded",supersededBy:a.supersededBy||null,supersededAt:a.supersededAt||null,note:a.note||""}}),n=new Map;return t.forEach(a=>{const s=n.get(a.date)||[];s.push(a),n.set(a.date,s)}),n.forEach(a=>{a.sort((c,i)=>{const l=new Date(c.closedAt)-new Date(i.closedAt);return l!==0?l:String(c.id).localeCompare(String(i.id))}),a.forEach((c,i)=>{c.version=c.version||i+1});const s=a.filter(c=>c.isOfficial),r=s.length?s[s.length-1]:a[a.length-1];r.status="official",r.isOfficial=!0,r.supersededBy=null,r.supersededAt=null,a.forEach(c=>{c.id!==r.id&&(c.status="superseded",c.isOfficial=!1,c.supersededBy=c.supersededBy||r.id,c.supersededAt=c.supersededAt||r.closedAt)})}),t}function zn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map((t,n)=>({...t,id:t.id||`inventory-item-${Date.now()}-${n}`,name:t.name||"",category:t.category||"",unit:t.unit||"",currentStock:Number(t.currentStock)||0,alertStock:Number(t.alertStock)||0,active:t.active!==!1})):[]}function Yn(e){const t=new Set(["purchase","adjustment","sale","waste","self_use"]);return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map((n,a)=>({...n,id:n.id||`inventory-movement-${Date.now()}-${a}`,itemId:n.itemId||"",type:t.has(n.type)?n.type:"adjustment",quantity:Number(n.quantity)||0,createdAt:n.createdAt||new Date().toISOString(),note:n.note||""})):[]}function gt(e){return e.map((t,n)=>{const a=Ne(t);return{...t,...a,requiresTemperature:t.requiresTemperature??(a.supportsHot||a.supportsIce),requiresServiceType:t.requiresServiceType??a.supportsTakeout,sort:t.sort??n+1,note:t.note||"",variants:ce(t.variants),options:vt(t.options)}})}function q(e){const t=Array.isArray(e.products)?e.products:Array.isArray(e.menuItems)?e.menuItems:he.products,n=gt(t).map((s,r)=>{const c=Ne(s);return{...s,...c,id:s.id||`product-${Date.now()}-${r}`,name:s.name||"未命名商品",category:s.category||"espresso",type:s.type||c.type||"drink",price:Number(s.price)||0,cost:$e(s.cost),requiresTemperature:s.requiresTemperature??(c.supportsHot||c.supportsIce),requiresServiceType:s.requiresServiceType??c.supportsTakeout,active:s.active!==!1,sort:Number(s.sort)||r+1,note:s.note||"",variants:ce(s.variants),options:vt(s.options)}}),a=Array.isArray(e.orders)?e.orders.map(s=>({...s,businessDate:s.businessDate||R(s.checkedOutAt||s.paidAt||s.createdAt),orderedAt:s.orderedAt||s.createdAt,paidAt:s.paidAt||s.checkedOutAt||null,entryType:s.entryType||"standard",fulfillmentStatus:s.fulfillmentStatus||(s.status==="paid"?"completed":""),correctionReason:s.correctionReason||"",correctedAt:s.correctedAt||null,voidedAt:s.voidedAt||null,voidReason:s.voidReason||"",previousStatus:s.previousStatus||null,orderNote:s.orderNote||"",updatedAt:s.updatedAt||s.checkedOutAt||s.createdAt,companionSeatIds:Array.isArray(s.companionSeatIds)?s.companionSeatIds:[],linkedSeatIds:Array.isArray(s.linkedSeatIds)?s.linkedSeatIds:Array.isArray(s.companionSeatIds)?s.companionSeatIds:[],customerSource:O(s.customerSource),customerSourceNote:s.customerSourceNote||"",activityLog:Array.isArray(s.activityLog)?s.activityLog:[],items:Array.isArray(s.items)?s.items.map(r=>{const c=Number(r.price)||0,i=Number(r.basePrice??c)||0,l=Number(r.effectivePrice??c)||0,u=s.seatId===I?"外帶":"內用",f=r.requiresTemperature??r.type==="drink",h=r.requiresServiceType??r.type!=="retail",g=$e(r.cost),d=g===null?null:l-g;return{...r,quantity:Number(r.quantity)||1,basePrice:i,effectivePrice:l,iceExtra:Number(r.iceExtra??l-i)||0,price:l,cost:g,profit:d,supportsHot:r.supportsHot??f,supportsIce:r.supportsIce??f,supportsTakeout:r.supportsTakeout??h,iceExtraPrice:Number(r.iceExtraPrice??yt(r.category).iceExtraPrice??r.iceExtra)||0,temperature:f?r.temperature==="冰"?"冰":"熱":"",serviceType:r.serviceType==="外帶"?"外帶":u,requiresTemperature:f,requiresServiceType:h,variantName:r.variantName||"",served:!!r.served,note:r.note||""}}):[]})):[];return{...he,...e,seats:L,products:n,menuItems:n,orders:a,dailyClosings:Qn(e.dailyClosings),businessEvents:Se(e.businessEvents),inventoryLots:Mn(e.inventoryLots),inventoryItems:zn(e.inventoryItems),inventoryMovements:Yn(e.inventoryMovements),selectedSeatId:e.selectedSeatId===I?I:L.some(s=>s.id===e.selectedSeatId)?e.selectedSeatId:L[0].id,selectedCategoryId:w.some(s=>s.id===e.selectedCategoryId)?e.selectedCategoryId:w[0].id,historyDate:e.historyDate||y(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||y(),analyticsEndDate:e.analyticsEndDate||y(),analyticsSort:e.analyticsSort||"quantity",businessEventDate:e.businessEventDate||y(),businessEventFormType:Xe({formOnly:!0}).some(([s])=>s===e.businessEventFormType)?e.businessEventFormType:"purchase",businessEventItemSource:["product","manual"].includes(e.businessEventItemSource)?e.businessEventItemSource:"manual",businessEventProductId:e.businessEventProductId||"",businessEventTypeFilter:e.businessEventTypeFilter||"all",editingBusinessEventId:e.editingBusinessEventId||null,inventoryLotType:lt().some(([s])=>s===e.inventoryLotType)?e.inventoryLotType:"dessert",inventoryLotItemSource:["product","manual"].includes(e.inventoryLotItemSource)?e.inventoryLotItemSource:"product",inventoryLotProductId:e.inventoryLotProductId||"",inventoryLotStatusFilter:["active","archived","all"].includes(e.inventoryLotStatusFilter)?e.inventoryLotStatusFilter:"active",salesSort:e.salesSort||"amount",notice:Hn(e.notice)}}function y(e=new Date){return R(e)}function R(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?new Date().toISOString().slice(0,10):new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function ne(e,t){const n=new Date(`${e}T00:00:00`);return n.setDate(n.getDate()+t),R(n)}function Wn(e=y()){return`${e.slice(0,7)}-01`}function bt(e=o.analyticsRange){const t=y();if(e==="yesterday"){const n=ne(t,-1);return{label:"昨日",startDate:n,endDate:n}}if(e==="seven-days")return{label:"近 7 天",startDate:ne(t,-6),endDate:t};if(e==="month")return{label:"本月",startDate:Wn(t),endDate:t};if(e==="custom"){const n=o.analyticsStartDate||t,a=o.analyticsEndDate||n;return{label:`${n} - ${a}`,startDate:n<=a?n:a,endDate:n<=a?a:n}}return{label:"今日",startDate:t,endDate:t}}function Gn(){return bt(o.analyticsRange)}function C(e){return new Date(e).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function $t(e,t=new Date){const n=new Date(e),a=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())||Number.isNaN(a.getTime())?0:Math.max(0,Math.floor((a.getTime()-n.getTime())/6e4))}function Jn(e,t){const n=new Date(`${e}T00:00:00`),a=new Date(`${t}T00:00:00`);return Number.isNaN(n.getTime())||Number.isNaN(a.getTime())?0:Math.floor((a.getTime()-n.getTime())/864e5)}function ue(e){return $t(e.createdAt,e.checkedOutAt||new Date)}function Pe(e){const t=Math.max(0,Math.floor(Number(e)||0));if(t<60)return`${t} 分`;const n=Math.floor(t/60),a=t%60;return a?`${n} 小時 ${a} 分`:`${n} 小時`}function ht(e){const t=R(e?.createdAt);return!t||t===y()?"":t===ne(y(),-1)?"昨天開單":`${t} 開單`}function Zn(e){return ht(e)||`已坐 ${Pe(ue(e))}`}function de(e){const t=ht(e);return t||(e.seatId===I?`已等 ${Pe(ue(e))}`:Zn(e))}function St(e){return`停留 ${Pe(ue(e))}`}function Kn(e){const t=ue(e);return t>=90?"stay-danger":t>=60?"stay-warning":""}function m(e){o=q({...o,...e});const t=F(o);return Q(),{storageSaveExecuted:t,renderAfterSaveExecuted:!0}}function v(e,t={}){console.warn(`[YUTU POS] ${e}`,t),o=q({...o,notice:e}),F(o),Q()}function Le(){return Y(o.selectedSeatId)}function It(){return k()?.items?.length??0}function j(e,t=!1){ft&&(o=q({...o,debug:{...o.debug,...e,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId,currentOpenOrderId:Le()?.id||"",ordersLength:o.orders.length,selectedOrderItemsLength:It(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),F(o),t&&Q())}function P(e,t={}){console.warn(`[YUTU POS] addProduct failed: ${e}`,t),j({addProductExecuted:!0,addProductFailureReason:e,...t})}function wt(e){return e===I?mt:o.seats.find(t=>t.id===e)}function A(e){const t=typeof e=="string"?e:e?.seatId;return wt(t)?.name||"未命名座位"}function _(e){return[e?.seatId,...Array.isArray(e?.linkedSeatIds)?e.linkedSeatIds:[]].filter(Boolean)}function N(e){return _(e).map(t=>A(t)).join("＋")||A(e)}function Xn(e){const t=typeof e=="string"?e:e?.seatId;return wt(t)?.icon||""}function U(e){return o.products.find(t=>t.id===e)}function Y(e){return o.orders.find(t=>t.status==="open"&&_(t).includes(e))}function B(e=y()){return o.dailyClosings.find(t=>t.date===e&&t.isOfficial===!0)||null}function W(e){return e.businessDate||R(e.paidAt||e.checkedOutAt||e.createdAt)}function xe(e,{includeVoided:t=!1}={}){return o.orders.filter(n=>!t&&n.status==="voided"?!1:W(n)===e)}function le(e){return o.orders.filter(t=>t.status==="paid"&&W(t)===e)}function kt(e){return o.businessEvents.filter(t=>t.date===e)}function qe(e){return _n[e]||e||"未記錄"}function ea(e){return e.reduce((t,n)=>{const a=n.paymentMethod||"unknown",s=t[a]||{method:a,label:qe(a),orderCount:0,amount:0};return s.orderCount+=1,s.amount+=D(n).total,t[a]=s,t},{})}function ta(e={}){return Object.values(e).sort((t,n)=>n.amount-t.amount||n.orderCount-t.orderCount)}function na(e){const n=[...xe(e)].sort((a,s)=>new Date(a.orderedAt||a.createdAt)-new Date(s.orderedAt||s.createdAt))[0];return n?.orderedAt||n?.createdAt||""}function aa(e){const n=[...le(e)].sort((a,s)=>new Date(s.paidAt||s.checkedOutAt)-new Date(a.paidAt||a.checkedOutAt))[0];return n?.paidAt||n?.checkedOutAt||""}function Dt(e=y()){return o.orders.filter(t=>t.status==="open"&&R(t.createdAt)===e)}function sa(e=y()){return xe(e,{includeVoided:!0}).length>0||kt(e).length>0}function At(e=y()){const t=B(e);return t?Ct(t)?{key:"outdated",label:"結帳後有異動"}:{key:"closed",label:"今日已結帳"}:{key:sa(e)?"open":"empty",label:"尚未結帳"}}function ra(e){const t=[...xe(e,{includeVoided:!0}).flatMap(n=>[n.updatedAt,n.correctedAt,n.voidedAt,n.createdAt,n.paidAt,n.checkedOutAt]),...kt(e).flatMap(n=>[n.updatedAt,n.createdAt])].filter(Boolean).map(n=>new Date(n).getTime()).filter(Number.isFinite);return t.length?new Date(Math.max(...t)).toISOString():""}function pe(e){const t=le(e),n=V(t),a=ea(t);return{...n,paymentSummary:a,customerSourceSummary:rt(t,{customerSourceLabels:at()}),businessEventSummary:nt(o.businessEvents,{startDate:e,endDate:e}),openOrderCount:Dt(e).length,firstOrderAt:na(e),lastOrderAt:aa(e),lateEntryCount:t.filter(s=>s.entryType==="late_entry").length,voidedOrderCount:o.orders.filter(s=>s.status==="voided"&&W(s)===e).length}}function Ct(e){if(!e)return!1;const t=ra(e.date);if(!t||!e.closedAt)return!1;if(new Date(t)>new Date(e.closedAt))return!0;const n=pe(e.date);return Number(e.orderCount)!==n.orderCount||Number(e.totalSales??e.revenue)!==n.revenue||Number(e.openOrderCount||0)!==n.openOrderCount}function Ot(e,t=B(e)){const n=pe(e),a=Number(t?.totalSales??t?.revenue)||0;return{previousOrderCount:Number(t?.orderCount)||0,nextOrderCount:n.orderCount,previousRevenue:a,nextRevenue:n.revenue,revenueDelta:n.revenue-a,lateEntryCount:n.lateEntryCount,voidedOrderCount:n.voidedOrderCount,paymentSummary:n.paymentSummary,businessEventSummary:n.businessEventSummary}}function k(){if(o.selectedOrderId){const e=o.orders.find(t=>t.id===o.selectedOrderId);if(e?.status==="open"||["paid","voided"].includes(e?.status)&&o.orderDetailMode==="history"||e&&o.activeView!=="floor")return e}return Y(o.selectedSeatId)||null}function M(e){return le(e)}function V(e){const t=e.reduce((n,a)=>{const s=D(a);return n.revenue+=s.total,n.cost+=s.cost,n.profit+=s.profit,n.knownCostRevenue+=s.knownCostRevenue,n.unknownCostRevenue+=s.unknownCostRevenue,n.unknownCostItems+=s.unknownCostItems,n.unknownCostQuantity+=s.unknownCostQuantity,n.drinks+=s.drinks,n.desserts+=s.desserts,n.retail+=s.retail,n.orderCount+=1,n},{revenue:0,cost:0,profit:0,knownCostRevenue:0,unknownCostRevenue:0,unknownCostItems:0,unknownCostQuantity:0,drinks:0,desserts:0,retail:0,orderCount:0,averageTicket:0});return t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function Re(e){const t=new Map;return M(e).forEach(n=>{n.items.forEach(a=>{const s=Number(a.effectivePrice??a.price)||0,r=T(a.cost),c=`${a.productId||a.name}-${a.name}-${s}-${r??"unknown"}`,i=t.get(c)||{name:a.name,category:Et(a.category),quantity:0,amount:0,cost:0,profit:0,unknownCostItems:0,unknownCostQuantity:0};i.quantity+=a.quantity,i.amount+=s*a.quantity,r===null?(i.unknownCostItems+=1,i.unknownCostQuantity+=a.quantity):(i.cost+=r*a.quantity,i.profit+=(s-r)*a.quantity),t.set(c,i)})}),[...t.values()].sort((n,a)=>o.salesSort==="quantity"&&a.quantity-n.quantity||a.amount-n.amount)}function Et(e){return w.find(t=>t.id===e)?.name||e}function oa(){return Object.fromEntries(w.map(e=>[e.id,e.name]))}function He(e){const t=w.findIndex(n=>n.id===e);return t===-1?w.length:t}function Qe(e){return o.products.filter(t=>t.category===e).reduce((t,n)=>Math.max(t,Number(n.sort)||0),0)+1}function ia(){return{...Object.fromEntries(o.seats.map(e=>[e.id,e.name])),[I]:mt.name}}function Me(){return[...o.products].sort((e,t)=>He(e.category)-He(t.category)||(Number(e.sort)||0)-(Number(t.sort)||0)||e.name.localeCompare(t.name,"zh-Hant"))}function ca(){return Me().filter(e=>e.category===o.selectedCategoryId)}function Tt(e){const t={drink:1,dessert:2,retail:3},n={冰:1,熱:2};return[...e].sort((a,s)=>{const r=(t[a.type]||9)-(t[s.type]||9);if(r!==0)return r;const c=a.name.localeCompare(s.name,"zh-Hant");return c!==0?c:(n[a.temperature]||9)-(n[s.temperature]||9)})}function G(e){const t=o.orders.find(r=>r.id===e.id),n=!!t,a=o.orders.map(r=>r.id===e.id?e:r),s=m({orders:a,selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:""});return j({replaceOrderExecuted:!0,replaceOrderMatched:n,beforeItemsLength:t?.items?.length??"",afterItemsLength:e.items?.length??"",storageSaveExecuted:s.storageSaveExecuted,renderAfterSaveExecuted:s.renderAfterSaveExecuted,selectedOrderItemsLength:e.items?.length??0},!0),{...s,replaced:n,afterItemsLength:e.items?.length??0}}function ua(e){const t=Y(e);if(t){m({selectedSeatId:e,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"});return}const n=Number(window.prompt("輸入人數","2"));if(!n||n<1)return;const a=Je({seatId:e,people:n});m({orders:[a,...o.orders],selectedSeatId:e,selectedOrderId:a.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function ae(e){return e.variantName?`${e.name}（${e.variantName}）`:e.name}function da(e){const t=Object.entries(e.variants||{});return t.length?`
    <details class="variant-details">
      <summary>${t.length} 種口味</summary>
      ${t.map(([n,a])=>`<span>${n} ${a}</span>`).join("")}
    </details>
  `:"-"}function se(e){return(Array.isArray(e.activityLog)?e.activityLog:[]).map(n=>`${n.type==="checkout"?"結帳":n.type==="undoCheckout"?"撤銷":n.type} ${C(n.at)}`).join("、")}function la(){const e=Je({seatId:I,people:1});m({orders:[e,...o.orders],selectedSeatId:I,selectedOrderId:e.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function pa(e){const t=o.orders.find(n=>n.id===e);t&&m({selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:t.status==="paid"?"history":"active",orderViewMode:"production"})}function Nt(e){return e.items.map(t=>`${t.requiresTemperature&&t.temperature?t.temperature:""}${ae(t)}×${t.quantity}`).join("、")}function ma(e,t="unknown"){try{j({clickedProductId:e||"",productClickSource:t,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const n=k(),a=U(e);if(j({productFound:!!a}),!a){P("product not found",{productId:e,source:t}),v("找不到商品資料，請到商品管理確認今日菜單。",{productId:e});return}if(a.active===!1){P("product inactive",{productId:e,productName:a.name,source:t}),v(`${a.name} 目前停售，無法加入訂單。`,{productId:e});return}if(!n){P("no open order",{productId:e,source:t,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId,currentOpenOrderId:Le()?.id||""}),v("請先選擇座位並新增訂單。",{productId:e,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId});return}if(n.status!=="open"){P("selected order is not open",{productId:e,source:t,orderId:n.id,status:n.status}),v("這張訂單已結帳，請先新增或編輯訂單。",{orderId:n.id,status:n.status});return}const s=Aa(a);if(s===null)return;const r=n.items.length,c=Yt(n,a,{variantName:s}),i=c.items[c.items.length-1],l=c.items.length;if(j({productFound:!0,addProductFailureReason:"",beforeItemsLength:r,afterItemsLength:l,newItemLineId:i?.lineId||"",selectedOrderItemsLengthBefore:r}),l!==r+1){P("item length did not increase",{beforeItemsLength:r,afterItemsLength:l,lineId:i?.lineId}),v("商品加入失敗：訂單品項數沒有增加。");return}G(c)}catch(n){const a=n instanceof Error?`${n.name}: ${n.message}`:String(n);P(a,{productId:e,source:t}),v(`商品加入失敗：${a}`)}}function Pt(e,t,n=null){const a=n?.currentTarget||n?.target?.closest?.("button"),s=a?.getAttribute?.("data-product-id")||a?.dataset?.id||"",r=e||s;if(console.log("[YUTU POS] product click",{id:r,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId}),j({clickedProductId:r||"",productClickSource:t,eventTargetTag:n?.target?.tagName||"",closestButtonFound:!!a,closestButtonAction:a?.dataset?.action||"",datasetId:a?.dataset?.id||"",productDatasetId:a?.getAttribute?.("data-product-id")||"",productFound:!!U(r),addProductExecuted:!1,addProductFailureReason:""}),!r){P("missing product id from click event",{source:t}),v("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),Q();return}ma(r,t)}function K(e,t){const n=k();!n||n.status!=="open"||G(Wt(n,e,t))}function ze(e){const t=k();!t||t.status!=="open"||window.confirm("確定刪除此品項嗎？")&&G(Gt(t,e))}function Ye(e){const t=k();!t||t.status!=="open"||G({...t,...e})}function me(e,t=""){return o.orders.some(n=>n.status==="open"&&n.id!==t&&_(n).includes(e))}function ya(){const e=k();if(!e||e.status!=="open"||e.items.length===0)return;const t=D(e);if(!window.confirm(["確定要完成結帳嗎？","",`座位 / 外帶：${A(e)}`,`人數：${e.people}`,`總金額：${p.format(t.total)}`,`品項：${Nt(e)}`].join(`
`)))return;const a=Jt(e,"cash");G({...a,businessDate:y(new Date(a.checkedOutAt)),paidAt:a.checkedOutAt,fulfillmentStatus:"completed",updatedAt:a.checkedOutAt}),m({selectedOrderId:null,activeView:"floor",historyDate:y()})}function Lt(){return[...o.orders].filter(e=>e.status==="paid"&&e.checkedOutAt).sort((e,t)=>new Date(t.checkedOutAt)-new Date(e.checkedOutAt))[0]}function xt(e){return!!(e?.status==="paid"&&e.checkedOutAt&&$t(e.checkedOutAt,new Date)<=jn)}function qt(e){const t=o.orders.find(r=>r.id===e);if(!t){v("找不到要撤銷的結帳訂單。");return}if(!xt(t)){v("此筆結帳已超過 5 分鐘，無法撤銷。");return}if(B(W(t))){v("此營業日已完成今日結帳，請使用修正或作廢流程，不可直接撤銷結帳。");return}if(t.seatId!==I){const r=_(t).find(c=>me(c,t.id));if(r){v(`${A(r)} 已有進行中的訂單，無法撤銷。`);return}}const n=D(t);if(!window.confirm(["確定要撤銷這筆結帳嗎？","",`座位 / 外帶：${N(t)}`,`結帳時間：${C(t.checkedOutAt)}`,`金額：${p.format(n.total)}`,`原付款方式：${qe(t.paymentMethod)}`,"撤銷後會回到可編輯狀態。"].join(`
`)))return;const s=new Date().toISOString();m({orders:o.orders.map(r=>r.id===t.id?{...r,status:"open",paymentMethod:null,checkedOutAt:null,paidAt:null,updatedAt:s,activityLog:[...Array.isArray(r.activityLog)?r.activityLog:[],{type:"undoCheckout",at:s}]}:r),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production",historyDate:y(),notice:`已撤銷 ${N(t)} 的結帳。`})}function fa(){const e=Lt();if(!e){v("目前沒有可撤銷的已結帳訂單。");return}qt(e.id)}function va(){const e=k();!e||e.status!=="open"||e.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||m({orders:o.orders.filter(t=>t.id!==e.id),selectedOrderId:null,activeView:"floor"})}function ga(e){const t=o.orders.find(d=>d.id===e);if(!t||t.status!=="paid")return;const n=window.prompt("請輸入修正原因（必填）：",t.correctionReason||"");if(!n?.trim()){v("修正原因必填。");return}const a=window.prompt("付款方式：cash 或 electronic",t.paymentMethod||"cash");if(a===null)return;const s=a.trim()==="electronic"?"electronic":"cash",r=we().map(([d,b])=>`${d} = ${b}`).join(`
`),c=window.prompt(`客源來源：
${r}`,O(t.customerSource));if(c===null)return;const i=O(c.trim()),l=window.prompt("客源備註（可空白）：",t.customerSourceNote||"");if(l===null)return;const u=window.prompt("訂單備註（可空白）：",t.orderNote||"");if(u===null)return;const f=window.prompt("用餐方式：內用 或 外帶",t.seatId===I?"外帶":"內用");if(f===null)return;const h=f.trim()==="外帶"?"外帶":"內用",g=new Date().toISOString();m({orders:o.orders.map(d=>d.id===t.id?{...d,paymentMethod:s,customerSource:i,customerSourceNote:l.trim(),orderNote:u.trim(),correctionReason:n.trim(),correctedAt:g,updatedAt:g,items:d.items.map(b=>({...b,serviceType:b.requiresServiceType===!1?b.serviceType:h}))}:d),selectedOrderId:t.id,activeView:"history",notice:"已修正訂單資訊。若該日已結帳，請重新完成今日結帳。"})}function ba(e){const t=o.orders.find(s=>s.id===e);if(!t||t.status!=="paid")return;const n=window.prompt("請輸入作廢原因（必填）。Void ≠ Refund，本系統不會處理退款：","");if(!n?.trim()){v("作廢原因必填。");return}const a=new Date().toISOString();m({orders:o.orders.map(s=>s.id===e?{...s,status:"voided",previousStatus:s.status,voidedAt:a,voidReason:n.trim(),updatedAt:a}:s),selectedOrderId:o.selectedOrderId===e?null:o.selectedOrderId,activeView:"history",notice:"訂單已作廢。Void 不代表退款；若該日已結帳，請重新完成今日結帳。"})}function $a(){const e=document.querySelector("#late-entry-form");if(!e)return;const t=new FormData(e),n=String(t.get("businessDate")||y()),a=String(t.get("approximateTime")||"12:00"),s=U(String(t.get("productId")||"")),r=Math.max(1,Math.trunc(Number(t.get("quantity"))||1)),c=Number(t.get("receivedAmount"))||0,i=String(t.get("correctionReason")||"").trim(),l=String(t.get("note")||"").trim(),u=String(t.get("serviceType")||"外帶")==="內用"?"內用":"外帶",f=O(String(t.get("customerSource")||"not_asked")),h=String(t.get("paymentMethod")||"cash")==="electronic"?"electronic":"cash";if(!s){v("補登訂單請選擇商品。");return}if(c<=0){v("補登訂單請填寫實際收款金額。");return}if(!i){v("補單原因必填。");return}const g=new Date(`${n}T${a||"12:00"}:00`).toISOString(),d=new Date().toISOString(),b=c/r,E=T(s.cost),$={id:`YT-LATE-${n.replace(/-/g,"")}-${String(Date.now()).slice(-5)}`,createdAt:d,orderedAt:g,paidAt:g,checkedOutAt:g,businessDate:n,seatId:u==="外帶"?I:"",seatSnapshot:u,people:1,items:[{lineId:`late-line-${Date.now()}`,productId:s.id,name:s.name,variantName:"",category:s.category,type:s.type,quantity:r,requiresTemperature:s.requiresTemperature??s.type==="drink",requiresServiceType:s.requiresServiceType??s.type!=="retail",supportsHot:s.supportsHot,supportsIce:s.supportsIce,temperature:s.type==="drink"?"熱":"",serviceType:u,basePrice:b,effectivePrice:b,iceExtraPrice:Number(s.iceExtraPrice)||0,iceExtra:0,price:b,cost:E,profit:E===null?null:b-E,served:!0,note:l}],activityLog:[{type:"lateEntry",at:d,reason:i}],status:"paid",fulfillmentStatus:"completed",entryType:"late_entry",paymentMethod:h,customerSource:f,customerSourceNote:"",correctionReason:i,correctedAt:d,updatedAt:d,orderNote:l,voidedAt:null,voidReason:"",previousStatus:null};Jn(n,y())>7&&window.alert("你正在補登較早日期的交易。此操作會改變該日營收與分析結果。"),m({orders:[$,...o.orders],activeView:"daily-closing",historyDate:n,notice:"已補登歷史完成訂單。若該日已結帳，請重新完成今日結帳。"})}function ha(){const e=document.querySelector(".product-form"),t=e?.dataset?.editing?U(e.dataset.editing):null,n=ce(t?.variants),a=document.querySelector("#product-category").value,s=document.querySelector("#product-type").value,r=!!(t&&t.category!==a),c=document.querySelector("#product-variants").value.split(/[\n,，、]/).map(i=>i.trim()).filter(Boolean);return{name:document.querySelector("#product-name").value.trim(),category:a,type:s,price:Number(document.querySelector("#product-price").value),cost:$e(document.querySelector("#product-cost").value),supportsHot:s==="drink"&&document.querySelector("#product-supports-hot").checked,supportsIce:s==="drink"&&document.querySelector("#product-supports-ice").checked,supportsTakeout:t?.supportsTakeout??s!=="retail",iceExtraPrice:s==="drink"&&Number(document.querySelector("#product-ice-extra-price").value)||0,sort:t&&!r&&Number(t.sort)||Qe(a),note:document.querySelector("#product-note").value.trim(),variants:c.map(i=>n.find(l=>l.name===i)||i),active:document.querySelector("#product-active").checked}}function Sa(e=null){const t=ha(),n=String(document.querySelector("#product-price")?.value??"").trim();if(!t.name||n===""||Number.isNaN(t.price)||t.price<0){window.alert("請輸入品名與有效售價。成本可留空代表未知。");return}if(e){m({products:o.products.map(a=>a.id===e?{...a,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}:a)});return}m({products:[...o.products,{id:`custom-${Date.now()}`,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}]})}function Rt(e,t=[],{emptyOnly:n=!1,exceptOrderId:a=""}={}){const s=o.seats.filter(u=>!t.includes(u.id)&&(!n||!me(u.id,a)));if(!s.length)return v("目前沒有可選的空桌。"),null;const r=s.map((u,f)=>`${f+1}. ${u.name}`).join(`
`),c=window.prompt(`${e}
${r}`,"1");if(c===null)return null;const i=Number(c)-1;if(Number.isInteger(i)&&s[i])return s[i];const l=c.trim();return s.find(u=>u.name===l||u.id===l)||null}function Ia(){const e=k();if(!e||e.seatId===I)return;const t=Rt("選擇要換到哪一桌：",_(e),{emptyOnly:!0,exceptOrderId:e.id});if(t){if(me(t.id,e.id)){v("目標桌位已有進行中的訂單，無法換桌。");return}window.confirm(`確定將主桌 ${A(e)} 換到 ${t.name} 嗎？關聯桌位會保持不變。`)&&m({orders:o.orders.map(n=>n.id===e.id?{...n,seatId:t.id}:n),selectedSeatId:t.id,selectedOrderId:e.id,activeView:"floor",notice:`已將 ${A(e)} 換到 ${t.name}。`})}}function wa(){const e=k();if(!e||e.seatId===I)return;const t=_(e),n=Rt("選擇新增使用桌位：",t,{emptyOnly:!0,exceptOrderId:e.id});if(n){if(me(n.id,e.id)){v("此桌已有進行中的訂單，不能加入桌位群組。");return}window.confirm(`將 ${n.name} 加入 ${N(e)} 的使用桌位嗎？`)&&m({orders:o.orders.map(a=>a.id===e.id?{...a,linkedSeatIds:[...new Set([...a.linkedSeatIds||[],n.id])]}:a),selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:`${n.name} 已加入 ${N(e)}。`})}}function ka(e){const t=k();!t||!t.linkedSeatIds?.includes(e)||m({orders:o.orders.map(n=>n.id===t.id?{...n,linkedSeatIds:n.linkedSeatIds.filter(a=>a!==e)}:n),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",notice:`${A(e)} 已從桌位群組移除。`})}function Da(e){m({products:o.products.map(t=>t.id===e?{...t,active:!t.active}:t)})}function We(e){const t=e?U(e):null;m({activeView:"products",editingProductId:e||null,selectedCategoryId:t?.category||o.selectedCategoryId})}function H(e,t){try{const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),a=URL.createObjectURL(n),s=document.createElement("a");return s.href=a,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(a),!0}catch(n){return console.warn("[YUTU POS] JSON download failed.",n),!1}}function ye(e=new Date){const t=R(e),n=`${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`;return`${t}-${n}`}function Aa(e){const t=X(e,{activeOnly:!0});if(!t.length)return"";const n=[`選擇 ${e.name} 口味 / 規格：`,...t.map((c,i)=>`${i+1}. ${c}`)].join(`
`),a=window.prompt(n,"1");if(a===null)return null;const s=Number(a)-1;if(Number.isInteger(s)&&t[s])return t[s];const r=a.trim();return t.includes(r)?r:(window.alert("找不到這個口味 / 規格，請重新點選商品。"),null)}function Ca(e=o){return{selectedSeatId:e.selectedSeatId||L[0].id,selectedCategoryId:e.selectedCategoryId||w[0].id,selectedOrderId:e.selectedOrderId||null,orderDetailMode:e.orderDetailMode||"active",orderViewMode:e.orderViewMode||"production",activeView:e.activeView||"floor",historyDate:e.historyDate||y(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||y(),analyticsEndDate:e.analyticsEndDate||y(),analyticsSort:e.analyticsSort||"quantity",salesSort:e.salesSort||"amount"}}function fe(e=y(),t=new Date().toISOString(),n="",a=1){le(e);const s=pe(e),r=B(e),c=Ot(e,r);return{id:`closing-${e}-${t.replace(/[:.]/g,"-")}`,date:e,businessDate:e,closedAt:t,version:a,status:"official",isOfficial:!0,supersededBy:null,supersedesId:r?.id||null,supersededAt:null,orderCount:s.orderCount,totalSales:s.revenue,revenue:s.revenue,totalCost:s.cost,grossProfit:s.profit,grossMargin:s.revenue?s.profit/s.revenue:0,knownCostRevenue:s.knownCostRevenue,knownGrossMargin:s.knownCostRevenue?s.profit/s.knownCostRevenue:0,unknownCostRevenue:s.unknownCostRevenue,unknownCostItems:s.unknownCostItems,unknownCostQuantity:s.unknownCostQuantity,paymentSummary:s.paymentSummary,customerSourceSummary:s.customerSourceSummary,businessEventSummary:s.businessEventSummary,openOrderCount:s.openOrderCount,snapshotVersion:1,changeSummary:r?c:null,drinkCount:s.drinks,dessertCount:s.desserts,retailCount:s.retail,exported:!0,backupStatus:"pending",backupDownloadedAt:null,exportedAt:t,createdAt:t,note:n}}function Ve(e,t=o.dailyClosings,n=e.closedAt){return[e,...t.map(a=>a.date!==e.date||a.isOfficial!==!0?a:{...a,status:"superseded",isOfficial:!1,supersededBy:e.id,supersededAt:n})]}function ve(){return{schemaVersion:Ee,app:Te,exportType:"full",exportedAt:new Date().toISOString(),storageKey:Oe,orders:o.orders,products:o.products,seats:o.seats,dailyClosings:o.dailyClosings,businessEvents:o.businessEvents,inventoryLots:o.inventoryLots,inventoryItems:o.inventoryItems,inventoryMovements:o.inventoryMovements,settings:Ca()}}function Oa(){H(`yutu-pos-backup-${ye()}.json`,ve())}function Ea(e=""){const t=H(`yutu-pos-backup-${ye()}.json`,ve());return m(e?{dailyClosings:o.dailyClosings.map(n=>n.id===e?{...n,backupStatus:t?"downloaded":"pending",backupDownloadedAt:t?new Date().toISOString():n.backupDownloadedAt||null}:n),notice:t?"完整備份已重新下載。":"備份尚未成功下載，請稍後再試。"}:{notice:t?"完整備份已下載。":"備份尚未成功下載，請稍後再試。"}),t}function Ta(e=y()){const t=M(e);return{schemaVersion:Ee,app:Te,exportType:"daily",date:e,exportedAt:new Date().toISOString(),dailySummary:V(t),productSalesSummary:Re(e),orders:t,productsSnapshot:o.products}}function Na(e=y(),t=null,n=new Date().toISOString()){const a=M(e);return{schemaVersion:Ee,app:Te,exportType:"daily-archive",date:e,exportedAt:n,dailySummary:V(a),productSalesSummary:Re(e),orders:a,productsSnapshot:o.products,dailyClosing:t||fe(e,n)}}function Mt(e=y()){H(`yutu-pos-daily-${e}.json`,Ta(e))}function Pa(){Mt(y())}function La(){if(o.orders.filter(r=>r.status==="open").length&&!window.confirm("目前仍有未結帳訂單，是否仍要匯出今日報表？"))return;const t=y(),n=new Date().toISOString(),a=o.dailyClosings.filter(r=>r.date===t).length+1,s=fe(t,n,"",a);m({dailyClosings:Ve(s,o.dailyClosings,n)}),H(`yutu-pos-daily-archive-${t}.json`,Na(t,s,n))}function xa(){const e=o.orders.filter(d=>d.status==="open");if(e.length){v(`仍有 ${e.length} 筆未結帳訂單，請先完成結帳或取消訂單後再完成今日結帳。`);return}const t=y(),n=M(t),a=V(n),s=o.businessEvents.filter(d=>d.date===t),r=n.filter(d=>d.paymentMethod==="cash").reduce((d,b)=>d+D(b).total,0),c=n.filter(d=>d.paymentMethod&&d.paymentMethod!=="cash").reduce((d,b)=>d+D(b).total,0);if(!window.confirm(["確認今日營業資料並完成今日結帳？","",`今日營收：${p.format(a.revenue)}`,`訂單數：${a.orderCount}`,`現金收入：${p.format(r)}`,`電子支付：${p.format(c)}`,`今日 Business Events：${s.length} 筆`,"","完成後會建立 DailyClosing，並下載完整 Full Backup。"].join(`
`)))return;const l=new Date().toISOString(),u=o.dailyClosings.filter(d=>d.date===t).length+1,f=fe(t,l,"",u),h=Ve(f,o.dailyClosings,l);o=q({...o,dailyClosings:h,activeView:"daily-closing",notice:"今日已結帳，正在下載完整備份。"}),F(o);const g=H(`yutu-pos-backup-${ye(new Date(l))}.json`,ve());m({dailyClosings:o.dailyClosings.map(d=>d.id===f.id?{...d,backupStatus:g?"downloaded":"pending",backupDownloadedAt:g?new Date().toISOString():null}:d),activeView:"daily-closing",notice:g?"今日已結帳，完整備份已下載。":"今日已結帳，但備份尚未成功下載。請重新下載完整備份。"})}function qa(e=y()){const t=B(e);if(!t){v("此日期尚無 official DailyClosing，請先完成今日結帳。");return}const n=Ot(e,t);if(!window.confirm([`重新完成 ${e} 今日結帳？`,"",`原訂單數：${n.previousOrderCount}`,`新訂單數：${n.nextOrderCount}`,`原營收：${p.format(n.previousRevenue)}`,`新營收：${p.format(n.nextRevenue)}`,`營收差額：${p.format(n.revenueDelta)}`,`補登訂單：${n.lateEntryCount}`,`作廢訂單：${n.voidedOrderCount}`,"","舊 official 會改為 superseded，並保留歷史版本。"].join(`
`)))return;const s=new Date().toISOString(),r=o.dailyClosings.filter(u=>u.date===e).length+1,c=fe(e,s,"regenerated",r),i=Ve(c,o.dailyClosings,s);o=q({...o,dailyClosings:i,activeView:"daily-closing",notice:"已重新完成今日結帳，正在下載完整備份。"}),F(o);const l=H(`yutu-pos-backup-${ye(new Date(s))}.json`,ve());m({dailyClosings:o.dailyClosings.map(u=>u.id===c.id?{...u,backupStatus:l?"downloaded":"pending",backupDownloadedAt:l?new Date().toISOString():null}:u),activeView:"daily-closing",notice:l?"已重新完成今日結帳，完整備份已下載。":"已重新完成今日結帳，但備份尚未成功下載。"})}function Ra(e){const t=e?.exportType==="full"?{...e.settings||{},orders:e.orders,products:e.products||e.menuItems,menuItems:e.products||e.menuItems,seats:e.seats||L,dailyClosings:e.dailyClosings||[],businessEvents:e.businessEvents||[],inventoryLots:e.inventoryLots||[],inventoryItems:e.inventoryItems||[],inventoryMovements:e.inventoryMovements||[]}:e?.state||e;if(!t||typeof t!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(e?.exportType&&e.exportType!=="full")throw new Error("此檔案不是完整備份，請選擇匯出全部資料的 JSON。");if(!Array.isArray(t.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(t.products)&&!Array.isArray(t.menuItems))throw new Error("備份缺少 products 陣列。");return q(t)}function Ma(e){if(!e||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const t=new FileReader;t.onload=()=>{try{const n=JSON.parse(String(t.result||""));if(o=Ra(n),!F(o))throw new Error("localStorage 寫入失敗。");Q(),window.alert("備份已匯入。")}catch(n){const a=n instanceof Error?n.message:String(n);v(`匯入失敗：${a}`)}},t.onerror=()=>v("匯入失敗：無法讀取檔案。"),t.readAsText(e,"utf-8")}function Va(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&m({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function ja(){const e=V(M(y()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${p.format(e.revenue)}</strong></article>
      <article><span>今日已知毛利</span><strong>${p.format(e.profit)}</strong></article>
      <article><span>未知成本品項</span><strong>${e.unknownCostQuantity}</strong></article>
      <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
      <article><span>甜品數</span><strong>${e.desserts}</strong></article>
    </section>
  `}function Vt(){return o.orders.filter(e=>e.status==="open").sort((e,t)=>new Date(e.createdAt)-new Date(t.createdAt))}function je(e){return(e.items||[]).filter(t=>!t.served)}function jt(e){return e.items?.length>0&&je(e).length===0}function Fe(e){if(!e)return{key:"empty",label:"空位",hint:"可入座"};if(!e.items?.length)return{key:"ordering",label:"點餐中",hint:"加入品項"};const t=je(e).length;return t===e.items.length?{key:"waiting",label:"等待製作",hint:`${t} 項待出`}:jt(e)?{key:"ready",label:"可結帳",hint:"前往收款"}:{key:"making",label:"製作中",hint:`${t} 項待出`}}function Fa(){const e=Vt(),t=e.reduce((s,r)=>s+je(r).length,0),n=e.filter(jt).length,a=o.seats.filter(s=>!Y(s.id)).length;return{openOrders:e,pendingItems:t,readyOrders:n,emptySeats:a}}function _a(e){const t=w.findIndex(n=>n.id===e.category);if(t>=0){const n=w[t];return{key:n.id,label:n.name,order:t+1}}return{key:e.type||"other",label:te[e.type]||"其他",order:8}}function Ua(e){const t=(e.items||[]).reduce((n,a)=>{const s=Number(a.quantity)||0;return a.type==="drink"&&(n.drinks+=s),a.type==="dessert"&&(n.desserts+=s),a.type==="retail"&&(n.retail+=s),n},{drinks:0,desserts:0,retail:0});return[t.drinks?`飲品 ${t.drinks}`:"",t.desserts?`甜點 ${t.desserts}`:"",t.retail?`熟豆 ${t.retail}`:""].filter(Boolean).join("｜")||"尚無品項"}function Ba(){const e=Fa();return`
    <section class="workspace-status-block" aria-label="今日狀態">
      <div class="workspace-status-title">
        <h3>今日狀態</h3>
        <span>一眼確認空位、待出品與可結帳桌</span>
      </div>
      <div class="workspace-status">
        <article><span>空位</span><strong>${e.emptySeats}</strong></article>
        <article><span>進行中</span><strong>${e.openOrders.length}</strong></article>
        <article><span>待出品</span><strong>${e.pendingItems}</strong></article>
        <article><span>可結帳</span><strong>${e.readyOrders}</strong></article>
      </div>
    </section>
  `}function Ha(){return`
    <nav class="workspace-nav" aria-label="主要功能">
      ${[{title:"營業",items:[{action:"floor",label:"POS 工作台"},{action:"history",label:"訂單歷史"},{action:"daily-closing",label:"今日結帳"}]},{title:"紀錄與庫存",items:[{action:"business-events",label:"營運事件"},{action:"inventory-lots",label:"庫存現況"}]},{title:"管理與分析",items:[{action:"products",label:"商品"},{action:"analytics",label:"經營分析"}]},{title:"系統",items:[{action:"backup",label:"資料與設定"}]}].map(t=>`
            <div class="nav-group">
              <span>${t.title}</span>
              <div>
                ${t.items.map(n=>`
                      <button class="ghost ${o.activeView===n.action?"active":""}" data-action="${n.action}">${n.label}</button>
                    `).join("")}
              </div>
            </div>
          `).join("")}
    </nav>
  `}function Qa(){return`
    <section class="floor-block store-state-block">
      <div class="floor-subtitle">
        <div>
          <h3>桌位狀態</h3>
          <p>空位、製作中與可結帳桌一眼確認</p>
        </div>
      </div>
      <div class="seat-grid">
        ${o.seats.map(e=>{const t=Y(e.id),n=t?D(t):null,a=Fe(t),s=t?Kn(t):"";return`
              <button class="seat ${t?"occupied":""} status-${a.key} ${s} ${e.id===o.selectedSeatId?"selected":""}" data-action="seat" data-id="${e.id}">
                <span class="seat-top"><span class="seat-name">${e.name}</span><span class="seat-status">${a.label}</span></span>
                ${t?`<span class="seat-meta">${t.people}人</span>
                       <span class="seat-stay">開單 ${C(t.createdAt)} · ${de(t)}</span>
                       <strong class="seat-total">${p.format(n.total)}</strong>`:'<span class="seat-meta">空位</span><span class="seat-stay"></span><strong class="seat-total subtle">開始</strong>'}
              </button>
            `}).join("")}
      </div>
    </section>
  `}function za(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${w.map(e=>`
              <button class="${e.id===o.selectedCategoryId?"active":""}" data-action="category" data-id="${e.id}">
                ${e.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${ca().map(e=>`
              <button class="product ${e.active?"":"inactive"}" data-action="product" data-id="${e.id}" data-product-id="${e.id}" ${e.active?"":"disabled"}>
                <span>${e.name}</span>
                <strong>${p.format(e.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function Ya(e,t){if(!e.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let n="";return Tt(e.items).map(a=>{const s=t,r=a.requiresTemperature??a.type==="drink",c=a.requiresServiceType??a.type!=="retail",i=[a.supportsHot!==!1?"熱":"",a.supportsIce!==!1?"冰":""].filter(Boolean),l=[r&&a.temperature?a.temperature:"",c&&a.serviceType?a.serviceType:""].filter(Boolean),u=Number(a.effectivePrice??a.price)||0,f=u*a.quantity,h=a.type!==n?`<div class="line-group">${te[a.type]||"其他"}</div>`:"";return n=a.type,`
        ${h}
        <article class="line ${a.served?"served":""}">
          <div class="line-title">
            <strong>${ae(a)}</strong>
            <span>${p.format(f)}</span>
          </div>
          <div class="line-meta">
            <span>${l.join("｜")||"一般"}</span>
            <span>×${a.quantity}</span>
            ${a.iceExtra?`<span>冰飲 +${p.format(a.iceExtra)}</span>`:""}
          </div>
          ${s?`<div class="line-readonly">
                  <span>數量 ${a.quantity}</span>
                  ${l.map(g=>`<span>${g}</span>`).join("")}
                  <span>單價 ${p.format(u)}</span>
                  ${a.iceExtra?`<span>冰飲加價 ${p.format(a.iceExtra)}</span>`:""}
                  <span>小計 ${p.format(f)}</span>
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
                  ${r?`<section class="line-section">
                          <span class="line-section-label">溫度</span>
                          <div class="segmented-control">
                            ${i.map(g=>`<button class="${a.temperature===g?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="${g}">${g}</button>`).join("")}
                          </div>
                        </section>`:""}
                  ${c?`<section class="line-section">
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
      `}).join("")}function Wa(e){return e.type==="drink"?`${e.temperature||""}${ae(e)}`:ae(e)}function Ga(e){const t=new Map;return Tt(e.items).forEach(n=>{const a=_a(n).label,s=Wa(n),r=t.get(a)||[];r.push({...n,group:a,label:s}),t.set(a,r)}),Object.fromEntries(t)}function Ja(e){const t=Ga(e),n=["paid","voided"].includes(e.status),a=[...w.map(s=>s.name),"其他"];return`
    <section class="production-list">
      <header>
        <strong>${A(e)}｜${e.people}人｜${de(e)}</strong>
        <span>依工作順序出品，已完成項目會淡化。</span>
      </header>
      ${a.filter(s=>t[s]?.length).map(s=>`
              <section class="production-group">
                <h3>${s}</h3>
                <ul>
                  ${t[s].map(r=>`
                        <li>
                          <button class="production-item ${r.served?"served":""}" data-action="served" data-id="${r.lineId}" ${n?"disabled":""}>
                            <span class="production-check">${r.served?"✓":""}</span>
                            <span class="production-name">
                              <strong>${r.label}${r.quantity>1?` ×${r.quantity}`:""}</strong>
                              <small>${[r.serviceType,A(e)].filter(Boolean).join(" · ")}</small>
                              ${r.note?`<small>${S(r.note)}</small>`:""}
                            </span>
                            ${r.served?'<span class="production-status">已出</span>':""}
                          </button>
                        </li>
                      `).join("")}
                </ul>
              </section>
            `).join("")||'<div class="empty-note">尚無品項</div>'}
    </section>
  `}function Za(e,t){const n=O(e.customerSource),a=e.customerSourceNote||"",s=S(a);return t?`
      <section class="customer-source-panel readonly">
        <span>Customer source</span>
        <strong>${oe(n)}</strong>
        ${a?`<small>${s}</small>`:""}
      </section>
    `:`
    <section class="customer-source-panel">
      <label>
        Customer source
        <select data-action="customer-source" data-id="${e.id}">
          ${we().map(([r,c])=>`<option value="${r}" ${n===r?"selected":""}>${c}</option>`).join("")}
        </select>
      </label>
      ${st(n)?`<label>
              Note
              <input value="${s}" placeholder="Optional" data-action="customer-source-note" data-id="${e.id}" />
            </label>`:""}
    </section>
  `}function Ka(e,t){const n=O(e.customerSource);return`
    <details class="order-info-panel">
      <summary>
        <span>訂單資訊</span>
        <small>客源：${oe(n)}</small>
      </summary>
      ${Za(e,t)}
    </details>
  `}function Xa(){const e=Vt(),t=Math.min(e.length,6);return`
    <section class="order-queue" aria-label="Order Queue">
      <div class="queue-head">
        <div>
          <span>Order Queue</span>
          <h2>來客順序</h2>
        </div>
        <div class="queue-head-actions">
          <small>${e.length} 組進行中</small>
          <button class="ghost" data-action="new-takeout">新增外帶</button>
        </div>
      </div>
      <div class="queue-list">
        ${e.length?e.map((n,a)=>{const s=Fe(n),r=n.id===o.selectedOrderId;return`
                    <button class="queue-order status-${s.key} ${r?"selected":""}" data-action="select-order" data-id="${n.id}">
                      <span class="queue-order-index">${a+1}</span>
                      <div>
                        <span class="queue-order-row"><strong>${N(n)}</strong><em>${s.label}</em></span>
                        <small>${n.people}人 · ${Ua(n)}</small>
                        <small class="queue-time">開單 ${C(n.createdAt)} · ${de(n)}</small>
                      </div>
                    </button>
                  `}).join(""):'<div class="empty-note">目前沒有進行中的訂單</div>'}
      </div>
      ${e.length>t?`<p class="queue-more">另有 ${e.length-t} 組，向下捲動查看</p>`:""}
    </section>
  `}function es(){const e=k();if(!e)return'<aside class="order-panel empty"><span>尚未選擇訂單</span><strong>點選座位、外帶訂單或 Order Queue 開始處理。</strong></aside>';const t=D(e),n=e.status==="paid",a=n&&o.orderDetailMode==="history",s=o.orderViewMode==="production",r=Fe(e),c=(e.linkedSeatIds||[]).map(i=>({id:i,name:A(i)}));return n&&!e.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:e.id,status:e.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${Xn(e)} ${N(e)} · ${r.label}</span>
          <strong>${e.people}人 · 開單 ${C(e.createdAt)}</strong>
          ${n?`<span>${e.status==="voided"?"已作廢":"結帳"} ${C(e.paidAt||e.checkedOutAt||e.voidedAt)} · ${St(e)} · ${qe(e.paymentMethod)}</span>`:`<span>${de(e)}</span>`}
          ${n&&se(e)?`<span>${se(e)}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      ${Ka(e,n)}
      ${!n&&e.seatId!==I?`<details class="order-actions-panel">
              <summary>
                <span>桌位操作</span>
                ${c.length?`<small>已加 ${c.length} 桌</small>`:"<small>換桌 / 新增使用桌位</small>"}
              </summary>
              ${c.length?`<small>使用桌位：${c.map(i=>i.name).join("、")}</small>`:""}
              <div>
                <button class="secondary" data-action="move-table">換桌</button>
                <button class="secondary" data-action="add-linked-seat">新增使用桌位</button>
              </div>
              ${c.length?`<div class="linked-seat-list">
                      ${c.map(i=>`<button class="ghost" data-action="remove-linked-seat" data-id="${i.id}">移除 ${i.name}</button>`).join("")}
                    </div>`:""}
            </details>`:""}
      <section class="order-operation-panel">
        <span>訂單操作</span>
        <div class="order-view-toggle">
          <button class="${s?"active":""}" data-action="order-view" data-value="production">出品清單</button>
          <button class="${s?"":"active"}" data-action="order-view" data-value="edit">編輯訂單</button>
        </div>
      </section>
      <div class="line-list">${s?Ja(e):Ya(e,n)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${p.format(t.total)}</strong></div>
        <div><span>${s?"下一步":"已知毛利"}</span><strong>${s?r.hint:p.format(t.profit)}</strong></div>
        ${n?e.status==="voided"?'<button class="paid" disabled>已作廢 · Void ≠ Refund</button>':a?'<button class="paid" disabled>已結帳 · 現金</button>':`<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${e.id}">修正資訊</button>
                 <button class="secondary danger-action" data-action="void-order" data-id="${e.id}">作廢訂單</button>`:`<button class="primary" data-action="checkout" ${e.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function ts(){const e=o.editingProductId?U(o.editingProductId):null,t=Ne({category:o.selectedCategoryId}),n=e||{name:"",category:o.selectedCategoryId,type:t.type,price:"",cost:"",supportsHot:t.supportsHot,supportsIce:t.supportsIce,iceExtraPrice:t.iceExtraPrice,active:!0,note:"",variants:[]};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${e?.id||""}">
        <label>品名<input id="product-name" value="${n.name}" /></label>
        <label>類別<select id="product-category">${w.map(a=>`<option value="${a.id}" ${a.id===n.category?"selected":""}>${a.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(te).map(([a,s])=>`<option value="${a}" ${a===n.type?"selected":""}>${s}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${n.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${n.cost??""}" placeholder="留空代表未知" /></label>
        <label>冰飲加價<input id="product-ice-extra-price" type="number" step="1" value="${Number(n.iceExtraPrice)||0}" /></label>
        <label class="check-row"><input id="product-supports-hot" type="checkbox" ${n.supportsHot!==!1?"checked":""} /> 可做熱飲</label>
        <label class="check-row"><input id="product-supports-ice" type="checkbox" ${n.supportsIce!==!1?"checked":""} /> 可做冰飲</label>
        <label class="wide">口味 / 規格<textarea id="product-variants" placeholder="焙茶、伯爵">${X(n).join(`
`)}</textarea></label>
        <label class="wide">備註<input id="product-note" value="${n.note||""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${n.active!==!1?"checked":""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${e?.id||""}">${e?"儲存商品":"新增商品"}</button>
        ${e?'<button class="secondary" type="button" data-action="new-product">清空表單</button>':""}
      </form>
      <div class="product-admin-list">
        ${Me().map(a=>`
              <article class="admin-product ${a.active?"":"inactive"}">
                <div>
                  <strong>${a.sort}. ${a.name}</strong>
                  <span>${Et(a.category)} · ${te[a.type]} · ${p.format(a.price)} / ${Bn(a.cost)}</span>
                  <small>${[a.supportsHot?"熱":"",a.supportsIce?"冰":"",a.iceExtraPrice?`冰飲 +${p.format(a.iceExtraPrice)}`:""].filter(Boolean).join(" · ")||"無點餐選項"}</small>
                  ${X(a).length?`<small>口味 / 規格：${X(a).join("、")}</small>`:""}
                  ${a.note?`<small>${a.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${a.id}">編輯</button>
                <button class="${a.active?"danger-action":""}" data-action="toggle-product" data-id="${a.id}">${a.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function ns(){const e=M(o.historyDate),t=o.orders.filter(i=>i.status==="voided"&&W(i)===o.historyDate),n=[...e,...t].sort((i,l)=>new Date(l.paidAt||l.checkedOutAt||l.voidedAt||l.createdAt)-new Date(i.paidAt||i.checkedOutAt||i.voidedAt||i.createdAt)),a=V(e),s=Re(o.historyDate),r=Lt();return`
    <section class="history">
      <div class="section-title">
        <h2>訂單歷史</h2>
        <div class="actions">
          ${xt(r)?`<button class="ghost danger-action" data-action="undo-order-checkout" data-id="${r.id}">撤銷此筆結帳：${N(r)} · ${p.format(D(r).total)}</button>`:""}
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
        <article><span>營業額</span><strong>${p.format(a.revenue)}</strong></article>
        <article><span>已知毛利</span><strong>${p.format(a.profit)}</strong></article>
        <article><span>未知成本品項</span><strong>${a.unknownCostQuantity}</strong></article>
        <article><span>訂單數</span><strong>${a.orderCount}</strong></article>
        <article><span>飲品杯數</span><strong>${a.drinks}</strong></article>
        <article><span>甜品數</span><strong>${a.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${a.retail}</strong></article>
        <article><span>平均客單價</span><strong>${p.format(a.averageTicket)}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${o.salesSort==="amount"?"數量":"金額"}排序</button>
      </div>
      <div class="sales-table">
        ${s.length?`<article class="sales-header"><strong>商品名稱</strong><span>類別</span><span>數量</span><span>銷售金額</span><span>已知成本</span><span>已知毛利</span></article>
               ${s.map(i=>`<article><strong>${i.name}</strong><span>${i.category}</span><span>${i.quantity}${i.unknownCostQuantity?`（未知成本 ${i.unknownCostQuantity}）`:""}</span><span>${p.format(i.amount)}</span><span>${p.format(i.cost)}</span><span>${p.format(i.profit)}</span></article>`).join("")}`:'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${n.length?n.map(i=>{const l=D(i),u=`客源：${oe(i.customerSource)}${i.customerSourceNote?` (${S(i.customerSourceNote)})`:""}`,f=[i.entryType==="late_entry"?"補登訂單":"一般已結帳",i.status==="voided"?"已作廢":"",i.correctedAt?"曾修正":""].filter(Boolean).join(" · ");return`
                    <article class="history-item ${i.status==="voided"?"voided":""}">
                      <button class="history-open" data-action="open-history" data-id="${i.id}">
                        <span>${C(i.paidAt||i.checkedOutAt||i.createdAt)} · ${i.seatSnapshot||A(i)} · ${i.people}人</span>
                        <strong>${p.format(l.total)}</strong>
                        <small>${f}${i.voidReason?` · 作廢原因：${S(i.voidReason)}`:""}</small>
                        <small>${u}</small>
                        <small>${Nt(i)||"無商品"} · ${St(i)}${se(i)?` · ${se(i)}`:""}</small>
                      </button>
                      ${i.status==="paid"?`<button class="history-delete" data-action="void-order" data-id="${i.id}">作廢</button>`:'<span class="history-delete disabled">已作廢</span>'}
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function as(){const e=y(),t=At(e),n=pe(e),a=Dt(e),s=B(e),r=Ct(s),c=ta(n.paymentSummary),i=n.businessEventSummary,l=Me().filter(u=>u.active!==!1);return`
    <section class="daily-closing-page">
      <div class="section-title">
        <div>
          <h2>今日結帳</h2>
          <p>查看與核對今日營業摘要，完成今日結帳快照。</p>
        </div>
        <button class="ghost" data-action="floor">返回 POS</button>
      </div>
      <section class="daily-status-card ${t.key}">
        <div>
          <span>今日日期</span>
          <strong>${e}</strong>
        </div>
        <div>
          <span>今日狀態</span>
          <strong>${t.label}</strong>
        </div>
        <div>
          <span>首筆訂單</span>
          <strong>${n.firstOrderAt?C(n.firstOrderAt):"-"}</strong>
        </div>
        <div>
          <span>末筆結帳</span>
          <strong>${n.lastOrderAt?C(n.lastOrderAt):"-"}</strong>
        </div>
      </section>
      ${s?`<section class="closing-result ${r?"outdated":""}">
              <div>
                <span>${r?"結帳後有異動":"今日已結帳"}</span>
                <strong>DailyClosing v${s.version}</strong>
                <small>結帳時間：${C(s.closedAt)} · 備份：${s.backupStatus==="downloaded"?"已下載":"尚未成功下載"}</small>
                ${r?"<p>此營業日的資料已在今日結帳後變更，請重新完成今日結帳以更新 official snapshot。</p>":""}
              </div>
              <div class="closing-actions">
                <button class="secondary" data-action="redownload-full-backup" data-id="${s.id}">重新下載完整備份</button>
                ${r?`<button class="primary" data-action="regenerate-closing" data-date="${e}">重新完成今日結帳</button>`:""}
              </div>
            </section>`:""}
      <section class="stats report-stats" aria-label="今日結帳摘要">
        <article><span>已結帳訂單</span><strong>${n.orderCount}</strong></article>
        <article><span>今日營收</span><strong>${p.format(n.revenue)}</strong></article>
        <article><span>已知毛利</span><strong>${p.format(n.profit)}</strong></article>
        <article><span>未知成本品項</span><strong>${n.unknownCostQuantity}</strong></article>
        <article><span>未結帳訂單</span><strong>${n.openOrderCount}</strong></article>
      </section>
      <section class="daily-sections">
        <article class="daily-section">
          <h3>付款方式摘要</h3>
          ${c.length?c.map(u=>`<p><span>${u.label}</span><strong>${u.orderCount} 筆 · ${p.format(u.amount)}</strong></p>`).join(""):'<div class="empty-note">今日尚無已結帳付款紀錄</div>'}
        </article>
        <article class="daily-section">
          <h3>Business Event 摘要</h3>
          <p><span>採購</span><strong>${p.format(i.purchaseAmount)}</strong></p>
          <p><span>報廢</span><strong>${p.format(i.wasteCost)}</strong></p>
          <p><span>自用 / 測試 / 招待</span><strong>${p.format(i.personalCost+i.testCost+i.complimentaryCost)}</strong></p>
        </article>
      </section>
      ${a.length?`<section class="blocking-panel">
              <h3>尚不能完成今日結帳</h3>
              <p>仍有 ${a.length} 筆未結帳訂單，請先回 POS 完成結帳或取消。</p>
              <div>
                ${a.map(u=>`<button class="ghost" data-action="select-order" data-id="${u.id}">${N(u)} · ${u.people}人 · ${p.format(D(u).total)}</button>`).join("")}
              </div>
            </section>`:s?"":`<section class="closing-primary-panel">
              <div>
                <h3>可以完成今日結帳</h3>
                <p>完成今日結帳會建立 DailyClosing，並自動下載完整 Full Backup。</p>
              </div>
              <button class="primary" data-action="close-store">完成今日結帳</button>
            </section>`}
      <section class="late-entry-panel">
        <div class="section-title compact"><h2>補登訂單</h2></div>
        <form id="late-entry-form" class="late-entry-form">
          <label>營業日期<input name="businessDate" type="date" value="${e}" /></label>
          <label>大約交易時間<input name="approximateTime" type="time" value="12:00" /></label>
          <label>商品<select name="productId">${l.map(u=>`<option value="${u.id}">${u.name}</option>`).join("")}</select></label>
          <label>數量<input name="quantity" type="number" min="1" step="1" value="1" /></label>
          <label>實際收款金額<input name="receivedAmount" type="number" min="1" step="1" /></label>
          <label>付款方式<select name="paymentMethod"><option value="cash">現金</option><option value="electronic">電子支付</option></select></label>
          <label>內用 / 外帶<select name="serviceType"><option value="外帶">外帶</option><option value="內用">內用</option></select></label>
          <label>客源<select name="customerSource">${we().map(([u,f])=>`<option value="${u}">${f}</option>`).join("")}</select></label>
          <label>補單原因<select name="correctionReason">${Fn.map(u=>`<option value="${u}">${u}</option>`).join("")}</select></label>
          <label class="wide">備註<input name="note" /></label>
          <button class="secondary" type="button" data-action="save-late-entry">建立補登訂單</button>
        </form>
      </section>
    </section>
  `}function ss(){const e=M(y()),t=V(e);return`
    <section class="management">
      <div class="section-title">
        <h2>資料與設定</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-sections">
        <section class="backup-section">
          <div>
            <h3>資料備份與還原</h3>
            <p>完整備份、匯入還原與測試資料清理。匯入與清空會影響此裝置資料。今日結帳流程請使用獨立的「今日結帳」頁。</p>
          </div>
          <div class="backup-actions">
            <button class="primary" data-action="export-all">匯出全部資料</button>
            <button class="secondary" data-action="export-today">匯出今日資料</button>
            <button class="secondary" data-action="import-backup">匯入備份</button>
            <button class="secondary danger-action" data-action="reset-test-orders">清空測試訂單資料</button>
          </div>
        </section>
        <input id="backup-file" type="file" accept="application/json,.json" hidden />
      </div>
      <div class="backup-summary">
        <article><span>目前訂單總數</span><strong>${o.orders.length}</strong></article>
        <article><span>商品數</span><strong>${o.products.length}</strong></article>
        <article><span>今日已結帳訂單</span><strong>${e.length}</strong></article>
        <article><span>今日營業額</span><strong>${p.format(t.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `}function rs(){return[...o.businessEvents].filter(e=>!o.businessEventDate||e.date===o.businessEventDate).filter(e=>o.businessEventTypeFilter==="all"||e.type===o.businessEventTypeFilter).sort((e,t)=>{const n=String(t.date||"").localeCompare(String(e.date||""));return n!==0?n:new Date(t.createdAt||0)-new Date(e.createdAt||0)})}function Ft(){return o.businessEvents.find(e=>e.id===o.editingBusinessEventId)||null}function _t(){return o.products.filter(e=>e.active!==!1)}function _e(e){const t=_t();return t.find(n=>n.id===e)||t[0]||null}function Ut(){const e=document.querySelector("#business-event-form");if(!e)return;const t=new FormData(e),n=String(t.get("type")||"purchase"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",s=a==="product"?_e(String(t.get("productId")||"")):null,r=Ft(),c=s?r?.productId===s.id&&r?.itemName?r.itemName:s.name:String(t.get("itemName")||"").trim(),i=String(t.get("itemCategory")||"").trim(),l=Math.max(1,Math.trunc(Number(t.get("quantity"))||1)),u=Number(t.get("unitCost"))||0,f=Number(t.get("amount"))||0,h=String(t.get("costAmount")??"").trim(),g=h===""?l*u:Number(h)||0;if(a==="product"&&!s){v("請選擇 POS 商品。");return}if(!c){v("請填寫品項名稱。");return}if(n==="purchase"&&f<=0){v("採購事件請填寫採購金額。");return}if(n!=="purchase"&&g<=0){v("報廢、自用、測試或招待請填寫成本金額。");return}const d=tt({...r||{},date:String(t.get("date")||y()),type:n,usageType:n==="purchase"?null:n,itemSource:a,productId:s?.id||"",materialId:"",itemName:c,itemCategory:i,quantity:l,unit:String(t.get("unit")||"").trim(),unitCost:u,amount:n==="purchase"?f:0,costAmount:g,vendor:n==="purchase"?String(t.get("vendor")||"").trim():"",note:String(t.get("note")||"").trim(),updatedAt:new Date().toISOString()}),b=r?o.businessEvents.map(E=>E.id===r.id?d:E):[...o.businessEvents,d];m({businessEvents:b,businessEventDate:d.date,businessEventTypeFilter:"all",businessEventFormType:d.type,businessEventItemSource:d.itemSource,businessEventProductId:d.productId,editingBusinessEventId:null,notice:`${r?"已更新":"已新增"}營運事件：${et(d.type)} / ${d.itemName}`})}function os(){const e=Ft(),t=o.businessEventFormType||e?.type||"purchase",n=t==="purchase",a=o.businessEventItemSource||e?.itemSource||"manual",s=_t(),r=a==="product"?_e(o.businessEventProductId||e?.productId||""):null,c=rs(),i=Xe({formOnly:!0}),l=e?.date||o.businessEventDate||y(),u=e?.quantity||1,f=e?.itemCategory??r?.category??"",h=r?T(r.cost):null,g=e?.unitCost??h??"",d=e?.amount||"",b=g?u*Number(g):0,E=e?.costAmount??"";return`
    <section class="business-events-page">
      <div class="section-title">
        <div>
          <h2>營運事件</h2>
          <p>記錄採購、報廢、自用、測試與招待，不影響銷售訂單。</p>
        </div>
        <button class="ghost" data-action="floor">回到 POS</button>
      </div>

      <form id="business-event-form" class="business-event-form">
        <label>
          日期
          <input type="date" name="date" value="${l}" />
        </label>
        <label>
          類型
          <select name="type" data-action="business-event-type">
            ${i.map(([$,J])=>`<option value="${$}" ${t===$?"selected":""}>${J}</option>`).join("")}
          </select>
        </label>
        <label>
          品項來源
          <select name="itemSource" data-action="business-event-item-source">
            <option value="product" ${a==="product"?"selected":""}>POS 商品</option>
            <option value="manual" ${a==="manual"?"selected":""}>手動輸入</option>
            <option value="material" disabled>Material 未開放</option>
          </select>
        </label>
        ${a==="product"?`<label>
                POS 商品
                <select name="productId" data-action="business-event-product">
                  ${s.map($=>`<option value="${$.id}" ${r?.id===$.id?"selected":""}>${$.name}</option>`).join("")}
                </select>
              </label>`:`<label>
                品項
                <input name="itemName" value="${S(e?.itemName||"")}" placeholder="例如：牛奶、巴斯克、濾紙" />
              </label>`}
        <label>
          品項類別
          <input name="itemCategory" value="${S(f)}" placeholder="可空白" />
        </label>
        <label>
          數量
          <input name="quantity" type="number" min="1" step="1" value="${u}" />
        </label>
        <label>
          單位
          <input name="unit" value="${S(e?.unit||"")}" placeholder="g / ml / 片 / 包" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${g}" placeholder="0" />
        </label>
        ${n?`<label>
                採購金額
                <input name="amount" type="number" min="0" step="1" value="${d}" placeholder="0" />
              </label>
              <label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${E}" placeholder="${b?`預設 ${b}`:"可空白"}" />
              </label>
              <label>
                供應商
                <input name="vendor" value="${S(e?.vendor||"")}" placeholder="可空白" />
              </label>`:`<label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${E}" placeholder="${b?`預設 ${b}`:"0"}" />
              </label>`}
        <label class="wide">
          備註
          <input name="note" value="${S(e?.note||"")}" placeholder="可空白" />
        </label>
        <div class="form-actions">
          <button class="primary" data-action="save-business-event">${e?"更新紀錄":"新增紀錄"}</button>
          ${e?'<button class="secondary" data-action="cancel-business-event-edit">取消</button>':""}
        </div>
      </form>

      <div class="business-event-filters">
        <label>
          日期
          <input type="date" value="${o.businessEventDate||y()}" data-action="business-event-date" />
        </label>
        <label>
          類型
          <select data-action="business-event-filter-type">
            <option value="all" ${o.businessEventTypeFilter==="all"?"selected":""}>全部</option>
            ${i.map(([$,J])=>`<option value="${$}" ${o.businessEventTypeFilter===$?"selected":""}>${J}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="analytics-table business-event-table">
        ${c.length?`<div class="analytics-table-head"><span>日期</span><span>類型</span><span>品項</span><span>數量</span><span>金額 / 成本</span><span>備註</span><span>操作</span></div>
               ${c.map($=>`
                 <div>
                   <span>${$.date}</span>
                   <strong>${et($.type)}</strong>
                   <span>${S($.itemName)}</span>
                   <span>${$.quantity||0} ${S($.unit)}</span>
                   <span>${$.type==="purchase"?p.format($.amount):p.format($.costAmount)}</span>
                   <span>${$.vendor?`${S($.vendor)} / `:""}${S($.note||"")}</span>
                   <button class="ghost" data-action="edit-business-event" data-id="${$.id}">編輯</button>
                 </div>
               `).join("")}`:'<div class="empty-note">此日期與類型尚無營運事件</div>'}
      </div>
    </section>
  `}function Bt(e=o.inventoryLotType){const t=e==="roasted_beans"?"retail":"dessert";return o.products.filter(n=>n.active!==!1&&n.type===t)}function re(e,t=o.inventoryLotType){const n=Bt(t);return n.find(a=>a.id===e)||n[0]||null}function is(){return[...o.inventoryLots].filter(e=>o.inventoryLotStatusFilter==="all"||e.status===o.inventoryLotStatusFilter).sort((e,t)=>{const n=e.madeDate||e.roastDate||e.purchaseDate||e.createdAt||"",a=t.madeDate||t.roastDate||t.purchaseDate||t.createdAt||"",s=String(a).localeCompare(String(n));return s!==0?s:String(e.itemName).localeCompare(String(t.itemName),"zh-Hant")})}function Ht(){const e=document.querySelector("#inventory-lot-form");if(!e)return;const t=new FormData(e),n=String(t.get("lotType")||"dessert"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",s=a==="product"?re(String(t.get("productId")||""),n):null,r=s?s.name:String(t.get("itemName")||"").trim(),c=s?s.category:String(t.get("itemCategory")||"").trim(),i=Math.max(1,Math.trunc(Number(t.get("initialQuantity"))||1)),l=Number(t.get("unitCost"))||0,u=String(t.get("costAmount")??"").trim(),f=u===""?i*l:Number(u)||0;if(a==="product"&&!s){v("請先建立或啟用對應的甜點 / 熟豆商品。");return}if(!r){v("請填寫批次品項名稱。");return}if(i<=0){v("批次初始數量需大於 0。");return}const h=pt({itemSource:a,productId:s?.id||"",materialId:"",itemName:r,itemCategory:c,lotType:n,sourceEventId:"",madeDate:n==="dessert"?String(t.get("madeDate")||""):"",roastDate:n==="roasted_beans"?String(t.get("roastDate")||""):"",purchaseDate:String(t.get("purchaseDate")||""),expireDate:String(t.get("expireDate")||""),initialQuantity:i,remainingQuantity:i,unit:String(t.get("unit")||Ce(n)).trim(),unitCost:l,costAmount:f,status:"active",note:String(t.get("note")||"").trim()});m({inventoryLots:[...o.inventoryLots,h],inventoryLotType:h.lotType,inventoryLotItemSource:h.itemSource==="product"?"product":"manual",inventoryLotProductId:h.productId,inventoryLotStatusFilter:"active",notice:`已新增批次：${h.itemName}`})}function cs(e){const t=o.inventoryLots.find(n=>n.lotId===e);t&&m({inventoryLots:o.inventoryLots.map(n=>n.lotId===e?{...n,status:"archived",updatedAt:new Date().toISOString()}:n),notice:`已封存批次：${t.itemName}`})}function us(){const e=o.inventoryLotType||"dessert",t=o.inventoryLotItemSource||"product",n=Bt(e),a=t==="product"?re(o.inventoryLotProductId,e):null,r=(a?T(a.cost):null)??"",c=Ce(e),i=y(),l=is();return`
    <section class="inventory-lots-page">
      <div class="section-title">
        <div>
          <h2>庫存現況</h2>
          <h3>甜點與熟豆批次</h3>
          <p>第一版只管理甜點與熟豆批次，不會自動扣 POS 銷售或 Business Events。</p>
        </div>
        <button class="ghost" data-action="floor">回到 POS</button>
      </div>

      <form id="inventory-lot-form" class="inventory-lot-form">
        <label>
          批次類型
          <select name="lotType" data-action="inventory-lot-type">
            ${lt().map(([u,f])=>`<option value="${u}" ${e===u?"selected":""}>${f}</option>`).join("")}
          </select>
        </label>
        <label>
          品項來源
          <select name="itemSource" data-action="inventory-lot-item-source">
            <option value="product" ${t==="product"?"selected":""}>POS 商品</option>
            <option value="manual" ${t==="manual"?"selected":""}>手動輸入</option>
            <option value="material" disabled>Material 未開放</option>
          </select>
        </label>
        ${t==="product"?`<label>
                POS 商品
                <select name="productId" data-action="inventory-lot-product">
                  ${n.map(u=>`<option value="${u.id}" ${a?.id===u.id?"selected":""}>${u.name}</option>`).join("")}
                </select>
              </label>`:`<label>
                品項名稱
                <input name="itemName" placeholder="${e==="roasted_beans"?"例如：Sidra 熟豆":"例如：巴斯克"}" />
              </label>`}
        <label>
          品項類別
          <input name="itemCategory" value="${S(a?.category||"")}" placeholder="可空白" />
        </label>
        ${e==="dessert"?`<label>製作日期<input name="madeDate" type="date" value="${i}" /></label>`:`<label>烘焙日期<input name="roastDate" type="date" value="${i}" /></label>`}
        <label>
          採購日期
          <input name="purchaseDate" type="date" />
        </label>
        <label>
          到期日
          <input name="expireDate" type="date" />
        </label>
        <label>
          初始數量
          <input name="initialQuantity" type="number" min="1" step="1" value="1" />
        </label>
        <label>
          單位
          <input name="unit" value="${c}" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${r}" placeholder="0" />
        </label>
        <label>
          總成本
          <input name="costAmount" type="number" min="0" step="1" placeholder="可空白" />
        </label>
        <label class="wide">
          備註
          <input name="note" placeholder="可空白" />
        </label>
        <div class="form-actions">
          <button class="primary" data-action="save-inventory-lot">新增批次</button>
        </div>
      </form>

      <div class="inventory-lot-filters">
        <label>
          狀態
          <select data-action="inventory-lot-status-filter">
            <option value="active" ${o.inventoryLotStatusFilter==="active"?"selected":""}>使用中</option>
            <option value="archived" ${o.inventoryLotStatusFilter==="archived"?"selected":""}>已封存</option>
            <option value="all" ${o.inventoryLotStatusFilter==="all"?"selected":""}>全部</option>
          </select>
        </label>
      </div>

      <div class="analytics-table inventory-lot-table">
        ${l.length?`<div class="analytics-table-head"><span>類型</span><span>品項</span><span>日期</span><span>到期</span><span>初始</span><span>剩餘</span><span>成本</span><span>狀態</span><span>備註</span><span>操作</span></div>
               ${l.map(u=>{const f=u.lotType==="roasted_beans"?u.roastDate:u.madeDate;return`
                   <div>
                     <span>${qn(u.lotType)}</span>
                     <strong>${S(u.itemName)}</strong>
                     <span>${f||u.purchaseDate||"-"}</span>
                     <span>${u.expireDate||"-"}</span>
                     <span>${u.initialQuantity} ${S(u.unit)}</span>
                     <span>${u.remainingQuantity} ${S(u.unit)}</span>
                     <span>${p.format(u.costAmount)}</span>
                     <span>${Rn(u.status)}</span>
                     <span>${S(u.note||"")}</span>
                     <span>${u.status==="active"?`<button class="ghost" data-action="archive-inventory-lot" data-id="${u.lotId}">封存</button>`:"-"}</span>
                   </div>
                 `}).join("")}`:'<div class="empty-note">目前沒有符合條件的批次</div>'}
      </div>
    </section>
  `}function ds(){const e=Gn(),t=Dn(o.orders,{startDate:e.startDate,endDate:e.endDate,sortBy:o.analyticsSort,categoryLabels:oa(),seatLabels:ia(),customerSourceLabels:at(),businessEvents:o.businessEvents}),{overview:n,productRanking:a,categorySummary:s,temperatureSummary:r,hourlySummary:c,seatSummary:i,customerSourceSummary:l,businessEventSummary:u}=t,f=a.slice(0,8),h=[["today","今日"],["yesterday","昨日"],["seven-days","近 7 天"],["month","本月"],["custom","自訂日期"]],g=[["quantity","銷售數量"],["revenue","營收"],["profit","已知毛利"]];return`
    <section class="analytics-page">
      <div class="section-title">
        <div>
          <h2>經營分析</h2>
          <span class="analytics-range-label">${e.label}</span>
        </div>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>

      <div class="analytics-toolbar">
        <div class="analytics-range-tabs">
          ${h.map(([d,b])=>`
                <button class="${o.analyticsRange===d?"active":""}" data-action="analytics-range" data-value="${d}">${b}</button>
              `).join("")}
        </div>
        <div class="analytics-custom-dates">
          <label>開始<input type="date" value="${e.startDate}" data-action="analytics-start-date" /></label>
          <label>結束<input type="date" value="${e.endDate}" data-action="analytics-end-date" /></label>
        </div>
      </div>

      <section class="stats analytics-stats" aria-label="經營分析概覽">
        <article><span>營業額</span><strong>${p.format(n.revenue)}</strong></article>
        <article><span>已知毛利</span><strong>${p.format(n.profit)}</strong></article>
        <article><span>已知毛利率</span><strong>${z.format(n.marginRate)}</strong></article>
        <article><span>未知成本品項</span><strong>${n.unknownCostQuantity}</strong></article>
        <article><span>訂單數</span><strong>${n.orderCount}</strong></article>
        <article><span>人數</span><strong>${n.people}</strong></article>
        <article><span>平均客單價</span><strong>${p.format(n.averageTicket)}</strong></article>
        <article><span>飲品杯數</span><strong>${n.drinks}</strong></article>
        <article><span>甜點數</span><strong>${n.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${n.retail}</strong></article>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact"><h2>營運事件摘要</h2></div>
        <div class="business-event-summary">
          <article><span>採購金額</span><strong>${p.format(u.purchaseAmount)}</strong></article>
          <article><span>報廢成本</span><strong>${p.format(u.wasteCost)}</strong></article>
          <article><span>自用成本</span><strong>${p.format(u.personalCost)}</strong></article>
          <article><span>測試成本</span><strong>${p.format(u.testCost)}</strong></article>
          <article><span>招待成本</span><strong>${p.format(u.complimentaryCost)}</strong></article>
        </div>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact"><h2>客源分析</h2></div>
        <div class="analytics-table customer-source-table">
          ${l.length?`<div class="analytics-table-head"><span>來源</span><span>訂單數</span><span>營收</span><span>平均客單價</span></div>
                 ${l.map(d=>`
                       <div>
                         <strong>${d.label}</strong>
                         <span>${d.orderCount}</span>
                         <span>${p.format(d.revenue)}</span>
                         <span>${p.format(d.averageTicket)}</span>
                       </div>
                     `).join("")}`:'<div class="empty-note">No paid orders in this range.</div>'}
        </div>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact">
          <h2>商品銷售排行</h2>
          <div class="analytics-sort">
            ${g.map(([d,b])=>`<button class="${o.analyticsSort===d?"active":""}" data-action="analytics-sort" data-value="${d}">${b}</button>`).join("")}
          </div>
        </div>
        <div class="analytics-table product-ranking-table">
          ${f.length?`<div class="analytics-table-head">
                    <span>排名</span><span>商品名稱</span><span>類別</span><span>數量</span><span>營收</span><span>已知成本</span><span>已知毛利</span><span>已知毛利率</span><span>口味 / 規格</span><span>冰 / 熱</span><span>內用 / 外帶</span>
                 </div>
                 ${f.map((d,b)=>`
                       <div>
                         <span>${b+1}</span>
                         <strong>${d.name}</strong>
                         <span>${d.category}</span>
                         <span>${d.quantity}${d.unknownCostQuantity?`（未知 ${d.unknownCostQuantity}）`:""}</span>
                         <span>${p.format(d.revenue)}</span>
                         <span>${p.format(d.cost)}</span>
                         <span>${p.format(d.profit)}</span>
                         <span>${z.format(d.marginRate)}</span>
                         <span>${da(d)}</span>
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
            ${s.length?`<div class="analytics-table-head"><span>類別</span><span>數量</span><span>營收</span><span>已知毛利</span><span>已知毛利率</span></div>
                   ${s.map(d=>`
                         <div>
                           <strong>${d.category}</strong>
                           <span>${d.quantity}</span>
                           <span>${p.format(d.revenue)}</span>
                           <span>${p.format(d.profit)}</span>
                           <span>${z.format(d.marginRate)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無類別資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>冰熱分析</h2></div>
          <div class="temperature-summary">
            <article><span>冰飲數量</span><strong>${r.iced}</strong><small>${z.format(r.icedRate)}</small></article>
            <article><span>熱飲數量</span><strong>${r.hot}</strong><small>${z.format(r.hotRate)}</small></article>
          </div>
        </article>
      </section>

      <section class="analytics-grid">
        <article class="analytics-panel">
          <div class="section-title compact"><h2>時段分析</h2></div>
          <div class="analytics-table hourly-summary-table">
            ${c.length?`<div class="analytics-table-head"><span>小時</span><span>訂單數</span><span>營業額</span><span>飲品杯數</span></div>
                   ${c.map(d=>`
                         <div>
                           <strong>${d.hour}</strong>
                           <span>${d.orderCount} 單</span>
                           <span>${p.format(d.revenue)}</span>
                           <span>${d.drinks} 杯</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無時段資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>座位分析</h2></div>
          <div class="analytics-table seat-summary-table">
            ${i.length?`<div class="analytics-table-head"><span>座位名稱</span><span>訂單數</span><span>人數</span><span>營業額</span><span>平均客單價</span></div>
                   ${i.map(d=>`
                         <div>
                           <strong>${d.seatName}</strong>
                           <span>${d.orderCount}</span>
                           <span>${d.people}</span>
                           <span>${p.format(d.revenue)}</span>
                           <span>${p.format(d.averageTicket)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無座位資料</div>'}
          </div>
        </article>
      </section>
    </section>
  `}function ls(){return o.activeView==="analytics"?ds():o.activeView==="daily-closing"?as():o.activeView==="backup"?ss():o.activeView==="business-events"?os():o.activeView==="inventory-lots"?us():o.activeView==="products"?ts():o.activeView==="history"?ns():`
    <main class="workspace">
      <section class="floor workspace-floor">
        <div class="section-title workspace-title">
          ${Ha()}
        </div>
        ${Ba()}
        ${Qa()}
        ${za()}
      </section>
      <aside class="task-column">
        ${Xa()}
        ${es()}
      </aside>
    </main>
  `}function ps(){if(!ft)return"";const e=o.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",e.clickedProductId||""],["selectedSeatId",e.selectedSeatId||o.selectedSeatId||""],["selectedOrderId",e.selectedOrderId||o.selectedOrderId||""],["current open order id",e.currentOpenOrderId||Le()?.id||""],["product found",String(e.productFound??"")],["addProduct executed",String(e.addProductExecuted??"")],["failure reason",e.addProductFailureReason||""],["before items.length",String(e.beforeItemsLength??e.selectedOrderItemsLengthBefore??"")],["after items.length",String(e.afterItemsLength??"")],["new item lineId",e.newItemLineId||""],["replaceOrder executed",String(e.replaceOrderExecuted??"")],["storage save executed",String(e.storageSaveExecuted??"")],["render after save executed",String(e.renderAfterSaveExecuted??"")],["orders.length",String(e.ordersLength??o.orders.length)],["selected items.length",String(e.selectedOrderItemsLength??It())],["dataset.id",e.datasetId||""],["data-product-id",e.productDatasetId||""],["closest button",String(e.closestButtonFound??"")],["source",e.productClickSource||""],["updated",e.updatedAt||""]].map(([n,a])=>`<div><span>${n}</span><code>${a}</code></div>`).join("")}
    </aside>
  `}function ms(){document.querySelectorAll(".product[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),Pt(e.getAttribute("data-product-id"),"direct-product-button",t)})})}function Q(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div class="topbar-title"><span>YUTU POS</span><h1>POS 工作台</h1><small>接單、點餐與結帳</small></div>
        <div class="store-status">
          <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
          <strong>${At(y()).label}</strong>
        </div>
      </header>
      ${o.notice?`<div class="notice" role="status">${o.notice}</div>`:""}
      ${o.activeView==="floor"?"":ja()}
      ${ls()}
      ${ps()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(e=>{e.type="button"}),ms()}document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t||t.disabled)return;e.preventDefault();const{action:n,id:a,value:s}=t.dataset;if(n==="seat"&&ua(a),n==="new-takeout"&&la(),n==="select-order"&&pa(a),n==="category"&&m({selectedCategoryId:a}),n==="product"&&Pt(a,"delegated-document-click",e),n==="qty"){const r=Number(s);r<=0?ze(a):K(a,{quantity:r})}if(n==="temp"&&K(a,{temperature:s}),n==="service"&&K(a,{serviceType:s}),n==="served"){const c=k()?.items.find(i=>i.lineId===a);c&&K(a,{served:!c.served})}if(n==="remove"&&ze(a),n==="checkout"&&ya(),n==="close-store"&&xa(),n==="move-table"&&Ia(),n==="add-linked-seat"&&wa(),n==="remove-linked-seat"&&ka(a),n==="undo-checkout"&&fa(),n==="undo-order-checkout"&&qt(a),n==="cancel-order"&&va(),n==="edit-paid"&&ga(a),n==="void-order"&&ba(a),n==="products"&&m({activeView:"products",editingProductId:null}),n==="daily-closing"&&m({activeView:"daily-closing"}),n==="business-events"&&m({activeView:"business-events",businessEventDate:o.businessEventDate||y()}),n==="inventory-lots"&&m({activeView:"inventory-lots"}),n==="analytics"&&m({activeView:"analytics"}),n==="backup"&&m({activeView:"backup"}),n==="new-product"&&We(null),n==="edit-product"&&We(a),n==="toggle-product"&&Da(a),n==="save-product"&&Sa(a||null),n==="export-all"&&Oa(),n==="export-today"&&Pa(),n==="export-closing"&&La(),n==="redownload-full-backup"&&Ea(a),n==="regenerate-closing"&&qa(t.dataset.date||y()),n==="export-report-date"&&Mt(o.historyDate||y()),n==="import-backup"&&document.querySelector("#backup-file")?.click(),n==="reset-test-orders"&&Va(),n==="save-business-event"&&Ut(),n==="save-late-entry"&&$a(),n==="save-inventory-lot"&&Ht(),n==="archive-inventory-lot"&&cs(a),n==="edit-business-event"){const r=o.businessEvents.find(c=>c.id===a);r&&m({activeView:"business-events",editingBusinessEventId:a,businessEventFormType:r.type,businessEventItemSource:r.itemSource||"manual",businessEventProductId:r.productId||"",businessEventDate:r.date||o.businessEventDate||y()})}if(n==="cancel-business-event-edit"&&m({editingBusinessEventId:null}),n==="history"&&m({activeView:"history",historyDate:o.historyDate||y()}),n==="floor"&&m({activeView:"floor",orderDetailMode:"active"}),n==="open-history"){const r=o.orders.find(c=>c.id===a);r?m({selectedOrderId:a,selectedSeatId:r.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:a}),v("找不到這筆歷史訂單。"))}if(n==="history-yesterday"&&m({historyDate:ne(y(),-1)}),n==="history-today"&&m({historyDate:y()}),n==="toggle-sales-sort"&&m({salesSort:o.salesSort==="amount"?"quantity":"amount"}),n==="order-view"&&m({orderViewMode:s==="production"?"production":"edit"}),n==="analytics-range"){const r=s||"today",c={analyticsRange:r};if(r!=="custom"){const i=bt(r);c.analyticsStartDate=i.startDate,c.analyticsEndDate=i.endDate}m(c)}n==="analytics-sort"&&m({analyticsSort:s||"quantity"})});document.addEventListener("change",e=>{if(e.target?.id==="backup-file"){Ma(e.target.files?.[0]),e.target.value="";return}if(e.target?.id==="product-category"&&o.activeView==="products"&&!o.editingProductId){m({selectedCategoryId:e.target.value||w[0].id});return}const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="history-date"&&m({historyDate:t.value||y()}),t.dataset.action==="analytics-start-date"&&m({analyticsRange:"custom",analyticsStartDate:t.value||y()}),t.dataset.action==="analytics-end-date"&&m({analyticsRange:"custom",analyticsEndDate:t.value||y()}),t.dataset.action==="business-event-date"&&m({businessEventDate:t.value||y()}),t.dataset.action==="business-event-filter-type"&&m({businessEventTypeFilter:t.value||"all"}),t.dataset.action==="business-event-type"&&m({businessEventFormType:t.value||"purchase"}),t.dataset.action==="business-event-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?_e(o.businessEventProductId):null;m({businessEventItemSource:n,businessEventProductId:a?.id||""})}if(t.dataset.action==="business-event-product"&&m({businessEventItemSource:"product",businessEventProductId:t.value||""}),t.dataset.action==="inventory-lot-type"){const n=t.value||"dessert",a=re(o.inventoryLotProductId,n);m({inventoryLotType:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?re(o.inventoryLotProductId,o.inventoryLotType):null;m({inventoryLotItemSource:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-product"&&m({inventoryLotItemSource:"product",inventoryLotProductId:t.value||""}),t.dataset.action==="inventory-lot-status-filter"&&m({inventoryLotStatusFilter:t.value||"active"}),t.dataset.action==="customer-source"){const n=O(t.value);Ye({customerSource:n,customerSourceNote:st(n)&&k()?.customerSourceNote||""})}t.dataset.action==="customer-source-note"&&Ye({customerSourceNote:t.value||""})}});document.addEventListener("submit",e=>{["business-event-form","inventory-lot-form"].includes(e.target?.id)&&(e.preventDefault(),e.target.id==="business-event-form"?Ut():Ht())});Q();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
