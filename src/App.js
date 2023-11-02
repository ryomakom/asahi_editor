import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [charsPerLine, setCharsPerLine] = useState(12);
  const [formattedLines, setFormattedLines] = useState([]);
  const [firstCharCount, setFirstCharCount] = useState(0);
  const [compressionMode, setCompressionMode] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const toggleCompressionMode = () => {
    setCompressionMode(!compressionMode);
  };

  const formatOutput = () => {
    const forbiddenChars1 = ['（', '【', '〈', '「', '『', '｛', '《', '［', '“', '‘'];
    const forbiddenChars2 = ['、', '。', '，', '）', '】', '〉', '」', '』', '｝', '》', '］', '”', '’'];
    const compressibleChars = ['・'];

    const words = input.split('');
    let output = [];
    let currentLine = '';
    let specialCharCount = 0;
    let i = 0;

    while (i < words.length) {
      if (words[i] === '\n') {
        output.push(currentLine);
        currentLine = '';
        specialCharCount = 0;
        i++;
        continue;
      }

      if (!compressionMode) {
        currentLine += words[i];
        specialCharCount += 1;

        if (specialCharCount >= charsPerLine) {
          if (forbiddenChars2.includes(words[i + 1]) || forbiddenChars1.includes(words[i])) {
            output.push(currentLine.slice(0, -1));
            i--;
          } else {
            output.push(currentLine);
          }
          currentLine = '';
          specialCharCount = 0;
        }
      } else {
        const charCount = forbiddenChars1.includes(words[i]) || forbiddenChars2.includes(words[i]) || compressibleChars.includes(words[i])? 0.5 : 1;
        currentLine += words[i];
        specialCharCount += charCount;

        if (specialCharCount >= charsPerLine + 0.5) {
          if (forbiddenChars2.includes(words[i]) || forbiddenChars1.includes(words[i-1])) {
            output.push(currentLine.slice(0, -2));
            i = i - 2;
          } else {
            output.push(currentLine.slice(0, -1));
            i = i - 1;
          }
          currentLine = '';
          specialCharCount = 0;
        }
      }

      i++;
    }

    if (currentLine) output.push(currentLine);

    let count = 0;
    output.forEach(line => {
      if (line.length > 0) {
        count++;
      }
    });
    setFirstCharCount(count);

    return output;
  };

  useEffect(() => {
    setFormattedLines(formatOutput());
  }, [input, charsPerLine, compressionMode]);

  return (
    <div className="App">
      <h1>朝日新聞記事編集ソフトエミュレーター</h1>
      <div className="controls">
  <button onClick={toggleCompressionMode}>
    圧縮モード {compressionMode ? 'オン' : 'オフ'}
  </button>
  <span className="compressionModeNote">オンにすると、句読点やカッコなどを0.5文字分として扱い、行数を最小にできます</span>
  <label>
    1行当たりの文字数:
    <select value={charsPerLine} onChange={(e) => setCharsPerLine(Number(e.target.value))}>
      {[...Array(21).keys()].slice(5).map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </label>
</div>

      <div className="editor">
        <div className="inputSection">
          <label>こちらに入力を</label>
          <textarea value={input} onChange={handleInputChange} />
        </div>
        <div className="outputSection">
          <div className="outputLabel">紙面ではこうなる（{firstCharCount}行）</div>
          <div className="outputContainer">
            <div className="lineNumbers">
              {formattedLines.map((_, index) => (
                <div key={index} className="lineNumberItem">{(index + 1) % 5 === 0 ? index + 1 : ''}</div>
              ))}
            </div>
            <div className="outputDisplay">
              {formattedLines.map((line, index) => <p key={index}>{line}</p>)}
            </div>
          </div>
        </div>
      </div>
      <div className="author">
        <div>朝日新聞デジタル企画報道部　小宮山亮磨 @ryomakom</div>
      </div>
    </div>
  );
}

export default App;
