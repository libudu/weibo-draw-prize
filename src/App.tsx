import { Button, Input, message, Modal } from 'antd';
import { useState } from 'react';
import Box, { BORDER } from './Box';

let inputText = '';

const getRandomResult = (nameList: string[], total: number) => {
  const result: Record<string, number> = {};
  nameList.forEach((name) => result[name] = 0);
  for(let i = 0; i < total; i += 1) {
    const r = Math.floor(Math.random() * nameList.length);
    const name = nameList[r];
    result[name] += 1;
  }
  return result;
}


const ROW_COUNT = 5;

function App() {
  const [showInputModal, setShowInputModal] = useState(false);
  const [nameList, setNameList] = useState<string[]>([]);
  const [countMap, setCountMap] = useState<Record<string, number>>({});
  const [enable, setEnable] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [selectCard, setSelectCard] = useState<number | null>(null);

  // 每行名字
  const rowList: string[][] = [];
  // 当前没有名单则用黑框代替
  const templateList = nameList.length > 1 ? nameList : Array(ROW_COUNT * 3).fill(null);
  for(let i = 0; i < templateList.length; i += ROW_COUNT) {
    rowList.push(templateList.slice(i, i + ROW_COUNT));
  }

  const startRandom = (total: number) => {
    setEnable(false);
    setTimeout(() => {
      const result = getRandomResult(nameList, total);
      setCountMap(result);
      setEnable(true);
    }, 0);
  };

  return (
    <div className="w-screen flex justify-center p-20">
      <div className="flex flex-col items-center" style={{ width: 400 }}>
        <div className="text-4xl mb-8">🉑🉑🐯抽奖系统</div>
        <div style={{ borderTop: BORDER, borderLeft: BORDER }}>
          {
            rowList.map((row, i) => <div className="flex" key={i}>
              {
                row.map((name, j) => <Box
                  key={j}
                  enable={enable || (i * ROW_COUNT + j) == selectCard }
                  name={name}
                  count={countMap[name] || 0}
                  delay={(i * ROW_COUNT + j) == selectCard ? 0 : i * 0.5 * ROW_COUNT + j * 0.5}
                  canHover={canHover}
                  onClick={() => {
                    const index = i * ROW_COUNT + j;
                    // 点击盖卡，翻开
                    if(!enable && canHover) {
                      if(countMap[name]) {
                        countMap[name] += 1;
                      } else {
                        countMap[name] = 1;
                      }
                      setSelectCard(index);
                      setCanHover(false);
                    }
                    // 点击已选择的卡，重置
                    if(index == selectCard) {
                      setSelectCard(null);
                      setCanHover(true);
                      setNameList(nameList.sort(() => Math.random() - 0.5));
                    }
                  }}
                />)
              }
            </div>)
          }
        </div>
        <div className="flex justify-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={() => setShowInputModal(true)}
          >
            导入名单
          </Button>
          <Button
            className="ml-4"
            type="primary"
            size="large"
            disabled={nameList.length < 1}
            onClick={() => {
              setSelectCard(null);
              setCanHover(true);
              setNameList(nameList.sort(() => Math.random() - 0.5));
              setCountMap({});
              setEnable(false);
            }}
          >
            重置
          </Button>
          <Button
            className="ml-8"
            type="primary"
            size="large"
            disabled={nameList.length < 1}
            onClick={() => startRandom(10)}
          >
            抽10次
          </Button>
          <Button
            className="ml-4"
            type="primary"
            size="large"
            disabled={nameList.length < 1}
            onClick={() => startRandom(100)}
          >
            抽100次
          </Button>
        </div>
        <Modal
          title="填写抽奖名单，每个名称一行"
          visible={showInputModal}
          onCancel={() => setShowInputModal(false)}
          onOk={() => {
            setEnable(false);
            const lineList = inputText.split('\n').filter(l => l);
            if(lineList.length <= 1) {
              message.info("抽奖名单至少需要2条，无法抽奖")
            } else {
              lineList.sort(() => Math.random() - 0.5)
              setNameList(lineList);
              setShowInputModal(false);
              setCanHover(true);
            }
          }}
        >
          <Input.TextArea rows={8} onChange={(e) => inputText = e.target.value}></Input.TextArea>
        </Modal>
      </div>
    </div>
  )
}

export default App
