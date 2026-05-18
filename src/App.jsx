import { useState, useEffect, useCallback, useMemo } from "react";

/* ── Goals ── */
const WEEKDAY = { cal: 2200, protein: 160, carbs: 120, fat: 80 };
const SUNDAY = { cal: 2600, protein: 160, carbs: 200, fat: 80 };
function goalsFor(key) {
  var p = key.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]).getDay() === 0 ? SUNDAY : WEEKDAY;
}

/* ── Foods ── */
var BASE_FOODS = [
  { id: "chicken8", name: "Chicken Breast 8oz", cal: 220, protein: 46, carbs: 0, fat: 4, emoji: "🍗", cat: "Protein" },
  { id: "chicken6", name: "Chicken Breast 6oz", cal: 165, protein: 35, carbs: 0, fat: 3, emoji: "🍗", cat: "Protein" },
  { id: "chicken4", name: "Chicken Breast 4oz", cal: 110, protein: 23, carbs: 0, fat: 2, emoji: "🍗", cat: "Protein" },
  { id: "beef8_937", name: "Ground Beef 93/7 8oz", cal: 280, protein: 46, carbs: 0, fat: 10, emoji: "🥩", cat: "Protein" },
  { id: "beef_065lb", name: "Ground Beef 93/7 0.65lb", cal: 228, protein: 38, carbs: 0, fat: 8, emoji: "🥩", cat: "Protein" },
  { id: "beef8_9010", name: "Ground Beef 90/10 8oz", cal: 310, protein: 46, carbs: 0, fat: 14, emoji: "🥩", cat: "Protein" },
  { id: "steak6", name: "Sirloin Steak 6oz", cal: 260, protein: 38, carbs: 0, fat: 12, emoji: "🥩", cat: "Protein" },
  { id: "salmon5", name: "Salmon 5oz", cal: 260, protein: 35, carbs: 0, fat: 14, emoji: "🐟", cat: "Protein" },
  { id: "tuna1can", name: "Canned Tuna 1 can", cal: 130, protein: 28, carbs: 0, fat: 1, emoji: "🐟", cat: "Protein" },
  { id: "shrimp6oz", name: "Shrimp 6oz", cal: 170, protein: 32, carbs: 2, fat: 2, emoji: "🦐", cat: "Protein" },
  { id: "egg1", name: "1 Whole Egg", cal: 70, protein: 6, carbs: 0, fat: 5, emoji: "🥚", cat: "Eggs" },
  { id: "egg2", name: "2 Whole Eggs", cal: 140, protein: 12, carbs: 0, fat: 10, emoji: "🥚", cat: "Eggs" },
  { id: "egg3", name: "3 Whole Eggs", cal: 210, protein: 18, carbs: 0, fat: 15, emoji: "🥚", cat: "Eggs" },
  { id: "eggwhite3", name: "3 Egg Whites", cal: 51, protein: 11, carbs: 0, fat: 0, emoji: "🥚", cat: "Eggs" },
  { id: "yogurt", name: "Greek Yogurt 1 cup", cal: 150, protein: 20, carbs: 8, fat: 5, emoji: "🥛", cat: "Eggs" },
  { id: "cottagecheese", name: "Cottage Cheese 1 cup", cal: 206, protein: 28, carbs: 8, fat: 5, emoji: "🧀", cat: "Eggs" },
  { id: "sweetpotL", name: "Sweet Potato Large", cal: 225, protein: 4, carbs: 52, fat: 0, emoji: "🍠", cat: "Carbs" },
  { id: "sweetpotM", name: "Sweet Potato Medium", cal: 162, protein: 3, carbs: 37, fat: 0, emoji: "🍠", cat: "Carbs" },
  { id: "rice1", name: "Rice 1 cup cooked", cal: 205, protein: 4, carbs: 45, fat: 0, emoji: "🍚", cat: "Carbs" },
  { id: "ricehalf", name: "Rice 1/2 cup", cal: 103, protein: 2, carbs: 22, fat: 0, emoji: "🍚", cat: "Carbs" },
  { id: "oats_half", name: "Oats 1/2 cup dry", cal: 150, protein: 5, carbs: 27, fat: 3, emoji: "🥣", cat: "Carbs" },
  { id: "banana", name: "Banana", cal: 105, protein: 1, carbs: 27, fat: 0, emoji: "🍌", cat: "Carbs" },
  { id: "broccoli", name: "Broccoli 1 cup", cal: 55, protein: 4, carbs: 11, fat: 0, emoji: "🥦", cat: "Veggies" },
  { id: "spinach2c", name: "Spinach 2 cups", cal: 14, protein: 2, carbs: 2, fat: 0, emoji: "🥬", cat: "Veggies" },
  { id: "asparagus", name: "Asparagus 6 spears", cal: 20, protein: 2, carbs: 4, fat: 0, emoji: "🌿", cat: "Veggies" },
  { id: "avocado", name: "Avocado 1/2", cal: 120, protein: 2, carbs: 6, fat: 11, emoji: "🥑", cat: "Fats" },
  { id: "almonds1oz", name: "Almonds 1oz", cal: 164, protein: 6, carbs: 6, fat: 14, emoji: "🌰", cat: "Fats" },
  { id: "peanutbutter1t", name: "PB 1 tbsp", cal: 94, protein: 4, carbs: 3, fat: 8, emoji: "🥜", cat: "Fats" },
  { id: "oliveoil1tbsp", name: "Olive Oil 1 tbsp", cal: 120, protein: 0, carbs: 0, fat: 14, emoji: "🫒", cat: "Fats" },
  { id: "shake", name: "ISO100 + Almond Milk", cal: 150, protein: 25, carbs: 3, fat: 2, emoji: "🥤", cat: "Drinks" },
  { id: "shake2", name: "ISO100 2 scoops", cal: 270, protein: 50, carbs: 6, fat: 4, emoji: "🥤", cat: "Drinks" },
  { id: "coffee", name: "Black Coffee", cal: 5, protein: 0, carbs: 0, fat: 0, emoji: "☕", cat: "Drinks" },
  { id: "wine5oz", name: "Wine 5oz", cal: 125, protein: 0, carbs: 4, fat: 0, emoji: "🍷", cat: "Drinks" },
  { id: "berries", name: "Frozen Berries 1/2 cup", cal: 40, protein: 1, carbs: 9, fat: 0, emoji: "🫐", cat: "Fruits" },
  { id: "berries1c", name: "Frozen Berries 1 cup", cal: 80, protein: 2, carbs: 18, fat: 0, emoji: "🫐", cat: "Fruits" },
  { id: "ayamgoreng", name: "Ayam Goreng 1pc", cal: 290, protein: 28, carbs: 8, fat: 16, emoji: "🍗", cat: "Indo" },
  { id: "tempe100", name: "Tempe 100g", cal: 195, protein: 19, carbs: 9, fat: 11, emoji: "🟫", cat: "Indo" },
  { id: "rendang100", name: "Rendang 100g", cal: 340, protein: 26, carbs: 8, fat: 22, emoji: "🍖", cat: "Indo" },
  { id: "ikanbakar", name: "Ikan Bakar 1 fillet", cal: 220, protein: 34, carbs: 2, fat: 8, emoji: "🐟", cat: "Indo" },
];

