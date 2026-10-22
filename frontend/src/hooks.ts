import { useState } from 'react';

export function usePersistentState<T>(key:string,initial:T){
  const [value,setValue]=useState<T>(()=>{try{const stored=localStorage.getItem(key);return stored?JSON.parse(stored) as T:initial}catch{return initial}});
  const update=(next:T|((previous:T)=>T))=>setValue(previous=>{const resolved=typeof next==='function'?(next as (value:T)=>T)(previous):next;localStorage.setItem(key,JSON.stringify(resolved));return resolved});
  return [value,update] as const;
}

export function downloadFile(name:string,content:string,type='text/csv;charset=utf-8'){
  const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download=name; link.click(); URL.revokeObjectURL(url);
}

export function toCsv(rows:Record<string,unknown>[]){if(!rows.length)return '';const headers=Object.keys(rows[0]!);const cell=(v:unknown)=>`"${String(v??'').replaceAll('"','""')}"`;return [headers.map(cell).join(','),...rows.map(row=>headers.map(h=>cell(row[h])).join(','))].join('\n')}
