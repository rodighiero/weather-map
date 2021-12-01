import { Graphics } from 'pixi.js'
import { contourDensity, group, reverse } from 'd3'

let color
// color = 0xccc6a3 // Beige
// color = 0x000000 // Black
// color = 0xFFF69B // Butter
color = 0x95bce5 // Lighter Blue
// color = 0x8ab6e6 // Background Blue

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
    console.log(clusters)

    clusters.forEach(cluster => {
        if (cluster['cluster'] !== '-1') {

            cluster = cluster.filter(e => e['type'] != 'subject')

            const density = contourDensity()
                .x(e => e['x'])
                .y(e => e['y'])
                .weight(1) // All the same values
                // .weight(d => d[2] * 100) // Occurrences
                .size([window.innerWidth, window.innerHeight])
                .cellSize(cellSize)
                .bandwidth(bandwidth)
                .thresholds(thresholds)
                (cluster) // Keep nodes

            stage.beginFill(color, 1)
            stage.lineStyle(width, 0x5c9ee5)

            density.reverse() // reverse is to hide inner contours
                .forEach(layer => {
                    layer.coordinates.forEach((array, index) => {
                        array[0].forEach(([x, y], i) => {
                            if (i == 0)
                                stage.moveTo(x, y)
                            stage.lineTo(x, y)
                        })
                    })
                })

            stage.closePath()
            stage.endFill()
        }

    })


}