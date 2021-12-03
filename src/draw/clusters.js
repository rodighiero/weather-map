import { Graphics } from 'pixi.js'
import { contourDensity, group, polygonHull, polygonCentroid } from 'd3'
import { average, parse, parseColorSyntax, rgb, formatHex } from 'culori'

const width = .6
const cellSize = 1
const bandwidth = 10
const thresholds = 10

export default entities => {

    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'contours_islands'
    stage.alpha = 1
    s.viewport.addChild(stage)

    const clusters = group(entities, e => e['cluster'])

    clusters.forEach(cluster => {

        if (cluster[0]['cluster'] === '-1')
            return // Romove no clustered entities

        const coordinates = cluster.map(e => [e.x, e.y])

        const colors = cluster.map(e => rgb(e['color']))
        let colorRGB = average(colors, 'rgb')
        let colorHex = formatHex(colorRGB)

        const polygon = polygonHull(coordinates)
        stage.lineStyle(.2, 0xFFFFFF)
        stage.beginFill('0x' + colorHex.substring(1), 1)
        polygon.forEach((p, i) => (i == 0) ? stage.moveTo(p[0], p[1]) : stage.lineTo(p[0], p[1]))
        stage.closePath()
        const center = polygonCentroid(polygon)

        // const density = contourDensity()
        //     .x(e => e['x'])
        //     .y(e => e['y'])
        //     .weight(1) // All the same values
        //     // .weight(d => d[2] * 100) // Occurrences
        //     .size([window.innerWidth, window.innerHeight])
        //     .cellSize(cellSize)
        //     .bandwidth(bandwidth)
        //     .thresholds(thresholds)
        //     (cluster) // Keep nodes

        // stage.beginFill(0xf8f8f8, 1)
        // stage.lineStyle(width, 0xDDDDDD)

        // density.reverse() // reverse is to hide inner contours
        //     .forEach(layer => {
        //         layer.coordinates.forEach((array, index) => {
        //             array[0].forEach(([x, y], i) => {
        //                 if (i == 0)
        //                     stage.moveTo(x, y)
        //                 stage.lineTo(x, y)
        //             })
        //         })
        //     })

        // stage.closePath()
        // stage.endFill()


    })


}