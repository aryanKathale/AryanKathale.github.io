/* ── Particle Background ──────────────────────────── */
(function(){
  const canvas=document.getElementById('particles');
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  const COUNT=60,MAX_DIST=120;

  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);resize();

  function Particle(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.vx=(Math.random()-.5)*.25;
    this.vy=(Math.random()-.5)*.25;
    this.r=Math.random()*1.6+.6;
  }
  for(let i=0;i<COUNT;i++) particles.push(new Particle());

  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(123,142,168,.45)';ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j];
        const dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<MAX_DIST){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(123,142,168,${.12*(1-d/MAX_DIST)})`;
          ctx.lineWidth=.6;ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Scroll Reveal ────────────────────────────────── */
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
    }
  });
},{threshold:.15});

document.querySelectorAll('.project-card, .about-grid, .contact-inner').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(24px)';
  el.style.transition='opacity .6s ease, transform .6s ease';
  observer.observe(el);
});
