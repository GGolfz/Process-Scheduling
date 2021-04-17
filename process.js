const data = [
  {
    name: "A",
    arrive: 0,
    service: 5,
  },
  {
    name: "B",
    arrive: 0,
    service: 4,
  },
  {
    name: "C",
    arrive: 3,
    service: 6,
  },
  {
    name: "D",
    arrive: 5,
    service: 2,
  },
  {
    name: "E",
    arrive: 9,
    service: 3,
  },
  {
    name: "F",
    arrive: 10,
    service: 1,
  },
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
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        come.push(temp[j].name);
        if (come.length >= 2 && i > 0) {
          let t = come[come.length - 2];
          come[come.length - 2] = come[come.length - 1];
          come[come.length - 1] = t;
        }
      }
    }
    if (come.length > 0) {
      if (!Object.keys(execute).includes(come[0])) {
        execute[come[0]] = 1;
        ans += come[0];
        exe += 1;
        if (exe == q) {
          come.push(come[0]);
          exe = 0;
          come.shift();
        }
      } else {
        if (execute[come[0]] < temp.find((e) => e.name == come[0]).service) {
          execute[come[0]] += 1;
          ans += come[0];
          exe += 1;
          if (exe == q) {
            come.push(come[0]);
            exe = 0;
            come.shift();
          }
        } else {
          come.shift();
          i -= 1;
        }
      }
    }
  }
  console.log(`Round Robin (q = ${q}): \t\t` + ans);
  getReport(data, ans);
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
        exeList.push(temp[j]);
      }
    }
    curE = exeList.sort((a, b) => a.service - b.service);
    ans += curE[0].name;
    let ind = temp.findIndex((e) => e.name == curE[0].name);
    temp[ind].service -= 1;
  }
  console.log("Shortest Remained Time: \t" + ans);
  getReport(data, ans);
};

const hrrn = () => {
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
      let maxInd = 0;
      for (let j = 0; j < exeList.length; j++) {
        let ratio = (i - exeList[j].arrive) / exeList[j].service;
        let maxRatio = (i - exeList[maxInd].arrive) / exeList[maxInd].service;
        if (ratio > maxRatio) {
          maxInd = j;
        }
      }
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
};
const feedbackN = (q) => {
  let quece = [[]];
  let temp = getSortArrival();
  let exec = {};
  let ans = "";
  let cur = 0;
  let e;
  let level = 0;
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        quece[0].push(temp[j].name);
      }
    }
    cur += 1;
    for (let i = 0; i < quece.length; i++) {
      if (quece[i].length > 0) {
        if(!e || cur == 1){
          e = quece[i][0];
          level = i;
        }
        break;
      }
    }
    ans += e;
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
  console.log(`Feedback (q=${q}): \t\t` + ans);
  getReport(data, ans);
};
const feedback2i = () => {
  let quece = [[]];
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
  for (let i = 0; i < getSumTime(); i++) {
    for (let j = 0; j < temp.length; j++) {
      if (temp[j].arrive == i) {
        quece[0].push(temp[j].name);
      }
    }
    cur += 1;
    for (let i = 0; i < quece.length; i++) {
      if (quece[i].length > 0) {
        if(!e || cur == 1){
          e = quece[i][0];
          level = i;
        }
        break;
      }
    }
    ans += e;
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
  console.log(`Feedback (q=2^i): \t\t` + ans);
  getReport(data, ans);
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
