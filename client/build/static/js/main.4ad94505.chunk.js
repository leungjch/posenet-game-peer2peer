(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{113:function(e,t,i){e.exports=i(192)},118:function(e,t,i){},146:function(e,t){},158:function(e,t){},160:function(e,t){},167:function(e,t,i){e.exports=i.p+"static/media/logo.5d5d9eef.svg"},168:function(e,t,i){},192:function(e,t,i){"use strict";i.r(t);var a=i(0),r=i.n(a),n=i(8),o=i.n(n),c=(i(118),i(10)),l=i(38),s=i.n(l),h=i(66),d=i.n(h),u=(i(167),i(168),i(240)),g=i(234),f=i(242),m=i(194),y=i(235),p=i(236),v=i(239),b=i(241),x=i(230),w=i(238),j=i(100),O=i(237),E=i(101),M=i(14),k=i(17),S=i(31),C=function e(t,i,a){Object(k.a)(this,e),this.x=t,this.y=i,this.entity=a},I=function(){function e(t,i,a,r){Object(k.a)(this,e),this.x=t,this.y=i,this.w=a,this.h=r}return Object(S.a)(e,[{key:"contains",value:function(e){return e.x>=this.x-this.w&&e.x<=this.x+this.w&&e.y>=this.y-this.h&&e.y<=this.y+this.h}},{key:"intersects",value:function(e){return this.x-this.w<e.x+e.w&&this.x+this.w>e.x-e.w&&this.y-this.h<e.y+e.h&&this.y+this.h>e.y-e.h}}]),e}(),W=function(){function e(t,i,a){Object(k.a)(this,e),this.x=t,this.y=i,this.r=a,this.rSquared=a*a}return Object(S.a)(e,[{key:"contains",value:function(e){return Math.pow(e.x-this.x,2)+Math.pow(e.y-this.y,2)<=this.rSquared}},{key:"intersects",value:function(e){var t=Math.abs(e.x-this.x),i=Math.abs(e.y-this.y),a=this.r,r=e.w,n=e.h,o=Math.pow(t-r,2)+Math.pow(i-n,2);return!(t>a+r||i>a+n)&&(t<=r||i<=n||o<=this.rSquared)}}]),e}(),R=function(){function e(t,i){if(Object(k.a)(this,e),!t)throw TypeError("boundary is null or undefined");if(!(t instanceof I))throw TypeError("boundary should be a Rectangle");if("number"!==typeof i)throw TypeError("capacity should be a number but is a ".concat(typeof i));if(i<1)throw RangeError("capacity must be greater than 0");this.boundary=t,this.capacity=i,this.points=[],this.divided=!1}return Object(S.a)(e,[{key:"subdivide",value:function(){var t=this.boundary.x,i=this.boundary.y,a=this.boundary.w/2,r=this.boundary.h/2,n=new I(t+a,i-r,a,r);this.ne=new e(n,this.capacity);var o=new I(t-a,i-r,a,r);this.nw=new e(o,this.capacity);var c=new I(t+a,i+r,a,r);this.se=new e(c,this.capacity);var l=new I(t-a,i+r,a,r);this.sw=new e(l,this.capacity),this.divided=!0}},{key:"insert",value:function(e){return!!this.boundary.contains(e)&&(this.points.length<this.capacity?(this.points.push(e),!0):(this.divided||this.subdivide(),!!(this.ne.insert(e)||this.nw.insert(e)||this.se.insert(e)||this.sw.insert(e))||void 0))}},{key:"query",value:function(e,t){if(t||(t=[]),!e.intersects(this.boundary))return t;var i,a=Object(M.a)(this.points);try{for(a.s();!(i=a.n()).done;){var r=i.value;e.contains(r)&&t.push(r)}}catch(n){a.e(n)}finally{a.f()}return this.divided&&(this.nw.query(e,t),this.ne.query(e,t),this.sw.query(e,t),this.se.query(e,t)),t}}]),e}(),P=function e(t,i){Object(k.a)(this,e),this.hp=100,this.damageBase=1.05,this.damageLeft=1.05,this.damageRight=1.05,this.reactTime=10,this.react=0;var a=Math.min(t,i),r=t/2,n=i/2,o=a/4;this.left=new W(r,n,o),this.leftPrev=new W(r,n,o);var c=t/2,l=i/2,s=a/4;this.right=new W(c,l,s),this.rightPrev=new W(c,l,s);var h=t/2,d=i/2,u=a/3;this.head=new W(h,d,u)};function B(e){return e[Math.floor(Math.random()*e.length)]}var H,D,T=function(){function e(t,i,a){Object(k.a)(this,e),this.types=["roamer","seeker","robot"],this.type=B(this.types),"roamer"===this.type&&(this.icon=t.alien,this.t=Math.random(),this.t=Math.random(),this.orbitDistance=Math.random()*i/3),"seeker"===this.type&&(this.icon=t.evil),"robot"===this.type&&(this.icon=t.robot,this.direction=B(["rightDiag","leftDiag"]));var r=Math.min(i,a),n=Math.floor(Math.random()*a),o=Math.floor(Math.random()*i),c=Math.ceil(Math.random()*r/10)+16;this.speed=4*Math.random(),this.circle=new W(o,n,c)}return Object(S.a)(e,[{key:"move",value:function(e){var t=e.head.x,i=e.head.y,a=(Math.sqrt(Math.pow(t-this.circle.x,2)+Math.pow(i-this.circle.y,2)),Math.atan(Math.abs(i-this.circle.y)/Math.abs(t-this.circle.x)));"roamer"===this.type?(this.circle.x=this.orbitDistance*Math.cos(this.t)+t,this.circle.y=this.orbitDistance*Math.sin(this.t)+i,this.orbitDistance+=5*Math.sin(5*this.t),this.t+=.01,this.d+=.001):"seeker"===this.type?(this.circle.x>t?this.circle.x-=Math.cos(a)*this.speed:this.circle.x+=Math.cos(a)*this.speed,this.circle.y>i?this.circle.y-=Math.sin(a)*this.speed:this.circle.y+=Math.sin(a)*this.speed):"robot"===this.type&&("left"===this.direction?this.circle.x-=this.speed:"right"===this.direction?this.circle.x+=this.speed:"up"===this.direction?this.circle.y-=this.speed:"down"===this.direction?this.circle.y+=this.speed:"leftDiag"===this.direction?(this.circle.x+=this.speed,this.circle.y-=this.speed):"rightDiag"===this.direction&&(this.circle.x-=this.speed,this.circle.y+=this.speed))}}]),e}(),q=(i(65),i(169)),z=function(e){var t,i,a,r,n,o,c,l,s,h=5,d=60,u=!0,g=!1,f=!1,m=!0,y=!1,p=!0;var v=[];function b(e){e.length>0&&(i=e[0].pose,e[0].skeleton)}function x(){console.log("poseNet ready")}function w(){h-=1}function j(){d-=1}function O(){v=[],clearInterval(s)}e.setup=function(){document.getElementById("user").getBoundingClientRect();var i=(t=e.createCapture(e.VIDEO)).width/t.height;t.hide(),"multi"===e.playerMode?(a=e.windowHeight*i*.8,r=.8*e.windowHeight):(a=e.windowHeight*i*.8,r=.8*e.windowHeight,a=window.innerHeight*i*.5,r=.8*window.innerHeight),e.createCanvas(a,r),n=new P(a,r);var c=c={imageScaleFactor:.1,outputStride:16,flipHorizontal:!1,minConfidence:.5,maxPoseDetections:5,scoreThreshold:.5,nmsRadius:20,detectionType:"single",multiplier:.75};q.poseNet(t,x,c).on("pose",b),a/t.width,r/t.height,o={grin:e.loadImage("./icons/grinning_msft.png"),fist:e.loadImage("./icons/fist_msft.png"),evil:e.loadImage("./icons/evil_msft.png"),alien:e.loadImage("./icons/alien_msft.png"),pain:e.loadImage("./icons/pain_msft.png"),robot:e.loadImage("./icons/robot_msft.png")},v=[];for(var l=0;l<10;l++)v.push(new T(o,a,r))},e.draw=function(){e.push();var b=e.color(255,255,255);b.setAlpha(e.lerp(64,0,h/5)),e.translate(a,0),e.scale(-1,1),e.image(t,0,0,a,r),e.fill(b),e.rect(0,0,a,r),e.pop(),g&&!f?(e.textSize(a/3),e.text(d,a/3,r/2),function(){if(i){var c=i.rightEye,l=i.leftEye;e.dist(c.x,c.y,l.x,l.y);n.head.x=e.lerp(n.head.x,a-a*i.nose.x/t.width,.5),n.head.y=e.lerp(n.head.y,r*i.nose.y/t.height,.5),n.left.x=e.lerp(n.left.x,a-a*i.leftWrist.x/t.width,1),n.left.y=e.lerp(n.left.y,r*i.leftWrist.y/t.height,1),n.right.x=e.lerp(n.right.x,a-a*i.rightWrist.x/t.width,1),n.right.y=e.lerp(n.right.y,r*i.rightWrist.y/t.height,1);var h=Math.sqrt(Math.pow(n.left.x-n.leftPrev.x,2)+Math.pow(n.left.y-n.leftPrev.y,2)),d=Math.sqrt(Math.pow(n.right.x-n.rightPrev.x,2)+Math.pow(n.right.y-n.rightPrev.y,2)),u=Math.sqrt(Math.pow(a/2,2)+Math.pow(r/2,2));e.strokeWeight(h+30),e.stroke(255,255,255),e.line(n.leftPrev.x,n.leftPrev.y,n.left.x,n.left.y),e.strokeWeight(d),e.line(n.rightPrev.x,n.rightPrev.y,n.right.x,n.right.y),e.strokeWeight(Math.floor(h/2)+30),e.stroke(197,255,253),e.line(n.leftPrev.x,n.leftPrev.y,n.left.x,n.left.y),e.strokeWeight(Math.floor(d/2)+30),e.line(n.rightPrev.x,n.rightPrev.y,n.right.x,n.right.y),e.strokeWeight(1),n.damageLeft=n.damageBase+h/u*2,n.damageRight=n.damageBase+d/u*2,n.rightPrev.x=n.right.x,n.rightPrev.y=n.right.y,n.leftPrev.x=n.left.x,n.leftPrev.y=n.left.y}e.fill(0,255,0),e.fill(255,255,0),e.image(o.grin,n.head.x-n.head.r/2,n.head.y-n.head.r/2,n.head.r,n.head.r),e.fill(0,0,0),e.textSize(a/6),e.text(Math.floor(n.hp),n.head.x-n.head.r/2,n.head.y-n.head.r/2),e.fill(0,0,255),e.image(o.fist,n.left.x-n.left.r/2,n.left.y-n.left.r/2,n.left.r,n.left.r),e.image(o.fist,n.right.x-n.right.r/2,n.right.y-n.right.r/2,n.right.r,n.right.r),e.fill(255,0,0);var g,f=Object(M.a)(v);try{for(f.s();!(g=f.n()).done;){var m=g.value;m.move(n),e.image(m.icon,m.circle.x-m.circle.r/2,m.circle.y-m.circle.r/2,m.circle.r,m.circle.r)}}catch(G){f.e(G)}finally{f.f()}var y,b=new I(a/2,r/2,a,r),x=new R(b,2),w=Object(M.a)(v);try{for(w.s();!(y=w.n()).done;){var j=y.value,O=new C(j.circle.x,j.circle.y,j);x.insert(O),j.circle.x>a?j.circle.x=0:j.circle.x<0&&(j.circle.x=a),j.circle.y>r?j.circle.y=0:j.circle.y<0&&(j.circle.y=r)}}catch(G){w.e(G)}finally{w.f()}var k,S=new W(n.head.x,n.head.y,.5*n.head.r),P=x.query(S),B=Object(M.a)(P);try{for(B.s();!(k=B.n()).done;){var H=k.value;n.head.contains(H)&&(e.fill(255,0,0),e.textSize(2*H.entity.circle.r),e.text("-"+Math.floor(n.hp),n.head.x-n.head.r/2,n.head.y-n.head.r/2),n.hp-=4*H.entity.circle.r,e.image(o.pain,n.head.x-n.head.r/2,n.head.y-n.head.r/2,n.head.r,n.head.r),v.splice(v.indexOf(H.entity),1))}}catch(G){B.e(G)}finally{B.f()}var D,q=new W(n.left.x,n.left.y,.5*n.left.r),z=new W(n.right.x,n.right.y,.5*n.right.r),_=x.query(q),L=x.query(z),A=Object(M.a)(_);try{for(A.s();!(D=A.n()).done;){var Y=D.value;n.left.contains(Y)&&(e.fill(0,255,0),e.textSize(3*Y.entity.circle.r),e.text("+"+Math.floor(Y.entity.circle.r),n.left.x-n.left.r/2+Math.random()*n.left.r,n.left.y-n.left.r/2+Math.random()*n.left.r),Y.entity.circle.r/=n.damageLeft,n.hp+=Y.entity.circle.r,Y.entity.circle.r<50&&v.splice(v.indexOf(Y.entity),1))}}catch(G){A.e(G)}finally{A.f()}var N,F=Object(M.a)(L);try{for(F.s();!(N=F.n()).done;){var J=N.value;n.right.contains(J)&&(e.fill(0,255,0),e.textSize(3*J.entity.circle.r),e.text("+"+Math.floor(J.entity.circle.r),n.right.x-n.right.r/2+Math.random()*n.right.r,n.right.y-n.right.r/2+Math.random()*n.right.r),J.entity.circle.r/=n.damageRight,n.hp+=J.entity.circle.r,J.entity.circle.r<10&&v.splice(v.indexOf(J.entity),1))}}catch(G){F.e(G)}finally{F.f()}if(Math.random()>.2&&v.length<300)for(var U=Math.min(60/e.frameRate(),20),V=0;V<U;V++)v.push(new T(o,a,r));p&&e.isMulti&&(s=setInterval((function(){var t=v.map((function(e){e.icon;return Object(E.a)(e,["icon"])}));e.socket.current.emit("sendCanvas",{playerHead:n.head,playerLeft:n.left,playerRight:n.right,playerHP:n.hp,enemies:t,to:e.to,from:e.from,originalWidth:a,originalHeight:r})}),30),p=!1)}(),d<=0&&(g=!0,f=!0)):g?f&&(e.textAlign(e.CENTER),e.fill(0),e.stroke(255),e.strokeWeight(5),e.textSize(a/16),e.fill(0),e.noStroke(),clearInterval(l),d=60,h=5,y=!1,!1,m&&(e.isMulti?e.socket.current.emit("finalScore",{finalScore:n.hp,to:e.to,from:e.from,emitPeer:!0}):e.socket.current.emit("finalScore",{finalScore:n.hp,from:e.from,emitPeer:!1}),O(),m=!1,e.remove()),e.mouseIsPressed&&(O(),c=setInterval(w,1e3),y=!0,g=!1,f=!1)):h<=0?(g=!0,clearInterval(c),l=setInterval(j,1e3),!0):u&&!1===y?(c=setInterval(w,1e3),y=!0,u=!1):y?(e.textSize(a/4),e.text(h,a/2,r/2)):(e.textAlign(e.CENTER),e.fill(0),e.stroke(255),e.strokeWeight(5),e.textSize(a/4),e.fill(255),e.noStroke(),e.text("Click to start!",a/2,r/2))}},_=(i(65),function(e){var t,i,a,r,n,o,c=!0;e.setup=function(){i=document.getElementById("partner"),a=i.getBoundingClientRect(),n=i.clientWidth,o=i.clientHeight,console.log("width and height are",n,o),t=e.createCanvas(n,o),console.log("peer dims is",a),t.position(a.left,a.top),t.style("z-index","1"),r={grin:e.loadImage("./icons/grinning_msft.png"),fist:e.loadImage("./icons/fist_msft.png"),evil:e.loadImage("./icons/evil_msft.png"),alien:e.loadImage("./icons/alien_msft.png"),pain:e.loadImage("./icons/pain_msft.png"),robot:e.loadImage("./icons/robot_msft.png"),cat:e.loadImage("./icons/cat_msft.png")}},e.draw=function(){c&&(e.socket.current.on("receiveCanvas",(function(c){i=document.getElementById("partner"),a=i.getBoundingClientRect(),t.position(a.left,a.top),t.style("z-index","1"),console.log("width is",c.originalWidth,n),e.clear(),e.background("rgba(255,255,255, 0.25)"),e.fill(255,255,0);var l=c.playerHead.x/c.originalWidth*n,s=c.playerHead.y/c.originalHeight*o,h=c.playerHead.r/c.originalWidth*n,d=c.playerLeft.x/c.originalWidth*n,u=c.playerLeft.y/c.originalHeight*o,g=c.playerLeft.r/c.originalWidth*n,f=c.playerRight.x/c.originalWidth*n,m=c.playerRight.y/c.originalHeight*o,y=c.playerRight.r/c.originalWidth*n;e.image(r.cat,l-h/2,s-h/2,h,h),e.image(r.fist,d-g/2,u-g/2,g,g),e.image(r.fist,f-y/2,m-y/2,y,y);var p,v=Object(M.a)(c.enemies);try{for(v.s();!(p=v.n()).done;){var b,x=p.value;"roamer"===x.type?b=r.alien:"seeker"===x.type?b=r.evil:"robot"===x.type&&(b=r.robot);var w=x.circle.x/c.originalWidth*n,j=x.circle.y/c.originalHeight*o,O=x.circle.r/c.originalWidth*n;e.image(b,w-O/2,j-O/2,O,O),e.fill(0,0,0),e.textSize(100),e.text(Math.floor(c.playerHP),l-h/2,s-h/2)}}catch(E){v.e(E)}finally{v.f()}})),e.socket.current.on("receivePeerScore",(function(t){e.remove()})),e.resizeCanvas(i.clientWidth,i.clientHeight),c=!1)}}),L=i(232),A=i(65),Y=i(180),N=(Object(j.a)({palette:{background:{default:"#e4f0e2"}}}),Object(j.a)({palette:{primary:{main:"#2f4e86"},secondary:{main:"#9c2e2e"},background:{default:"#121212"},text:{primary:"#ffffff"}}})),F=Object(x.a)((function(e){return{root:{flexGrow:1},buttons:{backgroundColor:"#2c2c47"},webcamView:{border:5,borderRadius:10,backgroundColor:"white"},container:{display:"grid",gridTemplateColumns:"repeat(12, 1fr)",gridGap:e.spacing(1)},paper:{padding:e.spacing(1),textAlign:"center",color:"white",backgroundColor:"#1f1f1f",borderRadius:"3px",whiteSpace:"nowrap",marginBottom:e.spacing(1)},divider:{margin:e.spacing(2,0)}}}));function J(){var e,t,i,n,o,l,h,x=F(),j=Object(a.useState)(""),E=Object(c.a)(j,2),M=E[0],k=E[1],S=Object(a.useState)(!1),C=Object(c.a)(S,2),I=C[0],W=C[1],R=Object(a.useState)(!1),P=Object(c.a)(R,2),B=P[0],T=P[1],q=Object(a.useState)("waiting"),J=Object(c.a)(q,2),U=J[0],V=J[1],G=Object(a.useState)(0),$=Object(c.a)(G,2),K=($[0],$[1],Object(a.useState)("waiting")),Q=Object(c.a)(K,2),X=Q[0],Z=Q[1],ee=Object(a.useState)(!1),te=Object(c.a)(ee,2),ie=te[0],ae=te[1],re=Object(a.useState)(""),ne=Object(c.a)(re,2),oe=ne[0],ce=ne[1],le=Object(a.useState)(!1),se=Object(c.a)(le,2),he=se[0],de=se[1],ue=Object(a.useState)(""),ge=Object(c.a)(ue,2),fe=ge[0],me=ge[1],ye=Object(a.useState)(),pe=Object(c.a)(ye,2),ve=pe[0],be=pe[1],xe=Object(a.useState)(!1),we=Object(c.a)(xe,2),je=we[0],Oe=we[1],Ee=Object(a.useState)(!1),Me=Object(c.a)(Ee,2),ke=Me[0],Se=Me[1],Ce=Object(a.useState)(!1),Ie=Object(c.a)(Ce,2),We=Ie[0],Re=Ie[1],Pe=Object(a.useState)(!1),Be=Object(c.a)(Pe,2),He=Be[0],De=Be[1],Te=Object(a.useState)(!1),qe=Object(c.a)(Te,2),ze=qe[0],_e=qe[1],Le=Object(a.useState)(""),Ae=Object(c.a)(Le,2),Ye=Ae[0],Ne=Ae[1],Fe=Object(a.useState)(),Je=Object(c.a)(Fe,2),Ue=Je[0],Ve=Je[1],Ge=Object(a.useState)(!1),$e=Object(c.a)(Ge,2),Ke=$e[0],Qe=$e[1],Xe=Object(a.useState)(!1),Ze=Object(c.a)(Xe,2),et=Ze[0],tt=Ze[1],it=Object(a.useState)(!1),at=Object(c.a)(it,2),rt=at[0],nt=at[1],ot=Object(a.useState)(!1),ct=Object(c.a)(ot,2),lt=(ct[0],ct[1],Object(a.useRef)()),st=Object(a.useRef)(),ht=Object(a.useRef)();if(Object(a.useEffect)((function(){I||(lt.current=s.a.connect("/"),navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then((function(e){be(e),st.current&&(st.current.srcObject=e)})),W(!0)),lt.current.on("hey",(function(e){ze||(De(!0),Ne(e.from),Ve(e.signal),console.log("User ".concat(e.from," is joining your room")))})),lt.current.on("yourID",(function(e){""===M&&(k(e),console.log("myID is",e))})),lt.current.on("kick",(function(e){ae(!0),console.log("Someone disconnected")})),he&&(console.log("invite code is",oe),lt.current.emit("createRoom",{roomID:oe}),de(!1)),lt.current.emit("sendReady",{isReady:Ke,to:Ye,from:M}),console.log("sending ready ",Ke,"to ",Ye),lt.current.on("receiveReady",(function(e){console.log("received ready on client"),tt(e.isReady)})),lt.current.on("receiveYourScore",(function(e){console.log("received my score ",e.finalScore),V(e.finalScore),H=null,document.getElementById("defaultCanvas0")&&document.getElementById("defaultCanvas0").remove(),I||(navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then((function(e){be(e),st.current&&(st.current.srcObject=e)})),W(!0)),nt(!0),Qe(!1),tt(!1),Re(!1),Oe(!1),Se(!1)})),lt.current.on("receivePeerScore",(function(e){Z(e.finalScore),D=null,document.getElementById("defaultCanvas1")&&document.getElementById("defaultCanvas1").remove(),console.log("received peer score ",e.finalScore)}))}),[oe,Ke,et]),e=He&&!ze?r.a.createElement(L.a,{item:!0,xs:6},r.a.createElement(m.a,{variant:"contained",color:"secondary",style:{marginTop:"2%"},onClick:function(){console.log("accepted join"),_e(!0),De(!1);var e=new d.a({initiator:!1,trickle:!1,stream:ve});e.on("signal",(function(e){lt.current.emit("acceptIncoming",{signal:e,roomID:oe,to:Ye,from:M}),_e(!0),De(!1)})),e.on("stream",(function(e){ht.current.srcObject=e})),T(!0),e.signal(Ue)}},"Accept Join Request")):r.a.createElement(L.a,{item:!0,xs:6}),ze&&(t=r.a.createElement(f.a,{in:!We,timeout:1500},r.a.createElement(u.a,{width:"50%",m:"auto",justify:"center",justifyContent:"center",style:{textAlign:"center"}},r.a.createElement(g.a,{variant:"contained",size:"large",fullWidth:!0,color:"primary","aria-label":"outlined primary button group"},r.a.createElement(m.a,{fullWidth:!0,color:Ke?"primary":"secondary",onClick:function(){Qe(!Ke)}},Ke?"Click to Unready":"Click to Ready"," "),r.a.createElement(m.a,{fullWidth:!0,color:et?"primary":"secondary"},et?"Friend Ready":"Friend Not Ready"," ")),r.a.createElement(f.a,{in:rt},r.a.createElement(y.a,{width:"50%",class:x.paper,style:{borderRadius:"10px",marginTop:"2%"}},r.a.createElement(p.a,{variant:"h2"}," ","waiting"!==U&&"waiting"!==X&&U>X?"You Won! \ud83c\udf89":"waiting"!==U&&"waiting"!==X&&U<X?"You Lost! \ud83d\ude22":"Waiting \ud83d\udd52"," "),r.a.createElement(p.a,{variant:"h4"}," Your score: ","waiting"===U?"Waiting":Math.ceil(U)," "),r.a.createElement(p.a,{variant:"h4"}," Friend's score: ","waiting"===X?"Waiting":Math.ceil(X)," ")))))),Ke&&et&&!ke){if(!document.getElementById("defaultCanvas0")){(H=new A(z)).isMulti=!0,H.to=Ye,H.from=M,H.socket=lt,H.io=s.a;var dt=document.getElementById("defaultCanvas0");dt.style.display="none",st.current.srcObject=dt.captureStream(60),(D=new A(_,"partnerVideoContainer")).isMulti=!0,D.to=Ye,D.from=M,D.socket=lt}console.log("making canvas"),Se(!0),Re(!0)}return ve&&(i=r.a.createElement(u.a,{display:"flex",flexDirection:"column",m:"auto",alignItems:"center",justifyContent:"center"},r.a.createElement(y.a,{class:x.paper,style:{padding:5,paddingBottom:2,paddingTop:2,display:"inline-block",marginLeft:"0%",marginBottom:"1px",marginTop:"2%"}}," ",r.a.createElement(p.a,{variant:"h6"}," You ")," "),r.a.createElement("video",{playsInline:!0,id:"user",style:{marginBottom:"2%",textAlign:"center",borderStyle:"solid",borderRadius:"10px",borderColor:"white",borderWidth:"2px",display:"inline-block"},muted:!0,ref:st,autoPlay:!0}))),ze&&(n=r.a.createElement(L.a,{item:!0,xs:We?4:6},r.a.createElement("div",{id:"partnerVideoContainer"},r.a.createElement(u.a,{display:"flex",flexDirection:"column",m:"auto",alignItems:"center",justifyContent:"center"},r.a.createElement(y.a,{class:x.paper,style:{padding:5,paddingBottom:2,paddingTop:2,display:"inline-block",marginBottom:"1px",marginTop:"2%"}}," ",r.a.createElement(p.a,{variant:"h6"}," Friend ")," "),r.a.createElement("video",{playsInline:!0,id:"partner",style:{transform:"rotateY(180deg)",marginBottom:"2%",textAlign:"center",marginLeft:"auto",marginRight:"auto",borderStyle:"solid",borderRadius:"10px",borderColor:"white",borderWidth:"2px",display:"inline-block"},ref:ht,autoPlay:!0}))))),ie&&(o=r.a.createElement(b.a,{severity:"error"},"You've been removed for inactivity. Please reload the page to play again.")),""!==oe&&(l=r.a.createElement(m.a,{variant:"contained",color:"secondary",fullWidth:!0,style:{textTransform:"none"},onClick:function(){navigator.clipboard.writeText(oe)}},"Invite Code: ",oe," (Click to Copy)")),h="waiting"!==U?r.a.createElement(y.a,{class:x.paper,style:{marginBottom:"2%"}},r.a.createElement(p.a,{variant:"h4"},"Last Score: ",Math.ceil(U)," ")):null,r.a.createElement(O.a,{theme:N},r.a.createElement(w.a,null),r.a.createElement("div",{className:x.root},o,r.a.createElement(f.a,{in:I},r.a.createElement(L.a,{container:!0,spacing:0,padding:0,justify:"center",direction:"row",alignItems:"center",style:{minHeight:"60vh",maxWidth:"100%"}},r.a.createElement(L.a,{item:!0,xs:We?8:6},i),n)),t,r.a.createElement(f.a,{in:!B&&!We&&I},r.a.createElement(u.a,{justifyContent:"center",justify:"center",width:"50%",m:"auto"},h,r.a.createElement(L.a,{container:!0,spacing:3,style:{backgroundColor:"#00224b",borderRadius:10,borderColor:"#111111",borderStyle:"solid",borderWidth:"2px"}},r.a.createElement(L.a,{item:!0,xs:12},r.a.createElement(m.a,{onClick:function(){if(je)console.log("already playing game");else{(H=new A(z)).isMulti=!1,H.socket=lt,H.from=M;var e=document.getElementById("defaultCanvas0");e.style.display="none",st.current.srcObject=e.captureStream(60),console.log("play game"),Oe(!0),Re(!0)}},variant:"contained",color:"primary",size:"large",fullWidth:!0},"Play Solo")),r.a.createElement(L.a,{item:!0,xs:6},r.a.createElement(v.a,{id:"filled-basic",color:"primary",style:{multilineColor:"white",backgroundColor:"#2c2c47",borderRadius:"3px",color:"white"},onChange:function(e){return me(e.target.value)},fullWidth:!0,InputLabelProps:{style:{color:"#eeeeee"}},label:"Enter Invite Code",variant:"filled"})),r.a.createElement(L.a,{item:!0,xs:6},r.a.createElement(m.a,{onClick:function(){""===oe&&(ce(Y.generate()),de(!0))},style:{height:"100%"},variant:"contained",color:"primary",fullWidth:!0},"Generate Invite Code")),r.a.createElement(L.a,{item:!0,xs:6},r.a.createElement(m.a,{variant:"contained",onClick:function(){if(!ze){var e=new d.a({initiator:!0,trickle:!1,stream:ve});e.on("signal",(function(e){lt.current.emit("connectRoom",{roomToJoin:fe,signalData:e,from:M})})),e.on("stream",(function(e){ht.current&&(ht.current.srcObject=e,T(!0))})),lt.current.on("acceptIncoming",(function(t){_e(!0),De(!1),Ne(t.from),e.signal(t.signal),console.log("accepted user's request")}))}},color:"primary",fullWidth:!0},"Join With Invite Code"),e),r.a.createElement(L.a,{item:!0,xs:6},l))))))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[113,1,2]]]);
//# sourceMappingURL=main.4ad94505.chunk.js.map