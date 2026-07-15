(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const T=[{id:"espresso",name:"義式"},{id:"pourover",name:"手沖"},{id:"tea",name:"茶飲"},{id:"dessert",name:"甜品"},{id:"beans",name:"熟豆"}],bt=[{id:"americano",name:"美式咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"latte",name:"拿鐵咖啡",category:"espresso",price:130,cost:26.51,active:!0,type:"drink"},{id:"flat-white",name:"澳白咖啡",category:"espresso",price:120,cost:27.98,active:!0,type:"drink"},{id:"espresso",name:"濃縮咖啡",category:"espresso",price:90,cost:9.735,active:!0,type:"drink"},{id:"shali",name:"夏荔風情",category:"pourover",price:140,cost:17.66,active:!0,type:"drink"},{id:"ceylon",name:"錫爪",category:"pourover",price:150,cost:19.58,active:!0,type:"drink"},{id:"sidama",name:"西達馬",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yirgacheffe",name:"耶加雪菲",category:"pourover",price:130,cost:10.14,active:!0,type:"drink"},{id:"yunnan-hf002",name:"雲南HF002",category:"pourover",price:130,cost:8.86,active:!0,type:"drink"},{id:"yunnan-hf014",name:"雲南HF014",category:"pourover",price:130,cost:9.18,active:!0,type:"drink"},{id:"matcha-latte",name:"抹茶拿鐵",category:"tea",price:140,cost:40.245,active:!0,type:"drink"},{id:"oolong",name:"紅烏龍",category:"tea",price:90,cost:9.99,active:!0,type:"drink"},{id:"taro-basque",name:"芋泥巴斯克",category:"dessert",price:150,cost:39.56,active:!0,type:"dessert"},{id:"fruit-chiffon",name:"水果戚風",category:"dessert",price:130,cost:11.56,active:!0,type:"dessert"},{id:"apple-pound",name:"焦糖蘋果磅蛋糕",category:"dessert",price:120,cost:13.9,active:!0,type:"dessert"},{id:"salt-cookie",name:"海鹽黑巧軟餅乾",category:"dessert",price:80,cost:30.75,active:!0,type:"dessert"},{id:"walnut-cookie",name:"焦糖核桃軟餅乾",category:"dessert",price:80,cost:18.45,active:!0,type:"dessert"},{id:"raspberry-choco",name:"覆盆子黑巧",category:"dessert",price:60,cost:30,active:!0,type:"dessert"},{id:"smore-choco",name:"S'more 黑巧",category:"dessert",price:60,cost:25,active:!0,type:"dessert"},{id:"drip-box",name:"綜合濾掛禮盒",category:"beans",price:300,cost:90,active:!0,type:"retail"},{id:"ceylon-beans",name:"錫爪熟豆1/4磅",category:"beans",price:520,cost:150,active:!0,type:"retail"},{id:"shali-beans",name:"夏荔風情熟豆1/4磅",category:"beans",price:450,cost:120,active:!0,type:"retail"},{id:"sidama-beans",name:"西達馬熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"yirgacheffe-beans",name:"耶加雪菲熟豆1/4磅",category:"beans",price:350,cost:80,active:!0,type:"retail"},{id:"hf002-beans",name:"雲南HF002熟豆1/4磅",category:"beans",price:325,cost:70,active:!0,type:"retail"},{id:"hf014-beans",name:"雲南HF014熟豆1/4磅",category:"beans",price:350,cost:72,active:!0,type:"retail"}],w=[{id:"restroom",name:"廁所旁",icon:"🚻"},{id:"window",name:"靠窗高腳桌",icon:"🪟"},{id:"sofa",name:"沙發區",icon:"🛋"},{id:"corner",name:"轉角",icon:"📐"},{id:"bar",name:"吧台前",icon:"☕"}];function $t(){try{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID()}catch{}return`line-${Date.now()}-${Math.random().toString(36).slice(2)}`}function le(e){return!!(e.supportsHot||e.supportsIce||e.requiresTemperature)}function ht(e,t=""){return le(e)?t==="冰"&&e.supportsIce!==!1?"冰":t==="熱"&&e.supportsHot!==!1||e.supportsHot!==!1?"熱":e.supportsIce!==!1?"冰":"":""}function Le(e){const t=Number(e.basePrice??e.price??e.effectivePrice)||0,n=e.temperature==="冰"&&le(e)&&Number(e.iceExtraPrice??e.iceExtra??0)||0,a=t+n;return{basePrice:t,effectivePrice:a,iceExtra:n,price:a,profit:a-(Number(e.cost)||0)}}function Pe({seatId:e,people:t}){const n=new Date;return{id:`YT-${n.getFullYear()}${String(n.getMonth()+1).padStart(2,"0")}${String(n.getDate()).padStart(2,"0")}-${String(n.getTime()).slice(-5)}`,createdAt:n.toISOString(),seatId:e,people:t,linkedSeatIds:[],items:[],activityLog:[],status:"open",paymentMethod:null,checkedOutAt:null,customerSource:"not_asked",customerSourceNote:""}}function St(e,t,n={}){const a=le(t),r=t.requiresServiceType??t.supportsTakeout!==!1,s=ht(t,n.temperature),i=n.serviceType||(e.seatId==="takeout"?"外帶":"內用"),c={category:t.category,temperature:s,supportsHot:t.supportsHot!==!1,supportsIce:t.supportsIce!==!1,iceExtraPrice:Number(t.iceExtraPrice)||0,basePrice:t.price,cost:t.cost},u=Le(c);return{...e,items:[...e.items,{lineId:$t(),productId:t.id,name:t.name,variantName:n.variantName||"",category:t.category,type:t.type,quantity:1,requiresTemperature:a,requiresServiceType:r,supportsHot:t.supportsHot!==!1,supportsIce:t.supportsIce!==!1,supportsTakeout:t.supportsTakeout!==!1,temperature:s,serviceType:r?i:"",iceExtraPrice:Number(t.iceExtraPrice)||0,basePrice:u.basePrice,effectivePrice:u.effectivePrice,iceExtra:u.iceExtra,price:u.price,cost:t.cost,profit:u.profit,served:!1,note:n.note||""}]}}function It(e,t,n){return{...e,items:e.items.map(a=>{if(a.lineId!==t)return a;const r={...a,...n};return{...r,...Le(r)}})}}function Et(e,t){return{...e,items:e.items.filter(n=>n.lineId!==t)}}function A(e){return e.items.reduce((t,n)=>{const a=Number(n.quantity)||0,r=Number(n.effectivePrice??n.price)||0,s=Number(n.cost)||0;return t.total+=r*a,t.cost+=s*a,t.profit+=(r-s)*a,t.drinks+=n.type==="drink"?a:0,t.desserts+=n.type==="dessert"?a:0,t},{total:0,cost:0,profit:0,drinks:0,desserts:0})}function kt(e,t="cash"){const n=new Date().toISOString();return{...e,status:"paid",paymentMethod:t,checkedOutAt:n,activityLog:[...Array.isArray(e.activityLog)?e.activityLog:[],{type:"checkout",at:n}]}}const pe=[["google_maps","Google 地圖"],["instagram","Instagram"],["threads","Threads"],["walk_in","路過"],["friend_referral","朋友介紹"],["xiaohongshu","小紅書"],["returning_customer","再次回訪"],["other","其他"],["not_asked","未詢問"]],Tt=new Set(pe.map(([e])=>e)),Dt=new Set(["other","friend_referral"]),W=Object.fromEntries(pe);function Ot(e){return Number(e.effectivePrice??e.price)||0}function wt(e){return Number(e.quantity)||0}function At(){return pe}function Nt(){return W}function q(e){return Tt.has(e)?e:"not_asked"}function me(e){const t=q(e);return W[t]||W.not_asked}function qe(e){return Dt.has(q(e))}function Ct(e,t={}){const n=t.customerSourceLabels||W,a=new Map;return(Array.isArray(e)?e:[]).forEach(r=>{const s=q(r.customerSource),i=a.get(s)||{source:s,label:n[s]||me(s),orderCount:0,revenue:0,averageTicket:0};i.orderCount+=1,r.items?.forEach(c=>{i.revenue+=Ot(c)*wt(c)}),i.averageTicket=i.orderCount?i.revenue/i.orderCount:0,a.set(s,i)}),[...a.values()].sort((r,s)=>s.revenue-r.revenue||s.orderCount-r.orderCount)}const xe=["purchase","production","roasting","waste","personal","test","complimentary","stock_adjustment"],Lt=["sale","waste","personal","test","complimentary","other"],Pt=["purchase","waste","personal","test","complimentary"],qt=["product","material","manual"],Me={purchase:"採購",production:"生產",roasting:"烘豆",waste:"報廢",personal:"自用",test:"測試",complimentary:"招待",stock_adjustment:"盤點修正"},xt=new Set(xe),De=new Set(Lt),Mt=new Set(["waste","personal","test","complimentary"]),_t=new Set(qt);function Rt(e="event"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function jt(e){return xt.has(e)?e:"stock_adjustment"}function Ut(e,t){return Mt.has(t)?De.has(e)?e:t:De.has(e)?e:null}function Vt(e){return _t.has(e)?e:"manual"}function z(e){return Number(e)||0}function Ft(e){return Math.max(1,Math.trunc(Number(e)||1))}function _e({formOnly:e=!1}={}){return(e?Pt:xe).map(n=>[n,Me[n]||n])}function Re(e){return Me[e]||e||"未分類"}function je(e={}){const t=new Date().toISOString(),n=jt(e.type),a=Ft(e.quantity),r=e.costAmount&&a?z(e.costAmount)/a:0,s=Number.isFinite(Number(e.unitCost))?z(e.unitCost):r,i=Number.isFinite(Number(e.costAmount))?z(e.costAmount):s*a;return{id:e.id||Rt("business-event"),date:e.date||t.slice(0,10),type:n,usageType:Ut(e.usageType,n),itemId:e.itemId||"",itemSource:Vt(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",quantity:a,unit:e.unit||"",unitCost:s,amount:z(e.amount),costAmount:i,vendor:e.vendor||"",note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function ye(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>je(t)):[]}function Bt(e,t,n){const a=t||"",r=n||a;return ye(e).filter(s=>!a&&!r?!0:!(a&&s.date<a||r&&s.date>r))}function Ht(e,t={}){return(t.startDate||t.endDate?Bt(e,t.startDate,t.endDate):ye(e)).reduce((a,r)=>((r.type==="waste"||r.usageType==="waste")&&(a.wasteCost+=r.costAmount),(r.type==="personal"||r.usageType==="personal")&&(a.personalCost+=r.costAmount),(r.type==="test"||r.usageType==="test")&&(a.testCost+=r.costAmount),(r.type==="complimentary"||r.usageType==="complimentary")&&(a.complimentaryCost+=r.costAmount),r.type==="purchase"&&(a.purchaseAmount+=r.amount||r.costAmount),a),{wasteCost:0,personalCost:0,testCost:0,complimentaryCost:0,purchaseAmount:0})}function Ue(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?"":new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function zt(e){return Ue(e.checkedOutAt||e.createdAt)}function Yt(e){const t=new Date(e.checkedOutAt||e.createdAt);return Number.isNaN(t.getTime())?"--:00":`${String(t.getHours()).padStart(2,"0")}:00`}function j(e){return Number(e.effectivePrice??e.price)||0}function fe(e){return Number(e.cost)||0}function x(e){return Number(e.quantity)||0}function R(e,t){return t?e/t:0}function Ve(e,t={}){return t[e]||e||"其他"}function Qt(e,t={}){return e==="takeout"?t.takeout||"外帶":t[e]||e||"未命名座位"}function Wt(e={}){return Object.values(e).map(t=>({category:t,quantity:0,revenue:0,cost:0,profit:0,marginRate:0}))}function Kt(e,t,n){const a=t||Ue(new Date),r=n||a;return(Array.isArray(e)?e:[]).filter(s=>{if(s.status!=="paid")return!1;const i=zt(s);return i>=a&&i<=r})}function Gt(e){const t=(Array.isArray(e)?e:[]).reduce((n,a)=>(n.orderCount+=1,n.people+=Number(a.people)||0,a.items?.forEach(r=>{const s=x(r),i=j(r)*s,c=fe(r)*s,u=i-c;n.revenue+=i,n.cost+=c,n.profit+=u,n.drinks+=r.type==="drink"?s:0,n.desserts+=r.type==="dessert"?s:0,n.retail+=r.type==="retail"?s:0}),n),{revenue:0,cost:0,profit:0,marginRate:0,orderCount:0,people:0,averageTicket:0,drinks:0,desserts:0,retail:0});return t.marginRate=R(t.profit,t.revenue),t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function Jt(e,t={}){const n=t.categoryLabels||{},a=t.sortBy||"quantity",r=new Map;(Array.isArray(e)?e:[]).forEach(i=>{i.items?.forEach(c=>{const u=x(c),v=j(c),b=fe(c),m=v*u,g=b*u,d=m-g,I=`${c.productId||c.name}-${c.name}`,y=r.get(I)||{productId:c.productId||"",name:c.name,category:Ve(c.category,n),quantity:0,revenue:0,cost:0,profit:0,marginRate:0,iced:0,hot:0,dineIn:0,takeaway:0,variants:{}};y.quantity+=u,y.revenue+=m,y.cost+=g,y.profit+=d,y.iced+=c.type==="drink"&&c.temperature==="冰"?u:0,y.hot+=c.type==="drink"&&c.temperature==="熱"?u:0,y.dineIn+=c.serviceType==="內用"?u:0,y.takeaway+=c.serviceType==="外帶"?u:0,c.variantName&&(y.variants[c.variantName]=(y.variants[c.variantName]||0)+u),y.marginRate=R(y.profit,y.revenue),r.set(I,y)})});const s={quantity:(i,c)=>c.quantity-i.quantity||c.revenue-i.revenue,revenue:(i,c)=>c.revenue-i.revenue||c.quantity-i.quantity,profit:(i,c)=>c.profit-i.profit||c.revenue-i.revenue};return[...r.values()].sort(s[a]||s.quantity)}function Zt(e,t={}){const n=t.categoryLabels||{},a=Wt(n),r=new Map(a.map(s=>[s.category,s]));return(Array.isArray(e)?e:[]).forEach(s=>{s.items?.forEach(i=>{const c=x(i),u=j(i)*c,v=fe(i)*c,b=u-v,m=Ve(i.category,n),g=r.get(m)||{category:m,quantity:0,revenue:0,cost:0,profit:0,marginRate:0};g.quantity+=c,g.revenue+=u,g.cost+=v,g.profit+=b,g.marginRate=R(g.profit,g.revenue),r.set(m,g)})}),[...r.values()]}function Xt(e){const t={iced:0,hot:0,total:0,icedRate:0,hotRate:0};return(Array.isArray(e)?e:[]).forEach(n=>{n.items?.forEach(a=>{if(a.type!=="drink")return;const r=x(a);t.iced+=a.temperature==="冰"?r:0,t.hot+=a.temperature==="熱"?r:0,t.total+=r})}),t.icedRate=R(t.iced,t.total),t.hotRate=R(t.hot,t.total),t}function en(e){const t=new Map;return(Array.isArray(e)?e:[]).forEach(n=>{const a=Yt(n),r=t.get(a)||{hour:a,orderCount:0,revenue:0,drinks:0};r.orderCount+=1,n.items?.forEach(s=>{const i=x(s);r.revenue+=j(s)*i,r.drinks+=s.type==="drink"?i:0}),t.set(a,r)}),[...t.values()].sort((n,a)=>n.hour.localeCompare(a.hour))}function tn(e,t={}){const n=t.seatLabels||{},a=new Map;return(Array.isArray(e)?e:[]).forEach(r=>{const s=Qt(r.seatId,n),i=a.get(s)||{seatName:s,orderCount:0,people:0,revenue:0,averageTicket:0};i.orderCount+=1,i.people+=Number(r.people)||0,r.items?.forEach(c=>{i.revenue+=j(c)*x(c)}),i.averageTicket=i.orderCount?i.revenue/i.orderCount:0,a.set(s,i)}),[...a.values()].sort((r,s)=>s.revenue-r.revenue||s.orderCount-r.orderCount)}function nn(e,t={}){const n=Kt(e,t.startDate,t.endDate);return{startDate:t.startDate,endDate:t.endDate,paidOrders:n,overview:Gt(n),productRanking:Jt(n,t),categorySummary:Zt(n,t),temperatureSummary:Xt(n),hourlySummary:en(n),seatSummary:tn(n,t),customerSourceSummary:Ct(n,t),businessEventSummary:Ht(t.businessEvents,{startDate:t.startDate,endDate:t.endDate})}}const Fe=["dessert","roasted_beans"],an=["active","archived"],rn=["product","material","manual"],Be={dessert:"甜點批次",roasted_beans:"熟豆批次"},sn={active:"使用中",archived:"已封存"},on=new Set(Fe),cn=new Set(an),un=new Set(rn);function dn(e="lot"){try{if(globalThis.crypto?.randomUUID)return`${e}-${globalThis.crypto.randomUUID()}`}catch{}return`${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`}function ce(e){return Number(e)||0}function Oe(e){return Math.max(0,Math.trunc(Number(e)||0))}function He(e){return on.has(e)?e:"dessert"}function ln(e){return cn.has(e)?e:"active"}function pn(e){return un.has(e)?e:"manual"}function ze(){return Fe.map(e=>[e,Be[e]||e])}function mn(e){return Be[e]||e||"未分類"}function yn(e){return sn[e]||e||"未分類"}function ve(e){return He(e)==="roasted_beans"?"g":"片"}function Ye(e={}){const t=new Date().toISOString(),n=He(e.lotType),a=Oe(e.initialQuantity),r=e.remainingQuantity===void 0?a:Oe(e.remainingQuantity),s=e.costAmount&&a?ce(e.costAmount)/a:0,i=Number.isFinite(Number(e.unitCost))?ce(e.unitCost):s,c=Number.isFinite(Number(e.costAmount))?ce(e.costAmount):i*a;return{lotId:e.lotId||e.id||dn("inventory-lot"),itemSource:pn(e.itemSource),productId:e.productId||"",materialId:e.materialId||"",itemName:e.itemName||"",itemCategory:e.itemCategory||"",lotType:n,sourceEventId:e.sourceEventId||"",madeDate:e.madeDate||"",roastDate:e.roastDate||"",purchaseDate:e.purchaseDate||"",expireDate:e.expireDate||"",initialQuantity:a,remainingQuantity:r,unit:e.unit||ve(n),unitCost:i,costAmount:c,status:ln(e.status),note:e.note||"",createdAt:e.createdAt||t,updatedAt:e.updatedAt||t}}function fn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map(t=>Ye(t)):[]}const ge="yutu-pos-state-v1";function vn(e){try{const t=localStorage.getItem(ge);return t?JSON.parse(t):e}catch(t){return console.warn("[YUTU POS] localStorage read failed; using fallback state.",t),e}}function ee(e){try{return localStorage.setItem(ge,JSON.stringify(e)),!0}catch(t){return console.warn("[YUTU POS] localStorage write failed.",t),!1}}const K={drink:"飲品",dessert:"甜品",retail:"熟豆"},gn="feature/analytics-dashboard",S="takeout",Qe={id:S,name:"外帶",icon:"🥡"},bn=5,p=new Intl.NumberFormat("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0}),_=new Intl.NumberFormat("zh-TW",{style:"percent",maximumFractionDigits:1}),be={pourover:{iceExtraPrice:10}};function h(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const We=new URLSearchParams(window.location.search).get("debug")==="1",$e=1,he="YUTU_POS",ue={seats:w,products:Je(bt),orders:[],dailyClosings:[],businessEvents:[],inventoryLots:[],inventoryItems:[],inventoryMovements:[],selectedSeatId:w[0].id,selectedCategoryId:T[0].id,selectedOrderId:null,orderDetailMode:"active",orderViewMode:"production",activeView:"floor",historyDate:f(),analyticsRange:"today",analyticsStartDate:f(),analyticsEndDate:f(),analyticsSort:"quantity",salesSort:"amount",businessEventDate:f(),businessEventFormType:"purchase",businessEventItemSource:"manual",businessEventProductId:"",businessEventTypeFilter:"all",editingBusinessEventId:null,inventoryLotType:"dessert",inventoryLotItemSource:"product",inventoryLotProductId:"",inventoryLotStatusFilter:"active",notice:"",debug:{}};let o=U(vn(ue));function te(e){return Array.isArray(e)?e.map(t=>{if(typeof t=="string"){const n=t.trim();return n?{name:n,active:!0}:null}if(t&&typeof t=="object"){const n=String(t.name||"").trim();return n?{...t,name:n,active:t.active!==!1}:null}return null}).filter(Boolean):[]}function Q(e,{activeOnly:t=!1}={}){return te(e?.variants).filter(n=>!t||n.active!==!1).map(n=>n.name)}function Ke(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object"):[]}function Ge(e){const t=e.type||"drink",n=e.category||"espresso",a=t==="drink",r=t==="retail",s=be[n]||{};return{supportsHot:e.supportsHot??a,supportsIce:e.supportsIce??a,supportsTakeout:e.supportsTakeout??!r,iceExtraPrice:Number(e.iceExtraPrice??(a?s.iceExtraPrice:0))||0}}function $n(e){if(!Array.isArray(e))return[];const t=e.filter(a=>a&&typeof a=="object").map((a,r)=>{const s=Number(a.totalSales)||0,i=Number(a.grossProfit)||0,c=a.date||f(),u=a.closedAt||a.exportedAt||new Date().toISOString();return{...a,id:a.id||`closing-${c}-${r}`,date:c,closedAt:u,orderCount:Number(a.orderCount)||0,totalSales:s,totalCost:Number(a.totalCost)||0,grossProfit:i,grossMargin:Number(a.grossMargin??(s?i/s:0))||0,drinkCount:Number(a.drinkCount)||0,dessertCount:Number(a.dessertCount)||0,retailCount:Number(a.retailCount)||0,exported:!!a.exported,exportedAt:a.exportedAt||null,version:Number(a.version)||null,status:a.status==="superseded"?"superseded":"official",isOfficial:a.isOfficial!==!1&&a.status!=="superseded",supersededBy:a.supersededBy||null,supersededAt:a.supersededAt||null,note:a.note||""}}),n=new Map;return t.forEach(a=>{const r=n.get(a.date)||[];r.push(a),n.set(a.date,r)}),n.forEach(a=>{a.sort((i,c)=>{const u=new Date(i.closedAt)-new Date(c.closedAt);return u!==0?u:String(i.id).localeCompare(String(c.id))}),a.forEach((i,c)=>{i.version=i.version||c+1});const r=a.filter(i=>i.isOfficial),s=r.length?r[r.length-1]:a[a.length-1];s.status="official",s.isOfficial=!0,s.supersededBy=null,s.supersededAt=null,a.forEach(i=>{i.id!==s.id&&(i.status="superseded",i.isOfficial=!1,i.supersededBy=i.supersededBy||s.id,i.supersededAt=i.supersededAt||s.closedAt)})}),t}function hn(e){return Array.isArray(e)?e.filter(t=>t&&typeof t=="object").map((t,n)=>({...t,id:t.id||`inventory-item-${Date.now()}-${n}`,name:t.name||"",category:t.category||"",unit:t.unit||"",currentStock:Number(t.currentStock)||0,alertStock:Number(t.alertStock)||0,active:t.active!==!1})):[]}function Sn(e){const t=new Set(["purchase","adjustment","sale","waste","self_use"]);return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map((n,a)=>({...n,id:n.id||`inventory-movement-${Date.now()}-${a}`,itemId:n.itemId||"",type:t.has(n.type)?n.type:"adjustment",quantity:Number(n.quantity)||0,createdAt:n.createdAt||new Date().toISOString(),note:n.note||""})):[]}function Je(e){return e.map((t,n)=>{const a=Ge(t);return{...t,...a,requiresTemperature:t.requiresTemperature??(a.supportsHot||a.supportsIce),requiresServiceType:t.requiresServiceType??a.supportsTakeout,sort:t.sort??n+1,note:t.note||"",variants:te(t.variants),options:Ke(t.options)}})}function U(e){const t=Array.isArray(e.products)?e.products:Array.isArray(e.menuItems)?e.menuItems:ue.products,n=Je(t).map((r,s)=>{const i=Ge(r);return{...r,...i,id:r.id||`product-${Date.now()}-${s}`,name:r.name||"未命名商品",category:r.category||"espresso",type:r.type||"drink",price:Number(r.price)||0,cost:Number(r.cost)||0,requiresTemperature:r.requiresTemperature??(i.supportsHot||i.supportsIce),requiresServiceType:r.requiresServiceType??i.supportsTakeout,active:r.active!==!1,sort:Number(r.sort)||s+1,note:r.note||"",variants:te(r.variants),options:Ke(r.options)}}),a=Array.isArray(e.orders)?e.orders.map(r=>({...r,companionSeatIds:Array.isArray(r.companionSeatIds)?r.companionSeatIds:[],linkedSeatIds:Array.isArray(r.linkedSeatIds)?r.linkedSeatIds:Array.isArray(r.companionSeatIds)?r.companionSeatIds:[],customerSource:q(r.customerSource),customerSourceNote:r.customerSourceNote||"",activityLog:Array.isArray(r.activityLog)?r.activityLog:[],items:Array.isArray(r.items)?r.items.map(s=>{const i=Number(s.price)||0,c=Number(s.basePrice??i)||0,u=Number(s.effectivePrice??i)||0,v=r.seatId===S?"外帶":"內用",b=s.requiresTemperature??s.type==="drink",m=s.requiresServiceType??s.type!=="retail";return{...s,quantity:Number(s.quantity)||1,basePrice:c,effectivePrice:u,iceExtra:Number(s.iceExtra??u-c)||0,price:u,cost:Number(s.cost)||0,profit:u-(Number(s.cost)||0),supportsHot:s.supportsHot??b,supportsIce:s.supportsIce??b,supportsTakeout:s.supportsTakeout??m,iceExtraPrice:Number(s.iceExtraPrice??be[s.category]?.iceExtraPrice??s.iceExtra)||0,temperature:b?s.temperature==="冰"?"冰":"熱":"",serviceType:s.serviceType==="外帶"?"外帶":v,requiresTemperature:b,requiresServiceType:m,variantName:s.variantName||"",served:!!s.served,note:s.note||""}}):[]})):[];return{...ue,...e,seats:w,products:n,menuItems:n,orders:a,dailyClosings:$n(e.dailyClosings),businessEvents:ye(e.businessEvents),inventoryLots:fn(e.inventoryLots),inventoryItems:hn(e.inventoryItems),inventoryMovements:Sn(e.inventoryMovements),selectedSeatId:e.selectedSeatId===S?S:w.some(r=>r.id===e.selectedSeatId)?e.selectedSeatId:w[0].id,selectedCategoryId:T.some(r=>r.id===e.selectedCategoryId)?e.selectedCategoryId:T[0].id,historyDate:e.historyDate||f(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||f(),analyticsEndDate:e.analyticsEndDate||f(),analyticsSort:e.analyticsSort||"quantity",businessEventDate:e.businessEventDate||f(),businessEventFormType:_e({formOnly:!0}).some(([r])=>r===e.businessEventFormType)?e.businessEventFormType:"purchase",businessEventItemSource:["product","manual"].includes(e.businessEventItemSource)?e.businessEventItemSource:"manual",businessEventProductId:e.businessEventProductId||"",businessEventTypeFilter:e.businessEventTypeFilter||"all",editingBusinessEventId:e.editingBusinessEventId||null,inventoryLotType:ze().some(([r])=>r===e.inventoryLotType)?e.inventoryLotType:"dessert",inventoryLotItemSource:["product","manual"].includes(e.inventoryLotItemSource)?e.inventoryLotItemSource:"product",inventoryLotProductId:e.inventoryLotProductId||"",inventoryLotStatusFilter:["active","archived","all"].includes(e.inventoryLotStatusFilter)?e.inventoryLotStatusFilter:"active",salesSort:e.salesSort||"amount"}}function f(e=new Date){return ne(e)}function ne(e){const t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?new Date().toISOString().slice(0,10):new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function de(e,t){const n=new Date(`${e}T00:00:00`);return n.setDate(n.getDate()+t),ne(n)}function In(e=f()){return`${e.slice(0,7)}-01`}function Ze(e=o.analyticsRange){const t=f();if(e==="yesterday"){const n=de(t,-1);return{label:"昨日",startDate:n,endDate:n}}if(e==="seven-days")return{label:"近 7 天",startDate:de(t,-6),endDate:t};if(e==="month")return{label:"本月",startDate:In(t),endDate:t};if(e==="custom"){const n=o.analyticsStartDate||t,a=o.analyticsEndDate||n;return{label:`${n} - ${a}`,startDate:n<=a?n:a,endDate:n<=a?a:n}}return{label:"今日",startDate:t,endDate:t}}function En(){return Ze(o.analyticsRange)}function P(e){return new Date(e).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}function Xe(e,t=new Date){const n=new Date(e),a=t instanceof Date?t:new Date(t);return Number.isNaN(n.getTime())||Number.isNaN(a.getTime())?0:Math.max(0,Math.floor((a.getTime()-n.getTime())/6e4))}function V(e){return Xe(e.createdAt,e.checkedOutAt||new Date)}function kn(e){return`已坐 ${V(e)} 分鐘`}function ae(e){return e.seatId===S?`已等 ${V(e)} 分鐘`:kn(e)}function Tn(e){const t=V(e);return t>=90?"stay-danger":t>=60?"stay-warning":""}function l(e){o=U({...o,...e});const t=ee(o);return M(),{storageSaveExecuted:t,renderAfterSaveExecuted:!0}}function $(e,t={}){console.warn(`[YUTU POS] ${e}`,t),o=U({...o,notice:e}),ee(o),M()}function Se(){return F(o.selectedSeatId)}function et(){return E()?.items?.length??0}function L(e,t=!1){We&&(o=U({...o,debug:{...o.debug,...e,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId,currentOpenOrderId:Se()?.id||"",ordersLength:o.orders.length,selectedOrderItemsLength:et(),updatedAt:new Date().toLocaleTimeString("zh-TW")}}),ee(o),t&&M())}function O(e,t={}){console.warn(`[YUTU POS] addProduct failed: ${e}`,t),L({addProductExecuted:!0,addProductFailureReason:e,...t})}function tt(e){return e===S?Qe:o.seats.find(t=>t.id===e)}function k(e){const t=typeof e=="string"?e:e?.seatId;return tt(t)?.name||"未命名座位"}function N(e){return[e?.seatId,...Array.isArray(e?.linkedSeatIds)?e.linkedSeatIds:[]].filter(Boolean)}function G(e){return N(e).map(t=>k(t)).join("＋")||k(e)}function Dn(e){const t=typeof e=="string"?e:e?.seatId;return tt(t)?.icon||""}function re(e){return o.products.find(t=>t.id===e)}function F(e){return o.orders.find(t=>t.status==="open"&&N(t).includes(e))}function On(){return o.dailyClosings.find(e=>e.date===f()&&e.isOfficial===!0)||null}function we(){return!!On()}function E(){if(o.selectedOrderId){const e=o.orders.find(t=>t.id===o.selectedOrderId);if(e?.status==="open"||e?.status==="paid"&&o.orderDetailMode==="history"||e&&o.activeView!=="floor")return e}return F(o.selectedSeatId)||null}function D(e){return o.orders.filter(t=>t.status==="paid"&&ne(t.checkedOutAt)===e)}function C(e){const t=e.reduce((n,a)=>{const r=A(a);return n.revenue+=r.total,n.cost+=r.cost,n.profit+=r.profit,n.drinks+=r.drinks,n.desserts+=r.desserts,n.retail+=a.items.reduce((s,i)=>s+(i.type==="retail"?i.quantity:0),0),n.orderCount+=1,n},{revenue:0,cost:0,profit:0,drinks:0,desserts:0,retail:0,orderCount:0,averageTicket:0});return t.averageTicket=t.orderCount?t.revenue/t.orderCount:0,t}function Ie(e){const t=new Map;return D(e).forEach(n=>{n.items.forEach(a=>{const r=Number(a.effectivePrice??a.price)||0,s=`${a.productId||a.name}-${a.name}-${r}-${a.cost}`,i=t.get(s)||{name:a.name,category:nt(a.category),quantity:0,amount:0,cost:0,profit:0};i.quantity+=a.quantity,i.amount+=r*a.quantity,i.cost+=a.cost*a.quantity,i.profit+=(r-a.cost)*a.quantity,t.set(s,i)})}),[...t.values()].sort((n,a)=>o.salesSort==="quantity"&&a.quantity-n.quantity||a.amount-n.amount)}function nt(e){return T.find(t=>t.id===e)?.name||e}function wn(){return Object.fromEntries(T.map(e=>[e.id,e.name]))}function An(){return{...Object.fromEntries(o.seats.map(e=>[e.id,e.name])),[S]:Qe.name}}function at(){return[...o.products].sort((e,t)=>e.sort-t.sort||e.name.localeCompare(t.name,"zh-Hant"))}function Nn(){return at().filter(e=>e.category===o.selectedCategoryId)}function rt(e){const t={drink:1,dessert:2,retail:3},n={冰:1,熱:2};return[...e].sort((a,r)=>{const s=(t[a.type]||9)-(t[r.type]||9);if(s!==0)return s;const i=a.name.localeCompare(r.name,"zh-Hant");return i!==0?i:(n[a.temperature]||9)-(n[r.temperature]||9)})}function B(e){const t=o.orders.find(s=>s.id===e.id),n=!!t,a=o.orders.map(s=>s.id===e.id?e:s),r=l({orders:a,selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:""});return L({replaceOrderExecuted:!0,replaceOrderMatched:n,beforeItemsLength:t?.items?.length??"",afterItemsLength:e.items?.length??"",storageSaveExecuted:r.storageSaveExecuted,renderAfterSaveExecuted:r.renderAfterSaveExecuted,selectedOrderItemsLength:e.items?.length??0},!0),{...r,replaced:n,afterItemsLength:e.items?.length??0}}function Cn(e){const t=F(e);if(t){l({selectedSeatId:e,selectedOrderId:t.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"});return}const n=Number(window.prompt("輸入人數","2"));if(!n||n<1)return;const a=Pe({seatId:e,people:n});l({orders:[a,...o.orders],selectedSeatId:e,selectedOrderId:a.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function J(e){return e.variantName?`${e.name}（${e.variantName}）`:e.name}function Ln(e){const t=Object.entries(e.variants||{});return t.length?`
    <details class="variant-details">
      <summary>${t.length} 種口味</summary>
      ${t.map(([n,a])=>`<span>${n} ${a}</span>`).join("")}
    </details>
  `:"-"}function Z(e){return(Array.isArray(e.activityLog)?e.activityLog:[]).map(n=>`${n.type==="checkout"?"結帳":n.type==="undoCheckout"?"撤銷":n.type} ${P(n.at)}`).join("、")}function Pn(){const e=Pe({seatId:S,people:1});l({orders:[e,...o.orders],selectedSeatId:S,selectedOrderId:e.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production"})}function qn(e){const t=o.orders.find(n=>n.id===e);t&&l({selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",orderDetailMode:t.status==="paid"?"history":"active",orderViewMode:"production"})}function st(e){return e.items.map(t=>`${t.requiresTemperature&&t.temperature?t.temperature:""}${J(t)}×${t.quantity}`).join("、")}function xn(e,t="unknown"){try{L({clickedProductId:e||"",productClickSource:t,addProductExecuted:!0,addProductFailureReason:"",replaceOrderExecuted:!1,storageSaveExecuted:!1,renderAfterSaveExecuted:!1});const n=E(),a=re(e);if(L({productFound:!!a}),!a){O("product not found",{productId:e,source:t}),$("找不到商品資料，請到商品管理確認今日菜單。",{productId:e});return}if(a.active===!1){O("product inactive",{productId:e,productName:a.name,source:t}),$(`${a.name} 目前停售，無法加入訂單。`,{productId:e});return}if(!n){O("no open order",{productId:e,source:t,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId,currentOpenOrderId:Se()?.id||""}),$("請先選擇座位並新增訂單。",{productId:e,selectedOrderId:o.selectedOrderId,selectedSeatId:o.selectedSeatId});return}if(n.status!=="open"){O("selected order is not open",{productId:e,source:t,orderId:n.id,status:n.status}),$("這張訂單已結帳，請先新增或編輯訂單。",{orderId:n.id,status:n.status});return}const r=Kn(a);if(r===null)return;const s=n.items.length,i=St(n,a,{variantName:r}),c=i.items[i.items.length-1],u=i.items.length;if(L({productFound:!0,addProductFailureReason:"",beforeItemsLength:s,afterItemsLength:u,newItemLineId:c?.lineId||"",selectedOrderItemsLengthBefore:s}),u!==s+1){O("item length did not increase",{beforeItemsLength:s,afterItemsLength:u,lineId:c?.lineId}),$("商品加入失敗：訂單品項數沒有增加。");return}B(i)}catch(n){const a=n instanceof Error?`${n.name}: ${n.message}`:String(n);O(a,{productId:e,source:t}),$(`商品加入失敗：${a}`)}}function ot(e,t,n=null){const a=n?.currentTarget||n?.target?.closest?.("button"),r=a?.getAttribute?.("data-product-id")||a?.dataset?.id||"",s=e||r;if(console.log("[YUTU POS] product click",{id:s,selectedSeatId:o.selectedSeatId,selectedOrderId:o.selectedOrderId}),L({clickedProductId:s||"",productClickSource:t,eventTargetTag:n?.target?.tagName||"",closestButtonFound:!!a,closestButtonAction:a?.dataset?.action||"",datasetId:a?.dataset?.id||"",productDatasetId:a?.getAttribute?.("data-product-id")||"",productFound:!!re(s),addProductExecuted:!1,addProductFailureReason:""}),!s){O("missing product id from click event",{source:t}),$("商品點擊沒有讀到商品 ID，請回報 Debug Panel。"),M();return}xn(s,t)}function Y(e,t){const n=E();!n||n.status!=="open"||B(It(n,e,t))}function Ae(e){const t=E();!t||t.status!=="open"||window.confirm("確定刪除此品項嗎？")&&B(Et(t,e))}function Ne(e){const t=E();!t||t.status!=="open"||B({...t,...e})}function H(e,t=""){return o.orders.some(n=>n.status==="open"&&n.id!==t&&N(n).includes(e))}function Mn(){const e=E();if(!e||e.status!=="open"||e.items.length===0)return;const t=A(e);window.confirm(["確定要完成結帳嗎？","",`座位 / 外帶：${k(e)}`,`人數：${e.people}`,`總金額：${p.format(t.total)}`,`品項：${st(e)}`].join(`
`))&&(B(kt(e,"cash")),l({selectedOrderId:null,activeView:"floor",historyDate:f()}))}function _n(){return[...o.orders].filter(e=>e.status==="paid"&&e.checkedOutAt).sort((e,t)=>new Date(t.checkedOutAt)-new Date(e.checkedOutAt))[0]}function Rn(){const e=_n();if(!e){$("目前沒有可撤銷的已結帳訂單。");return}if(Xe(e.checkedOutAt,new Date)>bn){$("最後一筆結帳已超過 5 分鐘，無法撤銷。");return}if(e.seatId!==S){const n=N(e).find(a=>H(a,e.id));if(n){$(`${k(n)} 已有進行中的訂單，無法撤銷。`);return}}if(!window.confirm("確定要撤銷最後一次結帳嗎？"))return;const t=new Date().toISOString();l({orders:o.orders.map(n=>n.id===e.id?{...n,status:"open",paymentMethod:null,checkedOutAt:null,activityLog:[...Array.isArray(n.activityLog)?n.activityLog:[],{type:"undoCheckout",at:t}]}:n),selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",orderDetailMode:"active",orderViewMode:"production",historyDate:f(),notice:"已撤銷最後一次結帳。"})}function jn(){const e=E();!e||e.status!=="open"||e.items.length>0&&!window.confirm("這張訂單已有品項，確定要取消嗎？")||l({orders:o.orders.filter(t=>t.id!==e.id),selectedOrderId:null,activeView:"floor"})}function Un(e){const t=o.orders.find(a=>a.id===e);if(!t||t.status!=="paid")return;const n=t.seatId!==S?N(t).find(a=>H(a,t.id)):null;if(n){$(`${k(n)} 已有進行中的訂單，無法轉回編輯。`);return}window.confirm("要把這張歷史訂單退回可編輯狀態嗎？修改後需要重新結帳。")&&l({orders:o.orders.map(a=>a.id===t.id?{...a,status:"open",paymentMethod:null,lastCheckedOutAt:a.checkedOutAt,checkedOutAt:null}:a),selectedOrderId:t.id,selectedSeatId:t.seatId,activeView:"floor"})}function Vn(e){o.orders.some(t=>t.id===e)&&window.confirm("確定刪除這筆訂單紀錄嗎？這個動作無法復原。")&&l({orders:o.orders.filter(t=>t.id!==e),selectedOrderId:o.selectedOrderId===e?null:o.selectedOrderId,activeView:"history"})}function Fn(){const e=document.querySelector(".product-form"),t=e?.dataset?.editing?re(e.dataset.editing):null,n=te(t?.variants),a=document.querySelector("#product-type").value,r=document.querySelector("#product-variants").value.split(/[\n,，、]/).map(s=>s.trim()).filter(Boolean);return{name:document.querySelector("#product-name").value.trim(),category:document.querySelector("#product-category").value,type:a,price:Number(document.querySelector("#product-price").value),cost:Number(document.querySelector("#product-cost").value),supportsHot:a==="drink"&&document.querySelector("#product-supports-hot").checked,supportsIce:a==="drink"&&document.querySelector("#product-supports-ice").checked,supportsTakeout:document.querySelector("#product-supports-takeout").checked,iceExtraPrice:a==="drink"&&Number(document.querySelector("#product-ice-extra-price").value)||0,sort:Number(document.querySelector("#product-sort").value)||o.products.length+1,note:document.querySelector("#product-note").value.trim(),variants:r.map(s=>n.find(i=>i.name===s)||s),active:document.querySelector("#product-active").checked}}function Bn(e=null){const t=Fn();if(!t.name||Number.isNaN(t.price)||Number.isNaN(t.cost)){window.alert("請輸入品名、售價與成本。");return}if(e){l({products:o.products.map(n=>n.id===e?{...n,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}:n)});return}l({products:[...o.products,{id:`custom-${Date.now()}`,...t,requiresTemperature:t.supportsHot||t.supportsIce,requiresServiceType:t.supportsTakeout}]})}function it(e,t=[],{emptyOnly:n=!1,exceptOrderId:a=""}={}){const r=o.seats.filter(v=>!t.includes(v.id)&&(!n||!H(v.id,a)));if(!r.length)return $("目前沒有可選的空桌。"),null;const s=r.map((v,b)=>`${b+1}. ${v.name}`).join(`
`),i=window.prompt(`${e}
${s}`,"1");if(i===null)return null;const c=Number(i)-1;if(Number.isInteger(c)&&r[c])return r[c];const u=i.trim();return r.find(v=>v.name===u||v.id===u)||null}function Hn(){const e=E();if(!e||e.seatId===S)return;const t=it("選擇要換到哪一桌：",N(e),{emptyOnly:!0,exceptOrderId:e.id});if(t){if(H(t.id,e.id)){$("目標桌位已有進行中的訂單，無法換桌。");return}window.confirm(`確定將主桌 ${k(e)} 換到 ${t.name} 嗎？關聯桌位會保持不變。`)&&l({orders:o.orders.map(n=>n.id===e.id?{...n,seatId:t.id}:n),selectedSeatId:t.id,selectedOrderId:e.id,activeView:"floor",notice:`已將 ${k(e)} 換到 ${t.name}。`})}}function zn(){const e=E();if(!e||e.seatId===S)return;const t=N(e),n=it("選擇新增使用桌位：",t,{emptyOnly:!0,exceptOrderId:e.id});if(n){if(H(n.id,e.id)){$("此桌已有進行中的訂單，不能加入桌位群組。");return}window.confirm(`將 ${n.name} 加入 ${G(e)} 的使用桌位嗎？`)&&l({orders:o.orders.map(a=>a.id===e.id?{...a,linkedSeatIds:[...new Set([...a.linkedSeatIds||[],n.id])]}:a),selectedSeatId:e.seatId,selectedOrderId:e.id,activeView:"floor",notice:`${n.name} 已加入 ${G(e)}。`})}}function Yn(e){const t=E();!t||!t.linkedSeatIds?.includes(e)||l({orders:o.orders.map(n=>n.id===t.id?{...n,linkedSeatIds:n.linkedSeatIds.filter(a=>a!==e)}:n),selectedSeatId:t.seatId,selectedOrderId:t.id,activeView:"floor",notice:`${k(e)} 已從桌位群組移除。`})}function Qn(e){l({products:o.products.map(t=>t.id===e?{...t,active:!t.active}:t)})}function Ce(e){l({activeView:"products",editingProductId:e||null})}function se(e,t){const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json;charset=utf-8"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download=e,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(a)}function Wn(e=new Date){const t=ne(e),n=`${String(e.getHours()).padStart(2,"0")}${String(e.getMinutes()).padStart(2,"0")}`;return`${t}-${n}`}function Kn(e){const t=Q(e,{activeOnly:!0});if(!t.length)return"";const n=[`選擇 ${e.name} 口味 / 規格：`,...t.map((i,c)=>`${c+1}. ${i}`)].join(`
`),a=window.prompt(n,"1");if(a===null)return null;const r=Number(a)-1;if(Number.isInteger(r)&&t[r])return t[r];const s=a.trim();return t.includes(s)?s:(window.alert("找不到這個口味 / 規格，請重新點選商品。"),null)}function Gn(e=o){return{selectedSeatId:e.selectedSeatId||w[0].id,selectedCategoryId:e.selectedCategoryId||T[0].id,selectedOrderId:e.selectedOrderId||null,orderDetailMode:e.orderDetailMode||"active",orderViewMode:e.orderViewMode||"production",activeView:e.activeView||"floor",historyDate:e.historyDate||f(),analyticsRange:e.analyticsRange||"today",analyticsStartDate:e.analyticsStartDate||f(),analyticsEndDate:e.analyticsEndDate||f(),analyticsSort:e.analyticsSort||"quantity",salesSort:e.salesSort||"amount"}}function Ee(e=f(),t=new Date().toISOString(),n="",a=1){const r=D(e),s=C(r);return{id:`closing-${e}-${t.replace(/[:.]/g,"-")}`,date:e,closedAt:t,version:a,status:"official",isOfficial:!0,supersededBy:null,supersededAt:null,orderCount:s.orderCount,totalSales:s.revenue,totalCost:s.cost,grossProfit:s.profit,grossMargin:s.revenue?s.profit/s.revenue:0,drinkCount:s.drinks,dessertCount:s.desserts,retailCount:s.retail,exported:!0,exportedAt:t,note:n}}function ct(e,t=o.dailyClosings,n=e.closedAt){return[e,...t.map(a=>a.date!==e.date||a.isOfficial!==!0?a:{...a,status:"superseded",isOfficial:!1,supersededBy:e.id,supersededAt:n})]}function Jn(){return{schemaVersion:$e,app:he,exportType:"full",exportedAt:new Date().toISOString(),storageKey:ge,orders:o.orders,products:o.products,seats:o.seats,dailyClosings:o.dailyClosings,businessEvents:o.businessEvents,inventoryLots:o.inventoryLots,inventoryItems:o.inventoryItems,inventoryMovements:o.inventoryMovements,settings:Gn()}}function Zn(){se(`yutu-pos-backup-${Wn()}.json`,Jn())}function Xn(e=f()){const t=D(e);return{schemaVersion:$e,app:he,exportType:"daily",date:e,exportedAt:new Date().toISOString(),dailySummary:C(t),productSalesSummary:Ie(e),orders:t,productsSnapshot:o.products}}function ut(e=f(),t=null,n=new Date().toISOString()){const a=D(e);return{schemaVersion:$e,app:he,exportType:"daily-archive",date:e,exportedAt:n,dailySummary:C(a),productSalesSummary:Ie(e),orders:a,productsSnapshot:o.products,dailyClosing:t||Ee(e,n)}}function dt(e=f()){se(`yutu-pos-daily-${e}.json`,Xn(e))}function ea(){dt(f())}function ta(){if(o.orders.filter(s=>s.status==="open").length&&!window.confirm("目前仍有未結帳訂單，是否仍要匯出今日報表？"))return;const t=f(),n=new Date().toISOString(),a=o.dailyClosings.filter(s=>s.date===t).length+1,r=Ee(t,n,"",a);l({dailyClosings:ct(r,o.dailyClosings,n)}),se(`yutu-pos-daily-archive-${t}.json`,ut(t,r,n))}function na(){if(o.orders.filter(m=>m.status==="open").length){$("仍有未結帳桌位，請先完成結帳或取消訂單後再關店。");return}const t=f(),n=D(t),a=C(n),r=o.businessEvents.filter(m=>m.date===t),s=n.filter(m=>m.paymentMethod==="cash").reduce((m,g)=>m+A(g).total,0),i=n.filter(m=>m.paymentMethod&&m.paymentMethod!=="cash").reduce((m,g)=>m+A(g).total,0);if(!window.confirm(["確認今日營業資料並關店？","",`今日營收：${p.format(a.revenue)}`,`訂單數：${a.orderCount}`,`現金收入：${p.format(s)}`,`電子支付：${p.format(i)}`,`今日 Business Events：${r.length} 筆`].join(`
`)))return;const u=new Date().toISOString(),v=o.dailyClosings.filter(m=>m.date===t).length+1,b=Ee(t,u,"",v);l({dailyClosings:ct(b,o.dailyClosings,u),activeView:"floor",notice:"今日已關店，daily archive 已匯出。"}),se(`yutu-pos-daily-archive-${t}.json`,ut(t,b,u))}function aa(e){const t=e?.exportType==="full"?{...e.settings||{},orders:e.orders,products:e.products||e.menuItems,menuItems:e.products||e.menuItems,seats:e.seats||w,dailyClosings:e.dailyClosings||[],businessEvents:e.businessEvents||[],inventoryLots:e.inventoryLots||[],inventoryItems:e.inventoryItems||[],inventoryMovements:e.inventoryMovements||[]}:e?.state||e;if(!t||typeof t!="object")throw new Error("JSON 不是可用的 POS 備份格式。");if(e?.exportType&&e.exportType!=="full")throw new Error("此檔案不是完整備份，請選擇匯出全部資料的 JSON。");if(!Array.isArray(t.orders))throw new Error("備份缺少 orders 陣列。");if(!Array.isArray(t.products)&&!Array.isArray(t.menuItems))throw new Error("備份缺少 products 陣列。");return U(t)}function ra(e){if(!e||!window.confirm("匯入會覆蓋目前本機資料，確定繼續嗎？"))return;const t=new FileReader;t.onload=()=>{try{const n=JSON.parse(String(t.result||""));if(o=aa(n),!ee(o))throw new Error("localStorage 寫入失敗。");M(),window.alert("備份已匯入。")}catch(n){const a=n instanceof Error?n.message:String(n);$(`匯入失敗：${a}`)}},t.onerror=()=>$("匯入失敗：無法讀取檔案。"),t.readAsText(e,"utf-8")}function sa(){window.confirm("這會清空所有訂單紀錄，但保留商品與座位，確定嗎？")&&l({orders:[],selectedOrderId:null,activeView:"backup",notice:"已清空測試訂單紀錄，商品與座位已保留。"})}function oa(){const e=C(D(f()));return`
    <section class="stats" aria-label="今日統計">
      <article><span>今日營收</span><strong>${p.format(e.revenue)}</strong></article>
      <article><span>今日毛利</span><strong>${p.format(e.profit)}</strong></article>
      <article><span>飲品杯數</span><strong>${e.drinks}</strong></article>
      <article><span>甜品數</span><strong>${e.desserts}</strong></article>
    </section>
  `}function lt(){return o.orders.filter(e=>e.status==="open").sort((e,t)=>new Date(e.createdAt)-new Date(t.createdAt))}function ke(e){return(e.items||[]).filter(t=>!t.served)}function pt(e){return e.items?.length>0&&ke(e).length===0}function oe(e){if(!e)return{key:"empty",label:"空位",hint:"可入座"};if(!e.items?.length)return{key:"ordering",label:"點餐中",hint:"加入品項"};const t=ke(e).length;return t===e.items.length?{key:"waiting",label:"等待製作",hint:`${t} 項待出`}:pt(e)?{key:"ready",label:"可結帳",hint:"前往收款"}:{key:"making",label:"製作中",hint:`${t} 項待出`}}function ia(){const e=lt(),t=e.reduce((r,s)=>r+ke(s).length,0),n=e.filter(pt).length,a=o.seats.filter(r=>!F(r.id)).length;return{openOrders:e,pendingItems:t,readyOrders:n,emptySeats:a}}function ca(e){const t=T.findIndex(n=>n.id===e.category);if(t>=0){const n=T[t];return{key:n.id,label:n.name,order:t+1}}return{key:e.type||"other",label:K[e.type]||"其他",order:8}}function ua(e){const t=(e.items||[]).reduce((n,a)=>{const r=Number(a.quantity)||0;return a.type==="drink"&&(n.drinks+=r),a.type==="dessert"&&(n.desserts+=r),a.type==="retail"&&(n.retail+=r),n},{drinks:0,desserts:0,retail:0});return[t.drinks?`飲品 ${t.drinks}`:"",t.desserts?`甜點 ${t.desserts}`:"",t.retail?`熟豆 ${t.retail}`:""].filter(Boolean).join("｜")||"尚無品項"}function da(e){const t=oe(e);return t.key==="ordering"?"繼續點餐":t.key==="ready"?"前往結帳":t.key==="waiting"?"開始出品":"查看出品"}function la(){const e=ia();return`
    <section class="workspace-status" aria-label="營業狀態">
      <article><span>空位</span><strong>${e.emptySeats}</strong></article>
      <article><span>進行中</span><strong>${e.openOrders.length}</strong></article>
      <article><span>待出品</span><strong>${e.pendingItems}</strong></article>
      <article><span>可結帳</span><strong>${e.readyOrders}</strong></article>
    </section>
  `}function pa(){return`
    <section class="floor-block store-state-block">
      <div class="floor-subtitle">
        <div>
          <h3>桌位狀態</h3>
          <p>空位、製作中與可結帳桌一眼確認</p>
        </div>
      </div>
      <div class="seat-grid">
        ${o.seats.map(e=>{const t=F(e.id),n=t?A(t):null,a=oe(t),r=t?Tn(t):"";return`
              <button class="seat ${t?"occupied":""} status-${a.key} ${r} ${e.id===o.selectedSeatId?"selected":""}" data-action="seat" data-id="${e.id}">
                <span class="seat-top"><span class="seat-icon">${e.icon}</span><span class="seat-status">${a.label}</span></span>
                <span class="seat-name">${e.name}</span>
                ${t?`<span class="seat-meta">${t.people}人 · ${P(t.createdAt)}</span>
                       <span class="seat-stay">${ae(t)}</span>
                       <strong class="seat-total">${p.format(n.total)}</strong>`:`<span class="seat-meta">${a.hint}</span><span class="seat-stay">目前空位</span><strong class="seat-total subtle">開始</strong>`}
              </button>
            `}).join("")}
      </div>
    </section>
  `}function ma(){return`
    <section class="menu-panel">
      <div class="tabs">
        ${T.map(e=>`
              <button class="${e.id===o.selectedCategoryId?"active":""}" data-action="category" data-id="${e.id}">
                ${e.name}
              </button>
            `).join("")}
      </div>
      <div class="product-grid">
        ${Nn().map(e=>`
              <button class="product ${e.active?"":"inactive"}" data-action="product" data-id="${e.id}" data-product-id="${e.id}" ${e.active?"":"disabled"}>
                <span>${e.name}</span>
                <strong>${p.format(e.price)}</strong>
              </button>
            `).join("")}
      </div>
    </section>
  `}function ya(e,t){if(!e.items.length)return'<div class="empty-note">點選左側商品加入訂單</div>';let n="";return rt(e.items).map(a=>{const r=t,s=a.requiresTemperature??a.type==="drink",i=a.requiresServiceType??a.type!=="retail",c=[a.supportsHot!==!1?"熱":"",a.supportsIce!==!1?"冰":""].filter(Boolean),u=[s&&a.temperature?a.temperature:"",i&&a.serviceType?a.serviceType:""].filter(Boolean),v=Number(a.effectivePrice??a.price)||0,b=v*a.quantity,m=a.type!==n?`<div class="line-group">${K[a.type]||"其他"}</div>`:"";return n=a.type,`
        ${m}
        <article class="line ${a.served?"served":""}">
          <div class="line-title">
            <strong>${J(a)}</strong>
            <span>${p.format(b)}</span>
          </div>
          <div class="line-meta">
            <span>${u.join("｜")||"一般"}</span>
            <span>×${a.quantity}</span>
            ${a.iceExtra?`<span>冰飲 +${p.format(a.iceExtra)}</span>`:""}
          </div>
          ${r?`<div class="line-readonly">
                  <span>數量 ${a.quantity}</span>
                  ${u.map(g=>`<span>${g}</span>`).join("")}
                  <span>單價 ${p.format(v)}</span>
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
                  ${s?`<section class="line-section">
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
      `}).join("")}function fa(e){return e.type==="drink"?`${e.temperature||""}${J(e)}`:J(e)}function va(e){const t=new Map;return rt(e.items).forEach(n=>{const a=ca(n).label,r=fa(n),s=t.get(a)||[];s.push({...n,group:a,label:r}),t.set(a,s)}),Object.fromEntries(t)}function ga(e){const t=va(e),n=e.status==="paid",a=[...T.map(r=>r.name),"其他"];return`
    <section class="production-list">
      <header>
        <strong>${k(e)}｜${e.people}人｜${ae(e)}</strong>
        <span>依工作順序出品，已完成項目會淡化。</span>
      </header>
      ${a.filter(r=>t[r]?.length).map(r=>`
              <section class="production-group">
                <h3>${r}</h3>
                <ul>
                  ${t[r].map(s=>`
                        <li>
                          <button class="production-item ${s.served?"served":""}" data-action="served" data-id="${s.lineId}" ${n?"disabled":""}>
                            <span class="production-check">${s.served?"✓":""}</span>
                            <span class="production-name">
                              <strong>${s.label}${s.quantity>1?` ×${s.quantity}`:""}</strong>
                              <small>${[s.serviceType,k(e)].filter(Boolean).join(" · ")}</small>
                              ${s.note?`<small>${h(s.note)}</small>`:""}
                            </span>
                            ${s.served?'<span class="production-status">已出</span>':""}
                          </button>
                        </li>
                      `).join("")}
                </ul>
              </section>
            `).join("")||'<div class="empty-note">尚無品項</div>'}
    </section>
  `}function ba(e,t){const n=q(e.customerSource),a=e.customerSourceNote||"",r=h(a);return t?`
      <section class="customer-source-panel readonly">
        <span>Customer source</span>
        <strong>${me(n)}</strong>
        ${a?`<small>${r}</small>`:""}
      </section>
    `:`
    <section class="customer-source-panel">
      <label>
        Customer source
        <select data-action="customer-source" data-id="${e.id}">
          ${At().map(([s,i])=>`<option value="${s}" ${n===s?"selected":""}>${i}</option>`).join("")}
        </select>
      </label>
      ${qe(n)?`<label>
              Note
              <input value="${r}" placeholder="Optional" data-action="customer-source-note" data-id="${e.id}" />
            </label>`:""}
    </section>
  `}function $a(){const e=lt(),t=Math.min(e.length,6);return`
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
        ${e.length?e.map((n,a)=>{const r=oe(n),s=n.id===o.selectedOrderId;return`
                    <button class="queue-order status-${r.key} ${s?"selected":""}" data-action="select-order" data-id="${n.id}">
                      <span class="queue-order-index">${a+1}</span>
                      <div>
                        <strong>${G(n)}</strong>
                        <small>${n.people}人｜${ae(n)}｜開單 ${P(n.createdAt)}</small>
                        <small>${ua(n)}</small>
                      </div>
                      <span class="queue-order-action">${r.label} · ${da(n)}</span>
                    </button>
                  `}).join(""):'<div class="empty-note">目前沒有進行中的訂單</div>'}
      </div>
      ${e.length>t?`<p class="queue-more">另有 ${e.length-t} 組，向下捲動查看</p>`:""}
    </section>
  `}function ha(){const e=E();if(!e)return'<aside class="order-panel empty"><span>選擇桌位或工作</span><strong>從 Workspace 開始處理下一步</strong></aside>';const t=A(e),n=e.status==="paid",a=n&&o.orderDetailMode==="history",r=o.orderViewMode==="production",s=oe(e),i=(e.linkedSeatIds||[]).map(c=>({id:c,name:k(c)}));return n&&!e.items?.length&&console.warn("[YUTU POS] paid order detail has no items",{orderId:e.id,status:e.status}),`
    <aside class="order-panel">
      <div class="order-head">
        <div>
          <span>${Dn(e)} ${G(e)} · ${s.label}</span>
          <strong>${e.people}人 · 開單 ${P(e.createdAt)}</strong>
          ${n?`<span>結帳 ${P(e.checkedOutAt)} · 停留 ${V(e)} 分鐘 · ${e.paymentMethod==="cash"?"現金":e.paymentMethod||"未記錄付款"}</span>`:`<span>${ae(e)}</span>`}
          ${n&&Z(e)?`<span>${Z(e)}</span>`:""}
        </div>
        <button class="ghost" data-action="floor">座位</button>
      </div>
      ${ba(e,n)}
      ${!n&&e.seatId!==S?`<section class="order-actions-panel">
              <span>桌位操作</span>
              ${i.length?`<small>使用桌位：${i.map(c=>c.name).join("、")}</small>`:""}
              <div>
                <button class="secondary" data-action="move-table">換桌</button>
                <button class="secondary" data-action="add-linked-seat">新增使用桌位</button>
              </div>
              ${i.length?`<div class="linked-seat-list">
                      ${i.map(c=>`<button class="ghost" data-action="remove-linked-seat" data-id="${c.id}">移除 ${c.name}</button>`).join("")}
                    </div>`:""}
            </section>`:""}
      <div class="order-view-toggle">
        <button class="${r?"active":""}" data-action="order-view" data-value="production">出品清單</button>
        <button class="${r?"":"active"}" data-action="order-view" data-value="edit">編輯訂單</button>
      </div>
      <div class="line-list">${r?ga(e):ya(e,n)}</div>
      <div class="checkout">
        <div><span>總金額</span><strong>${p.format(t.total)}</strong></div>
        <div><span>${r?"下一步":"毛利"}</span><strong>${r?s.hint:p.format(t.profit)}</strong></div>
        ${n?a?'<button class="paid" disabled>已結帳 · 現金</button>':`<button class="paid" disabled>已結帳 · 現金</button>
                 <button class="secondary" data-action="edit-paid" data-id="${e.id}">編輯訂單</button>
                 <button class="secondary danger-action" data-action="delete-order" data-id="${e.id}">刪除紀錄</button>`:`<button class="primary" data-action="checkout" ${e.items.length===0?"disabled":""}>現金結帳</button>
               <button class="secondary danger-action" data-action="cancel-order">取消客人</button>`}
      </div>
    </aside>
  `}function Sa(){const e=o.editingProductId?re(o.editingProductId):null,t=e||{name:"",category:o.selectedCategoryId,type:"drink",price:"",cost:"",supportsHot:!0,supportsIce:!0,supportsTakeout:!0,iceExtraPrice:be[o.selectedCategoryId]?.iceExtraPrice||0,active:!0,sort:o.products.length+1,note:"",variants:[]};return`
    <section class="management">
      <div class="section-title">
        <h2>商品管理</h2>
        <button class="ghost" data-action="floor">返回點餐</button>
      </div>
      <form class="product-form" data-editing="${e?.id||""}">
        <label>品名<input id="product-name" value="${t.name}" /></label>
        <label>類別<select id="product-category">${T.map(n=>`<option value="${n.id}" ${n.id===t.category?"selected":""}>${n.name}</option>`).join("")}</select></label>
        <label>類型<select id="product-type">${Object.entries(K).map(([n,a])=>`<option value="${n}" ${n===t.type?"selected":""}>${a}</option>`).join("")}</select></label>
        <label>售價<input id="product-price" type="number" step="0.001" value="${t.price}" /></label>
        <label>成本<input id="product-cost" type="number" step="0.001" value="${t.cost}" /></label>
        <label>冰飲加價<input id="product-ice-extra-price" type="number" step="1" value="${Number(t.iceExtraPrice)||0}" /></label>
        <label>排序<input id="product-sort" type="number" step="1" value="${t.sort}" /></label>
        <label class="check-row"><input id="product-supports-hot" type="checkbox" ${t.supportsHot!==!1?"checked":""} /> 可做熱飲</label>
        <label class="check-row"><input id="product-supports-ice" type="checkbox" ${t.supportsIce!==!1?"checked":""} /> 可做冰飲</label>
        <label class="check-row"><input id="product-supports-takeout" type="checkbox" ${t.supportsTakeout!==!1?"checked":""} /> 可外帶</label>
        <label class="wide">口味 / 規格<textarea id="product-variants" placeholder="焙茶、伯爵">${Q(t).join(`
`)}</textarea></label>
        <label class="wide">備註<input id="product-note" value="${t.note||""}" /></label>
        <label class="check-row"><input id="product-active" type="checkbox" ${t.active!==!1?"checked":""} /> 販售中</label>
        <button class="primary" type="button" data-action="save-product" data-id="${e?.id||""}">${e?"儲存商品":"新增商品"}</button>
        ${e?'<button class="secondary" type="button" data-action="new-product">清空表單</button>':""}
      </form>
      <div class="product-admin-list">
        ${at().map(n=>`
              <article class="admin-product ${n.active?"":"inactive"}">
                <div>
                  <strong>${n.sort}. ${n.name}</strong>
                  <span>${nt(n.category)} · ${K[n.type]} · ${p.format(n.price)} / 成本 ${p.format(n.cost)}</span>
                  <small>${[n.supportsHot?"熱":"",n.supportsIce?"冰":"",n.supportsTakeout?"可外帶":"",n.iceExtraPrice?`冰飲 +${p.format(n.iceExtraPrice)}`:""].filter(Boolean).join(" · ")||"無點餐選項"}</small>
                  ${Q(n).length?`<small>口味 / 規格：${Q(n).join("、")}</small>`:""}
                  ${n.note?`<small>${n.note}</small>`:""}
                </div>
                <button data-action="edit-product" data-id="${n.id}">編輯</button>
                <button class="${n.active?"danger-action":""}" data-action="toggle-product" data-id="${n.id}">${n.active?"停售":"恢復"}</button>
              </article>
            `).join("")}
      </div>
    </section>
  `}function Ia(){const e=D(o.historyDate),t=C(e),n=Ie(o.historyDate);return`
    <section class="history">
      <div class="section-title">
        <h2>銷售紀錄 / 日報</h2>
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
               ${n.map(a=>`<article><strong>${a.name}</strong><span>${a.category}</span><span>${a.quantity}</span><span>${p.format(a.amount)}</span><span>${p.format(a.cost)}</span><span>${p.format(a.profit)}</span></article>`).join("")}`:'<div class="empty-note">此日期尚無銷售紀錄</div>'}
      </div>
      <div class="section-title compact"><h2>訂單明細</h2></div>
      <div class="history-list">
        ${e.length?e.map(a=>{const r=A(a),s=`客源：${me(a.customerSource)}${a.customerSourceNote?` (${h(a.customerSourceNote)})`:""}`;return`
                    <article class="history-item">
                      <button class="history-open" data-action="open-history" data-id="${a.id}">
                        <span>${P(a.checkedOutAt||a.createdAt)} · ${k(a)} · ${a.people}人</span>
                        <strong>${p.format(r.total)}</strong>
                        <small>${s}</small>
                        <small>${st(a)||"無商品"} · 停留 ${V(a)} 分鐘${Z(a)?` · ${Z(a)}`:""}</small>
                      </button>
                      <button class="history-delete" data-action="delete-order" data-id="${a.id}">刪除</button>
                    </article>
                  `}).join(""):'<div class="empty-note">此日期尚無已結帳訂單</div>'}
      </div>
    </section>
  `}function Ea(){const e=D(f()),t=C(e);return`
    <section class="management">
      <div class="section-title">
        <h2>備份與日結</h2>
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
        <article><span>今日已結帳訂單</span><strong>${e.length}</strong></article>
        <article><span>今日營業額</span><strong>${p.format(t.revenue)}</strong></article>
      </div>
      <p class="backup-note">匯入會覆蓋此裝置的 localStorage 資料。正式試營運前可先匯出備份，再重置測試資料。</p>
    </section>
  `}function ka(){return[...o.businessEvents].filter(e=>!o.businessEventDate||e.date===o.businessEventDate).filter(e=>o.businessEventTypeFilter==="all"||e.type===o.businessEventTypeFilter).sort((e,t)=>{const n=String(t.date||"").localeCompare(String(e.date||""));return n!==0?n:new Date(t.createdAt||0)-new Date(e.createdAt||0)})}function mt(){return o.businessEvents.find(e=>e.id===o.editingBusinessEventId)||null}function yt(){return o.products.filter(e=>e.active!==!1)}function Te(e){const t=yt();return t.find(n=>n.id===e)||t[0]||null}function ft(){const e=document.querySelector("#business-event-form");if(!e)return;const t=new FormData(e),n=String(t.get("type")||"purchase"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",r=a==="product"?Te(String(t.get("productId")||"")):null,s=mt(),i=r?s?.productId===r.id&&s?.itemName?s.itemName:r.name:String(t.get("itemName")||"").trim(),c=String(t.get("itemCategory")||"").trim(),u=Math.max(1,Math.trunc(Number(t.get("quantity"))||1)),v=Number(t.get("unitCost"))||0,b=Number(t.get("amount"))||0,m=String(t.get("costAmount")??"").trim(),g=m===""?u*v:Number(m)||0;if(a==="product"&&!r){$("請選擇 POS 商品。");return}if(!i){$("請填寫品項名稱。");return}if(n==="purchase"&&b<=0){$("採購事件請填寫採購金額。");return}if(n!=="purchase"&&g<=0){$("報廢、自用、測試或招待請填寫成本金額。");return}const d=je({...s||{},date:String(t.get("date")||f()),type:n,usageType:n==="purchase"?null:n,itemSource:a,productId:r?.id||"",materialId:"",itemName:i,itemCategory:c,quantity:u,unit:String(t.get("unit")||"").trim(),unitCost:v,amount:n==="purchase"?b:0,costAmount:g,vendor:n==="purchase"?String(t.get("vendor")||"").trim():"",note:String(t.get("note")||"").trim(),updatedAt:new Date().toISOString()}),I=s?o.businessEvents.map(y=>y.id===s.id?d:y):[...o.businessEvents,d];l({businessEvents:I,businessEventDate:d.date,businessEventTypeFilter:"all",businessEventFormType:d.type,businessEventItemSource:d.itemSource,businessEventProductId:d.productId,editingBusinessEventId:null,notice:`${s?"已更新":"已新增"}營運紀錄：${Re(d.type)} / ${d.itemName}`})}function Ta(){const e=mt(),t=o.businessEventFormType||e?.type||"purchase",n=t==="purchase",a=o.businessEventItemSource||e?.itemSource||"manual",r=yt(),s=a==="product"?Te(o.businessEventProductId||e?.productId||""):null,i=ka(),c=_e({formOnly:!0}),u=e?.date||o.businessEventDate||f(),v=e?.quantity||1,b=e?.itemCategory??s?.category??"",m=e?.unitCost??(s?Number(s.cost)||0:""),g=e?.amount||"",d=m?v*Number(m):0,I=e?.costAmount??"";return`
    <section class="business-events-page">
      <div class="section-title">
        <div>
          <h2>營運紀錄</h2>
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
            ${c.map(([y,ie])=>`<option value="${y}" ${t===y?"selected":""}>${ie}</option>`).join("")}
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
                  ${r.map(y=>`<option value="${y.id}" ${s?.id===y.id?"selected":""}>${y.name}</option>`).join("")}
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
          <input name="quantity" type="number" min="1" step="1" value="${v}" />
        </label>
        <label>
          單位
          <input name="unit" value="${h(e?.unit||"")}" placeholder="g / ml / 片 / 包" />
        </label>
        <label>
          單位成本
          <input name="unitCost" type="number" min="0" step="1" value="${m}" placeholder="0" />
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
          <input type="date" value="${o.businessEventDate||f()}" data-action="business-event-date" />
        </label>
        <label>
          類型
          <select data-action="business-event-filter-type">
            <option value="all" ${o.businessEventTypeFilter==="all"?"selected":""}>全部</option>
            ${c.map(([y,ie])=>`<option value="${y}" ${o.businessEventTypeFilter===y?"selected":""}>${ie}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="analytics-table business-event-table">
        ${i.length?`<div class="analytics-table-head"><span>日期</span><span>類型</span><span>品項</span><span>數量</span><span>金額 / 成本</span><span>備註</span><span>操作</span></div>
               ${i.map(y=>`
                 <div>
                   <span>${y.date}</span>
                   <strong>${Re(y.type)}</strong>
                   <span>${h(y.itemName)}</span>
                   <span>${y.quantity||0} ${h(y.unit)}</span>
                   <span>${y.type==="purchase"?p.format(y.amount):p.format(y.costAmount)}</span>
                   <span>${y.vendor?`${h(y.vendor)} / `:""}${h(y.note||"")}</span>
                   <button class="ghost" data-action="edit-business-event" data-id="${y.id}">編輯</button>
                 </div>
               `).join("")}`:'<div class="empty-note">此日期與類型尚無營運紀錄</div>'}
      </div>
    </section>
  `}function vt(e=o.inventoryLotType){const t=e==="roasted_beans"?"retail":"dessert";return o.products.filter(n=>n.active!==!1&&n.type===t)}function X(e,t=o.inventoryLotType){const n=vt(t);return n.find(a=>a.id===e)||n[0]||null}function Da(){return[...o.inventoryLots].filter(e=>o.inventoryLotStatusFilter==="all"||e.status===o.inventoryLotStatusFilter).sort((e,t)=>{const n=e.madeDate||e.roastDate||e.purchaseDate||e.createdAt||"",a=t.madeDate||t.roastDate||t.purchaseDate||t.createdAt||"",r=String(a).localeCompare(String(n));return r!==0?r:String(e.itemName).localeCompare(String(t.itemName),"zh-Hant")})}function gt(){const e=document.querySelector("#inventory-lot-form");if(!e)return;const t=new FormData(e),n=String(t.get("lotType")||"dessert"),a=String(t.get("itemSource")||"manual")==="product"?"product":"manual",r=a==="product"?X(String(t.get("productId")||""),n):null,s=r?r.name:String(t.get("itemName")||"").trim(),i=r?r.category:String(t.get("itemCategory")||"").trim(),c=Math.max(1,Math.trunc(Number(t.get("initialQuantity"))||1)),u=Number(t.get("unitCost"))||0,v=String(t.get("costAmount")??"").trim(),b=v===""?c*u:Number(v)||0;if(a==="product"&&!r){$("請先建立或啟用對應的甜點 / 熟豆商品。");return}if(!s){$("請填寫批次品項名稱。");return}if(c<=0){$("批次初始數量需大於 0。");return}const m=Ye({itemSource:a,productId:r?.id||"",materialId:"",itemName:s,itemCategory:i,lotType:n,sourceEventId:"",madeDate:n==="dessert"?String(t.get("madeDate")||""):"",roastDate:n==="roasted_beans"?String(t.get("roastDate")||""):"",purchaseDate:String(t.get("purchaseDate")||""),expireDate:String(t.get("expireDate")||""),initialQuantity:c,remainingQuantity:c,unit:String(t.get("unit")||ve(n)).trim(),unitCost:u,costAmount:b,status:"active",note:String(t.get("note")||"").trim()});l({inventoryLots:[...o.inventoryLots,m],inventoryLotType:m.lotType,inventoryLotItemSource:m.itemSource==="product"?"product":"manual",inventoryLotProductId:m.productId,inventoryLotStatusFilter:"active",notice:`已新增批次：${m.itemName}`})}function Oa(e){const t=o.inventoryLots.find(n=>n.lotId===e);t&&l({inventoryLots:o.inventoryLots.map(n=>n.lotId===e?{...n,status:"archived",updatedAt:new Date().toISOString()}:n),notice:`已封存批次：${t.itemName}`})}function wa(){const e=o.inventoryLotType||"dessert",t=o.inventoryLotItemSource||"product",n=vt(e),a=t==="product"?X(o.inventoryLotProductId,e):null,r=a?Number(a.cost)||0:"",s=ve(e),i=f(),c=Da();return`
    <section class="inventory-lots-page">
      <div class="section-title">
        <div>
          <h2>資源管理</h2>
          <h3>甜點與熟豆批次</h3>
          <p>第一版只管理甜點與熟豆批次，不會自動扣 POS 銷售或 Business Events。</p>
        </div>
        <button class="ghost" data-action="floor">回到 POS</button>
      </div>

      <form id="inventory-lot-form" class="inventory-lot-form">
        <label>
          批次類型
          <select name="lotType" data-action="inventory-lot-type">
            ${ze().map(([u,v])=>`<option value="${u}" ${e===u?"selected":""}>${v}</option>`).join("")}
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
          <input name="unit" value="${s}" />
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
        ${c.length?`<div class="analytics-table-head"><span>類型</span><span>品項</span><span>日期</span><span>到期</span><span>初始</span><span>剩餘</span><span>成本</span><span>狀態</span><span>備註</span><span>操作</span></div>
               ${c.map(u=>{const v=u.lotType==="roasted_beans"?u.roastDate:u.madeDate;return`
                   <div>
                     <span>${mn(u.lotType)}</span>
                     <strong>${h(u.itemName)}</strong>
                     <span>${v||u.purchaseDate||"-"}</span>
                     <span>${u.expireDate||"-"}</span>
                     <span>${u.initialQuantity} ${h(u.unit)}</span>
                     <span>${u.remainingQuantity} ${h(u.unit)}</span>
                     <span>${p.format(u.costAmount)}</span>
                     <span>${yn(u.status)}</span>
                     <span>${h(u.note||"")}</span>
                     <span>${u.status==="active"?`<button class="ghost" data-action="archive-inventory-lot" data-id="${u.lotId}">封存</button>`:"-"}</span>
                   </div>
                 `}).join("")}`:'<div class="empty-note">目前沒有符合條件的批次</div>'}
      </div>
    </section>
  `}function Aa(){const e=En(),t=nn(o.orders,{startDate:e.startDate,endDate:e.endDate,sortBy:o.analyticsSort,categoryLabels:wn(),seatLabels:An(),customerSourceLabels:Nt(),businessEvents:o.businessEvents}),{overview:n,productRanking:a,categorySummary:r,temperatureSummary:s,hourlySummary:i,seatSummary:c,customerSourceSummary:u,businessEventSummary:v}=t,b=a.slice(0,8),m=[["today","今日"],["yesterday","昨日"],["seven-days","近 7 天"],["month","本月"],["custom","自訂日期"]],g=[["quantity","銷售數量"],["revenue","營收"],["profit","毛利"]];return`
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
          ${m.map(([d,I])=>`
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
        <article><span>毛利率</span><strong>${_.format(n.marginRate)}</strong></article>
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
          <article><span>採購金額</span><strong>${p.format(v.purchaseAmount)}</strong></article>
          <article><span>報廢成本</span><strong>${p.format(v.wasteCost)}</strong></article>
          <article><span>自用成本</span><strong>${p.format(v.personalCost)}</strong></article>
          <article><span>測試成本</span><strong>${p.format(v.testCost)}</strong></article>
          <article><span>招待成本</span><strong>${p.format(v.complimentaryCost)}</strong></article>
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
                         <span>${_.format(d.marginRate)}</span>
                         <span>${Ln(d)}</span>
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
            ${r.length?`<div class="analytics-table-head"><span>類別</span><span>數量</span><span>營收</span><span>毛利</span><span>毛利率</span></div>
                   ${r.map(d=>`
                         <div>
                           <strong>${d.category}</strong>
                           <span>${d.quantity}</span>
                           <span>${p.format(d.revenue)}</span>
                           <span>${p.format(d.profit)}</span>
                           <span>${_.format(d.marginRate)}</span>
                         </div>
                       `).join("")}`:'<div class="empty-note">此區間尚無類別資料</div>'}
          </div>
        </article>
        <article class="analytics-panel">
          <div class="section-title compact"><h2>冰熱分析</h2></div>
          <div class="temperature-summary">
            <article><span>冰飲數量</span><strong>${s.iced}</strong><small>${_.format(s.icedRate)}</small></article>
            <article><span>熱飲數量</span><strong>${s.hot}</strong><small>${_.format(s.hotRate)}</small></article>
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
  `}function Na(){return o.activeView==="analytics"?Aa():o.activeView==="backup"?Ea():o.activeView==="business-events"?Ta():o.activeView==="inventory-lots"?wa():o.activeView==="products"?Sa():o.activeView==="history"?Ia():`
    <main class="workspace">
      <section class="floor workspace-floor">
        <div class="section-title workspace-title">
          <div>
            <span>Current Store State</span>
            <h2>Cafe Workspace</h2>
          </div>
          <div class="actions">
            <button class="ghost" data-action="products">商品管理</button>
            <button class="ghost" data-action="business-events">營運紀錄</button>
            <button class="ghost" data-action="inventory-lots">資源管理</button>
            <button class="ghost" data-action="history">銷售紀錄</button>
            <button class="ghost" data-action="analytics">經營分析</button>
            <button class="ghost" data-action="backup">備份與日結</button>
            <button class="ghost danger-action" data-action="undo-checkout">撤銷最後結帳</button>
          </div>
        </div>
        ${la()}
        ${pa()}
        ${ma()}
      </section>
      <aside class="task-column">
        ${$a()}
        ${ha()}
      </aside>
    </main>
  `}function Ca(){if(!We)return"";const e=o.debug||{};return`
    <aside class="debug-panel" aria-label="Debug Panel">
      <strong>Debug Panel</strong>
      ${[["clicked product id",e.clickedProductId||""],["selectedSeatId",e.selectedSeatId||o.selectedSeatId||""],["selectedOrderId",e.selectedOrderId||o.selectedOrderId||""],["current open order id",e.currentOpenOrderId||Se()?.id||""],["product found",String(e.productFound??"")],["addProduct executed",String(e.addProductExecuted??"")],["failure reason",e.addProductFailureReason||""],["before items.length",String(e.beforeItemsLength??e.selectedOrderItemsLengthBefore??"")],["after items.length",String(e.afterItemsLength??"")],["new item lineId",e.newItemLineId||""],["replaceOrder executed",String(e.replaceOrderExecuted??"")],["storage save executed",String(e.storageSaveExecuted??"")],["render after save executed",String(e.renderAfterSaveExecuted??"")],["orders.length",String(e.ordersLength??o.orders.length)],["selected items.length",String(e.selectedOrderItemsLength??et())],["dataset.id",e.datasetId||""],["data-product-id",e.productDatasetId||""],["closest button",String(e.closestButtonFound??"")],["source",e.productClickSource||""],["updated",e.updatedAt||""]].map(([n,a])=>`<div><span>${n}</span><code>${a}</code></div>`).join("")}
    </aside>
  `}function La(){document.querySelectorAll(".product[data-product-id]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),ot(e.getAttribute("data-product-id"),"direct-product-button",t)})})}function M(){document.querySelector("#app").innerHTML=`
    <div class="shell">
      ${`<div class="dev-banner">🟠 開發版本 ${gn}</div>`}
      <header class="topbar">
        <div><span>YUTU POS</span><h1>Cafe Workspace</h1></div>
        <div class="store-status">
          <time>${new Date().toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"short"})}</time>
          <strong>${we()?"今日已關店":"營業中"}</strong>
          ${we()?"":'<button class="close-store-button" data-action="close-store">關店</button>'}
        </div>
      </header>
      ${o.notice?`<div class="notice" role="status">${o.notice}</div>`:""}
      ${o.activeView==="floor"?"":oa()}
      ${Na()}
      ${Ca()}
    </div>
  `,document.querySelectorAll("button:not([type])").forEach(e=>{e.type="button"}),La()}document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t||t.disabled)return;e.preventDefault();const{action:n,id:a,value:r}=t.dataset;if(n==="seat"&&Cn(a),n==="new-takeout"&&Pn(),n==="select-order"&&qn(a),n==="category"&&l({selectedCategoryId:a}),n==="product"&&ot(a,"delegated-document-click",e),n==="qty"){const s=Number(r);s<=0?Ae(a):Y(a,{quantity:s})}if(n==="temp"&&Y(a,{temperature:r}),n==="service"&&Y(a,{serviceType:r}),n==="served"){const i=E()?.items.find(c=>c.lineId===a);i&&Y(a,{served:!i.served})}if(n==="remove"&&Ae(a),n==="checkout"&&Mn(),n==="close-store"&&na(),n==="move-table"&&Hn(),n==="add-linked-seat"&&zn(),n==="remove-linked-seat"&&Yn(a),n==="undo-checkout"&&Rn(),n==="cancel-order"&&jn(),n==="edit-paid"&&Un(a),n==="delete-order"&&Vn(a),n==="products"&&l({activeView:"products",editingProductId:null}),n==="business-events"&&l({activeView:"business-events",businessEventDate:o.businessEventDate||f()}),n==="inventory-lots"&&l({activeView:"inventory-lots"}),n==="analytics"&&l({activeView:"analytics"}),n==="backup"&&l({activeView:"backup"}),n==="new-product"&&Ce(null),n==="edit-product"&&Ce(a),n==="toggle-product"&&Qn(a),n==="save-product"&&Bn(a||null),n==="export-all"&&Zn(),n==="export-today"&&ea(),n==="export-closing"&&ta(),n==="export-report-date"&&dt(o.historyDate||f()),n==="import-backup"&&document.querySelector("#backup-file")?.click(),n==="reset-test-orders"&&sa(),n==="save-business-event"&&ft(),n==="save-inventory-lot"&&gt(),n==="archive-inventory-lot"&&Oa(a),n==="edit-business-event"){const s=o.businessEvents.find(i=>i.id===a);s&&l({activeView:"business-events",editingBusinessEventId:a,businessEventFormType:s.type,businessEventItemSource:s.itemSource||"manual",businessEventProductId:s.productId||"",businessEventDate:s.date||o.businessEventDate||f()})}if(n==="cancel-business-event-edit"&&l({editingBusinessEventId:null}),n==="history"&&l({activeView:"history",historyDate:o.historyDate||f()}),n==="floor"&&l({activeView:"floor",orderDetailMode:"active"}),n==="open-history"){const s=o.orders.find(i=>i.id===a);s?l({selectedOrderId:a,selectedSeatId:s.seatId,activeView:"floor",orderDetailMode:"history"}):(console.warn("[YUTU POS] history order not found",{orderId:a}),$("找不到這筆歷史訂單。"))}if(n==="history-yesterday"&&l({historyDate:de(f(),-1)}),n==="history-today"&&l({historyDate:f()}),n==="toggle-sales-sort"&&l({salesSort:o.salesSort==="amount"?"quantity":"amount"}),n==="order-view"&&l({orderViewMode:r==="production"?"production":"edit"}),n==="analytics-range"){const s=r||"today",i={analyticsRange:s};if(s!=="custom"){const c=Ze(s);i.analyticsStartDate=c.startDate,i.analyticsEndDate=c.endDate}l(i)}n==="analytics-sort"&&l({analyticsSort:r||"quantity"})});document.addEventListener("change",e=>{if(e.target?.id==="backup-file"){ra(e.target.files?.[0]),e.target.value="";return}const t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="history-date"&&l({historyDate:t.value||f()}),t.dataset.action==="analytics-start-date"&&l({analyticsRange:"custom",analyticsStartDate:t.value||f()}),t.dataset.action==="analytics-end-date"&&l({analyticsRange:"custom",analyticsEndDate:t.value||f()}),t.dataset.action==="business-event-date"&&l({businessEventDate:t.value||f()}),t.dataset.action==="business-event-filter-type"&&l({businessEventTypeFilter:t.value||"all"}),t.dataset.action==="business-event-type"&&l({businessEventFormType:t.value||"purchase"}),t.dataset.action==="business-event-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?Te(o.businessEventProductId):null;l({businessEventItemSource:n,businessEventProductId:a?.id||""})}if(t.dataset.action==="business-event-product"&&l({businessEventItemSource:"product",businessEventProductId:t.value||""}),t.dataset.action==="inventory-lot-type"){const n=t.value||"dessert",a=X(o.inventoryLotProductId,n);l({inventoryLotType:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-item-source"){const n=t.value==="product"?"product":"manual",a=n==="product"?X(o.inventoryLotProductId,o.inventoryLotType):null;l({inventoryLotItemSource:n,inventoryLotProductId:a?.id||""})}if(t.dataset.action==="inventory-lot-product"&&l({inventoryLotItemSource:"product",inventoryLotProductId:t.value||""}),t.dataset.action==="inventory-lot-status-filter"&&l({inventoryLotStatusFilter:t.value||"active"}),t.dataset.action==="customer-source"){const n=q(t.value);Ne({customerSource:n,customerSourceNote:qe(n)&&E()?.customerSourceNote||""})}t.dataset.action==="customer-source-note"&&Ne({customerSourceNote:t.value||""})}});document.addEventListener("submit",e=>{["business-event-form","inventory-lot-form"].includes(e.target?.id)&&(e.preventDefault(),e.target.id==="business-event-form"?ft():gt())});M();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
