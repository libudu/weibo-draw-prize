import { Button, Input, message, Modal } from 'antd'
import { useState } from 'react'
import Box, { BORDER } from './Box'

let inputText = ''

const ROW_COUNT = 5

function App() {
  const [showInputModal, setShowInputModal] = useState(false)
  /** 抽奖列表 */
  const [nameList, setNameList] = useState<string[]>([])
  /** 是否能开始抽卡 */
  const [canDraw, setCanDraw] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const [openCardList, setOpenCardList] = useState<number[]>([])

  // 每行名字
  const rowList: string[][] = []
  // 当前没有名单则用黑框代替
  const templateList =
    nameList.length > 1 ? nameList : Array(ROW_COUNT * 3).fill(null)
  for (let i = 0; i < templateList.length; i += ROW_COUNT) {
    rowList.push(templateList.slice(i, i + ROW_COUNT))
  }

  return (
    <div className="w-screen flex justify-center p-20">
      <div className="flex flex-col items-center">
        <div className="text-4xl mb-8">“🍊🐈不用充会员” 抽奖系统</div>
        <div style={{ borderTop: BORDER, borderLeft: BORDER }}>
          {rowList.map((row, i) => (
            <div
              className="flex"
              key={i}
            >
              {row.map((name, j) => (
                <Box
                  key={j}
                  open={canDraw || openCardList.includes(i * ROW_COUNT + j)}
                  name={name}
                  canHover={canHover}
                  onClick={() => {
                    const index = i * ROW_COUNT + j
                    // 点击盖卡，翻开
                    if (!canDraw && canHover) {
                      setOpenCardList([...openCardList, index])
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <Button
            type="primary"
            size="large"
            onClick={() => setShowInputModal(true)}
          >
            导入
          </Button>
          <Button
            type="primary"
            size="large"
            disabled={nameList.length < 1}
            onClick={() => {
              setOpenCardList([])
              setCanHover(true)
              setNameList(nameList.sort(() => Math.random() - 0.5))
              setCanDraw(false)
            }}
          >
            开始
          </Button>
        </div>
        <Modal
          title="填写抽奖名单，每个名称一行"
          open={showInputModal}
          onCancel={() => setShowInputModal(false)}
          onOk={() => {
            setCanDraw(false)
            const lineList = inputText.split('\n').filter((l) => l)
            if (lineList.length <= 1) {
              message.info('抽奖名单至少需要2条，无法抽奖')
            } else {
              setShowInputModal(false)
              setCanHover(true)
              setNameList(lineList)
              // 预览所有卡片
              setOpenCardList(
                Array(lineList.length)
                  .fill(1)
                  .map((_, index) => index)
              )
            }
          }}
        >
          <Input.TextArea
            rows={20}
            onChange={(e) => (inputText = e.target.value)}
          ></Input.TextArea>
        </Modal>
      </div>
    </div>
  )
}

export default App
