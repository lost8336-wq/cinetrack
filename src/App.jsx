import { useState, useCallback } from "react";

const GENRES = ["All","Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Fantasy","Horror","Mystery","Romance","Sci-Fi","Thriller","Western"];
const STATUSES = ["All","Watching","Completed","Plan to Watch","Dropped","Paused"];

const genreColors = {
  Action:"#e11d48",Adventure:"#ea580c",Animation:"#7c3aed",Comedy:"#ca8a04",
  Crime:"#475569",Documentary:"#0891b2",Drama:"#1d4ed8",Fantasy:"#6d28d9",
  Horror:"#991b1b",Mystery:"#374151",Romance:"#db2777",SciFi:"#0e7490",
  "Sci-Fi":"#0e7490",Thriller:"#b45309",Western:"#713f12"
};

const initialWatchlist = [
  {id:1,title:"Breaking Bad",type:"series",status:"Completed",genre:"Crime",rating:9.5,myRating:10,episodes:62,watchedEps:62,nextAir:null,poster:"🎭",year:2008,runtime:"45 min",creator:"Vince Gilligan",cast:"Bryan Cranston, Aaron Paul",imdb:9.5,rt:96,synopsis:"A high school chemistry teacher diagnosed with cancer turns to a life of crime.",awards:"16 Primetime Emmy Awards",boxoffice:null,streaming:["Netflix"],country:"US",language:"English"},
  {id:2,title:"Dune: Part Two",type:"movie",status:"Completed",genre:"Sci-Fi",rating:8.5,myRating:9,episodes:null,watchedEps:null,nextAir:null,poster:"🏜️",year:2024,runtime:"2h 46min",creator:"Denis Villeneuve",cast:"Timothée Chalamet, Zendaya",imdb:8.5,rt:93,synopsis:"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",awards:"Academy Award Nominee",boxoffice:"$711M worldwide",streaming:["Max","Apple TV+"],country:"US",language:"English"},
  {id:3,title:"Shogun",type:"series",status:"Watching",genre:"Drama",rating:8.8,myRating:9,episodes:10,watchedEps:7,nextAir:"2024-05-21",poster:"⛩️",year:2024,runtime:"60 min",creator:"Rachel Kondo",cast:"Hiroyuki Sanada, Cosmo Jarvis",imdb:8.8,rt:99,synopsis:"A shipwrecked English navigator finds himself in feudal Japan.",awards:"25 Emmy Awards including Outstanding Drama",boxoffice:null,streaming:["Hulu","Disney+"],country:"US/Japan",language:"English, Japanese"},
];

function StarRating({value, onChange, size=18}) {
  const [hover,setHover]=useState(0);
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5,6,7,8,9,10].map(s=>(
        <span key={s} onClick={()=>onChange&&onChange(s)} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
          style={{cursor:onChange?"pointer":"default",fontSize:size,color:(hover||value)>=s?"#f59e0b":"#374151",transition:"color .15s"}}>★</span>
      ))}
    </div>
  );
}

function Badge({text,color="#1d4ed8"}) {
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{text}</span>;
}

function ScoreCircle({label,value,max=100,color}) {
  const pct = max===10 ? value*10 : value;
  const r=22, circ=2*Math.PI*r;
  const dash = (pct/100)*circ;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={r} fill="none" stroke="#1e293b" strokeWidth={5}/>
        <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ/4} strokeLinecap="round"/>
        <text x={28} y={28} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill={color}>{max===10?value:value+"%"}</text>
      </svg>
      <span style={{fontSize:10,color:"#94a3b8",letterSpacing:".5px",textTransform:"uppercase"}}>{label}</span>
    </div>
  );
}

function StreamingBadge({name}) {
  const colors={Netflix:"#e50914",Hulu:"#3dba4e","Disney+":"#113ccf",Max:"#002be0","Apple TV+":"#555555",Amazon:"#00a8e1",Peacock:"#000000","Paramount+":"#0064ff"};
  return <span style={{background:colors[name]||"#475569",color:"#fff",borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600}}>{name}</span>;
}

