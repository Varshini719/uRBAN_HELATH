import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Toasts, type ToastMessage } from './components/Toast';

type AppContextValue={notify:(text:string,type?:'success'|'info')=>void};
const AppContext=createContext<AppContextValue>({notify:()=>undefined});
export const useApp=()=>useContext(AppContext);

export function AppProvider({children}:{children:ReactNode}){const [toasts,setToasts]=useState<ToastMessage[]>([]);const value=useMemo(()=>({notify:(text:string,type:'success'|'info'='success')=>{const id=Date.now();setToasts(items=>[...items,{id,text,type}]);window.setTimeout(()=>setToasts(items=>items.filter(item=>item.id!==id)),3500)}}),[]);return <AppContext.Provider value={value}>{children}<Toasts items={toasts} onDismiss={id=>setToasts(items=>items.filter(item=>item.id!==id))}/></AppContext.Provider>}
