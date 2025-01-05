import { Button, Input, InputNumber, message, Modal } from 'antd'
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
  /** 设置抽奖次数 */
  const [drawCount, setDrawCount] = useState(0)
  /** 剩余抽奖次数 */
  const [leftDrawCount, setLeftDrawCount] = useState(0)
  /** 已经抽到的卡片列表 */
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
              {row.map((name, j) =>
                canDraw && i * ROW_COUNT + j >= drawCount ? null : (
                  <Box
                    key={j}
                    open={openCardList.includes(i * ROW_COUNT + j)}
                    name={name}
                    canHover={canDraw}
                    onClick={() => {
                      const index = i * ROW_COUNT + j
                      // 点击盖卡，翻开
                      if (canDraw && leftDrawCount > 0) {
                        setOpenCardList([...openCardList, index])
                        setLeftDrawCount(leftDrawCount - 1)
                      }
                    }}
                  />
                )
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col mt-8 gap-4 text-xl">
          <div>
            1.
            <Button
              className="ml-4 w-28"
              type="primary"
              size="large"
              onClick={() => setShowInputModal(true)}
            >
              导入
            </Button>
          </div>
          <div className="flex items-center">
            2.
            <div className="ml-4">设置抽奖次数：</div>
            <InputNumber
              disabled={nameList.length === 0}
              min={1}
              max={nameList.length - 1}
              onChange={(val) => val && setDrawCount(val)}
            />
          </div>
          <div>
            3.
            <Button
              className="ml-4 w-28"
              type="primary"
              size="large"
              // 抽奖项太少不能开始
              disabled={nameList.length < 1}
              onClick={() => {
                // 还未开始则开始抽奖
                if (!canDraw) {
                  setOpenCardList([])
                  setNameList(nameList.sort(() => Math.random() - 0.5))
                  setLeftDrawCount(drawCount)
                  setCanDraw(true)
                }
                // 所有卡片抽完，重置进入预览
                if (canDraw && !leftDrawCount) {
                  setCanDraw(false)
                  setOpenCardList(
                    Array(nameList.length)
                      .fill(1)
                      .map((_, index) => index)
                  )
                }
              }}
            >
              {!canDraw && '开始抽奖'}
              {canDraw && !!leftDrawCount && `剩余次数：${leftDrawCount}`}
              {canDraw && !leftDrawCount && '重置'}
            </Button>
          </div>
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