var TEMPLATES = [
  { name: "Lunch: Chicken + Sweet Potato", items: ["chicken8", "sweetpotL", "egg3", "broccoli"] },
  { name: "Dinner: Beef + Avocado", items: ["beef8_937", "egg3", "avocado", "broccoli"] },
  { name: "Post-Workout Shake", items: ["shake"] },
  { name: "Yogurt + Berries", items: ["yogurt", "berries"] },
];

var CATS = ["Top", "All", "Protein", "Eggs", "Carbs", "Veggies", "Fats", "Drinks", "Fruits", "Indo"];

/* ── Helpers ── */
function dk(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function shift(k, n) { var p = k.split("-").map(Number); var x = new Date(p[0], p[1] - 1, p[2]); x.setDate(x.getDate() + n); return dk(x); }
function lbl(k) {
  var t = dk(new Date());
  if (k === t) return "Today";
  if (k === shift(t, -1)) return "Yesterday";
  if (k === shift(t, 1)) return "Tomorrow";
  var p = k.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function sday(k) { var p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString("en-US", { weekday: "short" }); }
function sum(items) {
  return items.reduce(function(a, f) {
    return { cal: a.cal + (f.cal || 0), protein: a.protein + (f.protein || 0), carbs: a.carbs + (f.carbs || 0), fat: a.fat + (f.fat || 0) };
  }, { cal: 0, protein: 0, carbs: 0, fat: 0 });
}

/* ── 3D Sphere Component ── */
function Sphere(props) {
  var size = props.size || 60;
  var colors = props.colors || ["#a78bfa", "#818cf8", "#c4b5fd"];
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, " + colors[2] + ", " + colors[0] + " 50%, " + colors[1] + ")",
        boxShadow: "inset -4px -4px 12px rgba(0,0,0,0.15), inset 4px 4px 12px rgba(255,255,255,0.3), 0 8px 24px " + colors[0] + "40"
      }} />
      <div style={{
        position: "absolute", top: "18%", left: "28%", width: size * 0.25, height: size * 0.15, borderRadius: "50%",
        background: "rgba(255,255,255,0.5)", filter: "blur(2px)", transform: "rotate(-30deg)"
      }} />
    </div>
  );
}

