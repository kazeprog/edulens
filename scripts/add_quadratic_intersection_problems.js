const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'lib', 'data', 'mathtap', 'math-problems.json');

const grade = "数Ⅰ";
const unit1 = "2次関数のグラフとx軸の共有点";
const unit2 = "文字係数の放物線とx軸の共有点";

const data1 = [
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=x^2-3x-4$\n② $y=x^2-4x+4$\n③ $y=x^2-x+1$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(4,0),(-1,0), ②(2,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=2x^2+5x-3$\n② $y=4x^2+4x+1$\n③ $y=2x^2+3x+2$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①($\\frac{1}{2}$,0),(-3,0), ②(-$\\frac{1}{2}$,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=3x^2-2x-1$\n② $y=-x^2+6x-9$\n③ $y=x^2+2x+5$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(1,0),(-$\\frac{1}{3}$,0), ②(3,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=x^2+x-6$\n② $y=9x^2-12x+4$\n③ $y=3x^2-x+1$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(2,0),(-3,0), ②($\\frac{2}{3}$,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=2x^2-7x+3$\n② $y=x^2+10x+25$\n③ $y=x^2+x+2$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(3,0),($\\frac{1}{2}$,0), ②(-5,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=x^2-5x+4$\n② $y=4x^2-20x+25$\n③ $y=2x^2-2x+1$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(4,0),(1,0), ②($\\frac{5}{2}$,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=2x^2+x-1$\n② $y=-x^2+2x-1$\n③ $y=x^2+3x+4$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①($\\frac{1}{2}$,0),(-1,0), ②(1,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=3x^2-4x+1$\n② $y=x^2-8x+16$\n③ $y=x^2+x+1$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(1,0),($\\frac{1}{3}$,0), ②(4,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=x^2-x-2$\n② $y=16x^2+8x+1$\n③ $y=2x^2-3x+5$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(2,0),(-1,0), ②(-$\\frac{1}{4}$,0)"
    },
    {
        q: "次の ①～③ の 2次関数のグラフについて，共有点の個数を求めよ。\n① $y=x^2+2x-8$\n② $y=4x^2+12x+9$\n③ $y=x^2-2x+3$",
        a: "①2個, ②1個, ③0個\n共有点の座標：①(2,0),(-4,0), ②(-$\\frac{3}{2}$,0)"
    }
];

const data2 = [
    {
        q: "$k$ は定数とする。放物線 $y=x^2-4x+k+3$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=1-k$ より\n$k<1$ のとき 2個\n$k=1$ のとき 1個\n$k>1$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2+2x-k+5$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=k-4$ より\n$k>4$ のとき 2個\n$k=4$ のとき 1個\n$k<4$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2-6x+2k+1$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=8-2k$ より\n$k<4$ のとき 2個\n$k=4$ のとき 1個\n$k>4$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2+4x+3k-5$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=9-3k$ より\n$k<3$ のとき 2個\n$k=3$ のとき 1個\n$k>3$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2-2x-k-6$ と $x$ 軸의共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=k+7$ より\n$k>-7$ のとき 2個\n$k=-7$ のとき 1個\n$k<-7$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2+8x+2k+12$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=4-2k$ より\n$k<2$ のとき 2個\n$k=2$ のとき 1個\n$k>2$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2-10x+5k+5$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=20-5k$ より\n$k<4$ のとき 2個\n$k=4$ のとき 1個\n$k>4$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2+2x-4k-7$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=4k+8$ より\n$k>-2$ のとき 2個\n$k=-2$ のとき 1個\n$k<-2$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2-4x+2k-10$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=14-2k$ より\n$k<7$ のとき 2個\n$k=7$ のとき 1個\n$k>7$ のとき 0個"
    },
    {
        q: "$k$ は定数とする。放物線 $y=x^2+6x-3k+12$ と $x$ 軸の共有点の個数を、$k$ の値によって場合分けをして求めよ。",
        a: "$D/4=3k-3$ より\n$k>1$ のとき 2個\n$k=1$ のとき 1個\n$k<1$ のとき 0個"
    }
];

const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded existing JSON with ${existingJson.length} problems.`);
let lastProblemNumber = existingJson.length > 0 ? Math.max(...existingJson.map(p => p.problem_number)) : 0;

const newProblems = [];

function addProbs(data, unit) {
    for (const p of data) {
        const exists = existingJson.some(ex => ex.question === p.q && ex.unit === unit);
        if (!exists) {
            lastProblemNumber++;
            newProblems.push({
                grade: grade,
                unit: unit,
                problem_number: lastProblemNumber,
                question: p.q,
                answer: p.a
            });
        }
    }
}

addProbs(data1, unit1);
addProbs(data2, unit2);

if (newProblems.length > 0) {
    const updatedJson = [...existingJson, ...newProblems];
    fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 4), 'utf8');
    console.log(`Added ${newProblems.length} problems to ${jsonPath}`);
} else {
    console.log("No new problems to add.");
}
