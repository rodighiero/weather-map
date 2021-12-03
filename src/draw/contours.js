import { Graphics } from 'pixi.js'
import { contourDensity, extent } from 'd3'

// const color = 0x0000FF // Blue
const color = 0x999999 // Black
const width = .5
const cellSize = 5
const bandwidth = 50 // Detail
const thresholds = 30

export default entities => {

    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'contour'
    stage.alpha = .5
    s.viewport.addChild(stage)

    const density = contourDensity()
        .x(e => e['x'])
        .y(e => e['y'])
        // .weight(e => e['frequency'])
        .weight(e => Math. abs(e['slope']))
        .size([window.innerWidth, window.innerHeight])
        .cellSize(cellSize)
        .bandwidth(bandwidth)
        .thresholds(thresholds)
        (entities.filter(e => e['type'] == 'person' || e['type'] == 'org'))

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