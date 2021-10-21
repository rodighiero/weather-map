import { Graphics } from 'pixi.js'
import { contourDensity, extent } from 'd3'

// const color = 0x0000FF // Blue
const color = 0x000000 // Black
const width = .5
const cellSize = 1
const bandwidth = 20
const thresholds = 12

export default data => {

    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'contours_negative'
    stage.alpha = 1
    s.viewport.addChild(stage)

    const density = contourDensity()
        .x(d => d[0])
        .y(d => d[1])
        // .weight(d => d[2]) // Occurrence
        // .weight(d => d[4]) // Positive regression
        .weight(d => -d[4]) // negative regression
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