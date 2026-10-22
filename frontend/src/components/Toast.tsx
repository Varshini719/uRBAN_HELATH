import { CheckCircle2, Info, X } from 'lucide-react';

export type ToastMessage={id:number;text:string;type?:'success'|'info'};
export function Toasts({items,onDismiss}:{items:ToastMessage[];onDismiss:(id:number)=>void}){
  return <div className="toast-stack">{items.map(item=><div className={`toast ${item.type??'success'}`} key={item.id}>
    {item.type==='info'?<Info size={18}/>:<CheckCircle2 size={18}/>}<span>{item.text}</span><button onClick={()=>onDismiss(item.id)}><X size={15}/></button>
  </div>)}</div>
}
