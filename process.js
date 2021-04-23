const data = [
  {
    name: "A",
    arrive: 0,
    service: 5,
  },
  {
    name: "B",
    arrive: 1,
    service: 7,
  },
  {
    name: "C",
    arrive: 2,
    service: 2,
  },
  {
    name: "D",
    arrive: 5,
    service: 1,
  },
  {
    name: "E",
    arrive: 9,
    service: 5,
  },
  {
    name: "F",
    arrive: 10,
    service: 2,
  },
  {
    name: "G",
    arrive: 18,
    service: 2
  }
];
const getSortArrival = () => {
  return data.sort((a, b) => a.arrive - b.arrive);
};
const getSumTime = () => {
  let sum = 0;
  for (let i of data) {
    sum += i.service;
  }
  return sum;
};
const getReport = (data, ans) => {
  let sumTR = 0;
  let sumRS = 0;
  let report = {};
  for (let i of data) {
    let last = ans.lastIndexOf(i.name) + 1;
    let tr = last - i.arrive;
    let rs = tr / i.service;
    rs = Math.round(rs * 100) / 100;
    sumTR += tr;
    sumRS += rs;
    report[i.name] = { TR: tr, "TR/TS": rs };
  }
  let meanTR = sumTR / data.length;
  let meanRS = sumRS / data.length;
  meanTR = Math.round(meanTR * 100) / 100;
  meanRS = Math.round(meanRS * 100) / 100;
  report["Mean"] = { TR: meanTR, "TR/TS": meanRS };
  console.table(report);
};
const fcfs = () => {
  let ans = "";
  let temp = getSortArrival();
  for (let i of temp) {
    for (let j = 0; j < i.service; j++) {
      ans += i.name;
    }
  }
  console.log("First Come First Serve: \t" + ans);
  getReport(data, ans);
};
const roundRobin = (q) => {
  let ans = "";
  let come = [];
  let execute = {};
  let temp = getSortArrival();
  let exe = 0;
  let queuePrint = [];
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        come.push(temp[j].name);
        if(come.length >= 2 && i > 0 && come.indexOf(ans[ans.length -1]) != -1){
          let temp = come[come.length - 2];
          come[come.length - 2] = come[come.length - 1]
          come[come.length - 1] = temp
        }
      }
    }
    if (come.length > 0) {
      if (!Object.keys(execute).includes(come[0])) {
        execute[come[0]] = 1;
        ans += come[0];
        queuePrint.push(Array.from(come));
        exe += 1;
        if (exe == q) {
          if(!(execute[come[0]] == temp.find(e => e.name == come[0]).service)){
          come.push(come[0]);
          }
          exe = 0;
          come.shift();
        }
      } else {
        if (execute[come[0]] < temp.find((e) => e.name == come[0]).service) {
          execute[come[0]] += 1;
          ans += come[0];
          queuePrint.push(Array.from(come));
          exe += 1;
          if (exe == q) {
            if(!(execute[come[0]] == temp.find(e => e.name == come[0]).service)){
              come.push(come[0]);
            }
            exe = 0;
            come.shift();
          }
        } 
      }
    }
  }
  queuePrint.push(Array.from(come));
  console.log(`Round Robin (q = ${q}): \t\t` + ans);
  getReport(data, ans);
  queuePrint.map((el,index)=>{
    console.log(index,":",el);
  })
};

const spn = () => {
  let ans = "";
  let exe = 0;
  let temp = getSortArrival();
  let past = [];
  let cur = "";
  for (let i = 0; i < getSumTime(); i++) {
    let exeList = [];
    for (let j = 0; j < temp.length; j++) {
      if (!past.includes(temp[j].name) && temp[j].arrive <= i) {
        exeList.push(temp[j]);
      }
    }
    if (exe == 0) {
      curE = exeList.sort((a, b) => a.service - b.service);
      cur = curE[0].name;
      exe = curE[0].service;
    }
    ans += cur;
    exe -= 1;
    if (exe == 0) {
      past.push(cur);
    }
  }
  console.log("Shortest Process Next: \t\t" + ans);
  getReport(data, ans);
};

const srt = () => {
  let ans = "";
  let sort = getSortArrival();
  let temp = [];
  let queuePrint = [];
  for (let i of sort) {
    temp.push({
      name: i.name,
      service: i.service,
      arrive: i.arrive,
    });
  }
  for (let i = 0; i < getSumTime(); i++) {
    let exeList = [];
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].service > 0 && temp[j].arrive <= i) {
        exeList.push(Object.assign({},temp[j]));
      }
    }
    curE = exeList.sort((a, b) => a.service - b.service);
    ans += curE[0].name;
    queuePrint.push(Array.from(curE));
    let ind = temp.findIndex((e) => e.name == curE[0].name);
    temp[ind].service -= 1;
  }
  console.log("Shortest Remained Time: \t" + ans);
  getReport(data, ans);
  queuePrint.map((el,index)=>{
    console.log(index,":",el);
  })
};