function ShowCard({show, onClick, onStatusChange}) {
  const progress = show.type==="series" && show.episodes ? Math.round((show.watchedEps/show.episodes)*100) : null;
  return (
    <div onClick={()=>onClick(show)} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform .2s,border-color .2s",position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="#6366f1"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#1e293b"}}>
      <div style={{height:140,background:"linear-gradient(135deg,#1e1b4b,#312e81)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:64,position:"relative"}}>
        {show.poster}
        <div style={{position:"absolute",top:8,right:8,display:"flex",gap:4,flexDirection:"column",alignItems:"flex-end"}}>
          <Badge text={show.type==="series"?"TV":"Film"} color={show.type==="series"?"#6366f1":"#ec4899"}/>
          <Badge text={show.genre} color={genreColors[show.genre]||"#475569"}/>
        </div>
        {show.status==="Watching" && <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"#1e293b"}}>
          <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#6366f1,#ec4899)",transition:"width .3s"}}/>
        </div>}
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{fontWeight:700,fontSize:15,color:"#f1f5f9",marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{show.title}</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>{show.year} · {show.runtime}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:"#f59e0b",fontSize:14}}>★</span>
            <span style={{fontWeight:700,fontSize:13,color:"#f1f5f9"}}>{show.imdb}</span>
            <span style={{fontSize:11,color:"#64748b"}}>IMDb</span>
          </div>
          <select onClick={e=>e.stopPropagation()} value={show.status} onChange={e=>onStatusChange(show.id,e.target.value)}
            style={{background:"#1e293b",border:"1px solid #334155",color:show.status==="Watching"?"#6366f1":show.status==="Completed"?"#22c55e":"#94a3b8",
              borderRadius:6,padding:"3px 6px",fontSize:11,fontWeight:600,cursor:"pointer"}}>
            {STATUSES.filter(s=>s!=="All").map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {show.type==="series" && show.episodes && (
          <div style={{marginTop:8,fontSize:11,color:"#64748b"}}>{show.watchedEps}/{show.episodes} eps · {progress}%</div>
        )}
        {show.nextAir && <div style={{marginTop:6,display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#22d3ee"}}>
          <span>📅</span> Next: {new Date(show.nextAir).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
        </div>}
      </div>
    </div>
  );
}

function DetailModal({show, onClose, onUpdate}) {
  const [myRating, setMyRating] = useState(show.myRating);
  const [notes, setNotes] = useState(show.notes||"");
  const [watchedEps, setWatchedEps] = useState(show.watchedEps||0);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,width:"100%",maxWidth:680,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{height:200,background:"linear-gradient(135deg,#1e1b4b,#312e81,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,position:"relative",borderRadius:"16px 16px 0 0"}}>
          {show.poster}
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"#0f172a88",border:"1px solid #334155",color:"#94a3b8",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
            <Badge text={show.type==="series"?"TV Series":"Movie"} color={show.type==="series"?"#6366f1":"#ec4899"}/>
            <Badge text={show.genre} color={genreColors[show.genre]||"#475569"}/>
            <Badge text={show.year+""} color="#475569"/>
            <Badge text={show.runtime} color="#475569"/>
            {show.country&&<Badge text={show.country} color="#475569"/>}
          </div>
          <h2 style={{margin:"0 0 4px",color:"#f1f5f9",fontSize:24,fontWeight:800}}>{show.title}</h2>
          <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Directed/Created by: <span style={{color:"#94a3b8"}}>{show.creator}</span></div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Cast: <span style={{color:"#94a3b8"}}>{show.cast}</span></div>
          <p style={{color:"#94a3b8",fontSize:14,lineHeight:1.7,marginBottom:20}}>{show.synopsis}</p>

          <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <ScoreCircle label="IMDb" value={show.imdb} max={10} color="#f59e0b"/>
            <ScoreCircle label="Rotten Tomatoes" value={show.rt} max={100} color="#fa4a3e"/>
            {show.boxoffice && <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:18,fontWeight:800,color:"#22c55e"}}>{show.boxoffice}</div>
              <span style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".5px"}}>Box Office</span>
            </div>}
          </div>

          {show.awards && <div style={{background:"#1e1b4b",border:"1px solid #3730a3",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
            <div style={{fontSize:11,color:"#818cf8",fontWeight:700,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>🏆 Awards</div>
            <div style={{color:"#c7d2fe",fontSize:13}}>{show.awards}</div>
          </div>}

          {show.streaming?.length>0 && <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Available in your region</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{show.streaming.map(s=><StreamingBadge key={s} name={s}/>)}</div>
          </div>}

          {show.type==="series" && show.episodes && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#64748b",fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Episodes watched</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <input type="range" min={0} max={show.episodes} value={watchedEps} onChange={e=>setWatchedEps(+e.target.value)} style={{flex:1}}/>
                <span style={{color:"#f1f5f9",fontWeight:700,minWidth:48}}>{watchedEps}/{show.episodes}</span>
              </div>
            </div>
          )}

          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>My rating</div>
            <StarRating value={myRating} onChange={setMyRating}/>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:"#64748b",fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add your notes..." rows={3}
              style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,color:"#f1f5f9",fontSize:13,padding:"10px 12px",resize:"vertical",boxSizing:"border-box"}}/>
          </div>

          <button onClick={()=>{onUpdate({...show,myRating,notes,watchedEps});onClose();}}
            style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#ec4899)",border:"none",color:"#fff",fontWeight:700,fontSize:14,padding:"12px",borderRadius:8,cursor:"pointer"}}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({onClose, onAdd}) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("series");

  const search = async () => {
    if(!query.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const prompt = `You are a movie/TV database assistant. Return ONLY a valid JSON object (no markdown, no extra text) for the ${type==="series"?"TV series":"movie"} titled "${query}".

Return this exact JSON structure:
{
  "title": "exact title",
  "type": "${type}",
  "year": 2024,
  "genre": "Primary Genre (one of: Action,Adventure,Animation,Comedy,Crime,Documentary,Drama,Fantasy,Horror,Mystery,Romance,Sci-Fi,Thriller,Western)",
  "runtime": "duration string",
  "creator": "director or creator name",
  "cast": "top 3 actors comma separated",
  "synopsis": "2-3 sentence synopsis",
  "imdb": 8.5,
  "rt": 90,
  "awards": "notable awards or null",
  "boxoffice": "box office total or null if TV",
  "streaming": ["Netflix","Hulu"],
  "episodes": 10,
  "country": "production country",
  "language": "primary language",
  "poster": "single relevant emoji"
}

For movies, set episodes to null. For streaming, list platforms available in Saudi Arabia/Middle East region. Be accurate with IMDb and RT scores.`;

      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult({...parsed,id:Date.now(),status:"Plan to Watch",myRating:0,watchedEps:0,notes:""});
    } catch(e) {
      setError("Could not find show details. Try a different title.");
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,width:"100%",maxWidth:540,padding:"24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,color:"#f1f5f9",fontSize:18,fontWeight:700}}>Add to Watchlist</h3>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["series","movie"].map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{flex:1,padding:"8px",border:`1px solid ${type===t?"#6366f1":"#334155"}`,background:type===t?"#1e1b4b":"transparent",
              color:type===t?"#818cf8":"#64748b",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13,transition:"all .2s"}}>
              {t==="series"?"📺 TV Series":"🎬 Movie"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder={`Search ${type==="series"?"TV series":"movie"} title...`}
            style={{flex:1,background:"#1e293b",border:"1px solid #334155",color:"#f1f5f9",borderRadius:8,padding:"10px 12px",fontSize:14}}/>
          <button onClick={search} disabled={loading} style={{background:"linear-gradient(135deg,#6366f1,#ec4899)",border:"none",color:"#fff",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>
            {loading?"⏳":"Search"}
          </button>
        </div>
        {error && <div style={{color:"#f87171",fontSize:13,marginBottom:12}}>{error}</div>}
        {result && (
          <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:12,padding:"16px",marginBottom:16}}>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <div style={{fontSize:48}}>{result.poster}</div>
              <div>
                <div style={{fontWeight:700,color:"#f1f5f9",fontSize:16}}>{result.title}</div>
                <div style={{color:"#64748b",fontSize:12,marginBottom:6}}>{result.year} · {result.runtime} · {result.genre}</div>
                <div style={{display:"flex",gap:8}}>
                  <span style={{color:"#f59e0b",fontSize:12}}>★ {result.imdb} IMDb</span>
                  <span style={{color:"#fa4a3e",fontSize:12}}>🍅 {result.rt}% RT</span>
                </div>
              </div>
            </div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.6,margin:"0 0 12px"}}>{result.synopsis}</p>
            {result.streaming?.length>0 && <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {result.streaming.map(s=><StreamingBadge key={s} name={s}/>)}
            </div>}
          </div>
        )}
        {result && (
          <button onClick={()=>{onAdd(result);onClose();}} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#ec4899)",border:"none",color:"#fff",fontWeight:700,fontSize:14,padding:"12px",borderRadius:8,cursor:"pointer"}}>
            ＋ Add to Watchlist
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("library");

  const filtered = watchlist.filter(s=>{
    if(filterGenre!=="All"&&s.genre!==filterGenre) return false;
    if(filterStatus!=="All"&&s.status!==filterStatus) return false;
    if(filterType!=="All"&&s.type!==filterType) return false;
    if(search&&!s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:watchlist.length,
    watching:watchlist.filter(s=>s.status==="Watching").length,
    completed:watchlist.filter(s=>s.status==="Completed").length,
    movies:watchlist.filter(s=>s.type==="movie").length,
    series:watchlist.filter(s=>s.type==="series").length,
  };

  const upcomingAirs = watchlist.filter(s=>s.nextAir).sort((a,b)=>new Date(a.nextAir)-new Date(b.nextAir));

  const updateShow = useCallback((updated)=>{
    setWatchlist(prev=>prev.map(s=>s.id===updated.id?updated:s));
  },[]);

  const addShow = useCallback((show)=>{
    setWatchlist(prev=>[...prev,show]);
  },[]);

  const updateStatus = useCallback((id,status)=>{
    setWatchlist(prev=>prev.map(s=>s.id===id?{...s,status}:s));
  },[]);

  const tabs = [{id:"library",icon:"📚",label:"Library"},{id:"schedule",icon:"📅",label:"Schedule"},{id:"stats",icon:"📊",label:"Stats"}];

  return (
    <div style={{minHeight:"100vh",background:"#020617",color:"#f1f5f9",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      
      {/* Header */}
      <div style={{borderBottom:"1px solid #0f172a",background:"#020617",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(10px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:24}}>🎬</div>
            <div style={{fontWeight:800,fontSize:18,background:"linear-gradient(135deg,#818cf8,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CineTrack</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{background:activeTab===t.id?"#1e1b4b":"transparent",border:"none",color:activeTab===t.id?"#818cf8":"#64748b",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13,transition:"all .2s"}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <button onClick={()=>setShowAdd(true)} style={{background:"linear-gradient(135deg,#6366f1,#ec4899)",border:"none",color:"#fff",fontWeight:700,fontSize:13,padding:"8px 16px",borderRadius:8,cursor:"pointer"}}>
            ＋ Add Show
          </button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px"}}>
        {activeTab==="library" && (
          <>
            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:24}}>
              {[
                {label:"Total",val:stats.total,color:"#818cf8"},
                {label:"Watching",val:stats.watching,color:"#22d3ee"},
                {label:"Completed",val:stats.completed,color:"#22c55e"},
                {label:"Movies",val:stats.movies,color:"#ec4899"},
                {label:"Series",val:stats.series,color:"#f59e0b"},
              ].map(s=>(
                <div key={s.label} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:24,fontWeight:800,color:s.color}}>{s.val}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{background:"#0f172a",border:"1px solid #1e293b",color:"#f1f5f9",borderRadius:8,padding:"8px 12px",fontSize:13,minWidth:180}}/>
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{background:"#0f172a",border:"1px solid #1e293b",color:"#94a3b8",borderRadius:8,padding:"8px 10px",fontSize:13}}>
                <option value="All">All Types</option>
                <option value="series">TV Series</option>
                <option value="movie">Movies</option>
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{background:"#0f172a",border:"1px solid #1e293b",color:"#94a3b8",borderRadius:8,padding:"8px 10px",fontSize:13}}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={filterGenre} onChange={e=>setFilterGenre(e.target.value)} style={{background:"#0f172a",border:"1px solid #1e293b",color:"#94a3b8",borderRadius:8,padding:"8px 10px",fontSize:13}}>
                {GENRES.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>

            {/* Grid */}
            {filtered.length===0 ? (
              <div style={{textAlign:"center",padding:"60px 20px",color:"#475569"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎭</div>
                <div style={{fontSize:16,marginBottom:8}}>No shows found</div>
                <div style={{fontSize:13}}>Try adjusting filters or add a new show</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
                {filtered.map(s=><ShowCard key={s.id} show={s} onClick={setSelected} onStatusChange={updateStatus}/>)}
              </div>
            )}
          </>
        )}

        {activeTab==="schedule" && (
          <div>
            <h2 style={{color:"#f1f5f9",marginBottom:20,fontWeight:700}}>Upcoming Episodes</h2>
            {upcomingAirs.length===0 ? (
              <div style={{textAlign:"center",padding:"60px",color:"#475569"}}>
                <div style={{fontSize:48,marginBottom:12}}>📅</div>
                <div>No upcoming episodes tracked</div>
              </div>
            ) : upcomingAirs.map(s=>(
              <div key={s.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"16px 20px",marginBottom:12,display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:40}}>{s.poster}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#f1f5f9",marginBottom:4}}>{s.title}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>Episode {s.watchedEps+1}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:"#22d3ee",fontWeight:700,fontSize:15}}>{new Date(s.nextAir).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{s.runtime}</div>
                </div>
              </div>
            ))}

            <h2 style={{color:"#f1f5f9",margin:"32px 0 20px",fontWeight:700}}>Currently Watching</h2>
            {watchlist.filter(s=>s.status==="Watching").map(s=>(
              <div key={s.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"16px 20px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div style={{fontSize:36}}>{s.poster}</div>
                  <div>
                    <div style={{fontWeight:700,color:"#f1f5f9"}}>{s.title}</div>
                    <div style={{fontSize:12,color:"#64748b"}}>{s.type==="series"?`${s.watchedEps}/${s.episodes} episodes`:s.runtime}</div>
                  </div>
                </div>
                {s.type==="series" && s.episodes && (
                  <div style={{background:"#1e293b",borderRadius:999,height:6,overflow:"hidden"}}>
                    <div style={{height:"100%",width:Math.round((s.watchedEps/s.episodes)*100)+"%",background:"linear-gradient(90deg,#6366f1,#ec4899)",transition:"width .3s"}}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab==="stats" && (
          <div>
            <h2 style={{color:"#f1f5f9",marginBottom:20,fontWeight:700}}>Your Stats</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
              <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:20}}>
                <div style={{fontSize:32,fontWeight:800,color:"#818cf8"}}>{watchlist.reduce((a,s)=>a+(s.type==="movie"?1:(s.watchedEps||0)),0)}</div>
                <div style={{color:"#64748b",fontSize:13,marginTop:4}}>Total episodes + movies watched</div>
              </div>
              <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:20}}>
                <div style={{fontSize:32,fontWeight:800,color:"#22c55e"}}>{watchlist.filter(s=>s.status==="Completed").length}</div>
                <div style={{color:"#64748b",fontSize:13,marginTop:4}}>Shows completed</div>
              </div>
              <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:20}}>
                <div style={{fontSize:32,fontWeight:800,color:"#f59e0b"}}>{watchlist.length>0?(watchlist.reduce((a,s)=>a+(s.myRating||0),0)/watchlist.filter(s=>s.myRating>0).length||0).toFixed(1):0}</div>
                <div style={{color:"#64748b",fontSize:13,marginTop:4}}>Average personal rating</div>
              </div>
            </div>

            <h3 style={{color:"#94a3b8",fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px",marginBottom:16}}>By Genre</h3>
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:20,marginBottom:20}}>
              {Object.entries(watchlist.reduce((acc,s)=>{acc[s.genre]=(acc[s.genre]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).map(([genre,count])=>(
                <div key={genre} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"#94a3b8",fontSize:13}}>{genre}</span>
                    <span style={{color:"#f1f5f9",fontSize:13,fontWeight:600}}>{count}</span>
                  </div>
                  <div style={{background:"#1e293b",borderRadius:999,height:6}}>
                    <div style={{height:"100%",width:(count/watchlist.length*100)+"%",background:genreColors[genre]||"#6366f1",borderRadius:999,transition:"width .3s"}}/>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{color:"#94a3b8",fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px",marginBottom:16}}>Top Rated (by you)</h3>
            {watchlist.filter(s=>s.myRating>0).sort((a,b)=>b.myRating-a.myRating).slice(0,5).map((s,i)=>(
              <div key={s.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#1e1b4b",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#818cf8"}}>{i+1}</div>
                <div style={{fontSize:24}}>{s.poster}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:"#f1f5f9",fontSize:14}}>{s.title}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{s.year}</div>
                </div>
                <div style={{display:"flex",gap:2}}>{[1,2,3,4,5,6,7,8,9,10].map(n=><span key={n} style={{color:n<=s.myRating?"#f59e0b":"#1e293b",fontSize:12}}>★</span>)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <DetailModal show={selected} onClose={()=>setSelected(null)} onUpdate={updated=>{updateShow(updated);setSelected(null);}}/>}
      {showAdd && <AddModal onClose={()=>setShowAdd(false)} onAdd={addShow}/>}
    </div>
  );
}