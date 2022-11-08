const nodeStartButton1 = document.createElement('button')
nodeStartButton1.innerText = 'start animate 1'

const nodeStartButton2 = document.createElement('button')
nodeStartButton2.innerText = 'start animate 2'

const nodeStartButton3 = document.createElement('button')
nodeStartButton3.innerText = 'start animate 3'

const nodeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
nodeSvg.setAttribute('width', '700')
nodeSvg.setAttribute('height', '700')

const nodeCircle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
)
nodeCircle.setAttribute('r', '20')
nodeCircle.setAttribute('fill', 'red')
nodeSvg.appendChild(nodeCircle)

document.body.appendChild(nodeStartButton1)
document.body.appendChild(nodeStartButton2)
document.body.appendChild(nodeStartButton3)
document.body.appendChild(nodeSvg)

const getCurrentElapsedTime = (currentTime, startTime) => {
    return currentTime - startTime
}

/**
 * formula: prev x or y + k * (next x or y - prev x or y)
 */
const interpolateXandY = (prevXY, nextXY, duration, elapsedTime) => {
    /**
   * when elapsedTime === duration, return ratio >= 1
   * when elapsedTime < duration, return ratio < 1
   */
    var ratio = elapsedTime / duration
    // k = 0.xx, k less than 0 use k
    ratio = ratio > 0 ? ratio : 0
    // k = 1.xx, k less than 1 use 1
    ratio = ratio > 1 ? 1 : ratio

    // compute x
    const x = prevXY.x + ratio * (nextXY.x - prevXY.x)
    // compute y
    const y = prevXY.y + ratio * (nextXY.y - prevXY.y)

    return { x, y }
}

let starTimestamp, animId, prevXY, nextXY, nodePath
const duration = 5000

const doAnimate = (paramPrev, paramNext) => {
    prevXY = paramPrev
    nextXY = paramNext

    nodePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    nodePath.setAttribute('stroke', 'blue')
    nodePath.setAttribute('stroke-width', '5')
    nodeSvg.appendChild(nodePath)

    starTimestamp = Date.now()
    animId = window.requestAnimationFrame(makeAnimate)
}

const makeAnimate = () => {
    const elapsedTime = getCurrentElapsedTime(Date.now(), starTimestamp)
    const position = interpolateXandY(prevXY, nextXY, duration, elapsedTime)

    nodePath.setAttribute(
        'd',
        'M ' + prevXY.x + ' ' + prevXY.y + ' ' + position.x + ' ' + position.y
    )

    nodeCircle.setAttribute('cx', position.x)
    nodeCircle.setAttribute('cy', position.y)

    if (elapsedTime >= duration) {
        window.cancelAnimationFrame(animId)
        animId = null
        console.log('anim stopped')
        return
    }
    window.requestAnimationFrame(makeAnimate)
}

nodeStartButton1.addEventListener('click', () => {
    console.log('start animation')
    doAnimate({ x: 0, y: 0 }, { x: 100, y: 40 })

    console.log(nodeSvg.getBBox())
})

nodeStartButton2.addEventListener('click', () => {
    console.log('start animation')
    doAnimate({ x: 100, y: 40 }, { x: 300, y: 90 })

    console.log(nodeSvg.getBBox())
})

nodeStartButton3.addEventListener('click', () => {
    console.log('start animation')
    doAnimate({ x: 300, y: 90 }, { x: 100, y: 200 })

    console.log(nodeSvg.getBBox())
})
