import { Graphics } from 'pixi.js'
import { contourDensity, extent } from 'd3'

const color = 0x000000
const width = .4
const cellSize = 1
const bandwidth = 20
const thresholds = 12

export default data => {

    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'contours'
    stage.alpha = 1
    s.viewport.addChild(stage)

    const density = contourDensity()
        .x(d => d[0])
        .y(d => d[1])
        .weight(d => {
            // console.log(d[2])
            return d[2]})
        .size([window.innerWidth, window.innerHeight])
        .cellSize(cellSize)
        .bandwidth(bandwidth)
        .thresholds(thresholds)
        (data.filter(el => el[3].charAt(0) === el[3].charAt(0).toUpperCase())) // Keep nodes

    stage.lineStyle(width, color)

    density.forEach(layer => {
        layer.coordinates.forEach(array => {
            array.forEach(array => {
                array.forEach(([x, y], i) => {
                    if (i == 0) stage.moveTo(x, y)
                    stage.lineTo(x, y)
                })
            })
        })
    })

    stage.closePath()

}