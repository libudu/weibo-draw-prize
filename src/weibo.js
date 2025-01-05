/** 微博抽奖脚本，在对应微博控制台中粘贴获取名单 */

;(async () => {
  const [_, userId, postHash] = location.pathname.split('/')
  const postDetailUrl = `https://weibo.com/ajax/statuses/show?id=${postHash}&locale=zh-CN&isGetLongText=true`
  const postDetail = await (await fetch(postDetailUrl)).json()
  const postId = postDetail.id
  let maxPage = 0
  const getRepostNameList = async (page) => {
    const repostUrl = `https://weibo.com/ajax/statuses/repostTimeline?id=${postId}&page=${page}&moduleID=feed&count=20`
    const repostDetail = await (await fetch(repostUrl)).json()
    maxPage = repostDetail.max_page
    const nameList = repostDetail.data.map((item) => item.user.screen_name)
    return nameList
  }
  const nameSet = new Set()
  ;(await getRepostNameList(1)).forEach((name) => nameSet.add(name))
  for (let page = 2; page <= maxPage; page++) {
    ;(await getRepostNameList(page)).forEach((name) => nameSet.add(name))
  }
  console.log([...nameSet.keys()].join('\n'))
})()
