import { BitmapText, Graphics } from 'pixi.js'
import { group, mean, polygonHull, polygonCentroid } from 'd3'
import { average, parse, parseColorSyntax, rgb, formatHex } from 'culori'

const width = .6
const cellSize = 1
const bandwidth = 10
const thresholds = 10

export default entities => {

    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'clusters'
    stage.alpha = 1
    s.viewport.addChild(stage)

    const clusters = group(entities, e => e['cluster'])

    clusters.forEach(cluster => {

        if (cluster[0]['cluster'] === '-1')
            return // Romove no clustered entities

        const coordinates = cluster.map(e => [e.x, e.y])
        const slope = mean(cluster.map(e => e.slope))

        const colors = cluster.map(e => rgb(e['color']))
        let colorRGB = average(colors, 'rgb')
        let colorHex = formatHex(colorRGB)

        const polygon = polygonHull(coordinates)
        const center = polygonCentroid(polygon)
        
        // stage.lineStyle(.2, 0xFFFFFF)
        // stage.beginFill('0x' + colorHex.substring(1), 1)
        // stage.alpha = .5
        // polygon.forEach((p, i) => (i == 0) ? stage.moveTo(p[0], p[1]) : stage.lineTo(p[0], p[1]))
        // stage.closePath()

        // console.log(slope)

        const text = new BitmapText(
            (slope > 0) ? 'H' : 'L',
            {
                fontName: 'Lato',
                fontSize: 20,
                align: 'center',
                // tint: 0x999999,
                tint: '0x' + colorHex.substring(1),
            })
        text.position.set(center[0] - text.width, center[1] - text.height)
        stage.addChild(text)


    })


}