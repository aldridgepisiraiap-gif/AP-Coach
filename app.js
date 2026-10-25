const $=id=>document.getElementById(id);
const exercises=[["Push-ups","Chest"],["Dumbbell floor press","Chest"],["Dumbbell curls","Arms"],["Hammer curls","Arms"],["Overhead dumbbell triceps extensions","Arms"],["Dumbbell shoulder press","Shoulders"],["Lateral raises","Shoulders"],["Reverse fly","Shoulders"],["One-arm dumbbell rows","Back"],["Bent-over dumbbell rows","Back"],["Squats","Legs"]];
const bosses=[
["Blue Venom-Fanged Kasaka","E-RANK"],["Steel-Fanged Lycan","E-RANK"],["Goblin Chief","E-RANK"],["Hobgoblin Warrior","E-RANK"],["Cave Bear","D-RANK"],["Arachnid Matriarch","D-RANK"],["High Orc Vanguard","D-RANK"],["Ice Elf Scout","C-RANK"],["Red-Eyed Ice Elf","C-RANK"],["Blood-Red Commander","C-RANK"],["Demon Castle Guardian","B-RANK"],["Baruka, the Ice Elf Chief","B-RANK"],["Cerberus, Gate Guardian","B-RANK"],["Tusk, High Orc Shaman","A-RANK"],["Ant Queen's Guard","A-RANK"],["Beru, the Ant King","S-RANK"],["Kargalgan, the High Orc Shaman","S-RANK"],["The Architect's Trial","S-RANK"]];
let data=JSON.parse(localStorage.getItem("yegevha-v2")||"{}");
Object.assign(data,{name:data.name||"Gevha",character:data.character||"Sung Jin-woo",level:data.level||1,xp:data.xp||0,streak:data.streak||0,bosses:data.bosses||0,distance:data.distance||0,records:data.records||{},completed:data.completed||[],lastDay:data.lastDay||"",gateAccepted:data.gateAccepted||false,post60:data.post60||false,bossChallenge:data.bossChallenge||null,bossHistory:data.bossHistory||[]});
const save=()=>localStorage.setItem("yegevha-v2",JSON.stringify(data));
const rankFor=l=>["E","D","C","B","A","S"][Math.min(5,Math.floor((l-1)/10))];
const dayKey=()=>new Date().toLocaleDateString("en-CA");
const reps=()=>4+Math.min(56,data.level); // level 1 = 5, then +1 each level
function render(){let rank=rankFor(data.level);$("hunterTitle").textContent=data.name.toUpperCase();$("rankLine").textContent=`${rank}-RANK · LEVEL ${data.level}`;$("streakLine").textContent=`🔥 Streak: ${data.streak} days`;$("xpLine").textContent=`${data.xp} XP`;$("xpbar").style.width=(data.xp%300/300*100)+"%";$("homeSub").textContent=`Level ${data.level} · ${reps()} reps × 3 sets`;$("sRank").textContent=rank+"-Rank";$("sLevel").textContent=`${data.level} / 60`;$("sStreak").textContent=data.streak+" days";$("sBosses").textContent=data.bosses;$("sDistance").textContent=data.distance.toFixed(2)+" km";$("sXP").textContent=data.xp;$("nameInput").value=data.name;$("characterInput").value=data.character;renderCalendar();renderBossHistory();if(data.level<=60&&!data.gateAccepted&&!data.bossChallenge&&data.completed.length===exercises.length)$("gateModal").classList.remove("hidden")}
function renderBossHistory(){const el=$("bossHistory");if(!el)return;if(!data.bossHistory.length){el.textContent="No boss challenges yet.";return;}el.innerHTML=data.bossHistory.slice().reverse().map(h=>`<div class="history-item"><b>${h.boss}</b><br>Stage 1: ${h.stage1Date||"Pending"}<br>Stage 2: ${h.stage2Date||"Pending — complete on a later day"}<br>Run: ${h.distance} km · ${h.status}</div>`).join("")}
function renderCalendar(){let cal=$("calendar");cal.innerHTML="";let now=new Date(),y=now.getFullYear(),m=now.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();for(let i=0;i<first;i++){let d=document.createElement("div");cal.append(d)}for(let d=1;d<=n;d++){let el=document.createElement("div"),key=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;el.className="day"+(data.records[key]?" done":"");el.textContent=d;el.title=data.records[key]||"No record";cal.append(el)}}
let running=false,paused=false,exerciseIndex=0,setIndex=1,rep=0,seconds=3,rest=20,phase="rep",timer=null;
function begin(){if(data.completed.length>=exercises.length)data.completed=[];exerciseIndex=0;setIndex=1;rep=0;seconds=3;phase="rep";running=true;paused=false;$("workoutPanel").classList.remove("hidden");$("startBtn").classList.add("hidden");$("pauseBtn").textContent="PAUSE";drawWorkout();tick()}
function drawWorkout(){let ex=exercises[exerciseIndex];$("muscle").textContent=ex[1].toUpperCase();$("exercise").textContent=ex[0];$("setNo").textContent=`${setIndex} / 3`;$("target").textContent=reps();$("count").textContent=rep;$("workProgress").style.width=((exerciseIndex*3+(setIndex-1)+rep/reps())/(exercises.length*3)*100)+"%";$("restBox").classList.toggle("hidden",phase!=="rest");$("timer").classList.toggle("hidden",phase==="rest");$("phase").textContent=phase==="rest"?"REST PERIOD":"TRAINING IN PROGRESS";if(phase==="rest")$("restTime").textContent=rest;else $("timer").textContent=`Next rep in ${seconds} second${seconds===1?"":"s"}`;}
function tick(){clearInterval(timer);timer=setInterval(()=>{if(!running||paused)return;if(phase==="rest"){rest--;drawWorkout();if(rest<=0){phase="rep";rest=20;seconds=3;rep=0;drawWorkout()}return}seconds--;if(seconds<=0){rep++;seconds=3;if(rep>=reps()){if(setIndex<3){phase="rest";rest=20}else{data.xp+=9;data.completed.push(exercises[exerciseIndex][0]);$("completedList").innerHTML=data.completed.map(n=>`<div>✓ ${n} — Quest Complete</div>`).join("");let key=dayKey();data.records[key]=(data.records[key]||"Workout")+"";if(exerciseIndex<exercises.length-1){exerciseIndex++;setIndex=1;rep=0;phase="rep"}else{finishWorkout();return}}}drawWorkout()}},1000)}
function finishWorkout(){clearInterval(timer);running=false;data.xp+=1;data.records[dayKey()]="Workout complete";let today=dayKey();if(data.lastDay!==today){let yesterday=new Date(Date.now()-86400000).toLocaleDateString("en-CA");data.streak=data.lastDay===yesterday?data.streak+1:1;data.lastDay=today}data.gateAccepted=false;save();$("workoutPanel").classList.add("hidden");$("startBtn").classList.remove("hidden");$("homeTitle").textContent="Workout Complete";$("homeSub").textContent="Daily quest completed. Well done, Hunter.";render();if(data.level<=60){$("gateName").textContent=`Level ${data.level} Boss Gate`;$("gateDesc").textContent=`Your next encounter: ${pickBoss()[0]}. Accept when you're ready.`;$("gateModal").classList.remove("hidden")}}
function pickBoss(){let unlocked=bosses.filter(b=>["E-RANK","D-RANK","C-RANK","B-RANK","A-RANK","S-RANK"].indexOf(b[1])<=Math.floor((data.level-1)/10));if(data.level>60){data.post60=true;return bosses[Math.floor(Math.random()*bosses.length)]}return unlocked[unlocked.length-1]||bosses[0]}
$("startBtn").onclick=begin;$("pauseBtn").onclick=()=>{paused=!paused;$("pauseBtn").textContent=paused?"RESUME":"PAUSE";$("workMessage").textContent=paused?"Timer paused. Resume when ready.":""};
$("settingsBtn").onclick=()=>{ $("homePage").classList.add("hidden");$("bossPage").classList.add("hidden");$("settingsPage").classList.remove("hidden");render()};$("backBtn").onclick=()=>{$("settingsPage").classList.add("hidden");$("homePage").classList.remove("hidden")};
$("saveProfile").onclick=()=>{data.name=$("nameInput").value.trim()||"Gevha";data.character=$("characterInput").value;save();render();alert("Hunter profile saved.")};
function runningDistance(){return 2+data.bosses;}
function openBossPage(){
  const c=data.bossChallenge;
  if(!c)return;
  const b=c.boss||pickBoss();
  $("gateModal").classList.add("hidden");$("homePage").classList.add("hidden");$("settingsPage").classList.add("hidden");$("bossPage").classList.remove("hidden");
  $("bossTitle").textContent=b[0];$("bossRank").textContent=b[1]+" BOSS";
  const stage2=c.stage1Done;
  if(!stage2){
    $("bossDesc").textContent=`STAGE 1 OF 2 — Exercise challenge: complete 3× your normal workout volume for Level ${data.level} (${reps()} reps per set across all 11 exercises). Finish this stage today; Stage 2 unlocks on a later calendar day.`;
    $("winBoss").textContent="CONFIRM STAGE 1 COMPLETE";
  }else{
    const today=dayKey();
    if(today===c.stage1Date){
      $("bossDesc").textContent=`STAGE 1 SAVED TODAY. Stage 2 is locked until tomorrow or a later day. Running distance: ${c.distance} km.`;
      $("winBoss").textContent="STAGE 2 LOCKED";$("winBoss").disabled=true;
    }else{
      $("bossDesc").textContent=`STAGE 2 OF 2 — Run ${c.distance} km today. Stage 1 was completed on ${c.stage1Date}. After your run, confirm completion to defeat the boss.`;
      $("winBoss").textContent="CONFIRM RUN COMPLETE & DEFEAT BOSS";$("winBoss").disabled=false;
    }
  }
}
$("acceptGate").onclick=()=>{
  if(!data.bossChallenge){const b=pickBoss();data.bossChallenge={boss:b,stage1Done:false,stage1Date:null,distance:runningDistance(),startedAt:dayKey()};}
  data.gateAccepted=true;save();openBossPage();
};
$("laterGate").onclick=()=>{$("gateModal").classList.add("hidden");data.gateAccepted=false;save()};
$("winBoss").onclick=()=>{
  const c=data.bossChallenge;if(!c)return;
  if(!c.stage1Done){
    c.stage1Done=true;c.stage1Date=dayKey();
    data.records[dayKey()]=`Boss Stage 1 complete — ${c.boss[0]}`;
    data.bossHistory.push({boss:c.boss[0],rank:c.boss[1],stage1Date:c.stage1Date,stage2Date:null,distance:c.distance,status:"Stage 1 complete; Stage 2 pending"});
    save();openBossPage();render();alert(`STAGE 1 SAVED\n\n${c.boss[0]}\nStage 1 completed on ${c.stage1Date}.\nStage 2 unlocks tomorrow or later. The boss is not defeated yet.`);return;
  }
  if(dayKey()===c.stage1Date){openBossPage();return;}
  data.bosses++;data.distance+=c.distance;data.xp+=300;const old=rankFor(data.level);if(data.level<60)data.level++;else data.level=61;
  data.gateAccepted=false;data.completed=[];data.records[dayKey()]=`Boss defeated — ${c.boss[0]} (${c.distance} km run)`;
  const hist=data.bossHistory[data.bossHistory.length-1];if(hist){hist.stage2Date=dayKey();hist.status="Boss defeated";}
  data.bossChallenge=null;save();$("bossPage").classList.add("hidden");$("homePage").classList.remove("hidden");$("winBoss").disabled=false;
  $("homeTitle").textContent="BOSS DEFEATED!";$("homeSub").textContent=`Victory! +300 XP. ${data.level<=60?`You are now Level ${data.level} (${rankFor(data.level)}-Rank).`:"Endless Boss Mode unlocked."}`;
  alert(`GATE CLEARED!\n\nBoss defeated: ${hist?.boss||"Boss"}\nStage 1: ${hist?.stage1Date||"saved"}\nStage 2 run: ${c.distance} km on ${dayKey()}\n+300 XP\nBosses defeated: ${data.bosses}\n${old!==rankFor(data.level)&&data.level<=60?"RANK PROMOTION: "+rankFor(data.level)+"-RANK!":""}`);render();
};

render();