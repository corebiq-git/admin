(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const SECTION_META = {
    'b2b,sez,de': {code:'B2B', title:'B2B, SEZ & Deemed Exports', description:'Registered recipient invoices', start:4, formulaCols:[11]},
    b2cs:{code:'B2CS',title:'B2C Small Supplies',description:'Supplies to unregistered persons',start:4},
    cdnr:{code:'CDNR',title:'Credit / Debit Notes',description:'Notes issued to registered recipients',start:4,formulaCols:[11]},
    exp:{code:'EXP',title:'Export Supplies',description:'Exports with or without payment of tax',start:4},
    exemp:{code:'NIL',title:'Nil / Exempted Supplies',description:'Nil-rated, exempted and non-GST supplies',start:4},
    'hsn(b2b)':{code:'HSN',title:'HSN Summary',description:'HSN-wise summary of outward supplies',start:4},
    docs:{code:'DOCS',title:'Documents Issued',description:'Serial numbers and cancelled documents',start:4},
    eco:{code:'ECO',title:'E-commerce Supplies',description:'Supplies through e-commerce operators',start:4}
  };
  const state = {workbook:null, sections:[], selectedSheet:'', issues:[], json:{}, formatted:true};
  const clean = v => v === null || v === undefined ? '' : v;
  const num = v => { if(typeof v==='number') return Number.isFinite(v)?v:0; if(v===null||v===undefined||String(v).trim()==='') return 0; const n=Number(String(v).replace(/[,₹\s]/g,'')); return Number.isFinite(n)?n:0; };
  const str = v => v===null||v===undefined?'':String(v).trim();
  const rowHasValues = row => row.some(v => v!==null && v!==undefined && String(v).trim()!=='');
  const getCell = (row,i) => clean(row[i]);
  const showToast = msg => { const t=$('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2400); };
  const visibleAllowed = name => { const n=String(name||'').trim().toLowerCase(); return !!SECTION_META[n] && !n.includes('dash') && !n.includes('help') && !n.includes('readme'); };
  function excelDate(v){
    if(v instanceof Date && !isNaN(v)) return `${String(v.getDate()).padStart(2,'0')}-${String(v.getMonth()+1).padStart(2,'0')}-${v.getFullYear()}`;
    if(typeof v==='number' && window.XLSX && XLSX.SSF){const d=XLSX.SSF.parse_date_code(v);if(d)return `${String(d.d).padStart(2,'0')}-${String(d.m).padStart(2,'0')}-${d.y}`;}
    const s=str(v); if(!s)return '';
    let m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/); if(m)return `${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}-${m[3]}`;
    m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if(m)return `${m[3].padStart(2,'0')}-${m[2].padStart(2,'0')}-${m[1]}`;
    return s;
  }
  function importWorkbook(wb){
    state.workbook=wb; state.sections=[];
    wb.SheetNames.forEach((name,index)=>{
      const sheetMeta = wb.Workbook && wb.Workbook.Sheets ? wb.Workbook.Sheets[index] : null;
      const isHidden = sheetMeta && Number(sheetMeta.Hidden || 0) !== 0;
      if(isHidden || !visibleAllowed(name)) return;
      const ws=wb.Sheets[name]; if(!ws) return;
      const matrix=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:null,blankrows:false});
      const meta=SECTION_META[name];
      const headerIdx=3; const headers=(matrix[headerIdx]||[]).map((v,i)=>str(v)||`Column ${i+1}`);
      const dataRows=[];
      for(let ri=meta.start;ri<matrix.length;ri++){
        const row=matrix[ri]||[];
        if(rowHasValues(row)) dataRows.push({excelRow:ri+1,values:headers.map((_,i)=>clean(row[i]))});
      }
      state.sections.push({name,index,headers,rows:dataRows,meta,worksheet:ws});
    });
    if(!state.sections.length){showToast('No supported visible GSTR-1 sheets found.');return;}
    state.selectedSheet=state.sections[0].name;
    $('fileName').textContent='Loaded: '+(wb.__filename||'GSTR-1 workbook');
    $('sheetSelect').innerHTML=state.sections.map(s=>`<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${s.rows.length}</option>`).join('');
    $('sheetSelect').value=state.selectedSheet; $('sheetSelect').disabled=false; $('validateBtn').disabled=false;
    $('copyBtn').disabled=false; $('downloadBtn').disabled=false;
    runValidation(); renderAll(); showToast('Workbook imported successfully');
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function issue(sheet,row,level,message){return {sheetName:sheet.name,rowIndex:row.excelRow,identifier:str(row.values[0])||str(row.values[2])||`Row ${row.excelRow}`,level,message};}
  function isValidGSTIN(v){return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(str(v).toUpperCase());}
  function runValidation(){
    const issues=[];
    state.sections.forEach(sheet=>sheet.rows.forEach(row=>{
      const r=row.values; const add=(lvl,msg)=>issues.push(issue(sheet,row,lvl,msg));
      if(sheet.name==='b2b,sez,de'){
        if(!str(r[0])) add('error','Recipient GSTIN is required.'); else if(!isValidGSTIN(r[0])) add('warning','GSTIN format may be invalid; check the 15-character GSTIN.');
        if(!str(r[2])) add('error','Invoice number is required.');
        if(!str(r[3])) add('warning','Invoice date is missing.');
        if(num(r[4])<=0) add('warning','Invoice value is zero or negative.');
        if(r[10]===''||r[10]===null||r[10]===undefined) add('warning','Tax rate is not specified.');
      } else if(sheet.name==='b2cs'){
        if(!str(r[1])) add('error','Place of Supply is required.');
        if(num(r[4])<=0) add('warning','Taxable value is zero.');
      } else if(sheet.name==='cdnr'){
        if(!str(r[0])) add('error','Recipient GSTIN is required for CDNR.'); else if(!isValidGSTIN(r[0])) add('warning','Recipient GSTIN format may be invalid.');
        if(!str(r[2])) add('error','Note number is required.');
        if(!['C','D','CREDIT','DEBIT'].includes(str(r[4]).toUpperCase())) add('warning','Note type should be C (Credit) or D (Debit).');
      } else if(sheet.name==='hsn(b2b)'){
        if(!str(r[0])) add('error','HSN code is required.');
        if(!str(r[2])) add('warning','UQC should be specified.');
      }
    }));
    state.issues=issues;
    $('errorCount').textContent=issues.filter(i=>i.level==='error').length;
    $('warningCount').textContent=issues.filter(i=>i.level==='warning').length;
    $('issueBadge').textContent=issues.length;
    return issues;
  }
  function rowsFor(name){return state.sections.find(s=>s.name===name)?.rows||[];}
  function buildJson(){
    const find=name=>state.sections.find(s=>s.name===name);
    const rows=name=>rowsFor(name).map(x=>x.values);
    let gstin='',fp='';
    const b2bRows=rows('b2b,sez,de');
    if(b2bRows.length){gstin=str(b2bRows[0][0]);const d=excelDate(b2bRows[0][3]);const m=d.match(/^\d{2}-(\d{2})-(\d{4})$/);if(m)fp=m[1]+m[2];}
    // If no B2B rows exist, retain a blank header rather than inserting sample taxpayer data.
    const b2bGroups={};
    b2bRows.forEach(r=>{if(!rowHasValues(r))return;const ctin=str(r[0]);if(!ctin)return;if(!b2bGroups[ctin])b2bGroups[ctin]={ctin,cfs:'N',inv:[]};
      const invDate=excelDate(r[3]);const inv={inum:str(r[2]),idt:invDate,val:num(r[4]),pos:str(r[5]).slice(0,2),rchrg:str(r[6]||'N'),inv_typ:/regular/i.test(str(r[8]))?'R':str(r[8])||'R',itms:[{num:1,itm_det:{rt:num(r[10]),txval:num(r[11]),iamt:0,camt:0,samt:0,csamt:num(r[12])}}]};
      if(str(r[9]))inv.etin=str(r[9]);b2bGroups[ctin].inv.push(inv);
    });
    const b2cs=rows('b2cs').filter(rowHasValues).map(r=>({sply_ty:'INTRA',pos:str(r[1]).slice(0,2),typ:str(r[0]||'OE'),rt:num(r[3]),txval:num(r[4]),camt:0,samt:0,csamt:num(r[5])}));
    const cdnrGroups={}; rows('cdnr').filter(rowHasValues).forEach(r=>{const ctin=str(r[0]);if(!ctin)return;if(!cdnrGroups[ctin])cdnrGroups[ctin]={ctin,cfs:'N',nt:[]};const ntty=str(r[4]||'C').toUpperCase().startsWith('C')?'C':'D';cdnrGroups[ctin].nt.push({ntty,nt_num:str(r[2]),nt_dt:excelDate(r[3]),val:num(r[8]),pos:str(r[5]).slice(0,2),rchrg:str(r[6]||'N'),p_gst:'N',itms:[{num:1,itm_det:{rt:num(r[10]),txval:num(r[11]),iamt:0,camt:0,samt:0,csamt:num(r[12])}}]});});
    const exp=rows('exp').filter(rowHasValues).map(r=>({exp_typ:str(r[0]||'WOPAY'),inv:[{inum:str(r[1]),idt:excelDate(r[2]),val:num(r[3]),sbnum:str(r[5]),sbdt:excelDate(r[6]),port_code:str(r[4]),itms:[{txval:num(r[8]),rt:num(r[7]),iamt:0,csamt:num(r[9])}]}]}));
    const exemp=rows('exemp').filter(rowHasValues).map((r,i)=>({sply_ty:['INTERR','INTRAR','INTERU','INTRAU'][i]||'INTRAR',nil_amt:num(r[1]),expt_amt:num(r[2]),ngsup_amt:num(r[3])}));
    const hsn=rows('hsn(b2b)').filter(rowHasValues).map((r,i)=>({num:i+1,hsn_sc:str(r[0]),desc:str(r[1]),uqc:str(r[2]||'NOS-NUMBERS'),qty:num(r[3]),val:num(r[4]),rt:num(r[5]),txval:num(r[6]),iamt:num(r[7]),camt:num(r[8]),samt:num(r[9]),csamt:num(r[10])}));
    const docs=rows('docs').filter(rowHasValues).map((r,i)=>{const tot=num(r[3]),canc=num(r[4]);return {num:i+1,from:str(r[1]||'1'),to:str(r[2]||'1'),totnum:tot,canc,net_issue:tot-canc};});
    const eco=rows('eco').filter(rowHasValues).map(r=>({sply_ty:str(r[0]),...(str(r[1])?{gstin:str(r[1])}:{}),...(str(r[2])?{name:str(r[2])}:{}),net_val:num(r[3]),iamt:num(r[4]),camt:num(r[5]),samt:num(r[6]),csamt:num(r[7])}));
    return {gstin,fp,gt:0.0,cur_gt:0.0,version:'GSTR1_V2.0',b2b:Object.values(b2bGroups),b2cs,cdnr:Object.values(cdnrGroups),exp,nil:{inv:exemp},hsn:{data:hsn},doc_issue:{doc_det:[{doc_num:1,docs}]},eco};
  }
  function renderAll(){
    $('sectionCount').textContent=state.sections.length;
    $('rowCount').textContent=state.sections.reduce((n,s)=>n+s.rows.length,0);
    $('sectionCards').innerHTML=state.sections.map(s=>`<article class="section-card"><div class="card-top"><span class="section-code">${escapeHtml(s.meta.code)}</span><span class="pill">Visible sheet</span></div><h3>${escapeHtml(s.meta.title)}</h3><p>${escapeHtml(s.meta.description)}</p><div class="card-bottom"><div><strong>${s.rows.length}</strong><div class="issue-meta">data rows</div></div><button class="btn secondary open-sheet" data-sheet="${escapeHtml(s.name)}">View data</button></div></article>`).join('');
    state.json=buildJson(); renderSheet(); renderIssues(); renderJson();
  }
  function renderSheet(){const s=state.sections.find(x=>x.name===state.selectedSheet);if(!s){$('tableWrap').innerHTML='<div class="empty">No sheet selected.</div>';return;}
    const head=s.headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('');
    const body=s.rows.slice(0,500).map(r=>`<tr>${s.headers.map((_,i)=>`<td title="${escapeHtml(r.values[i]??'')}">${escapeHtml(r.values[i]??'')}</td>`).join('')}</tr>`).join('');
    $('tableWrap').innerHTML=`<table class="data-table"><thead><tr><th>Excel row</th>${head}</tr></thead><tbody>${s.rows.length? s.rows.slice(0,500).map(r=>`<tr><td>${r.excelRow}</td>${s.headers.map((_,i)=>`<td title="${escapeHtml(r.values[i]??'')}">${escapeHtml(r.values[i]??'')}</td>`).join('')}</tr>`).join(''):'<tr><td colspan="99">No data rows</td></tr>'}</tbody></table>${s.rows.length>500?'<div class="issue-meta" style="padding:10px">Showing first 500 non-empty rows for mobile performance.</div>':''}`;
  }
  function renderIssues(){const filter=$('validationFilter').value;const arr=state.issues.filter(i=>filter==='all'||i.level===filter);$('issuesList').innerHTML=arr.length?arr.map(i=>`<article class="issue ${i.level}"><div class="issue-head"><div class="issue-title">${escapeHtml(i.identifier)}</div><span class="level">${i.level}</span></div><div class="issue-meta">${escapeHtml(i.sheetName)} · Excel row ${i.rowIndex}</div><ul><li>${escapeHtml(i.message)}</li></ul></article>`).join(''):'<div class="empty"><b>No matching issues</b><p>There are no issues for this filter. This is not a guarantee of GST portal acceptance.</p></div>';}
  function renderJson(){const text=JSON.stringify(state.json,null,2);$('jsonOutput').textContent=text;$('jsonMeta').textContent=`${state.sections.length} visible sections scanned · ${text.length.toLocaleString('en-IN')} characters`;}
  function switchTab(name){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));}
  function downloadJson(){const blob=new Blob([JSON.stringify(state.json,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`GSTR1_${state.json.fp||'return'}_JSON.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast('JSON file saved');}
  async function copyJson(){try{await navigator.clipboard.writeText(JSON.stringify(state.json,null,2));showToast('JSON copied to clipboard');}catch(e){const range=document.createRange();range.selectNodeContents($('jsonOutput'));const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);showToast('Select and copy the JSON text');}}
  function readFile(file){if(!file)return;if(!window.XLSX){showToast('Excel reader library did not load. Connect to internet and reload.');return;}const reader=new FileReader();reader.onload=e=>{try{const wb=XLSX.read(e.target.result,{type:'array',cellDates:true});wb.__filename=file.name;importWorkbook(wb);}catch(err){console.error(err);showToast('Could not read workbook. Please check the Excel file.');}};reader.onerror=()=>showToast('Could not open this file.');reader.readAsArrayBuffer(file);}
  $('loadBtn').addEventListener('click',()=>$('fileInput').click());$('browseBtn').addEventListener('click',()=>$('fileInput').click());$('dropzone').addEventListener('click',e=>{if(!e.target.closest('button'))$('fileInput').click();});$('fileInput').addEventListener('change',e=>readFile(e.target.files[0]));
  $('dropzone').addEventListener('dragover',e=>{e.preventDefault();$('dropzone').style.background='#f0f6ff';});$('dropzone').addEventListener('dragleave',()=>$('dropzone').style.background='');$('dropzone').addEventListener('drop',e=>{e.preventDefault();$('dropzone').style.background='';readFile(e.dataTransfer.files[0]);});
  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  $('sheetSelect').addEventListener('change',e=>{state.selectedSheet=e.target.value;renderSheet();});$('sectionCards').addEventListener('click',e=>{const b=e.target.closest('.open-sheet');if(!b)return;state.selectedSheet=b.dataset.sheet;$('sheetSelect').value=state.selectedSheet;renderSheet();switchTab('sheets');});
  $('validateBtn').addEventListener('click',()=>{runValidation();renderIssues();showToast('Validation completed');});$('validationFilter').addEventListener('change',renderIssues);$('copyBtn').addEventListener('click',copyJson);$('downloadBtn').addEventListener('click',downloadJson);$('formatBtn').addEventListener('click',()=>{state.json=buildJson();renderJson();showToast('JSON formatted');});
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
