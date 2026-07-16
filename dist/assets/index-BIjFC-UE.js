(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const k=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],Et=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],A=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function Ot(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}const kt=10;function Dt(e){return e==="pourover"||e==="手沖"}function Le(e){const t=Number(e.basePrice??e.price??e.effectivePrice)||0,n=Dt(e.category)&&e.temperature==="冰"?kt:0,a=t+n;return{basePrice:t,effectivePrice:a,iceExtra:n,price:a,profit:a-(Number(e.cost)||0)}}function Pe({seatId:e,people:t}){const n=new Date;return{id:`YT-${n.getFullYear()}${String(n.getMonth()+1).padStart(2,"0")}${String(n.getDate()).padStart(2,"0")}-${String(n.getTime()).slice(-5)}`,createdAt:n.toISOString(),seatId:e,people:t,items:[],activityLog:[],status:"open",paymentMethod:null,checkedOutAt:null}}function wt(e,t,n={}){const a=t.requiresTemperature??t.type==="drink",s=t.requiresServiceType??t.type!=="retail",r=a?n.temperature||"熱":"",i=n.serviceType||(e.seatId==="takeout"?"外帶":"內用"),c={category:t.category,temperature:r,basePrice:t.price,cost:t.cost},u=Le(c);return{...e,items:[...e.items,{lineId:Ot(),productId:t.id,name:t.name,variantName:n.variantName||"",category:t.category,type:t.type,quantity:1,requiresTemperature:a,requiresServiceType:s,temperature:r,serviceType:s?i:"",basePrice:u.basePrice,effectivePrice:u.effectivePrice,iceExtra:u.iceExtra,price:u.price,cost:t.cost,profit:u.profit,served:!1,note:n.note||""}]}}function Tt(e,t,n){return{...e,items:e.items.map(a=>{if(a.lineId!==t)return a;const s={...a,...n};return{...s,...Le(s)}})}}function At(e,t){return{...e,items:e.items.filter(n=>n.lineId!==t)}}function D(e){return e.items.reduce((t,n)=>{const a=Number(n.quantity)||0,s=Number(n.effectivePrice??n.price)||0,r=Number(n.cost)||0;return t.total+=s*a,t.cost+=r*a,t.profit+=(s-r)*a,t.drinks+=n.type==="drink"?a:0,t.desserts+=n.type==="dessert"?a:0,t},{total:0,cost:0,profit:0,drinks:0,desserts:0})}function Nt(e,t="cash"){const n=new Date().toISOString();return{...e,status:"paid",paymentMethod:t,checkedOutAt:n,activityLog:[...Array.isArray(e.activityLog)?e.activityLog:[],{type:"checkout",at:n}]}}const qe=["purchase","production","roasting","waste","personal","test","complimentary","stock_adjustment"],Ct=["sale","waste","personal","test","complimentary","other"],Lt=["purchase","waste","personal","test","complimentary"],Pt=["product","material","manual"],xe={purchase:"採購",production:"生產",roasting:"烘豆",waste:"報廢",personal:"自用",test:"測試",complimentary:"招待",stock_adjustment:"盤點修正"},qt=new Set(qe),De=new Set(Ct),xt=new Set(["waste","personal","test","complimentary"]),Mt=new Set(Pt);function _t(e="event"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function Rt(e){return qt.has(e)?e:"stock_adjustment"}function Ut(e,t){return xt.has(t)?De.has(e)?e:t:De.has(e)?e:null}function jt(e){return Mt.has(e)?e:"manual"}function Y(e){return Number(e)||0}function Vt(e){return Math.max(1,Math.trunc(Number(e)||1))}function Me({formOnly:e=!1}={}){return(e?Lt:qe).map(n=>[n,xe[n]||n])}function _e(e){return xe[e]||e||"未知事件"}function Re(e={}){const t=new Date().toISOString(),n=Rt(e.type),a=Vt(e.quantity),s=e.costAmount&&a?Y(e.costAmount)/a:0,r=Number.isFinite(Number(e.unitCost))?Y(e.unitCost):s,i=Number.isFinite(Number(e.costAmount))?Y(e.costAmount):r*a;return{id:e.id||_t("business-event"),date:e.date||t.slice(0,10),type:n,usageType:Ut(e.usageType,n),itemId:e.itemId||"",itemSource:jt(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",quantity:a,unit:e.unit||"",unitCost:r,amount:Y(e.amount),costAmount:i,vendor:e.vendor||"",note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function le(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>Re(t)):[]}function Ft(e,t,n){const a=t||"",s=n||a;return le(e).filter(r=>!a&&!s?!0:!(a&&r.date<a||s&&r.date>s))}function Bt(e,t={}){return(t.startDate||t.endDate?Ft(e,t.startDate,t.endDate):le(e)).reduce((a,s)=>((s.type==="waste"||s.usageType==="waste")&&(a.wasteCost+=s.costAmount),(s.type==="personal"||s.usageType==="personal")&&(a.personalCost+=s.costAmount),(s.type==="test"||s.usageType==="test")&&(a.testCost+=s.costAmount),(s.type==="complimentary"||s.usageType==="complimentary")&&(a.complimentaryCost+=s.costAmount),s.type==="purchase"&&(a.purchaseAmount+=s.amount||s.costAmount),a),{wasteCost:0,personalCost:0,testCost:0,complimentaryCost:0,purchaseAmount:0})}const pe=[["google_maps","Google 地圖"],["instagram","Instagram"],["threads","Threads"],["walk_in","路過"],["friend_referral","朋友介紹"],["xiaohongshu","小紅書"],["returning_customer","再次回訪"],["other","其他"],["not_asked","未詢問"]],Ht=new Set(pe.map(([e])=>e)),zt=new Set(["other","friend_referral"]),W=Object.fromEntries(pe);function Yt(e){return Number(e.effectivePrice??e.price)||0}function Qt(e){return Number(e.quantity)||0}function Kt(){return pe}function Wt(){return W}function L(e){return Ht.has(e)?e:"not_asked"}function te(e){const t=L(e);return W[t]||W.not_asked}function Ue(e){return zt.has(L(e))}function Gt(e,t={}){const n=t.customerSourceLabels||W,a=new Map;return(Array.isArray(e)?e:[]).forEach(s=>{const r=L(s.customerSource),i=a.get(r)||{source:r,label:n[r]||te(r),orderCount:0,revenue:0,averageTicket:0};i.orderCount+=1,s.items?.forEach(c=>{i.revenue+=Yt(c)*Qt(c)}),i.averageTicket=i.orderCount?i.revenue/i.orderCount:0,a.set(r,i)}),[...a.values()].sort((s,r)=>r.revenue-s.revenue||r.orderCount-s.orderCount)}function je(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?"":new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function Jt(e){return je(e.checkedOutAt||e.createdAt)}function Xt(e){const t=new Date(e.checkedOutAt||e.createdAt);return Number.isNaN(t.getTime())?"--:00":`${String(t.getHours()).padStart(2,"0")}:00`}function j(e){return Number(e.effectivePrice??e.price)||0}function me(e){return Number(e.cost)||0}function M(e){return Number(e.quantity)||0}function U(e,t){return t?e/t:0}function Ve(e,t={}){return t[e]||e||"未分類"}function Zt(e,t={}){return e==="takeout"?t.takeout||"外帶":t[e]||e||"未知座位"}function en(e={}){return Object.values(e).map(t=>({category:t,quantity:0,revenue:0,cost:0,profit:0,marginRate:0}))}function tn(e,t,n){const a=t||je(new Date),s=n||a;return(Array.isArray(e)?e:[]).filter(r=>{if(r.status!=="paid")return!1;const i=Jt(r);return i>=a&&i<=s})}function nn(e){const t=(Array.isArray(e)?e:[]).reduce((n,a)=>(n.orderCount+=1,n.people+=Number(a.people)||0,a.items?.forEach(s=>{const r=M(s),i=j(s)*r,c=me(s)*r,u=i-c;n.revenue+=i,n.cost+=c,n.profit+=u,n.drinks+=s.type==="drink"?r:0,n.desserts+=s.type==="dessert"?r:0,n.retail+=s.type==="retail"?r:0}),n),{revenue:0,cost:0,profit:0,marginRate:0,orderCount:0,people:0,averageTicket:0,drinks:0,desserts:0,retail:0});return t.marginRate=U(t.profit,t.revenue),t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function an(e,t={}){const n=t.categoryLabels||{},a=t.sortBy||"quantity",s=new Map;(Array.isArray(e)?e:[]).forEach(i=>{i.items?.forEach(c=>{const u=M(c),f=j(c),b=me(c),y=f*u,g=b*u,d=y-g,I=`${c.productId||c.name}-${c.name}`,v=s.get(I)||{productId:c.productId||"",name:c.name,category:Ve(c.category,n),quantity:0,revenue:0,cost:0,profit:0,marginRate:0,iced:0,hot:0,dineIn:0,takeaway:0,variants:{}};v.quantity+=u,v.revenue+=y,v.cost+=g,v.profit+=d,v.iced+=c.type==="drink"&&c.temperature==="冰"?u:0,v.hot+=c.type==="drink"&&c.temperature==="熱"?u:0,v.dineIn+=c.serviceType==="內用"?u:0,v.takeaway+=c.serviceType==="外帶"?u:0,c.variantName&&(v.variants[c.variantName]=(v.variants[c.variantName]||0)+u),v.marginRate=U(v.profit,v.revenue),s.set(I,v)})});const r={quantity:(i,c)=>c.quantity-i.quantity||c.revenue-i.revenue,revenue:(i,c)=>c.revenue-i.revenue||c.quantity-i.quantity,profit:(i,c)=>c.profit-i.profit||c.revenue-i.revenue};return[...s.values()].sort(r[a]||r.quantity)}function rn(e,t={}){const n=t.categoryLabels||{},a=en(n),s=new Map(a.map(r=>[r.category,r]));return(Array.isArray(e)?e:[]).forEach(r=>{r.items?.forEach(i=>{const c=M(i),u=j(i)*c,f=me(i)*c,b=u-f,y=Ve(i.category,n),g=s.get(y)||{category:y,quantity:0,revenue:0,cost:0,profit:0,marginRate:0};g.quantity+=c,g.revenue+=u,g.cost+=f,g.profit+=b,g.marginRate=U(g.profit,g.revenue),s.set(y,g)})}),[...s.values()]}function sn(e){const t={iced:0,hot:0,total:0,icedRate:0,hotRate:0};return(Array.isArray(e)?e:[]).forEach(n=>{n.items?.forEach(a=>{if(a.type!=="drink")return;const s=M(a);t.iced+=a.temperature==="冰"?s:0,t.hot+=a.temperature==="熱"?s:0,t.total+=s})}),t.icedRate=U(t.iced,t.total),t.hotRate=U(t.hot,t.total),t}function on(e){const t=new Map;return(Array.isArray(e)?e:[]).forEach(n=>{const a=Xt(n),s=t.get(a)||{hour:a,orderCount:0,revenue:0,drinks:0};s.orderCount+=1,n.items?.forEach(r=>{const i=M(r);s.revenue+=j(r)*i,s.drinks+=r.type==="drink"?i:0}),t.set(a,s)}),[...t.values()].sort((n,a)=>n.hour.localeCompare(a.hour))}function cn(e,t={}){const n=t.seatLabels||{},a=new Map;return(Array.isArray(e)?e:[]).forEach(s=>{const r=Zt(s.seatId,n),i=a.get(r)||{seatName:r,orderCount:0,people:0,revenue:0,averageTicket:0};i.orderCount+=1,i.people+=Number(s.people)||0,s.items?.forEach(c=>{i.revenue+=j(c)*M(c)}),i.averageTicket=i.orderCount?i.revenue/i.orderCount:0,a.set(r,i)}),[...a.values()].sort((s,r)=>r.revenue-s.revenue||r.orderCount-s.orderCount)}function un(e,t={}){const n=tn(e,t.startDate,t.endDate),a=nn(n),s=an(n,t),r=rn(n,t),i=sn(n),c=on(n),u=cn(n,t),f=Gt(n,t),b=Bt(t.businessEvents||[],{startDate:t.startDate,endDate:t.endDate});return{schemaVersion:1,startDate:t.startDate,endDate:t.endDate,paidOrders:n,overview:a,salesSummary:a,productRanking:s,productSummary:s,categorySummary:r,temperatureSummary:i,hourlySummary:c,seatSummary:u,customerSourceSummary:f,businessEventSummary:b,comparisonSummary:null}}const Fe=["dessert","roasted_beans"],dn=["active","archived"],ln=["product","material","manual"],Be={dessert:"甜點批次",roasted_beans:"熟豆批次"},pn={active:"使用中",archived:"已封存"},mn=new Set(Fe),yn=new Set(dn),fn=new Set(ln);function vn(e="lot"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function ue(e){return Number(e)||0}function we(e){return Math.max(0,Math.trunc(Number(e)||0))}function He(e){return mn.has(e)?e:"dessert"}function gn(e){return yn.has(e)?e:"active"}function bn(e){return fn.has(e)?e:"manual"}function ze(){return Fe.map(e=>[e,Be[e]||e])}function $n(e){return Be[e]||e||"未分類"}function hn(e){return pn[e]||e||"未分類"}function ye(e){return He(e)==="roasted_beans"?"g":"片"}function Ye(e={}){const t=new Date().toISOString(),n=He(e.lotType),a=we(e.initialQuantity),s=e.remainingQuantity===void 0?a:we(e.remainingQuantity),r=e.costAmount&&a?ue(e.costAmount)/a:0,i=Number.isFinite(Number(e.unitCost))?ue(e.unitCost):r,c=Number.isFinite(Number(e.costAmount))?ue(e.costAmount):i*a;return{lotId:e.lotId||e.id||vn("inventory-lot"),itemSource:bn(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",lotType:n,sourceEventId:e.sourceEventId||"",madeDate:e.madeDate||"",roastDate:e.roastDate||"",purchaseDate:e.purchaseDate||"",expireDate:e.expireDate||"",initialQuantity:a,remainingQuantity:s,unit:e.unit||ye(n),unitCost:i,costAmount:c,status:gn(e.status),note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function Sn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>Ye(t)):[]}const fe="yutu-pos-state-v1";function In(e){try{const t=localStorage.getItem(fe);return t?JSON.parse(t):e}catch(t){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",t),e}}function ne(e){try{return localStorage.setItem(fe,JSON.stringify(e)),!0}catch(t){return console.warn("[YUTU POS] localStorage write failed.",t),!1}}const G={drink:"飲品",dessert:"甜品",retail:"熟豆"},En="feature/analytics-dashboard",S="takeout",Qe={id:S,name:"外帶",icon:"🥡"},On=5,p=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),R=new Intl.NumberFormat("zh-TW",{style:"percent",maximumFractionDigits:1}),ve={pourover:{iceExtraPrice:10}};function h(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ke=new URLSearchParams(window.location.search).get("debug")==="1",ge=1,be="YUTU_POS",de={seats:A,products:Je(Et),orders:[],dailyClosings:[],businessEvents:[],inventoryLots:[],inventoryItems:[],inventoryMovements:[],selectedSeatId:A[0].id,selectedCategoryId:k[0].id,selectedOrderId:null,orderDetailMode:"active",orderViewMode:"production",activeView:"floor",historyDate:m(),analyticsRange:"today",analyticsStartDate:m(),analyticsEndDate:m(),analyticsSort:"quantity",salesSort:"amount",businessEventDate:m(),businessEventFormType:"purchase",businessEventItemSource:"manual",businessEventProductId:"",businessEventTypeFilter:"all",editingBusinessEventId:null,inventoryLotType:"dessert",inventoryLotItemSource:"product",inventoryLotProductId:"",inventoryLotStatusFilter:"active",notice:"",debug:{}};let o=V(In(de));function ae(e){return Array.isArray(e)?e.map(t=>{if(typeof t=="string"){const n=t.trim();return n?{name:n,active:!0}:null}if(t&&typeof t=="object"){const n=String(t.name||"").trim();return n?{...t,name:n,active:t.active!==!1}:null}return null}).filter(Boolean):[]}function K(e,{activeOnly:t=!1}={}){return ae(e?.variants).filter(n=>!t||n.active!==!1).map(n=>n.name)}function We(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object"):[]}function Ge(e){const t=e.type||"drink",n=e.category||"espresso",a=t==="drink",s=t==="retail",r=ve[n]||{};return{supportsHot:e.supportsHot??a,supportsIce:e.supportsIce??a,supportsTakeout:e.supportsTakeout??!s,iceExtraPrice:Number(e.iceExtraPrice??(a?r.iceExtraPrice:0))||0}}function kn(e){if(!Array.isArray(e))return[];const t=e.filter(a=>a&&typeof a=="object").map((a,s)=>{const r=Number(a.totalSales)||0,i=Number(a.grossProfit)||0,c=a.date||m(),u=a.closedAt||a.exportedAt||new Date().toISOString();return{...a,id:a.id||`closing-${c}-${s}`,date:c,closedAt:u,orderCount:Number(a.orderCount)||0,totalSales:r,totalCost:Number(a.totalCost)||0,grossProfit:i,grossMargin:Number(a.grossMargin??(r?i/r:0))||0,drinkCount:Number(a.drinkCount)||0,dessertCount:Number(a.dessertCount)||0,retailCount:Number(a.retailCount)||0,exported:!!a.exported,exportedAt:a.exportedAt||null,version:Number(a.version)||null,status:a.status==="superseded"?"superseded":"official",isOfficial:a.isOfficial!==!1&&a.status!=="superseded",supersededBy:a.supersededBy||null,supersededAt:a.supersededAt||null,note:a.note||""}}),n=new Map;return t.forEach(a=>{const s=n.get(a.date)||[];s.push(a),n.set(a.date,s)}),n.forEach(a=>{a.sort((i,c)=>{const u=new Date(i.closedAt)-new Date(c.closedAt);return u!==0?u:String(i.id).localeCompare(String(c.id))}),a.forEach((i,c)=>{i.version=i.version||c+1});const s=a.filter(i=>i.isOfficial),r=s.length?s[s.length-1]:a[a.length-1];r.status="official",r.isOfficial=!0,r.supersededBy=null,r.supersededAt=null,a.forEach(i=>{i.id!==r.id&&(i.status="superseded",i.isOfficial=!1,i.supersededBy=i.supersededBy||r.id,i.supersededAt=i.supersededAt||r.closedAt)})}),t}function Dn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map((t,n)=>({...t,id:t.id||`inventory-item-${Date.now()}-${n}`,name:t.name||"",category:t.category||"",unit:t.unit||"",currentStock:Number(t.currentStock)||0,alertStock:Number(t.alertStock)||0,active:t.active!==!1})):[]}function wn(e){const t=new Set(["purchase","adjustment","sale","waste","self_use"]);return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map((n,a)=>({...n,id:n.id||`inventory-movement-${Date.now()}-${a}`,itemId:n.itemId||"",type:t.has(n.type)?n.type:"adjustment",quantity:Number(n.quantity)||0,createdAt:n.createdAt||new Date().toISOString(),note:n.note||""})):[]}function Je(e){return e.map((t,n)=>{const a=Ge(t);return{...t,...a,requiresTemperature:t.requiresTemperature??(a.supportsHot||a.supportsIce),requiresServiceType:t.requiresServiceType??a.supportsTakeout,sort:t.sort??n+1,note:t.note||"",variants:ae(t.variants),options:We(t.options)}})}function V(e){const t=Array.isArray(e.products)?e.products:Array.isArray(e.menuItems)?e.menuItems:de.products,n=Je(t).map((s,r)=>{const i=Ge(s);return{...s,...i,id:s.id||`product-${Date.now()}-${r}`,name:s.name||"未命名商品",category:s.category||"espresso",type:s.type||"drink",price:Number(s.price)||0,cost:Number(s.cost)||0,requiresTemperature:s.requiresTemperature??(i.supportsHot||i.supportsIce),requiresServiceType:s.requiresServiceType??i.supportsTakeout,active:s.active!==!1,sort:Number(s.sort)||r+1,note:s.note||"",variants:ae(s.variants),options:We(s.options)}}),a=Array.isArray(e.orders)?e.orders.map(s=>({...s,companionSeatIds:Array.isArray(s.companionSeatIds)?s.companionSeatIds:[],linkedSeatIds:Array.isArray(s.linkedSeatIds)?s.linkedSeatIds:Array.isArray(s.companionSeatIds)?s.companionSeatIds:[],customerSource:L(s.customerSource),customerSourceNote:s.customerSourceNote||"",activityLog:Array.isArray(s.activityLog)?s.activityLog:[],items:Array.isArray(s.items)?s.items.map(r=>{const i=Number(r.price)||0,c=Number(r.basePrice??i)||0,u=Number(r.effectivePrice??i)||0,f=s.seatId===S?"外帶":"內用",b=r.requiresTemperature??r.type==="drink",y=r.requiresServiceType??r.type!=="retail";return{...r,quantity:Number(r.quantity)||1,basePrice:c,effectivePrice:u,iceExtra:Number(r.iceExtra??u-c)||0,price:u,cost:Number(r.cost)||0,profit:u-(Number(r.cost)||0),supportsHot:r.supportsHot??b,supportsIce:r.supportsIce??b,supportsTakeout:r.supportsTakeout??y,iceExtraPrice:Number(r.iceExtraPrice??ve[r.category]?.iceExtraPrice??r.iceExtra)||0,temperature:b?r.temperature==="冰"?"冰":"熱":"",serviceType:r.serviceType==="外帶"?"外帶":f,requiresTemperature:b,requiresServiceType:y,variantName:r.variantName||"",served:!!r.served,note:r.note||""}}):[]})):[];return{...de,...e,seats:A,products:n,menuItems:n,orders:a,dailyClosings:kn(e.dailyClosings),businessEvents:le(e.businessEvents),inventoryLots:Sn(e.inventoryLots),inventoryItems:Dn(e.inventoryItems),inventoryMovements:wn(e.inventoryMovements),selectedSeatId:e.selectedSeatId===S?S:A.some(s=>s.id===e.selectedSeatId)?e.selectedSeatId:A[0].id,selectedCategoryId:k.some(s=>s.id===e.selectedCategoryId)?e.selectedCategoryId:k[0].id,historyDate:e.historyDate||m(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||m(),analyticsEndDate:e.analyticsEndDate||m(),analyticsSort:e.analyticsSort||"quantity",businessEventDate:e.businessEventDate||m(),businessEventFormType:Me({formOnly:!0}).some(([s])=>s===e.businessEventFormType)?e.businessEventFormType:"purchase",businessEventItemSource:["product","manual"].includes(e.businessEventItemSource)?e.businessEventItemSource:"manual",businessEventProductId:e.businessEventProductId||"",businessEventTypeFilter:e.businessEventTypeFilter||"all",editingBusinessEventId:e.editingBusinessEventId||null,inventoryLotType:ze().some(([s])=>s===e.inventoryLotType)?e.inventoryLotType:"dessert",inventoryLotItemSource:["product","manual"].includes(e.inventoryLotItemSource)?e.inventoryLotItemSource:"product",inventoryLotProductId:e.inventoryLotProductId||"",inventoryLotStatusFilter:["active","archived","all"].includes(e.inventoryLotStatusFilter)?e.inventoryLotStatusFilter:"active",salesSort:e.salesSort||"amount"}}function m(e=new Date){return F(e)}function F(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?new Date().toISOString().slice(0,10):new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function J(e,t){const n=new Date(`${e}T00:00:00`);return n.setDate(n.getDate()+t),F(n)}function Tn(e=m()){return`${e.slice(0,7)}-01`}function Xe(e=o.analyticsRange){const t=m();if(e==="yesterday"){const n=J(t,-1);return{label:"昨日",startDate:n,endDate:n}}if(e==="seven-days")return{label:"近 7 天",startDate:J(t,-6),endDate:t};if(e==="month")return{label:"本月",startDate:Tn(t),endDate:t};if(e==="custom"){const n=o.analyticsStartDate||t,a=o.analyticsEndDate||n;return{label:`${n} - ${a}`,startDate:n<=a?n:a,endDate:n<=a?a:n}}return{label:"今日",startDate:t,endDate:t}}function An(){return Xe(o.analyticsRange)}function N(e){return new Date(e).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function Ze(e,t=new Date){const n=new Date(e),a=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())||Number.isNaN(a.getTime())?0:Math.max(0,Math.floor((a.getTime()-n.getTime())/6e4))}function re(e){return Ze(e.createdAt,e.checkedOutAt||new Date)}function $e(e){const t=Math.max(0,Math.floor(Number(e)||0));if(t<60)return`${t} 分`;const n=Math.floor(t/60),a=t%60;return a?`${n} 小時 ${a} 分`:`${n} 小時`}function et(e){const t=F(e?.createdAt);return!t||t===m()?"":t===J(m(),-1)?"昨天開單":`${t} 開單`}function Nn(e){return et(e)||`已坐 ${$e(re(e))}`}function se(e){const t=et(e);return t||(e.seatId===S?`已等 ${$e(re(e))}`:Nn(e))}function tt(e){return`停留 ${$e(re(e))}`}function Cn(e){const t=re(e);return t>=90?"stay-danger":t>=60?"stay-warning":""}function l(e){o=V({...o,...e});const t=ne(o);return _(),{storageSaveExecuted:t,renderAfterSaveExecuted:!0}}function $(e,t={}){console.warn(`[YUTU POS] ${e}`,t),o=V({...o,notice:e}),ne(o),_()}function he(){return B(o.selectedSeatId)}function nt(){return E()?.items?.length??0}function x(e,t=!1){Ke&&(o=V({...o,debug:{...o.debug,...e,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId,currentOpenOrderId:he()?.id||"",ordersLength:o.orders.length,selectedOrderItemsLength:nt(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),ne(o),t&&_())}function T(e,t={}){console.warn(`[YUTU POS] addProduct failed: ${e}`,t),x({addProductExecuted:!0,addProductFailureReason:e,...t})}function at(e){return e===S?Qe:o.seats.find(t=>t.id===e)}function O(e){const t=typeof e=="string"?e:e?.seatId;return at(t)?.name||"未命名座位"}function P(e){return[e?.seatId,...Array.isArray(e?.linkedSeatIds)?e.linkedSeatIds:[]].filter(Boolean)}function C(e){return P(e).map(t=>O(t)).join("＋")||O(e)}function Ln(e){const t=typeof e=="string"?e:e?.seatId;return at(t)?.icon||""}function oe(e){return o.products.find(t=>t.id===e)}function B(e){return o.orders.find(t=>t.status==="open"&&P(t).includes(e))}function Pn(){return o.dailyClosings.find(e=>e.date===m()&&e.isOfficial===!0)||null}function Te(){return!!Pn()}function E(){if(o.selectedOrderId){const e=o.orders.find(t=>t.id===o.selectedOrderId);if(e?.status==="open"||e?.status==="paid"&&o.orderDetailMode==="history"||e&&o.activeView!=="floor")return e}return B(o.selectedSeatId)||null}function w(e){return o.orders.filter(t=>t.status==="paid"&&F(t.checkedOutAt)===e)}function q(e){const t=e.reduce((n,a)=>{const s=D(a);return n.revenue+=s.total,n.cost+=s.cost,n.profit+=s.profit,n.drinks+=s.drinks,n.desserts+=s.desserts,n.retail+=a.items.reduce((r,i)=>r+(i.type==="retail"?i.quantity:0),0),n.orderCount+=1,n},{revenue:0,cost:0,profit:0,drinks:0,desserts:0,retail:0,orderCount:0,averageTicket:0});return t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function Se(e){const t=new Map;return w(e).forEach(n=>{n.items.forEach(a=>{const s=Number(a.effectivePrice??a.price)||0,r=`${a.productId||a.name}-${a.name}-${s}-${a.cost}`,i=t.get(r)||{name:a.name,category:rt(a.category),quantity:0,amount:0,cost:0,profit:0};i.quantity+=a.quantity,i.amount+=s*a.quantity,i.cost+=a.cost*a.quantity,i.profit+=(s-a.cost)*a.quantity,t.set(r,i)})}),[...t.values()].sort((n,a)=>o.salesSort==="quantity"&&a.quantity-n.quantity||a.amount-n.amount)}function rt(e){return k.find(t=>t.id===e)?.name||e}function qn(){return Object.fromEntries(k.map(e=>[e.id,e.name]))}function xn(){return{...Object.fromEntries(o.seats.map(e=>[e.id,e.name])),[S]:Qe.name}}function st(){return[...o.products].sort((e,t)=>e.sort-t.sort||e.name.localeCompare(t.name,"zh-Hant"))}function Mn(){return st().filter(e=>e.category===o.selectedCategoryId)}function ot(e){const t={drink:1,dessert:2,retail:3},n={冰:1,熱:2};return[...e].sort((a,s)=>{const r=(t[a.type]||9)-(t[s.type]||9);if(r!==0)return r;const i=a.name.localeCompare(s.name,"zh-Hant");return i!==0?i:(n[a.temperature]||9)-(n[s.temperature]||9)})}function H(e){const t=o.orders.find(r=>r.id===e.id),n=!!t,a=o.orders.map(r=>r.id===e.id?e:r),s=l({orders:a,selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:""});return x({replaceOrderExecuted:!0,replaceOrderMatched:n,beforeItemsLength:t?.items?.length??"",afterItemsLength:e.items?.length??"",storageSaveExecuted:s.storageSaveExecuted,renderAfterSaveExecuted:s.renderAfterSaveExecuted,selectedOrderItemsLength:e.items?.length??0},!0),{...s,replaced:n,afterItemsLength:e.items?.length??0}}function _n(e){const t=B(e);if(t){l({selectedSeatId:e,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"});return}const n=Number(window.prompt("輸入人數","2"));if(!n||n<1)return;const a=Pe({seatId:e,people:n});l({orders:[a,...o.orders],selectedSeatId:e,selectedOrderId:a.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function X(e){return e.variantName?`${e.name}（${e.variantName}）`:e.name}function Rn(e){const t=Object.entries(e.variants||{});return t.length?`
    <details class="variant-details">
      <summary>${t.length} 種口味</summary>
      ${t.map(([n,a])=>`<span>${n} ${a}</span>`).join("")}
    </details>
  `:"-"}function Z(e){return(Array.isArray(e.activityLog)?e.activityLog:[]).map(n=>`${n.type==="checkout"?"結帳":n.type==="undoCheckout"?"撤銷":n.type} ${N(n.at)}`).join("、")}function Un(){const e=Pe({seatId:S,people:1});l({orders:[e,...o.orders],selectedSeatId:S,selectedOrderId:e.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function jn(e){const t=o.orders.find(n=>n.id===e);t&&l({selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:t.status==="paid"?"history":"active",orderViewMode:"production"})}function it(e){return e.items.map(t=>`${t.requiresTemperature&&t.temperature?t.temperature:""}${X(t)}×${t.quantity}`).join("、")}function Vn(e,t="unknown"){try{x({clickedProductId:e||"",productClickSource:t,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const n=E(),a=oe(e);if(x({productFound:!!a}),!a){T("product not found",{productId:e,source:t}),$("找不到商品資料，請到商品管理確認今日菜單。",{productId:e});return}if(a.active===!1){T("product inactive",{productId:e,productName:a.name,source:t}),$(`${a.name} 目前停售，無法加入訂單。`,{productId:e});return}if(!n){T("no open order",{productId:e,source:t,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId,currentOpenOrderId:he()?.id||""}),$("請先選擇座位並新增訂單。",{productId:e,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId});return}if(n.status!=="open"){T("selected order is not open",{productId:e,source:t,orderId:n.id,status:n.status}),$("這張訂單已結帳，請先新增或編輯訂單。",{orderId:n.id,status:n.status});return}const s=ea(a);if(s===null)return;const r=n.items.length,i=wt(n,a,{variantName:s}),c=i.items[i.items.length-1],u=i.items.length;if(x({productFound:!0,addProductFailureReason:"",beforeItemsLength:r,afterItemsLength:u,newItemLineId:c?.lineId||"",selectedOrderItemsLengthBefore:r}),u!==r+1){T("item length did not increase",{beforeItemsLength:r,afterItemsLength:u,lineId:c?.lineId}),$("商品加入失敗：訂單品項數沒有增加。");return}H(i)}catch(n){const a=n instanceof Error?`${n.name}: ${n.message}`:String(n);T(a,{productId:e,source:t}),$(`商品加入失敗：${a}`)}}function ct(e,t,n=null){const a=n?.currentTarget||n?.target?.closest?.("button"),s=a?.getAttribute?.("data-product-id")||a?.dataset?.id||"",r=e||s;if(console.log("[YUTU POS] product click",{id:r,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId}),x({clickedProductId:r||"",productClickSource:t,eventTargetTag:n?.target?.tagName||"",closestButtonFound:!!a,closestButtonAction:a?.dataset?.action||"",datasetId:a?.dataset?.id||"",productDatasetId:a?.getAttribute?.("data-product-id")||"",productFound:!!oe(r),addProductExecuted:!1,addProductFailureReason:""}),!r){T("missing product id from click event",{source:t}),$("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),_();return}Vn(r,t)}function Q(e,t){const n=E();!n||n.status!=="open"||H(Tt(n,e,t))}function Ae(e){const t=E();!t||t.status!=="open"||window.confirm("確定刪除此品項嗎？")&&H(At(t,e))}function Ne(e){const t=E();!t||t.status!=="open"||H({...t,...e})}function z(e,t=""){return o.orders.some(n=>n.status==="open"&&n.id!==t&&P(n).includes(e))}function Fn(){const e=E();if(!e||e.status!=="open"||e.items.length===0)return;const t=D(e);window.confirm(["確定要完成結帳嗎？","",`座位 / 外帶：${O(e)}`,`人數：${e.people}`,`總金額：${p.format(t.total)}`,`品項：${it(e)}`].join(`
`))&&(H(Nt(e,"cash")),l({selectedOrderId:null,activeView:"floor",historyDate:m()}))}function ut(){return[...o.orders].filter(e=>e.status==="paid"&&e.checkedOutAt).sort((e,t)=>new Date(t.checkedOutAt)-new Date(e.checkedOutAt))[0]}function dt(e){return!!(e?.status==="paid"&&e.checkedOutAt&&Ze(e.checkedOutAt,new Date)<=On)}function lt(e){const t=o.orders.find(r=>r.id===e);if(!t){$("找不到要撤銷的結帳訂單。");return}if(!dt(t)){$("此筆結帳已超過 5 分鐘，無法撤銷。");return}if(t.seatId!==S){const r=P(t).find(i=>z(i,t.id));if(r){$(`${O(r)} 已有進行中的訂單，無法撤銷。`);return}}const n=D(t);if(!window.confirm(["確定要撤銷這筆結帳嗎？","",`座位 / 外帶：${C(t)}`,`結帳時間：${N(t.checkedOutAt)}`,`金額：${p.format(n.total)}`].join(`
`)))return;const s=new Date().toISOString();l({orders:o.orders.map(r=>r.id===t.id?{...r,status:"open",paymentMethod:null,checkedOutAt:null,activityLog:[...Array.isArray(r.activityLog)?r.activityLog:[],{type:"undoCheckout",at:s}]}:r),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production",historyDate:m(),notice:`已撤銷 ${C(t)} 的結帳。`})}function Bn(){const e=ut();if(!e){$("目前沒有可撤銷的已結帳訂單。");return}lt(e.id)}function Hn(){const e=E();!e||e.status!=="open"||e.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||l({orders:o.orders.filter(t=>t.id!==e.id),selectedOrderId:null,activeView:"floor"})}function zn(e){const t=o.orders.find(a=>a.id===e);if(!t||t.status!=="paid")return;const n=t.seatId!==S?P(t).find(a=>z(a,t.id)):null;if(n){$(`${O(n)} 已有進行中的訂單，無法轉回編輯。`);return}window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")&&l({orders:o.orders.map(a=>a.id===t.id?{...a,status:"open",paymentMethod:null,lastCheckedOutAt:a.checkedOutAt,checkedOutAt:null}:a),selectedOrderId:t.id,selectedSeatId:t.seatId,activeView:"floor"})}function Yn(e){o.orders.some(t=>t.id===e)&&window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")&&l({orders:o.orders.filter(t=>t.id!==e),selectedOrderId:o.selectedOrderId===e?null:o.selectedOrderId,activeView:"history"})}function Qn(){const e=document.querySelector(".product-form"),t=e?.dataset?.editing?oe(e.dataset.editing):null,n=ae(t?.variants),a=document.querySelector("#product-type").value,s=document.querySelector("#product-variants").value.split(/[\n,，、]/).map(r=>r.trim()).filter(Boolean);return{name:document.querySelector("#product-name").value.trim(),category:document.querySelector("#product-category").value,type:a,price:Number(document.querySelector("#product-price").value),cost:Number(document.querySelector("#product-cost").value),supportsHot:a==="drink"&&document.querySelector("#product-supports-hot").checked,supportsIce:a==="drink"&&document.querySelector("#product-supports-ice").checked,supportsTakeout:document.querySelector("#product-supports-takeout").checked,iceExtraPrice:a==="drink"&&Number(document.querySelector("#product-ice-extra-price").value)||0,sort:Number(document.querySelector("#product-sort").value)||o.products.length+1,note:document.querySelector("#product-note").value.trim(),variants:s.map(r=>n.find(i=>i.name===r)||r),active:document.querySelector("#product-active").checked}}function Kn(e=null){const t=Qn();if(!t.name||Number.isNaN(t.price)||Number.isNaN(t.cost)){window.alert("請輸入品名、售價與成本。");return}if(e){l({products:o.products.map(n=>n.id===e?{...n,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}:n)});return}l({products:[...o.products,{id:`custom-${Date.now()}`,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}]})}function pt(e,t=[],{emptyOnly:n=!1,exceptOrderId:a=""}={}){const s=o.seats.filter(f=>!t.includes(f.id)&&(!n||!z(f.id,a)));if(!s.length)return $("目前沒有可選的空桌。"),null;const r=s.map((f,b)=>`${b+1}. ${f.name}`).join(`
`),i=window.prompt(`${e}
${r}`,"1");if(i===null)return null;const c=Number(i)-1;if(Number.isInteger(c)&&s[c])return s[c];const u=i.trim();return s.find(f=>f.name===u||f.id===u)||null}function Wn(){const e=E();if(!e||e.seatId===S)return;const t=pt("選擇要換到哪一桌：",P(e),{emptyOnly:!0,exceptOrderId:e.id});if(t){if(z(t.id,e.id)){$("目標桌位已有進行中的訂單，無法換桌。");return}window.confirm(`確定將主桌 ${O(e)} 換到 ${t.name} 嗎？關聯桌位會保持不變。`)&&l({orders:o.orders.map(n=>n.id===e.id?{...n,seatId:t.id}:n),selectedSeatId:t.id,selectedOrderId:e.id,activeView:"floor",notice:`已將 ${O(e)} 換到 ${t.name}。`})}}function Gn(){const e=E();if(!e||e.seatId===S)return;const t=P(e),n=pt("選擇新增使用桌位：",t,{emptyOnly:!0,exceptOrderId:e.id});if(n){if(z(n.id,e.id)){$("此桌已有進行中的訂單，不能加入桌位群組。");return}window.confirm(`將 ${n.name} 加入 ${C(e)} 的使用桌位嗎？`)&&l({orders:o.orders.map(a=>a.id===e.id?{...a,linkedSeatIds:[...new Set([...a.linkedSeatIds||[],n.id])]}:a),selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:`${n.name} 已加入 ${C(e)}。`})}}function Jn(e){const t=E();!t||!t.linkedSeatIds?.includes(e)||l({orders:o.orders.map(n=>n.id===t.id?{...n,linkedSeatIds:n.linkedSeatIds.filter(a=>a!==e)}:n),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",notice:`${O(e)} 已從桌位群組移除。`})}function Xn(e){l({products:o.products.map(t=>t.id===e?{...t,active:!t.active}:t)})}function Ce(e){l({activeView:"products",editingProductId:e||null})}function ie(e,t){const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),a=URL.createObjectURL(n),s=document.createElement("a");s.href=a,s.download=e,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(a)}function Zn(e=new Date){const t=F(e),n=`${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`;return`${t}-${n}`}function ea(e){const t=K(e,{activeOnly:!0});if(!t.length)return"";const n=[`選擇 ${e.name} 口味 / 規格：`,...t.map((i,c)=>`${c+1}. ${i}`)].join(`
`),a=window.prompt(n,"1");if(a===null)return null;const s=Number(a)-1;if(Number.isInteger(s)&&t[s])return t[s];const r=a.trim();return t.includes(r)?r:(window.alert("找不到這個口味 / 規格，請重新點選商品。"),null)}function ta(e=o){return{selectedSeatId:e.selectedSeatId||A[0].id,selectedCategoryId:e.selectedCategoryId||k[0].id,selectedOrderId:e.selectedOrderId||null,orderDetailMode:e.orderDetailMode||"active",orderViewMode:e.orderViewMode||"production",activeView:e.activeView||"floor",historyDate:e.historyDate||m(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||m(),analyticsEndDate:e.analyticsEndDate||m(),analyticsSort:e.analyticsSort||"quantity",salesSort:e.salesSort||"amount"}}function Ie(e=m(),t=new Date().toISOString(),n="",a=1){const s=w(e),r=q(s);return{id:`closing-${e}-${t.replace(/[:.]/g,"-")}`,date:e,closedAt:t,version:a,status:"official",isOfficial:!0,supersededBy:null,supersededAt:null,orderCount:r.orderCount,totalSales:r.revenue,totalCost:r.cost,grossProfit:r.profit,grossMargin:r.revenue?r.profit/r.revenue:0,drinkCount:r.drinks,dessertCount:r.desserts,retailCount:r.retail,exported:!0,exportedAt:t,note:n}}function mt(e,t=o.dailyClosings,n=e.closedAt){return[e,...t.map(a=>a.date!==e.date||a.isOfficial!==!0?a:{...a,status:"superseded",isOfficial:!1,supersededBy:e.id,supersededAt:n})]}function na(){return{schemaVersion:ge,app:be,exportType:"full",exportedAt:new Date().toISOString(),storageKey:fe,orders:o.orders,products:o.products,seats:o.seats,dailyClosings:o.dailyClosings,businessEvents:o.businessEvents,inventoryLots:o.inventoryLots,inventoryItems:o.inventoryItems,inventoryMovements:o.inventoryMovements,settings:ta()}}function aa(){ie(`yutu-pos-backup-${Zn()}.json`,na())}function ra(e=m()){const t=w(e);return{schemaVersion:ge,app:be,exportType:"daily",date:e,exportedAt:new Date().toISOString(),dailySummary:q(t),productSalesSummary:Se(e),orders:t,productsSnapshot:o.products}}function yt(e=m(),t=null,n=new Date().toISOString()){const a=w(e);return{schemaVersion:ge,app:be,exportType:"daily-archive",date:e,exportedAt:n,dailySummary:q(a),productSalesSummary:Se(e),orders:a,productsSnapshot:o.products,dailyClosing:t||Ie(e,n)}}function ft(e=m()){ie(`yutu-pos-daily-${e}.json`,ra(e))}function sa(){ft(m())}function oa(){if(o.orders.filter(r=>r.status==="open").length&&!window.confirm("目前仍有未結帳訂單，是否仍要匯出今日報表？"))return;const t=m(),n=new Date().toISOString(),a=o.dailyClosings.filter(r=>r.date===t).length+1,s=Ie(t,n,"",a);l({dailyClosings:mt(s,o.dailyClosings,n)}),ie(`yutu-pos-daily-archive-${t}.json`,yt(t,s,n))}function ia(){if(o.orders.filter(y=>y.status==="open").length){$("仍有未結帳桌位，請先完成結帳或取消訂單後再關店。");return}const t=m(),n=w(t),a=q(n),s=o.businessEvents.filter(y=>y.date===t),r=n.filter(y=>y.paymentMethod==="cash").reduce((y,g)=>y+D(g).total,0),i=n.filter(y=>y.paymentMethod&&y.paymentMethod!=="cash").reduce((y,g)=>y+D(g).total,0);if(!window.confirm(["確認今日營業資料並關店？","",`今日營收：${p.format(a.revenue)}`,`訂單數：${a.orderCount}`,`現金收入：${p.format(r)}`,`電子支付：${p.format(i)}`,`今日 Business Events：${s.length} 筆`].join(`
`)))return;const u=new Date().toISOString(),f=o.dailyClosings.filter(y=>y.date===t).length+1,b=Ie(t,u,"",f);l({dailyClosings:mt(b,o.dailyClosings,u),activeView:"floor",notice:"今日已關店，daily archive 已匯出。"}),ie(`yutu-pos-daily-archive-${t}.json`,yt(t,b,u))}function ca(e){const t=e?.exportType==="full"?{...e.settings||{},orders:e.orders,products:e.products||e.menuItems,menuItems:e.products||e.menuItems,seats:e.seats||A,dailyClosings:e.dailyClosings||[],businessEvents:e.businessEvents||[],inventoryLots:e.inventoryLots||[],inventoryItems:e.inventoryItems||[],inventoryMovements:e.inventoryMovements||[]}:e?.state||e;if(!t||typeof t!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(e?.exportType&&e.exportType!=="full")throw new Error("此檔案不是完整備份，請選擇匯出全部資料的 JSON。");if(!Array.isArray(t.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(t.products)&&!Array.isArray(t.menuItems))throw new Error("備份缺少 products 陣列。");return V(t)}function ua(e){if(!e||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const t=new FileReader;t.onload=()=>{try{const n=JSON.parse(String(t.result||""));if(o=ca(n),!ne(o))throw new Error("localStorage 寫入失敗。");_(),window.alert("備份已匯入。")}catch(n){const a=n instanceof Error?n.message:String(n);$(`匯入失敗：${a}`)}},t.onerror=()=>$("匯入失敗：無法讀取檔案。"),t.readAsText(e,"utf-8")}function da(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&l({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function la(){const e=q(w(m()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${p.format(e.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${p.format(e.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
      <article><span>甜品數</span><strong>${e.desserts}</strong></article>
    </section>
  `}function vt(){return o.orders.filter(e=>e.status==="open").sort((e,t)=>new Date(e.createdAt)-new Date(t.createdAt))}function Ee(e){return(e.items||[]).filter(t=>!t.served)}function gt(e){return e.items?.length>0&&Ee(e).length===0}function Oe(e){if(!e)return{key:"empty",label:"空位",hint:"可入座"};if(!e.items?.length)return{key:"ordering",label:"點餐中",hint:"加入品項"};const t=Ee(e).length;return t===e.items.length?{key:"waiting",label:"等待製作",hint:`${t} 項待出`}:gt(e)?{key:"ready",label:"可結帳",hint:"前往收款"}:{key:"making",label:"製作中",hint:`${t} 項待出`}}function pa(){const e=vt(),t=e.reduce((s,r)=>s+Ee(r).length,0),n=e.filter(gt).length,a=o.seats.filter(s=>!B(s.id)).length;return{openOrders:e,pendingItems:t,readyOrders:n,emptySeats:a}}function ma(e){const t=k.findIndex(n=>n.id===e.category);if(t>=0){const n=k[t];return{key:n.id,label:n.name,order:t+1}}return{key:e.type||"other",label:G[e.type]||"其他",order:8}}function ya(e){const t=(e.items||[]).reduce((n,a)=>{const s=Number(a.quantity)||0;return a.type==="drink"&&(n.drinks+=s),a.type==="dessert"&&(n.desserts+=s),a.type==="retail"&&(n.retail+=s),n},{drinks:0,desserts:0,retail:0});return[t.drinks?`飲品 ${t.drinks}`:"",t.desserts?`甜點 ${t.desserts}`:"",t.retail?`熟豆 ${t.retail}`:""].filter(Boolean).join("｜")||"尚無品項"}function fa(){const e=pa();return`
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
  `}function va(){return`
    <nav class="workspace-nav" aria-label="主要功能">
      ${[{title:"營業",items:[{action:"floor",label:"POS 工作台"},{action:"history",label:"訂單歷史"},{action:"backup",label:"今日結帳"}]},{title:"紀錄與庫存",items:[{action:"business-events",label:"營運事件"},{action:"inventory-lots",label:"庫存現況"}]},{title:"管理與分析",items:[{action:"products",label:"商品"},{action:"analytics",label:"經營分析"}]},{title:"系統",items:[{action:"backup",label:"資料與設定"}]}].map(t=>`
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
  `}function ga(){return`
    <section class="floor-block store-state-block">
      <div class="floor-subtitle">
        <div>
          <h3>桌位狀態</h3>
          <p>空位、製作中與可結帳桌一眼確認</p>
        </div>
      </div>
      <div class="seat-grid">
        ${o.seats.map(e=>{const t=B(e.id),n=t?D(t):null,a=Oe(t),s=t?Cn(t):"";return`
              <button class="seat ${t?"occupied":""} status-${a.key} ${s} ${e.id===o.selectedSeatId?"selected":""}" data-action="seat" data-id="${e.id}">
                <span class="seat-top"><span class="seat-name">${e.name}</span><span class="seat-status">${a.label}</span></span>
                ${t?`<span class="seat-meta">${t.people}人</span>
                       <span class="seat-stay">開單 ${N(t.createdAt)} · ${se(t)}</span>
                       <strong class="seat-total">${p.format(n.total)}</strong>`:'<span class="seat-meta">空位</span><span class="seat-stay"></span><strong class="seat-total subtle">開始</strong>'}
              </button>
            `}).join("")}
      </div>
    </section>
  `}function ba(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${k.map(e=>`
              <button class="${e.id===o.selectedCategoryId?"active":""}" data-action="category" data-id="${e.id}">
                ${e.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${Mn().map(e=>`
              <button class="product ${e.active?"":"inactive"}" data-action="product" data-id="${e.id}" data-product-id="${e.id}" ${e.active?"":"disabled"}>
                <span>${e.name}</span>
                <strong>${p.format(e.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function $a(e,t){if(!e.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let n="";return ot(e.items).map(a=>{const s=t,r=a.requiresTemperature??a.type==="drink",i=a.requiresServiceType??a.type!=="retail",c=[a.supportsHot!==!1?"熱":"",a.supportsIce!==!1?"冰":""].filter(Boolean),u=[r&&a.temperature?a.temperature:"",i&&a.serviceType?a.serviceType:""].filter(Boolean),f=Number(a.effectivePrice??a.price)||0,b=f*a.quantity,y=a.type!==n?`<div class="line-group">${G[a.type]||"其他"}</div>`:"";return n=a.type,`
        ${y}
        <article class="line ${a.served?"served":""}">
          <div class="line-title">
            <strong>${X(a)}</strong>
            <span>${p.format(b)}</span>
          </div>
          <div class="line-meta">
            <span>${u.join("｜")||"一般"}</span>
            <span>×${a.quantity}</span>
            ${a.iceExtra?`<span>冰飲 +${p.format(a.iceExtra)}</span>`:""}
          </div>
          ${s?`<div class="line-readonly">
                  <span>數量 ${a.quantity}</span>
                  ${u.map(g=>`<span>${g}</span>`).join("")}
                  <span>單價 ${p.format(f)}</span>
                  ${a.iceExtra?`<span>冰飲加價 ${p.format(a.iceExtra)}</span>`:""}
                  <span>小計 ${p.format(b)}</span>
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
                            ${c.map(g=>`<button class="${a.temperature===g?"active":""}" data-action="temp" data-id="${a.lineId}" data-value="${g}">${g}</button>`).join("")}
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
      `}).join("")}function ha(e){return e.type==="drink"?`${e.temperature||""}${X(e)}`:X(e)}function Sa(e){const t=new Map;return ot(e.items).forEach(n=>{const a=ma(n).label,s=ha(n),r=t.get(a)||[];r.push({...n,group:a,label:s}),t.set(a,r)}),Object.fromEntries(t)}function Ia(e){const t=Sa(e),n=e.status==="paid",a=[...k.map(s=>s.name),"其他"];return`
    <section class="production-list">
      <header>
        <strong>${O(e)}｜${e.people}人｜${se(e)}</strong>
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
                              <small>${[r.serviceType,O(e)].filter(Boolean).join(" · ")}</small>
                              ${r.note?`<small>${h(r.note)}</small>`:""}
                            </span>
                            ${r.served?'<span class="production-status">已出</span>':""}
                          </button>
                        </li>
                      `).join("")}
                </ul>
              </section>
            `).join("")||'<div class="empty-note">尚無品項</div>'}
    </section>
  `}function Ea(e,t){const n=L(e.customerSource),a=e.customerSourceNote||"",s=h(a);return t?`
      <section class="customer-source-panel readonly">
        <span>Customer source</span>
        <strong>${te(n)}</strong>
        ${a?`<small>${s}</small>`:""}
      </section>
    `:`
    <section class="customer-source-panel">
      <label>
        Customer source
        <select data-action="customer-source" data-id="${e.id}">
          ${Kt().map(([r,i])=>`<option value="${r}" ${n===r?"selected":""}>${i}</option>`).join("")}
        </select>
      </label>
      ${Ue(n)?`<label>
              Note
              <input value="${s}" placeholder="Optional" data-action="customer-source-note" data-id="${e.id}" />
            </label>`:""}
    </section>
  `}function Oa(e,t){const n=L(e.customerSource);return`
    <details class="order-info-panel">
      <summary>
        <span>訂單資訊</span>
        <small>客源：${te(n)}</small>
      </summary>
      ${Ea(e,t)}
    </details>
  `}function ka(){const e=vt(),t=Math.min(e.length,6);return`
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
        ${e.length?e.map((n,a)=>{const s=Oe(n),r=n.id===o.selectedOrderId;return`
                    <button class="queue-order status-${s.key} ${r?"selected":""}" data-action="select-order" data-id="${n.id}">
                      <span class="queue-order-index">${a+1}</span>
                      <div>
                        <span class="queue-order-row"><strong>${C(n)}</strong><em>${s.label}</em></span>
                        <small>${n.people}人 · ${ya(n)}</small>
                        <small class="queue-time">開單 ${N(n.createdAt)} · ${se(n)}</small>
                      </div>
                    </button>
                  `}).join(""):'<div class="empty-note">目前沒有進行中的訂單</div>'}
      </div>
      ${e.length>t?`<p class="queue-more">另有 ${e.length-t} 組，向下捲動查看</p>`:""}
    </section>
  `}function Da(){const e=E();if(!e)return'<aside class="order-panel empty"><span>尚未選擇訂單</span><strong>點選座位、外帶訂單或 Order Queue 開始處理。</strong></aside>';const t=D(e),n=e.status==="paid",a=n&&o.orderDetailMode==="history",s=o.orderViewMode==="production",r=Oe(e),i=(e.linkedSeatIds||[]).map(c=>({id:c,name:O(c)}));return n&&!e.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:e.id,status:e.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${Ln(e)} ${C(e)} · ${r.label}</span>
          <strong>${e.people}人 · 開單 ${N(e.createdAt)}</strong>
          ${n?`<span>結帳 ${N(e.checkedOutAt)} · ${tt(e)} · ${e.paymentMethod==="cash"?"現金":e.paymentMethod||"未記錄付款"}</span>`:`<span>${se(e)}</span>`}
          ${n&&Z(e)?`<span>${Z(e)}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      ${Oa(e,n)}
      ${!n&&e.seatId!==S?`<details class="order-actions-panel">
              <summary>
                <span>桌位操作</span>
                ${i.length?`<small>已加 ${i.length} 桌</small>`:"<small>換桌 / 新增使用桌位</small>"}
              </summary>
              ${i.length?`<small>使用桌位：${i.map(c=>c.name).join("、")}</small>`:""}
              <div>
                <button class="secondary" data-action="move-table">換桌</button>
                <button class="secondary" data-action="add-linked-seat">新增使用桌位</button>
              </div>
              ${i.length?`<div class="linked-seat-list">
                      ${i.map(c=>`<button class="ghost" data-action="remove-linked-seat" data-id="${c.id}">移除 ${c.name}</button>`).join("")}
                    </div>`:""}
            </details>`:""}
      <section class="order-operation-panel">
        <span>訂單操作</span>
        <div class="order-view-toggle">
          <button class="${s?"active":""}" data-action="order-view" data-value="production">出品清單</button>
          <button class="${s?"":"active"}" data-action="order-view" data-value="edit">編輯訂單</button>
        </div>
      </section>
      <div class="line-list">${s?Ia(e):$a(e,n)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${p.format(t.total)}</strong></div>
        <div><span>${s?"下一步":"毛利"}</span><strong>${s?r.hint:p.format(t.profit)}</strong></div>
        ${n?a?'<button class="paid" disabled>已結帳 · 現金</button>':`<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${e.id}">編輯訂單</button>
                 <button class="secondary danger-action" data-action="delete-order" data-id="${e.id}">刪除紀錄</button>`:`<button class="primary" data-action="checkout" ${e.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function wa(){const e=o.editingProductId?oe(o.editingProductId):null,t=e||{name:"",category:o.selectedCategoryId,type:"drink",price:"",cost:"",supportsHot:!0,supportsIce:!0,supportsTakeout:!0,iceExtraPrice:ve[o.selectedCategoryId]?.iceExtraPrice||0,active:!0,sort:o.products.length+1,note:"",variants:[]};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${e?.id||""}">
        <label>品名<input id="product-name" value="${t.name}" /></label>
        <label>類別<select id="product-category">${k.map(n=>`<option value="${n.id}" ${n.id===t.category?"selected":""}>${n.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(G).map(([n,a])=>`<option value="${n}" ${n===t.type?"selected":""}>${a}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${t.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${t.cost}" /></label>
        <label>冰飲加價<input id="product-ice-extra-price" type="number" step="1" value="${Number(t.iceExtraPrice)||0}" /></label>
        <label>排序<input id="product-sort" type="number" step="1" value="${t.sort}" /></label>
        <label class="check-row"><input id="product-supports-hot" type="checkbox" ${t.supportsHot!==!1?"checked":""} /> 可做熱飲</label>
        <label class="check-row"><input id="product-supports-ice" type="checkbox" ${t.supportsIce!==!1?"checked":""} /> 可做冰飲</label>
        <label class="check-row"><input id="product-supports-takeout" type="checkbox" ${t.supportsTakeout!==!1?"checked":""} /> 可外帶</label>
        <label class="wide">口味 / 規格<textarea id="product-variants" placeholder="焙茶、伯爵">${K(t).join(`
`)}</textarea></label>
        <label class="wide">備註<input id="product-note" value="${t.note||""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${t.active!==!1?"checked":""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${e?.id||""}">${e?"儲存商品":"新增商品"}</button>
        ${e?'<button class="secondary" type="button" data-action="new-product">清空表單</button>':""}
      </form>
      <div class="product-admin-list">
        ${st().map(n=>`
              <article class="admin-product ${n.active?"":"inactive"}">
                <div>
                  <strong>${n.sort}. ${n.name}</strong>
                  <span>${rt(n.category)} · ${G[n.type]} · ${p.format(n.price)} / 成本 ${p.format(n.cost)}</span>
                  <small>${[n.supportsHot?"熱":"",n.supportsIce?"冰":"",n.supportsTakeout?"可外帶":"",n.iceExtraPrice?`冰飲 +${p.format(n.iceExtraPrice)}`:""].filter(Boolean).join(" · ")||"無點餐選項"}</small>
                  ${K(n).length?`<small>口味 / 規格：${K(n).join("、")}</small>`:""}
                  ${n.note?`<small>${n.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${n.id}">編輯</button>
                <button class="${n.active?"danger-action":""}" data-action="toggle-product" data-id="${n.id}">${n.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function Ta(){const e=w(o.historyDate),t=q(e),n=Se(o.historyDate),a=ut();return`
    <section class="history">
      <div class="section-title">
        <h2>訂單歷史</h2>
        <div class="actions">
          ${dt(a)?`<button class="ghost danger-action" data-action="undo-order-checkout" data-id="${a.id}">撤銷此筆結帳：${C(a)} · ${p.format(D(a).total)}</button>`:""}
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
        <article><span>營業額</span><strong>${p.format(t.revenue)}</strong></article>
        <article><span>毛利</span><strong>${p.format(t.profit)}</strong></article>
        <article><span>訂單數</span><strong>${t.orderCount}</strong></article>
        <article><span>飲品杯數</span><strong>${t.drinks}</strong></article>
        <article><span>甜品數</span><strong>${t.desserts}</strong></article>
        <article><span>熟豆數</span><strong>${t.retail}</strong></article>
        <article><span>平均客單價</span><strong>${p.format(t.averageTicket)}</strong></article>
      </section>
      <div class="section-title compact">
        <h2>銷售彙總</h2>
        <button class="ghost" data-action="toggle-sales-sort">依${o.salesSort==="amount"?"數量":"金額"}排序</button>
      </div>
      <div class="sales-table">
        ${n.length?`<article class="sales-header"><strong>商品名稱</strong><span>類別</span><span>數量</span><span>銷售金額</span><span>成本</span><span>毛利</span></article>
               ${n.map(r=>`<article><strong>${r.name}</strong><span>${r.category}</span><span>${r.quantity}</span><span>${p.format(r.amount)}</span><span>${p.format(r.cost)}</span><span>${p.format(r.profit)}</span></article>`).join("")}`:'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${e.length?e.map(r=>{const i=D(r),c=`客源：${te(r.customerSource)}${r.customerSourceNote?` (${h(r.customerSourceNote)})`:""}`;return`
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${r.id}">
                        <span>${N(r.checkedOutAt||r.createdAt)} · ${O(r)} · ${r.people}人</span>
                        <strong>${p.format(i.total)}</strong>
                        <small>${c}</small>
                        <small>${it(r)||"無商品"} · ${tt(r)}${Z(r)?` · ${Z(r)}`:""}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${r.id}">刪除</button>
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function Aa(){const e=w(m()),t=q(e);return`
    <section class="management">
      <div class="section-title">
        <h2>資料與設定</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <div class="backup-sections">
        <section class="backup-section">
          <div>
            <h3>今日結帳／日結</h3>
            <p>營業結束前確認今日訂單，匯出日報並建立日結快照。</p>
          </div>
          <div class="backup-actions">
            <button class="primary" data-action="export-closing">結束營業 / 匯出今日報表</button>
            <button class="secondary" data-action="export-today">匯出今日資料</button>
          </div>
        </section>
        <section class="backup-section">
          <div>
            <h3>資料備份與還原</h3>
            <p>完整備份、匯入還原與測試資料清理。匯入與清空會影響此裝置資料。</p>
          </div>
          <div class="backup-actions">
            <button class="primary" data-action="export-all">匯出全部資料</button>
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
  `}function Na(){return[...o.businessEvents].filter(e=>!o.businessEventDate||e.date===o.businessEventDate).filter(e=>o.businessEventTypeFilter==="all"||e.type===o.businessEventTypeFilter).sort((e,t)=>{const n=String(t.date||"").localeCompare(String(e.date||""));return n!==0?n:new Date(t.createdAt||0)-new Date(e.createdAt||0)})}function bt(){return o.businessEvents.find(e=>e.id===o.editingBusinessEventId)||null}function $t(){return o.products.filter(e=>e.active!==!1)}function ke(e){const t=$t();return t.find(n=>n.id===e)||t[0]||null}function ht(){const e=document.querySelector("#business-event-form");if(!e)return;const t=new FormData(e),n=String(t.get("type")||"purchase"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",s=a==="product"?ke(String(t.get("productId")||"")):null,r=bt(),i=s?r?.productId===s.id&&r?.itemName?r.itemName:s.name:String(t.get("itemName")||"").trim(),c=String(t.get("itemCategory")||"").trim(),u=Math.max(1,Math.trunc(Number(t.get("quantity"))||1)),f=Number(t.get("unitCost"))||0,b=Number(t.get("amount"))||0,y=String(t.get("costAmount")??"").trim(),g=y===""?u*f:Number(y)||0;if(a==="product"&&!s){$("請選擇 POS 商品。");return}if(!i){$("請填寫品項名稱。");return}if(n==="purchase"&&b<=0){$("採購事件請填寫採購金額。");return}if(n!=="purchase"&&g<=0){$("報廢、自用、測試或招待請填寫成本金額。");return}const d=Re({...r||{},date:String(t.get("date")||m()),type:n,usageType:n==="purchase"?null:n,itemSource:a,productId:s?.id||"",materialId:"",itemName:i,itemCategory:c,quantity:u,unit:String(t.get("unit")||"").trim(),unitCost:f,amount:n==="purchase"?b:0,costAmount:g,vendor:n==="purchase"?String(t.get("vendor")||"").trim():"",note:String(t.get("note")||"").trim(),updatedAt:new Date().toISOString()}),I=r?o.businessEvents.map(v=>v.id===r.id?d:v):[...o.businessEvents,d];l({businessEvents:I,businessEventDate:d.date,businessEventTypeFilter:"all",businessEventFormType:d.type,businessEventItemSource:d.itemSource,businessEventProductId:d.productId,editingBusinessEventId:null,notice:`${r?"已更新":"已新增"}營運事件：${_e(d.type)} / ${d.itemName}`})}function Ca(){const e=bt(),t=o.businessEventFormType||e?.type||"purchase",n=t==="purchase",a=o.businessEventItemSource||e?.itemSource||"manual",s=$t(),r=a==="product"?ke(o.businessEventProductId||e?.productId||""):null,i=Na(),c=Me({formOnly:!0}),u=e?.date||o.businessEventDate||m(),f=e?.quantity||1,b=e?.itemCategory??r?.category??"",y=e?.unitCost??(r?Number(r.cost)||0:""),g=e?.amount||"",d=y?f*Number(y):0,I=e?.costAmount??"";return`
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
          <input type="date" name="date" value="${u}" />
        </label>
        <label>
          類型
          <select name="type" data-action="business-event-type">
            ${c.map(([v,ce])=>`<option value="${v}" ${t===v?"selected":""}>${ce}</option>`).join("")}
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
                  ${s.map(v=>`<option value="${v.id}" ${r?.id===v.id?"selected":""}>${v.name}</option>`).join("")}
                </select>
              </label>`:`<label>
                品項
                <input name="itemName" value="${h(e?.itemName||"")}" placeholder="例如：牛奶、巴斯克、濾紙" />
              </label>`}
        <label>
          品項類別
          <input name="itemCategory" value="${h(b)}" placeholder="可空白" />
        </label>
        <label>
          數量
          <input name="quantity" type="number" min="1" step="1" value="${f}" />
        </label>
        <label>
          單位
          <input name="unit" value="${h(e?.unit||"")}" placeholder="g / ml / 片 / 包" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${y}" placeholder="0" />
        </label>
        ${n?`<label>
                採購金額
                <input name="amount" type="number" min="0" step="1" value="${g}" placeholder="0" />
              </label>
              <label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${I}" placeholder="${d?`預設 ${d}`:"可空白"}" />
              </label>
              <label>
                供應商
                <input name="vendor" value="${h(e?.vendor||"")}" placeholder="可空白" />
              </label>`:`<label>
                成本金額
                <input name="costAmount" type="number" min="0" step="1" value="${I}" placeholder="${d?`預設 ${d}`:"0"}" />
              </label>`}
        <label class="wide">
          備註
          <input name="note" value="${h(e?.note||"")}" placeholder="可空白" />
        </label>
        <div class="form-actions">
          <button class="primary" data-action="save-business-event">${e?"更新紀錄":"新增紀錄"}</button>
          ${e?'<button class="secondary" data-action="cancel-business-event-edit">取消</button>':""}
        </div>
      </form>

      <div class="business-event-filters">
        <label>
          日期
          <input type="date" value="${o.businessEventDate||m()}" data-action="business-event-date" />
        </label>
        <label>
          類型
          <select data-action="business-event-filter-type">
            <option value="all" ${o.businessEventTypeFilter==="all"?"selected":""}>全部</option>
            ${c.map(([v,ce])=>`<option value="${v}" ${o.businessEventTypeFilter===v?"selected":""}>${ce}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="analytics-table business-event-table">
        ${i.length?`<div class="analytics-table-head"><span>日期</span><span>類型</span><span>品項</span><span>數量</span><span>金額 / 成本</span><span>備註</span><span>操作</span></div>
               ${i.map(v=>`
                 <div>
                   <span>${v.date}</span>
                   <strong>${_e(v.type)}</strong>
                   <span>${h(v.itemName)}</span>
                   <span>${v.quantity||0} ${h(v.unit)}</span>
                   <span>${v.type==="purchase"?p.format(v.amount):p.format(v.costAmount)}</span>
                   <span>${v.vendor?`${h(v.vendor)} / `:""}${h(v.note||"")}</span>
                   <button class="ghost" data-action="edit-business-event" data-id="${v.id}">編輯</button>
                 </div>
               `).join("")}`:'<div class="empty-note">此日期與類型尚無營運事件</div>'}
      </div>
    </section>
  `}function St(e=o.inventoryLotType){const t=e==="roasted_beans"?"retail":"dessert";return o.products.filter(n=>n.active!==!1&&n.type===t)}function ee(e,t=o.inventoryLotType){const n=St(t);return n.find(a=>a.id===e)||n[0]||null}function La(){return[...o.inventoryLots].filter(e=>o.inventoryLotStatusFilter==="all"||e.status===o.inventoryLotStatusFilter).sort((e,t)=>{const n=e.madeDate||e.roastDate||e.purchaseDate||e.createdAt||"",a=t.madeDate||t.roastDate||t.purchaseDate||t.createdAt||"",s=String(a).localeCompare(String(n));return s!==0?s:String(e.itemName).localeCompare(String(t.itemName),"zh-Hant")})}function It(){const e=document.querySelector("#inventory-lot-form");if(!e)return;const t=new FormData(e),n=String(t.get("lotType")||"dessert"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",s=a==="product"?ee(String(t.get("productId")||""),n):null,r=s?s.name:String(t.get("itemName")||"").trim(),i=s?s.category:String(t.get("itemCategory")||"").trim(),c=Math.max(1,Math.trunc(Number(t.get("initialQuantity"))||1)),u=Number(t.get("unitCost"))||0,f=String(t.get("costAmount")??"").trim(),b=f===""?c*u:Number(f)||0;if(a==="product"&&!s){$("請先建立或啟用對應的甜點 / 熟豆商品。");return}if(!r){$("請填寫批次品項名稱。");return}if(c<=0){$("批次初始數量需大於 0。");return}const y=Ye({itemSource:a,productId:s?.id||"",materialId:"",itemName:r,itemCategory:i,lotType:n,sourceEventId:"",madeDate:n==="dessert"?String(t.get("madeDate")||""):"",roastDate:n==="roasted_beans"?String(t.get("roastDate")||""):"",purchaseDate:String(t.get("purchaseDate")||""),expireDate:String(t.get("expireDate")||""),initialQuantity:c,remainingQuantity:c,unit:String(t.get("unit")||ye(n)).trim(),unitCost:u,costAmount:b,status:"active",note:String(t.get("note")||"").trim()});l({inventoryLots:[...o.inventoryLots,y],inventoryLotType:y.lotType,inventoryLotItemSource:y.itemSource==="product"?"product":"manual",inventoryLotProductId:y.productId,inventoryLotStatusFilter:"active",notice:`已新增批次：${y.itemName}`})}function Pa(e){const t=o.inventoryLots.find(n=>n.lotId===e);t&&l({inventoryLots:o.inventoryLots.map(n=>n.lotId===e?{...n,status:"archived",updatedAt:new Date().toISOString()}:n),notice:`已封存批次：${t.itemName}`})}function qa(){const e=o.inventoryLotType||"dessert",t=o.inventoryLotItemSource||"product",n=St(e),a=t==="product"?ee(o.inventoryLotProductId,e):null,s=a?Number(a.cost)||0:"",r=ye(e),i=m(),c=La();return`
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
            ${ze().map(([u,f])=>`<option value="${u}" ${e===u?"selected":""}>${f}</option>`).join("")}
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
          <input name="itemCategory" value="${h(a?.category||"")}" placeholder="可空白" />
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
          <input name="unit" value="${r}" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${s}" placeholder="0" />
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
        ${c.length?`<div class="analytics-table-head"><span>類型</span><span>品項</span><span>日期</span><span>到期</span><span>初始</span><span>剩餘</span><span>成本</span><span>狀態</span><span>備註</span><span>操作</span></div>
               ${c.map(u=>{const f=u.lotType==="roasted_beans"?u.roastDate:u.madeDate;return`
                   <div>
                     <span>${$n(u.lotType)}</span>
                     <strong>${h(u.itemName)}</strong>
                     <span>${f||u.purchaseDate||"-"}</span>
                     <span>${u.expireDate||"-"}</span>
                     <span>${u.initialQuantity} ${h(u.unit)}</span>
                     <span>${u.remainingQuantity} ${h(u.unit)}</span>
                     <span>${p.format(u.costAmount)}</span>
                     <span>${hn(u.status)}</span>
                     <span>${h(u.note||"")}</span>
                     <span>${u.status==="active"?`<button class="ghost" data-action="archive-inventory-lot" data-id="${u.lotId}">封存</button>`:"-"}</span>
                   </div>
                 `}).join("")}`:'<div class="empty-note">目前沒有符合條件的批次</div>'}
      </div>
    </section>
  `}function xa(){const e=An(),t=un(o.orders,{startDate:e.startDate,endDate:e.endDate,sortBy:o.analyticsSort,categoryLabels:qn(),seatLabels:xn(),customerSourceLabels:Wt(),businessEvents:o.businessEvents}),{overview:n,productRanking:a,categorySummary:s,temperatureSummary:r,hourlySummary:i,seatSummary:c,customerSourceSummary:u,businessEventSummary:f}=t,b=a.slice(0,8),y=[["today","今日"],["yesterday","昨日"],["seven-days","近 7 天"],["month","本月"],["custom","自訂日期"]],g=[["quantity","銷售數量"],["revenue","營收"],["profit","毛利"]];return`
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
          ${y.map(([d,I])=>`
                <button class="${o.analyticsRange===d?"active":""}" data-action="analytics-range" data-value="${d}">${I}</button>
              `).join("")}
        </div>
        <div class="analytics-custom-dates">
          <label>開始<input type="date" value="${e.startDate}" data-action="analytics-start-date" /></label>
          <label>結束<input type="date" value="${e.endDate}" data-action="analytics-end-date" /></label>
        </div>
      </div>

      <section class="stats analytics-stats" aria-label="經營分析概覽">
        <article><span>營業額</span><strong>${p.format(n.revenue)}</strong></article>
        <article><span>毛利</span><strong>${p.format(n.profit)}</strong></article>
        <article><span>毛利率</span><strong>${R.format(n.marginRate)}</strong></article>
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
          <article><span>採購金額</span><strong>${p.format(f.purchaseAmount)}</strong></article>
          <article><span>報廢成本</span><strong>${p.format(f.wasteCost)}</strong></article>
          <article><span>自用成本</span><strong>${p.format(f.personalCost)}</strong></article>
          <article><span>測試成本</span><strong>${p.format(f.testCost)}</strong></article>
          <article><span>招待成本</span><strong>${p.format(f.complimentaryCost)}</strong></article>
        </div>
      </section>

      <section class="analytics-panel">
        <div class="section-title compact"><h2>客源分析</h2></div>
        <div class="analytics-table customer-source-table">
          ${u.length?`<div class="analytics-table-head"><span>來源</span><span>訂單數</span><span>營收</span><span>平均客單價</span></div>
                 ${u.map(d=>`
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
            ${g.map(([d,I])=>`<button class="${o.analyticsSort===d?"active":""}" data-action="analytics-sort" data-value="${d}">${I}</button>`).join("")}
          </div>
        </div>
        <div class="analytics-table product-ranking-table">
          ${b.length?`<div class="analytics-table-head">
                    <span>排名</span><span>商品名稱</span><span>類別</span><span>數量</span><span>營收</span><span>成本</span><span>毛利</span><span>毛利率</span><span>口味 / 規格</span><span>冰 / 熱</span><span>內用 / 外帶</span>
                 </div>
                 ${b.map((d,I)=>`
                       <div>
                         <span>${I+1}</span>
                         <strong>${d.name}</strong>
                         <span>${d.category}</span>
                         <span>${d.quantity}</span>
                         <span>${p.format(d.revenue)}</span>
                         <span>${p.format(d.cost)}</span>
                         <span>${p.format(d.profit)}</span>
                         <span>${R.format(d.marginRate)}</span>
                         <span>${Rn(d)}</span>
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
            ${s.length?`<div class="analytics-table-head"><span>類別</span><span>數量</span><span>營收</span><span>毛利</span><span>毛利率</span></div>
                   ${s.map(d=>`
                         <div>
                           <strong>${d.category}</strong>
                           <span>${d.quantity}</span>
                           <span>${p.format(d.revenue)}</span>
                           <span>${p.format(d.profit)}</span>
                           <span>${R.format(d.marginRate)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無類別資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>冰熱分析</h2></div>
          <div class="temperature-summary">
            <article><span>冰飲數量</span><strong>${r.iced}</strong><small>${R.format(r.icedRate)}</small></article>
            <article><span>熱飲數量</span><strong>${r.hot}</strong><small>${R.format(r.hotRate)}</small></article>
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
                           <span>${p.format(d.revenue)}</span>
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
                           <span>${p.format(d.revenue)}</span>
                           <span>${p.format(d.averageTicket)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無座位資料</div>'}
          </div>
        </article>
      </section>
    </section>
  `}function Ma(){return o.activeView==="analytics"?xa():o.activeView==="backup"?Aa():o.activeView==="business-events"?Ca():o.activeView==="inventory-lots"?qa():o.activeView==="products"?wa():o.activeView==="history"?Ta():`
    <main class="workspace">
      <section class="floor workspace-floor">
        <div class="section-title workspace-title">
          ${va()}
        </div>
        ${fa()}
        ${ga()}
        ${ba()}
      </section>
      <aside class="task-column">
        ${ka()}
        ${Da()}
      </aside>
    </main>
  `}function _a(){if(!Ke)return"";const e=o.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",e.clickedProductId||""],["selectedSeatId",e.selectedSeatId||o.selectedSeatId||""],["selectedOrderId",e.selectedOrderId||o.selectedOrderId||""],["current open order id",e.currentOpenOrderId||he()?.id||""],["product found",String(e.productFound??"")],["addProduct executed",String(e.addProductExecuted??"")],["failure reason",e.addProductFailureReason||""],["before items.length",String(e.beforeItemsLength??e.selectedOrderItemsLengthBefore??"")],["after items.length",String(e.afterItemsLength??"")],["new item lineId",e.newItemLineId||""],["replaceOrder executed",String(e.replaceOrderExecuted??"")],["storage save executed",String(e.storageSaveExecuted??"")],["render after save executed",String(e.renderAfterSaveExecuted??"")],["orders.length",String(e.ordersLength??o.orders.length)],["selected items.length",String(e.selectedOrderItemsLength??nt())],["dataset.id",e.datasetId||""],["data-product-id",e.productDatasetId||""],["closest button",String(e.closestButtonFound??"")],["source",e.productClickSource||""],["updated",e.updatedAt||""]].map(([n,a])=>`<div><span>${n}</span><code>${a}</code></div>`).join("")}
    </aside>
  `}function Ra(){document.querySelectorAll(".product[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),ct(e.getAttribute("data-product-id"),"direct-product-button",t)})})}function _(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      ${`<div class="dev-banner">🟠 開發版本 ${En}</div>`}
      <header class="topbar">
        <div class="topbar-title"><span>YUTU POS</span><h1>POS 工作台</h1><small>接單、點餐與結帳</small></div>
        <div class="store-status">
          <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
          <strong>${Te()?"今日已關店":"營業中"}</strong>
          ${Te()?"":'<button class="close-store-button" data-action="close-store">結束營業</button>'}
        </div>
      </header>
      ${o.notice?`<div class="notice" role="status">${o.notice}</div>`:""}
      ${o.activeView==="floor"?"":la()}
      ${Ma()}
      ${_a()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(e=>{e.type="button"}),Ra()}document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t||t.disabled)return;e.preventDefault();const{action:n,id:a,value:s}=t.dataset;if(n==="seat"&&_n(a),n==="new-takeout"&&Un(),n==="select-order"&&jn(a),n==="category"&&l({selectedCategoryId:a}),n==="product"&&ct(a,"delegated-document-click",e),n==="qty"){const r=Number(s);r<=0?Ae(a):Q(a,{quantity:r})}if(n==="temp"&&Q(a,{temperature:s}),n==="service"&&Q(a,{serviceType:s}),n==="served"){const i=E()?.items.find(c=>c.lineId===a);i&&Q(a,{served:!i.served})}if(n==="remove"&&Ae(a),n==="checkout"&&Fn(),n==="close-store"&&ia(),n==="move-table"&&Wn(),n==="add-linked-seat"&&Gn(),n==="remove-linked-seat"&&Jn(a),n==="undo-checkout"&&Bn(),n==="undo-order-checkout"&&lt(a),n==="cancel-order"&&Hn(),n==="edit-paid"&&zn(a),n==="delete-order"&&Yn(a),n==="products"&&l({activeView:"products",editingProductId:null}),n==="business-events"&&l({activeView:"business-events",businessEventDate:o.businessEventDate||m()}),n==="inventory-lots"&&l({activeView:"inventory-lots"}),n==="analytics"&&l({activeView:"analytics"}),n==="backup"&&l({activeView:"backup"}),n==="new-product"&&Ce(null),n==="edit-product"&&Ce(a),n==="toggle-product"&&Xn(a),n==="save-product"&&Kn(a||null),n==="export-all"&&aa(),n==="export-today"&&sa(),n==="export-closing"&&oa(),n==="export-report-date"&&ft(o.historyDate||m()),n==="import-backup"&&document.querySelector("#backup-file")?.click(),n==="reset-test-orders"&&da(),n==="save-business-event"&&ht(),n==="save-inventory-lot"&&It(),n==="archive-inventory-lot"&&Pa(a),n==="edit-business-event"){const r=o.businessEvents.find(i=>i.id===a);r&&l({activeView:"business-events",editingBusinessEventId:a,businessEventFormType:r.type,businessEventItemSource:r.itemSource||"manual",businessEventProductId:r.productId||"",businessEventDate:r.date||o.businessEventDate||m()})}if(n==="cancel-business-event-edit"&&l({editingBusinessEventId:null}),n==="history"&&l({activeView:"history",historyDate:o.historyDate||m()}),n==="floor"&&l({activeView:"floor",orderDetailMode:"active"}),n==="open-history"){const r=o.orders.find(i=>i.id===a);r?l({selectedOrderId:a,selectedSeatId:r.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:a}),$("找不到這筆歷史訂單。"))}if(n==="history-yesterday"&&l({historyDate:J(m(),-1)}),n==="history-today"&&l({historyDate:m()}),n==="toggle-sales-sort"&&l({salesSort:o.salesSort==="amount"?"quantity":"amount"}),n==="order-view"&&l({orderViewMode:s==="production"?"production":"edit"}),n==="analytics-range"){const r=s||"today",i={analyticsRange:r};if(r!=="custom"){const c=Xe(r);i.analyticsStartDate=c.startDate,i.analyticsEndDate=c.endDate}l(i)}n==="analytics-sort"&&l({analyticsSort:s||"quantity"})});document.addEventListener("change",e=>{if(e.target?.id==="backup-file"){ua(e.target.files?.[0]),e.target.value="";return}const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="history-date"&&l({historyDate:t.value||m()}),t.dataset.action==="analytics-start-date"&&l({analyticsRange:"custom",analyticsStartDate:t.value||m()}),t.dataset.action==="analytics-end-date"&&l({analyticsRange:"custom",analyticsEndDate:t.value||m()}),t.dataset.action==="business-event-date"&&l({businessEventDate:t.value||m()}),t.dataset.action==="business-event-filter-type"&&l({businessEventTypeFilter:t.value||"all"}),t.dataset.action==="business-event-type"&&l({businessEventFormType:t.value||"purchase"}),t.dataset.action==="business-event-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?ke(o.businessEventProductId):null;l({businessEventItemSource:n,businessEventProductId:a?.id||""})}if(t.dataset.action==="business-event-product"&&l({businessEventItemSource:"product",businessEventProductId:t.value||""}),t.dataset.action==="inventory-lot-type"){const n=t.value||"dessert",a=ee(o.inventoryLotProductId,n);l({inventoryLotType:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?ee(o.inventoryLotProductId,o.inventoryLotType):null;l({inventoryLotItemSource:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-product"&&l({inventoryLotItemSource:"product",inventoryLotProductId:t.value||""}),t.dataset.action==="inventory-lot-status-filter"&&l({inventoryLotStatusFilter:t.value||"active"}),t.dataset.action==="customer-source"){const n=L(t.value);Ne({customerSource:n,customerSourceNote:Ue(n)&&E()?.customerSourceNote||""})}t.dataset.action==="customer-source-note"&&Ne({customerSourceNote:t.value||""})}});document.addEventListener("submit",e=>{["business-event-form","inventory-lot-form"].includes(e.target?.id)&&(e.preventDefault(),e.target.id==="business-event-form"?ht():It())});_();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
