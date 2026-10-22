import type { District } from '../types';
const colors={Low:'#35b779',Moderate:'#f3b64d',High:'#f27838',Critical:'#df3f3f'};
export function HeatMap({districts,selected,onSelect}:{districts:District[];selected?:number;onSelect?:(id:number)=>void}){return <div className="heat-map">
  <svg viewBox="0 0 100 82" role="img" aria-label="City heat hotspot map">
    <path className="city-outline" d="M7 28L22 9l21-5 18 9 23 1 10 19-6 17 6 18-19 11-24-4-19 4-13-13L4 54z"/>
    <path className="road" d="M12 46C28 34 45 35 91 23M25 10c8 18 18 37 30 65M8 61c30-9 54-4 79 10"/>
    <path className="river" d="M70 6c-9 17-10 32-3 45s4 22-2 29"/>
    {districts.map(d=><g key={d.id} className={selected===d.id?'map-point selected':'map-point'} onClick={()=>onSelect?.(d.id)}>
      <circle cx={d.x} cy={d.y} r={selected===d.id?10:8} fill={colors[d.risk]} fillOpacity=".2"/><circle cx={d.x} cy={d.y} r="4.5" fill={colors[d.risk]}/><text x={d.x} y={d.y-7}>{d.temperature}°</text>
    </g>)}
  </svg><div className="legend">{Object.entries(colors).map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>
 </div>}