const hrrn = () => {
  let ans = "";
  let exe = 0;
  let temp = getSortArrival();
  let past = [];
  let cur = "";
  let queuePrint = [];
  for (let i = 0; i < getSumTime(); i++) {
    let exeList = [];
    for (let j = 0; j < temp.length; j++) {
      if (!past.includes(temp[j].name) && temp[j].arrive <= i) {
        exeList.push(temp[j]);
      }
    }
    if (exe == 0) {
      let maxInd = 0;
      let temp =[];
      for (let j = 0; j < exeList.length; j++) {
        let ratio = (i - exeList[j].arrive) / exeList[j].service + 1;
        let maxRatio = (i - exeList[maxInd].arrive) / exeList[maxInd].service + 1;
        if (ratio > maxRatio) {
          maxInd = j;
        }
        temp.push(Object.assign({},{name:exeList[j].name,ratio}))
      }
      queuePrint.push(Object.assign({},{time:i,data:Array.from(temp)}));
      cur = exeList[maxInd].name;
      exe = exeList[maxInd].service;
    }
    ans += cur;
    exe -= 1;
    if (exe == 0) {
      past.push(cur);
    }
  }
  console.log("High Response Ratio Next: \t" + ans);
  getReport(data, ans);
  queuePrint.map((el)=>{
    console.log(el.time,':',el.data)
  })
};
const countQ = (q) => {
  let c = 0;
  q.map(e=>{
    e.map(s=>{
      c+=1;
    })
  })
  return c;
}
const feedbackN = (q) => {
  let quece = [[]];
  let queuePrint = [];
  let temp = getSortArrival();
  let exec = {};
  let ans = "";
  let cur = 0;
  let e;
  let level = 0;
  let tempQ = []
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        quece[0].push(temp[j].name);
      }
    }
    cur += 1;
    for (let k = 0; k < quece.length; k++) {
      if (quece[k].length > 0) {
        if(!e || cur == 1){
          if(countQ(quece) > 1 && cur == 1 && quece[k][0] == e){
            continue;
          }
          e = quece[k][0];
          level = k;
        }
        break;
      }
    }
    ans += e;
    tempQ =[];
    quece.map(e=>{
      tempQ.push(Array.from(e));
    })
    queuePrint.push(Array.from(tempQ));
    if (!Object.keys(exec).includes(e)) {
      exec[e] = 0;
    }
    exec[e] += 1;
    if (cur == q && exec[e] < temp.find((el) => el.name == e).service) {
      if (level >= quece.length - 1) {
        quece.push([e]);
      } else {
        quece[level + 1].push(e);
      }
    }
    if (cur == q || exec[e] == temp.find((el) => el.name == e).service) {
      cur = 0;
      quece[level].shift();
    } 
  }
  tempQ =[];
  quece.map(e=>{
    tempQ.push(Array.from(e));
  })
  queuePrint.push(Array.from(tempQ));
  console.log(`Feedback (q=${q}): \t\t\t` + ans);
  getReport(data, ans);
  queuePrint.map((el,index)=>{
    console.log(index,":",el);
  })
};
const feedback2i = () => {
  let quece = [[]];
  let queuePrint = [];
  let temp = getSortArrival();
  let q = {};
  for (let i of temp) {
    q[i.name] = 1;
  }
  let exec = {};
  let ans = "";
  let cur = 0;
  let e;
  let level = 0;
  let tempQ = [];
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        quece[0].push(temp[j].name);
      }
    }
    cur += 1;
    for (let k = 0; k < quece.length; k++) {
      if (quece[k].length > 0) {
        if(!e || cur == 1){
          if(countQ(quece) > 1 && cur == 1 && quece[k][0] == e){
            continue;
          }
          e = quece[k][0];
          level = k;
        }
        break;
      }
    }
    ans += e;
    tempQ =[];
    quece.map(e=>{
      tempQ.push(Array.from(e));
    })
    queuePrint.push(Array.from(tempQ));
    if (!Object.keys(exec).includes(e)) {
      exec[e] = 0;
    }
    exec[e] += 1;
    if (cur == q[e] && exec[e] < temp.find((el) => el.name == e).service) {
      if (level >= quece.length - 1) {
        quece.push([e]);
      } else {
        quece[level + 1].push(e);
      }
    }
    if (cur == q[e] || exec[e] == temp.find((el) => el.name == e).service) {
      cur = 0;
      quece[level].shift();
      q[e] *= 2;
    } 
  }
  tempQ =[];
  quece.map(e=>{
    tempQ.push(Array.from(e));
  })
  queuePrint.push(Array.from(tempQ));
  console.log(`Feedback (q=2^i): \t\t\t` + ans);
  getReport(data, ans);
  queuePrint.map((el,index)=>{
    console.log(index,":",el);
  })
};

const main = () => {
  fcfs();
  roundRobin(1);
  spn();
  srt();
  hrrn();
  feedbackN(1);
  feedback2i();
};
main();
