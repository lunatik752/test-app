import{C as z,q as e,r as i,M as Z,B as l,T as o,D as O,E as ee,z as f,L as se,G as te,H as ae,J as ne,u as k,K as y,o as re,p as le,x as F,F as S,I as P,S as E,P as ce,y as ie}from"./index-D7K6KLWP.js";import{h as H,H as L,T as oe,E as de,a as xe,C as ue,M as c,b as he,c as je,d as N,e as d,f as me,g as pe,i as ye}from"./HourglassEmpty-B7qeA7hH.js";const R=z(e.jsx("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"}),"Cancel"),fe=z(e.jsx("path",{d:"M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"}),"Download"),ge=n=>{const x=n.split(".");return x.length>1?x[x.length-1]:""},be=n=>{switch(ge(n.file_name).toLowerCase()){case"jpg":case"jpeg":case"png":case"bmp":return e.jsx(y,{src:n.file_presentation,alt:n.file_name,variant:"square"});case"pdf":return e.jsx(y,{src:"src/assets/icons/pdf.png",alt:n.file_name,variant:"square"});case"doc":case"docx":return e.jsx(y,{src:"src/assets/icons/doc.png",alt:n.file_name,variant:"square"});case"xls":case"xlsx":return e.jsx(y,{src:"src/assets/icons/xls.png",alt:n.file_name,variant:"square"});case"rtf":return e.jsx(y,{src:"src/assets/icons/rtf.png",alt:n.file_name,variant:"square"});default:return e.jsx(y,{variant:"square",children:n.file_name[0]})}},ve=n=>{const x=n.file_presentation,t=document.createElement("a");t.href=x,t.download=n.file_name,document.body.appendChild(t),t.click(),document.body.removeChild(t)},_e=({open:n,onClose:x,selectedRow:t})=>{const[g,j]=i.useState([]);i.useEffect(()=>{t&&j(t.files)},[t]);const p=()=>{j([]),x()},m=u=>{switch(u){case"IN_PROCESS":return e.jsx(L,{color:"warning"});case"FINISHED":return e.jsx(H,{color:"success"});case"REJECTED":return e.jsx(R,{color:"error"});default:return null}},b=u=>u==="IN"?"Входящий":"Исходящий";return e.jsx(Z,{open:n,onClose:p,children:e.jsxs(l,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:600,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4},children:[e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[e.jsx(o,{variant:"h5",component:"h2",children:"Заявка"}),e.jsx(O,{size:"medium",onClick:p,children:e.jsx(ee,{})})]}),t&&e.jsxs(l,{sx:{display:"flex",flexDirection:"column",mb:2},children:[e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",mb:1},children:[e.jsxs(o,{variant:"body2",children:["Дата документа: ",f(new Date(t.document_date),"dd.MM.yyyy")]}),e.jsxs(o,{variant:"body2",children:["Номер документа: ",t.document_number]})]}),e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",mb:1},children:[e.jsxs(o,{variant:"body2",children:["Тип документа: ",b(t.document_type)]}),e.jsxs(o,{variant:"body2",children:["Дата записи: ",f(new Date(t.record_date),"dd.MM.yyyy")]})]}),e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",mb:1},children:[e.jsxs(o,{variant:"body2",children:["Статус записи: ",m(t.record_status)]}),e.jsxs(o,{variant:"body2",children:["Комментарий к статусу: ",t.record_status_comment]})]}),e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",mb:1},children:[e.jsxs(o,{variant:"body2",children:["Комментарий к записи: ",t.record_comment]}),e.jsxs(o,{variant:"body2",children:["Организация: ",t.organization_name]})]}),e.jsxs(l,{sx:{display:"flex",justifyContent:"space-between",mb:1},children:[e.jsxs(o,{variant:"body2",children:["Налоговый период: ",t.tax_period]}),e.jsxs(o,{variant:"body2",children:["Конец налогового периода: ",f(new Date(t.tax_period_end_date),"dd.MM.yyyy")]})]})]}),e.jsx(se,{children:g.map((u,v)=>e.jsxs(te,{sx:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(ae,{children:be(u)}),e.jsx(ne,{primary:u.file_name}),e.jsx(O,{edge:"end","aria-label":"download",onClick:()=>ve(u),children:e.jsx(fe,{})})]},v))}),e.jsx(l,{sx:{display:"flex",justifyContent:"flex-end",mt:2},children:e.jsx(k,{variant:"outlined",onClick:p,children:"Закрыть"})})]})})},Ce=re(oe)({backgroundColor:"#f0f0f0"}),Pe=()=>{const[n,x]=i.useState("asc"),[t,g]=i.useState("document_date"),[j,p]=i.useState(0),[m,b]=i.useState(30),[u,v]=i.useState([]),[q,T]=i.useState([]),[D,A]=i.useState(null),[_,B]=i.useState(!1),[a,C]=i.useState({documentType:"",organizationName:"",taxPeriod:"",recordStatus:""}),[J,w]=i.useState(!1);i.useEffect(()=>{Q()},[j,m,a]);const Q=async()=>{try{const s=await le.post("/test-app/data/archive-data.json",{documentType:a.documentType,organizationName:a.organizationName,taxPeriod:a.taxPeriod,recordStatus:a.recordStatus,page:j,rowsPerPage:m});v(s.data),T(s.data)}catch(s){console.error("Ошибка при загрузке данных:",s)}},W=s=>{x(t===s&&n==="asc"?"desc":"asc"),g(s)},V=(s,r)=>{p(r)},G=s=>{b(parseInt(s.target.value,10)),p(0)},K=s=>{A(s),w(!0)},U=()=>{B(!_)},I=s=>{const{name:r,value:h}=s.target;C(X=>({...X,[r]:h}))};i.useEffect(()=>{(()=>{let r=u;a.documentType&&(r=r.filter(h=>h.document_type===a.documentType)),a.organizationName&&(r=r.filter(h=>h.organization_name.includes(a.organizationName))),a.taxPeriod&&(r=r.filter(h=>h.tax_period===a.taxPeriod)),a.recordStatus&&(r=r.filter(h=>h.record_status===a.recordStatus)),T(r)})()},[a,u]);const M=q.sort((s,r)=>t==="document_date"?n==="asc"?new Date(s.document_date).getTime()-new Date(r.document_date).getTime():new Date(r.document_date).getTime()-new Date(s.document_date).getTime():0),Y=()=>{w(!1)},$=s=>{switch(s){case"IN_PROCESS":return e.jsx(L,{color:"action"});case"FINISHED":return e.jsx(H,{color:"success"});case"REJECTED":return e.jsx(R,{color:"error"});default:return null}};return e.jsxs(l,{margin:2,children:[e.jsx(l,{sx:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:e.jsx(o,{variant:"h4",component:"h4",children:"Архив"})}),e.jsx(l,{sx:{display:"flex",alignItems:"center",p:2},children:e.jsx(k,{onClick:U,endIcon:_?e.jsx(de,{}):e.jsx(xe,{}),children:"Фильтр"})}),e.jsx(ue,{in:_,children:e.jsxs(l,{sx:{p:2},children:[e.jsxs(l,{children:[e.jsx(o,{component:"h6",children:"Период"}),e.jsx(F,{label:"С",type:"date",value:a.documentType,onChange:s=>C({...a,documentType:s.target.value}),InputLabelProps:{shrink:!0},sx:{mr:2}}),e.jsx(F,{label:"До",type:"date",value:a.organizationName,onChange:s=>C({...a,organizationName:s.target.value}),InputLabelProps:{shrink:!0}})]}),e.jsx(l,{sx:{mt:2},children:e.jsxs(S,{fullWidth:!0,children:[e.jsx(P,{id:"document-type-filter-label",children:"Тип документа"}),e.jsxs(E,{labelId:"document-type-filter-label",name:"documentType",value:a.documentType,onChange:I,label:"Тип документа",children:[e.jsx(c,{value:"",children:e.jsx("em",{children:"Все"})}),e.jsx(c,{value:"IN",children:"Входящий"}),e.jsx(c,{value:"OUT",children:"Исходящий"})]})]})}),e.jsx(l,{sx:{mt:2},children:e.jsxs(S,{fullWidth:!0,children:[e.jsx(P,{id:"tax-period-filter-label",children:"Налоговый период"}),e.jsxs(E,{labelId:"tax-period-filter-label",name:"taxPeriod",value:a.taxPeriod,onChange:I,label:"Налоговый период",children:[e.jsx(c,{value:"",children:e.jsx("em",{children:"Все"})}),e.jsx(c,{value:"PERIOD_MONTH",children:"Месяц"}),e.jsx(c,{value:"PERIOD_Q1",children:"1 квартал"}),e.jsx(c,{value:"PERIOD_Q2",children:"2 квартал"}),e.jsx(c,{value:"PERIOD_Q3",children:"3 квартал"}),e.jsx(c,{value:"PERIOD_Q4",children:"4 квартал"}),e.jsx(c,{value:"PERIOD_YEAR",children:"Год"})]})]})}),e.jsx(l,{sx:{mt:2},children:e.jsxs(S,{fullWidth:!0,children:[e.jsx(P,{id:"status-filter-label",children:"Статус"}),e.jsxs(E,{labelId:"status-filter-label",name:"recordStatus",value:a.recordStatus,onChange:I,label:"Статус",children:[e.jsx(c,{value:"",children:e.jsx("em",{children:"Все"})}),e.jsx(c,{value:"IN_PROCESS",children:"В обработке"}),e.jsx(c,{value:"FINISHED",children:"Завершена"}),e.jsx(c,{value:"REJECTED",children:"Отвергнута"})]})]})})]})}),e.jsxs(ce,{children:[e.jsx(he,{children:e.jsxs(je,{children:[e.jsx(Ce,{children:e.jsxs(N,{children:[e.jsx(d,{children:e.jsx(me,{active:t==="document_date",direction:t==="document_date"?n:"asc",onClick:()=>W("document_date"),children:"Дата"})}),e.jsx(d,{children:"Номер исходного документа"}),e.jsx(d,{children:"Тип исходного документа"}),e.jsx(d,{children:"Имя организации"}),e.jsx(d,{children:"Налоговый период"}),e.jsx(d,{children:"Статус заявки"})]})}),e.jsx(pe,{children:M.slice(j*m,j*m+m).map((s,r)=>e.jsxs(N,{onClick:()=>K(s),style:{cursor:"pointer"},children:[e.jsx(d,{children:ie(new Date(s.document_date))?f(new Date(s.document_date),"dd.MM.yyyy"):"Invalid date"}),e.jsx(d,{children:s.document_number}),e.jsx(d,{children:s.document_type==="IN"?"Входящий":"Исходящий"}),e.jsx(d,{children:s.organization_name}),e.jsx(d,{children:s.tax_period}),e.jsx(d,{children:$(s.record_status)})]},r))})]})}),e.jsx(ye,{rowsPerPageOptions:[10,30,50],component:"div",count:M.length,rowsPerPage:m,page:j,onPageChange:V,onRowsPerPageChange:G})]}),D&&e.jsx(_e,{open:J,onClose:Y,selectedRow:D})]})};export{Pe as default};
