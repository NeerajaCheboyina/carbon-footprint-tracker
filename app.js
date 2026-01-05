import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAE5uaiGdKzfRu5XZD7MlgFC8OmR5iu4Q8",
    authDomain: "carbon-footprint-tracker-8f346.firebaseapp.com",
    projectId: "carbon-footprint-tracker-8f346",
    storageBucket: "carbon-footprint-tracker-8f346.firebasestorage.app",
    messagingSenderId: "974402368816",
    appId: "1:974402368816:web:564230b6e97be00a9344f5"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.login = function(){
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then(()=> window.location="dashboard.html")
  .catch(err=>alert(err.message));
}

window.calculate = async function(){
  const travelCO2 = travel.value * km.value;

  const watts =
    (fan.value||0)*75 + (light.value||0)*15 + (laptop.value||0)*60 +
    (ac.value||0)*1500 + (tv.value||0)*100;

  const electricityCO2 = (watts/1000)*0.82;
  const foodCO2 = parseFloat(food.value);
  const total = travelCO2 + electricityCO2 + foodCO2;

  result.innerText = `🌱 Today's Carbon Footprint: ${total.toFixed(2)} kg CO₂`;

  // 🧠 AI Suggestions
  let tip = "";

  if(travelCO2 > 5){
    tip = "🚗 Try using public transport 2 days a week to reduce travel emissions.";
  }
  else if(electricityCO2 > 3){
    tip = "⚡ Reduce AC usage by 1 hour daily to save energy.";
  }
  else if(foodCO2 > 2){
    tip = "🥗 Switching to vegetarian meals twice a week can reduce CO₂ impact.";
  }
  else{
    tip = "🌱 Great job! Your lifestyle is eco-friendly today.";
  }

  document.getElementById("tips").innerText = tip;

  await addDoc(collection(db,"logs"),{
    total,
    createdAt: new Date()
  });

  loadChart();
}


async function loadChart(){
  const snapshot = await getDocs(collection(db,"logs"));
  let labels=[], values=[];

  snapshot.forEach(doc=>{
    let d = doc.data().createdAt.toDate();
    labels.push(d.toLocaleDateString());
    values.push(doc.data().total);
  });

  const ctx=document.getElementById("chart");
  new Chart(ctx,{
    type:"line",
    data:{labels,datasets:[{label:"Daily CO₂",data:values,tension:0.4,borderWidth:3,fill:true}]},
    options:{scales:{y:{beginAtZero:true}}}
  });
}

window.onload = loadChart;
