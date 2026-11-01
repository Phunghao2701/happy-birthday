const TRACKS = [
  { step: 470, notes: [523,659,784,1047,784,659,587,698], bass: [262,392,349,294], wave: "sine" },
  { step: 335, notes: [392,494,587,784,659,587,494,659], bass: [196,247,294,247], wave: "triangle" },
  { step: 250, notes: [523,784,659,988,587,880,659,1046], bass: [262,330,294,392], wave: "triangle" },
  { step: 520, notes: [523,659,784,659,587,698,880,698], bass: [262,330,294,349], wave: "sine" },
  { step: 610, notes: [392,523,587,659,587,523,440,523], bass: [196,262,220,262], wave: "sine" },
  { step: 265, notes: [523,659,784,1047,988,784,880,1047,784,659,587,784], bass: [262,330,392,523], wave: "triangle" }
];
const CUES = {
  ui_audio_on:{tones:[659,1047],step:.085,volume:.62,duration:.2},
  ui_audio_off:{tones:[784,523],step:.075,volume:.5,duration:.16},
  intro_shimmer:{tones:[784,988,1174,1568],step:.105,volume:.42,duration:.36},
  intro_spring:{tones:[330,523,784],step:.12,volume:.58,duration:.28,noise:{low:240,high:2200,duration:.25,volume:.18}},
  ui_primary:{tones:[740,1047],step:.065,volume:.55,duration:.13},
  ui_secondary:{tones:[587,784],step:.055,volume:.32,duration:.1},
  ui_hover:{tones:[1174],volume:.16,duration:.075},
  ui_nav:{tones:[880,1174],step:.06,volume:.38,duration:.1},
  ui_locked:{tones:[330,247],step:.08,volume:.32,duration:.14},
  modal_open:{tones:[523,784],step:.08,volume:.38,duration:.17,noise:{low:420,high:2300,duration:.16,volume:.12}},
  modal_close:{tones:[784,523],step:.075,volume:.3,duration:.14},
  ui_success:{tones:[659,831,1047],step:.09,volume:.52,duration:.2},
  ui_copy:{tones:[880,1318],step:.07,volume:.42,duration:.17},
  transition_sweep:{tones:[392,784,1047],step:.11,volume:.2,duration:.4,noise:{low:260,high:4200,duration:.55,volume:.28}},
  transition_soft:{tones:[523,784],step:.14,volume:.2,duration:.32,noise:{low:500,high:2100,duration:.3,volume:.12}},
  ticket_fly:{tones:[659,784],step:.13,volume:.22,duration:.26,noise:{low:300,high:1800,duration:.44,volume:.22}},
  ticket_land:{tones:[220,330],step:.055,volume:.43,duration:.12},
  ticket_hover:{tones:[1568],volume:.18,duration:.07},
  ticket_press:{tones:[165,220],step:.045,volume:.62,duration:.12},
  ticket_stamp:{tones:[110,147],step:.06,volume:.72,duration:.2},
  ticket_approved:{tones:[523,659,784,1047],step:.085,volume:.55,duration:.22},
  confetti_pop:{tones:[1047,1318,1568],step:.05,volume:.45,duration:.17,noise:{low:1000,high:6000,duration:.2,volume:.2}},
  machine_drop:{tones:[220,392,659],step:.1,volume:.46,duration:.2,noise:{low:180,high:950,duration:.24,volume:.16}},
  lever_clack:{tones:[175,440],step:.06,volume:.58,duration:.12},
  reel_start:{tones:[330,392,523],step:.08,volume:.35,duration:.2,noise:{low:250,high:2400,duration:.25,volume:.2}},
  reel_tick:{tones:[988],volume:.19,duration:.055},
  reel_stop_1:{tones:[523],volume:.42,duration:.13},
  reel_stop_2:{tones:[659],volume:.44,duration:.13},
  reel_stop_3:{tones:[784,1047],step:.07,volume:.48,duration:.16},
  jackpot_stinger:{tones:[523,659,784,1047,1318],step:.105,volume:.53,duration:.3,noise:{low:1100,high:5200,duration:.62,volume:.2}},
  cake_sparkle:{tones:[784,1047,1318],step:.14,volume:.35,duration:.3},
  candle_light:{tones:[880,1318],step:.045,volume:.29,duration:.11},
  candle_puff:{tones:[523],volume:.16,duration:.12,noise:{low:160,high:1100,duration:.22,volume:.2}},
  candle_out:{tones:[220,165],step:.045,volume:.24,duration:.13},
  wish_magic:{tones:[523,659,784,1047],step:.16,volume:.48,duration:.36,noise:{low:700,high:4200,duration:.7,volume:.2}},
  dice_roll:{tones:[392,523,659],step:.07,volume:.38,duration:.11},
  dice_miss:{tones:[330,277,247],step:.09,volume:.33,duration:.2},
  catch_star:{tones:[1047,1318],step:.055,volume:.3,duration:.11},
  catch_bomb:{tones:[196,147],step:.07,volume:.42,duration:.18,noise:{low:100,high:520,duration:.2,volume:.18}},
  letter_fly:{tones:[659,784],step:.13,volume:.18,duration:.25,noise:{low:300,high:1900,duration:.4,volume:.18}},
  letter_seal:{tones:[247,370],step:.065,volume:.45,duration:.14},
  letter_fold:{tones:[440],volume:.16,duration:.16,noise:{low:500,high:1800,duration:.24,volume:.2}},
  letter_slide:{tones:[523,659],step:.13,volume:.18,duration:.24,noise:{low:250,high:1600,duration:.42,volume:.16}},
  letter_reveal:{tones:[784,1047,1318],step:.11,volume:.31,duration:.25},
  finale_riser:{tones:[392,523,659,784,988],step:.12,volume:.38,duration:.26,noise:{low:220,high:3600,duration:.8,volume:.22}},
  finale_impact:{tones:[130,523,659],step:.07,volume:.62,duration:.24},
  finale_bounce:{tones:[330,523,784],step:.1,volume:.42,duration:.2},
  balloon_airy:{tones:[659,784],step:.16,volume:.16,duration:.28,noise:{low:420,high:1700,duration:.45,volume:.12}},
  firework_burst:{tones:[392,784,1318],step:.075,volume:.37,duration:.26,noise:{low:500,high:5200,duration:.48,volume:.34}},
  replay_reverse:{tones:[1047,784,523,392],step:.09,volume:.34,duration:.16,noise:{low:1800,high:300,duration:.38,volume:.14}}
};
const LEGACY = {pop:"ui_primary",win:"ui_success",open:"letter_seal",dice:"dice_roll",miss:"dice_miss",catch:"catch_star",bomb:"catch_bomb",wish:"wish_magic",unlock:"ticket_approved"};
export class BirthdaySoundManager {
  constructor() {
    this.enabled = true;
    try { this.enabled = sessionStorage.getItem("birthday-parade-sound") !== "off"; } catch {}
    this.scene=0; this.ctx=null; this.musicBus=null; this.sfxBus=null; this.track=null;
    this.noiseBuffer=null; this.unlocked=false; this.lastCue=new Map(); this.duckTimer=0; this.suspendTimer=0;
  }
  ensureContext() {
    if(this.ctx?.state==="closed")this.ctx=null;
    if(this.ctx)return this.ctx;
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return null;
    const ctx=new AudioContextClass(),master=ctx.createGain(),compressor=ctx.createDynamicsCompressor();
    this.musicBus=ctx.createGain();this.sfxBus=ctx.createGain();
    master.gain.value=.88;this.musicBus.gain.value=this.enabled?.27:.0001;this.sfxBus.gain.value=this.enabled?.5:.0001;
    compressor.threshold.value=-12;compressor.knee.value=14;compressor.ratio.value=7;compressor.attack.value=.004;compressor.release.value=.18;
    this.musicBus.connect(master);this.sfxBus.connect(master);master.connect(compressor);compressor.connect(ctx.destination);this.ctx=ctx;
    return ctx;
  }
  unlock(scene=this.scene) {
    this.scene=scene;if(!this.enabled)return false;
    const first=!this.unlocked;this.unlocked=true;const ctx=this.ensureContext();
    if(ctx?.state==="suspended")void ctx.resume().catch(()=>{});
    this.startScene(scene);return first;
  }
  setScene(scene){this.scene=scene;this.startScene(scene);}
  setEnabled(enabled) {
    this.enabled=enabled;try{sessionStorage.setItem("birthday-parade-sound",enabled?"on":"off");}catch{}
    if(!this.ctx)return;clearTimeout(this.suspendTimer);const now=this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(now);this.musicBus.gain.setTargetAtTime(enabled?.27:.0001,now,.035);
    this.sfxBus.gain.cancelScheduledValues(now);this.sfxBus.gain.setTargetAtTime(enabled?.5:.0001,now,.025);
    if(enabled&&this.ctx.state==="suspended")void this.ctx.resume().catch(()=>{});
    if(enabled&&this.unlocked)this.startScene(this.scene);
    if(!enabled){this.stopScene();this.suspendTimer=setTimeout(()=>{if(!this.enabled&&this.ctx?.state==="running")void this.ctx.suspend().catch(()=>{});},180);}
  }
  setVisible(visible) {
    if(!this.ctx||!this.unlocked||!this.enabled)return;
    if(!visible)void this.ctx.suspend().catch(()=>{});
    else if(this.ctx.state==="suspended")void this.ctx.resume().then(()=>this.startScene(this.scene)).catch(()=>{});
  }
  startScene(scene) {
    if(!this.enabled||!this.unlocked)return;
    const config=TRACKS[scene],ctx=this.ensureContext();if(!config||!ctx||this.track?.scene===scene)return;
    const now=ctx.currentTime,previous=this.track;
    if(previous){clearInterval(previous.timer);previous.node.gain.cancelScheduledValues(now);previous.node.gain.setTargetAtTime(.0001,now,.19);setTimeout(()=>previous.node.disconnect(),1100);}
    const node=ctx.createGain();node.gain.setValueAtTime(.0001,now);node.gain.linearRampToValueAtTime(.78,now+.82);node.connect(this.musicBus);
    const track={scene,node,timer:0,beat:0,baseGain:.78,config};this.track=track;track.timer=setInterval(()=>this.playBeat(track),config.step);this.playBeat(track);
  }
  playBeat(track) {
    const ctx=this.ctx;if(!this.enabled||document.hidden||!ctx||ctx.state!=="running"||this.track!==track)return;
    const {notes,bass,wave,step}=track.config,beat=track.beat++,frequency=notes[beat%notes.length];
    this.tone(frequency,step/1000*.76,.66,wave,track.node);this.tone(frequency*2,step/1000*.31,.105,"sine",track.node);
    if(beat%2===0)this.tone(bass[(beat/2)%bass.length],step/1000*.9,.24,"triangle",track.node);
    if(track.scene===5&&beat%4===0)this.tone(130,.11,.11,"sine",track.node);
  }
  tone(frequency,duration,volume,wave="sine",destination=this.sfxBus,start=this.ctx.currentTime) {
    const ctx=this.ctx;if(!ctx||!destination)return;const osc=ctx.createOscillator(),env=ctx.createGain();
    osc.type=wave;osc.frequency.setValueAtTime(Math.max(30,frequency),start);env.gain.setValueAtTime(.0001,start);
    env.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+Math.min(.025,duration*.25));
    env.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(env);env.connect(destination);osc.start(start);osc.stop(start+duration+.015);
  }
  noise(settings) {
    const ctx=this.ctx;if(!ctx||!this.sfxBus)return;
    if(!this.noiseBuffer||this.noiseBuffer.sampleRate!==ctx.sampleRate){const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.noiseBuffer=b;}
    const now=ctx.currentTime,src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),env=ctx.createGain();
    src.buffer=this.noiseBuffer;filter.type="bandpass";filter.Q.value=.65;filter.frequency.setValueAtTime(Math.max(80,settings.low),now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(90,settings.high),now+settings.duration);
    env.gain.setValueAtTime(.0001,now);env.gain.exponentialRampToValueAtTime(Math.max(.0002,settings.volume),now+.025);
    env.gain.exponentialRampToValueAtTime(.0001,now+settings.duration);src.connect(filter);filter.connect(env);env.connect(this.sfxBus);
    src.start(now);src.stop(now+settings.duration+.02);
  }
  duck(duration=1050) {
    if(!this.track||!this.ctx||!this.enabled)return;clearTimeout(this.duckTimer);const track=this.track,now=this.ctx.currentTime;
    track.node.gain.cancelScheduledValues(now);track.node.gain.setTargetAtTime(.2,now,.06);
    this.duckTimer=setTimeout(()=>{if(this.track!==track||!this.enabled||!this.ctx)return;const t=this.ctx.currentTime;track.node.gain.cancelScheduledValues(t);track.node.gain.setTargetAtTime(track.baseGain,t,.2);},duration);
  }
  play(name) {
    if(!this.enabled||!this.unlocked||document.hidden)return;
    if(name==="duck"){this.duck();return;}
    if(name==="firework_variants")name=Math.random()<.5?"firework_burst":"confetti_pop";
    name=LEGACY[name]||name;const ctx=this.ensureContext();if(!ctx)return;
    if(ctx.state==="suspended")void ctx.resume().catch(()=>{});
    const limits={ui_hover:300,ticket_hover:300,reel_tick:115,catch_star:105,firework_burst:500,confetti_pop:300},nowMs=performance.now(),last=this.lastCue.get(name)||0;
    if(limits[name]&&nowMs-last<limits[name])return;this.lastCue.set(name,nowMs);
    const cue=CUES[name];if(!cue)return;const now=ctx.currentTime;
    cue.tones.forEach((freq,i)=>this.tone(freq,cue.duration||.16,cue.volume??.45,cue.wave||(name.includes("stamp")||name.includes("clack")?"triangle":"sine"),this.sfxBus,now+i*(cue.step||.07)));
    if(cue.noise)this.noise(cue.noise);
  }
  stopScene() {
    if(!this.track||!this.ctx)return;const track=this.track;this.track=null;clearInterval(track.timer);
    const now=this.ctx.currentTime;track.node.gain.cancelScheduledValues(now);track.node.gain.setTargetAtTime(.0001,now,.08);setTimeout(()=>track.node.disconnect(),500);
  }
  dispose() {
    clearTimeout(this.duckTimer);clearTimeout(this.suspendTimer);this.stopScene();const ctx=this.ctx;
    this.ctx=null;this.musicBus=null;this.sfxBus=null;this.noiseBuffer=null;this.unlocked=false;
    if(ctx&&ctx.state!=="closed")void ctx.close().catch(()=>{});
  }
}
export const soundManager=new BirthdaySoundManager();