/* ── Main ── */
export default function App() {
  var [tab, setTab] = useState("track");
  var [day, setDay] = useState(dk(new Date()));
  var [data, setData] = useState({});
  var [customs, setCustoms] = useState([]);
  var [hist, setHist] = useState({});
  var [weights, setWeights] = useState({});
  var [showAdd, setShowAdd] = useState(false);
  var [showCustom, setShowCustom] = useState(false);
  var [cat, setCat] = useState("Top");
  var [search, setSearch] = useState("");
  var [cf, setCf] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  var [wi, setWi] = useState("");
  var [loading, setLoading] = useState(true);

  var today = dk(new Date());
  var eaten = data[day] || [];
  var G = goalsFor(day);
  var allFoods = useMemo(function() { return BASE_FOODS.concat(customs); }, [customs]);
  var isSun = useMemo(function() { var p = day.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).getDay() === 0; }, [day]);

  useEffect(function() {
    (async function() {
      var loaded = {};
      var keys = [today];
      for (var i = 1; i <= 21; i++) { keys.push(shift(today, -i)); keys.push(shift(today, i)); }
      for (var j = 0; j < keys.length; j++) {
        try { var r = await window.storage.get("mt:" + keys[j]); if (r && r.value) loaded[keys[j]] = JSON.parse(r.value); } catch (e) {}
      }
      setData(loaded);
      try { var r2 = await window.storage.get("mt:customs"); if (r2 && r2.value) setCustoms(JSON.parse(r2.value)); } catch (e) {}
      try { var r3 = await window.storage.get("mt:hist"); if (r3 && r3.value) setHist(JSON.parse(r3.value)); } catch (e) {}
      try { var r4 = await window.storage.get("mt:weights"); if (r4 && r4.value) setWeights(JSON.parse(r4.value)); } catch (e) {}
      setLoading(false);
    })();
  }, []);

  var sv = useCallback(async function(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch (e) {} }, []);

  function recEat(fid) {
    var hr = new Date().getHours();
    var per = hr < 11 ? "am" : hr < 16 ? "mid" : "pm";
    setHist(function(prev) {
      var next = Object.assign({}, prev);
      if (!next[fid]) next[fid] = { c: 0, p: {} };
      next[fid].c += 1;
      next[fid].p[per] = (next[fid].p[per] || 0) + 1;
      sv("mt:hist", next);
      return next;
    });
  }

  function addFood(food) {
    var item = Object.assign({}, food, { ts: Date.now() });
    var next = eaten.concat([item]);
    setData(function(p) { return Object.assign({}, p, { [day]: next }); });
    sv("mt:" + day, next);
    recEat(food.id);
  }

  function addTpl(t) {
    var ts = Date.now();
    var items = [];
    for (var i = 0; i < t.items.length; i++) {
      var f = allFoods.find(function(x) { return x.id === t.items[i]; });
      if (f) { recEat(f.id); items.push(Object.assign({}, f, { ts: ts + i })); }
    }
    var next = eaten.concat(items);
    setData(function(p) { return Object.assign({}, p, { [day]: next }); });
    sv("mt:" + day, next);
    setShowAdd(false);
  }

  function addCustom() {
    if (!cf.name || !cf.cal) return;
    var id = "c_" + Date.now();
    var food = { id: id, name: cf.name, cal: Number(cf.cal) || 0, protein: Number(cf.protein) || 0, carbs: Number(cf.carbs) || 0, fat: Number(cf.fat) || 0, emoji: "✦", cat: "Custom" };
    var nc = customs.concat([food]);
    setCustoms(nc);
    sv("mt:customs", nc);
    addFood(food);
    setCf({ name: "", cal: "", protein: "", carbs: "", fat: "" });
    setShowCustom(false);
  }

  function removeItem(ts) {
    var next = eaten.filter(function(e) { return e.ts !== ts; });
    setData(function(p) { return Object.assign({}, p, { [day]: next }); });
    sv("mt:" + day, next);
  }

  async function clearDay() {
    setData(function(p) { return Object.assign({}, p, { [day]: [] }); });
    try { await window.storage.delete("mt:" + day); } catch (e) {}
  }

  function logW() {
    var w = parseFloat(wi);
    if (isNaN(w)) return;
    var nw = Object.assign({}, weights, { [day]: w });
    setWeights(nw);
    sv("mt:weights", nw);
    setWi("");
  }

  var totals = sum(eaten);
  var rem = { cal: Math.max(0, G.cal - totals.cal), protein: Math.max(0, G.protein - totals.protein), carbs: Math.max(0, G.carbs - totals.carbs), fat: Math.max(0, G.fat - totals.fat) };
  var over = totals.cal > G.cal;

  var ranked = useMemo(function() {
    var hr = new Date().getHours();
    var per = hr < 11 ? "am" : hr < 16 ? "mid" : "pm";
    return allFoods.slice().sort(function(a, b) {
      var ha = hist[a.id] || { c: 0, p: {} };
      var hb = hist[b.id] || { c: 0, p: {} };
      var fitA = (rem.protein > 20 ? a.protein * 2 : 0) - (rem.carbs < 20 && a.carbs > 20 ? 30 : 0);
      var fitB = (rem.protein > 20 ? b.protein * 2 : 0) - (rem.carbs < 20 && b.carbs > 20 ? 30 : 0);
      return ((hb.c || 0) * 10 + ((hb.p && hb.p[per]) || 0) * 15 + fitB) - ((ha.c || 0) * 10 + ((ha.p && ha.p[per]) || 0) * 15 + fitA);
    });
  }, [allFoods, hist, rem]);

  var frequent = useMemo(function() { return ranked.filter(function(f) { return hist[f.id] && hist[f.id].c > 0; }).slice(0, 12); }, [ranked, hist]);

  var filtered = useMemo(function() {
    var list;
    if (cat === "Top") list = frequent.length > 0 ? frequent : ranked.slice(0, 12);
    else if (cat === "All") list = ranked;
    else if (cat === "Custom") list = customs;
    else list = allFoods.filter(function(f) { return f.cat === cat; });
    if (search.trim()) { var q = search.toLowerCase(); list = list.filter(function(f) { return f.name.toLowerCase().indexOf(q) >= 0; }); }
    return list;
  }, [cat, ranked, frequent, allFoods, customs, search]);

  var sugs = useMemo(function() {
    if (!eaten.length || rem.cal < 50) return [];
    var result = [];
    if (rem.protein > 40 && rem.cal > 400) {
      result.push(rem.carbs > 30
        ? { f: "Chicken + Sweet Potato + Eggs", r: Math.round(rem.protein) + "g protein left with carb budget. Refuel glycogen." }
        : { f: "Beef + Eggs + Avocado", r: Math.round(rem.protein) + "g protein needed, carbs maxed. High protein, zero carbs." });
    } else if (rem.protein > 15) {
      result.push({ f: "Greek Yogurt + Berries", r: Math.round(rem.protein) + "g protein left. 20g in 150 cal." });
    } else {
      result.push({ f: "Done for today", r: "Protein hit. " + Math.round(rem.cal) + " cal left. Only eat if hungry." });
    }
    if (isSun && rem.carbs > 50) result.push({ f: "Refeed: rice is allowed", r: Math.round(rem.carbs) + "g carbs left. Church rice fills glycogen." });
    return result.slice(0, 2);
  }, [eaten, rem, isSun]);

  var weekDays = useMemo(function() { var d = []; for (var i = 6; i >= 0; i--) d.push(shift(today, -i)); return d; }, [today]);
  var streak = useMemo(function() { var c = 0; for (var i = 0; i < 30; i++) { if ((data[shift(today, -i)] || []).length > 0) c++; else break; } return c; }, [data, today]);
  var grocery = useMemo(function() {
    var counts = {};
    for (var i = 0; i < 7; i++) { var items = data[shift(today, -i)] || []; items.forEach(function(f) { if (f.name) counts[f.name] = (counts[f.name] || 0) + 1; }); }
    return Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 15);
  }, [data, today]);

  if (loading) return (
    <div style={{ background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 50%, #f0e6ff 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 32, padding: "40px 60px", boxShadow: "0 25px 60px rgba(124,58,237,0.12)" }}>
        <Sphere size={48} />
      </div>
    </div>
  );

  /* ── Styles ── */
  var accent = "#7c3aed";
  var accentLight = "#a78bfa";
  var accentBg = "#ede9fe";
  var card = { background: "white", borderRadius: 24, padding: 20, boxShadow: "0 12px 40px rgba(124,58,237,0.08)", marginBottom: 14 };
  var pill = function(active) { return { padding: "8px 18px", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: active ? 700 : 500, background: active ? accent : "white", color: active ? "white" : "#6b7280", border: "none", borderRadius: 100, cursor: "pointer", boxShadow: active ? "0 4px 16px rgba(124,58,237,0.3)" : "0 2px 8px rgba(0,0,0,0.04)" }; };

  var macros = [
    { l: "Calories", c: totals.cal, g: G.cal, col: accent, u: "" },
    { l: "Protein", c: totals.protein, g: G.protein, col: "#3b82f6", u: "g" },
    { l: "Carbs", c: totals.carbs, g: G.carbs, col: "#f59e0b", u: "g" },
    { l: "Fat", c: totals.fat, g: G.fat, col: "#10b981", u: "g" },
  ];

  return (
    <div style={{ background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 50%, #f0e6ff 100%)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: 100 }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1f2937", margin: 0, letterSpacing: "-0.5px" }}>Macro Tracker</h1>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0", fontWeight: 500 }}>
              {isSun ? "Sunday Refeed Day" : "Cutting to 185 lbs"} {streak > 0 ? " · " + streak + " day streak 🔥" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Sphere size={36} colors={["#a78bfa", "#818cf8", "#ddd6fe"]} />
            <Sphere size={24} colors={["#fbbf24", "#f59e0b", "#fde68a"]} />
          </div>
        </div>

        {/* Day Nav Card */}
        <div style={Object.assign({}, card, { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" })}>
          <button onClick={function() { setDay(function(d) { return shift(d, -1); }); setShowAdd(false); }} style={{ background: accentBg, border: "none", color: accent, cursor: "pointer", padding: "8px 16px", borderRadius: 100, fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: day === today ? accent : "#1f2937" }}>{lbl(day)}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{day}{isSun ? " · Refeed" : ""}</div>
          </div>
          <button onClick={function() { setDay(function(d) { return shift(d, 1); }); setShowAdd(false); }} style={{ background: accentBg, border: "none", color: accent, cursor: "pointer", padding: "8px 16px", borderRadius: 100, fontSize: 16, fontWeight: 700, fontFamily: "inherit" }}>›</button>
        </div>
        {day !== today && (
          <button onClick={function() { setDay(today); }} style={{ width: "100%", padding: 8, marginBottom: 14, fontSize: 12, fontFamily: "inherit", fontWeight: 600, background: "white", color: accent, border: "none", borderRadius: 100, cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.1)" }}>
            Back to Today
          </button>
        )}

        {/* ── TRACK TAB ── */}
        {tab === "track" && (
          <div>
            {/* Macro Rings */}
            <div style={Object.assign({}, card, { padding: 18 })}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {macros.map(function(m) {
                  var pct = Math.min(100, (m.c / m.g) * 100);
                  var isO = m.c > m.g;
                  var col = isO ? "#ef4444" : m.col;
                  var r = 22; var circ = 2 * Math.PI * r;
                  return (
                    <div key={m.l} style={{ textAlign: "center" }}>
                      <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto 6px" }}>
                        <svg width="52" height="52" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
                          <circle cx="26" cy="26" r={r} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round" strokeDasharray={(pct / 100) * circ + " " + circ} transform="rotate(-90 26 26)" />
                        </svg>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 10, fontWeight: 700, color: col }}>{Math.round(pct)}%</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>{Math.round(m.c)}{m.u}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>of {m.g}{m.u}</div>
                      <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>{m.l}</div>
                    </div>
                  );
                })}
              </div>
              {over && <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444", textAlign: "center", fontWeight: 600, background: "#fef2f2", padding: "6px 12px", borderRadius: 100 }}>Over by {Math.round(totals.cal - G.cal)} cal</div>}
              {totals.protein >= G.protein && !over && <div style={{ marginTop: 10, fontSize: 12, color: "#10b981", textAlign: "center", fontWeight: 600, background: "#ecfdf5", padding: "6px 12px", borderRadius: 100 }}>Protein goal hit ✓</div>}
            </div>

            {/* Remaining */}
            <div style={Object.assign({}, card, { padding: 16 })}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>Remaining</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                {[{ l: "Cal", v: rem.cal, c: accent }, { l: "Protein", v: rem.protein, u: "g", c: "#3b82f6" }, { l: "Carbs", v: rem.carbs, u: "g", c: "#f59e0b" }, { l: "Fat", v: rem.fat, u: "g", c: "#10b981" }].map(function(r2) {
                  return (
                    <div key={r2.l} style={{ textAlign: "center", background: r2.v === 0 ? "#ecfdf5" : "#f9fafb", padding: "10px 4px", borderRadius: 16 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: r2.v === 0 ? "#10b981" : r2.c }}>{Math.round(r2.v)}{r2.u || ""}</div>
                      <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600 }}>{r2.l}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggestions */}
            {sugs.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {sugs.map(function(sg, i) {
                  return (
                    <div key={i} style={Object.assign({}, card, { display: "flex", gap: 14, alignItems: "center", padding: 16, marginBottom: 8, background: "linear-gradient(135deg, #faf5ff, #eef2ff)" })}>
                      <Sphere size={40} colors={i === 0 ? ["#a78bfa", "#818cf8", "#ddd6fe"] : ["#fbbf24", "#f59e0b", "#fde68a"]} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>{sg.f}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{sg.r}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Food */}
            <button onClick={function() { setShowAdd(function(p) { return !p; }); }} style={{ width: "100%", padding: 14, fontSize: 14, fontFamily: "inherit", fontWeight: 700, background: showAdd ? "#f3f4f6" : accent, color: showAdd ? "#6b7280" : "white", border: "none", borderRadius: 100, cursor: "pointer", boxShadow: showAdd ? "none" : "0 8px 24px rgba(124,58,237,0.3)", marginBottom: 12 }}>
              {showAdd ? "Close" : "+ Add Food"}
            </button>

            {showAdd && (
              <div style={Object.assign({}, card, { padding: 16 })}>
                <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search foods..." style={{ width: "100%", padding: "12px 18px", fontSize: 14, fontFamily: "inherit", background: "#f9fafb", color: "#1f2937", border: "2px solid #f3f4f6", borderRadius: 100, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />

                {!search && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>Quick Meals</div>
                    {TEMPLATES.map(function(t, i) {
                      var tc = t.items.reduce(function(a, id) { var f = allFoods.find(function(x) { return x.id === id; }); return a + (f ? f.cal : 0); }, 0);
                      var tp = t.items.reduce(function(a, id) { var f = allFoods.find(function(x) { return x.id === id; }); return a + (f ? f.protein : 0); }, 0);
                      return (
                        <button key={i} onClick={function() { addTpl(t); }} style={{ width: "100%", padding: "12px 16px", marginBottom: 6, fontSize: 13, fontFamily: "inherit", fontWeight: 500, background: "#faf5ff", color: "#1f2937", border: "none", borderRadius: 16, cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 600 }}>{t.name}</span>
                          <span style={{ color: "#9ca3af", fontSize: 12 }}>{tc} cal · {tp}P</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!search && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {(customs.length > 0 ? CATS.concat(["Custom"]) : CATS).map(function(c) {
                      return <button key={c} onClick={function() { setCat(c); }} style={pill(cat === c)}>{c === "Top" ? "Top ★" : c}</button>;
                    })}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 260, overflowY: "auto" }}>
                  {filtered.map(function(f) {
                    var freq = hist[f.id] ? hist[f.id].c : 0;
                    return (
                      <button key={f.id} onClick={function() { addFood(f); }} style={{ padding: 12, fontSize: 12, fontFamily: "inherit", fontWeight: 500, background: "#f9fafb", color: "#4b5563", border: "none", borderRadius: 18, cursor: "pointer", textAlign: "left", position: "relative" }}>
                        <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 3 }}>{f.emoji} {f.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{f.cal}cal · {f.protein}P</div>
                        {freq > 0 && <div style={{ position: "absolute", top: 8, right: 10, fontSize: 9, color: accent, fontWeight: 700, background: accentBg, padding: "2px 6px", borderRadius: 100 }}>x{freq}</div>}
                      </button>
                    );
                  })}
                </div>

                <button onClick={function() { setShowCustom(function(p) { return !p; }); }} style={{ width: "100%", padding: 10, marginTop: 10, fontSize: 12, fontFamily: "inherit", fontWeight: 600, background: "transparent", color: "#9ca3af", border: "2px dashed #e5e7eb", borderRadius: 100, cursor: "pointer" }}>
                  + Custom Food
                </button>

                {showCustom && (
                  <div style={{ marginTop: 10, padding: 16, background: "#faf5ff", borderRadius: 20 }}>
                    <input value={cf.name} onChange={function(e) { setCf(function(p) { return Object.assign({}, p, { name: e.target.value }); }); }} placeholder="Food name" style={{ width: "100%", padding: "10px 16px", marginBottom: 8, fontSize: 13, fontFamily: "inherit", background: "white", color: "#1f2937", border: "2px solid #ede9fe", borderRadius: 100, boxSizing: "border-box", outline: "none" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                      {[["cal", "Cal"], ["protein", "P"], ["carbs", "C"], ["fat", "F"]].map(function(inp) {
                        return <input key={inp[0]} value={cf[inp[0]]} onChange={function(e) { setCf(function(p) { return Object.assign({}, p, { [inp[0]]: e.target.value }); }); }} placeholder={inp[1]} type="number" style={{ padding: "8px 4px", fontSize: 12, fontFamily: "inherit", fontWeight: 600, background: "white", color: "#1f2937", border: "2px solid #ede9fe", borderRadius: 12, textAlign: "center", outline: "none" }} />;
                      })}
                    </div>
                    <button onClick={addCustom} style={{ width: "100%", padding: 10, marginTop: 10, fontSize: 13, fontFamily: "inherit", fontWeight: 700, background: accent, color: "white", border: "none", borderRadius: 100, cursor: "pointer" }}>Save and Add</button>
                  </div>
                )}
              </div>
            )}

            {/* Food Log */}
            {eaten.length > 0 && (
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600 }}>{lbl(day)} · {eaten.length} items</span>
                  <button onClick={clearDay} style={{ padding: "4px 12px", fontSize: 10, fontFamily: "inherit", fontWeight: 600, background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 100, cursor: "pointer" }}>Clear</button>
                </div>
                {eaten.map(function(item) {
                  return (
                    <div key={item.ts} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fafb", borderRadius: 14, marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 16 }}>{item.emoji || "✦"}</span>
                        <span style={{ color: "#1f2937", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>{item.protein || 0}P</span>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{item.cal}cal</span>
                        <button onClick={function() { removeItem(item.ts); }} style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", fontSize: 18, padding: 0 }}>x</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {tab === "progress" && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>Log Weight</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={weights[today] ? String(weights[today]) : wi} onChange={function(e) { if (!weights[today]) setWi(e.target.value); }} placeholder="lbs" type="number" style={{ flex: 1, padding: "12px 18px", fontSize: 15, fontFamily: "inherit", fontWeight: 600, background: "#f9fafb", color: "#1f2937", border: "2px solid #f3f4f6", borderRadius: 100, outline: "none" }} />
                <button onClick={logW} disabled={!!weights[today]} style={{ padding: "12px 24px", fontSize: 13, fontFamily: "inherit", fontWeight: 700, background: weights[today] ? "#f3f4f6" : accent, color: weights[today] ? "#9ca3af" : "white", border: "none", borderRadius: 100, cursor: weights[today] ? "default" : "pointer" }}>
                  {weights[today] ? "Logged" : "Save"}
                </button>
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>Weight Trend</div>
              <WeightChart weights={weights} />
            </div>

            <div style={card}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>This Week</div>
              {weekDays.map(function(d) {
                var items = data[d] || [];
                var dc = sum(items).cal;
                var dp = sum(items).protein;
                var dg = goalsFor(d);
                return (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: d === today ? accentBg : "#f9fafb", borderRadius: 14, marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: d === today ? accent : "#1f2937" }}>{sday(d)}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{d.slice(5)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: dc ? (dc <= dg.cal ? "#10b981" : "#ef4444") : "#d1d5db" }}>{dc || "--"}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: dp ? "#3b82f6" : "#d1d5db" }}>{dp || "--"}P</span>
                      {weights[d] && <span style={{ fontSize: 12, color: "#6b7280" }}>{weights[d]}lb</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={Object.assign({}, card, { display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, #faf5ff, #eef2ff)" })}>
              <Sphere size={44} colors={["#f59e0b", "#fbbf24", "#fde68a"]} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{streak} day streak 🔥</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{streak >= 7 ? "Full week locked in." : streak >= 3 ? "Building momentum." : "Log daily to build it."}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── GROCERY TAB ── */}
        {tab === "grocery" && (
          <div>
            <div style={card}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>Last 7 Days</div>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px" }}>What you actually ate. Buy this for next week.</p>
              {grocery.length > 0 ? grocery.map(function(entry, i) {
                var food = allFoods.find(function(f) { return f.name === entry[0]; });
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fafb", borderRadius: 14, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>{food ? food.emoji : "✦"} {entry[0]}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: accent, background: accentBg, padding: "2px 10px", borderRadius: 100 }}>x{entry[1]}</span>
                  </div>
                );
              }) : <div style={{ textAlign: "center", padding: 24, color: "#d1d5db", fontSize: 13 }}>Log a few days first</div>}
            </div>

            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", marginBottom: 10 }}>Weekly Staples</div>
              {["5 lbs chicken breast", "2 lbs ground beef 93/7", "2.5 dozen eggs", "6 sweet potatoes", "3 heads broccoli", "3 avocados", "Greek yogurt 32oz", "Frozen berries (2 bags)", "Almond milk"].map(function(item, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#4b5563", marginBottom: 5 }}>
                    <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── INSULIN TAB ── */}
        {tab === "insulin" && (
          <div>
            <div style={Object.assign({}, card, { background: "linear-gradient(135deg, #faf5ff, #eef2ff)", display: "flex", gap: 14, alignItems: "center" })}>
              <Sphere size={48} colors={["#ef4444", "#f87171", "#fecaca"]} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>Insulin Protocol</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Stack these. 4 to 6 weeks to results.</div>
              </div>
            </div>
            {[
              { t: "Eat Protein First, Carbs Last", d: "Meat and eggs FIRST, veggies second, sweet potato LAST. Slows glucose by 40%.", p: "c" },
              { t: "Walk 10 Min After Lunch", d: "Cuts blood sugar spike by 30%. Walk to your next class.", p: "c" },
              { t: "Fiber Every Meal", d: "Broccoli at every meal. Slows sugar absorption. Non-negotiable.", p: "c" },
              { t: "No Carbs at Dinner", d: "Insulin drops at night. Dinner = protein + fat + veggies.", p: "c" },
              { t: "ACV Before Lunch", d: "1 tbsp in water 15 min before carbs. Reduces spikes 20 to 30%.", p: "o" },
              { t: "Fasted Training", d: "Already doing this. Keeps improving over time.", p: "d" },
              { t: "Magnesium Before Bed", d: "200 to 400mg glycinate. Insulin signaling + sleep.", p: "c" },
              { t: "7 to 8 Hours Sleep", d: "Under 6 hrs = 25% insulin sensitivity drop.", p: "c" },
              { t: "Fish Oil Daily", d: "2 to 3g EPA/DHA. Cell membrane response. 4 to 6 weeks.", p: "c" },
              { t: "Creatine Daily", d: "Glucose uptake in muscle. Stay consistent.", p: "d" },
              { t: "Build Muscle", d: "Largest glucose sink. Every lb of muscle helps.", p: "l" },
              { t: "Cut Fat", d: "194 to 185. Measurable improvement in 4 to 6 weeks.", p: "l" },
            ].map(function(tip, i) {
              var colors = { c: ["#ef4444", "#fef2f2"], d: ["#10b981", "#ecfdf5"], o: ["#f59e0b", "#fffbeb"], l: ["#3b82f6", "#eff6ff"] };
              var labels = { c: "Critical", d: "Doing", o: "Optional", l: "Long-term" };
              var col = colors[tip.p];
              return (
                <div key={i} style={Object.assign({}, card, { padding: 16, marginBottom: 8 })}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{tip.t}</span>
                    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: col[1], color: col[0] }}>{labels[tip.p]}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{tip.d}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FLOATING NAV BAR ── */}
      <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "#1f2937", borderRadius: 100, padding: "8px 8px", display: "flex", gap: 4, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", zIndex: 100 }}>
        {[
          { id: "track", icon: "◉", label: "Track" },
          { id: "progress", icon: "◈", label: "Progress" },
          { id: "grocery", icon: "◇", label: "Grocery" },
          { id: "insulin", icon: "◆", label: "Insulin" },
        ].map(function(item) {
          var active = tab === item.id;
          return (
            <button key={item.id} onClick={function() { setTab(item.id); }} style={{ padding: "10px 18px", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: active ? 700 : 500, background: active ? accent : "transparent", color: active ? "white" : "#9ca3af", border: "none", borderRadius: 100, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {active && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeightChart(props) {
  var entries = Object.entries(props.weights).sort(function(a, b) { return a[0].localeCompare(b[0]); }).slice(-14);
  if (entries.length < 2) return <div style={{ color: "#d1d5db", fontSize: 12, textAlign: "center", padding: 20 }}>Log weight for 2+ days to see trend</div>;
  var vals = entries.map(function(e) { return e[1]; });
  var mn = Math.min.apply(null, vals) - 2;
  var mx = Math.max.apply(null, vals) + 2;
  var range = mx - mn || 1;
  var W = 380; var H = 80;
  var gap = (W - 40) / (entries.length - 1);
  var points = entries.map(function(e, i) { return { x: 30 + i * gap, y: 5 + H - ((e[1] - mn) / range) * H, v: e[1], d: e[0] }; });
  var line = points.map(function(p) { return p.x + "," + p.y; }).join(" ");
  var delta = (vals[vals.length - 1] - vals[0]).toFixed(1);
  var dcol = vals[vals.length - 1] <= vals[0] ? "#10b981" : "#ef4444";

  return (
    <div>
      <svg width={W} height={H + 28} viewBox={"0 0 " + W + " " + (H + 28)} style={{ display: "block", width: "100%" }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#wg)" points={points.map(function(p) { return p.x + "," + p.y; }).join(" ") + " " + points[points.length - 1].x + "," + (H + 5) + " " + points[0].x + "," + (H + 5)} />
        <polyline fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={line} />
        {points.map(function(p, i) {
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#7c3aed" strokeWidth="2" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="600">{p.v}</text>
              <text x={p.x} y={H + 22} textAnchor="middle" fill="#d1d5db" fontSize="8">{p.d.slice(5)}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
        <span style={{ color: "#9ca3af" }}>Start: <strong style={{ color: "#1f2937" }}>{vals[0]}</strong></span>
        <span style={{ color: "#9ca3af" }}>Now: <strong style={{ color: dcol }}>{vals[vals.length - 1]}</strong></span>
        <span style={{ color: "#9ca3af" }}>Change: <strong style={{ color: dcol }}>{delta > 0 ? "+" : ""}{delta}</strong></span>
      </div>
    </div>
  );
}